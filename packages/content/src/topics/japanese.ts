import type { Lesson } from '@smartlingo/domain';
import { buildTopic, type TopicDraft } from '../build-topic';
import { reuseSharedVocabulary } from '../shared-vocabulary';

const starterAliases = {
  'ja.greetings.hello': 'ja.greetings.konnichiwa',
  'ja.greetings.morning': 'ja.expansion.d1.ohayou',
  'ja.greetings.evening': 'ja.expansion.d1.konbanwa',
  'ja.greetings.see-you': 'ja.expansion.d1.mataashita',
  'ja.greetings.goodbye': 'ja.expansion.d1.sayounara',
  'ja.greetings.excuse-me': 'ja.repair.sumimasen',
  'ja.greetings.thank-you': 'ja.thanks.arigatou-gozaimasu',
  'ja.greetings.please-request': 'ja.politeness.onegaishimasu',
  'ja.greetings.yes': 'ja.expansion.d1.hai',
  'ja.greetings.no': 'ja.expansion.d1.iie',
  'ja.introductions.first-meeting': 'ja.introductions.hajimemashite',
  'ja.introductions.i': 'ja.introductions.watashi',
  'ja.introductions.name': 'ja.expansion.d2.namae',
  'ja.introductions.intro-closing': 'ja.introductions.yoroshiku',
  'ja.cafe.coffee': 'ja.expansion.d3.kohi',
  'ja.cafe.water': 'ja.expansion.d3.mizu',
  'ja.cafe.tea': 'ja.expansion.d3.ocha',
  'ja.cafe.one': 'ja.quantity.hitotsu',
  'ja.cafe.request': 'ja.shopping.kudasai',
};

