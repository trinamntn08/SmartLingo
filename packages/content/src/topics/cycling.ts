import type { TopicDraft } from '../build-topic';

export const cyclingTopic: TopicDraft = {
  slug: 'cycling', title: 'Getting around by bike', role: 'Cyclist',
  provenance: {
    author: 'Original SmartLingo AI-assisted draft, 2026-11-23',
    rights: 'Original text and existing bundled study artwork.',
    review: 'Owner review required for French, English, estimated levels, and activities.',
  },
  lessons: [
    {
      slug: 'rent', title: 'Rent a bike for the day', level: 'A1', outcome: 'Ask for a rental bike and check when to bring it back.',
      words: [
        ['bike', 'un vélo', 'a bicycle', 'Je vais au travail à vélo.', 'I go to work by bicycle.', 'Use à vélo.', { gender: 'masculine' }],
        ['rental', 'une location', 'a rental', 'Combien coûte la location pour la journée ?', 'How much does the rental cost for the day?', 'Here, location means rental.', { gender: 'feminine' }],
        ['rent-bike', 'louer un vélo', 'to rent a bike', 'Je voudrais louer un vélo pour la journée.', 'I’d like to rent a bike for the day.', 'Use louer for a paid rental.'],
        ['for-the-day', 'pour la journée', 'for the day', 'C’est vingt euros pour la journée.', 'It’s twenty euros for the day.', 'Pour introduces the planned duration.'],
        ['helmet', 'un casque', 'a helmet', 'Vous avez un casque à ma taille ?', 'Do you have a helmet in my size?', 'À ma taille means in my size.', { gender: 'masculine' }],
        ['return-bike', 'rendre le vélo', 'to return the bike', 'À quelle heure faut-il rendre le vélo ?', 'What time do I need to return the bike?', 'Rendre returns something to its owner.'],
      ],
      dialogue: [
        { role: 'Cyclist', target: 'Bonjour, je voudrais louer un vélo pour la journée.', meaning: 'Hello, I’d like to rent a bike for the day.' },
        { role: 'Rental clerk', target: 'Bien sûr. Vous voulez un casque ?', meaning: 'Of course. Would you like a helmet?' },
        { role: 'Cyclist', target: 'Oui, merci. À quelle heure faut-il rendre le vélo ?', meaning: 'Yes, thank you. What time do I need to return the bike?' },
        { role: 'Rental clerk', target: 'Avant dix-huit heures, s’il vous plaît.', meaning: 'Before six in the evening, please.' },
      ],
      grammar: { title: 'Make a rental request', explanation: 'Put the infinitive louer after je voudrais. Add pour la journée to say how long you need the bike.' },
      sentence: { tokens: ['pour la journée', 'louer un vélo', 'Je voudrais'], answer: 'Je voudrais louer un vélo pour la journée', meaning: 'I’d like to rent a bike for the day.', hint: 'Begin with Je voudrais.', explanation: 'Say what you would like to do, then give the duration.' },
    },
    {
      slug: 'route', title: 'Find a route for cycling', level: 'A1', outcome: 'Ask about a bike lane and understand a route suggestion.',
      words: [
        ['cycle-lane', 'une piste cyclable', 'a cycle track', 'Il y a une piste cyclable le long du canal.', 'There is a cycle track along the canal.', 'Use cyclable for something designed for cycling.', { gender: 'feminine' }],
        ['along', 'le long de', 'along', 'Roulez le long de la rivière.', 'Ride along the river.', 'De + le becomes du, as in le long du canal.'],
        ['canal', 'un canal', 'a canal', 'Le canal est à gauche.', 'The canal is on the left.', 'The plural is des canaux.', { gender: 'masculine' }],
        ['slope', 'une montée', 'an uphill stretch', 'Il y a une montée après le pont.', 'There’s an uphill stretch after the bridge.', 'Compare une descente, a downhill stretch.', { gender: 'feminine' }],
        ['flat-route', 'un trajet plat', 'a flat route', 'Je préfère un trajet plat.', 'I prefer a flat route.', 'Plat agrees with the masculine noun trajet.', { gender: 'masculine' }],
        ['ride', 'rouler à vélo', 'to ride a bike', 'On peut rouler à vélo le long du canal.', 'You can ride a bike along the canal.', 'À vélo tells you the mode of travel.'],
      ],
      dialogue: [
        { role: 'Cyclist', target: 'Il y a une piste cyclable près d’ici ?', meaning: 'Is there a cycle track near here?' },
        { role: 'Resident', target: 'Oui, le long du canal. Le trajet est plat.', meaning: 'Yes, along the canal. The route is flat.' },
        { role: 'Cyclist', target: 'Parfait, merci !', meaning: 'Perfect, thank you!' },
      ],
      grammar: { title: 'Ask if there is a route', explanation: 'Use Il y a to say there is. In conversation, you can keep the same word order and raise your voice at the end to ask a question.' },
      sentence: { tokens: ['près d’ici', 'une piste cyclable', 'Il y a'], answer: 'Il y a une piste cyclable près d’ici', meaning: 'Is there a cycle track near here?', hint: 'Start with Il y a. Put the location last.', explanation: 'Use a questioning tone with Il y a une piste cyclable près d’ici ?' },
    },
    {
      slug: 'parking', title: 'Find a place to lock your bike', level: 'A1', outcome: 'Ask where to park and describe how you will lock the bike.',
      words: [
        ['lock', 'un antivol', 'a bike lock', 'J’ai un antivol dans mon sac.', 'I have a bike lock in my bag.', 'Here, antivol means the lock you use to secure a bike.', { gender: 'masculine' }],
        ['rack', 'un arceau à vélos', 'a bike parking hoop', 'Il y a un arceau à vélos devant le magasin.', 'There is a bike parking hoop in front of the shop.', 'Look for a fixed metal hoop where you can lock a bike.', { gender: 'masculine' }],
        ['frame', 'le cadre', 'the bike frame', 'J’attache le cadre à l’arceau.', 'I secure the frame to the hoop.', 'Here, le cadre is the main structure of a bicycle.', { gender: 'masculine' }],
        ['wheel', 'une roue', 'a wheel', 'L’antivol passe dans la roue avant.', 'The lock goes through the front wheel.', 'Roue avant is front wheel.', { gender: 'feminine' }],
        ['lock-bike', 'attacher son vélo', 'to lock up one’s bike', 'Où est-ce que je peux attacher mon vélo ?', 'Where can I lock up my bike?', 'Change son to mon when you mean your own bike and are speaking about yourself.'],
        ['key', 'la clé de l’antivol', 'the key to the bike lock', 'J’ai la clé de l’antivol.', 'I have the key to the bike lock.', 'De l’antivol specifies which key.', { gender: 'feminine' }],
      ],
      dialogue: [
        { role: 'Cyclist', target: 'Où est-ce que je peux attacher mon vélo ?', meaning: 'Where can I lock up my bike?' },
        { role: 'Shopkeeper', target: 'Il y a un arceau à vélos devant le magasin.', meaning: 'There’s a bike parking hoop in front of the shop.' },
        { role: 'Cyclist', target: 'Merci. J’ai un antivol dans mon sac.', meaning: 'Thank you. I have a bike lock in my bag.' },
      ],
      grammar: { title: 'Où est-ce que je peux… ?', explanation: 'Use this question pattern to ask where you can do something. Put the action in the infinitive after je peux.' },
      sentence: { tokens: ['attacher mon vélo', 'je peux', 'Où est-ce que'], answer: 'Où est-ce que je peux attacher mon vélo', meaning: 'Where can I lock up my bike?', hint: 'Begin with the question phrase, then add je peux.', explanation: 'Attacher stays in the infinitive after je peux.' },
    },
    {
      slug: 'puncture', title: 'Explain a flat tyre', level: 'A2', outcome: 'Describe a flat tyre and ask a repair shop what can be fixed.',
      words: [
        ['tyre', 'un pneu', 'a tyre', 'Le pneu avant est à plat.', 'The front tyre is flat.', 'The plural is des pneus.', { gender: 'masculine' }],
        ['flat-tyre', 'un pneu crevé', 'a punctured tyre', 'J’ai un pneu crevé.', 'I have a punctured tyre.', 'Crevé tells the mechanic that the tyre has a puncture.', { gender: 'masculine' }],
        ['inner-tube', 'une chambre à air', 'an inner tube', 'Il faut changer la chambre à air.', 'The inner tube needs replacing.', 'This is the inflatable tube inside a tyre that uses one.', { gender: 'feminine' }],
        ['pump', 'une pompe à vélo', 'a bike pump', 'Vous avez une pompe à vélo ?', 'Do you have a bike pump?', 'À vélo specifies the kind of pump.', { gender: 'feminine' }],
        ['inflate', 'regonfler', 'to pump up again', 'Je peux regonfler le pneu ?', 'Can I pump the tyre up again?', 'Re- here means again.'],
        ['repair-puncture', 'réparer une crevaison', 'to fix a puncture', 'Vous pouvez réparer cette crevaison ?', 'Can you fix this puncture?', 'Une crevaison is a puncture.'],
      ],
      dialogue: [
        { role: 'Cyclist', target: 'Bonjour, j’ai un pneu crevé. Vous pouvez réparer cette crevaison ?', meaning: 'Hello, I have a punctured tyre. Can you fix this puncture?' },
        { role: 'Mechanic', target: 'Oui. Il faut changer la chambre à air.', meaning: 'Yes. The inner tube needs replacing.' },
        { role: 'Cyclist', target: 'D’accord, merci.', meaning: 'All right, thank you.' },
      ],
      grammar: { title: 'Il faut + infinitive', explanation: 'Use Il faut changer… to say what needs to be changed. This pattern focuses on the necessary action.' },
      sentence: { tokens: ['la chambre à air', 'changer', 'Il faut'], answer: 'Il faut changer la chambre à air', meaning: 'The inner tube needs replacing.', hint: 'Start with Il faut and follow it with the action.', explanation: 'Changer stays in the infinitive after Il faut.' },
    },
    {
      slug: 'service', title: 'Arrange a bike service', level: 'A2', outcome: 'Describe a fault and agree when to collect the bike.',
      words: [
        ['brake', 'un frein', 'a brake', 'Le frein arrière ne marche plus.', 'The rear brake no longer works.', 'Arrière means rear here.', { gender: 'masculine' }],
        ['chain', 'une chaîne', 'a bike chain', 'La chaîne fait du bruit.', 'The chain is making noise.', 'This is the chain that drives the wheel.', { gender: 'feminine' }],
        ['service', 'une révision', 'a maintenance check', 'Je voudrais prendre rendez-vous pour une révision.', 'I’d like to book a maintenance check.', 'In a workshop, une révision is a scheduled check and service.', { gender: 'feminine' }],
        ['fault', 'faire du bruit', 'to make noise', 'Mon vélo fait du bruit quand je pédale.', 'My bike makes noise when I pedal.', 'Introduce when the noise happens with quand.'],
        ['drop-off', 'déposer le vélo', 'to drop off the bike', 'Je peux déposer le vélo mardi matin.', 'I can drop off the bike on Tuesday morning.', 'Déposer means leave it with the workshop.'],
        ['pick-up', 'récupérer le vélo', 'to collect the bike', 'Je peux récupérer le vélo mercredi ?', 'Can I collect the bike on Wednesday?', 'Récupérer means pick up something you left there.'],
      ],
      dialogue: [
        { role: 'Cyclist', target: 'Je voudrais une révision. La chaîne fait du bruit.', meaning: 'I’d like a maintenance check. The chain is making noise.' },
        { role: 'Mechanic', target: 'Vous pouvez déposer le vélo mardi matin.', meaning: 'You can drop off the bike on Tuesday morning.' },
        { role: 'Cyclist', target: 'Je peux récupérer le vélo mercredi ?', meaning: 'Can I collect the bike on Wednesday?' },
        { role: 'Mechanic', target: 'Oui, après seize heures.', meaning: 'Yes, after four in the afternoon.' },
      ],
      grammar: { title: 'Quand describes when it happens', explanation: 'Add quand je pédale to say the problem occurs while you pedal. Use quand before a clause with a subject and verb.' },
      sentence: { tokens: ['quand je pédale', 'fait du bruit', 'Mon vélo'], answer: 'Mon vélo fait du bruit quand je pédale', meaning: 'My bike makes noise when I pedal.', hint: 'Give the problem before the clause that starts with quand.', explanation: 'Quand je pédale specifies the moment you hear the noise.' },
    },
  ],
};
