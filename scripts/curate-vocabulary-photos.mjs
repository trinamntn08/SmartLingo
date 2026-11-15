// Explicit decisions from the 2026-11-15 contact-sheet/sense review.
// --approve records byte-specific visual approval after refreshed contact sheets.
import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import { lessons } from '../packages/content/src/index.ts';
const path=new URL('../packages/content/src/photos/catalogue.json',import.meta.url);
const directory=new URL('../apps/learner/public/vocabulary-photos/',import.meta.url);
const rejected=new Set(['fork','knife','cream','stamp','paper-bag','basket','jumper','city','garden','stairs','tap','bridge','hotel','bowl']);
const assets=JSON.parse(await readFile(path,'utf8')).filter(a=>!rejected.has(a.key));
const vocabulary=[...new Map(lessons.flatMap(l=>l.vocabulary).map(v=>[v.id+'\0'+v.target,v])).values()];
const alts={
  espresso:'An espresso viewed from above in a small cup',
  baguette:'Slices of baguette in a bread basket',
  croissant:'Several golden croissants',
  table:'A round restaurant table set with glasses and cutlery',
  egg:'Brown and white eggs in a carton',
  chicken:'Pieces of cooked chicken on a hot plate',
  dessert:'A layered chocolate dessert with chocolate sauce on a plate',
  'sliced-bread':'A sandwich made with slices of brown bread',
  brioche:'A rectangular brioche loaf with chocolate chips',
  'apple-turnover':'Several folded apple turnovers on a baking tray',
  sandwich:'A filled baguette sandwich with onions and cheese',
  cake:'Half of a decorated cake on a plate',
  apple:'Red apples growing on a tree',
  tomato:'Red tomatoes growing on a potted plant',
  carrot:'Carrots of several colours arranged with their green tops',
  banana:'A display of yellow bananas',
  pasta:'Several shapes of dry pasta',
  cheese:'Cheese and sliced meats arranged on a serving board',
  yogurt:'Yogurt served in a bowl',
  supermarket:'A supermarket aisle with stocked shelves and shopping trolleys',
  checkout:'Supermarket checkout counters',
  coins:'Euro coins and a receipt on a small payment tray',
  trousers:'A person wearing a pair of light-coloured trousers',
  tshirt:'A short-sleeved grey T-shirt laid flat',
  coat:'A beige winter coat with a hood',
  shoes:'A pair of black leather boots',
  trainers:'A pair of lace-up trainers',
  socks:'A pair of red knitted socks with split toes',
  scarf:'A knitted scarf draped around a coat collar',
  belt:'A leather belt and buckle worn with jeans',
  kitchen:'A kitchen with cupboards, a refrigerator and a small dining table',
  bedroom:'A bedroom with a partly visible bed behind red drapes',
  toilet:'A toilet and washbasin in a small bathroom',
  chair:'Outdoor chairs beside a small round table',
  sofa:'An ornate upholstered sofa',
  fridge:'A household refrigerator',
  wardrobe:'An ornate wooden wardrobe with closed doors',
  key:'An old metal lock and its key',
  door:'A red entrance door with glass panes',
  lift:'Closed lift doors',
  radiator:'A wall-mounted heating radiator',
  window:'A window in a wooden wall',
  bus:'A city bus beside a pavement',
  train:'A French train beside a station platform',
  bicycle:'A bicycle leaning against a wall beside a blue door',
  tram:'A tram at a stop in a French street',
  pharmacy:'A pharmacy entrance marked by an illuminated green cross',
  notebook:'An open notebook with handwriting and a pen',
  computer:'A desktop computer on a desk',
  meeting:'Several adults seated together in an office meeting',
  townhall:'A town hall with an illuminated entrance',
  postoffice:'The front of a French post office',
  clock:'An analogue wall clock',
  breakfast:'A croissant and a cup of coffee served for breakfast',
  reading:'An adult wearing glasses and reading an open book',
  rain:'People carrying umbrellas on a wet street',
  sun:'A field beneath a bright blue sky',
  snow:'Snow covering young trees beside a road',
  running:'A running track in a park',
  walking:'People walking along a path outdoors',
  museum:'The entrance to an art museum',
  crossroads:'A road junction surrounded by snow',
  crossing:'A pedestrian crossing illuminated with blue lights at night',
  board:'Chopped garlic, garlic cloves and a knife on a wooden chopping board',
  bowl:'A decorated ceramic bowl',
  spoon:'Two spoons, a fork and a knife arranged side by side',
  onion:'Small red onions sprouting in soil',
  garlic:'Peeled garlic cloves in a clear jar',
  salt:'Salt in a small container beside a loaf of bread',
  'hotel-bed':'A hotel bedroom with part of a bed made with white linen',
  luggage:'A brown striped suitcase with a handle',
  airconditioner:'An air-conditioning unit mounted high on a wall',
  dictionary:'An old French dictionary photographed open beside its spine',
  phone:'A mobile phone held in a hand inside a car',
  camera:'A person outdoors taking a photograph with a long-lens camera',
  'restaurant-dinner':'Adults seated at tables for a formal banquet',
  water:'A glass containing drinking water',
  restaurant:'Outdoor restaurant tables with umbrellas',
  receipt:'A paper receipt held in a hand',
  quiche:'A whole savoury egg tart with vegetables',
  potato:'A sprouting potato and two smaller potatoes on a table',
  butter:'A museum display of packaged butter products',
  trolley:'A hand gripping the handle of a wire shopping trolley',
  shirt:'A blue collared shirt with buttons',
  hat:'A straw hat with a striped band',
  jacket:'A dark buttoned jacket laid flat',
  'fitting-room':'A shop sign asking customers to seek assistance before entering the fitting room',
  bathroom:'A bathtub in a bathroom',
  'living-room':'A living room with a sofa, low table and large windows',
  printer:'A desktop laser printer',
  street:'A narrow street between buildings in France',
  swimming:'An outdoor swimming pool',
  'traffic-light':'A traffic light showing red beside a road',
  courgette:'A display of green courgettes',
  pepper:'Black peppercorns viewed close up',
  saucepan:'A saucepan with its lid on a wooden surface',
  towel:'A close-up of striped towel fabric',
  interview:'Three adults seated around a desk with papers for a job interview',
  'medical-visit':'Two adults talking in a clinic beside an examination bench',
};
const contextualIds=new Set(['fr.restaurant.main-course','fr.bakery.portion','fr.work.imprimer','fr.work.equipe','fr.routine.heure','fr.leisure.courir','fr.leisure.nager','fr.leisure.soleil','fr.accommodation.double-room','fr.accommodation.bath-towel','fr.groceries.butter','fr.shopping.fitting-room']);
const removeIds=new Set(['fr.past.recently','fr.past.that-day']);
for(const asset of assets){
  if(asset.key==='shirt'){
    asset.author='ChristianGlaeser';
    asset.sourceTitle='File:Blue Business Shirt.jpg';
    asset.credit='Own photograph by original uploader ChristianGlaeser, identified on the Commons source page/history.';
    asset.attribution='ChristianGlaeser, CC BY-SA 3.0, via Wikimedia Commons';
  }
  asset.alt=alts[asset.key]??asset.alt;
  asset.bindings=asset.bindings.filter(b=>!removeIds.has(b.id)&&!(asset.key==='greeting'&&b.id==='fr.silvousplait'));
  for(const binding of asset.bindings){if(contextualIds.has(binding.id))binding.kind='context';binding.alt=binding.kind==='context'?`Context photograph: ${asset.alt.charAt(0).toLowerCase()+asset.alt.slice(1)}`:asset.alt;}
}
const additional={
  table:['fr.silvousplait','fr.restaurant.set-menu','fr.restaurant.bring'],
  wardrobe:['fr.routine.get-dressed'],
  bedroom:['fr.routine.wake-up','fr.routine.se-lever'],
  trousers:['fr.shopping.wear'],
  shirt:['fr.shopping.another-colour','fr.shopping.colour'],
  trainers:['fr.shopping.shoe-size'],
  'living-room':['fr.housing.apartment','fr.people.habiter'],
  computer:['fr.digital.email','fr.digital.wifi','fr.administration.mot-de-passe','fr.administration.piece-jointe','fr.digital.link'],
  clock:['fr.routine.midi','fr.routine.minuit','fr.routine.et-demie','fr.routine.early','fr.routine.late','fr.routine.on-time','fr.routine.hurry','fr.health.en-retard'],
  board:['fr.cooking.cut','fr.cooking.recipe'],
  saucepan:['fr.cooking.boil','fr.cooking.low-heat','fr.cooking.let-cool'],
  bowl:['fr.cooking.mix','fr.cooking.add'],
  crossroads:['fr.directions.where-is','fr.directions.straight-on','fr.directions.turn-left','fr.directions.turn-right','fr.directions.continue','fr.directions.take-street','fr.directions.turn-back'],
  paperwork:['fr.housing.tenancy-agreement','fr.housing.landlord','fr.housing.tenant'],
};
const used=new Set(assets.flatMap(a=>a.bindings.map(b=>b.id+'\0'+b.target)));
for(const [key,ids] of Object.entries(additional))for(const id of ids){
  const asset=assets.find(a=>a.key===key);if(!asset)continue;
  for(const word of vocabulary.filter(v=>v.id===id)){const pair=id+'\0'+word.target;if(used.has(pair))continue;asset.bindings.push({id,target:word.target,kind:'context',alt:`Context photograph: ${asset.alt.charAt(0).toLowerCase()+asset.alt.slice(1)}`});used.add(pair);}
}
const cutlery=assets.find(a=>a.key==='spoon');
for(const id of ['fr.restaurant.fork','fr.restaurant.knife'])for(const word of vocabulary.filter(v=>v.id===id))if(!cutlery.bindings.some(b=>b.id===id&&b.target===word.target))cutlery.bindings.push({id,target:word.target,kind:'literal',alt:cutlery.alt});
const pan=assets.find(a=>a.key==='saucepan');
for(const word of vocabulary.filter(v=>v.id==='fr.cooking.lid'))if(!pan.bindings.some(b=>b.id===word.id))pan.bindings.push({id:word.id,target:word.target,kind:'literal',alt:pan.alt});
const shirt=assets.find(a=>a.key==='shirt');
for(const word of vocabulary.filter(v=>v.id==='fr.shopping.blue'))if(!shirt.bindings.some(b=>b.id===word.id))shirt.bindings.push({id:word.id,target:word.target,kind:'literal',alt:shirt.alt});
if(process.argv.includes('--approve'))for(const asset of assets)asset.reviewedSha256=asset.sha256;
await writeFile(path,JSON.stringify(assets,null,2)+'\n');
const retained=new Set(assets.map(a=>a.filename));
for(const filename of await readdir(directory))if((filename.endsWith('.jpg')&&!retained.has(filename))||/^review-\d+\.png$/.test(filename))await unlink(new URL(filename,directory));
console.log(`Curated ${assets.length} photographs; removed rejected/orphan assets and old review contact sheets.`);
