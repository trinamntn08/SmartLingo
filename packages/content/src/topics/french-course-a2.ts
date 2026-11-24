import type { TopicDraft } from '../build-topic';
import type { FrenchTransferTask } from '../french-practice/types';

// D057–D060: original editorial drafts, 2026-11-24. Estimated A2; owner review required.
// Research informs task scope only. No source text, recordings or images are reused.
// Sources: Council of Europe CEFR global scale; TV5MONDE Les mots du rendez-vous;
// Franchement FLE, A2+ Proposer un rendez-vous, annuler, reporter (May 2025).
export const a2CourseTopics: readonly TopicDraft[] = [{
  slug: 'appointment-changes', title: 'Changing appointments', role: 'Visitor',
  provenance: {
    author: 'Original SmartLingo AI-assisted editorial drafts, 2026-11-24',
    rights: 'Original French examples, dialogues, English support and tasks. Research references inform scope only; no third-party text or media copied. Text-supported activities; no new media assets.',
    review: 'Draft for owner review of French, translations, estimated A2 difficulty and tasks. No native-speaker review, CEFR certification or audio review claimed.',
  },
  lessons: [{
    slug: 'move-appointment', title: 'Ask to move an appointment', level: 'A2',
    outcome: 'Identify an existing appointment by name and time, then politely request a different date.',
    words: [
      ['appointment', 'un rendez-vous', 'an appointment', 'Je voudrais un rendez-vous.', 'I would like an appointment.', 'The spelling is unchanged in the plural.', { gender: 'masculine' }],
      ['move', 'déplacer', 'to reschedule / move', 'Je voudrais déplacer mon rendez-vous.', 'I would like to reschedule my appointment.', 'Here déplacer means move an appointment to a different time.'],
      ['calling-about', 'j’appelle au sujet de…', 'I am calling about…', 'J’appelle au sujet de mon rendez-vous.', 'I am calling about my appointment.', 'Polite telephone opening; add the subject after de.'],
      ['under-name', 'au nom de…', 'under the name…', 'Le rendez-vous est au nom de Nora Vidal.', 'The appointment is under the name Nora Vidal.', 'Useful when reception needs to locate a booking; au combines à and le.'],
      ['initial-appointment', 'le rendez-vous initial', 'the original appointment', 'Le rendez-vous initial est à dix heures.', 'The original appointment is at ten o’clock.', 'Initial describes the booking before the change; masculine rendez-vous.', { gender: 'masculine' }],
      ['same-day', 'le même jour', 'on the same day', 'Vous avez une place le même jour ?', 'Do you have a slot on the same day?', 'Le même jour refers back to a day already mentioned; masculine jour.'],
      ['another-date', 'une autre date', 'another date', 'Je voudrais une autre date.', 'I would like another date.', 'Une date is feminine. Autre goes before the noun.'],
      ['keep-appointment', 'garder mon rendez-vous', 'to keep my appointment', 'Sinon, je préfère garder mon rendez-vous.', 'Otherwise, I would prefer to keep my appointment.', 'Garder means retain the existing booking here.'],
    ],
    dialogue: [
      { role: 'Receptionist', target: 'Centre des Tilleuls, bonjour.', meaning: 'Tilleuls Centre, hello.' },
      { role: 'Visitor', target: 'Bonjour, j’appelle au sujet de mon rendez-vous du douze juin à dix heures, au nom de Nora Vidal.', meaning: 'Hello, I am calling about my appointment on the twelfth of June at ten o’clock, under the name Nora Vidal.' },
      { role: 'Receptionist', target: 'Oui, je vois le rendez-vous initial. Vous voulez le déplacer ?', meaning: 'Yes, I can see the original appointment. Do you want to reschedule it?' },
      { role: 'Visitor', target: 'Oui, s’il vous plaît. Vous avez une place le même jour, l’après-midi ?', meaning: 'Yes, please. Do you have a slot on the same day, in the afternoon?' },
      { role: 'Receptionist', target: 'Non, ce jour-là, tout est complet.', meaning: 'No, everything is fully booked that day.' },
      { role: 'Visitor', target: 'Alors, je voudrais une autre date. Sinon, je préfère garder mon rendez-vous.', meaning: 'Then I would like another date. Otherwise, I would prefer to keep my appointment.' },
    ],
    grammar: { title: 'Identify the booking before requesting a change', explanation: 'J’ai rendez-vous le douze juin names the date. Mon rendez-vous du douze juin identifies which appointment you mean: du combines de + le. Je voudrais + infinitive is a polite request; learn voudrais as a useful chunk. Use vous with reception staff.' },
    sentence: { tokens: ['rendez-vous.', 'Je', 'mon', 'déplacer', 'voudrais'], answer: 'Je voudrais déplacer mon rendez-vous.', meaning: 'I would like to reschedule my appointment.', hint: 'Start Je voudrais, then the infinitive.', explanation: 'Déplacer stays in its infinitive form after voudrais. Mon agrees with masculine rendez-vous.' },
  }, {
    slug: 'explain-constraint', title: 'Explain why you cannot come', level: 'A2',
    outcome: 'Give a brief reason for a scheduling conflict and state a clear availability boundary.',
    words: [
      ['conflict', 'un empêchement', 'a conflicting commitment / something preventing attendance', 'J’ai un empêchement jeudi.', 'Something has come up on Thursday.', 'A polite general explanation without personal details.', { gender: 'masculine' }],
      ['available', 'disponible', 'available', 'Je suis disponible jeudi.', 'I am available on Thursday.', 'Adjective; the same form for masculine and feminine.'],
      ['because', 'parce que', 'because', 'Je prends le bus parce qu’il pleut.', 'I am taking the bus because it is raining.', 'Que becomes qu’ before il.'],
      ['cannot-come', 'je ne peux pas venir', 'I cannot come', 'Je ne peux pas venir à neuf heures.', 'I cannot come at nine o’clock.', 'Keep ne… pas around peux in careful speech and writing. Venir stays in the infinitive.'],
      ['work-until', 'je travaille jusqu’à…', 'I work until…', 'Je travaille jusqu’à quinze heures.', 'I work until three p.m.', 'Jusqu’à gives the end of the working period.'],
      ['from-time', 'à partir de…', 'from… onwards', 'Je suis disponible à partir de seize heures.', 'I am available from four p.m. onwards.', 'Gives the earliest possible time, rather than an exact appointment.'],
      ['accompany', 'je dois accompagner…', 'I need to accompany…', 'Je dois accompagner ma sœur.', 'I need to accompany my sister.', 'Accompagner takes a person directly, without à. No personal explanation is required in a real call.'],
      ['meeting', 'une réunion', 'a meeting', 'La réunion commence à quatorze heures.', 'The meeting starts at two p.m.', 'Workplace sense.', { gender: 'feminine' }],
    ],
    dialogue: [
      { role: 'Receptionist', target: 'Vous pouvez venir jeudi à neuf heures ?', meaning: 'Can you come on Thursday at nine o’clock?' },
      { role: 'Visitor', target: 'J’ai un empêchement. Je ne peux pas venir parce que je dois accompagner ma sœur.', meaning: 'Something has come up. I cannot come because I need to accompany my sister.' },
      { role: 'Receptionist', target: 'Et vendredi matin ?', meaning: 'And Friday morning?' },
      { role: 'Visitor', target: 'Vendredi, j’ai une réunion, puis je travaille jusqu’à quinze heures.', meaning: 'On Friday, I have a meeting, then I work until three p.m.' },
      { role: 'Receptionist', target: 'Vous êtes disponible à partir de quelle heure ?', meaning: 'From what time onwards are you available?' },
      { role: 'Visitor', target: 'Je suis disponible à partir de seize heures.', meaning: 'I am available from four p.m. onwards.' },
    ],
    grammar: { title: 'A reason and a time boundary', explanation: 'Parce que introduces a reason: je ne peux pas venir parce que je travaille. Jusqu’à quinze heures marks an end point; à partir de seize heures marks a starting point. Being available from four does not confirm a booking at four. J’ai un empêchement is enough if you prefer a general explanation.' },
    sentence: { tokens: ['venir', 'travaille.', 'ne', 'Je', 'parce', 'peux', 'je', 'pas', 'que'], answer: 'Je ne peux pas venir parce que je travaille.', meaning: 'I cannot come because I am working.', hint: 'Put ne and pas around peux; then give the reason.', explanation: 'Use venir after peux. Parce que links the whole reason je travaille to the request.' },
  }, {
    slug: 'offer-another-time', title: 'Offer another time', level: 'A2',
    outcome: 'Compare an offered slot with your calendar, propose a workable alternative and accept the final time.',
    words: [
      ['slot', 'un créneau', 'a time slot', 'Vous avez un créneau vendredi ?', 'Do you have a time slot on Friday?', 'Common in appointment scheduling.', { gender: 'masculine' }],
      ['earlier', 'plus tôt', 'earlier', 'Vous avez un créneau plus tôt ?', 'Do you have an earlier slot?', 'Two words; distinguish plutôt, rather or instead.'],
      ['later', 'plus tard', 'later', 'Je peux venir plus tard.', 'I can come later.', 'Later than the time already mentioned; not en retard, running late.'],
      ['do-you-have', 'est-ce que vous avez… ?', 'do you have…?', 'Est-ce que vous avez un créneau à onze heures ?', 'Do you have a slot at eleven o’clock?', 'Est-ce que introduces a neutral question; keep vous avez in its usual order.'],
      ['before-noon', 'avant midi', 'before noon', 'Je peux venir avant midi.', 'I can come before noon.', 'Midi means noon; avant excludes noon itself.'],
      ['after-four', 'après seize heures', 'after four p.m.', 'Je peux venir après seize heures.', 'I can come after four p.m.', 'The twenty-four-hour clock makes the afternoon explicit. Après means after, not from exactly four.'],
      ['suits-me', 'cela me convient', 'that suits me', 'Onze heures, cela me convient.', 'Eleven o’clock suits me.', 'Polite neutral acceptance; ça me convient is a natural spoken alternative.'],
      ['between-times', 'entre… et…', 'between… and…', 'Je suis disponible entre dix heures et midi.', 'I am available between ten o’clock and noon.', 'Give both limits; do not replace et with à in this pattern.'],
    ],
    dialogue: [
      { role: 'Receptionist', target: 'Pour votre visite de l’atelier, j’ai un créneau à quatorze heures.', meaning: 'For your workshop visit, I have a slot at two p.m.' },
      { role: 'Visitor', target: 'Est-ce que vous avez un créneau plus tôt ? Je peux venir avant midi, entre dix heures et midi.', meaning: 'Do you have an earlier slot? I can come before noon, between ten o’clock and noon.' },
      { role: 'Receptionist', target: 'J’ai onze heures. Sinon, vous pouvez venir plus tard, à seize heures trente.', meaning: 'I have eleven o’clock. Otherwise, you can come later, at four thirty p.m.' },
      { role: 'Visitor', target: 'Après seize heures, je ne peux pas. Onze heures, cela me convient.', meaning: 'After four p.m., I cannot. Eleven o’clock suits me.' },
      { role: 'Receptionist', target: 'Très bien, je note onze heures pour la visite.', meaning: 'Very good, I am putting down eleven o’clock for the visit.' },
    ],
    grammar: { title: 'Earlier or later than an offered time', explanation: 'Plus tôt and plus tard compare with a time already understood. Plus tôt has two words; plutôt means rather or instead. Est-ce que vous avez… ? and Vous avez… ? with rising intonation are both natural questions. À onze heures is an exact time; entre dix heures et midi is a window.' },
    sentence: { tokens: ['tôt', 'un', 'vous', 'plus', '?', 'avez', 'Est-ce', 'créneau', 'que'], answer: 'Est-ce que vous avez un créneau plus tôt ?', meaning: 'Do you have an earlier slot?', hint: 'Start Est-ce que vous avez.', explanation: 'Keep plus tôt together after un créneau. Plutôt would change the meaning.' },
  }, {
    slug: 'check-confirmation', title: 'Check the new confirmation', level: 'A2',
    outcome: 'Read a changed booking message, query a room discrepancy and repeat the confirmed date, time and place.',
    words: [
      ['confirm', 'confirmer', 'to confirm', 'Je confirme pour vendredi à dix heures.', 'I confirm Friday at ten.', 'Regular -er verb; confirmer un rendez-vous means confirm an appointment.'],
      ['postpone', 'reporter', 'to postpone / move to a later date', 'On peut reporter la promenade à dimanche.', 'We can postpone the walk until Sunday.', 'Regular -er verb; here change a plan to a later time.'],
      ['cancel', 'annuler', 'to cancel', 'Je dois annuler mon rendez-vous.', 'I need to cancel my appointment.', 'Regular -er verb; annuler un rendez-vous means cancel an appointment.'],
      ['written-confirmation', 'une confirmation écrite', 'a written confirmation', 'Je voudrais une confirmation écrite.', 'I would like a written confirmation.', 'Confirmation is feminine; écrite agrees with it.', { gender: 'feminine' }],
      ['postponed-to', 'est reporté au…', 'has been postponed to…', 'Votre rendez-vous est reporté au vingt juin.', 'Your appointment has been postponed to the twentieth of June.', 'Recognition chunk from a message. Au introduces the new date; à introduces a clock time. Reporté agrees with masculine rendez-vous.'],
      ['check-detail', 'c’est bien… ?', 'is it definitely…?', 'C’est bien dans la salle deux ?', 'Is it definitely in room two?', 'Use rising intonation to check a detail; bien adds confirmation, not a positive judgement.'],
      ['room-error', 'une erreur de salle', 'a mistake in the room details', 'Il y a une erreur de salle dans le message.', 'There is a mistake in the room details in the message.', 'Erreur and salle are feminine; de salle specifies what is wrong.', { gender: 'feminine' }],
      ['correct-detail', 'vous pouvez corriger… ?', 'can you correct…?', 'Vous pouvez corriger le message ?', 'Can you correct the message?', 'A polite spoken request with vous; add s’il vous plaît when appropriate.'],
    ],
    dialogue: [
      { role: 'Visitor', target: 'Bonjour. Votre message dit : « Votre rendez-vous est reporté au vingt juin à onze heures, salle trois. »', meaning: 'Hello. Your message says: “Your appointment has been postponed to the twentieth of June at eleven o’clock, room three.”' },
      { role: 'Receptionist', target: 'Oui, le rendez-vous du dix-huit juin est annulé. Le nouveau est le vingt juin.', meaning: 'Yes, the appointment on the eighteenth of June is cancelled. The new one is on the twentieth of June.' },
      { role: 'Visitor', target: 'Au téléphone, vous avez dit salle deux. C’est bien dans la salle deux ?', meaning: 'On the phone, you said room two. Is it definitely in room two?' },
      { role: 'Receptionist', target: 'Oui, il y a une erreur de salle dans le message.', meaning: 'Yes, there is a mistake in the room details in the message.' },
      { role: 'Receptionist', target: 'Je confirme : le vingt juin à onze heures, salle deux.', meaning: 'I confirm: the twentieth of June at eleven o’clock, room two.' },
      { role: 'Visitor', target: 'Le vingt juin à onze heures, salle deux. Vous pouvez corriger le message ? Je voudrais une confirmation écrite.', meaning: 'The twentieth of June at eleven o’clock, room two. Can you correct the message? I would like a written confirmation.' },
      { role: 'Receptionist', target: 'Oui, je vous envoie le message corrigé.', meaning: 'Yes, I am sending you the corrected message.' },
    ],
    grammar: { title: 'Moved and cancelled are different', explanation: 'Est reporté announces a postponement; est annulé says a booking is cancelled. In this fictional exchange, the old slot is cancelled and a new one is confirmed. Check the new date, time and room rather than assuming them. C’est bien dans la salle deux ? confirms one specific detail. Reportée and annulée take an extra e with feminine une visite.' },
    sentence: { tokens: ['la', 'bien', 'deux', '?', 'C’est', 'salle', 'dans'], answer: 'C’est bien dans la salle deux ?', meaning: 'Is it definitely in room two?', hint: 'Start C’est bien, then give the place.', explanation: 'Dans la salle names the room; bien asks for confirmation. Keep the question mark to show the checking question.' },
  }],
}];

