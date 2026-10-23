// Standalone browser check: see docs/STORY_ENGINE.md for prerequisites and command.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH || undefined, args:['--no-sandbox']});
const base = process.env.STORY_BASE_URL || 'http://127.0.0.1:3101';
const output = process.env.STORY_EVIDENCE_DIR || '/tmp/chog-story-evidence';
await mkdir(output,{recursive:true});
const errors=[];
try {
  for (const width of [375,1280]) {
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${base}/chapter/1`);
    const advance=page.getByRole('button',{name:'continue the story'});
    await advance.click();
    await page.getByRole('button',{name:'Inspect first record'}).click();
    await page.getByRole('button',{name:'Turn shipment label'}).click();
    assert.equal(await advance.isDisabled(),true);
    await page.getByLabel('Four-digit drawer code').fill('1234');
    await page.getByRole('button',{name:'unlock',exact:true}).click();
    await page.getByText('Not quite.',{exact:false}).waitFor();
    await page.getByLabel('Four-digit drawer code').fill('1969');
    await page.getByRole('button',{name:'unlock',exact:true}).click();
    await page.getByText('The drawer clicks open.',{exact:false}).waitFor();
    await page.screenshot({path:`${output}/drawer-${width}.png`,fullPage:true});
    await page.reload();
    await page.getByText('The drawer clicks open.',{exact:false}).waitFor();
    await advance.click();
    await page.getByRole('heading',{name:'THE DRAWING JUST MOVED.'}).waitFor();
    assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-labelledby')),'scene-heading');
    await advance.click();
    assert.equal(await advance.isDisabled(),true);
    await page.getByRole('button',{name:'Keep the evidence'}).click();
    await advance.click();
    await page.reload();
    await page.getByRole('heading',{name:'SOMEONE STILL REMEMBERS.'}).waitFor();
    await page.getByRole('button',{name:'Read the memory without holding',exact:true}).click();
    await page.getByText('we ran toward the sea, not away from it.',{exact:false}).waitFor();
    assert.equal(await advance.isEnabled(),true);
    await advance.click();
    await page.getByText('END OF CHAPTER ONE',{exact:true}).waitFor();
    await page.getByRole('button',{name:'Turn photograph to read the inscription',exact:true}).click();
    await page.getByRole('button',{name:'Turn photograph to the image',exact:true}).waitFor();
    await page.getByText('MEANWHILE, AT THE ARCHIVE',{exact:true}).waitFor();
    await page.getByRole('button',{name:'Turn photograph to the image',exact:true}).press('Enter');
    await page.getByRole('button',{name:'Turn photograph to read the inscription',exact:true}).waitFor();
    assert.equal(await advance.count(),0);
    await page.getByRole('button',{name:'previous scene'}).click();
    await page.getByRole('heading',{name:'SOMEONE STILL REMEMBERS.'}).waitFor();
    // Both storage corruption and disabled storage must leave a readable chapter.
    await page.evaluate(()=>localStorage.setItem('chog1969:pilot','{"index":2.5}'));
    await page.reload();
    await page.getByRole('heading',{name:'HISTORY IS WRITTEN BY THE SURVIVORS.'}).waitFor();
    await advance.click();
    await page.getByLabel('Four-digit drawer code').fill('1969');
    await page.getByRole('button',{name:'unlock',exact:true}).click();
    await advance.click(); await advance.click();
    await page.getByRole('button',{name:'Burn the records'}).click();
    await page.screenshot({path:`${output}/escape-${width}.png`,fullPage:true});
    await advance.click(); await advance.click();
    await page.getByText('END OF CHAPTER ONE',{exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    // Cancel restart leaves the ending intact; confirmation clears all progress.
    page.once('dialog',d=>d.dismiss());
    await page.getByRole('button',{name:'Restart chapter',exact:true}).click();
    await page.getByText('END OF CHAPTER ONE',{exact:true}).waitFor();
    page.once('dialog',d=>d.accept());
    await page.getByRole('button',{name:'Restart chapter',exact:true}).click();
    await page.getByRole('heading',{name:'HISTORY IS WRITTEN BY THE SURVIVORS.'}).waitFor();
    await page.close();
    console.log(`PASS ${width}px: both routes, refresh, puzzle, focus, back, restart, malformed save, overflow`);
  }
  const blocked=await browser.newPage({viewport:{width:375,height:812}});
  await blocked.addInitScript(()=>{
    Object.defineProperty(Storage.prototype,'setItem',{value:()=>{throw new Error('Storage blocked');}});
    Object.defineProperty(Storage.prototype,'getItem',{value:()=>{throw new Error('Storage blocked');}});
  });
  await blocked.goto(`${base}/chapter/1`);
  await blocked.getByText('Progress could not be saved',{exact:false}).waitFor();
  await blocked.getByRole('button',{name:'continue the story'}).click();
  await blocked.getByLabel('Four-digit drawer code').waitFor();
  console.log('PASS blocked storage: warning visible; chapter remains playable');
  assert.deepEqual(errors,[]);
} finally {await browser.close();}
