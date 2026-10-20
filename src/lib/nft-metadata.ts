// Only fixed gateways are fetched server-side: tokenURI must never become an SSRF primitive.
export const IPFS_GATEWAYS = ["https://gateway.pinata.cloud/ipfs/", "https://ipfs.filebase.io/ipfs/"] as const;
const MAX_BYTES = 256 * 1024;
export type NftMetadata = {
 name: string | null; description: string | null; image: string | null;
 imageUrls: string[]; attributes: {trait_type:string;value:string}[];
};
export type MetadataResult = {metadata:NftMetadata|null; metadataSource:string|null; metadataWarning:string|null};

export function ipfsPath(uri:string):string|null {
 const match = /^ipfs:\/\/(?:ipfs\/)?([a-zA-Z0-9]{32,100})(\/[a-zA-Z0-9._/-]*)?$/.exec(uri);
 if(!match || match[2]?.split("/").some(part=>part===".." || part===".")) return null;
 return match[1]+(match[2]??"");
}
export function imageUrls(uri:string):string[] {
 const path=ipfsPath(uri);
 if(path) return IPFS_GATEWAYS.map(base=>base+path);
 // Direct artwork URLs are loaded only in the browser, never by the server.
 // SVG/data/javascript/file URLs, credentials, and local literal hosts are not accepted.
 try {
  const url=new URL(uri);
  if(url.protocol!=="https:" || url.username || url.password || url.port || !url.hostname.includes(".") || /(?:^|\.)(?:localhost|local|internal)$/.test(url.hostname) || /^[\d.]+$/.test(url.hostname) || url.hostname.includes(":")) return [];
  if(/\.svg$/i.test(url.pathname)) return [];
  return [url.href];
 } catch { return []; }
}
const text = (value:unknown,max:number):string|null => typeof value==="string" ? value.slice(0,max) : null;
export function normalizeMetadata(value:unknown):NftMetadata {
 if(!value || typeof value!=="object" || Array.isArray(value)) throw new Error("Metadata is not a JSON object");
 const raw=value as Record<string,unknown>;
 const image=text(raw.image,2048);
 const attributes=Array.isArray(raw.attributes)?raw.attributes.slice(0,100).flatMap(item=>{
  if(!item || typeof item!=="object") return [];
  const name=text(item.trait_type,120);
  const val=typeof item.value==="number" && Number.isFinite(item.value)?String(item.value):text(item.value,300);
  return name && val!==null?[{trait_type:name,value:val}]:[];
 }):[];
 return {name:text(raw.name,200),description:text(raw.description,4000),image,imageUrls:image?imageUrls(image):[],attributes};
}
async function boundedJson(response:Response):Promise<unknown> {
 if(!response.ok) throw new Error("Gateway unavailable");
 if(Number(response.headers.get("content-length"))>MAX_BYTES) throw new Error("Metadata too large");
 if(!response.body) throw new Error("Empty metadata");
 const reader=response.body.getReader(); const chunks:Uint8Array[]=[]; let size=0;
 try {
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>MAX_BYTES)throw new Error("Metadata too large");chunks.push(value);}
 } finally {await reader.cancel();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 return JSON.parse(new TextDecoder().decode(bytes));
}
export async function loadMetadata(uri:string|null, fetcher:typeof fetch=fetch):Promise<MetadataResult> {
 const path=uri?ipfsPath(uri):null;
 if(!path) return {metadata:null,metadataSource:null,metadataWarning:"Metadata URI is missing or unsupported. Only IPFS metadata is fetched; raw chain data remains available."};
 for(const base of IPFS_GATEWAYS){
  const source=base+path;
  try {
   const response=await fetcher(source,{redirect:"error",signal:AbortSignal.timeout(7000),cache:"no-store",headers:{Accept:"application/json"}});
   const metadata=normalizeMetadata(await boundedJson(response));
   return {metadata,metadataSource:source,metadataWarning:metadata.image && !metadata.imageUrls.length?"Artwork URI is unsupported; inspect the original URI below.":null};
  } catch { /* Bounded fallback; no arbitrary redirects or user-supplied hostnames. */ }
 }
 return {metadata:null,metadataSource:null,metadataWarning:"IPFS metadata gateways are unavailable or returned invalid/oversized JSON. Ownership was still read from Monad; retry later."};
}
