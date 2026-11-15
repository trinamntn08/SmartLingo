import type { TopicDraft } from '../build-topic';

// Original draft text; owner review required. Sources and limits: docs/curriculum-food-audit.md.
export const foodHomeTopics: TopicDraft[] = [
  {
    "slug": "restaurant",
    "title": "Restaurant",
    "role": "Customer",
    "lessons": [
      {
        "slug": "find-a-table",
        "title": "Find a table",
        "level": "A1",
        "outcome": "Ask for a table for two and agree where to sit.",
        "words": [
          ["table", "une table", "a table", "Vous avez une table pour deux ?", "Do you have a table for two?", "A useful request when you arrive.", {"gender": "feminine"}],
          ["book-table", "réserver une table", "to book a table", "Je voudrais réserver une table pour samedi.", "I would like to book a table for Saturday.", "Verb phrase. Use réserver + the thing you want to book."],
          ["reservation", "une réservation", "a reservation", "J’ai une réservation pour ce soir.", "I have a reservation for this evening.", "", {"gender": "feminine"}],
          ["terrace", "une terrasse", "an outdoor seating area", "On peut manger en terrasse ?", "Can we eat in the outdoor seating area?", "En terrasse means in the outdoor seating area.", {"gender": "feminine"}],
          ["for-two", "pour deux", "for two people", "Une table pour deux, s’il vous plaît.", "A table for two, please.", "Short practical phrase; deux has no final pronounced x."],
          ["inside", "à l’intérieur", "inside", "On peut manger à l’intérieur ?", "Can we eat inside?", "Location phrase."],
          ["person", "une personne", "a person", "Nous sommes trois personnes.", "There are three of us.", "Used for anyone, regardless of gender.", {"gender": "feminine"}]
        ],
        "dialogue": [
          {"role": "Customer", "target": "Bonjour, une table pour deux, s’il vous plaît.", "meaning": "Hello, a table for two, please."},
          {"role": "Server", "target": "Vous avez une réservation ?", "meaning": "Do you have a reservation?"},
          {"role": "Customer", "target": "Non. On peut manger en terrasse ?", "meaning": "No. Can we eat outside?"},
          {"role": "Server", "target": "Oui, cette table est libre.", "meaning": "Yes, this table is free."}
        ],
        "grammar": {"title": "A short polite request", "explanation": "A noun phrase can be a complete everyday request: Une table pour deux, s’il vous plaît. Use vous with staff you do not know."},
        "sentence": {
          "tokens": ["deux", "Une", "pour", "table"],
          "answer": "Une table pour deux.",
          "meaning": "A table for two.",
          "hint": "Start with the thing you need, then add pour.",
          "explanation": "Une table is feminine. Pour deux states the number of diners."
        }
      },
      {
        "slug": "choose-a-meal",
        "title": "Choose a meal",
        "level": "A1",
        "outcome": "Ask about the dish of the day and choose a set meal.",
        "words": [
          ["starter", "une entrée", "a starter", "Je prends une entrée et un plat.", "I’ll have a starter and a main course.", "In France an entrée is a starter, before the main course.", {"gender": "feminine"}],
          ["main-course", "un plat", "a main course", "Quel est le plat du jour ?", "What is the dish of the day?", "Here plat means a dish or main course.", {"gender": "masculine"}],
          ["dessert", "un dessert", "a dessert", "Vous voulez un dessert ?", "Would you like a dessert?", "Pronounce the ss like s in see.", {"gender": "masculine"}],
          ["set-menu", "un menu", "a set meal", "Le menu comprend une entrée et un plat.", "The set meal includes a starter and a main course.", "Often a set combination at one price; la carte is the list of individual dishes.", {"gender": "masculine"}],
          ["ill-have", "je prends", "I’ll have; I’ll take", "Je prends le plat du jour.", "I’ll have the dish of the day.", "In an ordering situation, prendre means to have or choose."],
          ["vegetarian", "végétarien", "vegetarian", "Vous avez un plat végétarien ?", "Do you have a vegetarian dish?", "Adjective: végétarien with a masculine noun, végétarienne with a feminine noun."],
          ["chicken", "du poulet", "some chicken", "Je prends du poulet avec des légumes.", "I’ll have chicken with vegetables.", "Du is used for an unspecified amount of food.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Customer", "target": "Quel est le plat du jour ?", "meaning": "What is the dish of the day?"},
          {"role": "Server", "target": "Une quiche aux légumes.", "meaning": "A vegetable quiche."},
          {"role": "Customer", "target": "Je prends le menu avec ce plat.", "meaning": "I’ll have the set meal with that main course."},
          {"role": "Server", "target": "Très bien. Et comme entrée ?", "meaning": "Very good. And for your starter?"},
          {"role": "Customer", "target": "La salade, s’il vous plaît.", "meaning": "The salad, please."},
          {"role": "Server", "target": "Très bien, une salade et une quiche.", "meaning": "Very good, one salad and one quiche."}
        ],
        "grammar": {"title": "Je prends when ordering", "explanation": "Je prends means I’ll have in an ordering situation. Le identifies a particular dish: le plat du jour. Un introduces a dish without identifying which one."},
        "sentence": {
          "tokens": ["plat", "prends", "du", "Je", "jour", "le"],
          "answer": "Je prends le plat du jour.",
          "meaning": "I’ll have the dish of the day.",
          "hint": "Je prends comes before the dish.",
          "explanation": "Le plat du jour is the dish offered for that day."
        }
      },
      {
        "slug": "explain-food-needs",
        "title": "Explain food needs",
        "level": "A2",
        "outcome": "State an egg allergy and ask staff to check ingredients.",
        "words": [
          ["allergy", "une allergie", "an allergy", "J’ai une allergie aux œufs.", "I have an allergy to eggs.", "State a real allergy clearly and check with staff.", {"gender": "feminine"}],
          ["egg", "un œuf", "an egg", "Cette salade contient un œuf.", "This salad contains an egg.", "Plural: des œufs.", {"gender": "masculine"}],
          ["contain", "contenir", "to contain", "Cette sauce contient des œufs ?", "Does this sauce contain eggs?", "Infinitive: contenir. Useful present form: contient."],
          ["sauce", "une sauce", "a sauce", "La sauce contient des œufs.", "The sauce contains eggs.", "", {"gender": "feminine"}],
          ["without", "sans", "without", "Je voudrais la salade sans sauce.", "I would like the salad without sauce.", "Preposition. Usually no article after sans when naming an omitted ingredient."],
          ["on-the-side", "à part", "separately; on the side", "Vous pouvez mettre la sauce à part ?", "Can you put the sauce on the side?", "Food-service phrase. This request alone does not communicate an allergy."],
          ["milk", "du lait", "some milk", "Cette soupe contient du lait ?", "Does this soup contain milk?", "Du describes an unspecified amount.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Customer", "target": "J’ai une allergie aux œufs. Cette sauce contient des œufs ?", "meaning": "I have an allergy to eggs. Does this sauce contain eggs?"},
          {"role": "Server", "target": "Oui. Je vais vérifier les autres plats en cuisine.", "meaning": "Yes. I’ll check the other dishes with the kitchen."},
          {"role": "Customer", "target": "Merci. Je vais attendre.", "meaning": "Thank you. I’ll wait."},
          {"role": "Server", "target": "Je reviens vous donner les informations.", "meaning": "I’ll come back and give you the information."}
        ],
        "grammar": {"title": "Naming an allergy", "explanation": "J’ai une allergie à… names an allergy. À + les becomes aux: une allergie aux œufs. Sans sauce requests an omission; it does not establish that a dish is safe for an allergy. Contenir has the present form contient: cette sauce contient des œufs. Staff checking is part of the exchange; no safety outcome is promised."},
        "sentence": {
          "tokens": ["aux", "allergie", "une", "œufs", "J’ai"],
          "answer": "J’ai une allergie aux œufs.",
          "meaning": "I have an allergy to eggs.",
          "hint": "Start with J’ai; keep aux before œufs.",
          "explanation": "Aux combines à and les before the plural œufs."
        }
      },
      {
        "slug": "finish-the-meal",
        "title": "Finish the meal",
        "level": "A2",
        "outcome": "Request missing tableware, split payment and ask for a receipt.",
        "words": [
          ["fork", "une fourchette", "a fork", "Il me manque une fourchette.", "I’m missing a fork.", "", {"gender": "feminine"}],
          ["bring", "apporter", "to bring", "Vous pouvez apporter une fourchette ?", "Can you bring a fork?", "Use after pouvez in a request."],
          ["napkin", "une serviette", "a napkin", "Je peux avoir une autre serviette ?", "Can I have another napkin?", "At a table this is a napkin; elsewhere it can mean a towel.", {"gender": "feminine"}],
          ["bank-card", "une carte bancaire", "a bank card", "Je paie par carte bancaire.", "I’m paying by bank card.", "Not the restaurant menu.", {"gender": "feminine"}],
          ["separately", "séparément", "separately", "Nous pouvons payer séparément ?", "Can we pay separately?", "Adverb. Ask whether the restaurant can split payment."],
          ["receipt", "un ticket", "a receipt", "Je peux avoir un ticket ?", "Can I have a receipt?", "Here a payment receipt, not a transport ticket.", {"gender": "masculine"}],
          ["knife", "un couteau", "a knife", "Je peux avoir un autre couteau ?", "Can I have another knife?", "Plural: des couteaux.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Customer", "target": "Il me manque une fourchette.", "meaning": "I’m missing a fork."},
          {"role": "Server", "target": "Je vous en apporte une.", "meaning": "I’ll bring you one."},
          {"role": "Customer", "target": "Merci. Et nous pouvons payer séparément ?", "meaning": "Thank you. And can we pay separately?"},
          {"role": "Server", "target": "Oui, bien sûr.", "meaning": "Yes, of course."},
          {"role": "Customer", "target": "Je paie par carte. Je peux avoir un ticket ?", "meaning": "I’m paying by card. Can I have a receipt?"},
          {"role": "Server", "target": "Oui, voici votre ticket.", "meaning": "Yes, here is your receipt."}
        ],
        "grammar": {"title": "Pouvoir for practical requests", "explanation": "Je peux… à means Can I… à Nous pouvons… à means Can we… à Follow pouvoir with an infinitive such as payer or avoir."},
        "sentence": {
          "tokens": ["payer", "pouvons", "séparément", "Nous"],
          "answer": "Nous pouvons payer séparément ?",
          "meaning": "Can we pay separately?",
          "hint": "Begin with Nous pouvons.",
          "explanation": "Rising intonation turns this word order into an ordinary spoken question. Payer stays in the infinitive."
        }
      }
    ]
  },
  {
    "slug": "bakery",
    "title": "Bakery",
    "role": "Customer",
    "lessons": [
      {
        "slug": "choose-bread",
        "title": "Choose your bread",
        "level": "A1",
        "outcome": "Choose a loaf, its bake and whether it is sliced.",
        "words": [
          ["country-loaf", "un pain de campagne", "a country-style loaf", "Un pain de campagne, s’il vous plaît.", "A country-style loaf, please.", "A style of bread, not a guarantee of particular ingredients.", {"gender": "masculine"}],
          ["wholemeal-bread", "du pain complet", "some wholemeal bread", "Vous avez du pain complet ?", "Do you have wholemeal bread?", "Du is for an unspecified amount.", {"gender": "masculine"}],
          ["which-bread", "quel pain", "which bread", "Quel pain est bien cuit ?", "Which bread is well baked?", "Quel agrees with masculine singular pain."],
          ["slice", "une tranche", "a slice", "Je voudrais quatre tranches de ce pain.", "I would like four slices of this bread.", "De introduces what is sliced.", {"gender": "feminine"}],
          ["sliced", "tranché", "sliced", "Je voudrais ce pain tranché.", "I would like this bread sliced.", "Adjective agreeing with pain, masculine singular; feminine tranchée."],
          ["well-baked", "bien cuit", "well baked", "Je préfère un pain bien cuit.", "I prefer a well-baked loaf.", "Adjective phrase; feminine bien cuite. In a bakery this asks for a darker bake."]
        ],
        "dialogue": [
          {"role": "Customer", "target": "Quel pain est bien cuit ?", "meaning": "Which bread is well baked?"},
          {"role": "Baker", "target": "Ce pain de campagne. Vous le voulez tranché ?", "meaning": "This country-style loaf. Would you like it sliced?"},
          {"role": "Customer", "target": "Oui, s’il vous plaît.", "meaning": "Yes, please."},
          {"role": "Baker", "target": "Voilà votre pain.", "meaning": "Here is your bread."}
        ],
        "grammar": {"title": "Describing bread", "explanation": "Put the description after pain: pain complet, pain tranché. Je voudrais is a polite way to ask for something."},
        "sentence": {
          "tokens": ["tranché", "ce", "voudrais", "pain", "Je"],
          "answer": "Je voudrais ce pain tranché.",
          "meaning": "I would like this bread sliced.",
          "hint": "Put tranché after ce pain.",
          "explanation": "Ce means this before the masculine noun pain. Tranché agrees with pain."
        }
      },
      {
        "slug": "choose-a-treat",
        "title": "Choose a sweet treat",
        "level": "A1",
        "outcome": "Choose pastries, give a quantity and finish an order.",
        "words": [
          ["pain-au-chocolat", "un pain au chocolat", "a chocolate-filled pastry", "Deux pains au chocolat, s’il vous plaît.", "Two chocolate-filled pastries, please.", "Chocolatine is a regional name, notably in southwestern France.", {"gender": "masculine"}],
          ["brioche", "une brioche", "a brioche", "Cette brioche est pour deux personnes ?", "Is this brioche for two people?", "A rich, soft bread.", {"gender": "feminine"}],
          ["apple-turnover", "un chausson aux pommes", "an apple turnover", "Vous avez des chaussons aux pommes ?", "Do you have apple turnovers?", "Aux pommes means with apple in this pastry name.", {"gender": "masculine"}],
          ["tartlet", "une tartelette", "a small individual tart", "Je prends une tartelette aux fraises.", "I’ll have a strawberry tartlet.", "", {"gender": "feminine"}],
          ["anything-else", "et avec ça ?", "anything else?", "Et avec ça, vous voulez une brioche ?", "Would you like a brioche as well?", "A common question from shop staff; literally and with that?"],
          ["two-of-them", "j’en prends deux", "I’ll have two of them", "Ces chaussons aux pommes, j’en prends deux.", "I’ll have two of these apple turnovers.", "En refers back to the item; pronounce j’en as one linked unit."]
        ],
        "dialogue": [
          {"role": "Customer", "target": "Vous avez des chaussons aux pommes ?", "meaning": "Do you have apple turnovers?"},
          {"role": "Baker", "target": "Oui. Vous en voulez combien ?", "meaning": "Yes. How many would you like?"},
          {"role": "Customer", "target": "J’en prends deux.", "meaning": "I’ll have two of them."},
          {"role": "Baker", "target": "Et avec ça ?", "meaning": "Anything else?"},
          {"role": "Customer", "target": "Ce sera tout, merci.", "meaning": "That will be all, thank you."},
          {"role": "Baker", "target": "Voilà vos deux chaussons aux pommes.", "meaning": "Here are your two apple turnovers."}
        ],
        "grammar": {"title": "Use en to avoid repeating the item", "explanation": "After naming a food, j’en prends deux means I’ll have two of them. The quantity comes after the verb. You can learn this as a short practical chunk."},
        "sentence": {
          "tokens": ["deux", "prends", "J’en"],
          "answer": "J’en prends deux.",
          "meaning": "I’ll have two of them.",
          "hint": "The quantity comes last.",
          "explanation": "En stands for the pastries already mentioned. Keep the apostrophe in J’en."
        }
      },
      {
        "slug": "buy-lunch",
        "title": "Buy lunch to take away",
        "level": "A2",
        "outcome": "Order a slice of quiche to take away and request heating.",
        "words": [
          ["sandwich", "un sandwich", "a sandwich", "Je voudrais un sandwich au fromage.", "I would like a cheese sandwich.", "", {"gender": "masculine"}],
          ["quiche", "une quiche", "a savoury egg tart", "Cette quiche est aux légumes ?", "Is this a vegetable quiche?", "Fillings vary; ask if ingredients matter.", {"gender": "feminine"}],
          ["portion", "une part", "a portion; a slice", "Une part de quiche, s’il vous plaît.", "A slice of quiche, please.", "Used for a portion cut from a larger food.", {"gender": "feminine"}],
          ["lunch-deal", "une formule", "a set lunch deal", "La formule comprend une boisson ?", "Does the set lunch deal include a drink?", "Contents depend on the bakery.", {"gender": "feminine"}],
          ["take-away", "à emporter", "to take away", "C’est à emporter, s’il vous plaît.", "It’s to take away, please.", "Service phrase. Sur place means to eat on the premises."],
          ["heat-up", "réchauffer", "to heat up", "Vous pouvez réchauffer ma quiche ?", "Can you heat up my quiche?", "Infinitive verb. Use after pouvez in a request."]
        ],
        "dialogue": [
          {"role": "Customer", "target": "Une part de quiche, à emporter, s’il vous plaît.", "meaning": "A slice of quiche to take away, please."},
          {"role": "Baker", "target": "Vous voulez une formule avec une boisson ?", "meaning": "Would you like a set deal with a drink?"},
          {"role": "Customer", "target": "Non, merci. Vous pouvez réchauffer la quiche ?", "meaning": "No, thank you. Can you heat up the quiche?"},
          {"role": "Baker", "target": "Oui, je la réchauffe.", "meaning": "Yes, I’ll heat it up."}
        ],
        "grammar": {"title": "Ask someone to do something", "explanation": "Vous pouvez + infinitive is an ordinary polite request: Vous pouvez réchauffer… à Keep the action verb in its infinitive form."},
        "sentence": {
          "tokens": ["quiche", "pouvez", "la", "Vous", "réchauffer"],
          "answer": "Vous pouvez réchauffer la quiche ?",
          "meaning": "Can you heat up the quiche?",
          "hint": "Put réchauffer after Vous pouvez.",
          "explanation": "Pouvez is conjugated for vous; réchauffer stays in the infinitive."
        }
      },
      {
        "slug": "order-for-later",
        "title": "Order for later",
        "level": "A2",
        "outcome": "Order a cake for six and confirm a collection time and name.",
        "words": [
          ["cake", "un gâteau", "a cake", "Un gâteau pour six personnes, s’il vous plaît.", "A cake for six people, please.", "Plural: des gâteaux.", {"gender": "masculine"}],
          ["order", "une commande", "an order", "Je viens chercher ma commande.", "I’m here to collect my order.", "", {"gender": "feminine"}],
          ["order-in-advance", "commander", "to order", "Je voudrais commander un gâteau pour samedi.", "I would like to order a cake for Saturday.", "Infinitive verb. Here ordering ahead rather than asking at the counter."],
          ["collect", "venir chercher", "to come and collect", "Je peux venir chercher le gâteau demain ?", "Can I come and collect the cake tomorrow?", "Verb phrase; venir describes coming to the bakery."],
          ["tomorrow", "demain", "tomorrow", "C’est pour demain matin.", "It’s for tomorrow morning.", "Time word; no article is needed."],
          ["sold-out", "il n’y en a plus", "there are none left", "Des croissants ? Il n’y en a plus.", "Croissants? There are none left.", "Useful stock phrase. Here plus means no more; its final s is silent."]
        ],
        "dialogue": [
          {"role": "Customer", "target": "Je peux commander un gâteau pour demain ?", "meaning": "Can I order a cake for tomorrow?"},
          {"role": "Baker", "target": "Oui, pour combien de personnes ?", "meaning": "Yes, for how many people?"},
          {"role": "Customer", "target": "Pour six. Je peux venir le chercher à dix heures ?", "meaning": "For six. Can I come and collect it at ten o’clock?"},
          {"role": "Baker", "target": "Oui. à quel nom ?", "meaning": "Yes. Under what name?"},
          {"role": "Customer", "target": "Au nom de Martin.", "meaning": "Under the name Martin."},
          {"role": "Baker", "target": "C’est noté : demain à dix heures.", "meaning": "That’s noted: tomorrow at ten o’clock."}
        ],
        "grammar": {"title": "Pour and à with collection plans", "explanation": "Pour demain says when an order is needed. À dix heures gives the collection time. In venir le chercher, le replaces le gâteau and sits before chercher."},
        "sentence": {
          "tokens": ["demain", "pour", "C’est", "matin"],
          "answer": "C’est pour demain matin.",
          "meaning": "It’s for tomorrow morning.",
          "hint": "Put pour before the time expression.",
          "explanation": "Demain matin means tomorrow morning; it needs no article."
        }
      }
    ]
  },
  {
    "slug": "groceries",
    "title": "Groceries",
    "role": "Shopper",
    "lessons": [
      {
        "slug": "fruit-and-vegetables",
        "title": "Buy fruit and vegetables",
        "level": "A1",
        "outcome": "Request weighed tomatoes and counted fruit or vegetables.",
        "words": [
          ["apple", "une pomme", "an apple", "Je prends trois pommes.", "I’ll take three apples.", "", {"gender": "feminine"}],
          ["need", "il me faut", "I need", "Il me faut trois pommes.", "I need three apples.", "Useful fixed chunk. Il does not mean a particular person here."],
          ["tomato", "une tomate", "a tomato", "Je voudrais quatre tomates.", "I would like four tomatoes.", "", {"gender": "feminine"}],
          ["carrot", "une carotte", "a carrot", "Il me faut deux carottes.", "I need two carrots.", "One r and double t.", {"gender": "feminine"}],
          ["potato", "une pomme de terre", "a potato", "Vous avez des pommes de terre ?", "Do you have potatoes?", "Keep de terre when naming a potato.", {"gender": "feminine"}],
          ["kilogram", "un kilo", "a kilogram", "Un kilo de tomates, s’il vous plaît.", "A kilogram of tomatoes, please.", "Everyday short form of kilogramme.", {"gender": "masculine"}],
          ["banana", "une banane", "a banana", "Je prends deux bananes.", "I’ll take two bananas.", "", {"gender": "feminine"}]
        ],
        "dialogue": [
          {"role": "Shopper", "target": "Un kilo de tomates, s’il vous plaît.", "meaning": "A kilogram of tomatoes, please."},
          {"role": "Seller", "target": "Et avec ça ?", "meaning": "Anything else?"},
          {"role": "Shopper", "target": "Il me faut aussi trois pommes.", "meaning": "I also need three apples."},
          {"role": "Seller", "target": "Voilà vos tomates et vos pommes.", "meaning": "Here are your tomatoes and apples."}
        ],
        "grammar": {"title": "Quantities with de", "explanation": "After a measured quantity use de: un kilo de tomates. After a number, use the noun directly: trois pommes."},
        "sentence": {
          "tokens": ["tomates", "de", "kilo", "Un"],
          "answer": "Un kilo de tomates.",
          "meaning": "A kilogram of tomatoes.",
          "hint": "The measure comes before de.",
          "explanation": "Un kilo de introduces the product being weighed."
        }
      },
      {
        "slug": "fill-the-cupboard",
        "title": "Fill the cupboard",
        "level": "A1",
        "outcome": "Find dry foods and choose a packet to buy.",
        "words": [
          ["rice", "du riz", "some rice", "Il me faut du riz.", "I need some rice.", "Final z is silent.", {"gender": "masculine"}],
          ["pasta", "des pâtes", "some pasta", "Où sont les pâtes ?", "Where is the pasta?", "Usually plural in this food sense. Keep the accent.", {"gender": "feminine"}],
          ["flour", "de la farine", "some flour", "Je cherche de la farine.", "I’m looking for some flour.", "", {"gender": "feminine"}],
          ["buy", "acheter", "to buy", "Je vais acheter du riz.", "I’m going to buy some rice.", "Infinitive after vais. Present: j’achète."],
          ["oil", "de l’huile", "some oil", "Il me faut de l’huile d’olive.", "I need some olive oil.", "De la becomes de l’ before a vowel sound.", {"gender": "feminine"}],
          ["packet", "un paquet", "a packet", "Je prends un paquet de pâtes.", "I’ll take a packet of pasta.", "Final t is silent.", {"gender": "masculine"}],
          ["sugar", "du sucre", "some sugar", "Je cherche du sucre pour mon café.", "I’m looking for some sugar for my coffee.", "", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Shopper", "target": "Où sont les pâtes ?", "meaning": "Where is the pasta?"},
          {"role": "Staff", "target": "À côté du riz.", "meaning": "Next to the rice."},
          {"role": "Shopper", "target": "Merci. Je vais acheter un paquet.", "meaning": "Thank you. I’ll buy a packet."},
          {"role": "Staff", "target": "Les petits paquets sont sur cette étagère.", "meaning": "The small packets are on this shelf."}
        ],
        "grammar": {"title": "Some food", "explanation": "For unspecified amounts use du with masculine food, de la with feminine food and de l’ before a vowel sound. Des pâtes is plural in French even when English says pasta. After vais, use the infinitive acheter: je vais acheter du riz."},
        "sentence": {
          "tokens": ["faut", "riz", "Il", "du", "me"],
          "answer": "Il me faut du riz.",
          "meaning": "I need some rice.",
          "hint": "Il me faut is a useful chunk for I need.",
          "explanation": "Du combines de and le to describe an unspecified amount of rice."
        }
      },
      {
        "slug": "chilled-foods",
        "title": "Choose chilled foods",
        "level": "A1",
        "outcome": "Ask a deli price and request a portion or slices.",
        "words": [
          ["butter", "du beurre", "some butter", "Je voudrais du beurre doux.", "I would like some unsalted butter.", "Beurre doux means unsalted butter.", {"gender": "masculine"}],
          ["cheese", "du fromage", "some cheese", "Je prends un morceau de ce fromage.", "I’ll take a piece of this cheese.", "", {"gender": "masculine"}],
          ["yogurt", "un yaourt", "a yogurt", "Je cherche des yaourts nature.", "I’m looking for plain yogurts.", "Nature here means plain.", {"gender": "masculine"}],
          ["how-much-cost", "combien ça coûte ?", "how much does it cost?", "Ce fromage, combien ça coûte ?", "How much does this cheese cost?", "Everyday spoken question. ça needs a cedilla."],
          ["ham", "du jambon", "some ham", "Quatre tranches de jambon, s’il vous plaît.", "Four slices of ham, please.", "", {"gender": "masculine"}],
          ["price", "un prix", "a price", "Quel est le prix de ce fromage ?", "What is the price of this cheese?", "Same written form in singular and plural.", {"gender": "masculine"}],
          ["cream", "de la crème", "some cream", "Vous avez de la crème fraîche ?", "Do you have crème fraîche?", "", {"gender": "feminine"}]
        ],
        "dialogue": [
          {"role": "Shopper", "target": "Ce fromage, combien ça coûte ?", "meaning": "How much does this cheese cost?"},
          {"role": "Seller", "target": "Quatre euros la portion.", "meaning": "Four euros per portion."},
          {"role": "Shopper", "target": "Une portion, s’il vous plaît.", "meaning": "One portion, please."},
          {"role": "Seller", "target": "Voilà. Et avec ça ?", "meaning": "Here you are. Anything else?"},
          {"role": "Shopper", "target": "Quatre tranches de jambon, merci.", "meaning": "Four slices of ham, thank you."},
          {"role": "Seller", "target": "Voilà votre jambon.", "meaning": "Here is your ham."}
        ],
        "grammar": {"title": "Ce points to one item", "explanation": "Ce fromage means this cheese. Use ce with a masculine singular noun beginning with a consonant sound; cette with a feminine noun."},
        "sentence": {
          "tokens": ["fromage", "le", "de", "est", "ce", "prix", "Quel"],
          "answer": "Quel est le prix de ce fromage ?",
          "meaning": "What is the price of this cheese?",
          "hint": "Start Quel est le prix…",
          "explanation": "Quel agrees with the masculine noun prix. De ce fromage specifies which product."
        }
      },
      {
        "slug": "find-products",
        "title": "Find products in a shop",
        "level": "A2",
        "outcome": "Locate a shop section and find a basket and checkout.",
        "words": [
          ["aisle-section", "un rayon", "a shop section", "Le rayon des surgelés est au fond.", "The frozen-food section is at the back.", "Rayon means a department or product section here.", {"gender": "masculine"}],
          ["checkout", "une caisse", "a checkout", "Cette caisse est ouverte ?", "Is this checkout open?", "", {"gender": "feminine"}],
          ["basket", "un panier", "a shopping basket", "Je prends un panier pour mes courses.", "I’m taking a basket for my shopping.", "", {"gender": "masculine"}],
          ["look-for", "chercher", "to look for", "Je cherche le rayon des surgelés.", "I’m looking for the frozen-food section.", "Use chercher + the thing sought; no pour."],
          ["frozen-foods", "les surgelés", "frozen foods", "Où sont les surgelés ?", "Where are the frozen foods?", "", {"gender": "masculine"}],
          ["at-the-back", "au fond", "at the back", "Les pâtes sont au fond du magasin.", "The pasta is at the back of the shop.", "Location phrase; au combines à and le."],
          ["trolley", "un chariot", "a shopping trolley", "Où sont les chariots ?", "Where are the shopping trolleys?", "", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Shopper", "target": "Je cherche le rayon des surgelés.", "meaning": "I’m looking for the frozen-food section."},
          {"role": "Staff", "target": "Il est au fond, près des caisses.", "meaning": "It’s at the back, near the checkouts."},
          {"role": "Shopper", "target": "Et où sont les paniers ?", "meaning": "And where are the baskets?"},
          {"role": "Staff", "target": "À l’entrée, à droite.", "meaning": "At the entrance, on the right."}
        ],
        "grammar": {"title": "Where is and where are", "explanation": "Où est… à asks for one place or item. Où sont… à asks for a plural: Où sont les surgelés à The accent distinguishes où (where) from ou (or)."},
        "sentence": {
          "tokens": ["les", "Où", "surgelés", "sont"],
          "answer": "Où sont les surgelés ?",
          "meaning": "Where are the frozen foods?",
          "hint": "Use sont with the plural les surgelés.",
          "explanation": "Où asks where. Les surgelés is plural, so use sont rather than est."
        }
      },
      {
        "slug": "check-before-paying",
        "title": "Check before paying",
        "level": "A2",
        "outcome": "Compare a label with a charged price and ask for a check.",
        "words": [
          ["label", "une étiquette", "a label", "Le prix est sur l’étiquette.", "The price is on the label.", "", {"gender": "feminine"}],
          ["promotion", "une promotion", "a special offer", "Ces yaourts sont en promotion.", "These yogurts are on special offer.", "The everyday phrase is en promotion.", {"gender": "feminine"}],
          ["check", "vérifier", "to check", "Je vais vérifier le prix.", "I’m going to check the price.", "Infinitive after vais. Label information is a reading task, not food-safety advice."],
          ["change", "la monnaie", "the change from a payment", "Il manque un euro dans la monnaie.", "One euro is missing from the change.", "Here money returned after paying.", {"gender": "feminine"}],
          ["cash", "en espèces", "in cash", "Je vais payer en espèces.", "I’m going to pay in cash.", "Payment phrase."],
          ["price-error", "il y a une erreur", "there is a mistake", "Il y a une erreur sur mon ticket.", "There is a mistake on my receipt.", "Polite phrase for reporting a mistake."]
        ],
        "dialogue": [
          {"role": "Shopper", "target": "Excusez-moi, il y a une erreur sur le prix.", "meaning": "Excuse me, there is a mistake in the price."},
          {"role": "Cashier", "target": "Quel prix avez-vous vu ?", "meaning": "What price did you see?"},
          {"role": "Shopper", "target": "Deux euros sur l’étiquette.", "meaning": "Two euros on the label."},
          {"role": "Cashier", "target": "Je vais vérifier. Oui, c’est deux euros.", "meaning": "I’ll check. Yes, it is two euros."},
          {"role": "Shopper", "target": "Merci. Je vais payer en espèces.", "meaning": "Thank you. I’m going to pay in cash."},
          {"role": "Cashier", "target": "Voilà votre monnaie.", "meaning": "Here is your change."}
        ],
        "grammar": {"title": "A near-future action", "explanation": "Je vais + infinitive describes a next action: je vais vérifier, je vais payer. The action verb stays in the infinitive."},
        "sentence": {
          "tokens": ["espèces", "payer", "vais", "en", "Je"],
          "answer": "Je vais payer en espèces.",
          "meaning": "I’m going to pay in cash.",
          "hint": "Start Je vais payer.",
          "explanation": "En espèces is the usual phrase for paying in cash."
        }
      }
    ]
  },
  {
    "slug": "shopping",
    "title": "Clothes and shopping",
    "role": "Shopper",
    "lessons": [
      {
        "slug": "everyday-clothes",
        "title": "Find everyday clothes",
        "level": "A1",
        "outcome": "Ask where to find a basic item of clothing.",
        "words": [
          ["trousers", "un pantalon", "a pair of trousers", "Je cherche un pantalon noir.", "I’m looking for a pair of black trousers.", "Singular in French; trousers is plural in English.", {"gender": "masculine"}],
          ["shirt", "une chemise", "a shirt", "Vous avez cette chemise en bleu ?", "Do you have this shirt in blue?", "", {"gender": "feminine"}],
          ["t-shirt", "un tee-shirt", "a T-shirt", "Je voudrais un tee-shirt blanc.", "I would like a white T-shirt.", "T-shirt is another common spelling.", {"gender": "masculine"}],
          ["dress", "une robe", "a dress", "Cette robe existe en taille quarante ?", "Does this dress come in size forty?", "", {"gender": "feminine"}],
          ["jumper", "un pull", "a jumper; a sweater", "Je prends ce pull bleu.", "I’ll take this blue jumper.", "Everyday word for a knitted top.", {"gender": "masculine"}],
          ["look-for-item", "chercher", "to look for", "Je cherche un pantalon noir.", "I’m looking for a pair of black trousers.", "Use chercher + an item; no pour. Present: je cherche. Recycles the Groceries sense."],
          ["coat", "un manteau", "a coat", "Je cherche un manteau chaud.", "I’m looking for a warm coat.", "Plural: des manteaux.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Shopper", "target": "Bonjour, je cherche un pantalon noir.", "meaning": "Hello, I’m looking for a pair of black trousers."},
          {"role": "Assistant", "target": "Les pantalons sont à droite.", "meaning": "The trousers are on the right."},
          {"role": "Shopper", "target": "Et les chemises ?", "meaning": "And the shirts?"},
          {"role": "Assistant", "target": "À côté des pantalons.", "meaning": "Next to the trousers."}
        ],
        "grammar": {"title": "Je cherche", "explanation": "Je cherche means I’m looking for. Do not add pour after chercher when naming the thing you want: je cherche un pantalon."},
        "sentence": {
          "tokens": ["pantalon", "cherche", "un", "Je", "noir"],
          "answer": "Je cherche un pantalon noir.",
          "meaning": "I’m looking for a pair of black trousers.",
          "hint": "Place the colour after the clothing noun.",
          "explanation": "Pantalon is masculine singular, so use un and noir."
        }
      },
      {
        "slug": "shoes-and-accessories",
        "title": "Shoes and accessories",
        "level": "A1",
        "outcome": "Choose everyday footwear and ask to try a pair.",
        "words": [
          ["shoes", "des chaussures", "a pair of shoes; some shoes", "Je cherche des chaussures confortables.", "I’m looking for comfortable shoes.", "Usually plural for a pair.", {"gender": "feminine"}],
          ["trainers", "des baskets", "trainers; sneakers", "Ces baskets sont légères.", "These trainers are light.", "Usually plural for a pair.", {"gender": "feminine"}],
          ["socks", "des chaussettes", "some socks", "Je voudrais des chaussettes noires.", "I would like some black socks.", "", {"gender": "feminine"}],
          ["scarf", "une écharpe", "a scarf", "Cette écharpe est très douce.", "This scarf is very soft.", "", {"gender": "feminine"}],
          ["belt", "une ceinture", "a belt", "Cette ceinture est trop longue.", "This belt is too long.", "", {"gender": "feminine"}],
          ["wear", "porter", "to wear", "Je porte ces chaussures au travail.", "I wear these shoes at work.", "Here porter means wear, rather than carry."],
          ["hat", "un chapeau", "a hat", "Je voudrais essayer ce chapeau.", "I would like to try on this hat.", "Plural: des chapeaux.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Shopper", "target": "Je cherche des chaussures confortables.", "meaning": "I’m looking for comfortable shoes."},
          {"role": "Assistant", "target": "Vous aimez ces baskets ?", "meaning": "Do you like these trainers?"},
          {"role": "Shopper", "target": "Oui. Je peux les porter pour marcher ?", "meaning": "Yes. Can I wear them for walking?"},
          {"role": "Assistant", "target": "Oui. Vous voulez les essayer ?", "meaning": "Yes. Would you like to try them on?"},
          {"role": "Shopper", "target": "Oui, merci.", "meaning": "Yes, thank you."},
          {"role": "Assistant", "target": "Je vous apporte une paire.", "meaning": "I’ll bring you a pair."}
        ],
        "grammar": {"title": "Des and ces", "explanation": "Des introduces unspecified plural items. Ces points to particular plural items: ces baskets. Use elles to refer back to feminine plural nouns such as chaussures."},
        "sentence": {
          "tokens": ["baskets", "légères", "Ces", "sont"],
          "answer": "Ces baskets sont légères.",
          "meaning": "These trainers are light.",
          "hint": "Ces comes before the noun.",
          "explanation": "Légères has feminine plural agreement with baskets."
        }
      },
      {
        "slug": "sizes-and-colours",
        "title": "Ask about size and colour",
        "level": "A1",
        "outcome": "Ask for the next clothing size and another colour.",
        "words": [
          ["clothing-size", "une taille", "a clothing size", "Vous avez la taille au-dessus ?", "Do you have the next size up?", "Use pointure for shoe size.", {"gender": "feminine"}],
          ["shoe-size", "une pointure", "a shoe size", "Vous faites quelle pointure ?", "What shoe size do you take?", "Specifically footwear size.", {"gender": "feminine"}],
          ["another-colour", "dans une autre couleur", "in another colour", "Vous avez ce pull dans une autre couleur ?", "Do you have this jumper in another colour?", "Useful question ending after naming an item."],
          ["black", "noir", "black", "Je voudrais ce pantalon en noir.", "I would like these trousers in black.", "Adjective: noir, noire, noirs, noires."],
          ["blue", "bleu", "blue", "Vous avez ce pull en bleu ?", "Do you have this jumper in blue?", "Adjective: bleu, bleue, bleus, bleues."],
          ["too-small", "trop petit", "too small", "Ce pull est trop petit.", "This jumper is too small.", "Adjective phrase; feminine trop petite. Trop means too, beyond what is wanted."],
          ["colour", "une couleur", "a colour", "Vous préférez quelle couleur ?", "Which colour do you prefer?", "", {"gender": "feminine"}]
        ],
        "dialogue": [
          {"role": "Shopper", "target": "Ce pull est trop petit.", "meaning": "This jumper is too small."},
          {"role": "Assistant", "target": "Vous voulez la taille au-dessus ?", "meaning": "Would you like the next size up?"},
          {"role": "Shopper", "target": "Oui. Vous l’avez dans une autre couleur ?", "meaning": "Yes. Do you have it in another colour?"},
          {"role": "Assistant", "target": "Oui, en bleu et en noir.", "meaning": "Yes, in blue and in black."},
          {"role": "Shopper", "target": "En bleu, s’il vous plaît.", "meaning": "In blue, please."},
          {"role": "Assistant", "target": "Voilà.", "meaning": "Here you are."}
        ],
        "grammar": {"title": "Colours agree with the noun", "explanation": "Common colours such as bleu and noir change for feminine or plural nouns: une robe bleue, des chaussettes noires. After en to request a colour, say en bleu. Dans une autre couleur means in another colour; learn the whole request ending."},
        "sentence": {
          "tokens": ["petit", "pull", "trop", "est", "Ce"],
          "answer": "Ce pull est trop petit.",
          "meaning": "This jumper is too small.",
          "hint": "Trop goes immediately before petit.",
          "explanation": "Petit agrees with the masculine noun pull. Trop does not change."
        }
      },
      {
        "slug": "try-before-buying",
        "title": "Try before buying",
        "level": "A2",
        "outcome": "Request a fitting room and explain a problem with fit.",
        "words": [
          ["fitting-room", "une cabine d’essayage", "a fitting room", "Où est la cabine d’essayage ?", "Where is the fitting room?", "", {"gender": "feminine"}],
          ["try-on", "essayer", "to try on", "Je peux essayer cette veste ?", "Can I try on this jacket?", "Infinitive verb. Also means to try in other contexts."],
          ["jacket", "une veste", "a jacket", "Cette veste me va bien.", "This jacket fits me well.", "", {"gender": "feminine"}],
          ["too-tight", "trop serré", "too tight", "Ce pantalon est trop serré.", "These trousers are too tight.", "Adjective phrase; feminine trop serrée."],
          ["too-long", "trop long", "too long", "Les manches sont trop longues.", "The sleeves are too long.", "Adjective forms: long, longue, longs, longues."],
          ["fits-me", "ça me va", "it fits me; it suits me", "Ça me va bien. Je le prends.", "It fits me well. I’ll take it.", "Everyday phrase for fit or appearance; the context identifies which meaning is intended."]
        ],
        "dialogue": [
          {"role": "Shopper", "target": "Je peux essayer cette veste ?", "meaning": "Can I try on this jacket?"},
          {"role": "Assistant", "target": "Oui, les cabines sont au fond.", "meaning": "Yes, the fitting rooms are at the back."},
          {"role": "Shopper", "target": "Les manches sont trop longues.", "meaning": "The sleeves are too long."},
          {"role": "Assistant", "target": "Je vous apporte une taille plus petite.", "meaning": "I’ll bring you a smaller size."},
          {"role": "Shopper", "target": "Merci. Celle-ci me va bien.", "meaning": "Thank you. This one fits me well."},
          {"role": "Assistant", "target": "Très bien.", "meaning": "Very good."}
        ],
        "grammar": {"title": "Replace a feminine item with la", "explanation": "Je la prends means I’ll take it when it refers to a feminine item such as une veste. Put la before the conjugated verb. Use le for a masculine item."},
        "sentence": {
          "tokens": ["veste", "essayer", "Je", "cette", "peux"],
          "answer": "Je peux essayer cette veste ?",
          "meaning": "Can I try on this jacket?",
          "hint": "Je peux is followed by the action.",
          "explanation": "Essayer stays in the infinitive after peux. Cette agrees with veste."
        }
      },
      {
        "slug": "return-an-item",
        "title": "Ask about a return",
        "level": "A2",
        "outcome": "Bring back a defective item and ask whether exchange is possible.",
        "words": [
          ["exchange", "un échange", "an exchange", "Un échange est possible ?", "Is an exchange possible?", "Ask about the shop’s conditions.", {"gender": "masculine"}],
          ["refund", "un remboursement", "a refund", "Je voudrais un remboursement.", "I would like a refund.", "This phrase does not establish a right to a refund.", {"gender": "masculine"}],
          ["proof-of-purchase", "un ticket de caisse", "a till receipt", "Voici le ticket de caisse.", "Here is the till receipt.", "A till receipt; keep it if you may need to return an item. Conditions vary by shop and situation.", {"gender": "masculine"}],
          ["defect", "un défaut", "a defect", "Il y a un défaut sur la manche.", "There is a defect on the sleeve.", "", {"gender": "masculine"}],
          ["return-item", "rapporter", "to bring back", "Je voudrais rapporter ce pull.", "I would like to bring this jumper back.", "Infinitive verb; bringing an item back to the shop."],
          ["does-not-fit", "ça ne me va pas", "it does not fit me; it does not suit me", "Ce pantalon, ça ne me va pas.", "These trousers don’t fit me.", "Everyday phrase. Here the context is an unsuitable fit."]
        ],
        "dialogue": [
          {"role": "Shopper", "target": "Je voudrais rapporter ce pull. Il y a un défaut.", "meaning": "I would like to bring this jumper back. There is a defect."},
          {"role": "Assistant", "target": "Vous avez le ticket de caisse ?", "meaning": "Do you have the till receipt?"},
          {"role": "Shopper", "target": "Oui, le voici. Un échange est possible ?", "meaning": "Yes, here it is. Is an exchange possible?"},
          {"role": "Assistant", "target": "Oui. Je vais chercher le même pull.", "meaning": "Yes. I’ll look for the same jumper."}
        ],
        "grammar": {"title": "A polite request with voudrais", "explanation": "Je voudrais + infinitive softens a request: je voudrais rapporter cet article. Cet is used instead of ce before a masculine noun starting with a vowel sound."},
        "sentence": {
          "tokens": ["article", "rapporter", "voudrais", "cet", "Je"],
          "answer": "Je voudrais rapporter cet article.",
          "meaning": "I would like to bring this item back.",
          "hint": "Start Je voudrais rapporter.",
          "explanation": "Article is masculine and begins with a vowel sound, so this is cet article."
        }
      }
    ]
  },
  {
    "slug": "housing",
    "title": "Home and housing",
    "role": "Resident",
    "lessons": [
      {
        "slug": "rooms-at-home",
        "title": "Rooms at home",
        "level": "A1",
        "outcome": "Ask about rooms while visiting a possible home.",
        "words": [
          ["apartment", "un appartement", "a flat; an apartment", "J’habite dans un petit appartement.", "I live in a small flat.", "", {"gender": "masculine"}],
          ["kitchen", "une cuisine", "a kitchen", "La cuisine est à gauche.", "The kitchen is on the left.", "Here a room, not cooking or cuisine as a style.", {"gender": "feminine"}],
          ["bedroom", "une chambre", "a bedroom", "Il y a deux chambres.", "There are two bedrooms.", "", {"gender": "feminine"}],
          ["live-in", "habiter", "to live", "J’habite dans un appartement.", "I live in a flat.", "Habiter dans + a type of home; habiter à + a town."],
          ["bathroom", "une salle de bains", "a bathroom", "La salle de bains est à droite.", "The bathroom is on the right.", "It does not necessarily contain a toilet.", {"gender": "feminine"}],
          ["toilet", "les toilettes", "the toilet; the toilets", "Où sont les toilettes ?", "Where is the toilet?", "Plural even for one toilet room.", {"gender": "feminine"}],
          ["living-room", "un salon", "a living room", "Le salon est à côté de la cuisine.", "The living room is next to the kitchen.", "", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Resident", "target": "Il y a deux chambres ?", "meaning": "Are there two bedrooms?"},
          {"role": "Agent", "target": "Oui. La cuisine est à gauche.", "meaning": "Yes. The kitchen is on the left."},
          {"role": "Resident", "target": "Et où sont les toilettes ?", "meaning": "And where is the toilet?"},
          {"role": "Agent", "target": "À droite, après la salle de bains.", "meaning": "On the right, after the bathroom."}
        ],
        "grammar": {"title": "Il y a for a home description", "explanation": "Il y a means there is or there are. It stays the same with one or several rooms: il y a une chambre; il y a deux chambres. Habiter names the action of living somewhere: j’habite dans cet appartement."},
        "sentence": {
          "tokens": ["chambres", "a", "Il", "deux", "y"],
          "answer": "Il y a deux chambres.",
          "meaning": "There are two bedrooms.",
          "hint": "Keep Il y a together at the start.",
          "explanation": "The fixed expression il y a does not change for plural chambres."
        }
      },
      {
        "slug": "furniture-and-essentials",
        "title": "Set up a furnished home",
        "level": "A1",
        "outcome": "Agree where to put a bed and sofa when moving in.",
        "words": [
          ["bed", "un lit", "a bed", "On peut mettre le lit ici ?", "Can we put the bed here?", "Final t is silent.", {"gender": "masculine"}],
          ["chair", "une chaise", "a chair", "Il manque une chaise.", "A chair is missing.", "", {"gender": "feminine"}],
          ["sofa", "un canapé", "a sofa", "Le canapé est dans le salon.", "The sofa is in the living room.", "", {"gender": "masculine"}],
          ["put", "mettre", "to put", "On peut mettre le lit ici ?", "Can we put the bed here?", "Here mettre means put; je mets, on met."],
          ["fridge", "un réfrigérateur", "a refrigerator", "Le réfrigérateur est dans la cuisine.", "The refrigerator is in the kitchen.", "Frigo is a common informal alternative.", {"gender": "masculine"}],
          ["washing-machine", "un lave-linge", "a washing machine", "Il y a un lave-linge ?", "Is there a washing machine?", "", {"gender": "masculine"}],
          ["wardrobe", "une armoire", "a wardrobe", "Il y a une armoire dans la chambre.", "There is a wardrobe in the bedroom.", "", {"gender": "feminine"}]
        ],
        "dialogue": [
          {"role": "Resident", "target": "On peut mettre le lit ici ?", "meaning": "Can we put the bed here?"},
          {"role": "Friend", "target": "Oui, près de la fenêtre.", "meaning": "Yes, near the window."},
          {"role": "Resident", "target": "Et le canapé dans le salon ?", "meaning": "And the sofa in the living room?"},
          {"role": "Friend", "target": "Oui. Je vais t’aider.", "meaning": "Yes. I’ll help you."}
        ],
        "grammar": {"title": "On peut + infinitive", "explanation": "On peut mettre le lit ici ? means Can we put the bed here? On often means we in everyday speech. Mettre stays in the infinitive after peut. The dialogue is between friends, so tu is appropriate."},
        "sentence": {
          "tokens": ["salon", "est", "Le", "dans", "canapé", "le"],
          "answer": "Le canapé est dans le salon.",
          "meaning": "The sofa is in the living room.",
          "hint": "Name the sofa first, then its location.",
          "explanation": "Dans le salon gives the location. Both canapé and salon are masculine."
        }
      },
      {
        "slug": "arrive-at-a-building",
        "title": "Arrive at a building",
        "level": "A1",
        "outcome": "Ask for the floor and identify which key opens a door.",
        "words": [
          ["key", "une clé", "a key", "Cette clé ouvre la porte.", "This key opens the door.", "Clef is another accepted spelling.", {"gender": "feminine"}],
          ["door", "une porte", "a door", "La porte est fermée.", "The door is closed.", "", {"gender": "feminine"}],
          ["floor", "un étage", "a floor; a storey", "L’appartement est à quel étage ?", "Which floor is the flat on?", "French étage numbering starts above the ground floor.", {"gender": "masculine"}],
          ["lift", "un ascenseur", "a lift; an elevator", "L’ascenseur est à gauche.", "The lift is on the left.", "", {"gender": "masculine"}],
          ["open", "ouvrir", "to open", "Cette clé ouvre la porte.", "This key opens the door.", "Infinitive ouvrir; present form ouvre."],
          ["ground-floor", "le rez-de-chaussée", "the ground floor", "J’habite au rez-de-chaussée.", "I live on the ground floor.", "Au combines à and le.", {"gender": "masculine"}],
          ["stairs", "un escalier", "a staircase", "L’escalier est derrière cette porte.", "The staircase is behind this door.", "Singular when referring to one staircase.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Resident", "target": "L’appartement est à quel étage ?", "meaning": "Which floor is the flat on?"},
          {"role": "Neighbour", "target": "Au deuxième. L’ascenseur est à gauche.", "meaning": "On the second. The lift is on the left."},
          {"role": "Resident", "target": "Cette clé ouvre la porte de l’immeuble ?", "meaning": "Does this key open the building door?"},
          {"role": "Neighbour", "target": "Oui, et la petite ouvre l’appartement.", "meaning": "Yes, and the small one opens the flat."}
        ],
        "grammar": {"title": "Au for a floor", "explanation": "Say au deuxième étage or au rez-de-chaussée for on that floor. Au is the contraction of à + le. The ground floor is not called le premier étage in France. Ouvrir has the present form ouvre: cette clé ouvre la porte."},
        "sentence": {
          "tokens": ["rez-de-chaussée", "au", "J’habite"],
          "answer": "J’habite au rez-de-chaussée.",
          "meaning": "I live on the ground floor.",
          "hint": "Use au before rez-de-chaussée.",
          "explanation": "Au combines à and le before this masculine floor name."
        }
      },
      {
        "slug": "ask-about-a-rental",
        "title": "Ask about a rental",
        "level": "A2",
        "outcome": "Check rent and included charges before reading a tenancy agreement.",
        "words": [
          ["rent", "un loyer", "rent; a rent payment", "Le loyer est de huit cents euros.", "The rent is eight hundred euros.", "", {"gender": "masculine"}],
          ["service-charges", "les charges", "service charges", "Les charges sont comprises ?", "Are service charges included?", "Ask what is included; arrangements vary.", {"gender": "feminine"}],
          ["tenancy-agreement", "un bail", "a tenancy agreement", "Je voudrais lire le bail.", "I would like to read the tenancy agreement.", "Plural: des baux.", {"gender": "masculine"}],
          ["landlord", "le propriétaire", "the landlord; the owner", "Je vais appeler le propriétaire.", "I’m going to call the landlord.", "Feminine: la propriétaire. Here the owner who rents out the home; not a statement about legal responsibilities.", {"gender": "masculine"}],
          ["move-in", "emménager", "to move in", "Je vais emménager samedi.", "I’m going to move in on Saturday.", "One move into a new home; déménager means move home."],
          ["furnished", "meublé", "furnished", "L’appartement est meublé.", "The flat is furnished.", "Adjective: meublé for appartement; meublée with a feminine noun."],
          ["tenant", "un locataire", "a tenant", "Je suis le nouveau locataire.", "I’m the new tenant.", "Feminine: une locataire.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Resident", "target": "Quel est le loyer mensuel ?", "meaning": "What is the monthly rent?"},
          {"role": "Agent", "target": "Huit cents euros, charges comprises.", "meaning": "Eight hundred euros, including service charges."},
          {"role": "Resident", "target": "Quelles charges sont comprises ?", "meaning": "Which service charges are included?"},
          {"role": "Agent", "target": "L’eau et l’entretien de l’immeuble.", "meaning": "Water and building maintenance."},
          {"role": "Resident", "target": "Je voudrais lire le bail avant d’emménager.", "meaning": "I would like to read the tenancy agreement before moving in."},
          {"role": "Agent", "target": "Bien sûr, je vous l’envoie.", "meaning": "Of course, I’ll send it to you."}
        ],
        "grammar": {"title": "Ask which costs are included", "explanation": "Quelles agrees with feminine plural charges. Comprises also agrees with charges. Learn Les charges sont comprises à as a practical question, then ask what those charges cover."},
        "sentence": {
          "tokens": ["comprises", "sont", "charges", "Les"],
          "answer": "Les charges sont comprises ?",
          "meaning": "Are service charges included?",
          "hint": "Use sont after the plural charges.",
          "explanation": "Comprises takes feminine plural agreement with charges."
        }
      },
      {
        "slug": "report-a-home-problem",
        "title": "Report a home problem",
        "level": "A2",
        "outcome": "Report a fault and agree a repair visit.",
        "words": [
          ["heating", "le chauffage", "the heating", "Le chauffage ne fonctionne pas.", "The heating is not working.", "", {"gender": "masculine"}],
          ["leak", "une fuite", "a leak", "Il y a une fuite sous l’évier.", "There is a leak under the kitchen sink.", "", {"gender": "feminine"}],
          ["tap", "un robinet", "a tap; a faucet", "Le robinet de la cuisine coule.", "The kitchen tap is leaking.", "", {"gender": "masculine"}],
          ["window", "une fenêtre", "a window", "La fenêtre ferme mal.", "The window doesn’t close properly.", "", {"gender": "feminine"}],
          ["arrange-visit", "faire venir quelqu’un", "to arrange for someone to come", "Vous pouvez faire venir quelqu’un demain ?", "Can you arrange for someone to come tomorrow?", "Learn as a request chunk; someone else will come to help."],
          ["not-working", "en panne", "out of order; broken down", "Le lave-linge est en panne.", "The washing machine has broken down.", "Fixed phrase used for equipment that is not working."],
          ["repair", "une réparation", "a repair", "La réparation est prévue demain matin.", "The repair is scheduled for tomorrow morning.", "", {"gender": "feminine"}]
        ],
        "dialogue": [
          {"role": "Resident", "target": "Bonjour, le chauffage ne fonctionne pas.", "meaning": "Hello, the heating is not working."},
          {"role": "Landlord", "target": "Depuis quand ?", "meaning": "Since when?"},
          {"role": "Resident", "target": "Depuis hier. Vous pouvez faire venir quelqu’un ?", "meaning": "Since yesterday. Can you arrange for someone to come?"},
          {"role": "Landlord", "target": "Oui, un technicien peut venir demain matin.", "meaning": "Yes, a technician can come tomorrow morning."},
          {"role": "Resident", "target": "Je serai là. Merci.", "meaning": "I’ll be there. Thank you."},
          {"role": "Landlord", "target": "Très bien, je confirme le rendez-vous.", "meaning": "Very good, I’ll confirm the appointment."}
        ],
        "grammar": {"title": "Ne… pas around the verb", "explanation": "Put ne before the conjugated verb and pas after it: le chauffage ne fonctionne pas. Everyday speech often drops ne, but the full form is useful for writing to a landlord."},
        "sentence": {
          "tokens": ["fonctionne", "Le", "pas", "chauffage", "ne"],
          "answer": "Le chauffage ne fonctionne pas.",
          "meaning": "The heating is not working.",
          "hint": "Put ne and pas on either side of fonctionne.",
          "explanation": "Ne… pas makes the statement negative. Chauffage is masculine singular."
        }
      }
    ]
  },
  {
    "slug": "transport",
    "title": "Transport",
    "role": "Passenger",
    "lessons": [
      {
        "slug": "choose-transport",
        "title": "Choose how to travel",
        "level": "A1",
        "outcome": "Say how you travel to the centre or to work.",
        "words": [
          ["bus", "un bus", "a bus", "Je prends le bus pour aller au travail.", "I take the bus to get to work.", "Pronounce the final s.", {"gender": "masculine"}],
          ["metro", "le métro", "the metro; the underground", "On va au centre en métro.", "We’re going to the centre by metro.", "", {"gender": "masculine"}],
          ["take-bus", "prendre le bus", "to take the bus", "Je prends le bus pour aller au travail.", "I take the bus to get to work.", "Infinitive prendre; je prends."],
          ["train", "un train", "a train", "Ce train va à Lyon ?", "Does this train go to Lyon?", "", {"gender": "masculine"}],
          ["bicycle", "un vélo", "a bicycle", "Je vais au travail à vélo.", "I go to work by bicycle.", "Use à vélo.", {"gender": "masculine"}],
          ["on-foot", "à pied", "on foot", "La gare est à dix minutes à pied.", "The station is a ten-minute walk away.", "Travel phrase. Pied stays singular in à pied."],
          ["tram", "un tramway", "a tram", "Le tramway arrive dans deux minutes.", "The tram is arriving in two minutes.", "Tram is a common shorter form.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Passenger", "target": "Vous allez au centre en métro ?", "meaning": "Are you going to the centre by metro?"},
          {"role": "Neighbour", "target": "Non, j’y vais à vélo. Et vous ?", "meaning": "No, I’m going there by bicycle. And you?"},
          {"role": "Passenger", "target": "Je prends le bus.", "meaning": "I’m taking the bus."},
          {"role": "Neighbour", "target": "Alors, à tout à l’heure !", "meaning": "See you shortly, then!"}
        ],
        "grammar": {"title": "En métro, à vélo, à pied", "explanation": "Learn these travel expressions as chunks: en bus, en métro, en train, à vélo, à pied. Prendre le bus is another common way to say to take the bus."},
        "sentence": {
          "tokens": ["bus", "Je", "le", "prends"],
          "answer": "Je prends le bus.",
          "meaning": "I take the bus.",
          "hint": "Start with Je prends.",
          "explanation": "Use the definite article le when talking about taking the bus."
        }
      },
      {
        "slug": "find-your-stop",
        "title": "Find your stop",
        "level": "A1",
        "outcome": "Find the right bus stop and check the direction before boarding.",
        "words": [
          ["stop", "un arrêt", "a bus or tram stop", "Où est l’arrêt de bus ?", "Where is the bus stop?", "Here a place where a bus or tram stops.", {"gender": "masculine"}],
          ["get-on", "monter dans", "to get on; to board", "Je monte dans le bus.", "I get on the bus.", "Monter dans le train or dans le bus; dans introduces the vehicle."],
          ["railway-station", "une gare", "a railway station", "Je cherche la gare.", "I’m looking for the railway station.", "", {"gender": "feminine"}],
          ["platform", "un quai", "a platform", "Notre train part de quel quai ?", "Which platform does our train leave from?", "Check the actual platform or track signs.", {"gender": "masculine"}],
          ["line", "une ligne", "a transport line", "Je prends la ligne deux.", "I take line two.", "", {"gender": "feminine"}],
          ["towards", "direction", "towards; in the direction of", "Prenez la ligne deux, direction Nation.", "Take line two towards Nation.", "Travel phrase used without an article before the destination."],
          ["metro-station", "une station", "a metro station", "Où est la station de métro ?", "Where is the metro station?", "Station is used for metro stops.", {"gender": "feminine"}]
        ],
        "dialogue": [
          {"role": "Passenger", "target": "Où est l’arrêt de la ligne deux ?", "meaning": "Where is the stop for line two?"},
          {"role": "Staff", "target": "Devant la gare.", "meaning": "In front of the railway station."},
          {"role": "Passenger", "target": "Je monte dans quel bus pour le centre ?", "meaning": "Which bus do I board for the centre?"},
          {"role": "Staff", "target": "Le deux, direction centre-ville.", "meaning": "The two, towards the town centre."}
        ],
        "grammar": {"title": "Du means de + le", "explanation": "Le train part du quai trois means the train leaves from platform three. Du combines de and le. With a feminine place use de la: près de la gare."},
        "sentence": {
          "tokens": ["deux", "la", "prends", "ligne", "Je"],
          "answer": "Je prends la ligne deux.",
          "meaning": "I take line two.",
          "hint": "Use la with ligne.",
          "explanation": "Ligne is feminine. Put the route number after ligne."
        }
      },
      {
        "slug": "buy-a-ticket",
        "title": "Buy a ticket",
        "level": "A1",
        "outcome": "Choose a single or return and confirm the day of travel.",
        "words": [
          ["rail-ticket", "un billet", "a ticket for a journey", "Un billet pour Lille, s’il vous plaît.", "A ticket to Lille, please.", "Common for rail journeys.", {"gender": "masculine"}],
          ["single", "un aller simple", "a single ticket; a one-way journey", "Je voudrais un aller simple pour Lille.", "I would like a single ticket to Lille.", "", {"gender": "masculine"}],
          ["return", "un aller-retour", "a return ticket; a round trip", "Un aller-retour pour Lyon, s’il vous plaît.", "A return ticket to Lyon, please.", "", {"gender": "masculine"}],
          ["ticket-machine", "un distributeur", "a ticket machine", "Je peux acheter mon billet au distributeur ?", "Can I buy my ticket at the machine?", "Here a ticket machine; the context matters.", {"gender": "masculine"}],
          ["buy-ticket", "acheter un billet", "to buy a ticket", "Je voudrais acheter un billet pour Lille.", "I would like to buy a ticket to Lille.", "A useful infinitive phrase after voudrais."],
          ["validate", "valider", "to validate a travel ticket or pass", "Je dois valider mon billet ici ?", "Do I need to validate my ticket here?", "Infinitive verb. Ask staff: validation arrangements vary by network and ticket."],
          ["ticket-counter", "un guichet", "a ticket counter", "Le guichet est ouvert ?", "Is the ticket counter open?", "Final t is silent.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Passenger", "target": "Je voudrais acheter un billet pour Lille.", "meaning": "I would like to buy a ticket to Lille."},
          {"role": "Staff", "target": "Un aller simple ou un aller-retour ?", "meaning": "A single or a return?"},
          {"role": "Passenger", "target": "Un aller simple, pour demain matin.", "meaning": "A single, for tomorrow morning."},
          {"role": "Staff", "target": "Il y a un train à neuf heures.", "meaning": "There is a train at nine o’clock."},
          {"role": "Passenger", "target": "Très bien, je prends ce train.", "meaning": "Very good, I’ll take that train."},
          {"role": "Staff", "target": "Voilà votre billet.", "meaning": "Here is your ticket."}
        ],
        "grammar": {"title": "Pour gives the destination", "explanation": "In un billet pour Lille, pour introduces the destination. Pour demain gives the intended day. Ou without an accent means or when choosing single or return."},
        "sentence": {
          "tokens": ["Lille", "aller", "pour", "Un", "simple"],
          "answer": "Un aller simple pour Lille.",
          "meaning": "A single ticket to Lille.",
          "hint": "Keep aller simple together.",
          "explanation": "Un aller simple names a one-way journey. Pour introduces the destination."
        }
      },
      {
        "slug": "understand-a-journey",
        "title": "Understand a journey",
        "level": "A2",
        "outcome": "Check whether you must change trains and how long you have.",
        "words": [
          ["departure", "un départ", "a departure", "Le départ est à neuf heures.", "Departure is at nine o’clock.", "", {"gender": "masculine"}],
          ["arrival", "une arrivée", "an arrival", "L’arrivée est prévue à midi.", "Arrival is scheduled for noon.", "", {"gender": "feminine"}],
          ["connection", "une correspondance", "a connection; a change of service", "Il y a une correspondance à Tours.", "There is a change at Tours.", "", {"gender": "feminine"}],
          ["direct", "direct", "direct; without a change", "Ce train est direct pour Lyon ?", "Is this train direct to Lyon?", "Adjective; feminine directe. Direct does not necessarily mean non-stop."],
          ["change-trains", "changer de train", "to change trains", "Je dois changer de train à Tours.", "I need to change trains at Tours.", "No article between changer de and train in this expression."],
          ["get-off", "descendre", "to get off", "Je dois descendre au prochain arrêt.", "I need to get off at the next stop.", "Infinitive verb. Descendre du bus means get off the bus."],
          ["timetable", "un horaire", "a departure or arrival time", "Je vérifie les horaires des trains.", "I’m checking the train times.", "Les horaires commonly means the service times or timetable.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Passenger", "target": "Ce train est direct ?", "meaning": "Is this train direct?"},
          {"role": "Staff", "target": "Non, il y a une correspondance à Tours.", "meaning": "No, there is a change at Tours."},
          {"role": "Passenger", "target": "J’ai combien de temps pour changer de train ?", "meaning": "How much time do I have to change trains?"},
          {"role": "Staff", "target": "Vingt minutes.", "meaning": "Twenty minutes."},
          {"role": "Passenger", "target": "Et l’arrivée à Lille ?", "meaning": "And arrival in Lille?"},
          {"role": "Staff", "target": "À midi.", "meaning": "At noon."}
        ],
        "grammar": {"title": "Devoir for a necessary action", "explanation": "Je dois + infinitive means I need to or I must: je dois descendre. The action verb does not change after dois."},
        "sentence": {
          "tokens": ["arrêt", "dois", "au", "Je", "prochain", "descendre"],
          "answer": "Je dois descendre au prochain arrêt.",
          "meaning": "I need to get off at the next stop.",
          "hint": "Start Je dois descendre.",
          "explanation": "Au combines à and le. Prochain comes before arrêt in this time-order expression."
        }
      },
      {
        "slug": "handle-disruption",
        "title": "Handle a travel disruption",
        "level": "A2",
        "outcome": "Find where and when a replacement service leaves.",
        "words": [
          ["delay", "un retard", "a delay", "Le train a vingt minutes de retard.", "The train is twenty minutes late.", "Avoir du retard means to be delayed.", {"gender": "masculine"}],
          ["cancelled", "annulé", "cancelled", "Mon train est annulé.", "My train is cancelled.", "Adjective: annulé with train, annulée with a feminine noun."],
          ["replacement-bus", "un car de remplacement", "a replacement coach or bus", "Où part le car de remplacement ?", "Where does the replacement coach leave from?", "Car usually means a coach, not a private car.", {"gender": "masculine"}],
          ["how-long", "dans combien de temps ?", "how long from now?", "Le prochain bus arrive dans combien de temps ?", "How long until the next bus arrives?", "Ask how long until an event, rather than the clock time."],
          ["next-service", "le prochain", "the next one", "Le prochain arrive dans dix minutes.", "The next one arrives in ten minutes.", "Masculine form referring back to a train, bus or other masculine noun; feminine la prochaine."],
          ["another-route", "un autre itinéraire", "another route", "Il y a un autre itinéraire ?", "Is there another route?", "Itinéraire means a route.", {"gender": "masculine"}],
          ["information", "un renseignement", "a piece of information", "Je voudrais un renseignement sur les cars.", "I would like some information about the coaches.", "Des renseignements means information.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Passenger", "target": "Mon train est annulé. Il y a un autre itinéraire ?", "meaning": "My train is cancelled. Is there another route?"},
          {"role": "Staff", "target": "Vous pouvez prendre le car de remplacement.", "meaning": "You can take the replacement coach."},
          {"role": "Passenger", "target": "Il part d’où, et dans combien de temps ?", "meaning": "Where does it leave from, and how long from now?"},
          {"role": "Staff", "target": "Devant la gare, dans dix minutes.", "meaning": "In front of the railway station, in ten minutes."}
        ],
        "grammar": {"title": "Avoir for a delay", "explanation": "French uses avoir with retard: le train a vingt minutes de retard. With cancelled, use être: le train est annulé. D’où asks from where."},
        "sentence": {
          "tokens": ["train", "annulé", "est", "Mon"],
          "answer": "Mon train est annulé.",
          "meaning": "My train is cancelled.",
          "hint": "Put est before annulé.",
          "explanation": "Annulé agrees with the masculine singular train. Mon means my."
        }
      }
    ]
  }
];
