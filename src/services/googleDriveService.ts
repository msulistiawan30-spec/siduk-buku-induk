import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigured } from '../config/firebase';

// Reuse app instance if already initialized
const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig as Record<string, string>)
  : null;
export const auth = app ? getAuth(app) : (null as unknown as ReturnType<typeof getAuth>);
export const isDriveConfigured = isFirebaseConfigured;

const NOT_CONFIGURED =
  'Firebase belum dikonfigurasi. Isi variabel VITE_FIREBASE_* (lihat README) lalu bangun ulang aplikasi.';

// Hanya berkas yang dibuat oleh aplikasi ini yang bisa dibaca atau diubah.
// Aplikasi tidak bisa melihat isi Drive lainnya milik pengguna.
export const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const provider = new GoogleAuthProvider();
// Tambahkan scope Drive
SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'select_account',
});

// In-memory token caching per guidelines (NEVER store in localStorage or sessionStorage)
let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Pemantau perubahan status sambungan Drive (dipakai modul sinkronisasi)
type AuthListener = (connected: boolean, user: User | null) => void;
const authListeners = new Set<AuthListener>();
export const onDriveAuthChange = (fn: AuthListener) => {
  authListeners.add(fn);
  return () => authListeners.delete(fn);
};
const emitAuth = (connected: boolean, user: User | null) => authListeners.forEach((fn) => fn(connected, user));

export class DriveAuthError extends Error {
  constructor(message = 'Sesi Google Drive berakhir. Hubungkan ulang akun Google.') {
    super(message);
    this.name = 'DriveAuthError';
  }
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  parents?: string[];
  thumbnailLink?: string;
}

export interface DriveAboutInfo {
  user: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  };
  storageQuota?: {
    limit?: string;
    usage?: string;
    usageInDrive?: string;
    usageInDriveTrash?: string;
  };
}

/**
 * Initialize auth state listener.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Sign in with Google Popup and obtain access token
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (!auth) throw new Error(NOT_CONFIGURED);
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan access token Google Drive dari Firebase Auth.');
    }

    cachedAccessToken = credential.accessToken;
    emitAuth(true, result.user);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const googleSignOut = async (): Promise<void> => {
  if (auth) await signOut(auth);
  cachedAccessToken = null;
  emitAuth(false, null);
};

/**
 * Get Google Drive About info (Quota & Profile)
 */
export const fetchAboutDrive = async (): Promise<DriveAboutInfo | null> => {
  const token = await getAccessToken();
  if (!token) return null;

  const res = await fetch(
    'https://www.googleapis.com/drive/v3/about?fields=user,storageQuota',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Gagal memuat info Google Drive: ${res.statusText}`);
  }
  return await res.json();
};

/**
 * List files from Google Drive
 */
export const listDriveFiles = async (options: {
  query?: string;
  folderId?: string;
  pageSize?: number;
  pageToken?: string;
}): Promise<{ files: DriveFileItem[]; nextPageToken?: string }> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Autentikasi Google Drive diperlukan.');

  const parts: string[] = ["trashed = false"];
  if (options.folderId) {
    parts.push(`'${options.folderId}' in parents`);
  }
  if (options.query && options.query.trim()) {
    const escaped = options.query.replace(/'/g, "\\'");
    parts.push(`name contains '${escaped}'`);
  }

  const q = parts.join(' and ');
  const fields = 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink, iconLink, thumbnailLink, parents)';
  const pageSize = options.pageSize || 30;

  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', q);
  url.searchParams.set('fields', fields);
  url.searchParams.set('pageSize', pageSize.toString());
  url.searchParams.set('orderBy', 'folder,modifiedTime desc');
  if (options.pageToken) {
    url.searchParams.set('pageToken', options.pageToken);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal mengambil daftar berkas Google Drive: ${res.statusText}`);
  }

  return await res.json();
};

/**
 * Create a new folder in Google Drive
 */
