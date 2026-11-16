// Reviewed local photographs; maintained separately from lesson revisions.
// Rights and byte hashes: public/vocabulary-photos/sources.json.
export type VocabularyPhoto = Readonly<{uri: string; alt: string; kind: 'literal' | 'context'}>;
const bindings = [
  {
    "id": "fr.cafe",
    "target": "un café",
    "kind": "literal",
    "alt": "An espresso viewed from above in a small cup",
    "uri": "/vocabulary-photos/espresso.jpg"
  },
  {
    "id": "fr.baguette",
    "target": "une baguette",
    "kind": "literal",
    "alt": "Slices of baguette in a bread basket",
    "uri": "/vocabulary-photos/baguette.jpg"
  },
  {
    "id": "fr.croissant",
    "target": "un croissant",
    "kind": "literal",
    "alt": "Several golden croissants",
    "uri": "/vocabulary-photos/croissant.jpg"
  },
  {
    "id": "fr.restaurant.table",
    "target": "une table",
    "kind": "literal",
    "alt": "A round restaurant table set with glasses and cutlery",
    "uri": "/vocabulary-photos/table.jpg"
  },
  {
    "id": "fr.restaurant.inside",
    "target": "à l’intérieur",
    "kind": "context",
    "alt": "Context photograph: a round restaurant table set with glasses and cutlery",
    "uri": "/vocabulary-photos/table.jpg"
  },
  {
    "id": "fr.silvousplait",
    "target": "s’il vous plaît",
    "kind": "context",
    "alt": "Context photograph: a round restaurant table set with glasses and cutlery",
    "uri": "/vocabulary-photos/table.jpg"
  },
  {
    "id": "fr.restaurant.set-menu",
    "target": "un menu",
    "kind": "context",
    "alt": "Context photograph: a round restaurant table set with glasses and cutlery",
    "uri": "/vocabulary-photos/table.jpg"
  },
  {
    "id": "fr.restaurant.bring",
    "target": "apporter",
    "kind": "context",
    "alt": "Context photograph: a round restaurant table set with glasses and cutlery",
    "uri": "/vocabulary-photos/table.jpg"
  },
  {
    "id": "fr.restaurant.egg",
    "target": "un œuf",
    "kind": "literal",
    "alt": "Brown and white eggs in a carton",
    "uri": "/vocabulary-photos/egg.jpg"
  },
  {
    "id": "fr.restaurant.chicken",
    "target": "du poulet",
    "kind": "literal",
    "alt": "Pieces of cooked chicken on a hot plate",
    "uri": "/vocabulary-photos/chicken.jpg"
  },
  {
    "id": "fr.restaurant.main-course",
    "target": "un plat",
    "kind": "context",
    "alt": "Context photograph: pieces of cooked chicken on a hot plate",
    "uri": "/vocabulary-photos/chicken.jpg"
  },
  {
    "id": "fr.restaurant.dessert",
    "target": "un dessert",
    "kind": "literal",
    "alt": "A layered chocolate dessert with chocolate sauce on a plate",
    "uri": "/vocabulary-photos/dessert.jpg"
  },
  {
    "id": "fr.restaurant.bank-card",
    "target": "une carte bancaire",
    "kind": "literal",
    "alt": "A payment card and a card terminal",
    "uri": "/vocabulary-photos/card.jpg"
  },
  {
    "id": "fr.bakery.country-loaf",
    "target": "un pain de campagne",
    "kind": "literal",
    "alt": "A round country-style loaf of bread",
    "uri": "/vocabulary-photos/bread.jpg"
  },
  {
    "id": "fr.bakery.which-bread",
    "target": "quel pain",
    "kind": "context",
    "alt": "Context photograph: a round country-style loaf of bread",
    "uri": "/vocabulary-photos/bread.jpg"
  },
  {
    "id": "fr.bakery.well-baked",
    "target": "bien cuit",
    "kind": "context",
    "alt": "Context photograph: a round country-style loaf of bread",
    "uri": "/vocabulary-photos/bread.jpg"
  },
  {
    "id": "fr.bakery.wholemeal-bread",
    "target": "du pain complet",
    "kind": "literal",
    "alt": "A sandwich made with slices of brown bread",
    "uri": "/vocabulary-photos/sliced-bread.jpg"
  },
  {
    "id": "fr.bakery.slice",
    "target": "une tranche",
    "kind": "literal",
    "alt": "A sandwich made with slices of brown bread",
    "uri": "/vocabulary-photos/sliced-bread.jpg"
  },
  {
    "id": "fr.bakery.sliced",
    "target": "tranché",
    "kind": "literal",
    "alt": "A sandwich made with slices of brown bread",
    "uri": "/vocabulary-photos/sliced-bread.jpg"
  },
  {
    "id": "fr.bakery.pain-au-chocolat",
    "target": "un pain au chocolat",
    "kind": "literal",
    "alt": "A rectangular chocolate-filled pastry",
    "uri": "/vocabulary-photos/pain-chocolat.jpg"
  },
  {
    "id": "fr.bakery.brioche",
    "target": "une brioche",
    "kind": "literal",
    "alt": "A rectangular brioche loaf with chocolate chips",
    "uri": "/vocabulary-photos/brioche.jpg"
  },
  {
    "id": "fr.bakery.apple-turnover",
    "target": "un chausson aux pommes",
    "kind": "literal",
    "alt": "Several folded apple turnovers on a baking tray",
    "uri": "/vocabulary-photos/apple-turnover.jpg"
  },
  {
    "id": "fr.bakery.tartlet",
    "target": "une tartelette",
    "kind": "literal",
    "alt": "A small individual fruit tart",
    "uri": "/vocabulary-photos/tartlet.jpg"
  },
  {
    "id": "fr.bakery.sandwich",
    "target": "un sandwich",
    "kind": "literal",
    "alt": "A filled baguette sandwich with onions and cheese",
    "uri": "/vocabulary-photos/sandwich.jpg"
  },
  {
    "id": "fr.bakery.cake",
    "target": "un gâteau",
    "kind": "literal",
    "alt": "Half of a decorated cake on a plate",
    "uri": "/vocabulary-photos/cake.jpg"
  },
  {
    "id": "fr.bakery.order",
    "target": "une commande",
    "kind": "context",
    "alt": "Context photograph: half of a decorated cake on a plate",
    "uri": "/vocabulary-photos/cake.jpg"
  },
  {
    "id": "fr.bakery.order-in-advance",
    "target": "commander",
    "kind": "context",
    "alt": "Context photograph: half of a decorated cake on a plate",
    "uri": "/vocabulary-photos/cake.jpg"
  },
  {
    "id": "fr.bakery.collect",
    "target": "venir chercher",
    "kind": "context",
    "alt": "Context photograph: half of a decorated cake on a plate",
    "uri": "/vocabulary-photos/cake.jpg"
  },
  {
    "id": "fr.groceries.apple",
    "target": "une pomme",
    "kind": "literal",
    "alt": "Red apples growing on a tree",
    "uri": "/vocabulary-photos/apple.jpg"
  },
  {
    "id": "fr.groceries.tomato",
    "target": "une tomate",
    "kind": "literal",
    "alt": "Red tomatoes growing on a potted plant",
    "uri": "/vocabulary-photos/tomato.jpg"
  },
  {
    "id": "fr.groceries.carrot",
    "target": "une carotte",
    "kind": "literal",
    "alt": "Carrots of several colours arranged with their green tops",
    "uri": "/vocabulary-photos/carrot.jpg"
  },
  {
    "id": "fr.groceries.banana",
    "target": "une banane",
    "kind": "literal",
    "alt": "A display of yellow bananas",
    "uri": "/vocabulary-photos/banana.jpg"
  },
  {
    "id": "fr.groceries.rice",
    "target": "du riz",
    "kind": "literal",
    "alt": "White rice in a bowl",
    "uri": "/vocabulary-photos/rice.jpg"
  },
  {
    "id": "fr.groceries.pasta",
    "target": "des pâtes",
    "kind": "literal",
    "alt": "Several shapes of dry pasta",
    "uri": "/vocabulary-photos/pasta.jpg"
  },
  {
    "id": "fr.groceries.flour",
    "target": "de la farine",
    "kind": "literal",
    "alt": "White flour",
    "uri": "/vocabulary-photos/flour.jpg"
  },
  {
    "id": "fr.groceries.oil",
    "target": "de l’huile",
    "kind": "literal",
    "alt": "A bottle of olive oil",
    "uri": "/vocabulary-photos/oil.jpg"
  },
  {
    "id": "fr.groceries.sugar",
    "target": "du sucre",
    "kind": "literal",
    "alt": "White sugar cubes",
    "uri": "/vocabulary-photos/sugar.jpg"
  },
  {
    "id": "fr.groceries.cheese",
    "target": "du fromage",
    "kind": "literal",
    "alt": "Cheese and sliced meats arranged on a serving board",
    "uri": "/vocabulary-photos/cheese.jpg"
  },
  {
    "id": "fr.groceries.yogurt",
    "target": "un yaourt",
    "kind": "literal",
    "alt": "Yogurt served in a bowl",
    "uri": "/vocabulary-photos/yogurt.jpg"
  },
  {
    "id": "fr.groceries.ham",
    "target": "du jambon",
    "kind": "literal",
    "alt": "Slices of cooked ham",
    "uri": "/vocabulary-photos/ham.jpg"
  },
  {
    "id": "fr.groceries.aisle-section",
    "target": "un rayon",
    "kind": "literal",
    "alt": "A supermarket aisle with stocked shelves and shopping trolleys",
    "uri": "/vocabulary-photos/supermarket.jpg"
  },
  {
    "id": "fr.directions.supermarket",
    "target": "un supermarché",
    "kind": "literal",
    "alt": "A supermarket aisle with stocked shelves and shopping trolleys",
    "uri": "/vocabulary-photos/supermarket.jpg"
  },
  {
    "id": "fr.groceries.look-for",
    "target": "chercher",
    "kind": "context",
    "alt": "Context photograph: a supermarket aisle with stocked shelves and shopping trolleys",
    "uri": "/vocabulary-photos/supermarket.jpg"
  },
  {
    "id": "fr.groceries.need",
    "target": "il me faut",
    "kind": "context",
    "alt": "Context photograph: a supermarket aisle with stocked shelves and shopping trolleys",
    "uri": "/vocabulary-photos/supermarket.jpg"
  },
  {
    "id": "fr.groceries.buy",
    "target": "acheter",
    "kind": "context",
    "alt": "Context photograph: a supermarket aisle with stocked shelves and shopping trolleys",
    "uri": "/vocabulary-photos/supermarket.jpg"
  },
  {
    "id": "fr.groceries.checkout",
    "target": "une caisse",
    "kind": "literal",
    "alt": "Supermarket checkout counters",
    "uri": "/vocabulary-photos/checkout.jpg"
  },
  {
    "id": "fr.groceries.how-much-cost",
    "target": "combien ça coûte ?",
    "kind": "context",
    "alt": "Context photograph: supermarket checkout counters",
    "uri": "/vocabulary-photos/checkout.jpg"
  },
  {
    "id": "fr.groceries.price",
    "target": "un prix",
    "kind": "context",
    "alt": "Context photograph: supermarket checkout counters",
    "uri": "/vocabulary-photos/checkout.jpg"
  },
  {
    "id": "fr.groceries.price-error",
    "target": "il y a une erreur",
    "kind": "context",
    "alt": "Context photograph: supermarket checkout counters",
    "uri": "/vocabulary-photos/checkout.jpg"
  },
  {
    "id": "fr.groceries.change",
    "target": "la monnaie",
    "kind": "literal",
    "alt": "Euro coins and a receipt on a small payment tray",
    "uri": "/vocabulary-photos/coins.jpg"
  },
  {
    "id": "fr.groceries.cash",
    "target": "en espèces",
    "kind": "context",
    "alt": "Context photograph: euro coins and a receipt on a small payment tray",
    "uri": "/vocabulary-photos/coins.jpg"
  },
  {
    "id": "fr.shopping.trousers",
    "target": "un pantalon",
    "kind": "literal",
    "alt": "A person wearing a pair of light-coloured trousers",
    "uri": "/vocabulary-photos/trousers.jpg"
  },
  {
    "id": "fr.shopping.wear",
    "target": "porter",
    "kind": "context",
    "alt": "Context photograph: a person wearing a pair of light-coloured trousers",
    "uri": "/vocabulary-photos/trousers.jpg"
  },
  {
    "id": "fr.shopping.t-shirt",
    "target": "un tee-shirt",
    "kind": "literal",
    "alt": "A short-sleeved grey T-shirt laid flat",
    "uri": "/vocabulary-photos/tshirt.jpg"
  },
  {
    "id": "fr.shopping.coat",
    "target": "un manteau",
    "kind": "literal",
    "alt": "A beige winter coat with a hood",
    "uri": "/vocabulary-photos/coat.jpg"
  },
  {
    "id": "fr.shopping.shoes",
    "target": "des chaussures",
    "kind": "literal",
    "alt": "A pair of black leather boots",
    "uri": "/vocabulary-photos/shoes.jpg"
  },
  {
    "id": "fr.shopping.trainers",
    "target": "des baskets",
    "kind": "literal",
    "alt": "A pair of lace-up trainers",
    "uri": "/vocabulary-photos/trainers.jpg"
  },
  {
    "id": "fr.shopping.shoe-size",
    "target": "une pointure",
    "kind": "context",
    "alt": "Context photograph: a pair of lace-up trainers",
    "uri": "/vocabulary-photos/trainers.jpg"
  },
  {
    "id": "fr.shopping.socks",
    "target": "des chaussettes",
    "kind": "literal",
    "alt": "A pair of red knitted socks with split toes",
    "uri": "/vocabulary-photos/socks.jpg"
  },
  {
    "id": "fr.shopping.scarf",
    "target": "une écharpe",
    "kind": "literal",
    "alt": "A knitted scarf draped around a coat collar",
    "uri": "/vocabulary-photos/scarf.jpg"
  },
  {
    "id": "fr.shopping.belt",
    "target": "une ceinture",
    "kind": "literal",
    "alt": "A leather belt and buckle worn with jeans",
    "uri": "/vocabulary-photos/belt.jpg"
  },
  {
    "id": "fr.housing.kitchen",
    "target": "une cuisine",
    "kind": "literal",
    "alt": "A kitchen with cupboards, a refrigerator and a small dining table",
    "uri": "/vocabulary-photos/kitchen.jpg"
  },
  {
    "id": "fr.housing.bedroom",
    "target": "une chambre",
    "kind": "literal",
    "alt": "A bedroom with a partly visible bed behind red drapes",
    "uri": "/vocabulary-photos/bedroom.jpg"
  },
  {
    "id": "fr.housing.bed",
    "target": "un lit",
    "kind": "literal",
    "alt": "A bedroom with a partly visible bed behind red drapes",
    "uri": "/vocabulary-photos/bedroom.jpg"
  },
  {
    "id": "fr.routine.se-coucher",
    "target": "se coucher",
    "kind": "context",
    "alt": "Context photograph: a bedroom with a partly visible bed behind red drapes",
    "uri": "/vocabulary-photos/bedroom.jpg"
  },
  {
    "id": "fr.routine.wake-up",
    "target": "se réveiller",
    "kind": "context",
    "alt": "Context photograph: a bedroom with a partly visible bed behind red drapes",
    "uri": "/vocabulary-photos/bedroom.jpg"
  },
  {
    "id": "fr.routine.se-lever",
    "target": "se lever",
    "kind": "context",
    "alt": "Context photograph: a bedroom with a partly visible bed behind red drapes",
    "uri": "/vocabulary-photos/bedroom.jpg"
  },
  {
    "id": "fr.housing.toilet",
    "target": "les toilettes",
    "kind": "literal",
    "alt": "A toilet and washbasin in a small bathroom",
    "uri": "/vocabulary-photos/toilet.jpg"
  },
  {
    "id": "fr.housing.chair",
    "target": "une chaise",
    "kind": "literal",
    "alt": "Outdoor chairs beside a small round table",
    "uri": "/vocabulary-photos/chair.jpg"
  },
  {
    "id": "fr.housing.sofa",
    "target": "un canapé",
    "kind": "literal",
    "alt": "An ornate upholstered sofa",
    "uri": "/vocabulary-photos/sofa.jpg"
  },
  {
    "id": "fr.housing.fridge",
    "target": "un réfrigérateur",
    "kind": "literal",
    "alt": "A household refrigerator",
    "uri": "/vocabulary-photos/fridge.jpg"
  },
  {
    "id": "fr.cooking.put-in-fridge",
    "target": "mettre au réfrigérateur",
    "kind": "context",
    "alt": "Context photograph: a household refrigerator",
    "uri": "/vocabulary-photos/fridge.jpg"
  },
  {
    "id": "fr.housing.washing-machine",
    "target": "un lave-linge",
    "kind": "literal",
    "alt": "A front-loading washing machine",
    "uri": "/vocabulary-photos/washer.jpg"
  },
  {
    "id": "fr.housing.wardrobe",
    "target": "une armoire",
    "kind": "literal",
    "alt": "An ornate wooden wardrobe with closed doors",
    "uri": "/vocabulary-photos/wardrobe.jpg"
  },
  {
    "id": "fr.routine.get-dressed",
    "target": "s’habiller",
    "kind": "context",
    "alt": "Context photograph: an ornate wooden wardrobe with closed doors",
    "uri": "/vocabulary-photos/wardrobe.jpg"
  },
  {
    "id": "fr.housing.key",
    "target": "une clé",
    "kind": "literal",
    "alt": "An old metal lock and its key",
    "uri": "/vocabulary-photos/key.jpg"
  },
  {
    "id": "fr.housing.door",
    "target": "une porte",
    "kind": "literal",
    "alt": "A red entrance door with glass panes",
    "uri": "/vocabulary-photos/door.jpg"
  },
  {
    "id": "fr.housing.open",
    "target": "ouvrir",
    "kind": "context",
    "alt": "Context photograph: a red entrance door with glass panes",
    "uri": "/vocabulary-photos/door.jpg"
  },
  {
    "id": "fr.housing.lift",
    "target": "un ascenseur",
    "kind": "literal",
    "alt": "Closed lift doors",
    "uri": "/vocabulary-photos/lift.jpg"
  },
  {
    "id": "fr.housing.heating",
    "target": "le chauffage",
    "kind": "literal",
    "alt": "A wall-mounted heating radiator",
    "uri": "/vocabulary-photos/radiator.jpg"
  },
  {
    "id": "fr.housing.window",
    "target": "une fenêtre",
    "kind": "literal",
    "alt": "A window in a wooden wall",
    "uri": "/vocabulary-photos/window.jpg"
  },
  {
    "id": "fr.transport.bus",
    "target": "un bus",
    "kind": "literal",
    "alt": "A city bus beside a pavement",
    "uri": "/vocabulary-photos/bus.jpg"
  },
  {
    "id": "fr.transport.take-bus",
    "target": "prendre le bus",
    "kind": "context",
    "alt": "Context photograph: a city bus beside a pavement",
    "uri": "/vocabulary-photos/bus.jpg"
  },
  {
    "id": "fr.transport.train",
    "target": "un train",
    "kind": "literal",
    "alt": "A French train beside a station platform",
    "uri": "/vocabulary-photos/train.jpg"
  },
  {
    "id": "fr.transport.bicycle",
    "target": "un vélo",
    "kind": "literal",
    "alt": "A bicycle leaning against a wall beside a blue door",
    "uri": "/vocabulary-photos/bicycle.jpg"
  },
  {
    "id": "fr.transport.tram",
    "target": "un tramway",
    "kind": "literal",
    "alt": "A tram at a stop in a French street",
    "uri": "/vocabulary-photos/tram.jpg"
  },
  {
    "id": "fr.health.pharmacie",
    "target": "une pharmacie",
    "kind": "literal",
    "alt": "A pharmacy entrance marked by an illuminated green cross",
    "uri": "/vocabulary-photos/pharmacy.jpg"
  },
  {
    "id": "fr.health.medicament",
    "target": "un médicament",
    "kind": "context",
    "alt": "Context photograph: a pharmacy entrance marked by an illuminated green cross",
    "uri": "/vocabulary-photos/pharmacy.jpg"
  },
  {
    "id": "fr.health.ordonnance",
    "target": "une ordonnance",
    "kind": "context",
    "alt": "Context photograph: a pharmacy entrance marked by an illuminated green cross",
    "uri": "/vocabulary-photos/pharmacy.jpg"
  },
  {
    "id": "fr.health.notice",
    "target": "une notice",
    "kind": "context",
    "alt": "Context photograph: a pharmacy entrance marked by an illuminated green cross",
    "uri": "/vocabulary-photos/pharmacy.jpg"
  },
  {
    "id": "fr.work.cahier",
    "target": "un cahier",
    "kind": "literal",
    "alt": "An open notebook with handwriting and a pen",
    "uri": "/vocabulary-photos/notebook.jpg"
  },
  {
    "id": "fr.work.stylo",
    "target": "un stylo",
    "kind": "literal",
    "alt": "An open notebook with handwriting and a pen",
    "uri": "/vocabulary-photos/notebook.jpg"
  },
  {
    "id": "fr.essentials.write-it",
    "target": "vous pouvez l’écrire ?",
    "kind": "context",
    "alt": "Context photograph: an open notebook with handwriting and a pen",
    "uri": "/vocabulary-photos/notebook.jpg"
  },
  {
    "id": "fr.work.exercice",
    "target": "un exercice",
    "kind": "context",
    "alt": "Context photograph: an open notebook with handwriting and a pen",
    "uri": "/vocabulary-photos/notebook.jpg"
  },
  {
    "id": "fr.education.recopier",
    "target": "recopier",
    "kind": "context",
    "alt": "Context photograph: an open notebook with handwriting and a pen",
    "uri": "/vocabulary-photos/notebook.jpg"
  },
  {
    "id": "fr.education.souligner",
    "target": "souligner",
    "kind": "context",
    "alt": "Context photograph: an open notebook with handwriting and a pen",
    "uri": "/vocabulary-photos/notebook.jpg"
  },
  {
    "id": "fr.work.ordinateur",
    "target": "un ordinateur",
    "kind": "literal",
    "alt": "A desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.education.en-ligne",
    "target": "en ligne",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.administration.se-connecter",
    "target": "se connecter",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.administration.connexion",
    "target": "une connexion",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.administration.reseau",
    "target": "un réseau",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.digital.download",
    "target": "télécharger",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.digital.upload",
    "target": "mettre en ligne",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.digital.open",
    "target": "ouvrir",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.digital.save",
    "target": "enregistrer",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.digital.log-out",
    "target": "se déconnecter",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.digital.email",
    "target": "un mail",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.digital.wifi",
    "target": "le Wi-Fi",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.administration.mot-de-passe",
    "target": "un mot de passe",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.administration.piece-jointe",
    "target": "une pièce jointe",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.digital.link",
    "target": "un lien",
    "kind": "context",
    "alt": "Context photograph: a desktop computer on a desk",
    "uri": "/vocabulary-photos/computer.jpg"
  },
  {
    "id": "fr.work.reunion",
    "target": "une réunion",
    "kind": "literal",
    "alt": "Several adults seated together in an office meeting",
    "uri": "/vocabulary-photos/meeting.jpg"
  },
  {
    "id": "fr.work.equipe",
    "target": "une équipe",
    "kind": "context",
    "alt": "Context photograph: several adults seated together in an office meeting",
    "uri": "/vocabulary-photos/meeting.jpg"
  },
  {
    "id": "fr.work.collegue",
    "target": "un collègue",
    "kind": "context",
    "alt": "Context photograph: several adults seated together in an office meeting",
    "uri": "/vocabulary-photos/meeting.jpg"
  },
  {
    "id": "fr.work.travail",
    "target": "le travail",
    "kind": "context",
    "alt": "Context photograph: several adults seated together in an office meeting",
    "uri": "/vocabulary-photos/meeting.jpg"
  },
  {
    "id": "fr.work.ensemble",
    "target": "ensemble",
    "kind": "context",
    "alt": "Context photograph: several adults seated together in an office meeting",
    "uri": "/vocabulary-photos/meeting.jpg"
  },
  {
    "id": "fr.work.proposer",
    "target": "proposer",
    "kind": "context",
    "alt": "Context photograph: several adults seated together in an office meeting",
    "uri": "/vocabulary-photos/meeting.jpg"
  },
  {
    "id": "fr.work.solution",
    "target": "une solution",
    "kind": "context",
    "alt": "Context photograph: several adults seated together in an office meeting",
    "uri": "/vocabulary-photos/meeting.jpg"
  },
  {
    "id": "fr.jobsearch.travailler",
    "target": "travailler",
    "kind": "context",
    "alt": "Context photograph: several adults seated together in an office meeting",
    "uri": "/vocabulary-photos/meeting.jpg"
  },
  {
    "id": "fr.jobsearch.emploi",
    "target": "un emploi",
    "kind": "context",
    "alt": "Context photograph: several adults seated together in an office meeting",
    "uri": "/vocabulary-photos/meeting.jpg"
  },
  {
    "id": "fr.jobsearch.metier",
    "target": "un métier",
    "kind": "context",
    "alt": "Context photograph: several adults seated together in an office meeting",
    "uri": "/vocabulary-photos/meeting.jpg"
  },
  {
    "id": "fr.administration.mairie",
    "target": "une mairie",
    "kind": "literal",
    "alt": "A town hall with an illuminated entrance",
    "uri": "/vocabulary-photos/townhall.jpg"
  },
  {
    "id": "fr.administration.poste",
    "target": "un bureau de poste",
    "kind": "literal",
    "alt": "The front of a French post office",
    "uri": "/vocabulary-photos/postoffice.jpg"
  },
  {
    "id": "fr.administration.poster",
    "target": "poster",
    "kind": "context",
    "alt": "Context photograph: the front of a French post office",
    "uri": "/vocabulary-photos/postoffice.jpg"
  },
  {
    "id": "fr.administration.colis",
    "target": "un colis",
    "kind": "literal",
    "alt": "A cardboard parcel",
    "uri": "/vocabulary-photos/parcel.jpg"
  },
  {
    "id": "fr.administration.destinataire",
    "target": "le destinataire",
    "kind": "context",
    "alt": "Context photograph: a cardboard parcel",
    "uri": "/vocabulary-photos/parcel.jpg"
  },
  {
    "id": "fr.routine.heure",
    "target": "une heure",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.routine.minute",
    "target": "une minute",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.education.duree",
    "target": "une durée",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.social.what-time",
    "target": "à quelle heure ?",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.social.set-time",
    "target": "fixer une heure",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.routine.midi",
    "target": "midi",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.routine.minuit",
    "target": "minuit",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.routine.et-demie",
    "target": "et demie",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.routine.early",
    "target": "tôt",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.routine.late",
    "target": "tard",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.routine.on-time",
    "target": "à l’heure",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.routine.hurry",
    "target": "se dépêcher",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.health.en-retard",
    "target": "en retard",
    "kind": "context",
    "alt": "Context photograph: an analogue wall clock",
    "uri": "/vocabulary-photos/clock.jpg"
  },
  {
    "id": "fr.routine.petit-dejeuner",
    "target": "le petit déjeuner",
    "kind": "literal",
    "alt": "A croissant and a cup of coffee served for breakfast",
    "uri": "/vocabulary-photos/breakfast.jpg"
  },
  {
    "id": "fr.accommodation.breakfast",
    "target": "un petit déjeuner",
    "kind": "literal",
    "alt": "A croissant and a cup of coffee served for breakfast",
    "uri": "/vocabulary-photos/breakfast.jpg"
  },
  {
    "id": "fr.leisure.lire",
    "target": "lire",
    "kind": "literal",
    "alt": "An adult wearing glasses and reading an open book",
    "uri": "/vocabulary-photos/reading.jpg"
  },
  {
    "id": "fr.education.page",
    "target": "une page",
    "kind": "context",
    "alt": "Context photograph: an adult wearing glasses and reading an open book",
    "uri": "/vocabulary-photos/reading.jpg"
  },
  {
    "id": "fr.education.reviser",
    "target": "réviser",
    "kind": "context",
    "alt": "Context photograph: an adult wearing glasses and reading an open book",
    "uri": "/vocabulary-photos/reading.jpg"
  },
  {
    "id": "fr.education.devoirs",
    "target": "les devoirs",
    "kind": "context",
    "alt": "Context photograph: an adult wearing glasses and reading an open book",
    "uri": "/vocabulary-photos/reading.jpg"
  },
  {
    "id": "fr.work.apprendre",
    "target": "apprendre",
    "kind": "context",
    "alt": "Context photograph: an adult wearing glasses and reading an open book",
    "uri": "/vocabulary-photos/reading.jpg"
  },
  {
    "id": "fr.leisure.pleuvoir",
    "target": "il pleut",
    "kind": "literal",
    "alt": "People carrying umbrellas on a wet street",
    "uri": "/vocabulary-photos/rain.jpg"
  },
  {
    "id": "fr.leisure.soleil",
    "target": "le soleil",
    "kind": "context",
    "alt": "Context photograph: a field beneath a bright blue sky",
    "uri": "/vocabulary-photos/sun.jpg"
  },
  {
    "id": "fr.leisure.beau",
    "target": "il fait beau",
    "kind": "context",
    "alt": "Context photograph: a field beneath a bright blue sky",
    "uri": "/vocabulary-photos/sun.jpg"
  },
  {
    "id": "fr.leisure.chaud",
    "target": "il fait chaud",
    "kind": "context",
    "alt": "Context photograph: a field beneath a bright blue sky",
    "uri": "/vocabulary-photos/sun.jpg"
  },
  {
    "id": "fr.leisure.froid",
    "target": "il fait froid",
    "kind": "context",
    "alt": "Context photograph: snow covering young trees beside a road",
    "uri": "/vocabulary-photos/snow.jpg"
  },
  {
    "id": "fr.leisure.courir",
    "target": "courir",
    "kind": "context",
    "alt": "Context photograph: a running track in a park",
    "uri": "/vocabulary-photos/running.jpg"
  },
  {
    "id": "fr.leisure.sport",
    "target": "le sport",
    "kind": "context",
    "alt": "Context photograph: a running track in a park",
    "uri": "/vocabulary-photos/running.jpg"
  },
  {
    "id": "fr.education.s-entrainer",
    "target": "s’entraîner",
    "kind": "context",
    "alt": "Context photograph: a running track in a park",
    "uri": "/vocabulary-photos/running.jpg"
  },
  {
    "id": "fr.leisure.marcher",
    "target": "marcher",
    "kind": "literal",
    "alt": "People walking along a path outdoors",
    "uri": "/vocabulary-photos/walking.jpg"
  },
  {
    "id": "fr.transport.on-foot",
    "target": "à pied",
    "kind": "context",
    "alt": "Context photograph: people walking along a path outdoors",
    "uri": "/vocabulary-photos/walking.jpg"
  },
  {
    "id": "fr.directions.how-long-walk",
    "target": "à combien de minutes à pied ?",
    "kind": "context",
    "alt": "Context photograph: people walking along a path outdoors",
    "uri": "/vocabulary-photos/walking.jpg"
  },
  {
    "id": "fr.leisure.musee",
    "target": "un musée",
    "kind": "literal",
    "alt": "The entrance to an art museum",
    "uri": "/vocabulary-photos/museum.jpg"
  },
  {
    "id": "fr.leisure.sortie",
    "target": "une sortie",
    "kind": "context",
    "alt": "Context photograph: the entrance to an art museum",
    "uri": "/vocabulary-photos/museum.jpg"
  },
  {
    "id": "fr.past.visit",
    "target": "visiter",
    "kind": "context",
    "alt": "Context photograph: the entrance to an art museum",
    "uri": "/vocabulary-photos/museum.jpg"
  },
  {
    "id": "fr.past.discover",
    "target": "découvrir",
    "kind": "context",
    "alt": "Context photograph: the entrance to an art museum",
    "uri": "/vocabulary-photos/museum.jpg"
  },
  {
    "id": "fr.directions.square",
    "target": "une place",
    "kind": "literal",
    "alt": "A town square in France",
    "uri": "/vocabulary-photos/square.jpg"
  },
  {
    "id": "fr.social.meeting-place",
    "target": "un lieu de rendez-vous",
    "kind": "context",
    "alt": "Context photograph: a town square in France",
    "uri": "/vocabulary-photos/square.jpg"
  },
  {
    "id": "fr.directions.crossroads",
    "target": "un carrefour",
    "kind": "literal",
    "alt": "A road junction surrounded by snow",
    "uri": "/vocabulary-photos/crossroads.jpg"
  },
  {
    "id": "fr.directions.where-is",
    "target": "où se trouve… ?",
    "kind": "context",
    "alt": "Context photograph: a road junction surrounded by snow",
    "uri": "/vocabulary-photos/crossroads.jpg"
  },
  {
    "id": "fr.directions.straight-on",
    "target": "tout droit",
    "kind": "context",
    "alt": "Context photograph: a road junction surrounded by snow",
    "uri": "/vocabulary-photos/crossroads.jpg"
  },
  {
    "id": "fr.directions.turn-left",
    "target": "tourner à gauche",
    "kind": "context",
    "alt": "Context photograph: a road junction surrounded by snow",
    "uri": "/vocabulary-photos/crossroads.jpg"
  },
  {
    "id": "fr.directions.turn-right",
    "target": "tourner à droite",
    "kind": "context",
    "alt": "Context photograph: a road junction surrounded by snow",
    "uri": "/vocabulary-photos/crossroads.jpg"
  },
  {
    "id": "fr.directions.continue",
    "target": "continuer",
    "kind": "context",
    "alt": "Context photograph: a road junction surrounded by snow",
    "uri": "/vocabulary-photos/crossroads.jpg"
  },
  {
    "id": "fr.directions.take-street",
    "target": "prendre la première rue",
    "kind": "context",
    "alt": "Context photograph: a road junction surrounded by snow",
    "uri": "/vocabulary-photos/crossroads.jpg"
  },
  {
    "id": "fr.directions.turn-back",
    "target": "faire demi-tour",
    "kind": "context",
    "alt": "Context photograph: a road junction surrounded by snow",
    "uri": "/vocabulary-photos/crossroads.jpg"
  },
  {
    "id": "fr.directions.crossing",
    "target": "un passage piéton",
    "kind": "literal",
    "alt": "A pedestrian crossing illuminated with blue lights at night",
    "uri": "/vocabulary-photos/crossing.jpg"
  },
  {
    "id": "fr.directions.cross",
    "target": "traverser",
    "kind": "context",
    "alt": "Context photograph: a pedestrian crossing illuminated with blue lights at night",
    "uri": "/vocabulary-photos/crossing.jpg"
  },
  {
    "id": "fr.cooking.chopping-board",
    "target": "une planche à découper",
    "kind": "literal",
    "alt": "Chopped garlic, garlic cloves and a knife on a wooden chopping board",
    "uri": "/vocabulary-photos/board.jpg"
  },
  {
    "id": "fr.cooking.cut",
    "target": "couper",
    "kind": "context",
    "alt": "Context photograph: chopped garlic, garlic cloves and a knife on a wooden chopping board",
    "uri": "/vocabulary-photos/board.jpg"
  },
  {
    "id": "fr.cooking.recipe",
    "target": "une recette",
    "kind": "context",
    "alt": "Context photograph: chopped garlic, garlic cloves and a knife on a wooden chopping board",
    "uri": "/vocabulary-photos/board.jpg"
  },
  {
    "id": "fr.cooking.spoon",
    "target": "une cuillère",
    "kind": "literal",
    "alt": "Two spoons, a fork and a knife arranged side by side",
    "uri": "/vocabulary-photos/spoon.jpg"
  },
  {
    "id": "fr.restaurant.fork",
    "target": "une fourchette",
    "kind": "literal",
    "alt": "Two spoons, a fork and a knife arranged side by side",
    "uri": "/vocabulary-photos/spoon.jpg"
  },
  {
    "id": "fr.restaurant.knife",
    "target": "un couteau",
    "kind": "literal",
    "alt": "Two spoons, a fork and a knife arranged side by side",
    "uri": "/vocabulary-photos/spoon.jpg"
  },
  {
    "id": "fr.cooking.kitchen-scales",
    "target": "une balance",
    "kind": "literal",
    "alt": "A set of kitchen scales",
    "uri": "/vocabulary-photos/scales.jpg"
  },
  {
    "id": "fr.groceries.kilogram",
    "target": "un kilo",
    "kind": "context",
    "alt": "Context photograph: a set of kitchen scales",
    "uri": "/vocabulary-photos/scales.jpg"
  },
  {
    "id": "fr.cooking.wash-hands",
    "target": "se laver les mains",
    "kind": "literal",
    "alt": "Hands being washed with soap and water",
    "uri": "/vocabulary-photos/handwashing.jpg"
  },
  {
    "id": "fr.cooking.onion",
    "target": "un oignon",
    "kind": "literal",
    "alt": "Small red onions sprouting in soil",
    "uri": "/vocabulary-photos/onion.jpg"
  },
  {
    "id": "fr.cooking.garlic",
    "target": "de l’ail",
    "kind": "literal",
    "alt": "Peeled garlic cloves in a clear jar",
    "uri": "/vocabulary-photos/garlic.jpg"
  },
  {
    "id": "fr.cooking.salt",
    "target": "du sel",
    "kind": "literal",
    "alt": "Salt in a small container beside a loaf of bread",
    "uri": "/vocabulary-photos/salt.jpg"
  },
  {
    "id": "fr.cooking.frying-pan",
    "target": "une poêle",
    "kind": "literal",
    "alt": "A frying pan",
    "uri": "/vocabulary-photos/frying-pan.jpg"
  },
  {
    "id": "fr.cooking.oven",
    "target": "un four",
    "kind": "literal",
    "alt": "A kitchen oven",
    "uri": "/vocabulary-photos/oven.jpg"
  },
  {
    "id": "fr.cooking.cook",
    "target": "faire cuire",
    "kind": "context",
    "alt": "Context photograph: a kitchen oven",
    "uri": "/vocabulary-photos/oven.jpg"
  },
  {
    "id": "fr.bakery.heat-up",
    "target": "réchauffer",
    "kind": "context",
    "alt": "Context photograph: a kitchen oven",
    "uri": "/vocabulary-photos/oven.jpg"
  },
  {
    "id": "fr.accommodation.double-room",
    "target": "une chambre double",
    "kind": "context",
    "alt": "Context photograph: a hotel bedroom with part of a bed made with white linen",
    "uri": "/vocabulary-photos/hotel-bed.jpg"
  },
  {
    "id": "fr.accommodation.bed-linen",
    "target": "le linge de lit",
    "kind": "context",
    "alt": "Context photograph: a hotel bedroom with part of a bed made with white linen",
    "uri": "/vocabulary-photos/hotel-bed.jpg"
  },
  {
    "id": "fr.accommodation.change-rooms",
    "target": "changer de chambre",
    "kind": "context",
    "alt": "Context photograph: a hotel bedroom with part of a bed made with white linen",
    "uri": "/vocabulary-photos/hotel-bed.jpg"
  },
  {
    "id": "fr.accommodation.luggage",
    "target": "les bagages",
    "kind": "literal",
    "alt": "A brown striped suitcase with a handle",
    "uri": "/vocabulary-photos/luggage.jpg"
  },
  {
    "id": "fr.accommodation.leave-bags",
    "target": "laisser mes bagages",
    "kind": "context",
    "alt": "Context photograph: a brown striped suitcase with a handle",
    "uri": "/vocabulary-photos/luggage.jpg"
  },
  {
    "id": "fr.accommodation.air-conditioning",
    "target": "la climatisation",
    "kind": "literal",
    "alt": "An air-conditioning unit mounted high on a wall",
    "uri": "/vocabulary-photos/airconditioner.jpg"
  },
  {
    "id": "fr.education.dictionnaire",
    "target": "un dictionnaire",
    "kind": "literal",
    "alt": "An old French dictionary photographed open beside its spine",
    "uri": "/vocabulary-photos/dictionary.jpg"
  },
  {
    "id": "fr.education.chercher-un-mot",
    "target": "chercher un mot",
    "kind": "context",
    "alt": "Context photograph: an old French dictionary photographed open beside its spine",
    "uri": "/vocabulary-photos/dictionary.jpg"
  },
  {
    "id": "fr.education.traduction",
    "target": "une traduction",
    "kind": "context",
    "alt": "Context photograph: an old French dictionary photographed open beside its spine",
    "uri": "/vocabulary-photos/dictionary.jpg"
  },
  {
    "id": "fr.essentials.what-means",
    "target": "ça veut dire quoi ?",
    "kind": "context",
    "alt": "Context photograph: an old French dictionary photographed open beside its spine",
    "uri": "/vocabulary-photos/dictionary.jpg"
  },
  {
    "id": "fr.essentials.in-french",
    "target": "en français",
    "kind": "context",
    "alt": "Context photograph: an old French dictionary photographed open beside its spine",
    "uri": "/vocabulary-photos/dictionary.jpg"
  },
  {
    "id": "fr.digital.phone",
    "target": "un téléphone",
    "kind": "literal",
    "alt": "A mobile phone held in a hand inside a car",
    "uri": "/vocabulary-photos/phone.jpg"
  },
  {
    "id": "fr.digital.call-noun",
    "target": "un appel",
    "kind": "context",
    "alt": "Context photograph: a mobile phone held in a hand inside a car",
    "uri": "/vocabulary-photos/phone.jpg"
  },
  {
    "id": "fr.digital.call-verb",
    "target": "appeler",
    "kind": "context",
    "alt": "Context photograph: a mobile phone held in a hand inside a car",
    "uri": "/vocabulary-photos/phone.jpg"
  },
  {
    "id": "fr.digital.pick-up",
    "target": "décrocher",
    "kind": "context",
    "alt": "Context photograph: a mobile phone held in a hand inside a car",
    "uri": "/vocabulary-photos/phone.jpg"
  },
  {
    "id": "fr.digital.hang-up",
    "target": "raccrocher",
    "kind": "context",
    "alt": "Context photograph: a mobile phone held in a hand inside a car",
    "uri": "/vocabulary-photos/phone.jpg"
  },
  {
    "id": "fr.digital.voicemail",
    "target": "la messagerie vocale",
    "kind": "context",
    "alt": "Context photograph: a mobile phone held in a hand inside a car",
    "uri": "/vocabulary-photos/phone.jpg"
  },
  {
    "id": "fr.digital.message",
    "target": "un message",
    "kind": "context",
    "alt": "Context photograph: a mobile phone held in a hand inside a car",
    "uri": "/vocabulary-photos/phone.jpg"
  },
  {
    "id": "fr.digital.text-message",
    "target": "un SMS",
    "kind": "context",
    "alt": "Context photograph: a mobile phone held in a hand inside a car",
    "uri": "/vocabulary-photos/phone.jpg"
  },
  {
    "id": "fr.digital.reply",
    "target": "répondre",
    "kind": "context",
    "alt": "Context photograph: a mobile phone held in a hand inside a car",
    "uri": "/vocabulary-photos/phone.jpg"
  },
  {
    "id": "fr.digital.receive",
    "target": "recevoir",
    "kind": "context",
    "alt": "Context photograph: a mobile phone held in a hand inside a car",
    "uri": "/vocabulary-photos/phone.jpg"
  },
  {
    "id": "fr.digital.forward",
    "target": "transférer",
    "kind": "context",
    "alt": "Context photograph: a mobile phone held in a hand inside a car",
    "uri": "/vocabulary-photos/phone.jpg"
  },
  {
    "id": "fr.past.take-photos",
    "target": "prendre des photos",
    "kind": "literal",
    "alt": "A person outdoors taking a photograph with a long-lens camera",
    "uri": "/vocabulary-photos/camera.jpg"
  },
  {
    "id": "fr.past.memory",
    "target": "un souvenir",
    "kind": "context",
    "alt": "Context photograph: a person outdoors taking a photograph with a long-lens camera",
    "uri": "/vocabulary-photos/camera.jpg"
  },
  {
    "id": "fr.social.dinner",
    "target": "un dîner",
    "kind": "literal",
    "alt": "Adults seated at tables for a formal banquet",
    "uri": "/vocabulary-photos/restaurant-dinner.jpg"
  },
  {
    "id": "fr.social.invitation",
    "target": "une invitation",
    "kind": "context",
    "alt": "Context photograph: adults seated at tables for a formal banquet",
    "uri": "/vocabulary-photos/restaurant-dinner.jpg"
  },
  {
    "id": "fr.social.come-to-mine",
    "target": "venir chez moi",
    "kind": "context",
    "alt": "Context photograph: adults seated at tables for a formal banquet",
    "uri": "/vocabulary-photos/restaurant-dinner.jpg"
  },
  {
    "id": "fr.social.join",
    "target": "se joindre à",
    "kind": "context",
    "alt": "Context photograph: adults seated at tables for a formal banquet",
    "uri": "/vocabulary-photos/restaurant-dinner.jpg"
  },
  {
    "id": "fr.social.meet-up",
    "target": "se retrouver",
    "kind": "context",
    "alt": "Context photograph: adults seated at tables for a formal banquet",
    "uri": "/vocabulary-photos/restaurant-dinner.jpg"
  },
  {
    "id": "fr.leisure.inviter",
    "target": "inviter",
    "kind": "context",
    "alt": "Context photograph: adults seated at tables for a formal banquet",
    "uri": "/vocabulary-photos/restaurant-dinner.jpg"
  },
  {
    "id": "fr.leisure.ca-te-dit",
    "target": "ça te dit ?",
    "kind": "context",
    "alt": "Context photograph: adults seated at tables for a formal banquet",
    "uri": "/vocabulary-photos/restaurant-dinner.jpg"
  },
  {
    "id": "fr.leisure.avec-plaisir",
    "target": "avec plaisir",
    "kind": "context",
    "alt": "Context photograph: adults seated at tables for a formal banquet",
    "uri": "/vocabulary-photos/restaurant-dinner.jpg"
  },
  {
    "id": "fr.social.willingly",
    "target": "volontiers",
    "kind": "context",
    "alt": "Context photograph: adults seated at tables for a formal banquet",
    "uri": "/vocabulary-photos/restaurant-dinner.jpg"
  },
  {
    "id": "fr.eau",
    "target": "de l’eau",
    "kind": "literal",
    "alt": "A glass containing drinking water",
    "uri": "/vocabulary-photos/water.jpg"
  },
  {
    "id": "fr.restaurant.terrace",
    "target": "une terrasse",
    "kind": "literal",
    "alt": "Outdoor restaurant tables with umbrellas",
    "uri": "/vocabulary-photos/restaurant.jpg"
  },
  {
    "id": "fr.restaurant.book-table",
    "target": "réserver une table",
    "kind": "context",
    "alt": "Context photograph: outdoor restaurant tables with umbrellas",
    "uri": "/vocabulary-photos/restaurant.jpg"
  },
  {
    "id": "fr.restaurant.reservation",
    "target": "une réservation",
    "kind": "context",
    "alt": "Context photograph: outdoor restaurant tables with umbrellas",
    "uri": "/vocabulary-photos/restaurant.jpg"
  },
  {
    "id": "fr.restaurant.for-two",
    "target": "pour deux",
    "kind": "context",
    "alt": "Context photograph: outdoor restaurant tables with umbrellas",
    "uri": "/vocabulary-photos/restaurant.jpg"
  },
  {
    "id": "fr.restaurant.ill-have",
    "target": "je prends",
    "kind": "context",
    "alt": "Context photograph: outdoor restaurant tables with umbrellas",
    "uri": "/vocabulary-photos/restaurant.jpg"
  },
  {
    "id": "fr.restaurant.milk",
    "target": "du lait",
    "kind": "literal",
    "alt": "A glass of milk",
    "uri": "/vocabulary-photos/milk.jpg"
  },
  {
    "id": "fr.restaurant.receipt",
    "target": "un ticket",
    "kind": "literal",
    "alt": "A paper receipt held in a hand",
    "uri": "/vocabulary-photos/receipt.jpg"
  },
  {
    "id": "fr.shopping.proof-of-purchase",
    "target": "un ticket de caisse",
    "kind": "literal",
    "alt": "A paper receipt held in a hand",
    "uri": "/vocabulary-photos/receipt.jpg"
  },
  {
    "id": "fr.addition",
    "target": "l’addition",
    "kind": "context",
    "alt": "Context photograph: a paper receipt held in a hand",
    "uri": "/vocabulary-photos/receipt.jpg"
  },
  {
    "id": "fr.restaurant.separately",
    "target": "séparément",
    "kind": "context",
    "alt": "Context photograph: a paper receipt held in a hand",
    "uri": "/vocabulary-photos/receipt.jpg"
  },
  {
    "id": "fr.shopping.refund",
    "target": "un remboursement",
    "kind": "context",
    "alt": "Context photograph: a paper receipt held in a hand",
    "uri": "/vocabulary-photos/receipt.jpg"
  },
  {
    "id": "fr.shopping.exchange",
    "target": "un échange",
    "kind": "context",
    "alt": "Context photograph: a paper receipt held in a hand",
    "uri": "/vocabulary-photos/receipt.jpg"
  },
  {
    "id": "fr.bakery.quiche",
    "target": "une quiche",
    "kind": "literal",
    "alt": "A whole savoury egg tart with vegetables",
    "uri": "/vocabulary-photos/quiche.jpg"
  },
  {
    "id": "fr.bakery.portion",
    "target": "une part",
    "kind": "context",
    "alt": "Context photograph: a whole savoury egg tart with vegetables",
    "uri": "/vocabulary-photos/quiche.jpg"
  },
  {
    "id": "fr.groceries.potato",
    "target": "une pomme de terre",
    "kind": "literal",
    "alt": "A sprouting potato and two smaller potatoes on a table",
    "uri": "/vocabulary-photos/potato.jpg"
  },
  {
    "id": "fr.groceries.butter",
    "target": "du beurre",
    "kind": "context",
    "alt": "Context photograph: a museum display of packaged butter products",
    "uri": "/vocabulary-photos/butter.jpg"
  },
  {
    "id": "fr.groceries.trolley",
    "target": "un chariot",
    "kind": "literal",
    "alt": "A hand gripping the handle of a wire shopping trolley",
    "uri": "/vocabulary-photos/trolley.jpg"
  },
  {
    "id": "fr.shopping.shirt",
    "target": "une chemise",
    "kind": "literal",
    "alt": "A blue collared shirt with buttons",
    "uri": "/vocabulary-photos/shirt.jpg"
  },
  {
    "id": "fr.shopping.another-colour",
    "target": "dans une autre couleur",
    "kind": "context",
    "alt": "Context photograph: a blue collared shirt with buttons",
    "uri": "/vocabulary-photos/shirt.jpg"
  },
  {
    "id": "fr.shopping.colour",
    "target": "une couleur",
    "kind": "context",
    "alt": "Context photograph: a blue collared shirt with buttons",
    "uri": "/vocabulary-photos/shirt.jpg"
  },
  {
    "id": "fr.shopping.blue",
    "target": "bleu",
    "kind": "literal",
    "alt": "A blue collared shirt with buttons",
    "uri": "/vocabulary-photos/shirt.jpg"
  },
  {
    "id": "fr.shopping.hat",
    "target": "un chapeau",
    "kind": "literal",
    "alt": "A straw hat with a striped band",
    "uri": "/vocabulary-photos/hat.jpg"
  },
  {
    "id": "fr.shopping.jacket",
    "target": "une veste",
    "kind": "literal",
    "alt": "A dark buttoned jacket laid flat",
    "uri": "/vocabulary-photos/jacket.jpg"
  },
  {
    "id": "fr.shopping.fitting-room",
    "target": "une cabine d’essayage",
    "kind": "context",
    "alt": "Context photograph: a shop sign asking customers to seek assistance before entering the fitting room",
    "uri": "/vocabulary-photos/fitting-room.jpg"
  },
  {
    "id": "fr.shopping.try-on",
    "target": "essayer",
    "kind": "context",
    "alt": "Context photograph: a shop sign asking customers to seek assistance before entering the fitting room",
    "uri": "/vocabulary-photos/fitting-room.jpg"
  },
  {
    "id": "fr.shopping.clothing-size",
    "target": "une taille",
    "kind": "context",
    "alt": "Context photograph: a shop sign asking customers to seek assistance before entering the fitting room",
    "uri": "/vocabulary-photos/fitting-room.jpg"
  },
  {
    "id": "fr.shopping.fits-me",
    "target": "ça me va",
    "kind": "context",
    "alt": "Context photograph: a shop sign asking customers to seek assistance before entering the fitting room",
    "uri": "/vocabulary-photos/fitting-room.jpg"
  },
  {
    "id": "fr.shopping.does-not-fit",
    "target": "ça ne me va pas",
    "kind": "context",
    "alt": "Context photograph: a shop sign asking customers to seek assistance before entering the fitting room",
    "uri": "/vocabulary-photos/fitting-room.jpg"
  },
  {
    "id": "fr.housing.bathroom",
    "target": "une salle de bains",
    "kind": "literal",
    "alt": "A bathtub in a bathroom",
    "uri": "/vocabulary-photos/bathroom.jpg"
  },
  {
    "id": "fr.housing.living-room",
    "target": "un salon",
    "kind": "literal",
    "alt": "A living room with a sofa, low table and large windows",
    "uri": "/vocabulary-photos/living-room.jpg"
  },
  {
    "id": "fr.housing.furnished",
    "target": "meublé",
    "kind": "context",
    "alt": "Context photograph: a living room with a sofa, low table and large windows",
    "uri": "/vocabulary-photos/living-room.jpg"
  },
  {
    "id": "fr.housing.apartment",
    "target": "un appartement",
    "kind": "context",
    "alt": "Context photograph: a living room with a sofa, low table and large windows",
    "uri": "/vocabulary-photos/living-room.jpg"
  },
  {
    "id": "fr.people.habiter",
    "target": "habiter",
    "kind": "context",
    "alt": "Context photograph: a living room with a sofa, low table and large windows",
    "uri": "/vocabulary-photos/living-room.jpg"
  },
  {
    "id": "fr.work.imprimer",
    "target": "imprimer",
    "kind": "context",
    "alt": "Context photograph: a desktop laser printer",
    "uri": "/vocabulary-photos/printer.jpg"
  },
  {
    "id": "fr.administration.copie",
    "target": "une copie",
    "kind": "context",
    "alt": "Context photograph: a desktop laser printer",
    "uri": "/vocabulary-photos/printer.jpg"
  },
  {
    "id": "fr.administration.rue",
    "target": "une rue",
    "kind": "literal",
    "alt": "A narrow street between buildings in France",
    "uri": "/vocabulary-photos/street.jpg"
  },
  {
    "id": "fr.people.quartier",
    "target": "un quartier",
    "kind": "literal",
    "alt": "A narrow street between buildings in France",
    "uri": "/vocabulary-photos/street.jpg"
  },
  {
    "id": "fr.administration.adresse",
    "target": "une adresse",
    "kind": "context",
    "alt": "Context photograph: a narrow street between buildings in France",
    "uri": "/vocabulary-photos/street.jpg"
  },
  {
    "id": "fr.administration.code-postal",
    "target": "un code postal",
    "kind": "context",
    "alt": "Context photograph: a narrow street between buildings in France",
    "uri": "/vocabulary-photos/street.jpg"
  },
  {
    "id": "fr.leisure.nager",
    "target": "nager",
    "kind": "context",
    "alt": "Context photograph: an outdoor swimming pool",
    "uri": "/vocabulary-photos/swimming.jpg"
  },
  {
    "id": "fr.leisure.piscine",
    "target": "une piscine",
    "kind": "literal",
    "alt": "An outdoor swimming pool",
    "uri": "/vocabulary-photos/swimming.jpg"
  },
  {
    "id": "fr.directions.traffic-light",
    "target": "un feu",
    "kind": "literal",
    "alt": "A traffic light showing red beside a road",
    "uri": "/vocabulary-photos/traffic-light.jpg"
  },
  {
    "id": "fr.cooking.courgette",
    "target": "une courgette",
    "kind": "literal",
    "alt": "A display of green courgettes",
    "uri": "/vocabulary-photos/courgette.jpg"
  },
  {
    "id": "fr.cooking.pepper",
    "target": "du poivre",
    "kind": "literal",
    "alt": "Black peppercorns viewed close up",
    "uri": "/vocabulary-photos/pepper.jpg"
  },
  {
    "id": "fr.cooking.saucepan",
    "target": "une casserole",
    "kind": "literal",
    "alt": "A saucepan with its lid on a wooden surface",
    "uri": "/vocabulary-photos/saucepan.jpg"
  },
  {
    "id": "fr.cooking.boil",
    "target": "faire bouillir",
    "kind": "context",
    "alt": "Context photograph: a saucepan with its lid on a wooden surface",
    "uri": "/vocabulary-photos/saucepan.jpg"
  },
  {
    "id": "fr.cooking.low-heat",
    "target": "à feu doux",
    "kind": "context",
    "alt": "Context photograph: a saucepan with its lid on a wooden surface",
    "uri": "/vocabulary-photos/saucepan.jpg"
  },
  {
    "id": "fr.cooking.let-cool",
    "target": "laisser refroidir",
    "kind": "context",
    "alt": "Context photograph: a saucepan with its lid on a wooden surface",
    "uri": "/vocabulary-photos/saucepan.jpg"
  },
  {
    "id": "fr.cooking.lid",
    "target": "un couvercle",
    "kind": "literal",
    "alt": "A saucepan with its lid on a wooden surface",
    "uri": "/vocabulary-photos/saucepan.jpg"
  },
  {
    "id": "fr.accommodation.bath-towel",
    "target": "une serviette de bain",
    "kind": "context",
    "alt": "Context photograph: a close-up of striped towel fabric",
    "uri": "/vocabulary-photos/towel.jpg"
  },
  {
    "id": "fr.routine.brush-teeth",
    "target": "se brosser les dents",
    "kind": "context",
    "alt": "Context photograph: a toothbrush standing in a cup",
    "uri": "/vocabulary-photos/toothbrush.jpg"
  },
  {
    "id": "fr.jobsearch.entretien",
    "target": "un entretien",
    "kind": "context",
    "alt": "Context photograph: three adults seated around a desk with papers for a job interview",
    "uri": "/vocabulary-photos/interview.jpg"
  },
  {
    "id": "fr.jobsearch.se-presenter",
    "target": "se présenter",
    "kind": "context",
    "alt": "Context photograph: three adults seated around a desk with papers for a job interview",
    "uri": "/vocabulary-photos/interview.jpg"
  },
  {
    "id": "fr.jobsearch.parcours",
    "target": "un parcours",
    "kind": "context",
    "alt": "Context photograph: three adults seated around a desk with papers for a job interview",
    "uri": "/vocabulary-photos/interview.jpg"
  },
  {
    "id": "fr.jobsearch.experience",
    "target": "une expérience",
    "kind": "context",
    "alt": "Context photograph: three adults seated around a desk with papers for a job interview",
    "uri": "/vocabulary-photos/interview.jpg"
  },
  {
    "id": "fr.jobsearch.competence",
    "target": "une compétence",
    "kind": "context",
    "alt": "Context photograph: three adults seated around a desk with papers for a job interview",
    "uri": "/vocabulary-photos/interview.jpg"
  },
  {
    "id": "fr.jobsearch.motive",
    "target": "motivé",
    "kind": "context",
    "alt": "Context photograph: three adults seated around a desk with papers for a job interview",
    "uri": "/vocabulary-photos/interview.jpg"
  },
  {
    "id": "fr.jobsearch.disponibilite",
    "target": "une disponibilité",
    "kind": "context",
    "alt": "Context photograph: three adults seated around a desk with papers for a job interview",
    "uri": "/vocabulary-photos/interview.jpg"
  },
  {
    "id": "fr.jobsearch.recontacter",
    "target": "recontacter",
    "kind": "context",
    "alt": "Context photograph: three adults seated around a desk with papers for a job interview",
    "uri": "/vocabulary-photos/interview.jpg"
  },
  {
    "id": "fr.jobsearch.embaucher",
    "target": "embaucher",
    "kind": "context",
    "alt": "Context photograph: three adults seated around a desk with papers for a job interview",
    "uri": "/vocabulary-photos/interview.jpg"
  },
  {
    "id": "fr.jobsearch.accepter",
    "target": "accepter",
    "kind": "context",
    "alt": "Context photograph: three adults seated around a desk with papers for a job interview",
    "uri": "/vocabulary-photos/interview.jpg"
  },
  {
    "id": "fr.jobsearch.refuser",
    "target": "refuser",
    "kind": "context",
    "alt": "Context photograph: three adults seated around a desk with papers for a job interview",
    "uri": "/vocabulary-photos/interview.jpg"
  },
  {
    "id": "fr.health.prendre-rendez-vous",
    "target": "prendre rendez-vous",
    "kind": "context",
    "alt": "Context photograph: two adults talking in a clinic beside an examination bench",
    "uri": "/vocabulary-photos/medical-visit.jpg"
  },
  {
    "id": "fr.health.expliquer",
    "target": "expliquer",
    "kind": "context",
    "alt": "Context photograph: two adults talking in a clinic beside an examination bench",
    "uri": "/vocabulary-photos/medical-visit.jpg"
  },
  {
    "id": "fr.health.mal",
    "target": "avoir mal",
    "kind": "context",
    "alt": "Context photograph: two adults talking in a clinic beside an examination bench",
    "uri": "/vocabulary-photos/medical-visit.jpg"
  },
  {
    "id": "fr.health.douleur",
    "target": "une douleur",
    "kind": "context",
    "alt": "Context photograph: two adults talking in a clinic beside an examination bench",
    "uri": "/vocabulary-photos/medical-visit.jpg"
  },
  {
    "id": "fr.health.fatigue",
    "target": "fatigué",
    "kind": "context",
    "alt": "Context photograph: two adults talking in a clinic beside an examination bench",
    "uri": "/vocabulary-photos/medical-visit.jpg"
  },
  {
    "id": "fr.health.fievre",
    "target": "la fièvre",
    "kind": "context",
    "alt": "Context photograph: two adults talking in a clinic beside an examination bench",
    "uri": "/vocabulary-photos/medical-visit.jpg"
  },
  {
    "id": "fr.bonjour",
    "target": "bonjour",
    "kind": "context",
    "alt": "Context photograph: two people shaking hands",
    "uri": "/vocabulary-photos/greeting.jpg"
  },
  {
    "id": "fr.merci",
    "target": "merci",
    "kind": "context",
    "alt": "Context photograph: two people shaking hands",
    "uri": "/vocabulary-photos/greeting.jpg"
  },
  {
    "id": "fr.people.enchante",
    "target": "enchanté",
    "kind": "context",
    "alt": "Context photograph: two people shaking hands",
    "uri": "/vocabulary-photos/greeting.jpg"
  },
  {
    "id": "fr.people.rencontrer",
    "target": "rencontrer",
    "kind": "context",
    "alt": "Context photograph: two people shaking hands",
    "uri": "/vocabulary-photos/greeting.jpg"
  },
  {
    "id": "fr.people.bienvenue",
    "target": "bienvenue",
    "kind": "context",
    "alt": "Context photograph: two people shaking hands",
    "uri": "/vocabulary-photos/greeting.jpg"
  },
  {
    "id": "fr.people.au-revoir",
    "target": "au revoir",
    "kind": "context",
    "alt": "Context photograph: two people shaking hands",
    "uri": "/vocabulary-photos/greeting.jpg"
  },
  {
    "id": "fr.essentials.thank-you",
    "target": "merci beaucoup",
    "kind": "context",
    "alt": "Context photograph: two people shaking hands",
    "uri": "/vocabulary-photos/greeting.jpg"
  },
  {
    "id": "fr.essentials.welcome-response",
    "target": "de rien",
    "kind": "context",
    "alt": "Context photograph: two people shaking hands",
    "uri": "/vocabulary-photos/greeting.jpg"
  },
  {
    "id": "fr.work.cours",
    "target": "un cours",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.work.comprendre",
    "target": "comprendre",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.work.aider",
    "target": "aider",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.education.en-presentiel",
    "target": "en présentiel",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.education.niveau",
    "target": "un niveau",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.education.debutant",
    "target": "débutant",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.education.ecouter",
    "target": "écouter",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.education.travailler-a-deux",
    "target": "travailler à deux",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.education.seance",
    "target": "une séance",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.education.progres",
    "target": "des progrès",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.education.avoir-du-mal-a",
    "target": "avoir du mal à",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.education.a-son-rythme",
    "target": "à son rythme",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.people.parler",
    "target": "parler",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.people.langue",
    "target": "une langue",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.people.question",
    "target": "une question",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.people.reponse",
    "target": "une réponse",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.people.pas-compris",
    "target": "je n’ai pas compris",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.essentials.not-understand",
    "target": "je ne comprends pas",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.essentials.repeat-please",
    "target": "vous pouvez répéter ?",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.essentials.more-slowly",
    "target": "plus lentement",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.essentials.again-please",
    "target": "encore une fois",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.essentials.understood",
    "target": "j’ai compris",
    "kind": "context",
    "alt": "Context photograph: two adults with notebooks seated in a classroom",
    "uri": "/vocabulary-photos/adult-class.jpg"
  },
  {
    "id": "fr.routine.date",
    "target": "une date",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.routine.semaine",
    "target": "une semaine",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.routine.lundi",
    "target": "lundi",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.routine.samedi",
    "target": "samedi",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.routine.aujourdhui",
    "target": "aujourd’hui",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.routine.jour",
    "target": "un jour",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.routine.every-day",
    "target": "tous les jours",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.routine.weekdays",
    "target": "en semaine",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.routine.weekend",
    "target": "le week-end",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.tuesday",
    "target": "mardi",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.wednesday",
    "target": "mercredi",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.thursday",
    "target": "jeudi",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.friday",
    "target": "vendredi",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.which-day",
    "target": "quel jour ?",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.sunday",
    "target": "dimanche",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.yesterday",
    "target": "hier",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.january",
    "target": "janvier",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.february",
    "target": "février",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.march",
    "target": "mars",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.april",
    "target": "avril",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.may",
    "target": "mai",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.june",
    "target": "juin",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.july",
    "target": "juillet",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.august",
    "target": "août",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.september",
    "target": "septembre",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.october",
    "target": "octobre",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.november",
    "target": "novembre",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.december",
    "target": "décembre",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.month",
    "target": "un mois",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.year",
    "target": "une année",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.first-date",
    "target": "le premier",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.calendar.next-week",
    "target": "la semaine prochaine",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.bakery.tomorrow",
    "target": "demain",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.administration.deadline",
    "target": "une date limite",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.health.disponible",
    "target": "disponible",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.health.annuler",
    "target": "annuler",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.health.deplacer",
    "target": "déplacer",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.health.empechement",
    "target": "un empêchement",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.health.creneau",
    "target": "un créneau",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.health.confirmer",
    "target": "confirmer",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.leisure.prevoir",
    "target": "prévoir",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.leisure.reporter",
    "target": "reporter",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.social.free",
    "target": "être libre",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.social.suits-me",
    "target": "ça me va",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.social.change-plan",
    "target": "changer de programme",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.work.delai",
    "target": "un délai",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.work.horaire",
    "target": "un horaire",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.education.emploi-du-temps",
    "target": "un emploi du temps",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.past.last-weekend",
    "target": "le week-end dernier",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.past.last-week",
    "target": "la semaine dernière",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.past.day-before-yesterday",
    "target": "avant-hier",
    "kind": "context",
    "alt": "Context photograph: a paper desk calendar with a printed date grid, a pen and coloured clips",
    "uri": "/vocabulary-photos/calendar.jpg"
  },
  {
    "id": "fr.work.document",
    "target": "un document",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.work.envoyer",
    "target": "envoyer",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.work.tache",
    "target": "une tâche",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.administration.formulaire",
    "target": "un formulaire",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.administration.dossier",
    "target": "un dossier",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.administration.justificatif",
    "target": "un justificatif",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.administration.signature",
    "target": "une signature",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.administration.remplir",
    "target": "remplir",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.administration.aide",
    "target": "une aide",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.administration.procedure",
    "target": "une démarche",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.administration.attestation",
    "target": "une attestation",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.administration.submit-file",
    "target": "déposer un dossier",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.administration.acknowledgement",
    "target": "un accusé de réception",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.accommodation.complete-form",
    "target": "remplir une fiche",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.accommodation.sign",
    "target": "signer",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.education.inscription",
    "target": "une inscription",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.education.s-inscrire",
    "target": "s’inscrire",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.jobsearch.candidature",
    "target": "une candidature",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.jobsearch.postuler",
    "target": "postuler",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.jobsearch.cv",
    "target": "un CV",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.jobsearch.lettre-de-motivation",
    "target": "une lettre de motivation",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.jobsearch.contrat",
    "target": "un contrat",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.housing.tenancy-agreement",
    "target": "un bail",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.housing.landlord",
    "target": "le propriétaire",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  },
  {
    "id": "fr.housing.tenant",
    "target": "un locataire",
    "kind": "context",
    "alt": "Context photograph: a person holding a pen and writing on printed documents at a desk",
    "uri": "/vocabulary-photos/paperwork.jpg"
  }
] as const;
const catalogue = new Map<string, Map<string, VocabularyPhoto>>();
for (const { id, target, ...photo } of bindings) {
  let targets = catalogue.get(id);
  if (!targets) { targets = new Map(); catalogue.set(id, targets); }
  targets.set(target, photo);
}
export function getVocabularyPhoto(id: string, target: string): VocabularyPhoto | undefined {
  return catalogue.get(id)?.get(target);
}
