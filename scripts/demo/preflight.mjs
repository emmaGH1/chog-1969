// No deployment, wallet access or recording. Local build/security gate only.
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {sourceChanges} from './safety.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const output=resolve(root,process.env.DEMO_PREFLIGHT_DIR||`artifacts/demo/preflight-${new Date().toISOString().replaceAll(':','-')}`);
mkdirSync(output,{recursive:true});
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trimEnd();
const report={status:'running',startedAt:new Date().toISOString(),head:git('rev-parse','HEAD'),branch:git('branch','--show-current'),sourceChanges:sourceChanges(git('status','--porcelain')),checks:[]};
const commands=[['ci'],['test'],['run','typecheck'],['run','build'],['audit','--omit=dev']];
for(const [index,args] of commands.entries()){
  const startedAt=new Date().toISOString();
  console.log(`Preflight ${index+1}/5: npm ${args.join(' ')}`);
  const result=spawnSync('npm',args,{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024});
  const log=`${index+1}-${args[0]}.log`;
  writeFileSync(resolve(output,log),(result.stdout||'')+(result.stderr||'')+(result.error?String(result.error):''));
  report.checks.push({command:`npm ${args.join(' ')}`,exitCode:result.status??1,startedAt,finishedAt:new Date().toISOString(),log});
  if(result.status!==0){report.status='failed';break;}
}
report.finishedAt=new Date().toISOString();
if(report.status!=='failed'){
  report.status='passed';report.buildId=readFileSync(resolve(root,'.next/BUILD_ID'),'utf8').trim();
}
writeFileSync(resolve(output,'preflight.json'),JSON.stringify(report,null,2)+'\n');
console.log(`${report.status.toUpperCase()}: ${output}/preflight.json`);
if(report.status!=='passed')process.exitCode=1;
