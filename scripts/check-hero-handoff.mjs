#!/usr/bin/env node
/** Offline packet validation only. Does not verify RPC facts, grant rights, render, or spend. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const packet=JSON.parse(await fs.readFile(path.join(root,'public/media/hero/selection.json'),'utf8'));
assert.equal(packet.canonicalCollection.chainId,143);
assert.equal(packet.canonicalCollection.contract.toLowerCase(),'0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763');
assert.equal(packet.legacy.inventedPipUsable,false);
assert.equal(packet.legacy.shippingPanelsApproved,false);
assert.equal(packet.role,'Pip');
const value=key=>key.split('.').reduce((v,k)=>v?.[k],packet);
const required=[
 'coordination.shortlistUrl','coordination.shortlistCommit',
 'selection.tokenId','selection.metadataDisplayName','selection.userApprovalUrl','selection.fictionalRoleFit',
 'verification.chainEvidenceUrl','verification.blockNumber','verification.blockHash','verification.verifiedAtUtc',
 'verification.tokenURI','verification.rawMetadataFile','verification.rawMetadataSha256',
 'originalArtwork.originalURI','originalArtwork.sourceUrl','originalArtwork.localFile','originalArtwork.sha256',
 'originalArtwork.mime','originalArtwork.width','originalArtwork.height','originalArtwork.traits','originalArtwork.sourceAndTraitReviewUrl',
 'rights.evidenceUrl','rights.approvedScope','rights.requiredAttribution',
 'production.method','production.executionApprovalUrl'
];
const missing=required.filter(k=>value(k)===null||value(k)===undefined||value(k)==='');
if(packet.rights.status!=='approved-for-proposed-scope')missing.push('rights.status (approval pending)');
if(packet.coordination.candidateCount<3||packet.coordination.candidateCount>5)missing.push('coordination.candidateCount (need 3–5 authentic candidates)');
if(packet.production.method&&packet.production.method!=='local-no-spend'){
 for(const k of ['production.spendApprovalUrl','production.approvedBudget'])if(!value(k))missing.push(k);
}
if(packet.selection.tokenId!==null)assert.match(packet.selection.tokenId,/^(0|[1-9][0-9]*)$/,'Use decimal onchain ID as string, never metadata display name');
if(missing.length){
 assert.equal(packet.hero.status,'not-produced','Do not claim a hero while selection/approval inputs are missing');
 for(const key of ['wideFile','portraitFile','originalVersusAdaptationPreview','userArtApprovalUrl'])assert.equal(packet.hero[key],null);
 console.log(`HOLD: ${missing.length} selection/provenance/approval inputs missing. No hero produced, no rendering or spend authorized.\n- ${missing.join('\n- ')}`);
 if(process.argv.includes('--require-ready'))process.exitCode=2;
}else{
 // Structural completeness is not independent chain, license, or approval verification.
 assert.match(packet.verification.blockHash,/^0x[0-9a-fA-F]{64}$/);
 assert.ok(Number.isFinite(Date.parse(packet.verification.verifiedAtUtc)));
 assert.ok(['local-no-spend','approved-illustrator','approved-image-service'].includes(packet.production.method));
 async function originalFile(url,expectedHash){
  assert.ok(url.startsWith('/media/hero/originals/')&&!url.includes('..'),'Archive originals only under /media/hero/originals/');
  const data=await fs.readFile(path.join(root,'public',url));
  assert.equal(createHash('sha256').update(data).digest('hex'),expectedHash,'Original source bytes changed');
  return data;
 }
 const metadata=JSON.parse(await originalFile(packet.verification.rawMetadataFile,packet.verification.rawMetadataSha256));
 await originalFile(packet.originalArtwork.localFile,packet.originalArtwork.sha256);
 assert.equal(packet.selection.metadataDisplayName,metadata.name);
 assert.equal(packet.originalArtwork.originalURI,metadata.image);
 assert.deepEqual(packet.originalArtwork.traits,metadata.attributes??[]);
 console.log('Packet structurally complete; original hashes/name/image/traits match. Human review must still verify chain evidence, approval identity, rights scope and budget. This command never renders or authorizes spending.');
}
