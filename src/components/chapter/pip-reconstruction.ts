import {GENESIS_CONTRACT} from "../../lib/genesis";

export const PIP_TOKEN = "1053";
export const RECONSTRUCTION_KEY = "chog1969:pip-reconstruction:v1";
export const STOPS = 12;
const EXPECTED = {Head:"MMGA Cap", Body:"Stripes", Eyes:"Happy"} as const;
export type TraitKind = keyof typeof EXPECTED;
export type IdentityTrait = {kind:TraitKind; value:string; target:number};
export type PipIdentity = {
  fingerprint:string; blockNumber:string; checkedAt:string;
  imageUrls:string[]; metadataSource:string; traits:IdentityTrait[];
};
export type Reconstruction = {
  version:1; tokenId:typeof PIP_TOKEN; collection:string; chainId:143;
  fingerprint:string; blockNumber:string; checkedAt:string;
};

export function wrapStop(value:number) {return ((value % STOPS) + STOPS) % STOPS;}
export function traitPhase(kind:string,value:string) {
  let hash=2166136261;
  for(const char of `${GENESIS_CONTRACT}:${PIP_TOKEN}:${kind}:${value}`) {
    hash=Math.imul(hash ^ char.charCodeAt(0),16777619) >>> 0;
  }
  return hash % STOPS;
}
const fingerprint=(traits:{kind:string;value:string}[]) =>
  JSON.stringify([GENESIS_CONTRACT,PIP_TOKEN,...traits.map(({kind,value})=>[kind,value])]);
const expectedTraits=Object.entries(EXPECTED).map(([kind,value])=>({kind:kind as TraitKind,value,target:traitPhase(kind,value)}));
const expectedFingerprint=fingerprint(expectedTraits);

/** Story binding, not proof of ownership or independently verified IPFS content. */
export function readPipIdentity(input:unknown):PipIdentity {
  if(!input || typeof input!=="object")throw new Error("The Genesis record could not be read.");
  const data=input as Record<string,unknown>;
  if(data.chainId!==143 || data.tokenId!==PIP_TOKEN || typeof data.collection!=="string" || data.collection.toLowerCase()!==GENESIS_CONTRACT) {
    throw new Error("This is not Pip’s Genesis record. Another token cannot restore this memory.");
  }
  if(typeof data.blockNumber!=="string" || !/^\d+$/.test(data.blockNumber) || typeof data.checkedAt!=="string" || !Number.isFinite(Date.parse(data.checkedAt))) {
    throw new Error("The chain read is incomplete. No identity has been assumed.");
  }
  const metadata=data.metadata as {name?:unknown;attributes?:unknown;imageUrls?:unknown}|null;
  if(!metadata || metadata.name!=="CHOG #545" || !Array.isArray(metadata.attributes)) {
    throw new Error("Pip’s metadata is unavailable or changed. Retry the live read; no substitute can unlock the press.");
  }
  const traits=expectedTraits.map(({kind,value})=>{
    const matches=(metadata.attributes as {trait_type?:unknown;value?:unknown}[]).filter(t=>t && t.trait_type===kind);
    if(matches.length!==1 || matches[0].value!==value) {
      throw new Error("Pip’s identity traits are missing, ambiguous or changed. The press remains sealed.");
    }
    const liveValue=matches[0].value as string;
    return {kind,value:liveValue,target:traitPhase(kind,liveValue)};
  });
  return {
    fingerprint:fingerprint(traits),traits,blockNumber:data.blockNumber,checkedAt:data.checkedAt,
    imageUrls:Array.isArray(metadata.imageUrls)?metadata.imageUrls.filter((url):url is string=>typeof url==="string" && url.startsWith("https://")):[],
    metadataSource:typeof data.metadataSource==="string" && data.metadataSource.startsWith("https://")?data.metadataSource:"",
  };
}

export function reconstruct(identity:PipIdentity,positions:number[]):Reconstruction|null {
  if(identity.fingerprint!==expectedFingerprint || identity.traits.length!==3 ||
    identity.traits.some((trait,index)=>trait.kind!==expectedTraits[index].kind || trait.value!==expectedTraits[index].value || trait.target!==expectedTraits[index].target) ||
    positions.length!==3 || positions.some((position,index)=>position!==identity.traits[index].target))return null;
  return {version:1,tokenId:PIP_TOKEN,collection:GENESIS_CONTRACT,chainId:143,
    fingerprint:identity.fingerprint,blockNumber:identity.blockNumber,checkedAt:identity.checkedAt};
}

export function parseReconstruction(raw:string|null):Reconstruction|null {
  try {
    const value=JSON.parse(raw??"null");
    if(value?.version!==1 || value.tokenId!==PIP_TOKEN || value.collection!==GENESIS_CONTRACT ||
      value.chainId!==143 || value.fingerprint!==expectedFingerprint ||
      typeof value.blockNumber!=="string" || !/^\d+$/.test(value.blockNumber) ||
      typeof value.checkedAt!=="string" || !Number.isFinite(Date.parse(value.checkedAt)))return null;
    return {version:1,tokenId:PIP_TOKEN,collection:GENESIS_CONTRACT,chainId:143,
      fingerprint:value.fingerprint,blockNumber:value.blockNumber,checkedAt:value.checkedAt};
  } catch {return null;}
}
