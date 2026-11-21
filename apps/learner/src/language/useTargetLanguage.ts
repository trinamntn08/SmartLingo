import { useState } from 'react';
import { targetLanguages, type TargetLanguage } from '@smartlingo/domain';

export const languageStorageKey = 'smartlingo.target-language.v1';
function readLanguage(): TargetLanguage | null {
  try {
    const value = globalThis.localStorage?.getItem(languageStorageKey);
    return targetLanguages.find(language => language === value) ?? null;
  } catch { return null; }
}

export function useTargetLanguage() {
  const [language, setLanguage] = useState<TargetLanguage | null>(readLanguage);
  const [message, setMessage] = useState('');
  function choose(next: TargetLanguage) {
    setLanguage(next);
    try { globalThis.localStorage.setItem(languageStorageKey, next); setMessage(''); }
    catch { setMessage('Your language choice is kept for this visit. Browser storage is unavailable, so choose again next time.'); }
  }
  return { language, choose, message };
}
