// Records the REAL running browser only after visual approval. No mocked UI, wallets or chain writes.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {performance} from 'node:perf_hooks';
import {privateBase,requirePreflight,requireReadOnly,requireVisualApproval,sourceChanges} from './safety.mjs';
const args=process.argv.slice(2);
if(args.includes('--help')){
  console.log('Usage: node scripts/demo/capture.mjs --check|--record --preflight <preflight.json> [--approval <human-approval.json>]\nOptional env: DEMO_BASE_URL (loopback), DEMO_OUTPUT, DEMO_TOKEN_ID, DEMO_METADATA_NAME, DEMO_WIDTH/HEIGHT, PLAYWRIGHT_MODULE, CHROME_PATH.\n--check takes screenshots and exercises real interactions WITHOUT recording video. --record requires visual approval and a clean source tree.');
  process.exit(0);
}
const record=args.includes('--record');
if(record===args.includes('--check'))throw new Error('Choose exactly one of --check or --record.');
const option=name=>{const i=args.indexOf(name);return i>=0?args[i+1]:undefined;};
const root=fileURLToPath(new URL('../../',import.meta.url));
const git=(...a)=>execFileSync('git',a,{cwd:root,encoding:'utf8'}).trimEnd();
const head=git('rev-parse','HEAD');
const base=privateBase(process.env.DEMO_BASE_URL);
const tokenId=process.env.DEMO_TOKEN_ID||'1969';
const metadataName=process.env.DEMO_METADATA_NAME||'CHOG #1461';
if(!/^\d{1,78}$/.test(tokenId))throw new Error('Use an actual decimal onchain token ID.');
const preflightPath=option('--preflight');
if(!preflightPath)throw new Error('--preflight <preflight.json> is required. Run npm run demo:preflight first.');
const report=JSON.parse(await readFile(resolve(preflightPath),'utf8'));
const buildId=(await readFile(resolve(root,'.next/BUILD_ID'),'utf8')).trim();
requirePreflight(report,{head,buildId});
const changes=sourceChanges(git('status','--porcelain'));
let approval=null;
if(record){
  if(git('branch','--show-current')!=='integration/pilot')throw new Error('Record from the reviewed integration/pilot branch only.');
  if(changes.length || report.sourceChanges.length)throw new Error('Commit reviewed source changes, then rerun preflight before final recording.');
  const path=option('--approval');if(!path)throw new Error('--approval <human-approval.json> is required; approval cannot be inferred.');
  approval=JSON.parse(await readFile(resolve(path),'utf8'));requireVisualApproval(approval,{head,tokenId});
}
const width=Number(process.env.DEMO_WIDTH||1280),height=Number(process.env.DEMO_HEIGHT||720);
if(!Number.isInteger(width)||!Number.isInteger(height)||width<320||height<640||width>1920||height>1920)throw new Error('Use a sensible browser viewport (320–1920 wide, 640–1920 high).');
const output=resolve(root,process.env.DEMO_OUTPUT||`artifacts/demo/${record?'capture':'rehearsal'}-${new Date().toISOString().replaceAll(':','-')}`);
await mkdir(resolve(output,'..'),{recursive:true});await mkdir(output); // Refuse overwriting an existing take.
const manifest={mode:record?'approved-browser-recording':'rehearsal-no-video',status:'running',head,buildId,sourceChanges:changes,base,viewport:{width,height},startedAt:new Date().toISOString(),preflight:resolve(preflightPath),approval,beats:[],errors:[],nft:null,video:null};
let browser,context,page,video;
let start;
try{
  const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright-core');
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined,args:['--no-sandbox']});
  const contextOptions={viewport:{width,height},reducedMotion:'reduce'};
  context=await browser.newContext(contextOptions);
  const configResponse=await context.request.get(`${base}/api/awakening-config`,{maxRedirects:0});
  assert.equal(configResponse.status(),200);requireReadOnly(await configResponse.json());
  assert.equal((await context.request.get(`${base}/_next/static/${buildId}/_buildManifest.js`,{maxRedirects:0})).status(),200,'Restart the private production server using this build.');
  if(record){
    const probe=await context.newPage();await probe.goto(`${base}/chapter/1`);
    await probe.getByRole('heading',{name:'HISTORY IS WRITTEN BY THE SURVIVORS.'}).waitFor();
    if(await probe.getByText('narrative illustrations pending art approval',{exact:false}).count())throw new Error('Final capture refused: approved opening visuals have not replaced the labelled layout preview. Rehearsal remains available.');
    await context.close();context=await browser.newContext({...contextOptions,recordVideo:{dir:output,size:{width,height}}});
  }
  await context.route('**/*',async route=>{
    const request=route.request();
    if(request.isNavigationRequest() && new URL(request.url()).origin!==base){manifest.errors.push('Blocked external navigation.');return route.abort();}
    if(request.method()==='POST'){
      let body;try{body=request.postDataJSON();}catch{/* Non-JSON media requests cannot be wallet RPC. */}
      const calls=Array.isArray(body)?body:[body];
      if(calls.some(c=>/^(eth_send|eth_sign|personal_sign|wallet_)/.test(c?.method||''))){manifest.errors.push('Blocked wallet RPC during capture.');return route.abort();}
    }
    return route.continue();
  });
  page=await context.newPage();video=page.video();
  page.on('pageerror',e=>manifest.errors.push(e.message));
  page.on('dialog',async dialog=>{manifest.errors.push(`Unexpected ${dialog.type()} dialog; dismissed.`);await dialog.dismiss();});
  const hold=async(until)=>{if(record)await new Promise(r=>setTimeout(r,Math.max(0,until*1000-(performance.now()-start))));};
  const beat=async(name,until)=>{
    if(record && await page.getByText('narrative illustrations pending art approval',{exact:false}).count())throw new Error(`Shot ${name} still contains unapproved layout visuals; final capture stopped.`);
    if(record && (performance.now()-start)/1000>until-2)throw new Error(`Shot ${name} missed its minimum readable hold. Resolve latency and retry; do not fabricate loading success.`);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow in ${name}`);
    await page.screenshot({path:resolve(output,`${String(manifest.beats.length+1).padStart(2,'0')}-${name}.png`),fullPage:false});
    manifest.beats.push({name,elapsedSeconds:Number(((performance.now()-start)/1000).toFixed(2)),holdUntilSeconds:record?until:null});
    console.log(`PASS ${name}`);await hold(until);
  };
  start=performance.now();
  await page.goto(base);await page.getByRole('link',{name:/read the story/i}).first().waitFor();
  await beat('cover',15);
  await page.goto(`${base}/chapter/1`);
  const advance=page.getByRole('button',{name:'continue the story'});
  await advance.click();await page.getByRole('button',{name:'Inspect first record'}).click();await page.getByRole('button',{name:'Turn shipment label'}).click();
  await page.getByLabel('Four-digit drawer code').fill('1234');await page.getByRole('button',{name:'unlock',exact:true}).click();
  await page.getByText('Not quite.',{exact:false}).waitFor();await hold(25);
  await page.getByLabel('Four-digit drawer code').fill('1969');await page.getByRole('button',{name:'unlock',exact:true}).click();
  await page.getByText('The drawer clicks open.',{exact:false}).waitFor();await page.getByText('The drawer clicks open.',{exact:false}).scrollIntoViewIfNeeded();await beat('drawer',40);
  await advance.click();await advance.click();await page.getByRole('button',{name:'Keep the evidence'}).click();await hold(50);await advance.click();
  await page.reload();await page.getByRole('heading',{name:'SOMEONE STILL REMEMBERS.'}).waitFor();await page.getByText('In your satchel:',{exact:false}).scrollIntoViewIfNeeded();await beat('route-resume',60);
  await page.goto(`${base}/archive`);await page.getByLabel('onchain token id',{exact:true}).fill(tokenId);
  const responsePromise=page.waitForResponse(r=>r.url()===`${base}/api/nft/${tokenId}`);
  await page.getByRole('button',{name:'inspect seal'}).click();
  const response=await responsePromise;assert.equal(response.status(),200);
  const nft=await response.json();assert.equal(nft.chainId,143);assert.equal(nft.tokenId,tokenId);assert.equal(nft.collection.toLowerCase(),'0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763');assert.equal(nft.metadata?.name,metadataName);
  manifest.nft={tokenId,metadataName,collection:nft.collection,chainId:nft.chainId,blockNumber:nft.blockNumber,checkedAt:nft.checkedAt,tokenURI:nft.tokenURI,originalImageURI:nft.metadata.image,metadataSource:nft.metadataSource,memory:nft.memory};
  const art=page.getByRole('img',{name:metadataName,exact:true});await art.evaluate(img=>img.decode());
  assert.ok(await art.evaluate(img=>img.naturalWidth>0));assert.ok(nft.metadata.imageUrls.includes(await art.getAttribute('src')));
  await art.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await page.screenshot({path:resolve(output,'archive-art.png')});await hold(75);await page.getByText('Collection traits',{exact:true}).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await beat('authentic-archive',90);
  const controls=page.getByRole('button',{name:'Open holder controls'});await controls.click();
  await page.getByText('Read-only: wallet writes disabled',{exact:false}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Check owner & simulate'}).isDisabled(),true);
  await page.getByRole('heading',{name:'Holder path · optional wallet'}).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await beat('disabled-holder',115);
  await page.getByRole('button',{name:'Refresh memory status'}).click();await page.getByRole('status').filter({hasText:'Public memory status refreshed from chain.'}).waitFor();
  await page.getByText('Canonical memory status:',{exact:false}).scrollIntoViewIfNeeded();await beat('readonly-proof-boundary',135);
  requireReadOnly(await (await context.request.get(`${base}/api/awakening-config`,{maxRedirects:0})).json());
  await page.goto(`${base}/chapter/1`);await page.getByRole('heading',{name:'SOMEONE STILL REMEMBERS.'}).waitFor();await advance.click();
  await page.getByText('END OF CHAPTER ONE',{exact:true}).waitFor();await page.getByText('END OF CHAPTER ONE',{exact:true}).scrollIntoViewIfNeeded();await beat('cliffhanger',155);
  await page.goto(base);await beat('closing',160);
  assert.deepEqual(manifest.errors,[]);manifest.status='passed';
}catch(error){manifest.status='failed';manifest.errors.push(error instanceof Error?error.message:String(error));process.exitCode=1;console.error(manifest.errors.at(-1));}
finally{
  if(context)await context.close();
  if(video)manifest.video=await video.path();
  if(browser)await browser.close();
  manifest.finishedAt=new Date().toISOString();manifest.durationSeconds=start?Number(((performance.now()-start)/1000).toFixed(2)):0;
  if(record && manifest.durationSeconds>=180){manifest.status='failed';manifest.errors.push('Take exceeds the under-3-minute budget.');process.exitCode=1;}
  await writeFile(resolve(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(`${manifest.status.toUpperCase()}: ${output}/manifest.json`);
}
