# Course catalogue - review drafts

Source inventory checked 2026-11-24 against the exported content modules. French and Japanese share Today, Learn, Review, Report and Profile after homepage language selection. In Learn, Lessons opens topic study. Listening & videos and Speaking provide sentence comprehension, external resources and guided dialogue. English meanings, examples and explanations remain visible.

| Language | Topic banks | Short lessons | Vocabulary appearances | Canonical IDs | Exact written forms |
| --- | ---: | ---: | ---: | ---: | ---: |
| French | 31 | 145 | 922 | 835 | 826 |
| Japanese | 16 | 69 | 414 | 385 | 385 |

These counts come from `lessons` and `japaneseLessons` in [the content entry point](../packages/content/src/index.ts). They describe bundled drafts, not published curriculum, acquired words or proficiency. The French and Japanese daily-course views reuse selected vocabulary and are counted separately from these short lessons; Japanese letters are a separate activity.

## Japanese catalogue and letters

[Japanese short lessons](../packages/content/src/japanese-lessons.ts) include 13 banks of 30 distinct entries across five six-entry lessons each. Four [starter lessons](../packages/content/src/topics/japanese.ts) cover everyday greetings and courtesy, first introductions, and ordering a drink at a café. They add five new senses and reuse 19 canonical vocabulary entries with their existing IDs. The combined inventory contains 8 foundation, 21 A1, 20 A2 and 20 B1-labelled task drafts. The [topic vocabulary record](curriculum/japanese-topic-vocabulary.md) lists the original 13 banks. Entries provide kana readings, English meanings, examples with readings and translations, and usage notes. Practice uses explicit meaning matching.

The [Japanese daily course](../packages/content/src/japanese-course.ts) has 13 draft lessons with 78 vocabulary appearances, bilingual study/dialogue, two contextual choice activities and manual reflection per lesson. Guided-course progress is independent from the 69 library lessons. [Course sources](curriculum/japanese-course-sources.md) records provenance.

Today recommends Hiragana before Katakana; Learn defaults to Japanese letters while vocabulary/topics remain freely accessible. [The alphabet module](../packages/content/src/japanese-alphabet.ts) contains 20 draft row lessons: 10 per script, 46 basic forms each (92 total). Recognition and explicitly saved row study have their own progress and resume; characters do not increase vocabulary-lesson/report totals. [Alphabet scope and sources](curriculum/japanese-alphabet-sources.md) describes the excluded advanced forms, handwriting and review needs.

All Japanese text remains original AI-assisted material for owner and qualified Japanese review. Labels describe selected task demands; neither route claims complete CEFR coverage, JLPT equivalence or assessed proficiency. [Japanese audio](JAPANESE_AUDIO.md) documents optional device speech and the free local fallback; audio availability is not pronunciation approval.

## French catalogue

The French editorial snapshot is dated 2026-11-16 and the inventory was rechecked on 2026-11-22. The app uses the explicit topic order in Learn → Lessons and the topic sidebar. Returning learners can resume their previously studied lesson. Free exploration and owner publication overrides remain available. Complete bilingual examples, dialogues and grammar are in the app and linked source modules. The original drafts require owner review.

The [latest curriculum review pack](curriculum/README.md) owns the full-payload ledger, proposed two-pass progression, six bridge drafts and five support-correction candidates. Those candidates are unregistered and unpublished; they are not included in the inventory below.

The [word-by-word topic audit](CURRICULUM_TOPIC_AUDIT.md) describes the historical 120-lesson inventory. Its greeting-first opening has now been converted into three runtime drafts. Broader gap lists and the 30-area teaching map remain proposals. [Implementation decision](decisions/0019-greetings-first-drafts.md).

31 banks · 145 lessons · 922 vocabulary appearances · 835 canonical senses · 826 distinct written forms. Recycled senses contribute to bank counts. The curriculum remains draft material for owner review.

Each French topic draft includes an optional real-life response with a bilingual model and self-check after sentence building. The 12 new guided lessons offer the same optional response after the sentence exercise. Allow about 10–12 minutes with practice. [French pacing and practice review](curriculum/french-lesson-pacing.md)