const topics: TopicDraft[] = [
  {
    slug: 'greetings', title: 'Everyday greetings', role: 'Neighbour',
    lessons: [
      {
        slug: 'hello', title: 'Say hello and goodbye', level: 'foundation', outcome: 'Choose a greeting for the time of day and say goodbye politely.',
        words: [
          ['hello', 'こんにちは', 'hello (daytime)', 'こんにちは、田中さん。', 'Hello, Tanaka.', 'The last は is pronounced wa in this greeting.', { reading: 'こんにちは', picture: 'greeting' }],
          ['morning', 'おはようございます', 'good morning (polite)', 'おはようございます、田中さん。', 'Good morning, Tanaka.', 'Use the full greeting with staff or people you do not know well.', { reading: 'おはようございます' }],
          ['evening', 'こんばんは', 'good evening', 'こんばんは、田中さん。', 'Good evening, Tanaka.', 'The last は is pronounced wa.', { reading: 'こんばんは' }],
          ['see-you', 'また明日', 'see you tomorrow', 'では、また明日。', 'Well, see you tomorrow.', 'また means again. Add 明日 for tomorrow.', { reading: 'またあした' }],
          ['goodbye', 'さようなら', 'goodbye', '先生、さようなら。', 'Goodbye, teacher.', 'A familiar school farewell. また明日 often sounds more natural if you will meet the person again tomorrow.', { reading: 'さようなら' }],
          ['name-suffix', 'さん', 'polite suffix after someone’s name', '田中さん、こんにちは。', 'Hello, Tanaka.', 'Add さん after the other person’s name. Leave it off your own name.', { reading: 'さん', exampleReading: 'たなかさん、こんにちは。' }],
        ],
        dialogue: [
          { role: 'Neighbour', target: 'こんにちは、田中さん。', reading: 'こんにちは、たなかさん。', meaning: 'Hello, Tanaka.' },
          { role: 'Tanaka', target: 'こんにちは。', reading: 'こんにちは。', meaning: 'Hello.' },
          { role: 'Neighbour', target: 'では、また明日。', reading: 'では、またあした。', meaning: 'Well, see you tomorrow.' },
        ],
        grammar: { title: 'また + a time', explanation: 'また means again. Pair it with a time to say when you will see the person again. また明日 is a common short farewell when you expect to meet tomorrow.' },
        sentence: { tokens: ['明日', 'また'], answer: 'また 明日', meaning: 'See you tomorrow.', hint: 'Begin with また (again).', explanation: 'また comes first in the set farewell また明日.' },
      },
      {
        slug: 'courtesy', title: 'Get attention and say thank you', level: 'foundation', outcome: 'Get someone’s attention politely and thank them for their help.',
        words: [
          ['excuse-me', 'すみません', 'excuse me / sorry', 'すみません、駅はどこですか。', 'Excuse me, where is the station?', 'Say すみません to get a stranger’s attention politely.', { reading: 'すみません', picture: 'please' }],
          ['thank-you', 'ありがとうございます', 'thank you (polite)', 'ありがとうございます。助かりました。', 'Thank you. That was a big help.', 'Use this full phrase when thanking someone you do not know well.', { reading: 'ありがとうございます', picture: 'thanks' }],
          ['please-request', 'お願いします', 'please (when requesting something)', 'これをお願いします。', 'This one, please.', 'This works when you point to the thing you want.', { reading: 'おねがいします' }],
          ['yes', 'はい', 'yes', 'はい、そうです。', 'Yes, that’s right.', 'はい can also signal that you are following what someone says.', { reading: 'はい' }],
          ['no', 'いいえ', 'no', 'いいえ、違います。', 'No, that’s different.', 'This is a direct no. For polite refusals, people also use softer phrases.', { reading: 'いいえ' }],
          ['helped', '助かりました', 'that was a big help', '道を教えてくれて、助かりました。', 'It was a big help that you gave me directions.', 'Use this after someone has made something easier for you.', { reading: 'たすかりました', exampleReading: 'みちをおしえてくれて、たすかりました。' }],
        ],
        dialogue: [
          { role: 'Neighbour', target: 'すみません、駅はどこですか。', reading: 'すみません、えきはどこですか。', meaning: 'Excuse me, where is the station?' },
          { role: 'Passer-by', target: 'あそこです。', reading: 'あそこです。', meaning: 'It’s over there.' },
          { role: 'Neighbour', target: 'ありがとうございます。', reading: 'ありがとうございます。', meaning: 'Thank you.' },
        ],
        grammar: { title: 'Open a request politely', explanation: 'Start with すみません when approaching someone. Use ありがとうございます after they help you.' },
        sentence: { tokens: ['ありがとうございます', '本当に'], answer: '本当に ありがとうございます', meaning: 'Thank you very much.', hint: '本当に means really. Put it before the thank-you phrase.', explanation: '本当に adds emphasis to ありがとうございます.' },
      },
    ],
  },
  {
    slug: 'introductions', title: 'First introductions', role: 'Newcomer',
    lessons: [
      {
        slug: 'name', title: 'Introduce yourself for the first time', level: 'foundation', outcome: 'Give your name, ask someone’s name politely, and finish a first introduction.',
        words: [
          ['first-meeting', 'はじめまして', 'nice to meet you (opening)', 'はじめまして。エマです。', 'Nice to meet you. I’m Emma.', 'Say this when meeting someone for the first time.', { reading: 'はじめまして', picture: 'greeting' }],
          ['i', '私', 'I / me', '私の名前はエマです。', 'My name is Emma.', 'You can leave out 私 when it is clear that you mean yourself.', { reading: 'わたし' }],
          ['name', '名前', 'name', '名前をここに書きます。', 'I write my name here.', 'お名前 is a polite way to refer to someone else’s name.', { reading: 'なまえ' }],
          ['to-be', 'です', 'am / is / are (polite ending)', 'エマです。', 'I’m Emma.', 'Put です after a name or noun in a polite statement.', { reading: 'です', exampleReading: 'エマです。' }],
          ['ask-name', 'お名前は何ですか', 'what is your name?', 'すみません、お名前は何ですか。', 'Excuse me, what is your name?', '何 is read なん before です in this question.', { reading: 'おなまえはなんですか', exampleReading: 'すみません、おなまえはなんですか。' }],
          ['intro-closing', 'よろしくお願いします', 'pleased to meet you (closing)', 'エマです。よろしくお願いします。', 'I’m Emma. Pleased to meet you.', 'This is a conventional way to close a first introduction and begin on friendly terms.', { reading: 'よろしくおねがいします' }],
        ],
        dialogue: [
          { role: 'Newcomer', target: 'はじめまして。エマです。よろしくお願いします。', reading: 'はじめまして。エマです。よろしくおねがいします。', meaning: 'Nice to meet you. I’m Emma. Pleased to meet you.' },
          { role: 'Tanaka', target: '田中です。こちらこそ、よろしくお願いします。', reading: 'たなかです。こちらこそ、よろしくおねがいします。', meaning: 'I’m Tanaka. Pleased to meet you, too.' },
        ],
        grammar: { title: 'Your name + です', explanation: 'Say your name and add です to introduce yourself politely. Japanese often leaves the subject unstated when the listener already knows who you mean.' },
        sentence: { tokens: ['です', 'エマ'], answer: 'エマ です', meaning: 'I’m Emma.', hint: 'Start with the name.', explanation: 'です follows the name in this polite introduction.' },
      },
    ],
  },
  {
    slug: 'cafe', title: 'Ordering at a café', role: 'Customer',
    lessons: [
      {
        slug: 'drinks', title: 'Order a drink at the counter', level: 'A1', outcome: 'Request one drink politely and recognise a question about your order.',
        words: [
          ['coffee', 'コーヒー', 'coffee', 'コーヒーを一つください。', 'One coffee, please.', 'The long marks ー lengthen the preceding vowels: kōhī.', { reading: 'コーヒー', picture: 'cup' }],
          ['water', '水', 'water', '水もください。', 'Water too, please.', 'Staff may call it お水.', { reading: 'みず', picture: 'water' }],
          ['tea', 'お茶', 'tea', '温かいお茶をください。', 'Hot tea, please.', 'お茶 often refers to green tea. 紅茶 means black tea.', { reading: 'おちゃ' }],
          ['one', '一つ', 'one item', 'これを一つお願いします。', 'One of these, please.', '一つ is a general way to count one thing.', { reading: 'ひとつ' }],
          ['request', 'ください', 'please give me…', 'お茶をください。', 'Tea, please.', 'Put を, pronounced o, after the thing you want, then say ください.', { reading: 'ください' }],
          ['takeaway', '持ち帰り', 'takeaway', '持ち帰りでお願いします。', 'To take away, please.', 'Staff may ask if your order is for 持ち帰り.', { reading: 'もちかえり', exampleReading: 'もちかえりでおねがいします。' }],
        ],
        dialogue: [
          { role: 'Server', target: 'ご注文は？', reading: 'ごちゅうもんは？', meaning: 'What would you like to order?' },
          { role: 'Customer', target: 'コーヒーを一つください。', reading: 'コーヒーをひとつください。', meaning: 'One coffee, please.' },
          { role: 'Server', target: 'お持ち帰りですか。', reading: 'おもちかえりですか。', meaning: 'Is that to take away?' },
          { role: 'Customer', target: 'はい、持ち帰りでお願いします。', reading: 'はい、もちかえりでおねがいします。', meaning: 'Yes, to take away, please.' },
        ],
        grammar: { title: 'Order with を and ください', explanation: 'Put the drink first, followed by を. Add a quantity if needed, then ください. In コーヒーを一つください, 一つ tells the server you want one.' },
        sentence: { tokens: ['ください', '一つ', 'コーヒーを'], answer: 'コーヒーを 一つ ください', meaning: 'One coffee, please.', hint: 'Start with コーヒーを (coffee + object marker).', explanation: '一つ gives the quantity before ください completes the request.' },
      },
    ],
  },
];

export function buildJapaneseStarter(existing: readonly Lesson[]): Lesson[] {
  const drafts = topics.flatMap(topic => buildTopic({
    ...topic, language: 'ja-JP',
    provenance: {
      author: 'Original SmartLingo AI-assisted draft, 2026-11-23.',
      rights: 'Original dialogues and exercises, with existing SmartLingo vocabulary where the sense has already been taught.',
      review: 'Draft requiring owner and qualified Japanese review of language, readings, translations, estimated levels and activities.',
    },
  }));
  return reuseSharedVocabulary(drafts, existing.flatMap(lesson => lesson.vocabulary), starterAliases);
}
