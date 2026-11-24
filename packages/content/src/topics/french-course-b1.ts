import type { TopicDraft } from '../build-topic';
import type { FrenchTransferTask } from '../french-practice/types';

// Original draft D113–D116 samples, 2026-11-24; estimated B1 tasks, owner review required.
// Prerequisites: A2 transport, clock times, comparisons, polite questions and short messages.
// Research inspected 2026-11-24 (orientation only; no source text/media reused):
// CEFR: familiar clear input, travel problems, connected text and brief reasons for plans.
// https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale
// TV5MONDE: B1 listening for essentials; travel is one example theme, not a prescribed word list.
// https://apprendre.tv5monde.com/fr/exercices/b1-intermediaire
// Alliance Française Paris, Vivre en France B1, p19: rail travel/information and duration.
// https://lms.fun-mooc.fr/asset-v1:dgef-interieur%2B134002%2Bsession01%2Btype@asset%2Bblock@Pages_de_Livret_p%C3%A9dagogique_MOOC_Vivre-en-France_A2-B1_AF-Paris_tableaux-des-contenus_B1.pdf
// All routes, services, times and notices below are fictional language-practice details.
export const b1CourseTopics: readonly TopicDraft[] = [{
  slug: 'travel-disruptions', title: 'Travel when plans change', role: 'Passenger',
  provenance: {
    author: 'Original SmartLingo AI-assisted French draft, 2026-11-24',
    rights: 'Original fictional notices, examples, dialogues and tasks. Research informs task design only; no third-party course text or media copied. No new media.',
    review: 'Draft for owner and qualified French review: estimated B1 task demand, register, translations, timing and answers. No certified coverage, native-speaker review or audio review claimed.',
  },
  lessons: [{
    slug: 'understand-disruption', title: 'Understand a travel disruption', level: 'B1',
    outcome: 'Explain the cause, affected section and expected end of a fictional disruption to another traveller.',
    words: [
      ['interruption', 'une interruption', 'an interruption / suspension', 'L’interruption concerne la ligne quatre.', 'The suspension affects line four.', 'Feminine. Here a temporary interruption of a transport service.', { gender: 'feminine' }],
      ['due-to', 'en raison de', 'due to / because of', 'Le service est interrompu en raison de travaux.', 'The service is suspended because of engineering work.', 'Neutral formal notice language; followed by a noun, not a full clause.'],
      ['until', 'jusqu’à', 'until', 'Je peux rester jusqu’à midi ?', 'Can I stay until noon?', 'Before les, jusqu’à becomes jusqu’aux: jusqu’aux vacances.'],
      ['affected-section', 'la partie concernée', 'the affected section', 'La partie concernée va de Parc à Rives.', 'The affected section runs from Parc to Rives.', 'Feminine partie; concernée agrees with it. Parc and Rives are fictional station names.', { gender: 'feminine' }],
      ['resumption', 'une reprise du service', 'a resumption of service', 'La reprise du service est prévue à dix heures.', 'Service is expected to resume at ten.', 'Feminine reprise. Prévue gives an estimate or plan, not a guarantee.', { gender: 'feminine' }],
      ['expected', 'être prévu pour', 'to be scheduled / expected for', 'Le retour à la normale est prévu pour dix heures.', 'A return to normal is expected at ten.', 'Prévu agrees: une reprise est prévue. Pour introduces the expected time.'],
      ['cancelled', 'annulé', 'cancelled', 'Mon train est annulé.', 'My train is cancelled.', 'Adjective: annulé with train, annulée with a feminine noun.'],
      ['according-notice', 'd’après l’annonce', 'according to the announcement', 'D’après l’annonce, seule une partie de la ligne est fermée.', 'According to the announcement, only part of the line is closed.', 'Attributes information to its source. Une annonce is feminine.'],
    ],
    dialogue: [
      { role: 'Announcement', target: 'En raison de travaux, la ligne quatre est interrompue entre Parc et Rives jusqu’à dix heures. Les trains circulent normalement entre Centre et Parc.', meaning: 'Because of engineering work, line four is suspended between Parc and Rives until ten. Trains are running normally between Centre and Parc.' },
      { role: 'Passenger', target: 'La reprise est bien prévue à dix heures ?', meaning: 'Is service expected to resume at ten?' },
      { role: 'Staff', target: 'Oui, mais cet horaire reste une estimation. Le train de neuf heures pour Rives est annulé.', meaning: 'Yes, but that time is still an estimate. The nine o’clock train to Rives is cancelled.' },
      { role: 'Passenger', target: 'Donc la partie concernée va de Parc à Rives. Pour Centre, je peux encore prendre le train ?', meaning: 'So the affected section runs from Parc to Rives. Can I still take the train to Centre?' },
      { role: 'Staff', target: 'Oui. Pour Rives, demandez au guichet quel autre service vous pouvez prendre.', meaning: 'Yes. For Rives, ask at the ticket counter which alternative service you can take.' },
    ],
    grammar: { title: 'Link the cause, section and time', explanation: 'En raison de + noun introduces a cause in a notice: en raison de travaux. In conversation, parce que + clause also gives a cause: parce qu’il y a des travaux. Entre Parc et Rives identifies the section; jusqu’à dix heures gives its stated end time. Prévu signals an expectation, so do not relay it as certain.' },
    sentence: { tokens: ['travaux.', 'est', 'en raison de', 'Le service', 'interrompu'], answer: 'Le service est interrompu en raison de travaux.', meaning: 'The service is suspended because of engineering work.', hint: 'Start Le service est interrompu, then give the cause.', explanation: 'En raison de takes the noun travaux. Parce que would need a complete clause.' },
  }, {
    slug: 'check-alternative', title: 'Find out what still runs', level: 'B1',
    outcome: 'Check an alternative service, confirm a change and relay the usable route with its timing.',
    words: [
      ['still-running', 'circuler normalement', 'to run normally', 'Les bus circulent normalement ce matin.', 'The buses are running normally this morning.', 'Circuler describes vehicles running, not only people moving.'],
      ['serve-stop', 'desservir', 'to serve / stop at', 'Ce bus dessert la gare de Rives.', 'This bus serves Rives station.', 'Irregular verb: il dessert, ils desservent. It describes places a service serves.'],
      ['connection', 'une correspondance', 'a connection; a change of service', 'Il y a une correspondance à Tours.', 'There is a change at Tours.', '', { gender: 'feminine' }],
      ['if-understood', 'si j’ai bien compris', 'if I have understood correctly', 'Si j’ai bien compris, je change à Parc.', 'If I have understood correctly, I change at Parc.', 'Use to check your understanding before restating the details.'],
      ['remain-on', 'rester dans le bus', 'to stay on the bus', 'Restez dans le bus jusqu’à Rives.', 'Stay on the bus until Rives.', 'Dans marks being inside the vehicle. Restez is the vous instruction.'],
      ['opposite-station', 'en face de la gare', 'opposite the station', 'L’arrêt se trouve en face de la gare.', 'The stop is opposite the station.', 'En face de + place; la gare is feminine.'],
      ['every-quarter', 'tous les quarts d’heure', 'every fifteen minutes', 'Le bus part tous les quarts d’heure.', 'The bus leaves every fifteen minutes.', 'Plural quarts; une heure is feminine. This expresses frequency, not total travel time.'],
      ['allow-change', 'prévoir dix minutes pour changer', 'to allow ten minutes to change', 'Prévoyez dix minutes pour changer à Parc.', 'Allow ten minutes to change at Parc.', 'Prévoir means allow or plan for here; pour + infinitive gives the purpose.'],
    ],
    dialogue: [
      { role: 'Passenger', target: 'Bonjour, avec l’interruption, est-ce qu’un autre service dessert Rives ?', meaning: 'Hello, with the suspension, does another service stop at Rives?' },
      { role: 'Staff', target: 'Oui. Prenez le train de neuf heures dix pour Parc. Il arrive à neuf heures vingt. Le bus huit part à neuf heures trente-cinq, en face de la gare.', meaning: 'Yes. Take the nine ten train to Parc. It arrives at nine twenty. Bus eight leaves at nine thirty-five, opposite the station.' },
      { role: 'Passenger', target: 'Si j’ai bien compris, j’ai quinze minutes pour la correspondance. Le bus va jusqu’à Rives ?', meaning: 'If I have understood correctly, I have fifteen minutes for the connection. Does the bus go all the way to Rives?' },
      { role: 'Staff', target: 'Oui, restez dans le bus jusqu’au terminus. L’arrivée est à dix heures. Prévoyez dix minutes pour changer à Parc.', meaning: 'Yes, stay on the bus to the terminus. Arrival is at ten. Allow ten minutes to change at Parc.' },
      { role: 'Passenger', target: 'Merci. Les autres bus huit circulent normalement ?', meaning: 'Thank you. Are the other number eight buses running normally?' },
      { role: 'Staff', target: 'Oui, ils partent tous les quarts d’heure.', meaning: 'Yes, they leave every fifteen minutes.' },
    ],
    grammar: { title: 'Check and relay a route', explanation: 'After si j’ai bien compris, restate the detail you want checked: j’ai quinze minutes pour changer. This si means if my understanding is correct. Est-ce que le bus dessert Rives ? asks whether it serves Rives. To relay the answer to a friend, use tu peux prendre… puis… (you can take… then…). Staff questions use vous; a friend you know can use tu.' },
    sentence: { tokens: ['à Parc.', 'je', 'Si j’ai bien compris,', 'change'], answer: 'Si j’ai bien compris, je change à Parc.', meaning: 'If I have understood correctly, I change at Parc.', hint: 'Start with the checking phrase, then state the change.', explanation: 'The phrase checks your understanding; je change à Parc supplies the detail to confirm.' },
  }, {
    slug: 'compare-routes', title: 'Compare two ways there', level: 'B1',
    outcome: 'Recommend a feasible route before a deadline and justify a trade-off using arrival and change details.',
    words: [
      ['faster', 'plus rapide', 'faster', 'Le trajet en train est plus rapide que le trajet en bus.', 'The train journey is faster than the bus journey.', 'Plus + adjective + que compares two things. Rapide has the same masculine and feminine form.'],
      ['less-direct', 'moins direct', 'less direct', 'Ce trajet est moins direct, car il faut changer.', 'This route is less direct because you have to change.', 'Feminine: moins directe. Compare the route, not just one vehicle.'],
      ['direct', 'direct', 'direct; without a change', 'Ce train est direct pour Lyon ?', 'Is this train direct to Lyon?', 'Adjective; feminine directe. Direct does not necessarily mean non-stop.'],
      ['even-if', 'même si', 'even if / even though', 'Je choisis le train, même si je dois changer.', 'I choose the train even though I have to change.', 'Follow with a normal statement: même si je dois…, not a subjunctive form.'],
      ['have-time', 'avoir le temps de', 'to have time to', 'J’ai le temps de marcher jusqu’à l’atelier.', 'I have time to walk to the workshop.', 'De + infinitive: le temps de marcher.'],
      ['margin', 'une marge de dix minutes', 'a ten-minute buffer', 'Je garde une marge de dix minutes avant l’atelier.', 'I leave a ten-minute buffer before the workshop.', 'Feminine marge. A buffer allows for a small delay.', { gender: 'feminine' }],
      ['total-time', 'au total', 'in total / altogether', 'Le trajet dure cinquante minutes au total.', 'The journey takes fifty minutes in total.', 'Count waiting and changes when comparing total journey times.'],
      ['risk-missing', 'risquer de manquer', 'to risk missing', 'Avec ce bus, je risque de manquer le début.', 'With this bus, I risk missing the start.', 'Risquer de + infinitive. Manquer le début means miss the beginning.'],
    ],
    dialogue: [
      { role: 'Passenger', target: 'Je dois être à l’atelier de Rives à dix heures quinze. Il faut marcher dix minutes depuis la gare. Quel trajet me conseillez-vous ?', meaning: 'I need to be at the workshop in Rives at ten fifteen. It is a ten-minute walk from the station. Which route do you recommend?' },
      { role: 'Staff', target: 'Le bus direct part d’ici à neuf heures vingt et arrive à la gare de Rives à dix heures dix. Il met cinquante minutes au total.', meaning: 'The direct bus leaves here at nine twenty and arrives at Rives station at ten ten. It takes fifty minutes in total.' },
      { role: 'Passenger', target: 'Avec la marche, j’arriverais à dix heures vingt.', meaning: 'With the walk, I would arrive at ten twenty.' },
      { role: 'Staff', target: 'L’autre trajet part d’ici à neuf heures dix : train jusqu’à Parc, puis bus huit. Vous arrivez à la gare de Rives à dix heures, soit cinquante minutes au total.', meaning: 'The other route leaves here at nine ten: train to Parc, then bus eight. You arrive at Rives station at ten, which is fifty minutes in total.' },
      { role: 'Passenger', target: 'Je choisis ce trajet, même s’il est moins direct. Les deux durent aussi longtemps, mais celui-ci part plus tôt. J’ai le temps de marcher et il me reste cinq minutes de marge.', meaning: 'I choose that route even though it is less direct. Both take the same amount of time, but this one leaves earlier. I have time to walk and still have a five-minute buffer.' },
    ],
    grammar: { title: 'Justify a trade-off with même si', explanation: 'Même si links a choice to its drawback: je prends le train, même si je dois changer. Plus rapide means faster, but an earlier arrival does not always mean a shorter journey: compare departure, total time and the final walk. J’arriverais describes the result of an option you are considering. Au total includes the full stated journey.' },
    sentence: { tokens: ['même si', 'Je prends', 'changer.', 'je dois', 'le train,'], answer: 'Je prends le train, même si je dois changer.', meaning: 'I take the train even though I have to change.', hint: 'State your choice first, then its drawback.', explanation: 'Use même si + subject and verb. Je dois is followed by the infinitive changer.' },
  }, {
    slug: 'notify-delay', title: 'Notify someone of a delay', level: 'B1',
    outcome: 'Send a connected update with a cause, estimated arrival and a workable contingency.',
    words: [
      ['as-result', 'du coup', 'so / as a result', 'Le train est annulé ; du coup, je prends le bus.', 'The train is cancelled, so I am taking the bus.', 'Common conversational connector, suitable for a message to a friend. Donc is more neutral.'],
      ['expected-arrival', 'je devrais arriver', 'I should arrive / I expect to arrive', 'Je devrais arriver vers dix heures.', 'I should arrive around ten.', 'Here conditional devrais gives an estimate, not an obligation or promise.'],
      ['full', 'complet', 'full / with no places available', 'Si le bus est complet, j’attendrai le suivant.', 'If the bus is full, I will wait for the next one.', 'Masculine complet for bus or train; feminine complète. Here about passenger capacity.'],
      ['let-know', 'prévenir', 'to let someone know / notify', 'Je vais prévenir la professeure.', 'I am going to let the teacher know.', 'Prévenir quelqu’un takes a direct object, without à.'],
      ['keep-updated', 'je te tiens au courant', 'I’ll keep you updated', 'Je te tiens au courant si l’horaire change.', 'I’ll keep you updated if the time changes.', 'Familiar tu message; polite/formal version: je vous tiens au courant.'],
      ['meanwhile', 'en attendant', 'in the meantime / while waiting', 'En attendant, tu peux entrer dans la salle.', 'In the meantime, you can go into the room.', 'Links a temporary action to what happens next.'],
      ['next-one', 'le suivant', 'the next one', 'Ce bus est complet ; je prendrai le suivant.', 'This bus is full; I will take the next one.', 'Masculine for bus. Use la suivante for a feminine noun such as navette.'],
      ['thanks-waiting', 'merci de m’attendre', 'thank you for waiting for me', 'Merci de m’attendre devant l’atelier.', 'Thank you for waiting for me outside the workshop.', 'Merci de + infinitive; m’ means me. Merci de votre patience is more formal.'],
    ],
    dialogue: [
      { role: 'Passenger', target: 'Salut Inès, le train est annulé en raison de travaux. Du coup, je prends le bus de remplacement de neuf heures quarante.', meaning: 'Hi Inès, the train is cancelled because of engineering work. So I am taking the nine forty replacement bus.' },
      { role: 'Friend', target: 'Tu devrais arriver à quelle heure ? L’atelier commence à dix heures quinze.', meaning: 'What time do you expect to arrive? The workshop starts at ten fifteen.' },
      { role: 'Passenger', target: 'Le bus arrive à la gare à dix heures cinq. Avec les dix minutes de marche, je devrais arriver à dix heures quinze. Merci de m’attendre devant l’atelier.', meaning: 'The bus arrives at the station at ten oh five. With the ten-minute walk, I should arrive at ten fifteen. Thank you for waiting for me outside the workshop.' },
      { role: 'Friend', target: 'Et si le bus est complet ?', meaning: 'And if the bus is full?' },
      { role: 'Passenger', target: 'Je prendrai le suivant, quinze minutes plus tard. Dans ce cas, j’arriverai vers dix heures trente. Je te tiens au courant dès que je monte dans le bus.', meaning: 'I will take the next one, fifteen minutes later. In that case, I will arrive around ten thirty. I’ll keep you updated as soon as I get on the bus.' },
      { role: 'Friend', target: 'D’accord. Si tu prends le suivant, préviens-moi. En attendant, je vais entrer pour expliquer ton retard.', meaning: 'All right. If you take the next one, let me know. In the meantime, I will go in to explain your delay.' },
    ],
    grammar: { title: 'An estimate and a real contingency', explanation: 'Je devrais arriver means I expect to arrive here; it leaves room for uncertainty. For a possible future event use si + present, then a future result: si le bus est complet, je prendrai le suivant. Do not use si le bus sera complet in this pattern. Du coup suits a familiar message; use donc for a more neutral tone.' },
    sentence: { tokens: ['je prendrai', 'est complet,', 'Si le bus', 'le suivant.'], answer: 'Si le bus est complet, je prendrai le suivant.', meaning: 'If the bus is full, I will take the next one.', hint: 'Start with Si + the present-tense condition.', explanation: 'Est is present after si; prendrai states the future result. Suivant refers back to masculine bus.' },
  }],
}];

