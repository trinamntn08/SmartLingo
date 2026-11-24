export type SlangRegister = 'informal' | 'slang' | 'vulgar';

export type SlangSeed = readonly [
  key: string,
  target: string,
  meaning: string,
  example: string,
  exampleMeaning: string,
  note: string,
  register?: Exclude<SlangRegister, 'informal'>,
  textAbbreviation?: true,
];

export const slangCategories = {
  conversation: 'Small talk',
  reactions: 'Reactions',
  friends: 'Friends & people',
  plans: 'Making plans',
  food: 'Food & drinks',
  work: 'Work & study',
  trouble: 'Everyday problems',
  emotions: 'Moods & feelings',
  errands: 'Around town',
  messages: 'Calls & messages',
  verlan: 'Verlan',
  strong: 'Strong language',
};

export type SlangCategory = keyof typeof slangCategories;

export type SlangExpression = {
  id: string;
  sourceEntryId: string;
  category: SlangCategory;
  target: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  note: string;
  register: SlangRegister;
  textAbbreviation: boolean;
};
