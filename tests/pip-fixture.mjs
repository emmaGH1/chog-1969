// Deterministic RPC fixture for browser regression only; never live-chain evidence.
export const pipDossier={
  tokenId:'1053',chainId:143,collection:'0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763',
  owner:'0x1111111111111111111111111111111111111111',blockNumber:'42',checkedAt:'2026-10-23T03:00:00Z',
  metadataSource:null,tokenURI:null,metadataWarning:null,memory:{status:'not-configured',ledger:null},
  metadata:{name:'CHOG #545',imageUrls:[],attributes:[
    {trait_type:'Head',value:'MMGA Cap'},{trait_type:'Body',value:'Stripes'},{trait_type:'Eyes',value:'Happy'},
  ]},
};
export async function solvePip(page){
  await page.getByRole('button',{name:'READ PIP’S GENESIS RECORD',exact:true}).click();
  for(const kind of ['Head','Body','Eyes']){
    const ring=page.getByRole('slider',{name:kind+' identity ring',exact:true});
    await ring.waitFor();
    const target=Number((await ring.getAttribute('aria-valuetext')).match(/identity mark (\d+)/)[1]);
    await ring.press('Home');
    for(let i=1;i<target;i++)await ring.press('ArrowRight');
  }
  await page.getByRole('button',{name:'Press to restore Pip’s erased record',exact:true}).click();
  await page.getByRole('button',{name:'WAKE PIP',exact:true}).click();
}
