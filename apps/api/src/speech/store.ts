import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { speechInputSchema, type SpeechAsset, type SpeechRequest } from '@smartlingo/domain';
import { audioHash, identityKey, makeAsset, maxAudioBytes } from './audio';
import { SpeechError } from './error';
import { migrateSpeechDatabase } from './migrations';

const retentionMs = 30 * 24 * 60 * 60_000;
type Reservation = { asset: SpeechAsset; cacheHit: boolean } | { asset?: undefined };

/** Independent generated-media database; all paid-call admission is one SQLite transaction. */
export class SpeechStore {
  private readonly db: DatabaseSync;
  constructor(path: string) {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path, { timeout: 2000 });
    try { migrateSpeechDatabase(this.db); } catch (error) { this.db.close(); throw error; }
  }
  close(): void { this.db.close(); }
  usedToday(now: number): number {
    return Number(this.db.prepare('SELECT attempts FROM speech_usage WHERE day = ?').get(this.day(now))?.attempts ?? 0);
  }
  private day(now: number): string { return new Date(now).toISOString().slice(0, 10); }
  private transaction<T>(run: () => T): T {
    this.db.exec('BEGIN IMMEDIATE');
    try { const result = run(); this.db.exec('COMMIT'); return result; }
    catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  private sweep(now: number): void {
    // Never invalidate another process's unexpired flight at startup.
    this.db.prepare(`UPDATE speech_requests SET state='failed', error_status=409, error_message=? WHERE state='pending' AND lease_until <= ?`)
      .run('Speech attempt ended without a confirmed result. Generate again with a new request.', now);
    this.db.prepare('DELETE FROM speech_flight WHERE lease_until <= ?').run(now);
    this.db.prepare(`DELETE FROM speech_requests WHERE state != 'pending' AND created_at < ?`).run(now - retentionMs);
    this.db.prepare('DELETE FROM speech_usage WHERE day < ?').run(this.day(now - retentionMs));
  }
  private asset(key: string): SpeechAsset | undefined {
    // Read length before materializing the BLOB, including when the file was externally corrupted.
    const row = this.db.prepare('SELECT input, byte_length, sha256, length(audio) AS stored_length FROM speech_assets WHERE key=?').get(key);
    if (!row) return undefined;
    try {
      if (typeof row.stored_length !== 'number' || row.stored_length < 10 || row.stored_length > maxAudioBytes || row.stored_length !== row.byte_length || typeof row.input !== 'string' || row.input.length > 4096) throw new Error();
      const input = speechInputSchema.parse(JSON.parse(row.input));
      if (identityKey(input) !== key) throw new Error();
      const bytes = this.db.prepare('SELECT audio FROM speech_assets WHERE key=?').get(key)?.audio;
      if (!(bytes instanceof Uint8Array) || audioHash(bytes) !== row.sha256) throw new Error();
      return makeAsset(input, bytes);
    } catch { throw new SpeechError(500, 'Saved speech failed validation. It was not regenerated.'); }
  }
  reserve(request: SpeechRequest, key: string, now: number, leaseMs: number, available: boolean, dailyLimit: number): Reservation {
    // Sweep commits separately: expired pending IDs must remain terminal even if this request rejects.
    this.transaction(() => this.sweep(now));
    return this.transaction(() => {
      const previous = this.db.prepare('SELECT key, state, cache_hit, error_status, error_message FROM speech_requests WHERE id=?').get(request.requestId);
      if (previous) {
        if (previous.key !== key) throw new SpeechError(409, 'Request ID was already used with different speech settings.');
        if (previous.state === 'pending') throw new SpeechError(409, 'This speech request is already in progress.');
        if (previous.state === 'failed') throw new SpeechError(Number(previous.error_status ?? 409), String(previous.error_message ?? 'Speech attempt ended. Generate again with a new request.'), true);
        const asset = this.asset(key);
        if (!asset) throw new SpeechError(500, 'Saved speech is missing. It was not regenerated.');
        return { asset, cacheHit: previous.cache_hit === 1 };
      }
      const asset = this.asset(key);
      if (Number(this.db.prepare('SELECT COUNT(*) AS count FROM speech_requests').get()?.count) >= 10_000) throw new SpeechError(429, 'Speech request storage is full.');
      if (asset) {
        this.db.prepare(`INSERT INTO speech_requests(id,key,state,created_at,lease_until,cache_hit) VALUES(?,?,'succeeded',?,0,1)`).run(request.requestId, key, now);
        return { asset, cacheHit: true };
      }
      if (!available) throw new SpeechError(503, 'Neural speech is unavailable. Device speech and ordinary lessons remain available.');
      if (this.usedToday(now) >= dailyLimit) throw new SpeechError(429, 'Daily speech allowance reached. Try again tomorrow.');
      if (this.db.prepare('SELECT singleton FROM speech_flight').get()) throw new SpeechError(409, 'Another speech request is in progress.');
      const capacity = this.db.prepare('SELECT COUNT(*) AS count, COALESCE(SUM(length(audio)),0) AS bytes FROM speech_assets').get()!;
      // Reserve room for the maximum possible clip before incurring provider cost.
      if (Number(capacity.count) >= 512 || Number(capacity.bytes) + maxAudioBytes > 64 * 1024 * 1024) throw new SpeechError(429, 'Saved speech storage is full.');
      this.db.prepare(`INSERT INTO speech_requests(id,key,state,created_at,lease_until) VALUES(?,?,'pending',?,?)`).run(request.requestId, key, now, now + leaseMs);
      this.db.prepare('INSERT INTO speech_flight VALUES(1,?,?)').run(request.requestId, now + leaseMs);
      this.db.prepare('INSERT INTO speech_usage VALUES(?,1) ON CONFLICT(day) DO UPDATE SET attempts=attempts+1').run(this.day(now));
      return {};
    });
  }
  complete(request: SpeechRequest, asset: SpeechAsset, now: number): void {
    this.transaction(() => {
      const flight = this.db.prepare('SELECT request_id, lease_until FROM speech_flight').get();
      if (flight?.request_id !== request.requestId || Number(flight.lease_until) <= now) throw new SpeechError(409, 'Speech attempt expired. Generate again with a new request.', true);
      this.db.prepare('INSERT INTO speech_assets VALUES(?,?,?,?,?)').run(asset.key, JSON.stringify(asset.input), Buffer.from(asset.audioBase64, 'base64'), asset.byteLength, asset.sha256);
      this.db.prepare(`UPDATE speech_requests SET state='succeeded' WHERE id=? AND state='pending'`).run(request.requestId);
      this.db.prepare('DELETE FROM speech_flight WHERE request_id=?').run(request.requestId);
    });
  }
  fail(requestId: string, error: SpeechError): void {
    this.transaction(() => {
      this.db.prepare(`UPDATE speech_requests SET state='failed', error_status=?, error_message=? WHERE id=? AND state='pending'`).run(error.statusCode, error.message, requestId);
      this.db.prepare('DELETE FROM speech_flight WHERE request_id=?').run(requestId);
    });
  }
}
