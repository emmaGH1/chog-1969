// Optional production-server smoke check; shares the story harness browser prerequisites.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const base = process.env.STORY_BASE_URL || 'http://127.0.0.1:3103';
const output = process.env.STORY_EVIDENCE_DIR || '/tmp/chog-integration-evidence';
await mkdir(output, {recursive:true});
const browser = await chromium.launch({executablePath:process.env.CHROME_PATH || undefined,args:['--no-sandbox']});
try {
  for (const width of [375,1280]) {
    const page = await browser.newPage({viewport:{width,height:900}});
    const errors=[];
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto(`${base}/archive`);
    await page.getByRole('button',{name:'inspect seal'}).click();
    await page.getByRole('heading',{name:'CHOG #1461',exact:true}).waitFor();
    await page.getByText('Onchain token ID: 1969',{exact:true}).waitFor();
    const art = page.getByRole('img',{name:'CHOG #1461',exact:true});
    await art.evaluate(img=>img.decode());
    assert.equal(await art.evaluate(img=>img.naturalWidth),1000);
    assert.match(await art.getAttribute('src'), /\/1461\.webp$/);
    await page.getByText('No approved MemoryLedger deployment is configured.',{exact:false}).waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:`${output}/archive-${width}.png`,fullPage:true});
    await page.getByLabel('onchain token id',{exact:true}).fill('0');
    await page.getByRole('button',{name:'inspect seal'}).click();
    await page.getByRole('alert').waitFor();
    assert.equal(await art.count(),0);
    assert.deepEqual(errors,[]);
    console.log(`PASS archive ${width}px: real token 1969 / CHOG #1461, original 1000px artwork, unknown ledger, missing-token state, no overflow or page errors`);
    await page.close();
  }
  for (const [id,status] of [['1969',200],['0',404],['-1',400]]) {
    const response=await fetch(`${base}/api/nft/${id}`);
    assert.equal(response.status,status);
    const data=await response.json();
    if(status===200){assert.equal(data.chainId,143);assert.equal(data.metadata.name,'CHOG #1461');assert.equal(data.tokenId,'1969');}
    console.log(`PASS API token ${id}: ${status}`);
  }
} finally {await browser.close();}
