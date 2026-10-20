// Mocked injected wallets only. Never connects a real wallet or sends a transaction.
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined,args:['--no-sandbox']});
const base=process.env.STORY_BASE_URL||'http://127.0.0.1:3103';
const dossier={tokenId:'1969',owner:'0x1111111111111111111111111111111111111111',tokenURI:null,chainId:143,collection:'0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763',blockNumber:'1',checkedAt:'2026-10-20T00:00:00Z',metadata:null,metadataWarning:null,metadataSource:null,memory:{status:'not-configured',ledger:null}};
async function open(page){
  await page.route('**/api/nft/1969',route=>route.fulfill({json:dossier}));
  await page.goto(`${base}/archive`);
  await page.getByRole('button',{name:'inspect seal'}).click();
  await page.getByRole('button',{name:'Open holder controls'}).click();
  await page.getByText('Read-only: wallet writes disabled',{exact:false}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Check owner & simulate'}).isDisabled(),true);
}
try {
  for(const width of [375,1280]) {
    const page=await browser.newPage({viewport:{width,height:900},isMobile:width===375,hasTouch:width===375});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await open(page);
    await page.getByRole('button',{name:'Connect wallet',exact:true}).click();
    await page.getByRole('status').filter({hasText:'No injected wallet found'}).waitFor();
    await page.close();
    const mock=await browser.newPage({viewport:{width,height:900}});
    await mock.addInitScript(()=>{
      window.walletCalls=[];window.rejectConnect=false;
      const listeners={};
      window.ethereum={
        on:(event,listener)=>{(listeners[event]??=[]).push(listener);},
        removeListener:(event,listener)=>{listeners[event]=(listeners[event]||[]).filter(l=>l!==listener);},
        request:async({method})=>{
          window.walletCalls.push(method);
          if(method==='eth_requestAccounts'&&window.rejectConnect)throw {code:4001};
          if(method==='eth_accounts'||method==='eth_requestAccounts')return ['0x1111111111111111111111111111111111111111'];
          if(method==='eth_chainId')return '0x1';
          if(method==='wallet_switchEthereumChain')throw {code:4902};
          throw new Error(`Forbidden mock method: ${method}`);
        },
      };
      window.walletDisconnect=()=>{for(const fn of listeners.disconnect||[])fn();};
    });
    await open(mock);
    assert.deepEqual(await mock.evaluate(()=>window.walletCalls),[]);
    await mock.getByRole('button',{name:'Connect wallet',exact:true}).click();
    await mock.getByText('Wallet chain: 1',{exact:false}).waitFor();
    await mock.getByRole('button',{name:'Switch to Monad 143'}).click();
    await mock.getByRole('status').filter({hasText:'Monad is not configured'}).waitFor();
    await mock.evaluate(()=>window.walletDisconnect());
    await mock.getByText('Active account: not connected',{exact:false}).waitFor();
    await mock.evaluate(()=>{window.rejectConnect=true;});
    await mock.getByRole('button',{name:'Connect wallet',exact:true}).click();
    await mock.getByRole('status').filter({hasText:'Wallet request rejected'}).waitFor();
    assert.equal(await mock.getByRole('button',{name:'Check owner & simulate'}).isDisabled(),true);
    assert.equal(await mock.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.equal(await mock.evaluate(()=>window.walletCalls.includes('eth_sendTransaction')),false);
    assert.deepEqual(errors,[]);
    await mock.close();
    console.log(`PASS holder ${width}px: default-off writes, no guest wallet requests, missing provider, wrong chain, unsupported switch, disconnect, rejection, no send`);
  }
}finally{await browser.close();}
