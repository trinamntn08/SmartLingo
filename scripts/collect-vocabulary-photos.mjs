// Explicit maintenance tool, never run by tests/build/playback. Node --import tsx.
// Only Commons-hosted JPEG photographs with reusable per-file rights are accepted.
import { lessons } from '../packages/content/src/index.ts';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const directory = fileURLToPath(new URL('../apps/learner/public/vocabulary-photos/', import.meta.url));
const registryPath = new URL('../packages/content/src/photos/catalogue.json', import.meta.url);
const api = 'https://commons.wikimedia.org/w/api.php';
const agent = 'SmartLingo-local-curriculum-preview/1.0 (educational photo curation)';
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
// key | Commons search | descriptive alt | literal IDs | contextual IDs.
// Related phrases share a scene only when it is a plausible setting for that task.
const plan = `
espresso|espresso cup|A small cup of espresso on a saucer|fr.cafe|
water|glass drinking water|A glass of drinking water|fr.eau|
baguette|baguette bread|Baguettes with a golden crust|fr.baguette|
croissant|croissant pastry|A golden crescent-shaped croissant|fr.croissant|
paper-bag|paper shopping bag|A paper shopping bag|fr.sac|fr.bakery.take-away
restaurant|restaurant terrace Paris|Outdoor tables and chairs at a Paris restaurant|fr.restaurant.terrace|fr.restaurant.book-table,fr.restaurant.reservation,fr.restaurant.for-two,fr.restaurant.ill-have
table|restaurant table setting|A restaurant table set for a meal|fr.restaurant.table|fr.restaurant.inside
egg|chicken egg white background|A chicken egg|fr.restaurant.egg|
milk|glass milk|A glass of milk|fr.restaurant.milk|
chicken|roast chicken plate|Cooked chicken served as food|fr.restaurant.chicken,fr.restaurant.main-course|
dessert|chocolate dessert plate|A chocolate dessert on a plate|fr.restaurant.dessert|
fork|dinner fork cutlery|A metal fork|fr.restaurant.fork|
knife|table knife cutlery|A table knife|fr.restaurant.knife|
napkin|table napkin|A cloth napkin for a meal|fr.restaurant.napkin|
receipt|cash register receipt|A printed till receipt|fr.restaurant.receipt,fr.shopping.proof-of-purchase|fr.addition,fr.restaurant.separately,fr.shopping.refund,fr.shopping.exchange
card|bank card payment terminal|A payment card and a card terminal|fr.restaurant.bank-card|
bread|pain de campagne bread|A round country-style loaf of bread|fr.bakery.country-loaf|fr.bakery.which-bread,fr.bakery.well-baked
sliced-bread|sliced wholemeal bread|Slices of brown bread|fr.bakery.wholemeal-bread,fr.bakery.slice,fr.bakery.sliced|
pain-chocolat|pain au chocolat|A rectangular chocolate-filled pastry|fr.bakery.pain-au-chocolat|
brioche|brioche bread|A golden brioche loaf|fr.bakery.brioche|
apple-turnover|chausson aux pommes|A folded apple turnover pastry|fr.bakery.apple-turnover|
tartlet|fruit tartlet|A small individual fruit tart|fr.bakery.tartlet|
sandwich|baguette sandwich|A filled baguette sandwich|fr.bakery.sandwich|
quiche|quiche lorraine slice|An egg tart cut into portions|fr.bakery.quiche,fr.bakery.portion|
cake|birthday cake|A decorated cake|fr.bakery.cake|fr.bakery.order,fr.bakery.order-in-advance,fr.bakery.collect
apple|red apple fruit|A red apple|fr.groceries.apple|
tomato|tomato fruit|A ripe red tomato|fr.groceries.tomato|
carrot|carrots vegetable|Orange carrots|fr.groceries.carrot|
potato|potato tuber|Potatoes with their skins on|fr.groceries.potato|
banana|banana fruit|A yellow banana|fr.groceries.banana|
rice|white rice bowl|White rice in a bowl|fr.groceries.rice|
pasta|dry pasta|Dry pasta shapes|fr.groceries.pasta|
flour|wheat flour bowl|White flour|fr.groceries.flour|
oil|olive oil bottle|A bottle of olive oil|fr.groceries.oil|
sugar|sugar cubes|White sugar cubes|fr.groceries.sugar|
butter|butter food|A piece of butter|fr.groceries.butter|
cheese|French cheese board|Pieces of cheese|fr.groceries.cheese|
yogurt|plain yogurt bowl|Plain yogurt|fr.groceries.yogurt|
ham|sliced ham|Slices of cooked ham|fr.groceries.ham|
cream|cream dairy bowl|Dairy cream|fr.groceries.cream|
supermarket|supermarket aisle France|Shelves along a supermarket aisle|fr.groceries.aisle-section,fr.directions.supermarket|fr.groceries.look-for,fr.groceries.need,fr.groceries.buy
basket|supermarket shopping basket|A shopping basket|fr.groceries.basket|
trolley|shopping trolley|A shopping trolley|fr.groceries.trolley|
checkout|supermarket checkout cashier|A supermarket checkout|fr.groceries.checkout|fr.groceries.how-much-cost,fr.groceries.price,fr.groceries.price-error
coins|euro coins|Euro coins|fr.groceries.change|fr.groceries.cash
trousers|trousers clothing|A pair of trousers|fr.shopping.trousers|
shirt|shirt clothing|A shirt with a collar and buttons|fr.shopping.shirt|
tshirt|plain T shirt|A short-sleeved T-shirt|fr.shopping.t-shirt|
dress|dress clothing|A dress|fr.shopping.dress|
jumper|knitted sweater|A knitted jumper|fr.shopping.jumper|
coat|winter coat clothing|A winter coat|fr.shopping.coat|
shoes|leather shoes pair|A pair of shoes|fr.shopping.shoes|
trainers|running shoes pair|A pair of trainers|fr.shopping.trainers|
socks|pair socks|A pair of socks|fr.shopping.socks|
scarf|knitted scarf|A knitted scarf|fr.shopping.scarf|
belt|leather belt|A belt with a buckle|fr.shopping.belt|
hat|straw hat|A straw hat|fr.shopping.hat|
jacket|jacket clothing|A jacket|fr.shopping.jacket|
fitting-room|fitting room clothing|A clothes-shop fitting room|fr.shopping.fitting-room|fr.shopping.try-on,fr.shopping.clothing-size,fr.shopping.fits-me,fr.shopping.does-not-fit
kitchen|domestic kitchen interior|A kitchen with cupboards and a worktop|fr.housing.kitchen|
bedroom|bedroom interior|A bedroom with a bed|fr.housing.bedroom,fr.housing.bed|fr.routine.se-coucher
bathroom|bathroom interior bathtub|A bathroom with a bath|fr.housing.bathroom|
toilet|toilet bathroom|A toilet|fr.housing.toilet|
living-room|living room interior|A living room with seating|fr.housing.living-room|fr.housing.furnished
chair|wooden chair|A wooden chair|fr.housing.chair|
sofa|sofa furniture|A sofa|fr.housing.sofa|
fridge|refrigerator kitchen|A household refrigerator|fr.housing.fridge|fr.cooking.put-in-fridge
washer|washing machine front loading|A front-loading washing machine|fr.housing.washing-machine|
wardrobe|wardrobe furniture|A wardrobe|fr.housing.wardrobe|
key|door key|A metal door key|fr.housing.key|
door|house entrance door France|A house entrance door|fr.housing.door|fr.housing.open
lift|elevator doors|Lift doors|fr.housing.lift|
stairs|interior staircase|An indoor staircase|fr.housing.stairs|fr.housing.floor,fr.housing.ground-floor
radiator|radiator heating|A heating radiator|fr.housing.heating|
tap|water faucet tap|A water tap|fr.housing.tap|fr.housing.leak,fr.accommodation.hot-water
window|house window|A house window|fr.housing.window|
bus|city bus France|A city bus in France|fr.transport.bus|fr.transport.take-bus
metro|Paris metro train station|A Paris metro train at a station|fr.transport.metro|
train|SNCF train platform|A French train beside a platform|fr.transport.train|
bicycle|bicycle city|A bicycle|fr.transport.bicycle|
tram|tramway France|A tram in a French street|fr.transport.tram|
pharmacy|pharmacie France green cross|A French pharmacy with a green cross|fr.health.pharmacie|fr.health.medicament,fr.health.ordonnance,fr.health.notice
notebook|notebook paper pen|A notebook and a pen|fr.work.cahier,fr.work.stylo|fr.essentials.write-it,fr.work.exercice,fr.education.recopier,fr.education.souligner
computer|desktop computer desk|A computer on a desk|fr.work.ordinateur|fr.education.en-ligne,fr.administration.se-connecter,fr.administration.connexion,fr.administration.reseau,fr.digital.download,fr.digital.upload,fr.digital.open,fr.digital.save,fr.digital.log-out
printer|office printer|An office printer|fr.work.imprimer|fr.administration.copie
meeting|office meeting people|People taking part in a workplace meeting|fr.work.reunion,fr.work.equipe|fr.work.collegue,fr.work.travail,fr.work.ensemble,fr.work.proposer,fr.work.solution,fr.jobsearch.travailler,fr.jobsearch.emploi,fr.jobsearch.metier
townhall|mairie France town hall|A French town hall|fr.administration.mairie|
postoffice|bureau de poste France|A French post office|fr.administration.poste|fr.administration.poster
stamp|French postage stamp|A French postage stamp|fr.administration.timbre|
parcel|cardboard parcel box|A cardboard parcel|fr.administration.colis|fr.administration.destinataire
street|residential street France|A residential street in France|fr.administration.rue,fr.people.quartier|fr.administration.adresse,fr.administration.code-postal
city|French town panorama|A town in France|fr.people.ville|fr.people.venir-de
clock|analog wall clock|An analogue wall clock|fr.routine.heure|fr.routine.minute,fr.education.duree,fr.social.what-time,fr.social.set-time
breakfast|French breakfast croissant coffee|A breakfast with bread and coffee|fr.routine.petit-dejeuner,fr.accommodation.breakfast|
reading|person reading book|A person reading a book|fr.leisure.lire|fr.education.page,fr.education.reviser,fr.education.devoirs,fr.work.apprendre
garden|gardener gardening vegetable garden|A person working in a vegetable garden|fr.leisure.jardiner|
rain|rain street umbrella|Rain falling in a street|fr.leisure.pleuvoir|
sun|sun clear blue sky|The sun in a clear blue sky|fr.leisure.soleil|fr.leisure.beau,fr.leisure.chaud
snow|snow winter street|A street covered with snow| |fr.leisure.froid
running|person running park|A person running outdoors|fr.leisure.courir|fr.leisure.sport,fr.education.s-entrainer
walking|people walking park|People walking outdoors|fr.leisure.marcher|fr.transport.on-foot,fr.directions.how-long-walk
swimming|swimming pool swimmer|A swimmer in a swimming pool|fr.leisure.nager,fr.leisure.piscine|
museum|museum gallery visitors|Visitors in a museum gallery|fr.leisure.musee|fr.leisure.sortie,fr.past.visit,fr.past.discover
square|town square France|A town square in France|fr.directions.square|fr.social.meeting-place
crossroads|road intersection France|Roads meeting at a junction|fr.directions.crossroads|
bridge|bridge river France|A bridge over a river in France|fr.directions.bridge|
traffic-light|traffic light France|A traffic light in France|fr.directions.traffic-light|
crossing|pedestrian crossing France|A pedestrian crossing marked on the road|fr.directions.crossing|fr.directions.cross
library|public library interior books|Bookshelves in a public library|fr.directions.library|
board|wooden chopping board kitchen|A wooden chopping board|fr.cooking.chopping-board|
bowl|ceramic bowl|A ceramic bowl|fr.cooking.bowl|
spoon|tablespoon cutlery|A metal spoon|fr.cooking.spoon|
scales|kitchen scales|A set of kitchen scales|fr.cooking.kitchen-scales|fr.groceries.kilogram
handwashing|washing hands soap|Hands being washed with soap and water|fr.cooking.wash-hands|
onion|onion vegetable|An onion|fr.cooking.onion|
garlic|garlic cloves|A garlic bulb and cloves|fr.cooking.garlic|
courgette|zucchini courgette|A green courgette|fr.cooking.courgette|
salt|table salt bowl|Table salt|fr.cooking.salt|
pepper|black peppercorns|Black peppercorns|fr.cooking.pepper|
saucepan|saucepan kitchen|A saucepan|fr.cooking.saucepan|
frying-pan|frying pan|A frying pan|fr.cooking.frying-pan|
oven|kitchen oven|A kitchen oven|fr.cooking.oven|fr.cooking.cook,fr.bakery.heat-up
hotel|hotel France entrance|The entrance to a hotel in France|fr.accommodation.hotel|fr.accommodation.book-room,fr.accommodation.leave-room
hotel-bed|hotel double bed room|A hotel room with a double bed|fr.accommodation.double-room|fr.accommodation.bed-linen,fr.accommodation.change-rooms
towel|bath towel|A bath towel|fr.accommodation.bath-towel|
luggage|suitcases luggage|Suitcases for travelling|fr.accommodation.luggage|fr.accommodation.leave-bags
airconditioner|air conditioner wall mounted|A wall-mounted air conditioner|fr.accommodation.air-conditioning|
dictionary|French dictionary book|A French dictionary|fr.education.dictionnaire|fr.education.chercher-un-mot,fr.education.traduction,fr.essentials.what-means,fr.essentials.in-french
phone|mobile phone hand|A mobile phone held in a hand|fr.digital.phone|fr.digital.call-noun,fr.digital.call-verb,fr.digital.pick-up,fr.digital.hang-up,fr.digital.voicemail,fr.digital.message,fr.digital.text-message,fr.digital.reply,fr.digital.receive,fr.digital.forward
camera|person taking photograph camera|A person taking a photograph with a camera|fr.past.take-photos|fr.past.memory
restaurant-dinner|friends dinner table|People sharing a meal at a table|fr.social.dinner|fr.social.invitation,fr.social.come-to-mine,fr.social.join,fr.social.meet-up,fr.leisure.inviter,fr.leisure.ca-te-dit,fr.leisure.avec-plaisir,fr.social.willingly
toothbrush|File:Toothbrush.jpg|A toothbrush standing in a cup||fr.routine.brush-teeth
interview|File:Job interview.jpg|Two adults seated across a desk for a job interview||fr.jobsearch.entretien,fr.jobsearch.se-presenter,fr.jobsearch.parcours,fr.jobsearch.experience,fr.jobsearch.competence,fr.jobsearch.motive,fr.jobsearch.disponibilite,fr.jobsearch.recontacter,fr.jobsearch.embaucher,fr.jobsearch.accepter,fr.jobsearch.refuser
medical-visit|doctor patient consultation photograph|A health professional and an adult at a consultation||fr.health.prendre-rendez-vous,fr.health.expliquer,fr.health.mal,fr.health.douleur,fr.health.fatigue,fr.health.fievre
greeting|people shaking hands greeting|Two people shaking hands||fr.bonjour,fr.merci,fr.silvousplait,fr.people.enchante,fr.people.rencontrer,fr.people.bienvenue,fr.people.au-revoir,fr.essentials.thank-you,fr.essentials.welcome-response
adult-class|adult language classroom students|Adults taking part in a classroom activity||fr.work.cours,fr.work.comprendre,fr.work.aider,fr.education.en-presentiel,fr.education.niveau,fr.education.debutant,fr.education.ecouter,fr.education.travailler-a-deux,fr.education.seance,fr.education.progres,fr.education.avoir-du-mal-a,fr.education.a-son-rythme,fr.people.parler,fr.people.langue,fr.people.question,fr.people.reponse,fr.people.pas-compris,fr.essentials.not-understand,fr.essentials.repeat-please,fr.essentials.more-slowly,fr.essentials.again-please,fr.essentials.understood
paperwork|person writing paperwork desk|A person writing on paper at a desk||fr.work.document,fr.work.envoyer,fr.work.tache,fr.administration.formulaire,fr.administration.dossier,fr.administration.justificatif,fr.administration.signature,fr.administration.remplir,fr.administration.aide,fr.administration.procedure,fr.administration.attestation,fr.administration.submit-file,fr.administration.acknowledgement,fr.accommodation.complete-form,fr.accommodation.sign,fr.education.inscription,fr.education.s-inscrire,fr.jobsearch.candidature,fr.jobsearch.postuler,fr.jobsearch.cv,fr.jobsearch.lettre-de-motivation,fr.jobsearch.contrat
calendar|desk calendar paper photograph|A paper calendar on a desk||fr.routine.date,fr.routine.semaine,fr.routine.lundi,fr.routine.samedi,fr.routine.aujourdhui,fr.routine.jour,fr.routine.every-day,fr.routine.weekdays,fr.routine.weekend,fr.calendar.tuesday,fr.calendar.wednesday,fr.calendar.thursday,fr.calendar.friday,fr.calendar.which-day,fr.calendar.sunday,fr.calendar.yesterday,fr.calendar.january,fr.calendar.february,fr.calendar.march,fr.calendar.april,fr.calendar.may,fr.calendar.june,fr.calendar.july,fr.calendar.august,fr.calendar.september,fr.calendar.october,fr.calendar.november,fr.calendar.december,fr.calendar.month,fr.calendar.year,fr.calendar.first-date,fr.calendar.next-week,fr.bakery.tomorrow,fr.administration.deadline,fr.health.disponible,fr.health.annuler,fr.health.deplacer,fr.health.empechement,fr.health.creneau,fr.health.confirmer,fr.leisure.prevoir,fr.leisure.reporter,fr.social.free,fr.social.suits-me,fr.social.change-plan,fr.work.delai,fr.work.horaire,fr.education.emploi-du-temps,fr.past.last-weekend,fr.past.last-week,fr.past.day-before-yesterday,fr.past.recently,fr.past.that-day
`;
const reviewedSearches = {
  water: 'File:Glass of water.jpg',
  potato: 'File:Potato.jpg',
  quiche: 'File:Quiche.jpg',
  fork: 'File:Fork.jpg',
  knife: 'File:Knife.jpg',
  receipt: 'File:Receipt.jpg',
  shirt: 'File:Shirt.jpg',
  dress: 'File:Dress.jpg',
  cream: 'File:Cream.jpg',
  'paper-bag': 'intitle:"paper bag" -maker -sculpture -drawing',
  restaurant: 'intitle:"restaurant terrace" -painting -Liebermann',
  milk: 'intitle:"glass of milk"',
  napkin: 'intitle:"cloth napkin"',
  butter: 'intitle:"butter" -peanut -butterfly -fly -butterflies -sculpture -flower -sandwich',
  basket: 'intitle:"shopping basket" -toy -pushcart',
  trolley: 'intitle:"shopping trolley" -barnacles -abandoned -river -seaweed',
  jumper: 'intitle:"sweater" -dog -cat -band -music -album -singer -painting',
  jacket: 'File:Jacket.jpg',
  hat: 'File:Hat.jpg',
  metro: 'intitle:"MP 14" intitle:"Paris"',
  printer: 'intitle:"laser printer"',
  street: 'intitle:"street in France" -derelict -abandoned',
  city: 'intitle:"panorama" intitle:"Lyon"',
  garden: 'intitle:"gardening" -cover -book -manual -seed -painting -art',
  'traffic-light': 'File:Traffic light.jpg',
  swimming: 'File:Swimming pool.jpg',
  bridge: 'File:Bridge.jpg',
  library: 'File:Library.jpg',
  bathroom: 'intitle:"bathroom" intitle:"bathtub"',
  'living-room': 'intitle:"living room" -joglo -art -sculpture -painting -museum',
  'fitting-room': 'intitle:"fitting room" -4808979962',
  stairs: 'intitle:"staircase" -palace -ceiling -art -museum',
  tap: 'intitle:"water tap" -fountain -outdoor',
  courgette: 'intitle:"green zucchini" -twin',
  pepper: 'intitle:"black peppercorns"',
  saucepan: 'File:Saucepan.jpg',
  hotel: 'intitle:"hotel" intitle:"Paris" -art -painting -interior',
  towel: 'File:Towel.jpg',
};

