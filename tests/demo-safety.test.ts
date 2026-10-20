import {test} from 'node:test';
import assert from 'node:assert/strict';
import {privateBase,requirePreflight,requireReadOnly,requireVisualApproval,sourceChanges} from '../scripts/demo/safety.mjs';
test('demo accepts only plain loopback origins',()=>{
  assert.equal(privateBase(),'http://127.0.0.1:3103');
  assert.equal(privateBase('http://localhost:3103'),'http://localhost:3103');
  for(const url of ['https://public.example','http://127.0.0.1.evil.test','http://0.0.0.0:3103','http://user:password@localhost','http://localhost/chapter/1','http://localhost?token=secret','http://localhost/#x'])assert.throws(()=>privateBase(url));
});
test('capture refuses enabled, missing and ambiguous write configurations',()=>{
  requireReadOnly({enabled:false,ledger:null});
  for(const config of [null,{}, {enabled:true},{enabled:'false'}])assert.throws(()=>requireReadOnly(config));
});
test('capture preflight must pass for the exact current build and commit and be recent',()=>{
  const current={head:'abc',buildId:'build',now:Date.parse('2026-10-20T12:00:00Z')};
  const report={status:'passed',head:'abc',buildId:'build',finishedAt:'2026-10-20T11:00:00Z',checks:Array.from({length:5},()=>({exitCode:0}))};
  requirePreflight(report,current);
  for(const bad of [{...report,status:'failed'},{...report,head:'old'},{...report,buildId:'old'},{...report,checks:[]},{...report,checks:[{exitCode:1}]},{...report,finishedAt:'2026-10-18T00:00:00Z'},{...report,finishedAt:'2026-10-21T00:00:00Z'}])assert.throws(()=>requirePreflight(bad,current));
});
test('final recording needs documented human visual approval, scoped to commit and token',()=>{
  const expected={head:'abc',tokenId:'1969'};
  const approval={sourceCommit:'abc',companionTokenId:'1969',visualsApproved:true,approvedBy:'test fixture only',approvedAt:'2020-01-01T00:00:00Z',evidence:'fixture://not-real-approval',heroArtReference:'fixture://not-real-art'};
  requireVisualApproval(approval,expected);
  for(const bad of [null,{}, {...approval,approvedBy:''},{...approval,visualsApproved:false},{...approval,sourceCommit:'old'},{...approval,companionTokenId:'1'},{...approval,approvedAt:'not a date'}])assert.throws(()=>requireVisualApproval(bad,expected));
});
test('recording source check ignores only generated Next declaration',()=>{
  assert.deepEqual(sourceChanges(' M next-env.d.ts\n'),[]);
  assert.deepEqual(sourceChanges(' M src/app/page.tsx\n?? secret.txt\n'),[' M src/app/page.tsx','?? secret.txt']);
});
