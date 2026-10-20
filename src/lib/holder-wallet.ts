import {createPublicClient,createWalletClient,custom,http,type Address,type EIP1193Provider,type Hash} from 'viem';
import {ERC721_READ,GENESIS_CONTRACT,MEMORY_READ,monad} from './monad';
import {AWAKEN_ABI as abi,hasAwakenedEvent,type AwakeningIO,type PendingAwakening} from './awakening';
export type HolderProvider=EIP1193Provider & {on?:(event:string,listener:()=>void)=>void;removeListener?:(event:string,listener:()=>void)=>void};
const read=createPublicClient({chain:monad,transport:http('https://rpc.monad.xyz',{timeout:10000,retryCount:1})});
export async function verifyPendingReceipt(pending:PendingAwakening) {
  if(await read.getChainId()!==143)throw new Error('Read RPC is not Monad.');
  const receipt=await read.waitForTransactionReceipt({hash:pending.hash,confirmations:1,timeout:120000});
  if(receipt.status!=='success')throw new Error('Transaction reverted. No successful awakening is claimed.');
  const expected={address:pending.ledger,args:[BigInt(pending.tokenId),pending.choice] as const,account:pending.account};
  if(!hasAwakenedEvent(receipt.logs,expected))throw new Error('Receipt has no matching Awakened event. Replacement or cancellation is not awakening proof.');
  const [genesis,memory]=await Promise.all([
    read.readContract({address:pending.ledger,abi:MEMORY_READ,functionName:'genesis',blockNumber:receipt.blockNumber}),
    read.readContract({address:pending.ledger,abi:MEMORY_READ,functionName:'memoryOf',args:[BigInt(pending.tokenId)],blockNumber:receipt.blockNumber}),
  ]);
  if(genesis.toLowerCase()!==GENESIS_CONTRACT || memory.choice!==pending.choice || memory.awakenedBy.toLowerCase()!==pending.account.toLowerCase())throw new Error('Receipt and persisted ledger memory do not match. No verified awakening is claimed.');
  return receipt;
}
export function holderAdapter(p:HolderProvider):AwakeningIO {
  const wallet=createWalletClient({chain:monad,transport:custom(p)});
  let sent:Omit<PendingAwakening,'hash'>|null=null;
  return {
    async context(){
      const accounts=await p.request({method:'eth_accounts'});
      if(!accounts[0])throw new Error('Connect a wallet on the holder path first.');
      const chain=await p.request({method:'eth_chainId'});
      return {account:accounts[0],chainId:Number(chain)};
    },
    async ownership(tokenId){
      if(await read.getChainId()!==143)throw new Error('Read RPC is not Monad.');
      const blockNumber=await read.getBlockNumber({cacheTime:0});
      const owner=await read.readContract({address:GENESIS_CONTRACT,abi:ERC721_READ,functionName:'ownerOf',args:[tokenId],blockNumber});
      return {owner,blockNumber};
    },
    async inspect(ledger,tokenId){
      if(await read.getChainId()!==143)throw new Error('Read RPC is not Monad.');
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
      const tx=request as {address:Address;args:readonly [bigint,1|2];account:Address|{address:Address}};
      sent={ledger:tx.address,tokenId:tx.args[0].toString(),choice:tx.args[1],account:typeof tx.account==='string'?tx.account:tx.account.address};
      return wallet.writeContract(request as Parameters<typeof wallet.writeContract>[0]);
    },
    async receipt(hash:Hash){
      if(!sent)throw new Error('No submitted transaction context.');
      return verifyPendingReceipt({...sent,hash});
    },
  };
}
