import type { TopicDraft, WordDraft } from '../build-topic';
import type { FrenchTransferTask } from '../french-practice/types';

// Original AI-assisted text, 2026-11-24. D006–D009 are draft roadmap references.
// No external text, recordings or images reused. Owner/qualified French review required.
// Sources inspected 2026-11-24 (scope inspiration, not copied language or reuse licences):
// CEFR A1: familiar concrete needs and exchanges with a slow/helpful interlocutor:
// https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale
// TV5MONDE A1: first-name/family-name order depends on the introduction context:
// https://apprendre.tv5monde.com/fr/aides/cultures-donner-son-nom-et-son-prenom-dans-le-bon-ordre
// Hachette Cosmopolite 1 scope: spelling names, naming/locating city places and location prepositions:
// https://hachettefle.pl/wp-content/uploads/2022/07/Cosmopolite_1_spis_tresci.pdf
// The four task levels and exact lexical selections are SmartLingo editorial estimates.
const room: WordDraft = ['room', 'une salle', 'a room', 'La salle deux est à gauche.', 'Room two is on the left.', 'A shared activity room; a bedroom is une chambre.', { gender: 'feminine' }];
const straight: WordDraft = ['straight', 'tout droit', 'straight on', 'Allez tout droit.', 'Go straight on.', 'Droit has no final e here. À droite means to the right.'];
const left: WordDraft = ['left', 'à gauche', 'on the left / to the left', 'La salle est à gauche.', 'The room is on the left.', 'Use à gauche for a location or a direction.'];
const right: WordDraft = ['right', 'à droite', 'on the right / to the right', 'La salle est à droite.', 'The room is on the right.', 'Keep the final e in droite; distinguish tout droit, straight on.'];
const repeat: WordDraft = ['repeat', 'vous pouvez répéter ?', 'can you repeat that?', 'Vous pouvez répéter le numéro ?', 'Can you repeat the number?', 'Polite spoken question for a stranger or staff member.'];
const library: WordDraft = ['library', 'une bibliothèque', 'a library', 'La bibliothèque est près du pont.', 'The library is near the bridge.', 'A place to borrow books; a bookshop is une librairie.', { gender: 'feminine' }];
const post: WordDraft = ['post-office', 'un bureau de poste', 'a post office', 'Le bureau de poste est à droite.', 'The post office is on the right.', 'La poste is also common in everyday directions.', { gender: 'masculine' }];
const pharmacy: WordDraft = ['pharmacy', 'une pharmacie', 'a pharmacy', 'La pharmacie est en face de la bibliothèque.', 'The pharmacy is opposite the library.', 'A place name here; this lesson gives no medical advice.', { gender: 'feminine' }];

/** Resolve these same-sense entries to complete existing canonical payloads. */
export const a1CourseAliases: Readonly<Record<string, string>> = {
  'fr.workshop-check-in.room': 'fr.work.salle',
  'fr.workshop-check-in.straight': 'fr.directions.straight-on',
  'fr.workshop-check-in.excuse-me': 'fr.essentials.excuse-me',
  'fr.workshop-check-in.repeat': 'fr.essentials.repeat-please',
  'fr.workshop-check-in.hello': 'fr.bonjour',
  'fr.workshop-check-in.name': 'fr.people.s-appeler',
  'fr.workshop-check-in.spell': 'fr.administration.epeler',
  'fr.workshop-check-in.slowly': 'fr.essentials.more-slowly',
  'fr.workshop-check-in.confirm': 'fr.essentials.is-that-right',
  'fr.workshop-check-in.thanks': 'fr.merci',
  'fr.neighbourhood-wayfinding.look-for': 'fr.groceries.look-for',
  'fr.neighbourhood-wayfinding.library': 'fr.directions.library',
  'fr.neighbourhood-wayfinding.post-office': 'fr.administration.poste',
  'fr.neighbourhood-wayfinding.pharmacy': 'fr.health.pharmacie',
  'fr.neighbourhood-wayfinding.straight': 'fr.directions.straight-on',
  'fr.neighbourhood-wayfinding.left': 'fr.workshop-check-in.left',
  'fr.neighbourhood-wayfinding.right': 'fr.workshop-check-in.right',
  'fr.neighbourhood-wayfinding.next-to': 'fr.directions.next-to',
  'fr.neighbourhood-wayfinding.opposite': 'fr.directions.opposite',
  'fr.neighbourhood-wayfinding.near': 'fr.directions.near',
  'fr.neighbourhood-wayfinding.bridge': 'fr.directions.bridge',
  'fr.neighbourhood-wayfinding.square': 'fr.directions.square',
};

