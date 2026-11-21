import type { NotebookEntry } from './learning';

export const targetLanguages = ['fr-FR', 'ja-JP'] as const;
export type TargetLanguage = typeof targetLanguages[number];
export const languageNames: Record<TargetLanguage, string> = { 'fr-FR': 'French', 'ja-JP': 'Japanese' };

/** Missing metadata belongs to the original French notebook; never rewrite old notes. */
export function notebookLanguage(entry: NotebookEntry): TargetLanguage { return entry.language ?? 'fr-FR'; }