### Guided courses and new topics

| Guided course | Lessons available | Topic additions |
| --- | ---: | --- |
| [A1 · First steps in France](curriculum/french-daily-a1.md) | 9 | Workshop check-in (2 lessons, 15 senses) and Neighbourhood wayfinding (2 lessons, 13 senses). |
| [A2 · Everyday independence](curriculum/french-daily-a2.md) | 4 | Changing appointments (4 lessons, 32 senses). |
| [B1 · Explain, solve and participate](curriculum/french-daily-b1.md) | 4 | Travel when plans change (4 lessons, 32 senses). |

Choose a course from Today or Learn. Course progress is independent of the topic library. The 12 additions share one authored draft per situation across both paths. The five existing A1 lessons retain their progress scopes. [Expansion and learner tasks](plans/0056-french-course-expansion.md) · [Lesson 1 authorship](curriculum/french-course-lesson-one.md)

## Everyday greetings and politeness

Suggested prior topics: none. 24 expressions; 0 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/greetings.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Say hello and goodbye (foundation) | Greet a neighbour or shop worker and choose a friendly phrase when leaving. | bonjour · bonsoir · salut · au revoir · à bientôt · à demain · bonne journée · bonne soirée |
| Be polite in everyday exchanges (foundation) | Ask politely, thank someone, respond to thanks and choose a familiar or polite form. | s’il vous plaît · s’il te plaît · merci · merci beaucoup · de rien · pardon · excusez-moi · excuse-moi |
| Ask how someone is (foundation) | Ask how someone is, give a short answer and return the question. | comment allez-vous ? · comment ça va ? · ça va bien · très bien, merci · pas très bien · et vous ? · et toi ? · à tout à l’heure |

## Essential conversation tools

Suggested prior topics: Everyday greetings and politeness. 30 expressions; 4 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/foundations.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Ask someone to repeat (foundation) | Keep a simple exchange going when you do not understand. | je ne comprends pas · vous pouvez répéter ? · plus lentement · encore une fois · ça veut dire quoi ? · j’ai compris |
| Get attention and ask for help (foundation) | Approach someone politely and ask for a small amount of help. | excusez-moi · vous pouvez m’aider ? · s’il vous plaît · merci beaucoup · de rien · un instant |
| Say what you can and cannot do (A1) | Give a clear yes or no and explain a simple limitation. | oui · non · pas encore · ne… plus · je ne peux pas · je n’ai pas de |
| Ask a simple question (A1) | Ask where, when and how to do something using short formulas. | où ? · quand ? · comment ? · quel / quelle ? · est-ce que… ? · est-ce que je peux… ? |
| Check a word or instruction (A1) | Ask for a written word or example and check you have understood. | vous pouvez l’écrire ? · épeler · montrer · un exemple · c’est bien ça ? · en français |

## Numbers and quantities

Suggested prior topics: Essential conversation tools. 30 expressions; 0 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/foundations.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Count from zero to five (foundation) | Say small quantities and read the first six digits. | zéro · un / une · deux · trois · quatre · cinq |
| Read a short number (foundation) | Recognise six to eleven when giving a code or quantity. | six · sept · huit · neuf · dix · onze |
| Understand twelve to seventeen (A1) | Distinguish teen quantities and check a small price. | douze · treize · quatorze · quinze · seize · dix-sept |
| Count beyond the teens (A1) | Recognise eighteen, nineteen, twenty and the next round prices. | dix-huit · dix-neuf · vingt · trente · quarante · cinquante |
| Recognise larger numbers and totals (A1) | Recognise the remaining round numbers up to a hundred and ask for a total. | soixante · soixante-dix · quatre-vingts · quatre-vingt-dix · cent · combien ? |

## People and introductions

