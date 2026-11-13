/**
 * Logika murni sinkronisasi (tanpa jaringan, tanpa React) supaya mudah diuji.
 * Seluruh data aplikasi tersimpan di localStorage dengan awalan "siduk_".
 * Snapshot adalah salinan semua kunci itu, kecuali sesi login dan metadata sinkronisasi.
 */
export const SYNC_PREFIX = 'siduk_';
export const EXCLUDED_KEYS = new Set(['siduk_auth', 'siduk_role', 'siduk_user', 'siduk_sync_meta']);

export interface Snapshot {
  schema: 1;
  savedAt: string; // ISO, dibuat oleh perangkat yang menyimpan
  device: string;
  keys: Record<string, string>;
}

export interface StorageLike {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const isSyncKey = (key: string | null): key is string =>
  !!key && key.startsWith(SYNC_PREFIX) && !EXCLUDED_KEYS.has(key);

export function listSyncKeys(storage: StorageLike): string[] {
  const out: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (isSyncKey(k)) out.push(k);
  }
  return out.sort();
}

export function collectSnapshot(storage: StorageLike, device: string, now: Date = new Date()): Snapshot {
  const keys: Record<string, string> = {};
  for (const k of listSyncKeys(storage)) {
    const v = storage.getItem(k);
    if (v !== null) keys[k] = v;
  }
  return { schema: 1, savedAt: now.toISOString(), device, keys };
}

/** Menyamakan localStorage dengan snapshot. Mengembalikan jumlah kunci yang ditulis. */
export function applySnapshot(storage: StorageLike, snap: Snapshot): number {
  if (!snap || snap.schema !== 1 || typeof snap.keys !== 'object') {
    throw new Error('Format berkas data di Google Drive tidak dikenali.');
  }
  for (const k of listSyncKeys(storage)) {
    if (!(k in snap.keys)) storage.removeItem(k);
  }
  let written = 0;
  for (const [k, v] of Object.entries(snap.keys)) {
    if (!isSyncKey(k) || typeof v !== 'string') continue;
    storage.setItem(k, v);
    written++;
  }
  return written;
}

export type SyncDecision = 'push' | 'pull' | 'conflict' | 'in-sync';

/**
 * Menentukan langkah saat perangkat terhubung ke Drive.
 * - lastSyncedAt: savedAt snapshot terakhir yang dikirim/diambil perangkat ini
 * - dirty: ada perubahan lokal sejak sinkronisasi terakhir
 * - remoteSavedAt: savedAt snapshot di Drive (null bila belum ada berkas)
 */
export function decide(lastSyncedAt: string | null, dirty: boolean, remoteSavedAt: string | null): SyncDecision {
  if (!remoteSavedAt) return 'push';
  if (!lastSyncedAt) return 'conflict'; // perangkat belum pernah sinkron, tetapi Drive sudah berisi data
  const remote = Date.parse(remoteSavedAt);
  const last = Date.parse(lastSyncedAt);
  if (remote > last) return dirty ? 'conflict' : 'pull';
  return dirty ? 'push' : 'in-sync';
}

export const formatBytes = (n: number): string =>
  n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`;
