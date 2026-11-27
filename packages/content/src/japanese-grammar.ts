import type { Lesson } from '@smartlingo/domain';

// Brief study notes for the bundled draft revisions. Original lesson payloads remain versioned separately.
export const japaneseBriefGrammar: Readonly<Partial<Record<string, Lesson['grammar']>>> = {
  'ja.lesson.day-1@1': {
    title: 'Ask for a slower repeat',
    explanation: 'Put もう一度 (again) and ゆっくり (slowly) before お願いします. もう一度ゆっくりお願いします means “Please say it again slowly.”',
  },
  'ja.lesson.day-1.words-2@1': {
    title: 'Ask for a reading',
    explanation: 'Noun + の links two nouns. この漢字の読み方 means “the reading of this kanji.” Add は何ですか to ask what it is.',
  },
  'ja.lesson.day-1.words-3@1': {
    title: 'Name the object before を',
    explanation: 'Put を after the object. ペンを貸してください means “Please lend me a pen.” Say を like o.',
  },
  'ja.lesson.day-1.words-4@1': {
    title: 'Choose meaning or written support',
    explanation: 'は marks the topic in この言葉はどういう意味ですか (“What does this word mean?”). ここに書いてください means “Please write it here.”',
  },
  'ja.lesson.day-1.words-5@1': {
    title: 'Say when you’ll meet again',
    explanation: 'Add a time after また to say when you will meet again. また明日 means “See you tomorrow.”',
  },
  'ja.lesson.day-2@1': {
    title: 'Name and origin',
    explanation: 'Name + です introduces you. Place + から来ました gives your origin: フランスから来ました (“I’m from France”). Use さん for the other person.',
  },
  'ja.lesson.day-2.words-2@1': {
    title: 'Identify origin with 出身です',
    explanation: 'Place + 出身です gives your origin. フランス出身です means “I’m from France.” Place + に住んでいます says where you live.',
  },
  'ja.lesson.day-2.words-3@1': {
    title: 'Roles with です, places with で',
    explanation: '会社員です means “I’m an office worker.” Use で for where an action happens: 学校で勉強します (“I study at school”).',
  },
  'ja.lesson.day-2.words-4@1': {
    title: 'Who with, and where',
    explanation: 'With 住んでいます (live), use と for people and に for places: 家族と住んでいます (“I live with my family”).',
  },
  'ja.lesson.day-2.words-5@1': {
    title: 'Hobbies and likes',
    explanation: 'Use が before 好きです: 音楽が好きです means “I like music.” Replace が with も to say “also.”',
  },
  'ja.lesson.day-3@1': {
    title: 'Order with を and ください',
    explanation: 'Use item + を + quantity + ください. パンを二つください means “Two pieces of bread, please.” Read を as o and 二つ as ふたつ.',
  },
  'ja.lesson.day-3.words-2@1': {
    title: 'A product and a quantity',
    explanation: 'Order with item + を + quantity + ください. 水を一本ください means “One bottle of water, please.” Read 一本 as いっぽん.',
  },
  'ja.lesson.day-3.words-3@1': {
    title: 'Find a department with の',
    explanation: 'Use の to link a product to its department: パンの売り場 (“bread section”). Add はどこですか to ask where it is.',
  },
  'ja.lesson.day-3.words-4@1': {
    title: 'Choose the right counter',
    explanation: 'Use 一枚 (いちまい) for one flat item, 一本 (いっぽん) for one long item, and 一個 (いっこ) for one small item.',
  },
  'ja.lesson.day-3.words-5@1': {
    title: 'Payment method with で',
    explanation: 'Put で after the payment method. カードで払えますか means “Can I pay by card?”',
  },
  'ja.lesson.day-4@1': {
    title: 'Ask where and when',
    explanation: 'Place + はどこですか asks where it is. 何時から asks when something starts. 九時から means “from nine.”',
  },
  'ja.lesson.day-4.words-2@1': {
    title: 'Describe the route with 道を',
    explanation: 'を can mark the route you follow. この道をまっすぐ行ってください means “Please go straight along this road.”',
  },
  'ja.lesson.day-4.words-3@1': {
    title: 'Landmark + の + position',
    explanation: 'Link a landmark to a position with の. 駅の前 is “in front of the station” and 店の隣 is “next to the shop.”',
  },
  'ja.lesson.day-4.words-4@1': {
    title: 'Name the direction before the platform',
    explanation: 'Direction + のホーム gives the platform for that direction. 東京方面のホーム means “the platform for trains toward Tokyo.”',
  },
  'ja.lesson.day-4.words-5@1': {
    title: 'Clock time versus elapsed time',
    explanation: '一時 is one o’clock. 一時間 is one hour. Put 半 after the hour for “half past”: 九時半 (9:30).',
  },
  'ja.lesson.day-5@1': {
    title: 'Time, place and polite verbs',
    explanation: 'Use に for clock times and で for where an action happens. ます is positive. あまり + ません means “not much” or “not often.”',
  },
  'ja.lesson.day-5.words-2@1': {
    title: 'Body parts and を',
    explanation: 'Put を after the body part: 顔を洗います (“I wash my face”). 歯も磨きます means “I also brush my teeth.”',
  },
  'ja.lesson.day-5.words-3@1': {
    title: 'Travel with で, board with に',
    explanation: 'Use で for transport and に for what you board. 電車で通勤します means “I commute by train.” 電車に乗ります means “I board a train.”',
  },
  'ja.lesson.day-5.words-4@1': {
    title: 'A routine or a future action',
    explanation: 'ます can describe a habit or a future action. 今日は六時に帰ります means “I’ll go home at six today.”',
  },
  'ja.lesson.day-5.words-5@1': {
    title: 'Set the time as a topic',
    explanation: 'Use は to contrast times: 平日は (“on weekdays”) and 週末は (“on weekends”). 週末も means “on weekends too.”',
  },
  'ja.lesson.day-6@1': {
    title: 'Past actions and requests',
    explanation: 'Polite past verbs use ました or ませんでした. Use te-form + ください for requests: 見せてください means “Please show me.”',
  },
  'ja.lesson.day-6.words-2@1': {
    title: 'Past verbs and adjectives',
    explanation: 'The polite verb past ends in ました: 行きました (“went”). For 楽しい, change final い to かった: 楽しかったです (“It was fun”).',
  },
  'ja.lesson.day-6.words-3@1': {
    title: 'Then is not because',
    explanation: 'その後 means “after that.” In その後、公園を歩きました (“After that, I walked through the park”), を marks the route.',
  },
  'ja.lesson.day-6.words-4@1': {
    title: 'Report the loss without guessing',
    explanation: 'なくしました means “I lost it.” 落としました means “I dropped it.” 電車に傘を忘れました means “I left my umbrella on the train.”',
  },
  'ja.lesson.day-6.words-5@1': {
    title: 'Request an action with the te-form',
    explanation: 'Add ください to the te-form to request an action. 書く becomes 書いて, so 書いてください means “Please write.”',
  },
  'ja.lesson.day-7@1': {
    title: 'Ask permission with the te-form',
    explanation: 'Use te-form + もいいですか for permission: 使ってもいいですか (“May I use it?”). Dictionary form + 予定です states a plan: 行く予定です (“I plan to go”).',
  },
  'ja.lesson.day-7.words-2@1': {
    title: 'A plan with a dictionary-form verb',
    explanation: 'Use the dictionary form before 予定です. 行く予定です means “I plan to go.”',
  },
  'ja.lesson.day-7.words-3@1': {
    title: 'From a start to an end',
    explanation: 'から marks the start and まで marks the end. 九時から六時まで means “from nine until six.”',
  },
  'ja.lesson.day-7.words-4@1': {
    title: 'Ask before doing it',
    explanation: 'Te-form + もいいですか asks permission for your own action. 借りてもいいですか means “May I borrow it?”',
  },
  'ja.lesson.day-7.words-5@1': {
    title: 'Say what is required',
    explanation: 'Item + が必要です says it is needed. 予約が必要です means “A reservation is required.” Replace が with も for “also.”',
  },
  'ja.lesson.day-8@1': {
    title: 'Give a reason with ので',
    explanation: 'ので means “because”: 寒いので (“because it’s cold”). Add な after nouns and na-adjectives: 静かなので (“because it’s quiet”).',
  },
  'ja.lesson.day-8.words-2@1': {
    title: 'Identify the item before the symptom',
    explanation: 'Use が to name what has the problem. お湯が出ません means “No hot water comes out.”',
  },
  'ja.lesson.day-8.words-3@1': {
    title: 'Report a stain or smell',
    explanation: 'Location + に + thing + があります says what is there. シーツに汚れがあります means “There’s a stain on the sheet.” においがします means “There’s a smell.”',
  },
  'ja.lesson.day-8.words-4@1': {
    title: 'Name the detail to check',
    explanation: 'Name the issue with が: 金額が違います means “The amount is wrong.” Add 確認をお願いします to ask for a check.',
  },
  'ja.lesson.day-8.words-5@1': {
    title: 'Until or by a deadline',
    explanation: 'まで means “until.” までに means “by” a deadline. いつまでに終わりますか means “By when will it be finished?”',
  },
  'ja.lesson.day-9@1': {
    title: 'Compare with より',
    explanation: 'AはBより安いです means “A is cheaper than B.” より follows the item you compare against. Change ます to ませんか to invite someone.',
  },
  'ja.lesson.day-9.words-2@1': {
    title: 'A negative question can invite',
    explanation: 'Change ます to ませんか for a polite invitation. 見ませんか means “Would you like to watch?”',
  },
  'ja.lesson.day-9.words-3@1': {
    title: 'Describe before comparing',
    explanation: 'Use な after 静か before a noun: 静かな雰囲気 (“a quiet atmosphere”). An i-adjective attaches directly: 近い公園 (“a nearby park”).',
  },
  'ja.lesson.day-9.words-4@1': {
    title: 'Distinguish time and place',
    explanation: 'Use time + に and place + で for an action. 二時に入口で会います means “We’ll meet at the entrance at two.”',
  },
  'ja.lesson.day-9.words-5@1': {
    title: 'Decline one option clearly',
    explanation: '日曜日は無理です declines Sunday. Use noun + にしましょう to suggest an alternative: また今度にしましょう (“Let’s do it another time”).',
  },
  'ja.lesson.day-10@1': {
    title: 'Describe a past experience',
    explanation: '〜たことがあります means you’ve done something before. Use ordinary past for a dated event. 〜てくれました says someone did something for you.',
  },
  'ja.lesson.day-10.words-2@1': {
    title: 'Anchor an account in the past',
    explanation: '旅行しました reports a completed trip. 旅行したことがあります describes an experience at an unspecified time. Add 先月 to place a trip last month.',
  },
  'ja.lesson.day-10.words-3@1': {
    title: 'Searching is not finding',
    explanation: '探しました means “I looked for it.” 見つかりました means “It turned up.” 〜てくれる describes someone doing something for you.',
  },
  'ja.lesson.day-10.words-4@1': {
    title: 'Use connectors for real relationships',
    explanation: 'その後 means “after that,” ようやく means “finally” after a wait, and 結局 means “in the end.”',
  },
  'ja.lesson.day-10.words-5@1': {
    title: 'Turn an event into a lesson',
    explanation: 'Use a dictionary-form verb + 前に for “before” an action: 降りる前に (“before getting off”). 〜と学びました reports what you learned.',
  },
  'ja.lesson.day-11@1': {
    title: 'Say what you think',
    explanation: 'Put a plain clause before と思います (“I think”). Use だ after nouns and na-adjectives: 必要だと思います (“I think it’s necessary”).',
  },
  'ja.lesson.day-11.words-2@1': {
    title: 'State a benefit as a complete idea',
    explanation: 'Add こと to make a clause work like a noun. 移動がないこと means “the fact that there’s no travel.” Use だ before と思います here.',
  },
  'ja.lesson.day-11.words-3@1': {
    title: 'Agree with a defined proposal',
    explanation: 'Use に to name the proposal: 案に賛成です (“I support the proposal”). Add は for contrast: その案には. 〜なら makes agreement conditional.',
  },
  'ja.lesson.day-11.words-4@1': {
    title: 'Not necessarily is not never',
    explanation: 'Pair 必ずしも with a negative: 必ずしも便利ではありません (“It isn’t necessarily convenient”). 〜とは限りません means “It isn’t always the case that…”',
  },
  'ja.lesson.day-11.words-5@1': {
    title: 'Set a condition to continue',
    explanation: '〜後に means “after.” よければ means “if it goes well.” Use it to make a decision to continue conditional.',
  },
  'ja.lesson.day-12@1': {
    title: 'Report instructions and ask',
    explanation: '〜ようにと書いてあります reports a written instruction. 〜かどうか means “whether or not,” as in エレベーターがあるかどうか (“whether there’s a lift”).',
  },
  'ja.lesson.day-12.words-2@1': {
    title: 'Keep different times separate',
    explanation: 'から marks a starting point. 受付は一時半からです means “Check-in starts at 1:30.” Check what each stated time refers to.',
  },
  'ja.lesson.day-12.words-3@1': {
    title: 'A deadline is not a start time',
    explanation: 'Use time + までに for a deadline and method + で for how. 木曜日の午後六時までにメールで送る means “Send by email by Thursday at six.”',
  },
  'ja.lesson.day-12.words-4@1': {
    title: 'A possible condition is not a forecast',
    explanation: '雨天の場合は and 雨なら mean “if it rains.” Use them to say what changes under that condition.',
  },
  'ja.lesson.day-12.words-5@1': {
    title: 'Report what the source actually says',
    explanation: 'Use だ after a noun before と書いてあります: 未定だと書いてあります means “It says it hasn’t been decided.”',
  },
  'ja.lesson.day-13@1': {
    title: 'Express a booking condition',
    explanation: 'Use 〜なら or 〜ば to set a condition. 参加できればA室を予約します means “If everyone can attend, I’ll book room A.”',
  },
  'ja.lesson.day-13.words-2@1': {
    title: 'A preference is not a booking',
    explanation: '希望しています means “we’d like.” 空きがあるか means “whether a room is available.” まだ確認していません means “we haven’t checked yet.”',
  },
  'ja.lesson.day-13.words-3@1': {
    title: 'To one hour or by one hour',
    explanation: '一時間に短縮する means “shorten to one hour.” 一時間短縮する means “shorten by one hour.” に marks the resulting duration.',
  },
  'ja.lesson.day-13.words-4@1': {
    title: 'Included costs and additional costs',
    explanation: '料金に含まれていますか means “Is it included in the price?” 追加で introduces an additional amount.',
  },
  'ja.lesson.day-13.words-5@1': {
    title: 'Booked or will book',
    explanation: '予約しました means “I booked it.” 予約します means “I’ll book it.” 〜ておきます says you’ll do something in advance.',
  },
  'ja.greetings.hello@1': {
    title: 'また + a time',
    explanation: 'また means “again.” Add a time to make a farewell: また明日 means “See you tomorrow.”',
  },
  'ja.greetings.courtesy@1': {
    title: 'Open a request politely',
    explanation: 'Say すみません (“Excuse me”) before asking and ありがとうございます (“Thank you”) after.',
  },
  'ja.introductions.name@1': {
    title: 'Your name + です',
    explanation: 'Add です after your name: エマです means “I’m Emma.” Leave out “I” when it’s clear you mean yourself.',
  },
  'ja.cafe.drinks@1': {
    title: 'Order with を and ください',
    explanation: 'Use drink + を + quantity + ください. コーヒーを一つください means “One coffee, please.”',
  },
};
