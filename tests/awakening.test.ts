import {test} from 'node:test';
import assert from 'node:assert/strict';
import {prepareAwakening,submitAwakening,walletError,writeConfig,type AwakeningIO,type WriteConfig} from '../src/lib/awakening';
import {GENESIS_CONTRACT} from '../src/lib/monad';
import type {Address,Hash} from 'viem';
const account='0x1111111111111111111111111111111111111111' as Address;
const ledger='0x2222222222222222222222222222222222222222' as Address;
const hash=('0x'+'a'.repeat(64)) as Hash;
const enabled:WriteConfig={enabled:true,ledger};
function harness(){
  const state={account,chainId:143,owner:account,genesis:GENESIS_CONTRACT as Address,choice:0,gas:BigInt(100),fee:BigInt(2),sends:0,status:'success',simulateError:false,receiptError:false};
  const io:AwakeningIO={
    async context(){return {account:state.account,chainId:state.chainId};},
    async inspect(){return {owner:state.owner,genesis:state.genesis,choice:state.choice};},
    async prepare(){if(state.simulateError)throw new Error('Simulation reverted');return {gas:state.gas,feePerGas:state.fee,request:{}};},
    async send(){state.sends++;return hash;},
    async receipt(){if(state.receiptError)throw new Error('Receipt timeout; transaction may still be pending');return {status:state.status,transactionHash:hash};},
  };
  return {state,io};
}
test('write configuration fails closed without exact explicit approval and separate nonzero ledger',()=>{
  for(const env of [{},{MEMORY_WRITES_APPROVED:'true'},{MEMORY_WRITES_APPROVED:'1',MEMORY_LEDGER_ADDRESS:ledger},{MEMORY_WRITES_APPROVED:'true',MEMORY_LEDGER_ADDRESS:GENESIS_CONTRACT},{MEMORY_WRITES_APPROVED:'true',MEMORY_LEDGER_ADDRESS:'0x'+'0'.repeat(40)}]) assert.equal(writeConfig(env).enabled,false);
  assert.deepEqual(writeConfig({MEMORY_WRITES_APPROVED:'true',MEMORY_LEDGER_ADDRESS:ledger}),enabled);
});
test('disabled gate never even queries a wallet',async()=>{
  const {io,state}=harness();io.context=async()=>{throw new Error('Must not query');};
  await assert.rejects(prepareAwakening(io,{enabled:false,ledger},BigInt(1969),1),/disabled/);assert.equal(state.sends,0);
});
for(const failure of ['network','nonowner','collection','awakened','simulation'] as const) test(`review blocks ${failure}`,async()=>{
  const {io,state}=harness();
  if(failure==='network')state.chainId=1;
  if(failure==='nonowner')state.owner=ledger;
  if(failure==='collection')state.genesis=ledger;
  if(failure==='awakened')state.choice=2;
  if(failure==='simulation')state.simulateError=true;
  await assert.rejects(prepareAwakening(io,enabled,BigInt(1969),1));assert.equal(state.sends,0);
});
for(const change of ['owner','account','chain','memory','gas','session','disabled','ledger'] as const) test(`confirmation revalidates ${change}`,async()=>{
  const {io,state}=harness();const review=await prepareAwakening(io,enabled,BigInt(1969),2);
  if(change==='owner')state.owner=ledger;
  if(change==='account')state.account=ledger;
  if(change==='chain')state.chainId=1;
  if(change==='memory')state.choice=1;
  if(change==='gas')state.fee=BigInt(3);
  const config=change==='disabled'?{...enabled,enabled:false}:change==='ledger'?{...enabled,ledger:account}:enabled;
  await assert.rejects(submitAwakening(io,config,review,()=>{if(change==='session')throw new Error('Stale');},()=>{}));assert.equal(state.sends,0);
});
test('only explicit submit sends, publishes hash and waits for successful receipt',async()=>{
  const {io,state}=harness();const review=await prepareAwakening(io,enabled,BigInt(1969),1);assert.equal(state.sends,0);
  let submitted='';const receipt=await submitAwakening(io,enabled,review,()=>{},h=>{submitted=h;});
  assert.equal(submitted,hash);assert.equal(receipt.status,'success');assert.equal(state.sends,1);
});
for(const failure of ['revert','timeout'] as const) test(`${failure} retains submitted hash without success claim`,async()=>{
  const {io,state}=harness();const review=await prepareAwakening(io,enabled,BigInt(1969),1);
  state.status='reverted';state.receiptError=failure==='timeout';let submitted='';
  await assert.rejects(submitAwakening(io,enabled,review,()=>{},h=>{submitted=h;}));assert.equal(submitted,hash);
});
test('wallet rejection and unsupported-chain errors are explicit',()=>{
  assert.match(walletError({code:4001}),/rejected/);assert.match(walletError({code:4902}),/not configured/);
});
