import {
  DriveAuthError,
  ensureDriveFolder,
  findDriveItem,
  getAccessToken,
  listFolderFiles,
  deleteDriveFile,
  onDriveAuthChange,
  readDriveJson,
  writeDriveJson,
} from './googleDriveService';
import { applySnapshot, collectSnapshot, decide, isSyncKey, Snapshot } from './snapshot';

/**
 * Sinkronisasi data SIDUK ke Google Drive.
 *
 * Pola kerja:
 *  - Semua komponen tetap menyimpan data ke localStorage seperti sebelumnya.
 *  - Modul ini mengamati penulisan localStorage, lalu mengirim snapshot ke satu berkas JSON
 *    di folder "SIDUK Buku Induk" pada Google Drive pengguna (otomatis, tertunda 20 detik).
 *  - Saat perangkat lain membuka aplikasi dan terhubung ke Drive, data diambil dari berkas itu.
 *  - Satu salinan cadangan harian disimpan di sub-folder "Cadangan" (30 hari terakhir).
 */

const FOLDER_NAME = 'SIDUK Buku Induk';
const BACKUP_FOLDER = 'Cadangan';
const DB_FILE = 'siduk-database.json';
const META_KEY = 'siduk_sync_meta';
const AUTO_PUSH_DELAY_MS = 20_000;
const KEEP_BACKUPS = 30;
const SIZE_WARN_BYTES = 20 * 1024 * 1024;

export type SyncStatus =
  | 'offline' // belum terhubung ke Drive
  | 'connecting'
  | 'idle' // data sama dengan Drive
  | 'dirty' // ada perubahan yang menunggu dikirim
  | 'syncing'
  | 'conflict' // data perangkat dan Drive sama-sama berubah
  | 'error';

export interface SyncState {
  status: SyncStatus;
  message: string;
  lastSyncedAt: string | null;
  remoteSavedAt: string | null;
  sizeBytes: number;
  userEmail: string | null;
}

interface Meta {
  lastSyncedAt: string | null;
  dirty: boolean;
  lastBackupDay: string | null;
  device: string;
}

const readMeta = (): Meta => {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw) return JSON.parse(raw) as Meta;
  } catch {
    /* abaikan */
  }
  const device = `${navigator.platform || 'perangkat'}-${Math.random().toString(36).slice(2, 6)}`;
  return { lastSyncedAt: null, dirty: false, lastBackupDay: null, device };
};
const metaWrite = (m: Meta) => Storage.prototype.setItem.call(localStorage, META_KEY, JSON.stringify(m));

let meta: Meta = readMeta();
let state: SyncState = {
  status: 'offline',
  message: 'Belum terhubung ke Google Drive.',
  lastSyncedAt: meta.lastSyncedAt,
  remoteSavedAt: null,
  sizeBytes: 0,
  userEmail: null,
};
const listeners = new Set<() => void>();
const setState = (patch: Partial<SyncState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
export const subscribeSync = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const getSyncState = () => state;

let folderId: string | null = null;
let dbFileId: string | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let applying = false;
let busy = false;
let pendingRemote: Snapshot | null = null;

const failWith = (e: unknown) => {
  if (e instanceof DriveAuthError) {
    setState({ status: 'offline', message: e.message });
  } else {
    setState({ status: 'error', message: e instanceof Error ? e.message : 'Sinkronisasi gagal.' });
  }
};

const resolveLocation = async () => {
  if (!folderId) folderId = await ensureDriveFolder(FOLDER_NAME);
  if (!dbFileId) dbFileId = (await findDriveItem(DB_FILE, folderId))?.id ?? null;
};

const schedulePush = () => {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    void pushNow();
  }, AUTO_PUSH_DELAY_MS);
};

const markDirty = () => {
  if (applying) return;
  meta = { ...meta, dirty: true };
  metaWrite(meta);
  if (state.status === 'idle' || state.status === 'dirty') {
    setState({ status: 'dirty', message: 'Perubahan akan dikirim ke Google Drive sebentar lagi.' });
    schedulePush();
  }
};

/** Memasang pengamat penulisan localStorage satu kali saja. */
let hooked = false;
const installWriteHook = () => {
  if (hooked) return;
  hooked = true;
  const origSet = Storage.prototype.setItem;
  const origRemove = Storage.prototype.removeItem;
  Storage.prototype.setItem = function (key: string, value: string) {
    origSet.call(this, key, value);
    if (this === localStorage && isSyncKey(key)) markDirty();
  };
  Storage.prototype.removeItem = function (key: string) {
    origRemove.call(this, key);
    if (this === localStorage && isSyncKey(key)) markDirty();
  };
  window.addEventListener('beforeunload', (e) => {
    if (state.status === 'dirty' || state.status === 'syncing') {
      e.preventDefault();
      e.returnValue = '';
    }
  });
};

