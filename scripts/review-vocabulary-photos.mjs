// Local visual QA and catalogue generation; no network requests.
// node --import tsx scripts/review-vocabulary-photos.mjs [--generate]
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { lessons } from '../packages/content/src/index.ts';
const assetsDirectory = fileURLToPath(new URL('../apps/learner/public/vocabulary-photos/', import.meta.url));
const cataloguePath = new URL('../packages/content/src/photos/catalogue.json',import.meta.url);
const assets=JSON.parse(await readFile(cataloguePath,'utf8'));
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeLink=(value,hosts,httpsOnly=false)=>{const parsed=new URL(value);if(!(httpsOnly?['https:']:['https:','http:']).includes(parsed.protocol)||!hosts.includes(parsed.hostname))throw new Error('Invalid credits link');return escape(value);};
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1250,height:1000}});
const cards=[];
for(const asset of assets){
  const bytes=await readFile(assetsDirectory+asset.filename);
  if(createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw new Error(`Hash mismatch: ${asset.key}`);
  const dataUrl=`data:image/jpeg;base64,${bytes.toString('base64')}`;
  const dimensions=await page.evaluate(async url=>{const img=new Image();img.src=url;await img.decode();return{width:img.naturalWidth,height:img.naturalHeight};},dataUrl);
  asset.width=dimensions.width;asset.height=dimensions.height;
  cards.push(`<article><img src="${dataUrl}" alt=""><b>${escape(asset.key)}</b><small>${escape(asset.sourceTitle)}</small></article>`);
}
if(!process.argv.includes('--generate')){
  for(let start=0;start<cards.length;start+=25){
    await page.setContent(`<style>body{font:15px Arial;margin:12px;background:#fff}main{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}article{border:1px solid #777;padding:5px;min-width:0}img{width:100%;height:135px;object-fit:contain;background:#faf7ef}b,small{display:block}small{font-size:11px;overflow-wrap:anywhere}</style><main>${cards.slice(start,start+25).join('')}</main>`);
    await page.screenshot({path:assetsDirectory+`review-${String(start/25+1).padStart(2,'0')}.png`,fullPage:true});
  }
  console.log(`Decoded ${assets.length} JPEG photographs; generated ${Math.ceil(cards.length/25)} contact sheets for visual inspection.`);
} else {
  for(const asset of assets)if(asset.reviewedSha256!==asset.sha256)throw new Error(`Visual review is missing or stale: ${asset.key}`);
  const bindings=assets.flatMap(asset=>asset.bindings.map(binding=>({...binding,uri:asset.uri})));
  const unique=new Set(bindings.map(b=>b.id+'\0'+b.target));
  if(unique.size!==bindings.length)throw new Error('Duplicate sense binding');
  const vocabulary=[...new Map(lessons.flatMap(l=>l.vocabulary.map(v=>({...v,topic:l.topic}))).map(v=>[v.id+'\0'+v.target,v])).values()];
  const live=new Set(vocabulary.map(v=>v.id+'\0'+v.target));
  for(const b of bindings)if(!live.has(b.id+'\0'+b.target))throw new Error(`Stale binding: ${b.id} ${b.target}`);
  const code=`// Reviewed local photographs; maintained separately from lesson revisions.\n// Rights and byte hashes: public/vocabulary-photos/sources.json.\nexport type VocabularyPhoto = Readonly<{uri: string; alt: string; kind: 'literal' | 'context'}>;\nconst bindings = ${JSON.stringify(bindings,null,2)} as const;\nconst catalogue = new Map<string, Map<string, VocabularyPhoto>>();\nfor (const { id, target, ...photo } of bindings) {\n  let targets = catalogue.get(id);\n  if (!targets) { targets = new Map(); catalogue.set(id, targets); }\n  targets.set(target, photo);\n}\nexport function getVocabularyPhoto(id: string, target: string): VocabularyPhoto | undefined {\n  return catalogue.get(id)?.get(target);\n}\n`;
  await writeFile(new URL('../packages/content/src/photos.ts',import.meta.url),code);
  await writeFile(cataloguePath,JSON.stringify(assets,null,2)+'\n');
  await writeFile(assetsDirectory+'sources.json',JSON.stringify({version:1,reviewed:'2026-11-15',assets},null,2)+'\n');
  const creditCards=assets.map(asset=>`<article id="${escape(asset.key)}"><img src="${escape(asset.filename)}" alt="${escape(asset.alt)}" loading="lazy"><div><h2>${escape(asset.key.replaceAll('-',' '))}</h2><p><a href="${safeLink(asset.sourcePage,['commons.wikimedia.org','www.pexels.com'],true)}">${escape(asset.sourceTitle.replace(/^File:/,''))}</a> by ${escape(asset.author || 'Creator not supplied in source metadata')}. <a href="${safeLink(asset.licenseUrl,['creativecommons.org','commons.wikimedia.org','www.pexels.com'])}">${escape(asset.license)}</a>.</p>${asset.attribution?`<p>Requested attribution: ${escape(asset.attribution)}</p>`:''}<p>${escape(asset.modifications)} Retrieved ${asset.retrieved}.</p></div></article>`).join('\n');
  await writeFile(assetsDirectory+'credits.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SmartLingo photo credits</title><style>body{max-width:980px;margin:auto;padding:24px;font:16px/1.6 system-ui,sans-serif;color:#18352b;background:#fffdf7}a{color:#245b43}article{display:flex;gap:22px;padding:24px 0;border-bottom:1px solid #d9d8cd}img{width:180px;height:140px;object-fit:contain;background:white}p,a,h2{overflow-wrap:anywhere}h1{line-height:1.2}h2{font-size:1.15rem;margin:0}p{margin:8px 0}@media(max-width:550px){article{display:block}img{width:100%;height:180px}}</style></head><body><a href="/">Back to SmartLingo</a><h1>Photo credits</h1><p>These photographs are bundled for offline vocabulary study. Each image keeps its own licence. Context photographs illustrate a possible setting for a phrase; they do not establish the identities, relationships, intentions or medical conditions of people shown.</p><p>Images are Wikimedia- or Pexels-generated resized JPEG thumbnails. No additional visual changes were made. CC BY-SA thumbnails remain available under the licence linked beside that image. Pexels stock uses the separately linked Pexels License. The app's original code and curriculum are separate works. <a href="sources.json">Full source, licence, author and SHA256 records</a>.</p>${creditCards}</body></html>`);
  const rows=vocabulary.map(v=>{const b=bindings.find(b=>b.id===v.id&&b.target===v.target);return`| ${v.id} | ${v.target.replaceAll('|','/')} | ${v.meaning.replaceAll('|','/')} | ${b?`${b.kind}; ${b.uri.split('/').at(-1)}`:'Gap: no reviewed suitable photograph yet'} |`;});
  const literal=bindings.filter(b=>b.kind==='literal').length,context=bindings.length-literal;
  const bytes=assets.reduce((sum,a)=>sum+a.bytes,0);
  const topicNames=[...new Set(vocabulary.map(v=>v.topic))];
  const topics=topicNames.map(topic=>{const words=vocabulary.filter(v=>v.topic===topic),count=words.filter(v=>unique.has(v.id+'\0'+v.target)).length;return`| ${topic} | ${count} | ${words.length-count} | ${words.length} |`;}).join('\n');
  await writeFile(new URL('../docs/PHOTO_COVERAGE.md',import.meta.url),`# Vocabulary photo coverage\n\nReviewed 2026-11-15. ${bindings.length}/${vocabulary.length} exact current ID/target pairs have photographs (${literal} literal, ${context} contextual); ${vocabulary.length-bindings.length} remain explicit gaps. ${assets.length} distinct local JPEG assets total ${bytes.toLocaleString('en-US')} bytes. Coverage is deliberately sense-specific; no generic image is assigned to unrelated words to inflate the count.\n\nContext photos describe the visible scene and are explicitly prefixed “Context photograph:”. They offer a possible task setting, not proof of an abstract meaning, a person's identity/role, a diagnosis or a depicted conversation. Text meanings/examples remain authoritative. Numbers, connectors and some time-relative expressions particularly need authored visual treatment; many other concrete objects still need a suitable curated photograph. Calendar contexts show a physical calendar for date/planning language, not the specific target date; clock contexts similarly do not claim that the dial displays every target time. Gaps retain the existing drawing/text fallback. All photos were decoded in Chromium and contact sheets visually reviewed; this is a bounded visual/sense review, not owner publication approval.\n\nThe lookup requires the exact stable ID and target string; editing a target removes its photo until its mapping is deliberately reviewed. Multiple current targets on one canonical ID are separate entries. Personal/unknown/inherited-property IDs do not acquire photos.\n\n## Coverage by topic\n\nEach canonical ID/target appears once, under its first current topic, so shared vocabulary is not double-counted.\n\n| Topic | With photo | Gap | Current pairs |\n| --- | --- | --- | --- |\n${topics}\n\n## Complete current inventory\n\n| Vocabulary ID | French target | English sense | Photo or remaining gap |\n| --- | --- | --- | --- |\n${rows.join('\n')}\n`);
  console.log(JSON.stringify({photos:assets.length,pairs:bindings.length,total:vocabulary.length,literal,context,bytes}));
}
await browser.close();