const strip = value => String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const vocabulary = [...new Map(lessons.flatMap(l => l.vocabulary).map(v => [v.id + '\0' + v.target, v])).values()];
async function jsonFetch(url) {
  const response = await fetch(url, { headers: { 'User-Agent': agent }, signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`Source HTTP ${response.status}`);
  return response.json();
}
async function findCandidates(query) {
  const params = new URLSearchParams({action:'query',format:'json',prop:'imageinfo',iiprop:'url|extmetadata|size|mime',iiurlwidth:'480'});
  if(query.startsWith('File:')) params.set('titles',query);
  else for(const [key,value] of Object.entries({generator:'search',gsrsearch:`${query} filetype:bitmap`,gsrnamespace:'6',gsrlimit:'8'})) params.set(key,value);
  const result = await jsonFetch(`${api}?${params}`);
  return Object.values(result.query?.pages ?? {}).sort((a,b) => a.index - b.index).filter(page => {
    const image = page.imageinfo?.[0];
    const meta = image?.extmetadata;
    const license = strip(meta?.LicenseShortName?.value);
    return image?.mime === 'image/jpeg' && image.width >= 300 && image.height >= 180 && meta &&
      /^(CC0|Public domain|CC BY(?:-SA)? [234])/i.test(license) &&
      !/painting|drawing|illustration|map of|diagram|logo|AI.generated|scanned|historical|engraving|postcard|fossil|NGA | MET |Rijksmuseum|Brooklyn Museum|LACMA|National Gallery of Art/i.test(`${page.title} ${strip(meta.Categories?.value)} ${strip(meta.ImageDescription?.value)}`);
  });
}
async function download(row) {
  const [key,query,alt,literal,context] = row.split('|').map(x=>x.trim());
  const previous = existing.find(asset => asset.key === key);
  if (previous) return previous;
  const candidates = await findCandidates(reviewedSearches[key] ?? query);
  if (!candidates.length) { console.log(`GAP ${key}`); return undefined; }
  // Concise object titles beat incidental mentions in long event/museum titles.
  const page = candidates.sort((a,b)=>a.title.length-b.title.length)[0];
  const image = page.imageinfo[0], meta = image.extmetadata;
  const response = await fetch(image.thumburl ?? image.url, {headers:{'User-Agent':agent},signal:AbortSignal.timeout(45000)});
  if (!response.ok) throw new Error(`Image ${key}: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 500000 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes.at(-2)!==0xff || bytes.at(-1)!==0xd9) throw new Error(`Not a bounded JPEG: ${key}`);
  await writeFile(`${directory}${key}.jpg`, bytes);
  const bindings = [];
  for (const [ids,kind] of [[literal,'literal'],[context,'context']]) for (const id of ids.split(',').filter(Boolean)) {
    const entries = vocabulary.filter(v => v.id === id);
    if (!entries.length) throw new Error(`Unknown vocabulary ID ${id}`);
    for(const entry of entries) bindings.push({id,target:entry.target,kind,alt:kind==='context'?`Context photograph: ${alt.charAt(0).toLowerCase()+alt.slice(1)}`:alt});
  }
  const asset = {key,filename:`${key}.jpg`,uri:`/vocabulary-photos/${key}.jpg`,alt,sourcePage:image.descriptionurl,sourceTitle:page.title,originalUrl:image.url,downloadUrl:image.thumburl ?? image.url,author:strip(meta.Artist?.value),credit:strip(meta.Credit?.value),license:strip(meta.LicenseShortName?.value),licenseUrl:meta.LicenseUrl?.value ?? 'https://commons.wikimedia.org/wiki/Commons:Public_domain',attribution:strip(meta.Attribution?.value),description:strip(meta.ImageDescription?.value),categories:strip(meta.Categories?.value),modifications:'Wikimedia-generated 480px thumbnail; no additional edits.',retrieved:'2026-11-15',sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,width:image.thumbwidth??image.width,height:image.thumbheight??image.height,bindings};
  console.log(`${key}: ${asset.license}: ${page.title}`);
  return asset;
}
await mkdir(directory,{recursive:true});
await mkdir(new URL('../packages/content/src/photos/',import.meta.url),{recursive:true});
let existing=[];
try {existing=JSON.parse(await readFile(registryPath,'utf8'));} catch(error) {if(error.code!=='ENOENT')throw error;}
const replace=process.argv.find(arg=>arg.startsWith('--replace='))?.slice(10).split(',');
const only=process.argv.find(arg=>arg.startsWith('--only='))?.slice(7).split(',');
if(replace)existing=existing.filter(a=>!replace.includes(a.key));
const rows=plan.trim().split('\n').filter(row=>(!replace||replace.includes(row.split('|')[0]))&&(!only||only.includes(row.split('|')[0])));
const assets=[];
let next=0;
async function worker(){while(next<rows.length){const row=rows[next++];try{const asset=await download(row);if(asset)assets.push(asset);}catch(error){console.log(`FAILED ${row.split('|')[0]} ${error.message}`);if(/429/.test(error.message)) {console.log('Stopping on source rate limit; rerun later preserves downloaded work.');break;}}await writeFile(registryPath,JSON.stringify([...existing.filter(a=>!assets.some(b=>a.key===b.key)),...assets],null,2)+'\n');if(!existing.some(a=>a.key===row.split('|')[0]))await pause(6500);}}
await worker();
console.log(`Collected ${assets.length}/${rows.length} photos; run the separate review/generation script after visual curation.`);
