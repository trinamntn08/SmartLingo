import type { TargetLanguage } from '@smartlingo/domain';
import { japaneseListeningResources } from './japanese-resources';

export const listeningLevels = ['A1', 'A2', 'B1'] as const;
export type ListeningLevel = typeof listeningLevels[number];
export const listeningFormats = ['YouTube', 'Podcast', 'Video exercises'] as const;
export type ListeningFormat = typeof listeningFormats[number];

export interface ListeningResource {
  id: string;
  title: string;
  provider: string;
  levels: readonly ListeningLevel[];
  format: ListeningFormat;
  url: string;
  description: string;
  support: string;
  access: string;
  practice: string;
  levelNote: string;
  checkedOn: string;
}

// Link-only editorial recommendations. Evidence and access limits:
// docs/curriculum/listening-resource-sources.md. Not published lesson content.
export const listeningResources: readonly ListeningResource[] = [
  {
    id: 'tv5-premiere-classe', title: 'First steps with everyday videos', provider: 'TV5MONDE',
    levels: ['A1'], format: 'Video exercises',
    url: 'https://apprendre.tv5monde.com/fr/exercices/premiere-classe',
    description: 'Start with greetings, shopping and finding a home through guided video activities.',
    support: 'English interface available. Use the activity help; text support varies by video.',
    access: 'Free exercises. An account is used to track progress on TV5MONDE.',
    practice: 'Choose greetings. Listen for the speaker’s name and one greeting, then check with the activity.',
    levelNote: 'Provider beginner pathway; start here if spoken French is new.', checkedOn: '2026-11-19',
  },
  {
    id: 'super-easy-french', title: 'Super Easy French: slower everyday French', provider: 'Easy French',
    levels: ['A1', 'A2'], format: 'YouTube',
    url: 'https://www.youtube.com/playlist?list=PLA5UIoabheFMChKPAUUNNEOd7BobVJVoQ',
    description: 'Choose a familiar topic from the beginner video playlist.',
    support: 'French and English subtitles. Check whether the selected video’s text can be switched off.',
    access: 'Public videos; YouTube may show ads. Extra learning materials require membership.',
    practice: 'Watch one minute. Find three familiar expressions in the subtitles, then replay and listen for them.',
    levelNote: 'Suggested A1–A2 with subtitles. Start with basic vocabulary episodes; difficulty varies.', checkedOn: '2026-11-19',
  },
  {
    id: 'coffee-break-1', title: 'Coffee Break French: Season 1 audio', provider: 'Coffee Break Languages',
    levels: ['A1', 'A2'], format: 'Podcast',
    url: 'https://coffeebreaklanguages.com/tag/cbf-season-1/',
    description: 'Guided French listening with English teaching support, beginning with introductions.',
    support: 'English explanations in the audio. Full lesson notes are part of the paid course.',
    access: 'Free podcast; optional course materials cost extra.',
    practice: 'Start with lesson 1. Pause after a French question, answer aloud if you wish, then compare with the model.',
    levelNote: 'Provider A1–A2 sequence. Follow the order if you are starting from zero.', checkedOn: '2026-11-19',
  },
  {
    id: 'coffee-break-1-youtube', title: 'Coffee Break French: Season 1 on YouTube', provider: 'Coffee Break Languages',
    levels: ['A1', 'A2'], format: 'YouTube',
    url: 'https://www.youtube.com/playlist?list=PLZWuXTvhtMR39C_87zsAg-GiZVLObRg5b',
    description: 'The Season 1 podcast in a YouTube playlist, if you prefer that player.',
    support: 'English audio explanations. Check each video for captions; a corrected transcript is not guaranteed.',
    access: 'Public playlist; ads may appear. This is the same course as the Season 1 audio option.',
    practice: 'Use one short French exchange. Replay it and identify where the question ends and the answer begins.',
    levelNote: 'Same provider A1–A2 sequence; this is an alternative listening format.', checkedOn: '2026-11-19',
  },
  {
    id: 'tv5-a2', title: 'Everyday video comprehension: A2', provider: 'TV5MONDE',
    levels: ['A2'], format: 'Video exercises',
    url: 'https://apprendre.tv5monde.com/fr/exercices/a2-elementaire',
    description: 'Practise picking out the main information in short videos on varied topics.',
    support: 'Guided exercises; check the selected activity for transcription and other help.',
    access: 'Free learning activities; provider account options for progress.',
    practice: 'Choose a familiar topic. Note who is speaking, where they are and one fact; check with the exercises.',
    levelNote: 'Provider A2 label. Familiar subjects are a useful starting point.', checkedOn: '2026-11-19',
  },
  {
    id: 'coffee-break-2', title: 'Coffee Break French: Season 2', provider: 'Coffee Break Languages',
    levels: ['A2', 'B1'], format: 'Podcast',
    url: 'https://coffeebreaklanguages.com/tag/cbf-season-2/',
    description: 'Build on the basics with routines, past events and plans, with English teaching support.',
    support: 'English explanations in the audio; full transcripts and lesson notes belong to the paid course.',
    access: 'Free podcast; optional course materials cost extra.',
    practice: 'Choose a routine or travel episode. Listen for when events happen and retell two details in simple French or English.',
    levelNote: 'Provider A2–B1 sequence after Season 1; later episodes add grammatical demands.', checkedOn: '2026-11-19',
  },
  {
    id: 'easy-french-street', title: 'Street interviews: French as people speak it', provider: 'Easy French',
    levels: ['B1'], format: 'YouTube',
    url: 'https://www.youtube.com/playlist?list=PLA5UIoabheFMYWWnGFFxl8_nvVZWZSykc',
    description: 'Hear different speakers discussing everyday life and culture.',
    support: 'French and English subtitles. Use the French text to connect familiar words with the sounds.',
    access: 'Public videos with possible ads; extra exercises and downloads require membership.',
    practice: 'Choose one question. Compare two people’s answers and note one expression you could reuse.',
    levelNote: 'Suggested B1 with subtitle support; spontaneous speech can be a stretch.', checkedOn: '2026-11-19',
  },
  {
    id: 'tv5-b1', title: 'Reports and interviews: B1', provider: 'TV5MONDE',
    levels: ['B1'], format: 'Video exercises',
    url: 'https://apprendre.tv5monde.com/fr/exercices/b1-intermediaire',
    description: 'Follow the main ideas and selected details of television clips.',
    support: 'Comprehension activities; available text support depends on the chosen video.',
    access: 'Free learning activities; provider account options for progress.',
    practice: 'Predict the subject from the title. Listen, write the main point and two supporting facts, then check.',
    levelNote: 'Provider B1 label; choose familiar topics before more abstract reports.', checkedOn: '2026-11-19',
  },
  {
    id: 'innerfrench-podcast', title: 'innerFrench: intermediate podcast archive', provider: 'innerFrench',
    levels: ['B1'], format: 'Podcast', url: 'https://innerfrench.com/01-learn-french-naturally/',
    description: 'Start at episode 1 for extended listening about ideas, learning and culture.',
    support: 'French transcripts require a free provider account. No full English translation is promised.',
    access: 'Free listening archive; account needed for full transcripts.',
    practice: 'Listen to a two-minute section. Summarise the main idea, check the transcript if needed, and listen again.',
    levelNote: 'Suggested B1. Start with older episodes; this is not a beginner course.', checkedOn: '2026-11-19',
  },
  {
    id: 'innerfrench-youtube', title: 'innerFrench: topics and culture on YouTube', provider: 'innerFrench',
    levels: ['B1'], format: 'YouTube', url: 'https://www.youtube.com/@innerFrench',
    description: 'Explore the video archive and choose a subject you already know something about.',
    support: 'Check the video for French captions. Selected video transcripts are listed on innerFrench’s website.',
    access: 'Public videos with possible ads; optional courses are separate paid products.',
    practice: 'Watch two minutes. Write one claim and the example supporting it, then replay to check your notes.',
    levelNote: 'Suggested B1 with support; some subjects and interviews are harder.', checkedOn: '2026-11-19',
  },
  {
    id: 'rfi-journal', title: 'Journal en français facile: short news listening', provider: 'RFI',
    levels: ['B1'], format: 'Podcast',
    url: 'https://podcasts.apple.com/fr/podcast/journal-en-fran%C3%A7ais-facile/id1573764973',
    description: 'Use a short part of a news bulletin to practise listening for the essential facts.',
    support: 'Episode descriptions link to RFI’s transcription and learning activities.',
    access: 'Public podcast listing. Playback and linked RFI pages can depend on device or region.',
    practice: 'Choose one report. Identify who, what and where, then use the linked transcript to check.',
    levelNote: 'Suggested B1 stretch. News vocabulary can be difficult even when the title says easy.', checkedOn: '2026-11-19',
  },
];

export function getListeningResources(language: TargetLanguage): readonly ListeningResource[] {
  return language === 'ja-JP' ? japaneseListeningResources : listeningResources;
}
