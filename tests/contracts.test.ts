import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import solc from "solc";
import ganache from "ganache";
import { createPublicClient, createWalletClient, custom, decodeEventLog, decodeErrorResult, encodeFunctionData, parseAbi, type Abi, type Address, type Hex } from "viem";

const mock = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
contract MockGenesis {
 mapping(uint256 => address) public holders;
 mapping(uint256 => address) public approved;
 function approve(uint256 id, address operator) external { require(msg.sender==holders[id]); approved[id]=operator; }
 function mint(uint256 id, address holder) external { require(holders[id]==address(0)); holders[id]=holder; }
 function ownerOf(uint256 id) external view returns(address) { require(holders[id]!=address(0), "nonexistent"); return holders[id]; }
 function transfer(uint256 id, address to) external { require(msg.sender==holders[id]); holders[id]=to; }
}`;

test("MemoryLedger local EVM: owner authorization, permanence and transfer inheritance", async () => {
 const output = JSON.parse(solc.compile(JSON.stringify({language:"Solidity", sources:{"MemoryLedger.sol":{content:readFileSync("contracts/MemoryLedger.sol","utf8")},"MockGenesis.sol":{content:mock}}, settings:{evmVersion:"shanghai",outputSelection:{"*":{"*":["abi","evm.bytecode.object"]}}}})));
 assert.deepEqual((output.errors ?? []).filter((e: {severity:string})=>e.severity==="error"), []);
 const provider = ganache.provider({logging:{quiet:true},chain:{hardfork:"shanghai"},wallet:{totalAccounts:3}});
 const transport = custom(provider);
 const client = createPublicClient({transport});
 const wallet = createWalletClient({transport});
 const [owner, stranger, buyer] = await wallet.getAddresses();
 const artifact = (file:string,name:string) => output.contracts[file][name] as {abi:Abi;evm:{bytecode:{object:string}}};
 async function deploy(file:string,name:string,args:readonly unknown[]=[]) {
  const a=artifact(file,name);
  const hash=await wallet.deployContract({chain:null,account:owner,gas:BigInt(6000000),abi:a.abi,bytecode:`0x${a.evm.bytecode.object}`,args});
  return (await client.waitForTransactionReceipt({hash})).contractAddress!;
 }
 const genesis=await deploy("MockGenesis.sol","MockGenesis");
 const ledger=await deploy("MemoryLedger.sol","MemoryLedger",[genesis]);
 const abi=artifact("MemoryLedger.sol","MemoryLedger").abi;
 const mockAbi=parseAbi(["function mint(uint256,address)","function transfer(uint256,address)","function approve(uint256,address)"]);
 async function write(address:Address, abi:Abi, functionName:string,args:readonly unknown[],account=owner) {
  const hash=await wallet.writeContract({chain:null,address,abi,functionName,args,account,gas:BigInt(500000)});
  const receipt=await client.waitForTransactionReceipt({hash}); assert.equal(receipt.status,"success");return receipt;
 }
 const read = (id:bigint) => client.readContract({address:ledger,abi,functionName:"memoryOf",args:[id]}) as Promise<{choice:number;awakenedBy:Address;at:bigint}>;
 async function rejects(functionName:string,args:readonly unknown[],account=owner,error?:string){
  await assert.rejects(provider.request({method:"eth_call",params:[{from:account,to:ledger,data:encodeFunctionData({abi,functionName,args})},"latest"]}), (e: unknown) => {
   if(error) assert.equal(decodeErrorResult({abi,data:(e as {data:Hex}).data}).errorName,error);
   return true;
  });
 }
 try {
  for (const collection of ["0x0000000000000000000000000000000000000000",stranger]) {
   const a=artifact("MemoryLedger.sol","MemoryLedger");
   await assert.rejects(client.call({account:owner,data:(await import("viem")).encodeDeployData({abi:a.abi,bytecode:`0x${a.evm.bytecode.object}`,args:[collection]})}));
  }
  await write(genesis,mockAbi,"mint",[BigInt(1969),owner]);
  assert.equal((await read(BigInt(1969))).choice,0);
  await write(genesis,mockAbi,"approve",[BigInt(1969),stranger]);
  await rejects("awaken",[BigInt(1969),1],stranger,"NotOwner"); // Even an approved ERC721 operator cannot awaken.
  const rejectedHash=await wallet.writeContract({chain:null,address:ledger,abi,functionName:"awaken",args:[BigInt(1969),1],account:stranger,gas:BigInt(500000)});
  assert.equal((await client.waitForTransactionReceipt({hash:rejectedHash})).status,"reverted");
  assert.equal((await read(BigInt(1969))).choice,0);
  await rejects("awaken",[BigInt(1969),0],owner,"BadChoice");
  await rejects("awaken",[BigInt(1969),3]); // ABI enum decoding rejects out-of-range choices.
  await rejects("awaken",[BigInt(0),1]); // Nonexistent NFT.
  const receipt=await write(ledger,abi,"awaken",[BigInt(1969),1]);
  const event=decodeEventLog({abi,data:receipt.logs[0].data as Hex,topics:receipt.logs[0].topics});
  assert.equal(event.eventName,"Awakened");
  const eventArgs=event.args as unknown as {tokenId:bigint;owner:Address;choice:number};
  assert.equal(eventArgs.tokenId,BigInt(1969));
  assert.equal(eventArgs.owner.toLowerCase(),owner.toLowerCase());
  assert.equal(eventArgs.choice,1);
  const memory=await read(BigInt(1969));
  assert.equal(memory.choice,1); assert.equal(memory.awakenedBy.toLowerCase(),owner.toLowerCase());
  assert.equal(memory.at,(await client.getBlock({blockNumber:receipt.blockNumber})).timestamp);
  await rejects("awaken",[BigInt(1969),2],owner,"AlreadyAwakened");
  await write(genesis,mockAbi,"transfer",[BigInt(1969),buyer]);
  assert.deepEqual(await read(BigInt(1969)),memory);
  await rejects("awaken",[BigInt(1969),2],buyer,"AlreadyAwakened");
  await rejects("awaken",[BigInt(1969),2],owner,"NotOwner");
  await write(genesis,mockAbi,"mint",[BigInt(1),owner]);
  await write(genesis,mockAbi,"transfer",[BigInt(1),buyer]);
  await rejects("awaken",[BigInt(1),2],owner,"NotOwner");
  await write(ledger,abi,"awaken",[BigInt(1),2],buyer);
  assert.equal((await read(BigInt(1))).choice,2);
 } finally { await provider.disconnect(); }
});