export const a1CourseTopics: readonly TopicDraft[] = [
  {
    slug: 'workshop-check-in', title: 'Workshop check-in', role: 'Workshop participant',
    provenance: {
      author: 'Original SmartLingo AI-assisted A1 drafts, 2026-11-24',
      rights: 'Original text and fictional workshop details; no third-party text or media copied. Text fallback uses existing notebook context.',
      review: 'Draft for owner review of French, translation, estimated A1 demands and practice. No native-speaker or audio review claimed.',
    },
    lessons: [
      {
        slug: 'ask-where-to-go', title: 'Ask where to go', level: 'A1',
        outcome: 'Ask where the workshop room is, request a repetition and identify the room from a short direction.',
        words: [
          room, straight, left, right,
          ['where-room', 'où est la salle ?', 'where is the room?', 'Excusez-moi, où est la salle deux ?', 'Excuse me, where is room two?', 'Use où with an accent for where. La identifies the room you are asking about.'],
          ['excuse-me', 'excusez-moi', 'excuse me', 'Excusez-moi, où est la salle ?', 'Excuse me, where is the room?', 'Use vous with staff or an adult stranger.'],
          repeat,
          ['here', 'ici', 'here', 'La salle est ici.', 'The room is here.', 'Points to the place where the speaker is or to a place on a plan.'],
        ],
        dialogue: [
          { role: 'Workshop participant', target: 'Excusez-moi, où est la salle deux ?', meaning: 'Excuse me, where is room two?' },
          { role: 'Receptionist', target: 'Tout droit, à gauche.', meaning: 'Straight on, on the left.' },
          { role: 'Workshop participant', target: 'Vous pouvez répéter ?', meaning: 'Can you repeat that?' },
          { role: 'Receptionist', target: 'La salle deux est à gauche.', meaning: 'Room two is on the left.' },
          { role: 'Workshop participant', target: 'À gauche, merci !', meaning: 'On the left, thank you!' },
        ],
        grammar: { title: 'Ask where; check the direction', explanation: 'Où est la salle ? asks where the room is. Keep the accent in où: ou means or. A short reply such as Tout droit, à gauche is natural. La salle deux means room 2; the number follows salle. À gauche and à droite give a side or direction; tout droit means straight on. Listen for deux (2) and gauche (left) in La salle deux est à gauche. You can use the full transcript when listening is unavailable.' },
        sentence: { tokens: ['salle', 'Où', '?', 'est', 'la'], answer: 'Où est la salle ?', meaning: 'Where is the room?', hint: 'Start Où est.', explanation: 'Keep la before the feminine noun salle.' },
      },
      {
        slug: 'complete-workshop-check-in', title: 'Check in for a workshop', level: 'A1',
        outcome: 'Give and spell a fictional name, ask for a repeated detail, and confirm the workshop time and room.',
        words: [
          ['hello', 'bonjour', 'hello', 'Bonjour, je m’appelle Lila.', 'Hello, my name is Lila.', 'Neutral daytime greeting at reception.'],
          ['name', 's’appeler', 'to be called / have as a name', 'Je m’appelle Lila.', 'My name is Lila.', 'Use je m’appelle when giving your name.'],
          ['spell', 'épeler', 'to spell out', 'Vous pouvez épeler votre prénom ?', 'Can you spell your first name?', 'Say the letters one by one.'],
          repeat,
          ['slowly', 'plus lentement', 'more slowly', 'Vous pouvez répéter plus lentement ?', 'Can you repeat that more slowly?', 'Add to a request for a slower pace.'],
          room,
          ['nine', 'à neuf heures', 'at nine o’clock', 'L’atelier commence à neuf heures.', 'The workshop starts at nine o’clock.', 'The fictional session starts at 09:00. Use à for the scheduled time.'],
          ['confirm', 'c’est bien ça ?', 'is that right?', 'À neuf heures, c’est bien ça ?', 'At nine o’clock, is that right?', 'Read back a detail and ask for confirmation.'],
          ['thanks', 'merci', 'thank you', 'Merci, bonne journée !', 'Thank you, have a good day!', 'A short neutral thank-you.'],
        ],
        dialogue: [
          { role: 'Workshop participant', target: 'Bonjour, je m’appelle Lila.', meaning: 'Hello, my name is Lila.' },
          { role: 'Receptionist', target: 'Bonjour. Vous pouvez épeler votre prénom ?', meaning: 'Hello. Can you spell your first name?' },
          { role: 'Workshop participant', target: 'L, I, L, A.', meaning: 'L, I, L, A.' },
          { role: 'Receptionist', target: 'Merci. L’atelier commence à neuf heures, salle quatre.', meaning: 'Thank you. The workshop starts at nine o’clock, in room four.' },
          { role: 'Workshop participant', target: 'Vous pouvez répéter plus lentement ?', meaning: 'Can you repeat that more slowly?' },
          { role: 'Receptionist', target: 'À neuf heures. Salle quatre, à droite.', meaning: 'At nine o’clock. Room four, on the right.' },
          { role: 'Workshop participant', target: 'À neuf heures, salle quatre, c’est bien ça ?', meaning: 'At nine o’clock, room four, is that right?' },
          { role: 'Receptionist', target: 'Oui, c’est ça.', meaning: 'Yes, that’s right.' },
          { role: 'Workshop participant', target: 'Merci, bonne journée !', meaning: 'Thank you, have a good day!' },
        ],
        grammar: { title: 'Put familiar phrases together', explanation: 'This transfer scene uses the fictional name Lila, 09:00 and room 4. Say L like the English letter L, I like “ee”, L, then A like “ah”; these sound cues are approximate. Un prénom is a first name. Neuf means nine and quatre means four; digits support the task. Read both time and room back before c’est bien ça ? Learn the exchange as useful chunks; optional grammar can wait. In the receptionist’s repeated line, listen for neuf, quatre and droite; the same information is available as text.' },
        sentence: { tokens: ['heures,', 'À', 'bien', 'neuf', 'ça', 'c’est', '?'], answer: 'À neuf heures, c’est bien ça ?', meaning: 'At nine o’clock, is that right?', hint: 'Read back À neuf heures, then ask c’est bien ça ?', explanation: 'Use à before a scheduled time. Heures is plural after neuf.' },
      },
    ],
  },
  {
    slug: 'neighbourhood-wayfinding', title: 'Neighbourhood wayfinding', role: 'Newcomer',
    provenance: {
      author: 'Original SmartLingo AI-assisted A1 drafts, 2026-11-24',
      rights: 'Original examples and fictional local layout. No third-party course text or media copied; existing notebook context provides text-supported practice.',
      review: 'Draft for owner review of French, meanings, estimated A1 demands and activities. No native-speaker or audio review claimed.',
    },
    lessons: [
      {
        slug: 'find-local-service', title: 'Find a local service', level: 'A1',
        outcome: 'Ask for a library, post office or pharmacy and identify the destination in a short reply.',
        words: [
          ['look-for', 'chercher', 'to look for', 'Je cherche la bibliothèque.', 'I am looking for the library.', 'Use je cherche + the thing you want; no pour is needed.'],
          library, post, pharmacy,
          ['where-place', 'où est… ?', 'where is…?', 'Où est la pharmacie ?', 'Where is the pharmacy?', 'A simple location question; add le or la and the place name.'],
          straight, left, right,
        ],
        dialogue: [
          { role: 'Newcomer', target: 'Bonjour, je cherche la bibliothèque.', meaning: 'Hello, I am looking for the library.' },
          { role: 'Resident', target: 'La bibliothèque ? Tout droit, à droite.', meaning: 'The library? Straight on, on the right.' },
          { role: 'Newcomer', target: 'Merci. Et où est le bureau de poste ?', meaning: 'Thank you. And where is the post office?' },
          { role: 'Resident', target: 'Le bureau de poste est à gauche.', meaning: 'The post office is on the left.' },
          { role: 'Newcomer', target: 'À gauche, merci beaucoup !', meaning: 'On the left, thank you very much!' },
        ],
        grammar: { title: 'Name the place you need', explanation: 'Je cherche means I am looking for. French chercher takes the place directly: je cherche la bibliothèque. Use une bibliothèque to introduce a library, then la bibliothèque for the particular one. Le bureau de poste is masculine; la bibliothèque and la pharmacie are feminine. Listen for the destination as well as the direction: Le bureau de poste est à gauche gives the post office and left. The dialogue provides a text fallback.' },
        sentence: { tokens: ['pharmacie', '?', 'la', 'Où', 'est'], answer: 'Où est la pharmacie ?', meaning: 'Where is the pharmacy?', hint: 'Start Où est, then la pharmacie.', explanation: 'Keep the accent in où and use la with pharmacie.' },
      },
      {
        slug: 'locate-with-landmark', title: 'Locate a place using a landmark', level: 'A1',
        outcome: 'Tell someone where a local service is using a recognisable landmark and a short position phrase.',
        words: [
          ['next-to', 'à côté de', 'next to', 'La bibliothèque est à côté du pont.', 'The library is next to the bridge.', 'De + le becomes du; de la stays separate.'],
          ['opposite', 'en face de', 'opposite / across from', 'Le bureau de poste est en face de la bibliothèque.', 'The post office is opposite the library.', 'Across from, rather than simply in front of a building.'],
          ['near', 'près de', 'near', 'La pharmacie est près de la place.', 'The pharmacy is near the square.', 'Keep de before the landmark.'],
          ['bridge', 'un pont', 'a bridge', 'La bibliothèque est près du pont.', 'The library is near the bridge.', 'Masculine: le pont, près du pont.', { gender: 'masculine' }],
          ['square', 'une place', 'a town square', 'Le bureau de poste est près de la place.', 'The post office is near the square.', 'Here a public square; not a seat or available spot.', { gender: 'feminine' }],
          library, post, pharmacy,
        ],
        dialogue: [
          { role: 'Newcomer', target: 'Où est la pharmacie ?', meaning: 'Where is the pharmacy?' },
          { role: 'Resident', target: 'Elle est près du pont, à côté de la bibliothèque.', meaning: 'It is near the bridge, next to the library.' },
          { role: 'Newcomer', target: 'À côté de la bibliothèque ?', meaning: 'Next to the library?' },
          { role: 'Resident', target: 'Oui. Le bureau de poste est en face de la pharmacie.', meaning: 'Yes. The post office is opposite the pharmacy.' },
          { role: 'Newcomer', target: 'Merci, je vois la pharmacie !', meaning: 'Thank you, I can see the pharmacy!' },
        ],
        grammar: { title: 'Keep de with the landmark', explanation: 'À côté de, en face de and près de all keep de before a landmark. De + le joins to make du: près du pont. With a feminine noun keep de la: à côté de la bibliothèque. Elle can refer back to the feminine noun pharmacie. En face de means across from; next to is à côté de. Listen for bibliothèque in À côté de la bibliothèque to identify the landmark. You can read the full line as text.' },
        sentence: { tokens: ['du', 'est', 'La', 'pont.', 'près', 'pharmacie'], answer: 'La pharmacie est près du pont.', meaning: 'The pharmacy is near the bridge.', hint: 'Start La pharmacie est, then près du pont.', explanation: 'Près de + le pont becomes près du pont. Do not say près de le pont.' },
      },
    ],
  },
];

