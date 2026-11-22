import { Capacitor, registerPlugin } from '@capacitor/core';

/** The Android test shell runs the web learner against bundled local assets. */
export function isAndroidApp(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

interface LearningBackupPlugin {
  save(options: { filename: string; contents: string }): Promise<{ saved: true }>;
}

export const androidLearningBackup = registerPlugin<LearningBackupPlugin>('LearningBackup');