// Canonical sense reuse preserves each complete existing vocabulary payload above.
export const b1CourseAliases: Readonly<Record<string, string>> = {
  'fr.travel-disruptions.until': 'fr.accommodation.until',
  'fr.travel-disruptions.cancelled': 'fr.transport.cancelled',
  'fr.travel-disruptions.connection': 'fr.transport.connection',
  'fr.travel-disruptions.direct': 'fr.transport.direct',
  'fr.travel-disruptions.let-know': 'fr.education.prevenir',
};

export const b1CourseTasks: Readonly<Record<string, FrenchTransferTask>> = {
  'fr.travel-disruptions.understand-disruption': {
    prompt: 'New fictional notice: line six is suspended between Mairie and Bois because of a technical fault. Service is expected to resume at 11:30; trains still run from Centre to Mairie. Your friend needs Bois. In 3–4 connected French sentences, relay the affected section, reason and expected time, then explain why they need another option. Une panne technique = a technical fault.',
    modelTarget: 'D’après l’annonce, la ligne six est interrompue entre Mairie et Bois en raison d’une panne technique. La reprise est prévue à onze heures trente, mais ce n’est qu’une estimation. Les trains vont seulement jusqu’à Mairie depuis Centre. Comme tu vas à Bois, il faut chercher un autre trajet.',
    modelMeaning: 'According to the announcement, line six is suspended between Mairie and Bois because of a technical fault. Service is expected to resume at eleven thirty, but that is only an estimate. Trains only go as far as Mairie from Centre. As you are going to Bois, we need to look for another route.',
    check: 'Did you link the cause, section and expected time, then explain the consequence for your friend? Keep the resumption time uncertain.',
  },
  'fr.travel-disruptions.check-alternative': {
    prompt: 'New fictional staff reply: train to Mairie leaves at 10:00 and arrives at 10:12. Bus nine leaves opposite the station at 10:25 and reaches Bois at 10:50. Allow ten minutes to change. Tell a friend the route and times in 3–4 connected French sentences; explain whether the change is feasible and ask them to confirm they understood.',
    modelTarget: 'Tu peux prendre le train de dix heures pour Mairie, qui arrive à dix heures douze. Puis le bus neuf part à dix heures vingt-cinq, en face de la gare, et arrive à Bois à dix heures cinquante. Tu as treize minutes pour changer : c’est assez, puisqu’il faut prévoir dix minutes. Tu as bien compris où prendre le bus ?',
    modelMeaning: 'You can take the ten o’clock train to Mairie, which arrives at ten twelve. Then bus nine leaves at ten twenty-five, opposite the station, and arrives at Bois at ten fifty. You have thirteen minutes to change: that is enough, since you need to allow ten minutes. Have you understood where to catch the bus?',
    check: 'Did you relay the destination, change location and times, justify the connection with thirteen versus ten minutes, and check understanding?',
  },
  'fr.travel-disruptions.compare-routes': {
    prompt: 'New fictional choice at 10:00: bus A leaves now, reaches Bois station at 10:45 and needs no change. Route B leaves at 10:05 and reaches Bois station at 10:35 with one change. Both include any waiting during the journey. The workshop starts at 10:50, ten minutes’ walk from Bois station. Recommend one route in 3–4 connected French sentences. Compare the options, include the walk and explain the trade-off.',
    modelTarget: 'Je te conseille le trajet B, même s’il faut changer. Il dure trente minutes, contre quarante-cinq pour le bus direct, et tu arrives à la gare à dix heures trente-cinq. Avec dix minutes de marche, tu seras à l’atelier à dix heures quarante-cinq, donc tu gardes cinq minutes de marge. Avec le bus A, tu arriverais cinq minutes après le début.',
    modelMeaning: 'I recommend route B, even though you have to change. It takes thirty minutes, compared with forty-five for the direct bus, and you arrive at the station at ten thirty-five. With a ten-minute walk, you will be at the workshop at ten forty-five, so you keep a five-minute buffer. With bus A, you would arrive five minutes after the start.',
    check: 'Did you compare both routes, include the walk, give a reason tied to 10:50 and acknowledge the change required by B?',
  },
  'fr.travel-disruptions.notify-delay': {
    prompt: 'New fictional update: a technical fault has cancelled your train. Bus twelve reaches Bois station at 11:10; the workshop is ten minutes away on foot and starts at 11:15. If that bus is full, the next one arrives at 11:25. Write a familiar message to Inès in 3–5 connected French sentences: give the cause, your estimated arrival at the workshop, the backup arrival and when you will update her.',
    modelTarget: 'Salut Inès, mon train est annulé à cause d’une panne technique, donc je prends le bus douze. Avec les dix minutes de marche, je devrais arriver à l’atelier vers onze heures vingt, soit cinq minutes après le début. Si le bus est complet, je prendrai le suivant et j’arriverai vers onze heures trente-cinq. Je te tiens au courant dès que je monte dans le bus.',
    modelMeaning: 'Hi Inès, my train is cancelled because of a technical fault, so I am taking bus twelve. With the ten-minute walk, I should arrive at the workshop around eleven twenty, five minutes after the start. If the bus is full, I will take the next one and arrive around eleven thirty-five. I’ll keep you updated as soon as I get on the bus.',
    check: 'Did you give the cause and both workshop arrival times, including the walk, then say when you will update Inès? Use present after si and a future result.',
  },
};
