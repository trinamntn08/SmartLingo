import type { TopicDraft } from '../build-topic';

export const householdWasteTopic: TopicDraft = {
  slug: 'household-waste', title: 'Sorting and disposing of household waste', role: 'Resident',
  provenance: {
    author: 'Original SmartLingo AI-assisted draft, 2026-11-23',
    rights: 'Original text and existing bundled study artwork.',
    review: 'Owner review required for French, English, estimated levels, and activities. Dialogue details are examples. Follow local collection instructions.',
  },
  lessons: [
    {
      slug: 'sorting', title: 'Ask where to put packaging', level: 'A1', outcome: 'Ask which bin a piece of packaging goes in and check a sorting sign.',
      words: [
        ['package', 'un emballage', 'a piece of packaging', 'Où est-ce que je mets cet emballage ?', 'Where do I put this packaging?', 'The plural les emballages is common on sorting signs.', { gender: 'masculine' }],
        ['sorting-bin', 'un bac de tri', 'a sorting bin', 'Le bac de tri est dans la cour.', 'The sorting bin is in the courtyard.', 'Le tri means sorting.', { gender: 'masculine' }],
        ['sorting-sign', 'une consigne de tri', 'a sorting instruction', 'Je lis les consignes de tri sur le bac.', 'I’m reading the sorting instructions on the bin.', 'Consigne means an instruction to follow.', { gender: 'feminine' }],
        ['cardboard-box', 'une boîte en carton', 'a cardboard box', 'J’ai une boîte en carton à jeter.', 'I have a cardboard box to throw away.', 'Use en to indicate the material.', { gender: 'feminine' }],
        ['empty-package', 'un emballage vide', 'empty packaging', 'C’est un emballage vide.', 'It’s empty packaging.', 'Vide means empty.', { gender: 'masculine' }],
        ['sort-waste', 'trier ses déchets', 'to sort one’s rubbish', 'Dans cet immeuble, on trie ses déchets dans la cour.', 'In this building, people sort their rubbish in the courtyard.', 'Trier means separate into categories.'],
      ],
      dialogue: [
        { role: 'Resident', target: 'Bonjour, je mets cette boîte dans quel bac ?', meaning: 'Hello, which bin do I put this box in?' },
        { role: 'Neighbour', target: 'Dans le bac de tri. Les consignes sont sur le bac.', meaning: 'In the sorting bin. The instructions are on the bin.' },
        { role: 'Resident', target: 'D’accord, merci !', meaning: 'All right, thank you!' },
      ],
      grammar: { title: 'Dans quel bac ?', explanation: 'Use quel before a masculine noun and quelle before a feminine noun. In everyday speech, the question phrase can come at the end.' },
      sentence: { tokens: ['dans quel bac', 'cette boîte', 'je mets'], answer: 'Je mets cette boîte dans quel bac', alternatives: ['Dans quel bac je mets cette boîte'], meaning: 'Which bin do I put this box in?', hint: 'Try starting with Je mets, then say what you are putting in the bin.', explanation: 'Dans quel bac asks for the correct bin. Quel agrees with the masculine noun bac.' },
    },
    {
      slug: 'glass', title: 'Find the glass collection point', level: 'A1', outcome: 'Ask where to take a glass jar or bottle.',
      words: [
        ['glass-jar', 'un bocal', 'a jar', 'J’ai un bocal de confiture vide.', 'I have an empty jam jar.', 'The plural is des bocaux.', { gender: 'masculine' }],
        ['glass-bottle', 'une bouteille en verre', 'a glass bottle', 'J’apporte les bouteilles en verre.', 'I’m taking the glass bottles.', 'En verre describes the material.', { gender: 'feminine' }],
        ['lid', 'un couvercle', 'a lid', 'Retirez le couvercle du bocal.', 'Remove the lid from the jar.', 'A couvercle can be the lid of many kinds of container.', { gender: 'masculine' }],
        ['glass-bank', 'un conteneur à verre', 'a glass recycling container', 'Le conteneur à verre est près du parc.', 'The glass recycling container is near the park.', 'You may also see borne à verre on local signs.', { gender: 'masculine' }],
        ['drop-point', 'un point de collecte', 'a collection point', 'Il y a un point de collecte derrière le marché.', 'There’s a collection point behind the market.', 'Check the sign to see what the collection point accepts.', { gender: 'masculine' }],
        ['without-lid', 'sans couvercle', 'without a lid', 'Sur cette affiche, il est écrit « bocaux sans couvercle ».', 'This sign says “jars without lids.”', 'Sans introduces something that is absent.'],
      ],
      dialogue: [
        { role: 'Resident', target: 'Excusez-moi, où est le conteneur à verre ?', meaning: 'Excuse me, where’s the glass recycling container?' },
        { role: 'Neighbour', target: 'Derrière le marché, à côté du parc.', meaning: 'Behind the market, next to the park.' },
        { role: 'Resident', target: 'Merci ! Je vais y apporter mes bocaux.', meaning: 'Thanks! I’ll take my jars there.' },
      ],
      grammar: { title: 'Où est… ?', explanation: 'Ask Où est + a singular place or thing. Use Où sont + a plural noun to ask where several things are.' },
      sentence: { tokens: ['le conteneur à verre', 'est', 'Où'], answer: 'Où est le conteneur à verre', meaning: 'Where is the glass recycling container?', hint: 'Use Où first, followed by est.', explanation: 'Est agrees with the singular noun conteneur.' },
    },
    {
      slug: 'collection', title: 'Check the bin collection day', level: 'A1', outcome: 'Ask when the rubbish is collected and when to put the bin out.',
      words: [
        ['bin', 'une poubelle', 'a rubbish bin', 'La poubelle de l’immeuble est pleine.', 'The building’s rubbish bin is full.', 'Poubelle can refer to an indoor or outdoor rubbish bin.', { gender: 'feminine' }],
        ['collection-day', 'un jour de collecte', 'a collection day', 'Le jour de collecte a changé.', 'The collection day has changed.', 'Collecte is the organised collection of waste.', { gender: 'masculine' }],
        ['bag', 'un sac-poubelle', 'a bin bag', 'Il me faut un sac-poubelle.', 'I need a bin bag.', 'You may also see sac poubelle without a hyphen.', { gender: 'masculine' }],
        ['put-out', 'sortir la poubelle', 'to put out the bin', 'On sort la poubelle le lundi soir.', 'We put the bin out on Monday evenings.', 'Here sortir takes an object, la poubelle.'],
        ['previous-evening', 'la veille au soir', 'the evening before', 'Sortez le bac la veille au soir.', 'Put the bin out the evening before.', 'La veille means the day before the event being discussed.'],
        ['every-tuesday', 'tous les mardis', 'every Tuesday', 'Ici, la collecte a lieu tous les mardis.', 'Here, collection takes place every Tuesday.', 'The day takes an s after tous les.'],
      ],
      dialogue: [
        { role: 'Resident', target: 'Vous savez quel jour ils passent ?', meaning: 'Do you know what day they come by?' },
        { role: 'Neighbour', target: 'Tous les mardis. On sort la poubelle la veille au soir.', meaning: 'Every Tuesday. We put the bin out the evening before.' },
        { role: 'Resident', target: 'Donc le lundi soir. Merci !', meaning: 'So on Monday evening. Thanks!' },
      ],
      grammar: { title: 'Talk about a repeating day', explanation: 'Le lundi soir and tous les lundis soir both describe a regular Monday evening routine. Lundi soir alone can refer to a specific Monday evening.' },
      sentence: { tokens: ['le lundi soir', 'la poubelle', 'sort', 'On'], answer: 'On sort la poubelle le lundi soir', alternatives: ['Le lundi soir on sort la poubelle'], meaning: 'We put the bin out on Monday evenings.', hint: 'Build On sort la poubelle, then add the regular time.', explanation: 'Le lundi soir describes a recurring time and can also go first.' },
    },
    {
      slug: 'compost', title: 'Ask how to use a shared compost bin', level: 'A2', outcome: 'Ask whether the shared compost bin takes a particular food scrap.',
      words: [
        ['food-scraps', 'des déchets alimentaires', 'food waste', 'Où peut-on déposer les déchets alimentaires ?', 'Where can we drop off food waste?', 'Alimentaires means related to food.', { gender: 'masculine' }],
        ['compost-bin', 'un composteur', 'a compost bin', 'Il y a un composteur partagé dans la cour.', 'There’s a shared compost bin in the courtyard.', 'Partagé means shared.', { gender: 'masculine' }],
        ['peelings', 'des épluchures', 'peelings', 'J’ai des épluchures de carottes.', 'I have some carrot peelings.', 'Éplucher means to peel.', { gender: 'feminine' }],
        ['coffee-grounds', 'du marc de café', 'some used coffee grounds', 'Est-ce que le composteur accepte le marc de café ?', 'Does the compost bin take used coffee grounds?', 'Here, marc refers to the grounds left after brewing.', { gender: 'masculine' }],
        ['allowed', 'être accepté', 'to be accepted', 'Ces restes ne sont pas acceptés dans ce composteur.', 'These leftovers aren’t accepted in this compost bin.', 'The ending agrees with what is accepted.'],
        ['on-site', 'sur place', 'on site', 'Les consignes sont affichées sur place.', 'The instructions are posted on site.', 'This means at the location under discussion.'],
      ],
      dialogue: [
        { role: 'Resident', target: 'Est-ce que je peux mettre des épluchures ici ?', meaning: 'Can I put peelings in here?' },
        { role: 'Neighbour', target: 'Oui. Pour les autres restes, regarde les consignes sur place.', meaning: 'Yes. For other leftovers, look at the instructions on site.' },
        { role: 'Resident', target: 'Entendu. Je vais lire l’affiche avant de les déposer.', meaning: 'Got it. I’ll read the sign before dropping them off.' },
      ],
      grammar: { title: 'Est-ce que je peux… ?', explanation: 'Use Est-ce que je peux before an infinitive to ask if an action is allowed. This works even when you have never used the facility before.' },
      sentence: { tokens: ['ici', 'des épluchures', 'mettre', 'Est-ce que je peux'], answer: 'Est-ce que je peux mettre des épluchures ici', meaning: 'Can I put peelings in here?', hint: 'Begin with Est-ce que je peux. Put mettre before the thing you want to put in.', explanation: 'Mettre is the action. Ici tells the listener which place you mean.' },
    },
    {
      slug: 'bulky-items', title: 'Arrange disposal of a bulky item', level: 'A2', outcome: 'Ask about collecting a bulky item and confirm the time and place.',
      words: [
        ['bulky-waste', 'les encombrants', 'bulky waste', 'Je voudrais connaître le jour de collecte des encombrants.', 'I’d like to know the bulky-waste collection day.', 'Use the plural for this service category.', { gender: 'masculine' }],
        ['waste-centre', 'une déchèterie', 'a household waste collection centre', 'Est-ce que je peux apporter ce fauteuil à la déchèterie ?', 'Can I take this armchair to the waste collection centre?', 'You may also see the spelling déchetterie.', { gender: 'feminine' }],
        ['collection', 'un enlèvement', 'a pickup', 'Je voudrais demander un enlèvement pour un matelas.', 'I’d like to request a pickup for a mattress.', 'Here, an enlèvement is an arranged collection.', { gender: 'masculine' }],
        ['mattress', 'un matelas', 'a mattress', 'Nous avons un matelas à faire enlever.', 'We have a mattress that needs collecting.', 'The written plural is also matelas.', { gender: 'masculine' }],
        ['street-edge', 'au bord du trottoir', 'at the kerb', 'Dois-je déposer le matelas au bord du trottoir ?', 'Should I put the mattress at the kerb?', 'Au bord de means at the edge of something.'],
        ['booking-only', 'sur rendez-vous', 'by appointment', 'Dans cette commune, l’enlèvement se fait sur rendez-vous.', 'In this municipality, pickup is by appointment.', 'This is common in service notices.'],
      ],
      dialogue: [
        { role: 'Resident', target: 'Bonjour. Je voudrais demander un enlèvement pour un matelas.', meaning: 'Hello. I’d like to request a pickup for a mattress.' },
        { role: 'Collection agent', target: 'Je peux vous proposer jeudi matin.', meaning: 'I can offer you Thursday morning.' },
        { role: 'Resident', target: 'Dois-je déposer le matelas au bord du trottoir ?', meaning: 'Should I put the mattress at the kerb?' },
        { role: 'Collection agent', target: 'Oui, avant huit heures, en laissant le passage libre.', meaning: 'Yes, before eight, leaving room for people to pass.' },
      ],
      grammar: { title: 'Dois-je… ? in a service call', explanation: 'Dois-je déposer… ? asks what you are expected to do. In speech, Est-ce que je dois déposer… ? asks the same question with a different word order.' },
      sentence: { tokens: ['pour un matelas', 'un enlèvement', 'demander', 'Je voudrais'], answer: 'Je voudrais demander un enlèvement pour un matelas', meaning: 'I’d like to request a pickup for a mattress.', hint: 'Start with Je voudrais, then use the verb demander.', explanation: 'Un enlèvement names the service, and pour un matelas says what needs pickup.' },
    },
  ],
};
