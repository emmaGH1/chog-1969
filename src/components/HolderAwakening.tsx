"use client";
import {useEffect,useRef,useState} from 'react';
import {createPublicClient,createWalletClient,custom,http,formatEther,type Address,type EIP1193Provider,type Hash} from 'viem';
import {ERC721_READ,GENESIS_CONTRACT,MEMORY_READ,monad} from '@/lib/monad';
import {AWAKEN_ABI as abi,hasAwakenedEvent,prepareAwakening,submitAwakening,walletError,type AwakeningIO,type Choice,type Prepared,type WriteConfig} from '@/lib/awakening';

type Provider=EIP1193Provider & {on?:(event:string,listener:()=>void)=>void;removeListener?:(event:string,listener:()=>void)=>void};
const read=createPublicClient({chain:monad,transport:http('https://rpc.monad.xyz',{timeout:10000,retryCount:1})});
function provider():Provider {
  const injected=(window as Window & {ethereum?:Provider}).ethereum;
  if(!injected) throw new Error('No injected wallet found. Guest reading needs no wallet.');
  return injected;
}
function adapter(p:Provider):AwakeningIO {
  const wallet=createWalletClient({chain:monad,transport:custom(p)});
  let sent:{address:Address;args:readonly [bigint,number];account:Address}|null=null;
  return {
    async context(){
      const accounts=await p.request({method:'eth_accounts'});
      if(!accounts[0]) throw new Error('Connect a wallet on the holder path first.');
      const chain=await p.request({method:'eth_chainId'});
      return {account:accounts[0],chainId:Number(chain)};
    },
    async inspect(ledger,tokenId){
      if(await read.getChainId()!==143) throw new Error('Read RPC is not Monad.');
      const blockNumber=await read.getBlockNumber({cacheTime:0});
      const [owner,genesis,memory]=await Promise.all([
        read.readContract({address:GENESIS_CONTRACT,abi:ERC721_READ,functionName:'ownerOf',args:[tokenId],blockNumber}),
        read.readContract({address:ledger,abi:MEMORY_READ,functionName:'genesis',blockNumber}),
        read.readContract({address:ledger,abi:MEMORY_READ,functionName:'memoryOf',args:[tokenId],blockNumber}),
      ]);
      return {owner,genesis,choice:memory.choice};
    },
    async prepare(ledger,tokenId,choice,account){
      const args={address:ledger,abi,functionName:'awaken' as const,args:[tokenId,choice] as const,account};
      const {request}=await read.simulateContract(args);
      const gas=await read.estimateContractGas(args);
      const fees=await read.estimateFeesPerGas();
      return {gas,feePerGas:fees.maxFeePerGas,request:{...request,gas,maxFeePerGas:fees.maxFeePerGas,maxPriorityFeePerGas:fees.maxPriorityFeePerGas}};
    },
    async send(request){
      sent=request as typeof sent;
      return wallet.writeContract(request as Parameters<typeof wallet.writeContract>[0]);
    },
    async receipt(hash){
      const receipt=await read.waitForTransactionReceipt({hash,confirmations:1,timeout:120000});
      if(receipt.status==='success') {
        const expected=sent;
        const matches=expected && hasAwakenedEvent(receipt.logs,expected);
        if(!matches)throw new Error('Receipt has no matching Awakened event. Replacement or cancellation is not awakening proof; inspect the submitted hash.');
      }
      return receipt;
    },
  };
}
export default function HolderAwakening({tokenId,onRefresh}:{tokenId:string;onRefresh:()=>Promise<void>}) {
  const [open,setOpen]=useState(false);
  const [config,setConfig]=useState<WriteConfig>({enabled:false,ledger:null});
  const [account,setAccount]=useState<Address|null>(null);
  const [chain,setChain]=useState<number|null>(null);
  const [choice,setChoice]=useState<Choice>(1);
  const [prepared,setPrepared]=useState<Prepared|null>(null);
  const [confirmed,setConfirmed]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('No wallet connected. No transaction has been sent by this session.');
  const [hash,setHash]=useState<Hash|null>(null);
  const [receiptHash,setReceiptHash]=useState<Hash|null>(null);
  const epoch=useRef(0);
  useEffect(()=>{
    let active=true;
    fetch('/api/awakening-config',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(c=>{if(active)setConfig(c);}).catch(()=>{if(active)setMessage('Write configuration unavailable; read-only mode.');});
    return ()=>{active=false;epoch.current++;};
  },[]);
  useEffect(()=>{
    if(!open)return;
    let p:Provider;
    try{p=provider();}catch{return;}
    const changed=()=>{
      epoch.current++;setPrepared(null);setConfirmed(false);setAccount(null);setChain(null);
      setMessage('Wallet context changed or disconnected. Reconnect and review. Any submitted hash below still needs receipt verification.');
    };
    p.on?.('accountsChanged',changed);p.on?.('chainChanged',changed);p.on?.('disconnect',changed);
    return ()=>{epoch.current++;p.removeListener?.('accountsChanged',changed);p.removeListener?.('chainChanged',changed);p.removeListener?.('disconnect',changed);};
  },[open]);
  async function act(task:(version:number)=>Promise<void>){
    const version=++epoch.current;setBusy(true);setMessage('Checking wallet / chain…');
    try{await task(version);}catch(e){setMessage(walletError(e));setPrepared(null);setConfirmed(false);}finally{setBusy(false);}
  }
  function active(version:number){if(epoch.current!==version)throw new Error('Wallet context changed. Reconnect and review.');}
  async function connect(version:number){
    const p=provider();await p.request({method:'eth_requestAccounts'});
    // Wallet events caused by connection invalidate older prepared state; read current context afresh.
    const c=await adapter(p).context();
    if(epoch.current!==version) {setMessage('Wallet changed during connection. Connect again to confirm the active account.');return;}
    setAccount(c.account);setChain(c.chainId);setPrepared(null);setConfirmed(false);
    setMessage(c.chainId===143?'Wallet connected. Ownership is checked afresh during review, not inferred from connection.':'Wrong network. Switch explicitly to Monad 143.');
  }
  return <section aria-label="Holder awakening" style={{borderTop:'1px solid #605c50',marginTop:'1rem',paddingTop:'1rem',overflowWrap:'anywhere'}}>
    <h3>Holder path · optional wallet</h3>
    <p>Guest reading never needs a wallet. Connecting does not prove ownership or send a transaction.</p>
    <button className="btn" aria-expanded={open} disabled={busy} onClick={()=>setOpen(v=>!v)}>{open?'Close holder controls':'Open holder controls'}</button>
    {open&&<>
      <p><strong>{config.enabled?'Approved write configuration enabled':'Read-only: wallet writes disabled pending explicit deployment approval and real-holder testing'}</strong></p>
      <p>Genesis ERC721: {GENESIS_CONTRACT}<br/>MemoryLedger (separate contract): {config.ledger??'not configured'}</p>
      <button className="btn" disabled={busy} onClick={()=>void act(connect)}>Connect wallet</button>
      <p>Active account: {account??'not connected'}<br/>Wallet chain: {chain??'unknown'} (required: Monad 143)</p>
      {account&&chain!==143&&<button className="btn" disabled={busy} onClick={()=>void act(async()=>{
        await provider().request({method:'wallet_switchEthereumChain',params:[{chainId:'0x8f'}]});
        setPrepared(null);setConfirmed(false);setAccount(null);setChain(null);setMessage('Network switch requested. Reconnect to confirm Monad 143.');
      })}>Switch to Monad 143</button>}
      <label htmlFor="memory-choice">Permanent token-inherited choice</label>{' '}
      <select id="memory-choice" disabled={!config.enabled||busy} value={choice} onChange={e=>{epoch.current++;setChoice(Number(e.target.value) as Choice);setPrepared(null);setConfirmed(false);}}>
        <option value={1}>Reveal</option><option value={2}>Protect</option>
      </select>
      <p>This is permanent, has no reset, and follows the NFT after transfer. ERC721 operators cannot awaken.</p>
      <button className="btn" disabled={!config.enabled||!account||chain!==143||busy} onClick={()=>void act(async version=>{
        setPrepared(null);setConfirmed(false);
        const response=await fetch('/api/awakening-config',{cache:'no-store'});if(!response.ok)throw new Error('Configuration unavailable.');
        const current:WriteConfig=await response.json();setConfig(current);
        const review=await prepareAwakening(adapter(provider()),current,BigInt(tokenId),choice);
        active(version);setPrepared(review);setMessage('Latest-block ownership checked and call simulated. Review before any signature.');
      })}>Check owner & simulate</button>
      {prepared&&<div>
        <p>Token {tokenId} · {prepared.choice===1?'Reveal':'Protect'} · Monad 143<br/>Signer: {prepared.account}<br/>Ledger: {prepared.ledger}<br/>Estimated gas: {prepared.gas.toString()} · maximum estimated fee: {formatEther(prepared.gas*prepared.feePerGas)} MON. Wallet fees may vary; no MON is sent as value.</p>
        <label><input type="checkbox" checked={confirmed} disabled={busy} onChange={e=>setConfirmed(e.target.checked)}/> I understand this permanent choice and approve requesting a wallet transaction.</label>
        <button className="btn" disabled={!config.enabled||!confirmed||busy} onClick={()=>void act(async version=>{
          const response=await fetch('/api/awakening-config',{cache:'no-store'});if(!response.ok)throw new Error('Configuration unavailable.');
          const current:WriteConfig=await response.json();setConfig(current);
          setReceiptHash(null);
          const receipt=await submitAwakening(adapter(provider()),current,prepared,()=>active(version),tx=>{setHash(tx);setMessage('Transaction submitted; awaiting receipt. Not yet confirmed.');});
          setReceiptHash(receipt.transactionHash);setPrepared(null);setConfirmed(false);setMessage('Successful onchain receipt confirmed. Refreshing public memory state…');
          await onRefresh();
        })}>Confirm & request wallet transaction</button>
      </div>}
      <p role="status" aria-live="polite">{message}</p>
      {hash&&<p>Submitted transaction (not proof of success): <a className="link" href={`https://monadvision.com/tx/${hash}`} target="_blank" rel="noreferrer">{hash}</a></p>}
      {receiptHash&&<p>Successful receipt: <a className="link" href={`https://monadvision.com/tx/${receiptHash}`} target="_blank" rel="noreferrer">{receiptHash}</a>. Verify the refreshed ledger state and event; a replacement/cancellation receipt alone is not an awakening.</p>}
      <p className="muted">Local mock/EVM tests are not mainnet holder proof. Never enter a seed phrase or private key here.</p>
    </>}
  </section>;
}
