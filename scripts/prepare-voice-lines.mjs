#!/usr/bin/env node
/** Prepare exact text and vendor-neutral performance XML; never calls a voice provider. */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const dir=path.join(root,'public/audio');
const plan=JSON.parse(await fs.readFile(path.join(dir,'voice-plan.json'),'utf8'));
const source=await fs.readFile(path.join(root,'docs/VOICE_AND_DEMO.md'),'utf8');
const checking=process.argv.includes('--check');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const plain=s=>s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
assert.equal(plan.recordingsExist,false);
assert.equal(plan.status,'reference-only-held-until-genesis-selection-and-hero-approval');
for(const role of ['pip','chog-witness']){
 const binding=plan.chogRoleBindings[role];
 assert.ok(binding,'Every Chog voice role needs an explicit NFT binding slot');
 if(binding.tokenId===null)assert.equal(binding.userSelectionApprovalUrl,null);
 else {assert.match(binding.tokenId,/^(0|[1-9][0-9]*)$/);assert.ok(binding.userSelectionApprovalUrl);}
}
assert.equal(plan.lines.length,8);
assert.equal(new Set(plan.lines.map(l=>l.id)).size,8);
await fs.mkdir(path.join(dir,'lines'),{recursive:true});
for(const line of plan.lines){
 assert.ok(/^[a-z0-9-]+$/.test(line.id));
 assert.equal(line.audioFile,null,'Do not claim unproduced audio');
 assert.ok(source.includes(`"${line.text}"`),`Script drift from approved brief: ${line.id}`);
 assert.equal(plain(line.markedText),line.text,`Performance markup changes dialogue: ${line.id}`);
 const files={
  [`${line.id}.txt`]:line.text+'\n',
  [`${line.id}.performance.xml`]:`<?xml version="1.0" encoding="UTF-8"?>\n<!-- Planning notation, not a provider-ready payload. Recordings do not exist. -->\n<performance id="${line.id}" speaker="${line.speaker}" status="script-only">\n  <direction>${escape(line.direction)}</direction>\n  <speak xml:lang="en"><prosody rate="${line.rate}">${line.markedText}</prosody></speak>\n</performance>\n`
 };
 for(const [name,content]of Object.entries(files)){
  const filename=path.join(dir,'lines',name);
  if(checking)assert.equal(await fs.readFile(filename,'utf8'),content,`Stale voice source: ${name}`);
  else await fs.writeFile(filename,content);
 }
}
console.log(`PASS: ${checking?'checked':'prepared'} 8 exact text lines + 8 performance XML files. No provider calls; no recorded audio claimed.`);
