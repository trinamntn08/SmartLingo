import { lessonSchema, type Lesson } from '@smartlingo/domain';
import { buildTopic } from './build-topic';
import { foodHomeTopics } from './topics/food-home';
import { dailyLifeTopics } from './topics/daily-life';
import { reuseSharedVocabulary } from './shared-vocabulary';
import { foundationTopics } from './topics/foundations';
import { communicationTopics } from './topics/communication';
import { foodTravelTopics } from './topics/food-travel';
import { studyWorkTopics } from './topics/study-work';
import { experienceTopics } from './topics/experiences';

export { getWordVisual, wordVisuals, type WordVisual } from './visuals';
export { getVocabularyPhoto } from './photos';
export { previousSeedFingerprints } from './seed-baselines';
export { courseSequence } from './course-sequence';

// Original preview curriculum. Publication requires owner review.
const drafts = [
  {
    "id": "fr.restaurant.customer",
    "revision": 3,
    "status": "draft",
    "language": "fr-FR",
    "explanationLanguage": "en",
    "title": "Order a coffee and ask for the bill",
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
        "example": "Bonjour madame, je voudrais un café.",
        "exampleMeaning": "Hello, madam, I would like a coffee.",
        "note": "A polite greeting when you arrive.",
        "picture": "greeting",
        "pictureAlt": "A person waving hello"
      },
      {
        "id": "fr.cafe",
        "target": "un café",
        "meaning": "a coffee (usually an espresso)",
        "example": "Je voudrais un café, s’il vous plaît.",
        "exampleMeaning": "I would like a coffee, please.",
        "gender": "masculine",
        "note": "In France, un café usually means an espresso.",
        "picture": "cup",
        "pictureAlt": "A small cup of coffee on a saucer"
      },
      {
        "id": "fr.eau",
        "target": "de l’eau",
        "meaning": "some water",
        "example": "De l’eau, s’il vous plaît.",
        "exampleMeaning": "Some water, please.",
        "gender": "feminine",
        "note": "De l’ introduces an unspecified amount before a vowel.",
        "picture": "water",
        "pictureAlt": "A glass and a jug of water"
      },
      {
        "id": "fr.carte",
        "target": "la carte",
        "meaning": "the menu",
        "example": "La carte, s’il vous plaît.",
        "exampleMeaning": "The menu, please.",
        "gender": "feminine",
        "note": "At a restaurant, la carte lists the individual dishes.",
        "picture": "menu",
        "pictureAlt": "An open restaurant menu with food symbols"
      },
      {
        "id": "fr.addition",
        "target": "l’addition",
        "meaning": "the bill",
        "example": "L’addition, s’il vous plaît.",
        "exampleMeaning": "The bill, please.",
        "gender": "feminine",
        "note": "La becomes l’ before a vowel.",
        "picture": "bill",
        "pictureAlt": "An itemised restaurant bill"
      },
      {
        "id": "fr.silvousplait",
        "target": "s’il vous plaît",
        "meaning": "please",
        "example": "Un café, s’il vous plaît.",
        "exampleMeaning": "A coffee, please.",
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
        "target": "Je voudrais un café et de l’eau, s’il vous plaît.",
        "meaning": "I would like a coffee and some water, please."
      },
      {
        "role": "Server",
        "target": "Voilà votre café.",
        "meaning": "Here is your coffee."
      },
      {
        "role": "Customer",
        "target": "Merci. L’addition, s’il vous plaît.",
        "meaning": "Thank you. The bill, please."
      },
      {
        "role": "Server",
        "target": "Oui, tout de suite.",
        "meaning": "Yes, right away."
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
      "hint": "Start with Je voudrais, then add the drink and the polite phrase.",
      "explanation": "Put Je before voudrais, then say what you would like. Add s’il vous plaît at the end or beginning.",
      "almostAnswers": [
        "Je voudrais un cafe s’il vous plait"
      ]
    },
    "provenance": {
      "author": "Original SmartLingo AI-assisted curriculum rework, 2026-11-15",
      "rights": "Original text and code-drawn illustrations; no third-party course or image assets.",
      "review": "Owner review required: French, meanings, pictures, level and accepted answers. No audio reviewed."
    }
  },
  {
    "id": "fr.bakery.customer",
    "revision": 3,
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
        "example": "Bonjour madame, je voudrais un café.",
        "exampleMeaning": "Hello, madam, I would like a coffee.",
        "note": "A polite greeting when you arrive.",
        "picture": "greeting",
        "pictureAlt": "A person waving hello"
      },
      {
        "id": "fr.baguette",
        "target": "une baguette",
        "meaning": "a baguette",
        "example": "Une baguette, s’il vous plaît.",
        "exampleMeaning": "A baguette, please.",
        "gender": "feminine",
        "note": "Bien cuite asks for a darker, well-baked crust.",
        "picture": "bread",
        "pictureAlt": "A long baguette with diagonal cuts"
      },
      {
        "id": "fr.croissant",
        "target": "un croissant",
        "meaning": "a croissant",
        "example": "Je prends deux croissants.",
        "exampleMeaning": "I’ll have two croissants.",
        "gender": "masculine",
        "note": "",
        "picture": "croissant",
        "pictureAlt": "A crescent-shaped croissant"
      },
      {
        "id": "fr.sac",
        "target": "un sac",
        "meaning": "a bag",
        "example": "Vous avez un sac pour le pain ?",
        "exampleMeaning": "Do you have a bag for the bread?",
        "gender": "masculine",
        "note": "",
        "picture": "bag",
        "pictureAlt": "A paper shopping bag with handles"
      },
      {
        "id": "fr.silvousplait",
        "target": "s’il vous plaît",
        "meaning": "please",
        "example": "Un café, s’il vous plaît.",
        "exampleMeaning": "A coffee, please.",
        "note": "Use vous with staff you do not know.",
        "picture": "please",
        "pictureAlt": "Two hands together in a polite request"
      },
      {
        "id": "fr.merci",
        "target": "merci",
        "meaning": "thank you",
        "example": "Merci, bonne journée !",
        "exampleMeaning": "Thank you, have a good day!",
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
      "hint": "Start with Une, add the bread, then the polite phrase.",
      "explanation": "Use une with baguette. Add s’il vous plaît for a polite request.",
      "almostAnswers": [
        "Une baguette s’il vous plait"
      ]
    },
    "provenance": {
      "author": "Original SmartLingo AI-assisted curriculum rework, 2026-11-15",
      "rights": "Original text and code-drawn illustrations; no third-party course or image assets.",
      "review": "Owner review required: French, meanings, pictures, level and accepted answers. No audio reviewed."
    }
  }
];

export const lessons: Lesson[] = reuseSharedVocabulary([
  ...drafts.map(draft => lessonSchema.parse(draft)),
  ...foodHomeTopics.flatMap(topic => buildTopic({ ...topic, revision: 3 })),
  ...dailyLifeTopics.flatMap(topic => buildTopic({ ...topic, revision: 3 })),
  ...foundationTopics.flatMap(buildTopic),
  ...foodTravelTopics.flatMap(buildTopic),
  ...studyWorkTopics.flatMap(buildTopic),
  ...communicationTopics.flatMap(buildTopic),
  ...experienceTopics.flatMap(buildTopic),
]);
export const restaurantLesson = lessons.find(lesson => lesson.id === 'fr.restaurant.customer')!;
