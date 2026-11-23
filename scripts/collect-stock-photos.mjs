// Deliberate, bounded fallback for four individually inspected Pexels source pages.
// Not called by builds/tests/runtime. Run only after Commons collection has stopped.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { lessons } from '../packages/content/src/index.ts';
const registryPath=new URL('../packages/content/src/photos/catalogue.json',import.meta.url);
const directory=new URL('../apps/learner/public/vocabulary-photos/',import.meta.url);
const registry=JSON.parse(await readFile(registryPath,'utf8'));
const proposalText=await readFile(new URL('./collect-vocabulary-photos.mjs',import.meta.url),'utf8');
const vocabulary=[...new Map(lessons.flatMap(l=>l.vocabulary).map(v=>[v.id+'\0'+v.target,v])).values()];
const sources=[
  {key:'calendar',number:9036980,author:'Towfiqu barbhuiya',sourcePage:'https://www.pexels.com/photo/close-up-shot-of-a-calendar-9036980/',title:'Close-Up Shot of a Calendar',alt:'A paper desk calendar with a printed date grid, a pen and coloured clips'},
  {key:'paperwork',number:8730374,author:'Mikhail Nilov',sourcePage:'https://www.pexels.com/photo/a-person-writing-on-the-document-8730374/',title:'A Person Writing on the Document',alt:'A person holding a pen and writing on printed documents at a desk'},
  {key:'medical-visit',number:4266930,author:'Cedric Fauntleroy',sourcePage:'https://www.pexels.com/photo/a-woman-talking-to-her-doctor-4266930/',title:'A Woman Talking to her Doctor',alt:'Two adults seated across a desk in a medical consultation room'},
  {key:'adult-class',number:5756572,author:'RDNE Stock project',sourcePage:'https://www.pexels.com/photo/adult-man-listening-intently-while-holding-a-notebook-5756572/',title:'Adult Man Listening Intently while Holding a Notebook',alt:'Two adults with notebooks seated in a classroom'},
];
for(const source of sources){
  const row=proposalText.split('\n').find(line=>line.startsWith(source.key+'|'));
  if(!row)throw new Error(`Missing authored binding proposal: ${source.key}`);
  const [, , ,literal,context]=row.split('|');
  const bindings=[];
  for(const [ids,kind] of [[literal,'literal'],[context,'context']])for(const id of ids.split(',').filter(Boolean)){
    const matches=vocabulary.filter(v=>v.id===id);
    if(!matches.length)throw new Error(`Unknown vocabulary ID ${id}`);
    for(const entry of matches)bindings.push({id,target:entry.target,kind,alt:`Context photograph: ${source.alt.charAt(0).toLowerCase()+source.alt.slice(1)}`});
  }
  const downloadUrl=`https://images.pexels.com/photos/${source.number}/pexels-photo-${source.number}.jpeg?auto=compress&cs=tinysrgb&w=480`;
  const response=await fetch(downloadUrl,{signal:AbortSignal.timeout(45000)});
  if(!response.ok)throw new Error(`Pexels image HTTP ${response.status}`);
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length>500000||bytes[0]!==255||bytes[1]!==216||bytes.at(-2)!==255||bytes.at(-1)!==217)throw new Error('Not a bounded JPEG');
  const asset={key:source.key,filename:source.key+'.jpg',uri:'/vocabulary-photos/'+source.key+'.jpg',alt:source.alt,sourcePage:source.sourcePage,sourceTitle:source.title,originalUrl:`https://images.pexels.com/photos/${source.number}/pexels-photo-${source.number}.jpeg`,downloadUrl,author:source.author,credit:'Photo by '+source.author+' on Pexels',license:'Pexels License',licenseUrl:'https://www.pexels.com/license/',attribution:'Photo by '+source.author+' on Pexels',description:source.alt,categories:'Individually verified reusable stock photograph',modifications:'Pexels-generated 480px JPEG thumbnail; no additional edits.',retrieved:'2026-11-15',sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,width:0,height:0,bindings};
  await writeFile(new URL(asset.filename,directory),bytes);
  const previous=registry.findIndex(a=>a.key===source.key);
  if(previous===-1)registry.push(asset);else registry[previous]=asset;
  console.log(`${source.key}: ${source.author}, Pexels License, ${bytes.length} bytes`);
}
await writeFile(registryPath,JSON.stringify(registry,null,2)+'\n');