Suggested prior topics: Essential conversation tools. 30 expressions; 2 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/daily-life.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Introduce yourself (A1) | Greet someone, give your name and ask theirs politely. | bonjour · s’appeler · un prénom · un nom de famille · enchanté · au revoir |
| Say where you are from (A1) | Say where you live, where you come from and what language you speak. | habiter · venir de · une ville · un pays · une langue · parler |
| Introduce people close to you (A1) | Introduce a friend, identify relatives and say where they live. | un ami · une voisine · une famille · un enfant · un frère · une sœur |
| Keep a first conversation going (A2) | Explain that you are learning and ask someone to speak more slowly. | lentement · un peu · je n’ai pas compris · une question · une réponse · désolé |
| Talk about settling in (A2) | Say that you have recently arrived and ask about the neighbourhood. | un quartier · arriver · connaître · rencontrer · nouveau · bienvenue |

## Dates and availability

Suggested prior topics: Numbers and quantities. 30 expressions; 0 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/foundations.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Choose a weekday (A1) | Suggest a weekday and ask which day suits someone. | lundi · mardi · mercredi · jeudi · vendredi · quel jour ? |
| Talk about nearby days (A1) | Distinguish today, tomorrow and yesterday while making a plan. | samedi · dimanche · aujourd’hui · demain · hier · une semaine |
| Name a month from January to June (A1) | Give the month of a visit or event in the first half of the year. | janvier · février · mars · avril · mai · juin |
| Name a month from July to December (A1) | Say when an event happens in the second half of the year. | juillet · août · septembre · octobre · novembre · décembre |
| Check a date and your availability (A2) | Confirm an exact date and explain whether that week works for you. | une date · un mois · une année · le premier · la semaine prochaine · disponible |

## Time and daily routine

Suggested prior topics: Numbers and quantities, Dates and availability. 30 expressions; 0 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/daily-life.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Get ready and leave on time (A1) | Describe getting ready in the morning and say whether you are ready to leave. | se réveiller · s’habiller · se brosser les dents · se dépêcher · être prêt · à l’heure |
| Tell the time (A1) | Ask the time and understand common morning and evening times. | une heure · une minute · midi · minuit · et demie · le soir |
| Describe when you usually do things (A1) | Say whether an activity happens every day or on weekdays and describe an early or late routine. | tous les jours · un jour · en semaine · le week-end · tôt · tard |
| Describe an ordinary day (A2) | Describe waking up, meals and leaving home in a short sequence. | se lever · se doucher · le petit déjeuner · partir · rentrer · se coucher |
| Explain habits and plans (A2) | Put activities in order and distinguish a habit from an occasional change. | d’abord · ensuite · avant · après · d’habitude · parfois |

## Finding your way on foot

Suggested prior topics: Essential conversation tools. 30 expressions; 0 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/foundations.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Recognise street landmarks (A1) | Identify useful landmarks while following a walking route. | une rue · une place · un carrefour · un pont · un feu · un passage piéton |
| Say where a place is (A1) | Ask for a location and understand common position phrases. | où se trouve… ? · à côté de · en face de · entre · derrière · devant |
| Follow a short walking route (A1) | Understand a few clear walking instructions. | tout droit · tourner à gauche · tourner à droite · traverser · continuer · prendre la première rue |
| Find a useful local service (A1) | Ask for common neighbourhood services using a clear place name. | une mairie · un bureau de poste · une banque · une bibliothèque · un supermarché · un commissariat |
| Check distance and correct your route (A2) | Check how far away a place is and clarify a missed turn. | près de · loin de · au bout de · jusqu’à · faire demi-tour · à combien de minutes à pied ? |

## Transport

Suggested prior topics: Numbers and quantities, Dates and availability, Finding your way on foot. 35 expressions; 0 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/food-home.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Choose how to travel (A1) | Say how you travel to the centre or to work. | un bus · le métro · prendre le bus · un train · un vélo · à pied · un tramway |
| Find your stop (A1) | Find the right bus stop and check the direction before boarding. | un arrêt · monter dans · une gare · un quai · une ligne · direction · une station |
| Buy a ticket (A1) | Choose a single or return and confirm the day of travel. | un billet · un aller simple · un aller-retour · un distributeur · acheter un billet · valider · un guichet |
| Understand a journey (A2) | Check whether you must change trains and how long you have. | un départ · une arrivée · une correspondance · direct · changer de train · descendre · un horaire |
| Handle a travel disruption (A2) | Find where and when a replacement service leaves. | un retard · annulé · un car de remplacement · dans combien de temps ? · le prochain · un autre itinéraire · un renseignement |