export async function pushNow(): Promise<void> {
  if (busy) return;
  if (!(await getAccessToken())) {
    setState({ status: 'offline', message: 'Sesi Google Drive berakhir. Hubungkan ulang akun Google.' });
    return;
  }
  busy = true;
  if (pushTimer) clearTimeout(pushTimer);
  setState({ status: 'syncing', message: 'Mengirim data ke Google Drive...' });
  try {
    await resolveLocation();
    const snap = collectSnapshot(localStorage, meta.device);
    const size = new Blob([JSON.stringify(snap)]).size;
    const saved = await writeDriveJson({ name: DB_FILE, parentId: folderId!, data: snap, fileId: dbFileId ?? undefined });
    dbFileId = saved.id;
    meta = { ...meta, lastSyncedAt: snap.savedAt, dirty: false };
    metaWrite(meta);
    setState({
      status: 'idle',
      lastSyncedAt: snap.savedAt,
      remoteSavedAt: snap.savedAt,
      sizeBytes: size,
      message:
        size > SIZE_WARN_BYTES
          ? 'Tersimpan, tetapi data sudah besar. Foto sebaiknya dikompres agar tetap cepat.'
          : 'Tersimpan di Google Drive.',
    });
    await dailyBackup(snap);
  } catch (e) {
    failWith(e);
  } finally {
    busy = false;
  }
}

async function dailyBackup(snap: Snapshot) {
  const today = snap.savedAt.slice(0, 10);
  if (meta.lastBackupDay === today) return;
  try {
    const backupId = await ensureDriveFolder(BACKUP_FOLDER, folderId!);
    const name = `siduk-cadangan-${today}.json`;
    const existing = await findDriveItem(name, backupId);
    await writeDriveJson({ name, parentId: backupId, data: snap, fileId: existing?.id });
    meta = { ...meta, lastBackupDay: today };
    metaWrite(meta);
    const files = (await listFolderFiles(backupId)).filter((f) => f.name.startsWith('siduk-cadangan-'));
    for (const old of files.slice(0, Math.max(0, files.length - KEEP_BACKUPS))) {
      await deleteDriveFile(old.id);
    }
  } catch {
    /* cadangan gagal tidak boleh membatalkan simpan utama */
  }
}

async function applyRemoteAndReload(remote: Snapshot) {
  applying = true;
  try {
    applySnapshot(localStorage, remote);
    meta = { ...meta, lastSyncedAt: remote.savedAt, dirty: false };
    metaWrite(meta);
  } finally {
    applying = false;
  }
  setState({ status: 'idle', message: 'Data dimuat dari Google Drive. Memuat ulang halaman...' });
  window.location.reload();
}

/** Dipanggil setelah akun Google terhubung. */
export async function connect(userEmail: string | null): Promise<void> {
  installWriteHook();
  setState({ status: 'connecting', message: 'Memeriksa data di Google Drive...', userEmail });
  try {
    await resolveLocation();
    const remote = dbFileId ? await readDriveJson<Snapshot>(dbFileId) : null;
    const remoteSavedAt = remote?.savedAt ?? null;
    const action = decide(meta.lastSyncedAt, meta.dirty, remoteSavedAt);
    setState({ remoteSavedAt });
    if (action === 'push') {
      await pushNow();
      return;
    }
    if (action === 'pull' && remote) return await applyRemoteAndReload(remote);
    if (action === 'conflict' && remote) {
      pendingRemote = remote;
      setState({
        status: 'conflict',
        message: meta.lastSyncedAt
          ? 'Data di perangkat ini dan di Google Drive sama-sama berubah. Pilih salah satu.'
          : 'Google Drive sudah berisi data. Pilih data mana yang dipakai.',
      });
      return;
    }
    setState({ status: 'idle', message: 'Data sudah sama dengan Google Drive.' });
  } catch (e) {
    failWith(e);
  }
}

export async function resolveConflict(choice: 'device' | 'drive'): Promise<void> {
  if (choice === 'drive' && pendingRemote) {
    const r = pendingRemote;
    pendingRemote = null;
    return applyRemoteAndReload(r);
  }
  pendingRemote = null;
  await pushNow();
}

export async function pullNow(): Promise<void> {
  setState({ status: 'syncing', message: 'Mengambil data dari Google Drive...' });
  try {
    await resolveLocation();
    if (!dbFileId) {
      setState({ status: 'error', message: 'Belum ada data tersimpan di Google Drive.' });
      return;
    }
    await applyRemoteAndReload(await readDriveJson<Snapshot>(dbFileId));
  } catch (e) {
    failWith(e);
  }
}

export function disconnectSync() {
  if (pushTimer) clearTimeout(pushTimer);
  folderId = null;
  dbFileId = null;
  setState({ status: 'offline', message: 'Belum terhubung ke Google Drive.', userEmail: null });
}

/** Menghubungkan modul ini dengan status login Google. Panggil sekali saat aplikasi dimuat. */
export function initDriveSync() {
  installWriteHook();
  return onDriveAuthChange((connected, user) => {
    if (connected) void connect(user?.email ?? null);
    else disconnectSync();
  });
}
