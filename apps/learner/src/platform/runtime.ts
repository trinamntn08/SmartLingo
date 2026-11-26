import { Capacitor, registerPlugin } from '@capacitor/core';

/** The Android test shell runs the web learner against bundled local assets. */
export function isAndroidApp(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

/** Keep the Android document at the bundled root when route identifiers contain periods. */
export function learnerDocumentHref(routeHref: string): string {
  return isAndroidApp() && routeHref !== '/' ? `/#${routeHref}` : routeHref;
}

interface LearningBackupPlugin {
  save(options: { filename: string; contents: string }): Promise<{ saved: true }>;
}

export const androidLearningBackup = registerPlugin<LearningBackupPlugin>('LearningBackup');
