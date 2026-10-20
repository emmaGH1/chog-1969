"use client";
import {useEffect,useRef,useState} from 'react';
import {formatEther,type Address,type Hash} from 'viem';
import {GENESIS_CONTRACT} from '@/lib/monad';
import {parsePending,prepareAwakening,submitAwakening,verifyHolder,walletError,type Choice,type PendingAwakening,type Prepared,type WriteConfig} from '@/lib/awakening';
import {holderAdapter,verifyPendingReceipt,type HolderProvider} from '@/lib/holder-wallet';
import type {MemoryStatus} from '@/lib/nft-dossier';
function provider():HolderProvider {
  const injected=(window as Window & {ethereum?:HolderProvider}).ethereum;
  if(!injected)throw new Error('No injected wallet found. Guest reading needs no wallet.');
  return injected;
}
const storageKey=(tokenId:string)=>`chog1969:pending:${tokenId}`;
export default function HolderAwakening({tokenId,memory,onRefresh}:{tokenId:string;memory:MemoryStatus;onRefresh:()=>Promise<void>}) {
  const [open,setOpen]=useState(false);
  const [config,setConfig]=useState<WriteConfig>({enabled:false,ledger:null});
  const [account,setAccount]=useState<Address|null>(null);
  const [chain,setChain]=useState<number|null>(null);
  const [ownership,setOwnership]=useState('Ownership not checked in this session.');
  const [choice,setChoice]=useState<Choice>(1);
  const [prepared,setPrepared]=useState<Prepared|null>(null);
  const [confirmed,setConfirmed]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('No wallet connected. No transaction has been sent by this session.');
  const [pending,setPending]=useState<PendingAwakening|null>(null);
  const [receiptHash,setReceiptHash]=useState<Hash|null>(null);
  const epoch=useRef(0);
  function invalidate(){epoch.current++;setPrepared(null);setConfirmed(false);setOwnership('Ownership must be checked again.');}
  useEffect(()=>{
    let active=true;
    fetch('/api/awakening-config',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then((c:WriteConfig)=>{
      if(!active)return;
      setConfig(c);
      try{setPending(parsePending(sessionStorage.getItem(storageKey(tokenId)),tokenId,c.ledger));}catch{/* Storage unavailable: in-tab receipt tracking still works. */}
    }).catch(()=>{if(active)setMessage('Write configuration unavailable; read-only mode.');});
    return ()=>{active=false;epoch.current++;};
  },[tokenId]);
  useEffect(()=>{
    if(!open)return;
    let p:HolderProvider;
    try{p=provider();}catch{return;}
    const changed=()=>{
      invalidate();setAccount(null);setChain(null);
      setMessage('Wallet context changed or disconnected. Reconnect and review. Any submitted hash below still needs receipt verification.');
    };
    p.on?.('accountsChanged',changed);p.on?.('chainChanged',changed);p.on?.('disconnect',changed);
    return ()=>{epoch.current++;p.removeListener?.('accountsChanged',changed);p.removeListener?.('chainChanged',changed);p.removeListener?.('disconnect',changed);};
  },[open]);
  async function act(task:(version:number)=>Promise<void>){
    const version=++epoch.current;setBusy(true);setMessage('Checking wallet / chain…');
    try{await task(version);}catch(e){setMessage(walletError(e));setPrepared(null);setConfirmed(false);setOwnership('Ownership verification is not current. Verify again before relying on it.');}finally{setBusy(false);}
  }
  function active(version:number){if(epoch.current!==version)throw new Error('Wallet context changed. Reconnect and review.');}
  async function readConfig(){
    const response=await fetch('/api/awakening-config',{cache:'no-store'});
    if(!response.ok)throw new Error('Write configuration unavailable; no transaction requested.');
    const current:WriteConfig=await response.json();setConfig(current);return current;
  }
  async function syncWallet(){
    // Connection/switch events invalidate old preparation; display a fresh context after the request resolves.
    const c=await holderAdapter(provider()).context();
    setAccount(c.account);setChain(c.chainId);setPrepared(null);setConfirmed(false);
    setMessage(c.chainId===143?'Wallet connected. Verify current ownership before preparing a transaction.':'Wrong network. Switch explicitly to Monad 143.');
  }
  function savePending(value:PendingAwakening){
    setPending(value);
    try{sessionStorage.setItem(storageKey(tokenId),JSON.stringify(value));}catch{setMessage('Transaction submitted, but browser storage is unavailable. Save its hash before closing this page.');}
  }
  async function finishReceipt(hash:Hash){
    setReceiptHash(hash);setPrepared(null);setConfirmed(false);
    setMessage('Receipt event and persisted ledger memory verified. Refreshing the public archive…');
    await onRefresh();
    setMessage('Receipt event and persisted ledger memory verified. Public archive refreshed; ownership can still change.');
  }
  const canPrepare=config.enabled && !!account && chain===143 && memory.status!=='awakened' && !busy && (!pending || !!receiptHash);
  return <section aria-label="Holder awakening" style={{borderTop:'1px solid #605c50',marginTop:'1rem',paddingTop:'1rem',overflowWrap:'anywhere'}}>
    <h3>Holder path · optional wallet</h3>
    <p>Guest reading never needs a wallet. Connecting does not prove ownership or send a transaction.</p>
    <button className="btn" aria-expanded={open} disabled={busy} onClick={()=>setOpen(v=>!v)}>{open?'Close holder controls':'Open holder controls'}</button>
    {open&&<>
      <p><strong>{config.enabled?'Approved write configuration enabled':'Read-only: wallet writes disabled pending explicit deployment approval and real-holder testing'}</strong></p>
      <p>Genesis ERC721: {GENESIS_CONTRACT}<br/>MemoryLedger (separate contract): {config.ledger??'not configured'}</p>
      <button className="btn" disabled={busy} onClick={()=>void act(async()=>{invalidate();await provider().request({method:'eth_requestAccounts'});await syncWallet();})}>Connect wallet</button>
      <p>Active account: {account??'not connected'}<br/>Wallet chain: {chain??'unknown'} (required: Monad 143)</p>
      {account&&chain!==143&&<button className="btn" disabled={busy} onClick={()=>void act(async()=>{
        invalidate();await provider().request({method:'wallet_switchEthereumChain',params:[{chainId:'0x8f'}]});await syncWallet();
      })}>Switch to Monad 143</button>}
      <button className="btn" disabled={!account||chain!==143||busy} onClick={()=>void act(async version=>{
        setOwnership('Checking latest-block ownership…');
        const proof=await verifyHolder(holderAdapter(provider()),BigInt(tokenId));active(version);
        setOwnership(`${proof.isOwner?'Verified owner':'Not the owner'} at Monad block ${proof.blockNumber}: connected ${proof.account}; owner ${proof.owner}.`);
        setMessage(proof.isOwner?'Ownership verified for this read only. Transaction preparation always checks again.':'This wallet cannot awaken this token. Guest reading remains available.');
      })}>Verify current ownership</button>
      <p>{ownership}</p>
      <p>Canonical memory status: <strong>{memory.status}</strong>. Read from the ledger, never restored as success from browser storage.</p>
      <button className="btn" disabled={busy} onClick={()=>void act(async()=>{await onRefresh();setMessage('Public memory status refreshed from chain.');})}>Refresh memory status</button>
      <label htmlFor="memory-choice">Permanent token-inherited choice</label>{' '}
      <select id="memory-choice" disabled={!config.enabled||busy||memory.status==='awakened'} value={choice} onChange={e=>{invalidate();setChoice(Number(e.target.value) as Choice);}}>
        <option value={1}>Reveal</option><option value={2}>Protect</option>
      </select>
      <p>This is permanent, has no reset, and follows the NFT after transfer. ERC721 operators cannot awaken.</p>
      <button className="btn" disabled={!canPrepare} onClick={()=>void act(async version=>{
        setPrepared(null);setConfirmed(false);
        const current=await readConfig();
        const review=await prepareAwakening(holderAdapter(provider()),current,BigInt(tokenId),choice);
        active(version);setPrepared(review);setMessage('Latest-block ownership checked and call simulated. Review before any signature.');
      })}>Check owner & simulate</button>
      {prepared&&<div>
        <p>Token {tokenId} · {prepared.choice===1?'Reveal':'Protect'} · Monad 143<br/>Signer: {prepared.account}<br/>Ledger: {prepared.ledger}<br/>Estimated gas: {prepared.gas.toString()} · maximum estimated fee: {formatEther(prepared.gas*prepared.feePerGas)} MON. Wallet fees may vary; no MON is sent as value.</p>
        <label><input type="checkbox" checked={confirmed} disabled={busy} onChange={e=>setConfirmed(e.target.checked)}/> I understand this permanent choice and approve requesting a wallet transaction.</label>
        <button className="btn" disabled={!config.enabled||!confirmed||busy} onClick={()=>void act(async version=>{
          const current=await readConfig();setReceiptHash(null);
          const receipt=await submitAwakening(holderAdapter(provider()),current,prepared,()=>active(version),hash=>{
            setMessage('Transaction submitted; awaiting receipt. Not yet confirmed.');
            savePending({hash,ledger:prepared.ledger,tokenId,account:prepared.account,choice:prepared.choice});
          });
          await finishReceipt(receipt.transactionHash);
        })}>Confirm & request wallet transaction</button>
      </div>}
      <p role="status" aria-live="polite">{message}</p>
      {pending&&<div>
        <p>Submitted transaction (not proof of success): <a className="link" href={`https://monadvision.com/tx/${pending.hash}`} target="_blank" rel="noreferrer">{pending.hash}</a></p>
        <p>Stored recovery hint only. Verify the receipt and ledger again after reload; no wallet connection is needed for this public read.</p>
        <button className="btn" disabled={busy||config.ledger!==pending.ledger} onClick={()=>void act(async()=>{const receipt=await verifyPendingReceipt(pending);await finishReceipt(receipt.transactionHash);})}>Verify submitted receipt</button>
        <button className="btn" disabled={busy} onClick={()=>{
          if(!window.confirm('Forget this browser recovery hint? This does not cancel the transaction. Verify it in the explorer before attempting another.'))return;
          setPending(null);setReceiptHash(null);try{sessionStorage.removeItem(storageKey(tokenId));}catch{/* No stored hint. */}
        }}>Forget recovery hint</button>
      </div>}
      {receiptHash&&<p>Successful receipt and ledger memory: <a className="link" href={`https://monadvision.com/tx/${receiptHash}`} target="_blank" rel="noreferrer">{receiptHash}</a>. Rechecked on Monad; one confirmation can still be reorganized.</p>}
      <p className="muted">Local mock/EVM tests are not mainnet holder proof. Never enter a seed phrase or private key here.</p>
    </>}
  </section>;
}
