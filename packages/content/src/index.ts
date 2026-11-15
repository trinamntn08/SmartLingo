import { lessonSchema, type Lesson } from '@smartlingo/domain';
import { buildTopic } from './build-topic';
import { foodHomeTopics } from './topics/food-home';
import { dailyLifeTopics } from './topics/daily-life';
import { reuseSharedVocabulary } from './shared-vocabulary';

export { getWordVisual, wordVisuals, type WordVisual } from './visuals';
export { previousSeedFingerprints } from './seed-baselines';

// Original preview curriculum. Publication requires owner review.
const drafts = [
  {
    "id": "fr.restaurant.customer",
    "revision": 2,
    "status": "draft",
    "language": "fr-FR",
    "explanationLanguage": "en",
    "title": "A table for everyday French",
    "subtitle": "At the restaurant",
    "outcome": "Order a coffee politely and ask for the bill.",
    "level": "A1",
    "topic": "Restaurant",
    "role": "Customer",
    "durationMinutes": 8,
    "vocabulary": [
      {
        "id": "fr.bonjour",
        "target": "bonjour",
        "meaning": "hello / good morning",
        "example": "Bonjour madame, est-ce que je peux vous poser une question ?",
        "exampleMeaning": "Hello, madam, could I ask you a question?",
        "note": "A polite greeting when you arrive.",
        "picture": "greeting",
        "pictureAlt": "A person waving hello"
      },
      {
        "id": "fr.cafe",
        "target": "un café",
        "meaning": "a coffee (usually an espresso)",
        "example": "Je voudrais un café et un verre d’eau, s’il vous plaît.",
        "exampleMeaning": "I would like a coffee and a glass of water, please.",
        "gender": "masculine",
        "note": "In France, un café usually means an espresso.",
        "picture": "cup",
        "pictureAlt": "A small cup of coffee on a saucer"
      },
      {
        "id": "fr.eau",
        "target": "de l’eau",
        "meaning": "some water",
        "example": "Est-ce qu’on peut avoir de l’eau pour toute la table ?",
        "exampleMeaning": "Could we have some water for the whole table?",
        "gender": "feminine",
        "note": "De l’ introduces an unspecified amount before a vowel.",
        "picture": "water",
        "pictureAlt": "A glass and a jug of water"
      },
      {
        "id": "fr.carte",
        "target": "la carte",
        "meaning": "the menu",
        "example": "Vous pouvez nous apporter la carte pendant qu’on attend nos amis ?",
        "exampleMeaning": "Could you bring us the menu while we wait for our friends?",
        "gender": "feminine",
        "note": "At a restaurant, la carte lists the individual dishes.",
        "picture": "menu",
        "pictureAlt": "An open restaurant menu with food symbols"
      },
      {
        "id": "fr.addition",
        "target": "l’addition",
        "meaning": "the bill",
        "example": "On peut avoir l’addition, s’il vous plaît ? On doit prendre le train.",
        "exampleMeaning": "Could we have the bill, please? We need to catch the train.",
        "gender": "feminine",
        "note": "La becomes l’ before a vowel.",
        "picture": "bill",
        "pictureAlt": "An itemised restaurant bill"
      },
      {
        "id": "fr.silvousplait",
        "target": "s’il vous plaît",
        "meaning": "please",
        "example": "Vous pouvez parler un peu plus lentement, s’il vous plaît ?",
        "exampleMeaning": "Could you speak a little more slowly, please?",
        "note": "Use vous with staff you do not know.",
        "picture": "please",
        "pictureAlt": "Two hands together in a polite request"
      }
    ],
    "dialogue": [
      {
        "role": "Server",
        "target": "Bonjour ! Vous désirez ?",
        "meaning": "Hello! What would you like?"
      },
      {
        "role": "Customer",
        "target": "Je voudrais un café, s’il vous plaît.",
        "meaning": "I would like a coffee, please."
      },
      {
        "role": "Server",
        "target": "Bien sûr.",
        "meaning": "Of course."
      },
      {
        "role": "Customer",
        "target": "Merci !",
        "meaning": "Thank you!"
      }
    ],
    "grammar": {
      "title": "A polite way to ask",
      "explanation": "Je voudrais means “I would like”. Use it before what you want: Je voudrais un café. Add s’il vous plaît to make a polite request. You can also say: Un café, s’il vous plaît."
    },
    "pictureActivity": {
      "prompt": "Which phrase names the drink in the picture?",
      "entryId": "fr.cafe",
      "choices": [
        "fr.eau",
        "fr.cafe",
        "fr.addition"
      ]
    },
    "sentenceActivity": {
      "id": "fr.restaurant.order-coffee",
      "prompt": "Build: “I would like a coffee, please.”",
      "tokens": [
        "s’il vous plaît",
        "un café",
        "voudrais",
        "Je"
      ],
      "answers": [
        "Je voudrais un café s’il vous plaît",
        "S’il vous plaît je voudrais un café"
      ],
      "almostAnswers": [
        "Je voudrais un cafe s’il vous plait"
      ],
      "hint": "Start with Je voudrais, then add the drink and the polite phrase.",
      "explanation": "Put Je before voudrais, then say what you would like. Add s’il vous plaît at the end or beginning."
    },
    "provenance": {
      "author": "Original SmartLingo AI-assisted draft, 2026-11-14",
      "rights": "Original text and code-drawn illustrations; no third-party course or image assets.",
      "review": "Owner review required: French, meanings, pictures, level and accepted answers. No audio reviewed."
    }
  },
  {
    "id": "fr.bakery.customer",
    "revision": 2,
    "status": "draft",
    "language": "fr-FR",
    "explanationLanguage": "en",
    "title": "Your morning at the bakery",
    "subtitle": "At the bakery",
    "outcome": "Ask for a baguette politely and thank the baker.",
    "level": "A1",
    "topic": "Bakery",
    "role": "Customer",
    "durationMinutes": 7,
    "vocabulary": [
      {
        "id": "fr.bonjour",
        "target": "bonjour",
        "meaning": "hello / good morning",
        "example": "Bonjour madame, est-ce que je peux vous poser une question ?",
        "exampleMeaning": "Hello, madam, could I ask you a question?",
        "note": "A polite greeting when you arrive.",
        "picture": "greeting",
        "pictureAlt": "A person waving hello"
      },
      {
        "id": "fr.baguette",
        "target": "une baguette",
        "meaning": "a baguette",
        "example": "Je prends une baguette bien cuite pour le dîner de ce soir.",
        "exampleMeaning": "I’ll have a well-baked baguette for dinner this evening.",
        "gender": "feminine",
        "note": "Bien cuite asks for a darker, well-baked crust.",
        "picture": "bread",
        "pictureAlt": "A long baguette with diagonal cuts"
      },
      {
        "id": "fr.croissant",
        "target": "un croissant",
        "meaning": "a croissant",
        "example": "Je voudrais un croissant pour moi et deux pains au chocolat pour les enfants.",
        "exampleMeaning": "I would like a croissant for myself and two pains au chocolat for the children.",
        "gender": "masculine",
        "note": "",
        "picture": "croissant",
        "pictureAlt": "A crescent-shaped croissant"
      },
      {
        "id": "fr.sac",
        "target": "un sac",
        "meaning": "a bag",
        "example": "Vous avez un sac pour mettre le pain et les croissants ?",
        "exampleMeaning": "Do you have a bag for the bread and croissants?",
        "gender": "masculine",
        "note": "",
        "picture": "bag",
        "pictureAlt": "A paper shopping bag with handles"
      },
      {
        "id": "fr.silvousplait",
        "target": "s’il vous plaît",
        "meaning": "please",
        "example": "Vous pouvez parler un peu plus lentement, s’il vous plaît ?",
        "exampleMeaning": "Could you speak a little more slowly, please?",
        "note": "Use vous with staff you do not know.",
        "picture": "please",
        "pictureAlt": "Two hands together in a polite request"
      },
      {
        "id": "fr.merci",
        "target": "merci",
        "meaning": "thank you",
        "example": "Merci pour votre aide, je vais chercher l’arrêt de bus maintenant.",
        "exampleMeaning": "Thank you for your help; I’m going to look for the bus stop now.",
        "note": "A natural way to thank someone.",
        "picture": "thanks",
        "pictureAlt": "A small thank-you card with a heart"
      }
    ],
    "dialogue": [
      {
        "role": "Baker",
        "target": "Bonjour !",
        "meaning": "Hello!"
      },
      {
        "role": "Customer",
        "target": "Une baguette, s’il vous plaît.",
        "meaning": "A baguette, please."
      },
      {
        "role": "Baker",
        "target": "Voilà !",
        "meaning": "Here you are!"
      },
      {
        "role": "Customer",
        "target": "Merci, bonne journée !",
        "meaning": "Thank you, have a good day!"
      }
    ],
    "grammar": {
      "title": "Un or une?",
      "explanation": "French nouns have grammatical gender. Learn the article with the noun: une baguette is feminine; un croissant is masculine. For a polite short request, add s’il vous plaît."
    },
    "pictureActivity": {
      "prompt": "Which phrase names the bread in the picture?",
      "entryId": "fr.baguette",
      "choices": [
        "fr.sac",
        "fr.croissant",
        "fr.baguette"
      ]
    },
    "sentenceActivity": {
      "id": "fr.bakery.order-baguette",
      "prompt": "Build: “A baguette, please.”",
      "tokens": [
        "s’il vous plaît",
        "baguette",
        "Une"
      ],
      "answers": [
        "Une baguette s’il vous plaît",
        "S’il vous plaît une baguette"
      ],
      "almostAnswers": [
        "Une baguette s’il vous plait"
      ],
      "hint": "Start with Une, add the bread, then the polite phrase.",
      "explanation": "Use une with baguette. Add s’il vous plaît for a polite request."
    },
    "provenance": {
      "author": "Original SmartLingo AI-assisted draft, 2026-11-14",
      "rights": "Original text and code-drawn illustrations; no third-party course or image assets.",
      "review": "Owner review required: French, meanings, pictures, level and accepted answers. No audio reviewed."
    }
  }
];

export const lessons: Lesson[] = reuseSharedVocabulary([
  ...drafts.map(draft => lessonSchema.parse(draft)),
  ...foodHomeTopics.flatMap(buildTopic),
  ...dailyLifeTopics.flatMap(buildTopic),
]);
export const restaurantLesson = lessons[0];
