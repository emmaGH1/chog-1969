#!/usr/bin/env node
/** FROZEN legacy batch-01 renderer. Preserved as reference; invented Pip was rejected in PR #8.
 * No invocation may regenerate these assets. See docs/HERO_SCENE_APPROVAL.md.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const OUT = path.join(ROOT, 'public/media');
const I = '#161220', P = '#F8F3E8', V = '#794CFA', L = '#E5D5FF', G = '#B6B0AA';
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const p = (d, fill = 'none', sw = 3, stroke = I, extra = '') => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const rect = (x,y,w,h,fill=P,sw=2,stroke=I,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;
const ellipse = (x,y,rx,ry,fill=P,sw=2,stroke=I) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const g = (x,y,s,body,extra='') => `<g transform="translate(${x} ${y}) scale(${s})" ${extra}>${body}</g>`;
const text = (x,y,t,size=20,fill=I,extra='') => `<text x="${x}" y="${y}" font-family="DejaVu Sans, sans-serif" font-size="${size}" fill="${fill}" ${extra}>${esc(t)}</text>`;
const defs = `<defs>
 <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><path d="M0 0V9" stroke="${I}" stroke-width="1" opacity=".35"/></pattern>
 <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="${I}" opacity=".28"/></pattern>
 <pattern id="fine" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-34)"><path d="M0 0V5" stroke="${I}" stroke-width=".7" opacity=".5"/></pattern>
</defs>`;
function svg(w,h,title,desc,body){return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(desc)}</desc>${defs}${rect(0,0,w,h,P,0)}${body}</svg>`;}

// Identical head functions are reused in all model sheets and story frames.
function eye(x,y,side=1,expr='neutral',kind='neri') {
 const narrow=kind==='sera'||kind==='rook';
 const ry=narrow?14:22, rx=narrow?13:16;
 const lid=expr==='worried'?-12:-23;
 return g(x,y,1,`<g transform="scale(${side} 1)">
 ${p(`M-28 0 Q-4 ${lid} 26 -2 Q12 ${ry+8} -16 ${ry+3}Z`,P,2)}
 ${ellipse(-1,2,rx,ry,I,0)}${ellipse(-6,-5,4.5,7,P,0)}${ellipse(5,10,2,2,P,0)}
 ${p(`M-30 -1 Q-4 ${lid-3} 27 -3`, 'none',5)}${p('M-24 22 Q-2 29 18 19','none',1.3)}
 ${p(expr==='worried'?'M-28 -39 Q-8 -28 22 -28':kind==='sera'?'M-28 -30 L24 -25':'M-27 -29 Q-2 -37 21 -29','none',4)}
 </g>`);
}
function head(kind='neri',angle='front',expr='neutral'){
 const n=kind==='neri', s=kind==='sera', r=kind==='rook';
 if(angle==='back') return p(n?'M-94 50 Q-123 -16 -104 -96 Q-86 -165 2 -161 Q102 -157 111 -66 L98 77 51 98 -77 86Z':s?'M-100 74 L-100 -70 Q-85 -171 24 -166 Q116 -148 108 -35 L100 119 37 96 -40 99Z':'M-108 25 L-127 -36 -99 -27 -120 -91 -63 -75 -67 -134 -14 -116 32 -170 55 -124 109 -135 97 -85 135 -60 100 -35 109 50 58 95 -65 91Z',I,4)+p('M-61 -94 Q-97 -22 -65 56 M54 -108 Q83 -27 71 62','none',2,G);
 if(angle==='profile') {
  const hair=n?'M-90 29 Q-117 -17 -89 -109 Q-47 -167 31 -148 L86 -104 64 -81 59 -43 35 -78 20 -32 8 -48 -3 20 -27 -4 -25 72 -55 83 -83 48Z':s?'M-91 97 Q-110 31 -99 -90 Q-79 -165 21 -153 L82 -110 62 -73 26 -48 -12 -21 -21 82 -45 118Z':'M-93 55 L-117 -1 -94 -22 -122 -78 -77 -71 -65 -132 -23 -114 24 -166 41 -130 90 -136 78 -98 105 -74 64 -61 46 -39 24 -67 8 -30 -11 -48 -25 31 -51 13 -53 77Z';
  return p('M-43 -119 Q39 -133 62 -85 L62 -44 83 -14 65 -7 70 18 60 29 59 51 Q47 88 8 105 L-25 112 -67 54 -84 -31Z',P,3)+p(hair,I,3)+p('M47 -32 L63 -30 M61 26 L69 22 M-27 31 Q-9 6 0 31 L-6 52','none',3)+p('M-65 -101 Q-94 -22 -66 36','none',2,G)+(s?rect(-11,45,8,24,P,2):r?ellipse(-19,46,8,12,'none',3):rect(14,-55,24,7,P,1));
 }
 const q=angle==='three-quarter';
 let face=p(r?'M-86 -83 Q-105 -26 -91 39 L-77 82 -37 112 17 116 76 77 91 31 Q106 -35 83 -92 Q5 -145 -86 -83Z':'M-86 -83 Q-105 -26 -82 39 L-65 73 Q-34 105 0 121 Q40 108 70 70 L88 31 Q106 -35 83 -92 Q5 -145 -86 -83Z',P,3.5);
 face+=p('M-88 0 Q-112 -13 -105 28 Q-101 49 -81 48 M88 -1 Q112 -14 103 29 Q99 48 81 47',P,3);
 face+=p('M-95 -4 L-86 33 -78 15 M94 -6 L86 32 79 15','none',1.4);
 face+=p('M70 21 L57 67 6 112 40 101 70 71 86 33Z','url(#fine)',0);
 face+=eye(q?-46:-45,-12,1,expr,kind)+g(q?42:45,-12,q?.78:1,eye(0,0,-1,expr,kind));
 face+=p(r?(q?'M19 4 L7 35 30 42 M13 46 L25 47':'M7 5 L-7 34 16 41 M-8 43 L4 47'):q?'M18 4 L10 37 26 41 M19 45 L24 43':'M5 7 L-3 38 10 42 M-7 45 L0 47','none',2);
 face+=p(expr==='surprised'?'M-9 72 Q2 58 14 71 Q17 86 1 88 Q-11 86 -9 72Z':r?'M-31 70 Q6 89 37 59 Q19 89 -8 84Z':expr==='worried'?'M-24 79 Q2 66 23 78':s?'M-20 77 L22 77':'M-21 75 Q2 80 24 72',expr==='surprised'||r?I:'none',2);
 if(n) face+=ellipse(56,44,2.5,2.5,I,0);
 if(r)face+=ellipse(-104,42,8,12,'none',3)+p('M-49 62 L-42 72 M38 50 L42 59 M-1 100 L12 102','none',1.5);
 let hair;
 if(n) hair=p('M-94 58 Q-116 18 -107 -72 Q-109 -136 -51 -154 Q10 -182 74 -146 Q114 -124 111 -58 L99 67 75 83 78 10 58 -48 45 -24 27 -64 14 -31 -6 -66 -22 -29 -37 -60 -58 -31 -67 -51 -80 -9 -78 81Z',I,4)+p('M-86 -80 Q-65 -137 -16 -140 M16 -146 Q67 -148 88 -105 M-96 -29 L-92 30 M94 -25 L91 45','none',2,G)+rect(58,-53,31,8,P,1);
 else if(s) hair=p('M-96 68 L-107 -45 Q-110 -135 -44 -159 Q38 -188 93 -133 Q120 -104 106 -34 L100 96 76 79 80 -24 51 -100 Q24 -58 -53 -48 L-79 -9 -75 83Z',I,4)+p('M-79 -67 Q-30 -79 42 -122 M-91 -51 L-88 47 M93 -64 L92 53','none',2,G)+rect(91,46,8,24,P,2);
 else hair=p('M-96 19 L-119 -21 -102 -35 -127 -87 -80 -73 -73 -138 -28 -115 26 -169 47 -132 105 -138 85 -102 130 -77 99 -51 107 -4 83 31 69 -14 43 -47 21 -34 27 -72 -7 -45 -14 -80 -43 -44 -49 -66 -77 -29 -77 37Z',I,4)+p('M-84 -78 Q-42 -77 14 -134 M36 -113 L73 -119 M-93 -45 L-47 -58','none',2,G);
 return face+hair;
}
function satchel(){return p('M-97 255 Q-164 268 -154 325 L-150 393 Q-130 412 -76 396 L-62 320Z',P,4)+p('M-153 286 L-61 286 -73 332 -146 338Z','url(#hatch)',3)+rect(-116,318,20,19,I,2)+p('M-141 355 L-138 380 M-132 356 L-130 385 M-83 349 L-86 382','none',1.5);}
function body(kind='neri',back=false){
 const s=kind==='sera',r=kind==='rook';
 let b=p('M-25 99 L-27 144 -63 161 0 199 62 160 25 143 24 103',P,3);
 b+=p(s?'M-52 145 L-112 171 -146 341 -108 359 -81 269 -84 462 0 490 88 458 79 266 109 355 145 336 110 170 48 144Z':r?'M-42 144 L-103 162 -145 294 -112 319 -77 241 -72 374 75 374 78 237 110 316 143 292 104 160 40 143Z':'M-50 148 L-104 171 -135 323 -101 336 -75 244 -73 389 73 389 77 242 102 337 138 321 107 171 50 148Z',I,4);
 b+=p('M-70 380 L-75 550 -62 609 -25 609 -13 451 10 451 26 609 64 609 78 550 71 380Z',s?I:'url(#hatch)',4);
 b+=p('M-64 600 L-75 630 -11 630 -21 601 M25 600 L17 630 81 630 65 601',I,4);
 b+=p('M-134 322 Q-150 333 -143 355 L-131 367 -119 356 -116 340 M104 337 L109 359 125 369 142 355 137 324',P,3);
 if(back) {
 b+=p('M-74 182 Q0 209 77 183 M0 215 L0 387 M-62 357 L62 357','none',2,G);
 if(kind==='neri')b+=p('M56 154 L72 176 -85 360 -101 345Z',P,3)+satchel();
 }
 else {
 b+=p(r?'M-39 145 L-60 190 -29 229 -11 193 0 246 27 192 57 205 41 144 0 177Z':s?'M-48 143 L-79 178 -12 285 0 181 14 287 79 178 47 143 0 173Z':'M-46 144 L-32 180 0 191 33 180 45 144 24 137 0 157 -25 137Z',P,3);
 b+=p(s?'M0 283 L0 459 M-55 324 L-35 324 M35 324 L54 324':'M0 193 L0 378 M-58 263 L-24 263 M26 263 L59 263','none',2,G);
 if(kind==='neri') b+=p('M56 154 L72 176 -85 360 -101 345Z',P,3)+satchel()+rect(-12,210,8,10,P,1)+rect(-12,237,8,10,P,1);
 if(s) b+=rect(31,216,22,27,P,2)+p('M35 222 L49 222 M35 228 L49 228 M-111 184 L-75 173 M74 173 L111 184','none',3,P);
 if(r) b+=p('M-76 346 Q0 368 77 344 L76 362 Q0 380 -75 361Z',P,3)+p('M38 361 Q58 397 40 418 M43 361 Q75 411 52 434','none',4,P);
 }
 b+=p('M-96 201 L-112 294 M98 207 L112 293 M-48 467 L-45 550 M46 465 L48 550','none',2,s?G:I);
 return b;
}
function human(kind='neri',angle='front',expr='neutral',full=true){
 if(!full)return head(kind,angle,expr);
 // Adult figure proportions: roughly 5.6 heads, not a child-sized/chibi body.
 const costume=body(kind,angle==='back');
 return g(0,-80,1,`<g transform="translate(0 -40) scale(${angle==='profile'?.62:1} 1.5)">${costume}</g>`+g(0,80,.6,head(kind,angle,expr)));
}
function pip(expr='smug',angle='front',full=true){
 let b=full?p('M-53 91 Q-87 119 -100 173 L-163 145 -177 165 Q-134 224 -81 211 L-50 174 -55 274 -31 298 1 278 29 297 60 275 51 174 98 151 87 124 43 103Z',V,4)+p('M-161 145 L-181 120 -188 125 -181 146 -203 135 -209 143 -186 165 -174 172Z',P,3)+p('M88 125 L102 105 108 110 104 125 124 112 130 120 111 145 98 151Z',P,3)+p('M-55 273 L-69 292 -29 304 -15 286 M29 283 L26 303 71 295 60 276',P,3):'';
 b+=p('M-107 57 L-148 38 -121 4 -151 -36 -113 -47 -118 -100 -75 -87 -55 -157 -14 -120 23 -176 49 -125 95 -148 93 -94 142 -75 112 -31 148 -7 111 22 120 69 79 63 61 102 -46 105 -63 77Z',V,5);
 b+=p('M-108 -36 L-134 -35 M31 -147 L40 -132 M94 -77 L118 -75','none',3,L);
 if(angle==='back')return b+p('M-71 -71 L-35 -102 -46 -33 -89 13 M14 -65 L55 -98 45 -41 90 -18','none',3,L);
 if(angle==='three-quarter')b+='<g transform="translate(19 0) scale(.82 1)">';
 b+=p('M-83 -31 L-54 -55 -33 -35 -1 -58 22 -38 52 -57 83 -31 92 31 Q73 92 3 99 Q-67 99 -88 42Z',P,3);
 if(angle==='profile')b+=ellipse(40,3,22,31,I,3)+ellipse(34,-8,7,10,P,0)+p('M72 48 Q44 69 13 58','none',4);
 else {
 b+=ellipse(-44,3,24,33,I,3)+ellipse(40,0,26,35,I,3)+ellipse(-50,-9,8,11,P,0)+ellipse(33,-13,9,12,P,0)+ellipse(-34,16,3,3,P,0)+ellipse(50,14,3,3,P,0);
 b+=p(expr==='worried'?'M-68 -42 L-29 -32 M16 -34 L62 -47':'M-69 -38 Q-48 -48 -25 -34 M16 -44 Q46 -53 64 -44','none',4);
 b+=ellipse(0,35,5,4,I,0)+p(expr==='worried'?'M-22 71 Q0 54 28 68':'M-35 56 Q9 83 55 43 Q38 96 1 82Z',expr==='worried'?'none':I,3);
 if(expr!=='worried')b+=p('M-20 64 L36 56 27 67 -2 72Z',P,1);
 }
 if(angle==='three-quarter')b+='</g>';
 if(full)b+=p('M-43 99 L-57 115 -7 136 0 116 17 137 54 113 43 99',P,3)+p('M-19 184 Q-1 194 24 181 M-33 229 L-38 263 M36 230 L40 263','none',2,L);
 return b;
}

const locks={
 neri:['19 / APPRENTICE ARCHIVIST','Broken bob + pale barrette','Viewer-right under-eye mark','High collar / two fasteners','Cross-body worn satchel'],
 pip:['CHOG-SPIRIT / NOT TOKEN ART','Spiked head / pale inset face','Glossy eyes / crooked grin','Paper collar / mitten hands','Forearm-sized / cartoon first'],
 sera:['REDACTOR CAPTAIN','Sleek side part / narrow eyes','Angular coat / paper lapels','Rectangular insignia + earring','Still posture / exact gestures'],
 rook:['HARBOR SMUGGLER','Swept hair / broader jaw','Viewer-left ring earring','Open shirt / cropped jacket','Rope belt / disarming smile']
};
function sheet(kind){
 const isP=kind==='pip';
 const person=(a,e='neutral',full=true)=>isP?pip(e==='worried'?e:'smug',a,full):human(kind,a,e,full);
 let b=rect(0,0,1800,100,I,0)+text(50,58,`CHOG / 1969     ${kind.toUpperCase()} — MODEL STUDY`,30,P)+text(50,86,'ORIGINAL FAN-STORY VECTOR DRAFT  /  NOT APPROVED FINAL ART',13,P);
 b+=p('M40 160H1760 M40 740H1760','none',1,G);
 ['FRONT','THREE-QUARTER','PROFILE','BACK'].forEach((label,j)=>{
 const x=220+j*430;
 b+=text(x,145,label,15,I,'text-anchor="middle" letter-spacing="2"');
 b+=p(`M${x} 165V735`,'none',1,G,'stroke-dasharray="4 8"');
 b+=g(x,isP?435:260,isP?1.02:.52,person(['front','three-quarter','profile','back'][j]));
 });
 b+=text(50,791,'EXPRESSION / IDENTITY LOCK',17,I,'letter-spacing="2"');
 b+=g(199,994,.67,person('front','neutral',false));
 b+=g(488,994,.67,person('three-quarter',kind==='neri'?'surprised':'worried',false));
 b+=text(199,1122,isP?'COCKY WELCOME':'RESTING FACE',13,I,'text-anchor="middle"');
 b+=text(488,1122,isP?'MEMORY FALTERS':kind==='neri'?'DISCOVERY':'UNDER PRESSURE',13,I,'text-anchor="middle"');
 b+=p('M696 782V1134','none',1,G);
 locks[kind].forEach((line,j)=>b+=text(745,830+j*48,line,j===0?22:20));
 b+=text(745,1115,'Keep these features consistent in every panel.',16);
 b+=text(50,1190,'Review: silhouette · face · costume · story fit    |    Palette proposed, not official brand colors    |    v01',15);
 b+=rect(1585,801,105,50,isP?V:I,0)+rect(1585,865,105,50,P,2)+text(1585,953,isP?'VIOLET':'INK',13)+text(1585,978,'+ PAPER',13);
 return svg(1800,1220,`${kind} character model sheet`,`${locks[kind].join('. ')}. Front, three-quarter, profile and back drafts plus expressions.`,b);
}

const assets=[];
async function save(id,folder,w,h,source,alt,extra={}){
 const rel=`${folder}/${id}`;
 await fs.mkdir(path.join(OUT,folder),{recursive:true});
 await fs.writeFile(path.join(OUT,`${rel}.svg`),source);
 const buf=Buffer.from(source);
 await sharp(buf).png({compressionLevel:9,palette:true,colours:128}).toFile(path.join(OUT,`${rel}.png`));
 await sharp(buf).webp({lossless:true,effort:6}).toFile(path.join(OUT,`${rel}.webp`));
 const files={source:`/media/${rel}.svg`,webp:`/media/${rel}.webp`,fallback:`/media/${rel}.png`};
 const bytes={},sha256={};for(const [k,v]of Object.entries(files)){
  const data=await fs.readFile(path.join(ROOT,'public',v));
  bytes[k]=data.length;sha256[k]=createHash('sha256').update(data).digest('hex');
 }
 assets.push({id,width:w,height:h,files,bytes,sha256,alt,status:'draft-awaiting-visual-approval',...extra});
 console.log(`Wrote ${rel} (${w}×${h})`);
}

// Perspective architecture: deliberately monochrome, no generic neon gradients.
function archive(w,h){
 const cx=w*.53,cy=h*.37;
 let b=rect(0,0,w,h,P,0);
 b+=p(`M0 0 L${cx-90} ${cy} ${cx-90} ${h*.76} 0 ${h}Z`,I,0);
 b+=p(`M${w} 0 L${cx+105} ${cy} ${cx+105} ${h*.76} ${w} ${h}Z`,I,0);
 b+=p(`M0 0 L${cx} ${cy} ${w} 0Z`,'url(#hatch)',0);
 // Ceiling vaults and paper-colored shelf lips converge at the reading hall.
 for(let j=0;j<6;j++){
 const t=j/6, x=w*.38*t;
 b+=p(`M${x} 0 Q${cx} ${cy*(.25+t*.68)} ${w-x} 0`,'none',j===0?8:3);
 }
 for(let j=0;j<7;j++){
 const t=j/7;
 const ya=h*(.19+j*.106),yb=cy+31+t*(h*.76-cy-31);
 b+=p(`M0 ${ya} L${cx-88} ${yb} M${w} ${ya} L${cx+105} ${yb}`,'none',j===0?8:6,P);
 }
 for(let j=0;j<19;j++){
 const t=j/19, xp=w*.43*t,top=cy*t,bottom=h-(h*.24*t);
 b+=p(`M${xp} ${top} L${xp} ${bottom} M${w-xp} ${top} L${w-xp} ${bottom}`,'none',j%4===0?7:2,P);
 // Small spine bands and paper labels separate books from architectural rails.
 for(let row=0;row<6;row++){
 const u=xp/(cx-88),leftY=h*(.19+row*.106),endY=cy+31+(row/7)*(h*.76-cy-31);
 const yy=leftY+(endY-leftY)*u+18*(1-u);
 if(j%3!==0)b+=p(`M${xp+5} ${yy} l${20*(1-u)} ${3*u} M${w-xp-5} ${yy} l${-20*(1-u)} ${3*u}`,'none',2,P);
 if((j+row)%5===0)b+=rect(xp+5,yy+8,12*(1-u),16*(1-u),P,0);
 }
 if(j%4===0) b+=p(`M${xp+7} ${top+30} L${xp+7} ${bottom-12}`,'none',1,G);
 }
 b+=p(`M0 ${h} L${cx-90} ${h*.76} H${cx+105} L${w} ${h}Z`,'url(#dots)',3);
 for(let j=0;j<11;j++) b+=p(`M${w*j/10} ${h} L${cx} ${cy}`,'none',1.1);
 for(let j=0;j<5;j++){const y=h*.78+j*j*h*.008;b+=p(`M0 ${y}H${w}`,'none',1);}
 b+=p(`M${cx-81} ${h*.76}V${cy+13} Q${cx+3} ${cy-120} ${cx+95} ${cy+13} V${h*.76}`,P,6);
 b+=p(`M${cx-44} ${h*.76}V${cy+26} Q${cx+5} ${cy-35} ${cx+58} ${cy+26} V${h*.76}`,'url(#hatch)',2);
 b+=p(`M${cx+6} ${cy-5}V${h*.76} M${cx-42} ${cy+68}H${cx+57}`,'none',5);
 // Restricted archive tags: abstract blocks rather than fake generated text.
 for(const x of [w*.1,w*.84])b+=rect(x,h*.26,w*.066,h*.06,P,3)+rect(x+8,h*.28,w*.05,5,I,0);
 return b;
}
function book(x,y,s=1){return g(x,y,s,p('M-130 -35 L-5 -12 112 -47 135 50 4 87 -129 60Z',P,4)+p('M-5 -12 L4 87 M-113 -15 L-25 2 M-110 0 L-26 16 M-105 17 L-30 31 M18 -2 L96 -26 M21 14 L104 -9','none',2)+p('M-122 65 L4 95 137 55','none',5));}
function paper(x,y,s=1,rotation=-12){return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${s})">${p('M-120 -130 L84 -130 122 -92 122 135 -120 135Z',P,4)}${p('M84 -130 L84 -92 122 -92','none',2)}${p('M-94 -99 L14 -99 M-94 -84 L-26 -84 M-94 100 L30 100 M-94 112 L61 112','none',2)}${g(3,0,.38,pip('smug','front',false))}</g>`;}
function motionRays(w,h,cx,cy){
 let b='';
 for(let j=0;j<44;j++){
 const a=j*Math.PI*2/44;
 const dx=Math.cos(a),dy=Math.sin(a),r=Math.max(w,h)*.9,r2=(.24+(j%5)*.035)*Math.min(w,h);
 b+=p(`M${cx+dx*r} ${cy+dy*r} L${cx+dx*r2} ${cy+dy*r2}`,'none',j%4===0?4:1.4,I);
 }return b;
}
function frame(name,mobile=false){
 const w=mobile?1200:1600,h=mobile?1600:1000;
 let b='';
 if(name==='cover'){
 b=archive(w,h);
 // Solid negative space is intentionally left for the app's HTML title.
 b+=p(`M0 0 H${w} V${mobile?380:245} Q${w*.5} ${mobile?470:330} 0 ${mobile?365:230}Z`,P,0);
 b+=p(`M${w*.07} ${h*.38} L${w*.87} ${h*.23}`,'none',1);
 b+=g(w*(mobile?.47:.51),h*(mobile?.53:.52),mobile?1.5:1.17,human('neri','three-quarter','worried'));
 b+=paper(w*(mobile?.64:.64),h*(mobile?.76:.76),mobile?1.05:.83,-17);
 b+=g(w*(mobile?.76:.76),h*(mobile?.64:.60),mobile?.70:.64,pip());
 b+=p(`M${w*.69} ${h*.77} Q${w*.95} ${h*.73} ${w*.83} ${h*.48}`,'none',4,V);
 }else if(name==='archive'){
 b=archive(w,h);
 const s=mobile?.79:.76, x=w*(mobile?.48:.48),y=h*(mobile?.51:.40);
 b+=g(x,y,s,human('neri','three-quarter'));
 const bx=x+w*.09,by=y+h*.23,bs=mobile?.80:.69;
 b+=p(`M${x+50*s} ${y+195*s} Q${bx-65*bs} ${by+51*bs} ${bx-10*bs} ${by+65*bs} L${bx+2*bs} ${by+85*bs} Q${x+15*s} ${by+77*bs} ${x+20*s} ${y+247*s}Z`,I,3);
 b+=book(bx,by,bs);
 b+=g(bx-54*bs,by+60*bs,bs,p('M-17 1 Q-11 -13 2 -7 L31 1 Q36 10 27 15 L2 14 -16 8Z',P,3)+p('M0 0 L24 5 M-2 6 L21 11','none',1.5));
 // Foreground table and records anchor the human figure in the space.
 b+=p(`M0 ${h*.89} L${w*.28} ${h*.78} ${w*.39} ${h*.84} ${w*.18} ${h} H0Z`,I,4);
 b+=g(w*.11,h*.85,mobile?1.10:.83,book(0,0));
 b+=p(`M${w*.72} ${h} L${w*.67} ${h*.68} ${w} ${h*.77}V${h}Z`,I,4);
 b+=p(`M${w*.7} ${h*.72} L${w} ${h*.81} M${w*.73} ${h*.76} L${w} ${h*.84}`,'none',3,P);
 }else if(name==='neri-closeup'){
 b=rect(0,0,w,h,'url(#dots)',0);
 b+=p(`M0 0 H${w*.26} L${w*.14} ${h} H0Z`,I,0)+p(`M${w*.76} 0 H${w}V${h}H${w*.94}Z`,I,0);
 for(let j=0;j<9;j++)b+=p(`M0 ${j*h/9} L${w*.24} ${j*h/9+50} M${w*.85} ${j*h/9}H${w}`,'none',5,P);
 const s=mobile?3.45:2.8;
 b+=g(w*(mobile?.48:.49),h*(mobile?.47:.50),s,body('neri')+head('neri','three-quarter','worried'));
 // A narrow inset eye study reads like a manga panel, not a UI card.
 if(!mobile) b+=rect(1120,55,420,205,P,6)+g(1310,148,3.6,eye(0,0,1,'worried','neri'));
 b+=book(w*(mobile?.58:.70),h*.95,mobile?1.4:1.15);
 }else if(name==='pip-awakening'){
 b=rect(0,0,w,h,'url(#dots)',0)+motionRays(w,h,w*.56,h*.43);
 b+=p(`M0 ${h*.73} L${w*.42} ${h*.63} ${w} ${h*.75}V${h}H0Z`,I,0);
 b+=paper(w*.55,h*.82,mobile?1.5:1.1,-9);
 // A page's pale diagonal becomes a flat, constrained violet memory ribbon.
 b+=p(`M${w*.48} ${h*.83} Q${w*.77} ${h*.77} ${w*.72} ${h*.54} Q${w*.7} ${h*.46} ${w*.61} ${h*.48} L${w*.64} ${h*.53} Q${w*.77} ${h*.69} ${w*.49} ${h*.79}Z`,V,0);
 b+=g(w*(mobile?.63:.63),h*(mobile?.37:.36),mobile?1.65:1.33,pip());
 b+=g(w*(mobile?.13:.15),h*(mobile?.58:.50),mobile?1.45:1.1,human('neri','three-quarter','surprised'));
 // Falling scraps show a physical emergence instead of an unrelated floating mascot.
 for(const [x,y,s,rot]of [[.82,.61,.3,32],[.77,.79,.25,-24],[.43,.53,.19,22]])b+=`<g transform="translate(${w*x} ${h*y}) rotate(${rot}) scale(${s})">${p('M0 0 L120 -10 99 67 10 81Z',P,5)}${p('M18 20 L87 15','none',4)}</g>`;
 b+=p(`M${w*.87} ${h*.34} l15 -42 M${w*.90} ${h*.37}l36 -18`,'none',6,V);
 }
 b+=rect(16,16,w-32,h-32,'none',5);
 return {w,h,source:svg(w,h,frameNames[name].title,frameNames[name].alt,b)};
}
const frameNames={
 cover:{title:'The world forgot — cover study',alt:'Neri stands in a towering monochrome archive with a forbidden page. A tiny, grinning violet Pip peeks beside her; the upper area is reserved for the title.'},
 archive:{title:'Veyra central archive — establishing study',alt:'Converging shelves and vaulted arches dwarf Neri as she examines an open record. Foreground ledgers frame the monochrome reading hall.'},
 'neri-closeup':{title:'Neri questions the record — close-up study',alt:'Neri looks up from a record with a doubtful expression. Her broken dark fringe, pale barrette, small under-eye mark and high archive collar remain visible.'},
 'pip-awakening':{title:'The drawing just moved — Pip awakening study',alt:'A grinning, spiky violet Pip springs from an illustrated page with a raised mitten hand. Neri recoils in surprise; loose paper flies across the black-and-white archive.'}
};

async function main(){
 const mode=process.argv[2]||'all';
 if(!['all','references','scenes'].includes(mode))throw Error('Usage: node scripts/build-media-assets.mjs [all|references|scenes]');
 if(mode!=='scenes')for(const kind of Object.keys(locks))await save(`${kind}-sheet`,'references',1800,1220,sheet(kind),`${kind} model study: four views, two expressions and continuity notes.`,{kind:'reference',character:kind});
 if(mode!=='references')for(const name of Object.keys(frameNames))for(const mobile of [false,true]){
 const {w,h,source}=frame(name,mobile);
 await save(`${name}-${mobile?'portrait':'wide'}`,'frames',w,h,source,frameNames[name].alt,{kind:'story-frame',scene:name,layout:mobile?'portrait':'wide'});
 }
 if(mode==='all'){
 const comps=[];let labels=text(40,48,'CHOG / 1969 — FIRST FOUR COMPOSITIONS',30)+text(40,79,'VECTOR REVIEW DRAFTS · NOT OFFICIAL NFT ART · VISUAL APPROVAL PENDING',15);
 for(const [j,name]of Object.keys(frameNames).entries()){
 const x=40+(j%2)*780,y=145+Math.floor(j/2)*520;
 labels+=text(x,y-18,`${String(j+1).padStart(2,'0')} / ${frameNames[name].title}`,18);
 comps.push({input:await sharp(path.join(OUT,`frames/${name}-wide.png`)).resize(740,463).toBuffer(),left:x,top:y});
 }
 await sharp(Buffer.from(svg(1600,1180,'Batch 01 contact sheet','Four draft manga compositions awaiting review.',labels))).composite(comps).png({palette:true,colours:128,compressionLevel:9}).toFile(path.join(OUT,'contact-sheet.png'));
 await fs.writeFile(path.join(OUT,'manifest.json'),JSON.stringify({schemaVersion:1,batch:'01',status:'draft-awaiting-visual-approval',previews:{gallery:'/media/review.html',contactSheet:'/media/contact-sheet.png'},provenanceDocument:'docs/MEDIA_PRODUCTION.md',generator:'scripts/build-media-assets.mjs',toolchain:{node:process.version,sharp:sharp.versions.sharp,vips:sharp.versions.vips},method:'Original code-authored SVG; local Sharp rasterization; no paid generation',rights:'Independent fan-story drafts. Original geometry; Chog character/brand rights remain with their owners. Fan-art clearance pending; not official NFT art.',assets},null,2)+'\n');
 }
}
// Intentionally do NOT call main(): it would recreate the rejected invented Chog.
// Human geometry and legacy layouts stay in source as references, not a production path.
const freezeMessage='FROZEN: batch-01 layouts are reference-only; invented Pip is rejected. Await verified Genesis selection and one-hero execution approval. See docs/HERO_SCENE_APPROVAL.md.';
if(process.argv.includes('--help')) console.log(freezeMessage);
else { console.error(freezeMessage); process.exitCode=2; }
