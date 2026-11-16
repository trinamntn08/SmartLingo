import type { TopicDraft } from '../build-topic';

// Original draft text; owner review required. Sources and limits: docs/curriculum-food-audit.md.
export const foodTravelTopics: TopicDraft[] = [
  {
    "slug": "cooking",
    "title": "Cooking",
    "role": "Home cook",
    "lessons": [
      {
        "slug": "prepare-workspace",
        "title": "Prepare a place to cook",
        "level": "A1",
        "outcome": "Find basic tools and prepare a clean work surface.",
        "words": [
          ["chopping-board", "une planche à découper", "a chopping board", "Je coupe les légumes sur la planche à découper.", "I cut the vegetables on the chopping board.", "Learn the whole noun phrase.", {"gender": "feminine"}],
          ["bowl", "un bol", "a bowl", "Je mets les légumes dans un bol.", "I put the vegetables in a bowl.", "", {"gender": "masculine"}],
          ["spoon", "une cuillère", "a spoon", "Tu peux me passer une cuillère ?", "Can you pass me a spoon?", "Cuiller is another accepted spelling.", {"gender": "feminine"}],
          ["kitchen-scales", "une balance", "a set of kitchen scales", "La balance est sur la table.", "The kitchen scales are on the table.", "Singular in French. Here a device for weighing ingredients.", {"gender": "feminine"}],
          ["wash-hands", "se laver les mains", "to wash one’s hands", "Je me lave les mains avant de cuisiner.", "I wash my hands before cooking.", "Je me lave; tu te laves. Use les mains rather than mes mains in this expression."],
          ["clean", "nettoyer", "to clean", "Je nettoie la table.", "I clean the table.", "Infinitive nettoyer; present je nettoie."]
        ],
        "dialogue": [
          {"role": "Home cook", "target": "Où est la planche à découper ?", "meaning": "Where is the chopping board?"},
          {"role": "Housemate", "target": "Sur la table, à côté du bol.", "meaning": "On the table, next to the bowl."},
          {"role": "Home cook", "target": "Merci. Je nettoie la table d’abord.", "meaning": "Thank you. I’ll clean the table first."},
          {"role": "Housemate", "target": "D’accord. Je me lave les mains.", "meaning": "All right. I’ll wash my hands."}
        ],
        "grammar": {"title": "Se laver les mains", "explanation": "For an action you do to yourself, the small pronoun changes: je me lave, tu te laves. Learn je me lave les mains as a useful whole phrase. Tu is appropriate with this familiar housemate."},
        "sentence": {
          "tokens": ["les", "lave", "Je", "mains", "me"],
          "answer": "Je me lave les mains.",
          "meaning": "I wash my hands.",
          "hint": "Start Je me lave.",
          "explanation": "Me belongs before lave. French uses les mains in this expression."
        }
      },
      {
        "slug": "prepare-vegetables",
        "title": "Prepare vegetables",
        "level": "A1",
        "outcome": "Identify three vegetables and say how to prepare them.",
        "words": [
          ["onion", "un oignon", "an onion", "Je coupe un oignon.", "I cut an onion.", "The usual pronunciation begins with an o sound, without a separate i sound.", {"gender": "masculine"}],
          ["garlic", "de l’ail", "some garlic", "J’ajoute de l’ail dans la soupe.", "I add some garlic to the soup.", "Masculine despite the elided article. Une gousse d’ail is one clove.", {"gender": "masculine"}],
          ["courgette", "une courgette", "a courgette; a zucchini", "Je lave une courgette.", "I wash a courgette.", "", {"gender": "feminine"}],
          ["wash-vegetables", "laver", "to wash", "Tu peux laver les courgettes ?", "Can you wash the courgettes?", "Laver + a thing; se laver for washing yourself."],
          ["peel", "éplucher", "to peel", "J’épluche les pommes de terre.", "I peel the potatoes.", "Use directly before the food being peeled."],
          ["cut", "couper", "to cut", "Je coupe les courgettes en petits morceaux.", "I cut the courgettes into small pieces.", "En morceaux means into pieces."]
        ],
        "dialogue": [
          {"role": "Home cook", "target": "Tu peux laver les courgettes ?", "meaning": "Can you wash the courgettes?"},
          {"role": "Housemate", "target": "Oui. Et les pommes de terre ?", "meaning": "Yes. And the potatoes?"},
          {"role": "Home cook", "target": "Je les épluche. Tu peux aussi couper l’oignon ?", "meaning": "I’ll peel them. Can you also cut the onion?"},
          {"role": "Housemate", "target": "Oui, je le coupe en petits morceaux.", "meaning": "Yes, I’ll cut it into small pieces."}
        ],
        "grammar": {"title": "Tu peux + infinitive", "explanation": "Ask a familiar person for help with tu peux + an infinitive: tu peux laver les courgettes ? Use vous pouvez with someone you do not know well. The action word stays laver after peux."},
        "sentence": {
          "tokens": ["courgettes", "laver", "Tu", "les", "peux"],
          "answer": "Tu peux laver les courgettes ?",
          "meaning": "Can you wash the courgettes?",
          "hint": "Start Tu peux, then the action.",
          "explanation": "Laver stays in the infinitive after peux."
        }
      },
      {
        "slug": "follow-a-recipe",
        "title": "Follow a simple recipe",
        "level": "A1",
        "outcome": "Read an instruction to add seasoning and mix.",
        "words": [
          ["recipe", "une recette", "a recipe", "Cette recette est pour quatre personnes.", "This recipe is for four people.", "", {"gender": "feminine"}],
          ["salt", "du sel", "some salt", "J’ajoute un peu de sel.", "I add a little salt.", "Du is for an unspecified amount; un peu de sel means a little salt.", {"gender": "masculine"}],
          ["pepper", "du poivre", "some pepper", "Tu veux du poivre dans la soupe ?", "Do you want some pepper in the soup?", "Black or white pepper, rather than a vegetable pepper.", {"gender": "masculine"}],
          ["add", "ajouter", "to add", "J’ajoute le sel, puis je mélange.", "I add the salt, then I mix.", "Recipe instructions often use the infinitive ajouter or the command ajoutez."],
          ["mix", "mélanger", "to mix; to stir together", "Je mélange les légumes avec une cuillère.", "I mix the vegetables with a spoon.", "Je mélange; nous mélangeons."],
          ["a-little", "un peu de", "a little; a little of", "Je mets un peu de poivre.", "I put in a little pepper.", "De becomes d’ before a vowel: un peu d’huile."]
        ],
        "dialogue": [
          {"role": "Home cook", "target": "La recette est pour combien de personnes ?", "meaning": "How many people is the recipe for?"},
          {"role": "Housemate", "target": "Pour quatre. Ajoute un peu de sel.", "meaning": "For four. Add a little salt."},
          {"role": "Home cook", "target": "Et du poivre ?", "meaning": "And some pepper?"},
          {"role": "Housemate", "target": "Oui, un peu. Puis mélange.", "meaning": "Yes, a little. Then mix."}
        ],
        "grammar": {"title": "Small amounts with un peu de", "explanation": "Use un peu de before the ingredient: un peu de sel, un peu de poivre. Before a vowel sound, use d’: un peu d’huile. Puis means then and helps put recipe actions in order."},
        "sentence": {
          "tokens": ["sel", "peu", "J’ajoute", "de", "un"],
          "answer": "J’ajoute un peu de sel.",
          "meaning": "I add a little salt.",
          "hint": "The amount un peu de goes before sel.",
          "explanation": "After un peu, use de rather than du."
        }
      },
      {
        "slug": "control-the-cooking",
        "title": "Control the cooking",
        "level": "A2",
        "outcome": "Choose a pan or oven and follow a simple cooking instruction.",
        "words": [
          ["saucepan", "une casserole", "a saucepan", "Je fais bouillir l’eau dans une casserole.", "I boil the water in a saucepan.", "", {"gender": "feminine"}],
          ["frying-pan", "une poêle", "a frying pan", "Les légumes cuisent dans la poêle.", "The vegetables are cooking in the frying pan.", "Pronounced like poil; here a cooking pan, not un poêle, a stove.", {"gender": "feminine"}],
          ["oven", "un four", "an oven", "Je mets le plat dans le four.", "I put the dish in the oven.", "Here plat means an oven dish, not the main-course sense.", {"gender": "masculine"}],
          ["cook", "faire cuire", "to cook food", "Je fais cuire les légumes dix minutes.", "I cook the vegetables for ten minutes.", "Faire cuire + food: causing the food to cook. Je fais cuire; the food itself cuit."],
          ["boil", "faire bouillir", "to bring to the boil; to boil", "Tu peux faire bouillir l’eau ?", "Can you boil the water?", "Useful fixed verb phrase. Bouillir stays in the infinitive after faire."],
          ["low-heat", "à feu doux", "over a low heat", "Faites cuire la soupe à feu doux.", "Cook the soup over a low heat.", "A recipe instruction; doux describes feu, a masculine noun."]
        ],
        "dialogue": [
          {"role": "Home cook", "target": "Je fais cuire les légumes au four ?", "meaning": "Shall I cook the vegetables in the oven?"},
          {"role": "Housemate", "target": "Non, dans la poêle, à feu doux.", "meaning": "No, in the frying pan, over a low heat."},
          {"role": "Home cook", "target": "Pendant combien de temps ?", "meaning": "For how long?"},
          {"role": "Housemate", "target": "Dix minutes. Mélange de temps en temps.", "meaning": "Ten minutes. Stir from time to time."}
        ],
        "grammar": {"title": "Duration with pendant", "explanation": "Pendant dix minutes means for ten minutes. Everyday instructions can also omit pendant: faites cuire dix minutes. Au four means in the oven; à feu doux describes the heat on the hob. These are language examples, not a complete tested recipe."},
        "sentence": {
          "tokens": ["à", "cuire", "doux", "Faites", "feu"],
          "answer": "Faites cuire à feu doux.",
          "meaning": "Cook over a low heat.",
          "hint": "Keep Faites cuire together.",
          "explanation": "Faites is a command to vous. à feu doux gives the heat setting."
        }
      },
      {
        "slug": "serve-and-clear-away",
        "title": "Serve and put food away",
        "level": "A2",
        "outcome": "Serve a meal and discuss putting leftovers away.",
        "words": [
          ["serve", "servir", "to serve", "Je vais servir la soupe.", "I’m going to serve the soup.", "Present: je sers. Infinitive after vais: servir."],
          ["let-cool", "laisser refroidir", "to let cool", "Je laisse refroidir la soupe.", "I let the soup cool.", "Laisser + infinitive: let something happen. This phrase does not specify storage timing."],
          ["lid", "un couvercle", "a lid", "Où est le couvercle de cette boîte ?", "Where is the lid for this container?", "", {"gender": "masculine"}],
          ["storage-container", "une boîte", "a container; a box", "Je mets les légumes dans une boîte.", "I put the vegetables in a container.", "Here a food-storage container.", {"gender": "feminine"}],
          ["put-in-fridge", "mettre au réfrigérateur", "to put in the refrigerator", "Tu peux mettre cette boîte au réfrigérateur ?", "Can you put this container in the refrigerator?", "Au combines à and le. Frigo is common in conversation."],
          ["leftovers", "les restes", "leftovers", "On garde les restes pour demain ?", "Shall we keep the leftovers for tomorrow?", "Plural for leftover food.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Home cook", "target": "Je vais servir la soupe. Tu veux un bol ?", "meaning": "I’m going to serve the soup. Would you like a bowl?"},
          {"role": "Housemate", "target": "Oui, merci. Il reste des légumes ?", "meaning": "Yes, thank you. Are there any vegetables left?"},
          {"role": "Home cook", "target": "Oui. Tu peux les mettre dans une boîte ?", "meaning": "Yes. Can you put them in a container?"},
          {"role": "Housemate", "target": "D’accord. Je prends aussi le couvercle.", "meaning": "All right. I’ll get the lid too."}
        ],
        "grammar": {"title": "Pronouns for food already mentioned", "explanation": "In tu peux les mettre dans une boîte ?, les replaces les légumes. Put les just before the infinitive mettre, the action involving those vegetables. Recycling mettre from Housing lets you make a new practical request."},
        "sentence": {
          "tokens": ["servir", "vais", "soupe", "Je", "la"],
          "answer": "Je vais servir la soupe.",
          "meaning": "I’m going to serve the soup.",
          "hint": "Start Je vais.",
          "explanation": "Servir stays in the infinitive after vais."
        }
      }
    ]
  },
  {
    "slug": "accommodation",
    "title": "Accommodation",
    "role": "Guest",
    "lessons": [
      {
        "slug": "book-a-room",
        "title": "Book a room",
        "level": "A1",
        "outcome": "Request a room type and give the length of a short stay.",
        "words": [
          ["hotel", "un hôtel", "a hotel", "Je cherche un hôtel près de la gare.", "I’m looking for a hotel near the station.", "The h is silent: l’hôtel.", {"gender": "masculine"}],
          ["night", "une nuit", "a night", "Je reste une nuit.", "I’m staying for one night.", "Used to count nights of accommodation.", {"gender": "feminine"}],
          ["double-room", "une chambre double", "a double room", "Je voudrais une chambre double.", "I would like a double room.", "Ask about beds if it matters; room labels do not guarantee a particular bed arrangement.", {"gender": "feminine"}],
          ["single-room", "une chambre simple", "a single room", "Vous avez une chambre simple ?", "Do you have a single room?", "A room intended for one person.", {"gender": "feminine"}],
          ["book-room", "réserver une chambre", "to book a room", "Je voudrais réserver une chambre pour samedi.", "I would like to book a room for Saturday.", "Recycles réserver from Restaurant with a different object."],
          ["for-two-nights", "pour deux nuits", "for two nights", "Une chambre pour deux nuits, s’il vous plaît.", "A room for two nights, please.", "Use plural nuits after deux."]
        ],
        "dialogue": [
          {"role": "Guest", "target": "Bonjour, je voudrais réserver une chambre.", "meaning": "Hello, I would like to book a room."},
          {"role": "Receptionist", "target": "Une chambre simple ou double ?", "meaning": "A single or a double room?"},
          {"role": "Guest", "target": "Double, pour deux nuits, à partir de samedi.", "meaning": "A double, for two nights, from Saturday."},
          {"role": "Receptionist", "target": "Oui, nous avons une chambre disponible.", "meaning": "Yes, we have a room available."}
        ],
        "grammar": {"title": "Pour with the length of a booking", "explanation": "Pour deux nuits gives the intended length of the booking. à partir de samedi means from Saturday. Learn these as practical booking chunks before studying all uses of pour."},
        "sentence": {
          "tokens": ["chambre", "voudrais", "Je", "réserver", "une"],
          "answer": "Je voudrais réserver une chambre.",
          "meaning": "I would like to book a room.",
          "hint": "Start Je voudrais, then the action.",
          "explanation": "Réserver stays in the infinitive after voudrais."
        }
      },
      {
        "slug": "check-in",
        "title": "Check in",
        "level": "A1",
        "outcome": "Give your booking name and respond to a simple check-in request.",
        "words": [
          ["reception", "la réception", "reception; the front desk", "La réception est à l’entrée.", "Reception is at the entrance.", "Here the hotel desk, not a celebration.", {"gender": "feminine"}],
          ["under-what-name", "à quel nom ?", "under what name?", "Votre réservation est à quel nom ?", "Under what name is your reservation?", "Staff ask for the name on the booking. Reply au nom de + name."],
          ["passport", "un passeport", "a passport", "Voici mon passeport.", "Here is my passport.", "Final t is silent.", {"gender": "masculine"}],
          ["identity-document", "une pièce d’identité", "an identity document", "Vous avez une pièce d’identité ?", "Do you have an identity document?", "This is a language example, not a universal document requirement.", {"gender": "feminine"}],
          ["complete-form", "remplir une fiche", "to fill in a form", "Vous pouvez remplir cette fiche ?", "Can you fill in this form?", "Remplir + a form or document; no preposition."],
          ["sign", "signer", "to sign", "Je dois signer ici ?", "Do I need to sign here?", "Infinitive after dois. Present: je signe."]
        ],
        "dialogue": [
          {"role": "Guest", "target": "Bonjour, j’ai une réservation.", "meaning": "Hello, I have a reservation."},
          {"role": "Receptionist", "target": "À quel nom ?", "meaning": "Under what name?"},
          {"role": "Guest", "target": "Au nom de Martin.", "meaning": "Under the name Martin."},
          {"role": "Receptionist", "target": "Merci. Vous pouvez remplir cette fiche ?", "meaning": "Thank you. Can you fill in this form?"},
          {"role": "Guest", "target": "Oui. Je dois signer ici ?", "meaning": "Yes. Do I need to sign here?"},
          {"role": "Receptionist", "target": "Oui, en bas de la fiche.", "meaning": "Yes, at the bottom of the form."}
        ],
        "grammar": {"title": "Your booking name", "explanation": "À quel nom ? is a shortened question used by staff. Reply au nom de Martin. Au combines à and le. After vous pouvez or je dois, keep the action verb in the infinitive: remplir, signer."},
        "sentence": {
          "tokens": ["ici", "dois", "Je", "signer"],
          "answer": "Je dois signer ici ?",
          "meaning": "Do I need to sign here?",
          "hint": "Put the action after Je dois.",
          "explanation": "Signer stays in the infinitive. Ici points to the place to sign."
        }
      },
      {
        "slug": "settle-into-your-room",
        "title": "Settle into your room",
        "level": "A1",
        "outcome": "Ask about breakfast, Wi-Fi and basic room supplies.",
        "words": [
          ["breakfast", "un petit déjeuner", "breakfast", "Le petit déjeuner est à quelle heure ?", "What time is breakfast?", "Also written petit-déjeuner.", {"gender": "masculine"}],
          ["wifi-connection", "une connexion Wi-Fi", "a Wi-Fi connection", "Il y a une connexion Wi-Fi dans la chambre ?", "Is there a Wi-Fi connection in the room?", "", {"gender": "feminine"}],
          ["password", "un mot de passe", "a password", "Quel est le mot de passe du Wi-Fi ?", "What is the Wi-Fi password?", "Keep de in the expression mot de passe.", {"gender": "masculine"}],
          ["bed-linen", "le linge de lit", "bed linen", "Le linge de lit est compris ?", "Is bed linen included?", "Collective singular noun.", {"gender": "masculine"}],
          ["bath-towel", "une serviette de bain", "a bath towel", "Je peux avoir une serviette de bain ?", "Can I have a bath towel?", "De bain identifies a towel; une serviette at a restaurant is a napkin.", {"gender": "feminine"}],
          ["included", "c’est compris ?", "is it included?", "Le petit déjeuner, c’est compris ?", "Is breakfast included?", "Ask about a named service. Included services vary by booking."]
        ],
        "dialogue": [
          {"role": "Guest", "target": "Le petit déjeuner, c’est compris ?", "meaning": "Is breakfast included?"},
          {"role": "Receptionist", "target": "Oui, de sept heures à dix heures.", "meaning": "Yes, from seven to ten o’clock."},
          {"role": "Guest", "target": "Et quel est le mot de passe du Wi-Fi ?", "meaning": "And what is the Wi-Fi password?"},
          {"role": "Receptionist", "target": "Il est écrit sur cette carte.", "meaning": "It’s written on this card."}
        ],
        "grammar": {"title": "De… à… for opening times", "explanation": "De sept heures à dix heures means from seven to ten o’clock. Du in le mot de passe du Wi-Fi combines de and le. C’est compris ? is a short spoken way to ask whether a service is included."},
        "sentence": {
          "tokens": ["est", "passe", "mot", "Quel", "le", "de"],
          "answer": "Quel est le mot de passe ?",
          "meaning": "What is the password?",
          "hint": "Start Quel est.",
          "explanation": "Mot is masculine, so use quel. Keep mot de passe together."
        }
      },
      {
        "slug": "request-help-during-stay",
        "title": "Request help during a stay",
        "level": "A2",
        "outcome": "Explain a room problem and agree a practical response.",
        "words": [
          ["noise", "du bruit", "noise", "Il y a du bruit dans le couloir.", "There is noise in the corridor.", "Un bruit can mean one particular sound.", {"gender": "masculine"}],
          ["air-conditioning", "la climatisation", "air conditioning", "La climatisation ne fonctionne pas.", "The air conditioning is not working.", "La clim is a common informal shortening.", {"gender": "feminine"}],
          ["hot-water", "de l’eau chaude", "some hot water", "Il n’y a pas d’eau chaude.", "There is no hot water.", "Chaude agrees with feminine eau. After pas, de l’ becomes d’.", {"gender": "feminine"}],
          ["missing", "il manque", "something is missing", "Il manque une serviette dans la chambre.", "A towel is missing from the room.", "Il manque + the missing item; il stays singular in this impersonal expression."],
          ["change-rooms", "changer de chambre", "to change rooms", "Est-ce que je peux changer de chambre ?", "Can I change rooms?", "No article between de and chambre in this expression."],
          ["someone-can-come", "quelqu’un peut venir ?", "can someone come?", "La douche ne fonctionne pas. Quelqu’un peut venir ?", "The shower is not working. Can someone come?", "A useful spoken request. Use vous with reception staff."]
        ],
        "dialogue": [
          {"role": "Guest", "target": "Il n’y a pas d’eau chaude dans ma chambre.", "meaning": "There is no hot water in my room."},
          {"role": "Receptionist", "target": "Je vais demander à quelqu’un de venir.", "meaning": "I’ll ask someone to come."},
          {"role": "Guest", "target": "Merci. Est-ce que je peux changer de chambre ?", "meaning": "Thank you. Can I change rooms?"},
          {"role": "Receptionist", "target": "Oui, une autre chambre est disponible.", "meaning": "Yes, another room is available."},
          {"role": "Guest", "target": "Très bien, je la prends.", "meaning": "Very good, I’ll take it."},
          {"role": "Receptionist", "target": "Je vous donne la nouvelle clé.", "meaning": "I’ll give you the new key."}
        ],
        "grammar": {"title": "No hot water", "explanation": "Il n’y a pas d’eau chaude is the negative of il y a de l’eau chaude. After pas, an unspecified amount changes to de or d’. This does not change a definite article naming a particular item: la climatisation ne fonctionne pas."},
        "sentence": {
          "tokens": ["d’eau", "chaude", "a", "Il", "pas", "n’y"],
          "answer": "Il n’y a pas d’eau chaude.",
          "meaning": "There is no hot water.",
          "hint": "Use Il n’y a pas, then the thing that is absent.",
          "explanation": "The negative uses d’eau, rather than de l’eau. Chaude agrees with eau."
        }
      },
      {
        "slug": "check-out",
        "title": "Check out and leave bags",
        "level": "A2",
        "outcome": "Ask about check-out time, luggage storage and a bill.",
        "words": [
          ["leave-room", "libérer la chambre", "to vacate the room", "À quelle heure faut-il libérer la chambre ?", "What time must the room be vacated?", "A common formal hotel expression; staff may also say quitter la chambre."],
          ["luggage", "les bagages", "luggage; bags", "Je peux laisser mes bagages ici ?", "Can I leave my luggage here?", "Usually plural; one item is un bagage.", {"gender": "masculine"}],
          ["leave-bags", "laisser mes bagages", "to leave my luggage", "Je voudrais laisser mes bagages jusqu’à midi.", "I would like to leave my luggage until noon.", "Ask whether storage is available; mes means my with a plural noun."],
          ["until", "jusqu’à", "until", "Je peux rester jusqu’à midi ?", "Can I stay until noon?", "Before les, jusqu’à becomes jusqu’aux: jusqu’aux vacances."],
          ["invoice", "une facture", "an invoice; an itemised bill", "Je peux avoir une facture à mon nom ?", "Can I have an invoice in my name?", "More formal than a payment receipt; useful for accommodation costs.", {"gender": "feminine"}],
          ["extra-charge", "un supplément", "an extra charge", "Il y a un supplément pour les bagages ?", "Is there an extra charge for the luggage?", "Ask before agreeing to an optional service.", {"gender": "masculine"}]
        ],
        "dialogue": [
          {"role": "Guest", "target": "À quelle heure faut-il libérer la chambre ?", "meaning": "What time must the room be vacated?"},
          {"role": "Receptionist", "target": "À onze heures.", "meaning": "At eleven o’clock."},
          {"role": "Guest", "target": "Je peux laisser mes bagages jusqu’à midi ?", "meaning": "Can I leave my luggage until noon?"},
          {"role": "Receptionist", "target": "Oui, ici, sans supplément.", "meaning": "Yes, here, at no extra charge."},
          {"role": "Guest", "target": "Merci. Je peux aussi avoir une facture ?", "meaning": "Thank you. Can I also have an invoice?"},
          {"role": "Receptionist", "target": "Oui, je vous la prépare.", "meaning": "Yes, I’ll prepare it for you."}
        ],
        "grammar": {"title": "Until a time", "explanation": "Jusqu’à midi means until noon; à midi means at noon. The useful request je peux laisser mes bagages… keeps laisser in the infinitive after peux. Faut-il is the question form of il faut, used here as a hotel formula."},
        "sentence": {
          "tokens": ["bagages", "laisser", "mes", "Je", "peux"],
          "answer": "Je peux laisser mes bagages ?",
          "meaning": "Can I leave my luggage?",
          "hint": "Start Je peux.",
          "explanation": "Mes is plural because bagages is plural. Laisser stays in the infinitive."
        }
      }
    ]
  }
];
