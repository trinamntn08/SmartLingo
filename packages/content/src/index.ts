import { lessonSchema, type Lesson } from '@smartlingo/domain';

// Original preview curriculum. Publication requires owner review.
const drafts = [
  {
    "id": "fr.restaurant.customer",
    "revision": 1,
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
        "example": "Bonjour, madame.",
        "exampleMeaning": "Hello, madam.",
        "note": "A polite greeting when you arrive.",
        "picture": "greeting",
        "pictureAlt": "A person waving hello"
      },
      {
        "id": "fr.cafe",
        "target": "un café",
        "meaning": "a coffee (usually an espresso)",
        "example": "Je voudrais un café.",
        "exampleMeaning": "I would like a coffee.",
        "note": "Masculine noun. Un is the indefinite article.",
        "picture": "cup",
        "pictureAlt": "A small cup of coffee on a saucer"
      },
      {
        "id": "fr.eau",
        "target": "de l’eau",
        "meaning": "some water",
        "example": "De l’eau, s’il vous plaît.",
        "exampleMeaning": "Some water, please.",
        "note": "Eau is feminine; de l’ introduces an unspecified amount.",
        "picture": "water",
        "pictureAlt": "A glass and a jug of water"
      },
      {
        "id": "fr.carte",
        "target": "la carte",
        "meaning": "the menu",
        "example": "La carte, s’il vous plaît.",
        "exampleMeaning": "The menu, please.",
        "note": "Feminine noun. At a restaurant, la carte is the menu.",
        "picture": "menu",
        "pictureAlt": "An open restaurant menu with food symbols"
      },
      {
        "id": "fr.addition",
        "target": "l’addition",
        "meaning": "the bill",
        "example": "L’addition, s’il vous plaît.",
        "exampleMeaning": "The bill, please.",
        "note": "Feminine noun. The article la becomes l’ before a vowel.",
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
    "revision": 1,
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
        "example": "Bonjour, madame.",
        "exampleMeaning": "Hello, madam.",
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
        "note": "Feminine noun. Une is the indefinite article.",
        "picture": "bread",
        "pictureAlt": "A long baguette with diagonal cuts"
      },
      {
        "id": "fr.croissant",
        "target": "un croissant",
        "meaning": "a croissant",
        "example": "Je voudrais un croissant.",
        "exampleMeaning": "I would like a croissant.",
        "note": "Masculine noun.",
        "picture": "croissant",
        "pictureAlt": "A crescent-shaped croissant"
      },
      {
        "id": "fr.sac",
        "target": "un sac",
        "meaning": "a bag",
        "example": "Un sac, s’il vous plaît.",
        "exampleMeaning": "A bag, please.",
        "note": "Masculine noun.",
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

export const lessons: Lesson[] = drafts.map(draft => lessonSchema.parse(draft));
export const restaurantLesson = lessons[0];