## Bakery

Suggested prior topics: Essential conversation tools, Numbers and quantities. 30 expressions; 4 canonical senses recycled from earlier banks. [Source](../packages/content/src/index.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Your morning at the bakery (A1) | Ask for a baguette politely and thank the baker. | bonjour · une baguette · un croissant · un sac · s’il vous plaît · merci |
| Choose your bread (A1) | Choose a loaf, its bake and whether it is sliced. | un pain de campagne · du pain complet · quel pain · une tranche · tranché · bien cuit |
| Choose a sweet treat (A1) | Choose pastries, give a quantity and finish an order. | un pain au chocolat · une brioche · un chausson aux pommes · une tartelette · et avec ça ? · j’en prends deux |
| Buy lunch to take away (A2) | Order a slice of quiche to take away and request heating. | un sandwich · une quiche · une part · une formule · à emporter · réchauffer |
| Order for later (A2) | Order a cake for six and confirm a collection time and name. | un gâteau · une commande · commander · venir chercher · demain · il n’y en a plus |

## Groceries

Suggested prior topics: Numbers and quantities, Bakery. 34 expressions; 0 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/food-home.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Buy fruit and vegetables (A1) | Request weighed tomatoes and counted fruit or vegetables. | une pomme · il me faut · une tomate · une carotte · une pomme de terre · un kilo · une banane |
| Fill the cupboard (A1) | Find dry foods and choose a packet to buy. | du riz · des pâtes · de la farine · acheter · de l’huile · un paquet · du sucre |
| Choose chilled foods (A1) | Ask a deli price and request a portion or slices. | du beurre · du fromage · un yaourt · combien ça coûte ? · du jambon · un prix · de la crème |
| Find products in a shop (A2) | Locate a shop section and find a basket and checkout. | un rayon · une caisse · un panier · chercher · les surgelés · au fond · un chariot |
| Check before paying (A2) | Compare a label with a charged price and ask for a check. | une étiquette · une promotion · vérifier · la monnaie · en espèces · il y a une erreur |

## Restaurant

Suggested prior topics: Essential conversation tools, Numbers and quantities. 34 expressions; 2 canonical senses recycled from earlier banks. [Source](../packages/content/src/index.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Order a coffee and ask for the bill (A1) | Order a coffee politely and ask for the bill. | bonjour · un café · de l’eau · la carte · l’addition · s’il vous plaît |
| Find a table (A1) | Ask for a table for two and agree where to sit. | une table · réserver une table · une réservation · une terrasse · pour deux · à l’intérieur · une personne |
| Choose a meal (A1) | Ask about the dish of the day and choose a set meal. | une entrée · un plat · un dessert · un menu · je prends · végétarien · du poulet |
| Explain food needs (A2) | State an egg allergy and ask staff to check ingredients. | une allergie · un œuf · contenir · une sauce · sans · à part · du lait |
| Finish the meal (A2) | Request missing tableware, split payment and ask for a receipt. | une fourchette · apporter · une serviette · une carte bancaire · séparément · un ticket · un couteau |

## Clothes and shopping

Suggested prior topics: Numbers and quantities. 33 expressions; 1 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/food-home.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Find everyday clothes (A1) | Ask where to find a basic item of clothing. | un pantalon · une chemise · un tee-shirt · une robe · un pull · chercher · un manteau |
| Shoes and accessories (A1) | Choose everyday footwear and ask to try a pair. | des chaussures · des baskets · des chaussettes · une écharpe · une ceinture · porter · un chapeau |
| Ask about size and colour (A1) | Ask for the next clothing size and another colour. | une taille · une pointure · dans une autre couleur · noir · bleu · trop petit · une couleur |
| Try before buying (A2) | Request a fitting room and explain a problem with fit. | une cabine d’essayage · essayer · une veste · trop serré · trop long · ça me va |
| Ask about a return (A2) | Bring back a defective item and ask whether exchange is possible. | un échange · un remboursement · un ticket de caisse · un défaut · rapporter · ça ne me va pas |

## Home and housing

Suggested prior topics: People and introductions, Finding your way on foot. 35 expressions; 1 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/food-home.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Rooms at home (A1) | Ask about rooms while visiting a possible home. | un appartement · une cuisine · une chambre · habiter · une salle de bains · les toilettes · un salon |
| Set up a furnished home (A1) | Agree where to put a bed and sofa when moving in. | un lit · une chaise · un canapé · mettre · un réfrigérateur · un lave-linge · une armoire |
| Arrive at a building (A1) | Ask for the floor and identify which key opens a door. | une clé · une porte · un étage · un ascenseur · ouvrir · le rez-de-chaussée · un escalier |
| Ask about a rental (A2) | Check rent and included charges before reading a tenancy agreement. | un loyer · les charges · un bail · le propriétaire · emménager · meublé · un locataire |
| Report a home problem (A2) | Report a fault and agree a repair visit. | le chauffage · une fuite · un robinet · une fenêtre · faire venir quelqu’un · en panne · une réparation |

## Leisure and weather

Suggested prior topics: Time and daily routine, Dates and availability. 30 expressions; 2 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/daily-life.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Say what you like doing (A1) | Talk about simple leisure interests and ask a friend about theirs. | aimer · lire · la musique · un film · jardiner · dessiner |
| Talk about the weather (A1) | Describe basic weather before making an outdoor plan. | il fait beau · il fait chaud · il fait froid · il pleut · le soleil · le vent |
| Arrange a simple sports activity (A1) | Name a few ways to be active and suggest an easy activity together. | le sport · marcher · courir · nager · un vélo · une piscine |
| Invite a friend and respond (A2) | Invite someone, accept or decline politely and suggest another time. | inviter · ça te dit ? · avec plaisir · une autre fois · occupé · plutôt |
| Change a leisure plan (A2) | Use a weather condition to suggest an indoor plan and agree on details. | si · prévoir · une sortie · un musée · reporter · à l’intérieur |

## Invitations and shared plans

Suggested prior topics: People and introductions, Leisure and weather, Dates and availability. 30 expressions; 8 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/communication.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Invite someone for a meal (A1) | Invite a friend and ask what to bring. | inviter · ça te dit ? · venir chez moi · apporter · une invitation · un dîner |
| Accept and join a plan (A1) | Accept a suggestion and check whether there is room to join. | avec plaisir · ça me va · volontiers · être libre · une place · se joindre à |
| Decline kindly (A1) | Turn down an invitation politely and leave open another occasion. | désolé, je ne peux pas · ce n’est pas possible · occupé · une autre fois · je dois partir · merci quand même |
| Agree where and when to meet (A2) | Set a meeting place and time, and ask someone to let you know about changes. | se retrouver · fixer une heure · un lieu de rendez-vous · à quelle heure ? · ensemble · prévenir |
| Change a plan and confirm the details (A2) | Suggest another option, postpone if needed and confirm the final plan. | finalement · plutôt · reporter · annuler · confirmer · changer de programme |

## Health and appointments

Suggested prior topics: People and introductions, Dates and availability. 30 expressions; 5 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/daily-life.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Ask for a health appointment (A1) | Ask politely for an appointment and state when you are available. | un rendez-vous · un médecin · disponible · demain · le matin · prendre rendez-vous |
| Say how you feel (A1) | Name a few everyday symptoms when speaking to a health professional. | avoir mal · la tête · le ventre · le dos · la fièvre · fatigué |
| Speak at a pharmacy (A1) | Identify a pharmacy and ask someone to explain written instructions. | une pharmacie · une ordonnance · un médicament · une allergie · une notice · expliquer |
| Describe a symptom over time (A2) | Tell a professional when a symptom began and ask for clarification. | depuis · tousser · une douleur · commencer · souvent · répéter |
| Change an appointment (A2) | Explain a scheduling problem and request another appointment time. | annuler · déplacer · un empêchement · un créneau · confirmer · en retard |

## Cooking

Suggested prior topics: Groceries. 30 expressions; 0 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/food-travel.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Prepare a place to cook (A1) | Find basic tools and prepare a clean work surface. | une planche à découper · un bol · une cuillère · une balance · se laver les mains · nettoyer |
| Prepare vegetables (A1) | Identify three vegetables and say how to prepare them. | un oignon · de l’ail · une courgette · laver · éplucher · couper |
| Follow a simple recipe (A1) | Read an instruction to add seasoning and mix. | une recette · du sel · du poivre · ajouter · mélanger · un peu de |
| Control the cooking (A2) | Choose a pan or oven and follow a simple cooking instruction. | une casserole · une poêle · un four · faire cuire · faire bouillir · à feu doux |
| Serve and put food away (A2) | Serve a meal and discuss putting leftovers away. | servir · laisser refroidir · un couvercle · une boîte · mettre au réfrigérateur · les restes |

## Phone and digital communication

Suggested prior topics: Essential conversation tools, Numbers and quantities. 30 expressions; 0 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/communication.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Make and answer a call (A1) | Say you are calling someone and recognise basic phone actions. | un téléphone · un appel · appeler · décrocher · raccrocher · la messagerie vocale |
| Read out an email address (A1) | Dictate a short email address using its punctuation. | une adresse mail · un mail · une arobase · un point · un tiret · un tiret du bas |
| Send and reply to a message (A1) | Ask someone to send a message and say whether you received it. | un message · un SMS · envoyer · répondre · recevoir · transférer |
| Get connected and describe a problem (A2) | Ask for a Wi-Fi password and explain a simple connection problem. | une connexion · le Wi-Fi · un réseau · un mot de passe · se connecter · se déconnecter |
| Share and keep a file (A2) | Ask someone to send a file or link and say what to do with it. | télécharger · mettre en ligne · un lien · une pièce jointe · ouvrir · enregistrer |

## Accommodation

Suggested prior topics: Home and housing, Dates and availability, Phone and digital communication. 30 expressions; 1 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/food-travel.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Book a room (A1) | Request a room type and give the length of a short stay. | un hôtel · une nuit · une chambre double · une chambre simple · réserver une chambre · pour deux nuits |
| Check in (A1) | Give your booking name and respond to a simple check-in request. | la réception · à quel nom ? · un passeport · une pièce d’identité · remplir une fiche · signer |
| Settle into your room (A1) | Ask about breakfast, Wi-Fi and basic room supplies. | un petit déjeuner · une connexion Wi-Fi · un mot de passe · le linge de lit · une serviette de bain · c’est compris ? |
| Request help during a stay (A2) | Explain a room problem and agree a practical response. | du bruit · la climatisation · de l’eau chaude · il manque · changer de chambre · quelqu’un peut venir ? |
| Check out and leave bags (A2) | Ask about check-out time, luggage storage and a bill. | libérer la chambre · les bagages · laisser mes bagages · jusqu’à · une facture · un supplément |

## Education and learning

Suggested prior topics: Essential conversation tools, Dates and availability. 30 expressions; 2 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/study-work.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Ask to join a French course (A1) | Ask how to enrol and choose a beginner course format. | une inscription · s’inscrire · un niveau · débutant · en ligne · en présentiel |
| Follow a simple classroom instruction (A1) | Identify the page and follow short listening, copying and pair-work instructions. | écouter · une page · ouvrir · souligner · recopier · travailler à deux |
| Check the class schedule and report an absence (A2) | Check when a session takes place and tell the teacher you cannot attend. | une séance · un emploi du temps · une durée · une pause · absent · prévenir |
| Prepare homework with useful tools (A2) | Ask what to practise at home and use a dictionary to check a word. | les devoirs · réviser · s’entraîner · chercher un mot · une traduction · un dictionnaire |
| Explain a learning difficulty and set a goal (A2) | Describe one difficulty, ask to repeat a task and choose a small learning goal. | des progrès · faire une erreur · réussir · un objectif · avoir du mal à · à son rythme |

## Work and study

Suggested prior topics: People and introductions, Time and daily routine, Phone and digital communication, Education and learning. 30 expressions; 3 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/daily-life.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Find your way at work (A1) | Say where you work and identify a few people and places. | le travail · un bureau · un collègue · une équipe · la responsable · une salle |
| Join French training at work (A1) | Find a workplace French class, prepare materials and start a shared exercise. | un cours · une professeure · un cahier · un stylo · un exercice · apprendre |
| Ask for help with a task (A1) | Ask a colleague for help and identify a simple document task. | aider · un document · envoyer · imprimer · un ordinateur · comprendre |
| Organise a working day (A2) | Discuss a meeting, a deadline and a task that matters first. | une réunion · un horaire · un délai · une tâche · terminer · urgent |
| Clarify a work request (A2) | Check instructions, explain a difficulty and propose a small change. | une consigne · vérifier · un problème · proposer · une solution · ensemble |

## Services and paperwork

Suggested prior topics: People and introductions, Phone and digital communication. 30 expressions; 5 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/daily-life.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Ask at a service desk (A1) | Find the right service desk and ask for basic help. | l’accueil · une mairie · un guichet · un formulaire · une aide · attendre |
| Give contact details (A1) | Give contact details and spell out a name when asked. | une adresse · une rue · un code postal · épeler · un numéro · une adresse mail |
| Send a letter (A1) | Say where a letter is going and ask staff which stamp it needs. | un bureau de poste · une lettre · un timbre · poster · un colis · le destinataire |
| Ask how to submit an application (A2) | Ask where to submit a routine application, check its deadline and recognise a receipt acknowledgement. | une démarche · une attestation · déposer un dossier · fonctionner · une date limite · un accusé de réception |
| Check what a form asks for (A2) | Ask which document is requested and clarify an incomplete application. | un dossier · un justificatif · une signature · remplir · manquer · une copie |

## Finding a job

Suggested prior topics: Work and study, Education and learning. 30 expressions; 1 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/study-work.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Say what kind of work you want (A1) | Name your occupation and say whether you want full-time or part-time work. | un métier · un emploi · chercher un emploi · à temps plein · à temps partiel · travailler |
| Ask how to apply for a vacancy (A2) | Identify a vacancy and ask where to send a CV and covering letter. | une offre d’emploi · un poste · une candidature · postuler · un CV · une lettre de motivation |
| Describe a skill and relevant experience (A2) | Give a short example of experience and explain one useful skill. | une expérience · une compétence · un diplôme · une qualification · savoir utiliser · autonome |
| Introduce yourself in a short interview (A2) | Summarise your background, give an example and state when you can work. | un entretien · se présenter · un parcours · une disponibilité · motivé · un exemple |
| Ask about next steps after an interview (A2) | Ask about the next contact and request clarification before answering an offer. | un contrat · un salaire · embaucher · recontacter · accepter · refuser |

## Talking about recent experiences

Suggested prior topics: Time and daily routine, Invitations and shared plans. 30 expressions; 2 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/experiences.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Say when something happened (A2) | Locate a recent event in time before telling a short story. | le week-end dernier · la semaine dernière · avant-hier · récemment · ce jour-là · hier soir |
| Put a short story in order (A2) | Link two or three completed activities in a clear sequence. | d’abord · puis · ensuite · après · à la fin · pendant |
| Describe a day out (A2) | Name activities and give two concrete details about a day out. | visiter · découvrir · prendre des photos · goûter · passer la journée · profiter de |
| Say how an experience went (A2) | Give a simple reaction to a recent activity and say whether you would repeat it. | c’était · ça s’est bien passé · s’amuser · un souvenir · une expérience · avoir envie de recommencer |
| Explain a small incident (A2) | Tell someone what went wrong and how the situation ended. | perdre · retrouver · oublier · manquer · heureusement · malheureusement |

## Preferences and simple comparisons

Suggested prior topics: Clothes and shopping, Leisure and weather, Talking about recent experiences. 30 expressions; 0 canonical senses recycled from earlier banks. [Source](../packages/content/src/topics/experiences.ts).

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Say which option you prefer (A2) | Express a preference and choose an activity or option. | préférer · adorer · détester · avoir envie de · plaire · choisir |
| Give a simple opinion (A2) | Mark a statement as your opinion and respond to someone else’s view. | à mon avis · je pense que · je trouve que · pour moi · c’est vrai · je ne suis pas d’accord |
| Compare two everyday options (A2) | Say which option is more, less or equally suitable. | plus… que · moins… que · aussi… que · meilleur · mieux · le même / la même |
| Explain what matters in a choice (A2) | Describe useful qualities when choosing a place or service. | pratique · confortable · bruyant · calme · cher · économique |
| Give a reason and weigh two options (A2) | Give a short reason, show a drawback and explain an undecided choice. | parce que · donc · mais · pourtant · ça dépend · hésiter |

## Getting around by bike

Suggested prior topics are directions and transport. This bank has 30 expressions and reuses the canonical entry for *un vélo*. [Source](../packages/content/src/topics/cycling.ts)

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Rent a bike for the day (A1) | Ask for a rental bike and check when to bring it back. | un vélo · une location · louer un vélo · pour la journée · un casque · rendre le vélo |
| Find a route for cycling (A1) | Ask about a bike lane and understand a route suggestion. | une piste cyclable · le long de · un canal · une montée · un trajet plat · rouler à vélo |
| Find a place to lock your bike (A1) | Ask where to park and describe how you will lock the bike. | un antivol · un arceau à vélos · le cadre · une roue · attacher son vélo · la clé de l’antivol |
| Explain a flat tyre (A2) | Describe a flat tyre and ask a repair shop what can be fixed. | un pneu · un pneu crevé · une chambre à air · une pompe à vélo · regonfler · réparer une crevaison |
| Arrange a bike service (A2) | Describe a fault and agree when to collect the bike. | un frein · une chaîne · une révision · faire du bruit · déposer le vélo · récupérer le vélo |

## Sorting and disposing of household waste

Suggested prior topics are housing and calendar. This bank has 30 expressions and reuses the canonical entry for *un couvercle*. Schedules and service instructions in the dialogues are fictional examples. [Source](../packages/content/src/topics/household-waste.ts)

| Lesson and estimated level | Can-do outcome | Targets |
| --- | --- | --- |
| Ask where to put packaging (A1) | Ask which bin a piece of packaging goes in and check a sorting sign. | un emballage · un bac de tri · une consigne de tri · une boîte en carton · un emballage vide · trier ses déchets |
| Find the glass collection point (A1) | Ask where to take a glass jar or bottle. | un bocal · une bouteille en verre · un couvercle · un conteneur à verre · un point de collecte · sans couvercle |
| Check the bin collection day (A1) | Ask when the rubbish is collected and when to put the bin out. | une poubelle · un jour de collecte · un sac-poubelle · sortir la poubelle · la veille au soir · tous les mardis |
| Ask how to use a shared compost bin (A2) | Ask whether the shared compost bin takes a particular food scrap. | des déchets alimentaires · un composteur · des épluchures · du marc de café · être accepté · sur place |
| Arrange disposal of a bulky item (A2) | Ask about collecting a bulky item and confirm the time and place. | les encombrants · une déchèterie · un enlèvement · un matelas · au bord du trottoir · sur rendez-vous |

## Sense distinctions and review

Identical written forms can have different senses: une place (square/available spot), jusqu’à (distance/time), manquer (be missing/miss a service), après (preposition/adverb), une expérience (work experience/an event), ouvrir (physical/digital opening), ça me va (clothing fit/a suitable plan), un guichet (ticket/service counter), un horaire (transport/work schedule). These keep explicit separate IDs. Other same-sense reuse shares a canonical ID.

Five reviewed lessons are now revision 4; fifty-five earlier lessons remain revision 3 and sixty earlier additions and three new greeting lessons remain revision 1. The historical [redundancy audit](CURRICULUM_REDUNDANCY_AUDIT.md) replaces 16 repeated slots with new useful senses while preserving the older canonical entries elsewhere. See [research and limits](CURRICULUM_RESEARCH.md) and the three linked audits. Owner review should judge usefulness, naturalness, translations, difficulty, register and answer alternatives before explicit publication. No external word-frequency ranking or human classroom validation is claimed.
