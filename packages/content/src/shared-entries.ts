import type { Vocabulary } from '@smartlingo/domain';

// These exact canonical senses remain taught elsewhere. Their first introduction
// slots were replaced in the 2026-11-15 redundancy review; IDs/payloads stay stable.
export const sharedEntries: readonly Vocabulary[] = [
  {
    "id": "fr.administration.connexion",
    "target": "une connexion",
    "meaning": "a connection",
    "example": "La connexion est lente.",
    "exampleMeaning": "The connection is slow.",
    "gender": "feminine",
    "note": "Here an internet connection.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.administration.mot-de-passe",
    "target": "un mot de passe",
    "meaning": "a password",
    "example": "Je ne connais pas le mot de passe.",
    "exampleMeaning": "I do not know the password.",
    "gender": "masculine",
    "note": "Only fictional practice details are needed.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.administration.reseau",
    "target": "un réseau",
    "meaning": "a network",
    "example": "Quel est le nom du réseau ?",
    "exampleMeaning": "What is the network called?",
    "gender": "masculine",
    "note": "Plural réseaux.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.administration.se-connecter",
    "target": "se connecter",
    "meaning": "to connect / log in",
    "example": "Je n’arrive pas à me connecter.",
    "exampleMeaning": "I cannot manage to log in.",
    "note": "Reflexive verb; je me connecte, vous vous connectez.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.administration.piece-jointe",
    "target": "une pièce jointe",
    "meaning": "an attachment",
    "example": "Le formulaire est en pièce jointe.",
    "exampleMeaning": "The form is attached.",
    "gender": "feminine",
    "note": "A file attached to an email.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.routine.zero",
    "target": "zéro",
    "meaning": "zero",
    "example": "Il reste zéro place.",
    "exampleMeaning": "There are no places left.",
    "note": "Number; useful when reading a counter or a balance.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.routine.deux",
    "target": "deux",
    "meaning": "two",
    "example": "Nous sommes deux.",
    "exampleMeaning": "There are two of us.",
    "note": "Number; unchanged before masculine or feminine nouns.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.routine.trois",
    "target": "trois",
    "meaning": "three",
    "example": "J’ai trois rendez-vous cette semaine.",
    "exampleMeaning": "I have three appointments this week.",
    "note": "Number; the final s is usually silent.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.routine.quatre",
    "target": "quatre",
    "meaning": "four",
    "example": "Il y a quatre chaises.",
    "exampleMeaning": "There are four chairs.",
    "note": "Number; no plural s on the number itself.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.routine.cinq",
    "target": "cinq",
    "meaning": "five",
    "example": "J’arrive dans cinq minutes.",
    "exampleMeaning": "I will arrive in five minutes.",
    "note": "Number; final consonant pronunciation varies with the following word.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.routine.dix",
    "target": "dix",
    "meaning": "ten",
    "example": "Le trajet dure dix minutes.",
    "exampleMeaning": "The journey takes ten minutes.",
    "note": "Number; dix minutes has a silent final x.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.routine.aujourdhui",
    "target": "aujourd’hui",
    "meaning": "today",
    "example": "Aujourd’hui, nous sommes lundi.",
    "exampleMeaning": "Today is Monday.",
    "note": "Time word with an apostrophe; no article.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.routine.semaine",
    "target": "une semaine",
    "meaning": "a week",
    "example": "Je suis libre cette semaine.",
    "exampleMeaning": "I am free this week.",
    "gender": "feminine",
    "note": "Cette semaine means this week.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.routine.lundi",
    "target": "lundi",
    "meaning": "Monday",
    "example": "Le cours commence lundi.",
    "exampleMeaning": "The class starts on Monday.",
    "gender": "masculine",
    "note": "Day names have no capital letter in ordinary French. Le lundi means on Mondays.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.routine.samedi",
    "target": "samedi",
    "meaning": "Saturday",
    "example": "Je travaille le samedi.",
    "exampleMeaning": "I work on Saturdays.",
    "gender": "masculine",
    "note": "No article for a particular coming Saturday; le samedi for a regular habit.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  },
  {
    "id": "fr.routine.date",
    "target": "une date",
    "meaning": "a date / calendar date",
    "example": "Quelle est la date du cours ?",
    "exampleMeaning": "What is the date of the class?",
    "gender": "feminine",
    "note": "A calendar date, not usually a romantic date.",
    "picture": "context",
    "pictureAlt": "An open vocabulary notebook"
  }
];
