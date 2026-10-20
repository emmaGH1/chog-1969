// Fully mocked wallet/RPC integration. No request may reach the real Monad RPC.
import assert from 'node:assert/strict';
import {encodeAbiParameters,encodeEventTopics,parseAbi,toFunctionSelector,decodeFunctionData} from 'viem';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined,args:['--no-sandbox']});
const base=process.env.STORY_BASE_URL||'http://127.0.0.1:3103';
const owner='0x1111111111111111111111111111111111111111';
const ledger='0x2222222222222222222222222222222222222222';
const genesis='0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763';
const hash='0x'+'a'.repeat(64),blockHash='0x'+'b'.repeat(64),zero='0x'+'0'.repeat(64);
const abi=parseAbi(['function awaken(uint256 tokenId,uint8 choice)','event Awakened(uint256 indexed tokenId,address indexed owner,uint8 choice)']);
const addressResult=value=>encodeAbiParameters([{type:'address'}],[value]);
const memoryResult=choice=>encodeAbiParameters([{type:'tuple',components:[{name:'choice',type:'uint8'},{name:'awakenedBy',type:'address'},{name:'at',type:'uint64'}]}],[{choice,awakenedBy:owner,at:1n}]);
const block={number:'0x2a',hash:blockHash,parentHash:zero,nonce:'0x0000000000000000',sha3Uncles:zero,logsBloom:'0x'+'0'.repeat(512),transactionsRoot:zero,stateRoot:zero,receiptsRoot:zero,miner:owner,difficulty:'0x0',totalDifficulty:'0x0',extraData:'0x',size:'0x100',gasLimit:'0x1c9c380',gasUsed:'0x0',timestamp:'0x1',transactions:[],uncles:[],baseFeePerGas:'0x1'};
try {
  for(const scenario of ['readonly-owner','success','reject','missing-event','memory-mismatch','nonowner','simulation-error']) {
    const page=await browser.newPage({viewport:{width:375,height:900}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    let sends=0,choice=0,simulations=0,receiptReads=0;
    await page.exposeFunction('recordMockSend',tx=>{
      const decoded=decodeFunctionData({abi,data:tx.data});
      assert.equal(tx.to.toLowerCase(),ledger);assert.equal(decoded.args[0],1969n);
      assert.equal(tx.from.toLowerCase(),owner);assert.equal(tx.value??'0x0','0x0');
      sends++;choice=Number(decoded.args[1]);return hash;
    });
    await page.addInitScript(({owner,scenario})=>{
      const listeners={};window.walletCalls=[];
      window.ethereum={
        on:(event,fn)=>{(listeners[event]??=[]).push(fn);},
        removeListener:(event,fn)=>{listeners[event]=(listeners[event]||[]).filter(f=>f!==fn);},
        request:async({method,params})=>{
          window.walletCalls.push(method);
          if(method==='eth_requestAccounts') {for(const fn of listeners.accountsChanged||[])fn([owner]);return [owner];}
          if(method==='eth_accounts')return [owner];
          if(method==='eth_chainId')return '0x8f';
          if(method==='eth_sendTransaction'){
            if(scenario==='reject')throw {code:4001,message:'User rejected'};
            return window.recordMockSend(params[0]);
          }
          throw new Error(`Unexpected wallet method ${method}`);
        },
      };
    },{owner,scenario});
    await page.route('**/api/awakening-config',r=>r.fulfill({json:{enabled:scenario!=='readonly-owner',ledger:scenario==='readonly-owner'?null:ledger}}));
    await page.route('**/api/nft/1969',r=>r.fulfill({json:{tokenId:'1969',owner,tokenURI:null,chainId:143,collection:genesis,blockNumber:'42',checkedAt:'2026-10-20T00:00:00Z',metadata:null,metadataWarning:null,metadataSource:null,memory:choice?{status:'awakened',ledger,choice:choice===1?'Reveal':'Protect',awakenedBy:owner,at:'1'}:{status:'unawakened',ledger}}}));
    await page.route('https://rpc.monad.xyz/**',async route=>{
      const payload=route.request().postDataJSON();
      const respond=call=>{
        let result;
        switch(call.method){
          case 'eth_chainId':result='0x8f';break;
          case 'eth_blockNumber':result='0x2a';break;
          case 'eth_getBlockByNumber':result=block;break;
          case 'eth_maxPriorityFeePerGas':result='0x1';break;
          case 'eth_gasPrice':result='0x2';break;
          case 'eth_estimateGas':result='0x186a0';break;
          case 'eth_call':{
            const data=call.params[0].data;
            if(data.startsWith(toFunctionSelector('ownerOf(uint256)')))result=addressResult(scenario==='nonowner'?ledger:owner);
            else if(data.startsWith(toFunctionSelector('genesis()')))result=addressResult(genesis);
            else if(data.startsWith(toFunctionSelector('memoryOf(uint256)')))result=memoryResult(scenario==='memory-mismatch'?0:choice);
            else if(data.startsWith(toFunctionSelector('awaken(uint256,uint8)'))){
              simulations++;
              if(scenario==='simulation-error')return {id:call.id,jsonrpc:'2.0',error:{code:3,message:'execution reverted'}};
              result='0x';
            }else throw new Error(`Unexpected call ${data}`);
            break;
          }
          case 'eth_getTransactionReceipt':{
            receiptReads++;
            const log={address:ledger,topics:encodeEventTopics({abi,eventName:'Awakened',args:{tokenId:1969n,owner}}),data:encodeAbiParameters([{type:'uint8'}],[choice]),blockNumber:'0x2a',blockHash,transactionHash:hash,transactionIndex:'0x0',logIndex:'0x0',removed:false};
            result={transactionHash:hash,transactionIndex:'0x0',blockHash,blockNumber:'0x2a',from:owner,to:ledger,cumulativeGasUsed:'0x186a0',gasUsed:'0x186a0',contractAddress:null,logs:scenario==='missing-event'?[]:[log],logsBloom:block.logsBloom,status:'0x1',effectiveGasPrice:'0x2',type:'0x2'};
            break;
          }
          default:throw new Error(`Unexpected public RPC method ${call.method}`);
        }
        return {id:call.id,jsonrpc:'2.0',result};
      };
      try {await route.fulfill({json:Array.isArray(payload)?payload.map(respond):respond(payload)});}
      catch(e){errors.push(e.message);await route.abort();}
    });
    await page.goto(`${base}/archive`);
    await page.getByRole('button',{name:'inspect seal'}).click();
    await page.getByRole('button',{name:'Open holder controls'}).click();
    assert.deepEqual(await page.evaluate(()=>window.walletCalls),[]);
    await page.getByRole('button',{name:'Connect wallet',exact:true}).click();
    await page.getByText('Wallet chain: 143',{exact:false}).waitFor();
    await page.getByRole('button',{name:'Verify current ownership'}).click();
    await page.getByText(scenario==='nonowner'?'Not the owner at Monad block 42':'Verified owner at Monad block 42',{exact:false}).waitFor();
    if(scenario==='readonly-owner'){
      assert.equal(await page.getByRole('button',{name:'Check owner & simulate'}).isDisabled(),true);
      assert.equal(sends,0);assert.deepEqual(errors,[]);await page.close();
      console.log('PASS mocked read-only holder: ownership verified with write gate off; zero submissions');continue;
    }
    await page.getByLabel('Permanent token-inherited choice',{exact:true}).selectOption('2');
    await page.getByRole('button',{name:'Check owner & simulate'}).click();
    if(scenario==='nonowner'||scenario==='simulation-error') {
      await page.getByRole('status').filter({hasText:scenario==='nonowner'?'Only the current Genesis token owner':'revert'}).waitFor();
      assert.equal(sends,0);
    } else {
      const confirm=page.getByRole('button',{name:'Confirm & request wallet transaction'});
      await confirm.waitFor();assert.equal(await confirm.isDisabled(),true);assert.equal(sends,0);
      await page.getByRole('checkbox').check();await confirm.click();
      if(scenario==='reject'){
        await page.getByRole('status').filter({hasText:/reject/i}).waitFor();assert.equal(sends,0);
      }else if(scenario==='missing-event'||scenario==='memory-mismatch'){
        await page.getByRole('status').filter({hasText:scenario==='missing-event'?'no matching Awakened event':'persisted ledger memory do not match'}).waitFor();
        assert.equal(await page.getByText('Successful receipt and ledger memory:',{exact:false}).count(),0);
        assert.equal(sends,1);
      }else{
        await page.getByText('Successful receipt and ledger memory:',{exact:false}).waitFor().catch(async e=>{console.error({errors,sends,simulations,receiptReads,status:await page.getByRole('status').allTextContents()});throw e;});
        await page.getByText('Permanent choice:',{exact:false}).waitFor();assert.equal(sends,1);assert.ok(simulations>=2);
        await page.reload();
        await page.getByRole('button',{name:'inspect seal'}).click();
        await page.getByText('Permanent choice:',{exact:false}).waitFor();
        await page.getByRole('button',{name:'Open holder controls'}).click();
        await page.getByRole('button',{name:'Verify submitted receipt'}).click();
        await page.getByText('Successful receipt and ledger memory:',{exact:false}).waitFor();
        assert.deepEqual(await page.evaluate(()=>window.walletCalls),[]);assert.equal(sends,1);assert.ok(receiptReads>=2);
        assert.equal(await page.getByRole('button',{name:'Check owner & simulate'}).isDisabled(),true);
      }
    }
    assert.deepEqual(errors,[]);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.close();
    console.log(`PASS mocked holder flow: ${scenario}; ${sends} mocked submissions, zero real transactions`);
  }
}finally{await browser.close();}