export const a1CourseTasks: Readonly<Record<string, FrenchTransferTask>> = {
  'fr.workshop-check-in.ask-where-to-go': {
    prompt: 'You need room 3 (trois). Ask where it is. The reply is « Tout droit, à droite. » Repeat the side to check, then thank the receptionist. Say or type your response.',
    modelTarget: 'Excusez-moi, où est la salle trois ? — Tout droit, à droite. — À droite, merci !',
    modelMeaning: 'Excuse me, where is room three? — Straight on, on the right. — On the right, thank you!',
    check: 'Ask for room three and check right (à droite). You can also confirm with À droite, c’est bien ça ? before thanking the person.',
  },
  'fr.workshop-check-in.complete-workshop-check-in': {
    prompt: 'Use the fictional name Mila (M, I, L, A). M sounds approximately like the English letter M. Greet the receptionist, give and spell your name. Ask to hear « À midi, salle trois » again, then check noon and room 3. Text and digit support: midi = 12:00; trois = 3.',
    modelTarget: 'Bonjour, je m’appelle Mila. M, I, L, A. Vous pouvez répéter plus lentement ? À midi, salle trois, c’est bien ça ? Merci !',
    modelMeaning: 'Hello, my name is Mila. M, I, L, A. Can you repeat that more slowly? At noon, room three, is that right? Thank you!',
    check: 'Give and spell Mila, request a repetition, then confirm both noon and room three. Vous pouvez répéter ? is also a useful request.',
  },
  'fr.neighbourhood-wayfinding.find-local-service': {
    prompt: 'You now need a pharmacy. Ask a resident for it. Their reply is « La pharmacie est à droite. » Repeat the destination and side, then thank them.',
    modelTarget: 'Bonjour, où est la pharmacie ? — La pharmacie est à droite. — La pharmacie est à droite, merci !',
    modelMeaning: 'Hello, where is the pharmacy? — The pharmacy is on the right. — The pharmacy is on the right, thank you!',
    check: 'Ask for the pharmacy and identify right. Bonjour, je cherche la pharmacie also works to begin the exchange.',
  },
  'fr.neighbourhood-wayfinding.locate-with-landmark': {
    prompt: 'A neighbour asks where the library is. In this new fictional layout it is opposite the post office, near the square. Give the location using at least one of those landmarks.',
    modelTarget: 'La bibliothèque est en face du bureau de poste, près de la place.',
    modelMeaning: 'The library is opposite the post office, near the square.',
    check: 'Name the library and one correct relationship. En face du bureau de poste and près de la place each work; de + le becomes du.',
  },
};