export const createDriveFolder = async (
  folderName: string,
  parentId?: string
): Promise<DriveFileItem> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Autentikasi Google Drive diperlukan.');

  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };
  if (parentId) {
    metadata.parents = [parentId];
  }

  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal membuat folder: ${res.statusText}`);
  }

  return await res.json();
};

/**
 * Upload a text/json/blob file to Google Drive (multipart upload)
 */
export const uploadDriveFile = async ({
  name,
  mimeType,
  content,
  parentId,
}: {
  name: string;
  mimeType: string;
  content: string | Blob;
  parentId?: string;
}): Promise<DriveFileItem> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Autentikasi Google Drive diperlukan.');

  const metadata: any = {
    name,
    mimeType,
  };
  if (parentId) {
    metadata.parents = [parentId];
  }

  const boundary = '-------siduk_drive_boundary_' + Math.random().toString(36).substring(2);
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  let body: any;
  if (typeof content === 'string') {
    body =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n\r\n` +
      content +
      closeDelimiter;
  } else {
    // Blob/binary multipart upload
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json; charset=UTF-8' });
    const header = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n`;
    const middle = `${delimiter}Content-Type: ${mimeType}\r\n\r\n`;
    const footer = closeDelimiter;

    body = new Blob([header, metadataBlob, middle, content, footer], {
      type: `multipart/related; boundary=${boundary}`,
    });
  }

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal mengunggah berkas: ${res.statusText}`);
  }

  return await res.json();
};

/**
 * Delete a file or folder from Google Drive
 * (Caller MUST show confirmation modal before calling this method)
 */
export const deleteDriveFile = async (fileId: string): Promise<boolean> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Autentikasi Google Drive diperlukan.');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal menghapus berkas dari Google Drive: ${res.statusText}`);
  }

  return true;
};


// ---------------------------------------------------------------------------
// Penyimpanan data aplikasi di Google Drive
// ---------------------------------------------------------------------------
const FOLDER_MIME = 'application/vnd.google-apps.folder';

const driveFetch = async (url: string, init: RequestInit = {}): Promise<Response> => {
  const token = await getAccessToken();
  if (!token) throw new DriveAuthError();
  const res = await fetch(url, {
    ...init,
    headers: { ...(init.headers || {}), Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    cachedAccessToken = null;
    emitAuth(false, auth?.currentUser ?? null);
    throw new DriveAuthError();
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Permintaan ke Google Drive gagal (${res.status}).`);
  }
  return res;
};

const escapeQ = (v: string) => v.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

export const findDriveItem = async (
  name: string,
  parentId?: string,
  mimeType?: string
): Promise<DriveFileItem | null> => {
  const parts = [`name = '${escapeQ(name)}'`, 'trashed = false'];
  if (parentId) parts.push(`'${parentId}' in parents`);
  if (mimeType) parts.push(`mimeType = '${mimeType}'`);
  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', parts.join(' and '));
  url.searchParams.set('fields', 'files(id, name, mimeType, size, modifiedTime, parents)');
  url.searchParams.set('pageSize', '1');
  const res = await driveFetch(url.toString());
  const data = await res.json();
  return data.files?.[0] ?? null;
};

export const ensureDriveFolder = async (name: string, parentId?: string): Promise<string> => {
  const existing = await findDriveItem(name, parentId, FOLDER_MIME);
  if (existing) return existing.id;
  const created = await createDriveFolder(name, parentId);
  return created.id;
};

export const readDriveJson = async <T = unknown>(fileId: string): Promise<T> => {
  const res = await driveFetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`);
  return (await res.json()) as T;
};

/** Menulis JSON ke berkas Drive. Bila fileId ada, isi berkas diganti; bila tidak, berkas baru dibuat. */
export const writeDriveJson = async (opts: {
  name: string;
  parentId: string;
  data: unknown;
  fileId?: string;
}): Promise<DriveFileItem> => {
  const body = JSON.stringify(opts.data);
  if (opts.fileId) {
    const res = await driveFetch(
      `https://www.googleapis.com/upload/drive/v3/files/${opts.fileId}?uploadType=media&fields=id,name,size,modifiedTime`,
      { method: 'PATCH', headers: { 'Content-Type': 'application/json; charset=UTF-8' }, body }
    );
    return res.json();
  }
  const boundary = 'siduk_' + Math.random().toString(36).slice(2);
  const multipart =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify({ name: opts.name, mimeType: 'application/json', parents: [opts.parentId] }) +
    `\r\n--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${body}\r\n--${boundary}--`;
  const res = await driveFetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,size,modifiedTime',
    { method: 'POST', headers: { 'Content-Type': `multipart/related; boundary=${boundary}` }, body: multipart }
  );
  return res.json();
};

export const listFolderFiles = async (folderId: string): Promise<DriveFileItem[]> => {
  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', `'${folderId}' in parents and trashed = false`);
  url.searchParams.set('fields', 'files(id, name, modifiedTime, size)');
  url.searchParams.set('orderBy', 'name');
  url.searchParams.set('pageSize', '100');
  const res = await driveFetch(url.toString());
  return (await res.json()).files ?? [];
};
