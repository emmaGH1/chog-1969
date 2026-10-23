import {test} from "node:test";
import assert from "node:assert/strict";
import {GENESIS_CONTRACT} from "../src/lib/genesis";
import {parseReconstruction,readPipIdentity,reconstruct,traitPhase,wrapStop} from "../src/components/chapter/pip-reconstruction";

const dossier=()=>({
  tokenId:"1053",chainId:143,collection:GENESIS_CONTRACT,blockNumber:"42",checkedAt:"2026-10-23T03:00:00Z",
  metadataSource:"https://gateway.pinata.cloud/ipfs/mock",
  metadata:{name:"CHOG #545",imageUrls:[],attributes:[
    {trait_type:"Head",value:"MMGA Cap"},{trait_type:"Body",value:"Stripes"},{trait_type:"Eyes",value:"Happy"},
  ]},
});
test("live trait values derive all three positions; all must align before reconstruction",()=>{
  const identity=readPipIdentity(dossier());
  const targets=identity.traits.map(trait=>trait.target);
  assert.equal(reconstruct(identity,[]),null);
  for(let i=0;i<3;i++){
    const wrong=[...targets];wrong[i]=wrapStop(wrong[i]+1);
    assert.equal(reconstruct(identity,wrong),null);
  }
  const saved=reconstruct(identity,targets);
  assert.ok(saved);
  assert.deepEqual(parseReconstruction(JSON.stringify(saved)),saved);
  assert.equal(identity.traits[0].target,traitPhase("Head","MMGA Cap"));
  assert.notEqual(traitPhase("Head","MMGA Cap"),traitPhase("Head","Different cap"));
  assert.equal(wrapStop(-1),11);assert.equal(wrapStop(12),0);
});
test("wrong NFT, chain or collection cannot supply a decoder",()=>{
  for(const changed of [{tokenId:"1969"},{chainId:1},{collection:"0x1111111111111111111111111111111111111111"}]){
    assert.throws(()=>readPipIdentity({...dossier(),...changed}),/not Pip/);
  }
});
test("missing, duplicated or changed metadata fails closed instead of substituting traits",()=>{
  const original=dossier();
  for(const metadata of [null,{...original.metadata,name:"CHOG #1461"},{...original.metadata,attributes:[]},
    {...original.metadata,attributes:[...original.metadata.attributes,original.metadata.attributes[0]]},
    {...original.metadata,attributes:original.metadata.attributes.map(t=>t.trait_type==="Eyes"?{...t,value:"Angry"}:t)}]){
    assert.throws(()=>readPipIdentity({...original,metadata}));
  }
  assert.throws(()=>readPipIdentity({...original,blockNumber:"unknown"}));
  assert.throws(()=>readPipIdentity({...original,checkedAt:"unknown"}));
});
test("old chapter booleans and corrupt receipts cannot skip reconstruction",()=>{
  const identity=readPipIdentity(dossier());
  const saved=reconstruct(identity,identity.traits.map(t=>t.target))!;
  for(const raw of [null,"{",'{"opened":true}',JSON.stringify({...saved,version:2}),
    JSON.stringify({...saved,tokenId:"1969"}),JSON.stringify({...saved,fingerprint:"made up"})]){
    assert.equal(parseReconstruction(raw),null);
  }
  const altered={...identity,traits:identity.traits.map(t=>({...t,target:0}))};
  assert.equal(reconstruct(altered,[0,0,0]),null);
});
