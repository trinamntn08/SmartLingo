import { randomUUID } from 'node:crypto';
import { EditorError } from './editor-error';

const ttlMilliseconds = 15 * 60 * 1000;
const maximumReceipts = 256;

export class PreviewReceipts {
  private readonly receipts = new Map<string, { id: string; revision: number; expiresAt: number }>();

  constructor(private readonly now: () => number = Date.now) {}

  issue(id: string, revision: number): string {
    this.removeExpired();
    if (this.receipts.size >= maximumReceipts) {
      const oldest = this.receipts.keys().next().value;
      if (oldest) this.receipts.delete(oldest);
    }
    const token = randomUUID();
    this.receipts.set(token, { id, revision, expiresAt: this.now() + ttlMilliseconds });
    return token;
  }

  verify(token: string, id: string, revision: number): void {
    this.removeExpired();
    const receipt = this.receipts.get(token);
    if (!receipt || receipt.id !== id || receipt.revision !== revision) {
      throw new EditorError(409, 'Preview this saved draft again before publishing');
    }
  }

  invalidate(id: string): void {
    for (const [token, receipt] of this.receipts) {
      if (receipt.id === id) this.receipts.delete(token);
    }
  }

  clear(): void { this.receipts.clear(); }

  private removeExpired(): void {
    const now = this.now();
    for (const [token, receipt] of this.receipts) {
      if (receipt.expiresAt <= now) this.receipts.delete(token);
    }
  }
}