// Full proposed ID → exact existing canonical ID; reused entries above retain canonical support.
export const a2CourseAliases: Readonly<Record<string, string>> = {
  'fr.appointment-changes.appointment': 'fr.health.rendez-vous',
  'fr.appointment-changes.move': 'fr.health.deplacer',
  'fr.appointment-changes.conflict': 'fr.health.empechement',
  'fr.appointment-changes.available': 'fr.health.disponible',
  'fr.appointment-changes.because': 'fr.opinions.because',
  'fr.appointment-changes.meeting': 'fr.work.reunion',
  'fr.appointment-changes.slot': 'fr.health.creneau',
  'fr.appointment-changes.confirm': 'fr.health.confirmer',
  'fr.appointment-changes.postpone': 'fr.leisure.reporter',
  'fr.appointment-changes.cancel': 'fr.health.annuler',
};

export const a2CourseTasks: Readonly<Record<string, FrenchTransferTask>> = {
  'fr.appointment-changes.move-appointment': {
    prompt: 'Speak or type to a fictional library receptionist. Your appointment is under Alex Morel on 8 July at 2 p.m. Identify it and politely ask for another date.',
    modelTarget: 'Bonjour, j’appelle au sujet de mon rendez-vous du huit juillet à quatorze heures, au nom d’Alex Morel. Je voudrais le déplacer à une autre date, s’il vous plaît.',
    modelMeaning: 'Hello, I am calling about my appointment on the eighth of July at two p.m., under the name Alex Morel. I would like to move it to another date, please.',
    check: 'Give the booking name, original date and time, then ask to move it. Je voudrais déplacer mon rendez-vous is another clear request; le here replaces mon rendez-vous.',
  },
  'fr.appointment-changes.explain-constraint': {
    prompt: 'Speak or type a reply to an offer of Tuesday at 3 p.m. You work until 4 p.m. and need thirty minutes to travel. Give the reason and say your earliest availability.',
    modelTarget: 'Je ne peux pas venir à quinze heures parce que je travaille jusqu’à seize heures. Avec le trajet, je suis disponible à partir de seize heures trente.',
    modelMeaning: 'I cannot come at three p.m. because I work until four p.m. Allowing for the journey, I am available from four thirty p.m. onwards.',
    check: 'Explain why three is impossible and give four thirty as the earliest possible arrival. Availability alone does not confirm a new appointment.',
  },
  'fr.appointment-changes.offer-another-time': {
    prompt: 'Speak or type to reception. They offer 11 a.m., but you are available only between 2 and 4 p.m. Ask for a later slot and propose 3 p.m.',
    modelTarget: 'Est-ce que vous avez un créneau plus tard ? Je suis disponible entre quatorze heures et seize heures. Quinze heures, c’est possible ?',
    modelMeaning: 'Do you have a later slot? I am available between two p.m. and four p.m. Is three p.m. possible?',
    check: 'Ask for a later time and propose a time inside your availability window. Vous avez un créneau plus tard ? is also a natural question.',
  },
  'fr.appointment-changes.check-confirmation': {
    prompt: 'Speak or type to reception. The new message says 9 September at 10 a.m., room 6. Reception previously said room 4. Ask which room is correct and request a corrected written confirmation if necessary.',
    modelTarget: 'Votre message indique le neuf septembre à dix heures, salle six. Au téléphone, vous avez dit salle quatre. C’est bien dans la salle quatre ? Si c’est une erreur, vous pouvez corriger le message et m’envoyer une confirmation écrite ?',
    modelMeaning: 'Your message gives the ninth of September at ten a.m., room six. On the phone, you said room four. Is it definitely in room four? If it is a mistake, can you correct the message and send me a written confirmation?',
    check: 'Mention both conflicting rooms and the appointment date and time. Ask for verification rather than deciding the correct room yourself; request a corrected message if it contains an error.',
  },
};
