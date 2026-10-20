#!/usr/bin/env node
/** Validate media handoff without changing application files or making network requests. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const root=fileURLToPath(new URL('../',import.meta.url));
const base=path.join(root,'public');
const manifest=JSON.parse(await fs.readFile(path.join(base,'media/manifest.json'),'utf8'));
assert.equal(manifest.status,'superseded-layout-studies-not-for-integration');
assert.equal(manifest.productionGate.shippingPanelsApproved,false);
assert.equal(manifest.productionGate.inventedPipUsable,false);
assert.equal(manifest.productionGate.legacyRendererFrozen,true);
const frozen=spawnSync(process.execPath,[path.join(root,'scripts/build-media-assets.mjs'),'all'],{encoding:'utf8'});
assert.equal(frozen.status,2,'Old renderer must refuse to regenerate invented Pip');
assert.ok(frozen.stderr.includes('FROZEN:'));
assert.equal(manifest.assets.length,12,'Four sheets and eight frame layouts required');
assert.equal(new Set(manifest.assets.map(a=>a.id)).size,12);
assert.equal(manifest.assets.filter(a=>a.kind==='reference').length,4);
assert.equal(manifest.assets.filter(a=>a.kind==='story-frame').length,8);
let count=0,total=0;
for(const a of manifest.assets){
 assert.ok(a.alt.length>30,`Missing descriptive alt: ${a.id}`);
 const expectedStatus=a.character==='pip'?'rejected-invented-chog-do-not-use':a.kind==='reference'?'human-design-reference-only-not-final':['cover','pip-awakening'].includes(a.scene)?'legacy-layout-only-contains-rejected-invented-chog':'legacy-layout-reference-only-not-final';
 assert.equal(a.status,expectedStatus);
 for(const [kind,url]of Object.entries(a.files)){
  assert.ok(url.startsWith('/media/'));
  const filename=path.join(base,url);
  const stat=await fs.stat(filename);
  assert.equal(stat.size,a.bytes[kind],`Stale byte count: ${url}`);
  assert.equal(createHash('sha256').update(await fs.readFile(filename)).digest('hex'),a.sha256[kind],`Stale asset hash: ${url}`);
  assert.ok(stat.size>1000,`Empty/placeholder asset: ${url}`);
  total+=stat.size;count++;
  if(kind==='source'){
   const source=await fs.readFile(filename,'utf8');
   assert.ok(source.includes('<title id="title">')&&source.includes('<desc id="desc">'));
   assert.ok(!/<(?:script|image|foreignObject)\b|https?:\/\/(?!www\.w3\.org)/.test(source),`External or executable SVG content: ${url}`);
   if(a.kind==='story-frame')assert.ok(!source.includes('<text '),'Dialogue must remain accessible HTML');
   if(a.scene==='archive'||a.scene==='neri-closeup')assert.ok(!source.includes('fill="#794CFA"')&&!source.includes('stroke="#794CFA"'),'No violet before awakening');
   if(a.scene==='cover'||a.scene==='pip-awakening')assert.ok(source.includes('fill="#794CFA"'),'Legacy color check only; not a color requirement for an actual NFT');
  }else{
   const m=await sharp(filename).metadata();
   assert.equal(m.width,a.width);assert.equal(m.height,a.height);
   assert.equal(m.format,kind==='webp'?'webp':'png');
   assert.ok(stat.size<250000,`Exceeds per-file 250kB draft budget: ${url}`);
   const stats=await sharp(filename).stats();
   assert.ok(stats.channels.some(c=>c.stdev>20),`Blank raster: ${url}`);
  }
 }
}
for(const scene of ['cover','archive','neri-closeup','pip-awakening']){
 const pair=manifest.assets.filter(a=>a.scene===scene);
 assert.deepEqual(pair.map(a=>a.layout).sort(),['portrait','wide']);
 assert.notEqual(await fs.readFile(path.join(base,pair[0].files.source),'utf8'),await fs.readFile(path.join(base,pair[1].files.source),'utf8'),'Must recompose portrait, not duplicate wide');
}
const gallery=await fs.readFile(path.join(base,'media/review.html'),'utf8');
for(const match of gallery.matchAll(/(?:href|src|srcset)="([^"]+)"/g)){
 const target=match[1];if(target.startsWith('#'))continue;
 assert.ok(!target.includes('://'),'Gallery must work offline');
 await fs.access(path.join(base,'media',target));
}
const contact=await sharp(path.join(base,'media/contact-sheet.png')).metadata();
assert.deepEqual([contact.width,contact.height],[1600,1180]);
assert.ok(gallery.includes('REJECTED INVENTED CHOG')&&gallery.includes('NOT APPROVED FOR FINAL INTEGRATION'));
console.log(`PASS: 12 preserved legacy assets / ${count} source+raster files / ${Math.round(total/1024)} KiB. Original hashes, dimensions, local links, rejection labels and frozen renderer checked. No shipping art approved.`);
