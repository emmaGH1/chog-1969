import {decodeEventLog,isAddress,parseAbi,type Address,type Hash,type Log} from 'viem';
import {GENESIS_CONTRACT} from './monad';

export type WriteConfig = {enabled:boolean; ledger:Address|null};
export function writeConfig(env:Record<string,string|undefined>):WriteConfig {
  const ledger=env.MEMORY_LEDGER_ADDRESS;
  const valid=!!ledger && isAddress(ledger) && ledger.toLowerCase()!==GENESIS_CONTRACT && !/^0x0{40}$/i.test(ledger);
  return {enabled:env.MEMORY_WRITES_APPROVED==='true' && valid,ledger:valid?ledger as Address:null};
}
export type Choice = 1|2;
export const AWAKEN_ABI=parseAbi(['function awaken(uint256 tokenId,uint8 choice)','event Awakened(uint256 indexed tokenId,address indexed owner,uint8 choice)']);
export function hasAwakenedEvent(logs:Pick<Log,'address'|'data'|'topics'>[],expected:{address:Address;args:readonly [bigint,number];account:Address}):boolean {
  return logs.some(log=>{
    if(log.address.toLowerCase()!==expected.address.toLowerCase())return false;
    try {
      const event=decodeEventLog({abi:AWAKEN_ABI,eventName:'Awakened',data:log.data,topics:log.topics});
      return event.args.tokenId===expected.args[0] && event.args.choice===expected.args[1] && event.args.owner.toLowerCase()===expected.account.toLowerCase();
    }catch{return false;}
  });
}
export interface AwakeningIO {
  context():Promise<{account:Address;chainId:number}>;
  inspect(ledger:Address,tokenId:bigint):Promise<{owner:Address;genesis:Address;choice:number}>;
  prepare(ledger:Address,tokenId:bigint,choice:Choice,account:Address):Promise<{gas:bigint;feePerGas:bigint;request:unknown}>;
  send(request:unknown):Promise<Hash>;
  receipt(hash:Hash):Promise<{status:string;transactionHash:Hash}>;
}
export type Prepared = {ledger:Address;tokenId:bigint;choice:Choice;account:Address;gas:bigint;feePerGas:bigint};
async function validate(io:AwakeningIO,config:WriteConfig,tokenId:bigint,expected?:Address) {
  if(!config.enabled || !config.ledger) throw new Error('Writes disabled: approved deployment and holder testing are required.');
  const context=await io.context();
  if(context.chainId!==143) throw new Error('Switch your wallet to Monad (143).');
  if(expected && context.account.toLowerCase()!==expected.toLowerCase()) throw new Error('Wallet account changed. Review again.');
  const state=await io.inspect(config.ledger,tokenId);
  if(state.genesis.toLowerCase()!==GENESIS_CONTRACT) throw new Error('Ledger collection mismatch.');
  if(state.owner.toLowerCase()!==context.account.toLowerCase()) throw new Error('Only the current Genesis token owner may awaken.');
  if(state.choice!==0) throw new Error('This token already has a permanent memory.');
  return {account:context.account,ledger:config.ledger};
}
export async function prepareAwakening(io:AwakeningIO,config:WriteConfig,tokenId:bigint,choice:Choice):Promise<Prepared> {
  if(choice!==1 && choice!==2) throw new Error('Invalid choice.');
  const {account,ledger}=await validate(io,config,tokenId);
  const {gas,feePerGas}=await io.prepare(ledger,tokenId,choice,account);
  return {ledger,tokenId,choice,account,gas,feePerGas};
}
export async function submitAwakening(io:AwakeningIO,config:WriteConfig,prepared:Prepared,assertActive:()=>void,onHash:(hash:Hash)=>void) {
  if(config.ledger!==prepared.ledger) throw new Error('Ledger configuration changed. Review again.');
  const {account,ledger}=await validate(io,config,prepared.tokenId,prepared.account);
  const fresh=await io.prepare(ledger,prepared.tokenId,prepared.choice,account);
  if(fresh.gas*fresh.feePerGas>prepared.gas*prepared.feePerGas) throw new Error('Gas estimate increased. Review again.');
  // Recheck wallet context after RPC/simulation, then reject stale UI sessions before prompting a signature.
  const context=await io.context();
  if(context.chainId!==143 || context.account.toLowerCase()!==account.toLowerCase()) throw new Error('Wallet context changed. Review again.');
  assertActive();
  const hash=await io.send(fresh.request);
  onHash(hash); // Preserve evidence even if receipt polling fails or the wallet changes afterwards.
  const receipt=await io.receipt(hash);
  if(receipt.status!=='success') throw new Error('Transaction reverted. No successful awakening is claimed.');
  return receipt;
}
export function walletError(error:unknown):string {
  if(error && typeof error==='object' && 'code' in error) {
    if(error.code===4001) return 'Wallet request rejected. No successful awakening is claimed.';
    if(error.code===4902) return 'Monad is not configured in this wallet. Add chain 143 through a trusted wallet source.';
  }
  return error instanceof Error ? error.message.slice(0,350) : 'Wallet or RPC unavailable. No successful awakening is claimed.';
}
