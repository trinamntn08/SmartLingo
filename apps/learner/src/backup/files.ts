import { maximumBackupBytes, parseBackupText, serializeBackup, type LearningBackup } from '@smartlingo/domain';

export async function readBackupFile(file: File): Promise<LearningBackup> {
  if (file.size > maximumBackupBytes) throw new Error('Backup files must be 5 MB or smaller.');
  let text: string;
  try { text = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer()); }
  catch { throw new Error('This backup is not valid UTF-8 text. Nothing was restored.'); }
  return parseBackupText(text);
}

export function downloadBackup(backup: LearningBackup): void {
  const text = serializeBackup(backup);
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `smartlingo-learning-${backup.createdAt.slice(0, 10)}.json`;
  document.body.appendChild(link);
  try { link.click(); }
  finally { link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
}
