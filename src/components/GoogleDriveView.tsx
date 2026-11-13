import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Student, SchoolSettings } from '../types';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  fetchAboutDrive,
  listDriveFiles,
  createDriveFolder,
  uploadDriveFile,
  deleteDriveFile,
  DriveFileItem,
  DriveAboutInfo,
  getAccessToken,
} from '../services/googleDriveService';
import { User } from 'firebase/auth';
import {
  HardDrive,
  Cloud,
  CloudUpload,
  FolderPlus,
  RefreshCw,
  Search,
  ExternalLink,
  Trash2,
  Folder,
  FileText,
  FileSpreadsheet,
  FileCode,
  File,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ChevronRight,
  Database,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Download,
  AlertTriangle,
  X,
} from 'lucide-react';

interface GoogleDriveViewProps {
  students: Student[];
  schoolSettings: SchoolSettings;
  onNavigate?: (menu: string) => void;
}

export const GoogleDriveView: React.FC<GoogleDriveViewProps> = ({
  students,
  schoolSettings,
  onNavigate,
}) => {
  // Authentication states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive metadata & files
  const [aboutInfo, setAboutInfo] = useState<DriveAboutInfo | null>(null);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [folderBreadcrumbs, setFolderBreadcrumbs] = useState<Array<{ id?: string; name: string }>>([
    { id: undefined, name: 'Google Drive Saya' },
  ]);

  // Modals & Action states
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFileObj, setUploadFileObj] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Backup progress state
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string | null>(null);

  // Mandatory Delete Confirmation Modal
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Live Clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const update = () => setCurrentTime(new Date().toTimeString().split(' ')[0]);
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
        setFiles([]);
        setAboutInfo(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Drive about & files whenever token or folder changes
  useEffect(() => {
    if (accessToken) {
      loadDriveData();
    }
  }, [accessToken, currentFolderId]);

  const loadDriveData = async () => {
    setIsLoadingFiles(true);
    setAuthError(null);
    try {
      const [about, fileList] = await Promise.all([
        fetchAboutDrive().catch(() => null),
        listDriveFiles({
          folderId: currentFolderId,
          query: searchQuery,
          pageSize: 50,
        }),
      ]);
      if (about) setAboutInfo(about);
      setFiles(fileList.files || []);
    } catch (err: any) {
      console.error('Error loading Google Drive data:', err);
      setAuthError(err.message || 'Gagal terhubung ke Google Drive.');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setAuthError(err.message || 'Proses masuk ke akun Google dibatalkan atau gagal.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await googleSignOut();
    setCurrentUser(null);
    setAccessToken(null);
    setFiles([]);
    setAboutInfo(null);
    setFolderBreadcrumbs([{ id: undefined, name: 'Google Drive Saya' }]);
    setCurrentFolderId(undefined);
  };

  // =========================================================================
  // ACTIONS: BACKUP SIDUK DATA TO GOOGLE DRIVE
  // =========================================================================
  const handleBackupJson = async () => {
    if (!accessToken) return;
    setIsBackingUp(true);
    setBackupSuccessMessage(null);
    try {
      // Find or create dedicated folder 'SIDUK - Cadangan Buku Induk'
      const existingFolder = files.find(
        (f) => f.mimeType === 'application/vnd.google-apps.folder' && f.name === 'SIDUK - Cadangan Buku Induk'
      );
      let targetFolderId = existingFolder?.id;

      if (!targetFolderId) {
        const newFolder = await createDriveFolder('SIDUK - Cadangan Buku Induk', currentFolderId);
        targetFolderId = newFolder.id;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `SIDUK_DataSiswa_${schoolSettings.activeAcademicYear.replace(/\//g, '-')}_${timestamp}.json`;

      const backupPayload = {
        app: 'SIDUK - Portal Buku Induk Digital',
        school: schoolSettings,
        exportDate: new Date().toISOString(),
        totalStudents: students.length,
        students,
      };

      await uploadDriveFile({
        name: filename,
        mimeType: 'application/json',
        content: JSON.stringify(backupPayload, null, 2),
        parentId: targetFolderId,
      });

      setBackupSuccessMessage(`Cadangan data siswa (${students.length} record) berhasil disimpan di Google Drive: ${filename}`);
      loadDriveData();
    } catch (err: any) {
      alert(`Gagal membuat cadangan: ${err.message}`);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleExportCsv = async () => {
    if (!accessToken) return;
    setIsBackingUp(true);
    setBackupSuccessMessage(null);
    try {
      const headers = ['NO', 'NIPD', 'NISN', 'NAMA_LENGKAP', 'JENIS_KELAMIN', 'KELAS', 'JURUSAN', 'STATUS', 'NO_REGISTER'];
      const rows = students.map((s, idx) => [
        idx + 1,
        `"${s.nipd}"`,
        `"${s.nisn}"`,
        `"${s.fullName.replace(/"/g, '""')}"`,
        `"${s.gender}"`,
        `"${s.currentClass}"`,
        `"${s.programKeahlian}"`,
        `"${s.status}"`,
        `"${s.registrationNumber || '-'}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `SIDUK_Daftar_Siswa_${schoolSettings.name.replace(/\s+/g, '_')}_${timestamp}.csv`;

      await uploadDriveFile({
        name: filename,
        mimeType: 'text/csv',
        content: csvContent,
        parentId: currentFolderId,
      });

      setBackupSuccessMessage(`File CSV data siswa (${students.length} siswa) berhasil diekspor ke Google Drive: ${filename}`);
      loadDriveData();
    } catch (err: any) {
      alert(`Gagal ekspor CSV: ${err.message}`);
    } finally {
      setIsBackingUp(false);
    }
  };

  // =========================================================================
  // ACTIONS: FOLDER CREATION & UPLOAD
  // =========================================================================
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || isCreatingFolder) return;

    setIsCreatingFolder(true);
    try {
      await createDriveFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName('');
      setIsNewFolderModalOpen(false);
      await loadDriveData();
    } catch (err: any) {
      alert(`Gagal membuat folder: ${err.message}`);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleUploadLocalFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileObj || isUploading) return;

    setIsUploading(true);
    try {
      await uploadDriveFile({
        name: uploadFileObj.name,
        mimeType: uploadFileObj.type || 'application/octet-stream',
        content: uploadFileObj,
        parentId: currentFolderId,
      });
      setUploadFileObj(null);
      setIsUploadModalOpen(false);
      await loadDriveData();
    } catch (err: any) {
      alert(`Gagal mengunggah berkas: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // =========================================================================
  // ACTIONS: EXPLICIT CONFIRMATION FOR DELETING (Mandatory per Skill)
  // =========================================================================
  const handleDeleteConfirm = async () => {
    if (!fileToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      setFileToDelete(null);
      await loadDriveData();
    } catch (err: any) {
      alert(`Gagal menghapus berkas: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Navigation into folder
  const navigateIntoFolder = (folder: DriveFileItem) => {
    setCurrentFolderId(folder.id);
    setFolderBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  const navigateBreadcrumb = (index: number) => {
    const target = folderBreadcrumbs[index];
    setCurrentFolderId(target.id);
    setFolderBreadcrumbs(folderBreadcrumbs.slice(0, index + 1));
  };

  // File type icon helper
  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-5 h-5 text-amber-500 shrink-0" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('csv') || mimeType.includes('excel')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />;
    }
    if (mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-sky-600 shrink-0" />;
    }
    if (mimeType.includes('image')) {
      return <ImageIcon className="w-5 h-5 text-indigo-500 shrink-0" />;
    }
    if (mimeType.includes('json') || mimeType.includes('script') || mimeType.includes('code')) {
      return <FileCode className="w-5 h-5 text-rose-500 shrink-0" />;
    }
    return <File className="w-5 h-5 text-slate-400 shrink-0" />;
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '-';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return '-';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
    return `${(num / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // Quota calculation
  const quota = useMemo(() => {
    if (!aboutInfo?.storageQuota?.limit) return null;
    const limit = parseInt(aboutInfo.storageQuota.limit, 10);
    const usage = parseInt(aboutInfo.storageQuota.usage || '0', 10);
    if (isNaN(limit) || limit <= 0) return null;
    const percent = Math.min(100, Math.round((usage / limit) * 100));
    return {
      usedFormatted: formatFileSize(usage.toString()),
      totalFormatted: formatFileSize(limit.toString()),
      percent,
    };
  }, [aboutInfo]);

  return (
    <section className="space-y-6">
      {/* 1. Header with Title, Date, Live Clock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Google Drive &amp; Cadangan Cloud
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Penyimpanan Awan &amp; Sinkronisasi Data Resmi Buku Induk Digital
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> 06 Nov 2026
          </span>
          <span className="flex items-center gap-1 bg-slate-900 text-white font-mono px-2.5 py-1 rounded-md shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> {currentTime}
          </span>
        </div>
      </div>

      {/* 2. Authentication State Card */}
      {!accessToken ? (
        <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-sky-900/50 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Integrasi Resmi Google Workspace</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Hubungkan Akun Google Drive Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sinkronkan dan simpan cadangan data Buku Induk Siswa, riwayat mutasi, berkas kelulusan, dan dokumen sekolah langsung ke Google Drive institusi Anda dengan izin aman.
            </p>

            {authError && (
              <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Official Google Sign In Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 border border-slate-300"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>
                  {isAuthenticating ? 'Menghubungkan ke Google...' : 'Sign in with Google'}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Connected Google Account Banner */
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Google User'}
                className="w-12 h-12 rounded-full border-2 border-sky-500 object-cover shadow-xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-sky-600 text-white font-bold text-lg flex items-center justify-center">
                {currentUser?.displayName?.charAt(0) || 'G'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm">
                  {currentUser?.displayName || 'Pengguna Google'}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Terhubung
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {currentUser?.email}
              </p>
            </div>
          </div>

          {/* Quota Progress */}
          {quota && (
            <div className="w-full md:w-64 space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Penyimpanan Google Drive</span>
                <span className="font-bold text-slate-700">
                  {quota.usedFormatted} / {quota.totalFormatted} ({quota.percent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    quota.percent > 90 ? 'bg-red-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${quota.percent}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={loadDriveData}
              disabled={isLoadingFiles}
              className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
              title="Perbarui Data Drive"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="px-3 py-2 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Putus Akun</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Fast Actions Bar: Cadangkan Data Buku Induk */}
      {accessToken && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-sky-600" />
                <span>Pusat Cadangan &amp; Sinkronisasi Data Sekolah</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Total {students.length} Peserta Didik terdaftar di database buku induk lokal.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleBackupJson}
                disabled={isBackingUp}
                className="px-3.5 py-1.5 bg-[#0284c7] hover:bg-sky-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition disabled:opacity-50"
              >
                <CloudUpload className="w-3.5 h-3.5" />
                <span>{isBackingUp ? 'Menyimpan...' : 'Cadangkan Data Lengkap (JSON)'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                disabled={isBackingUp}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition disabled:opacity-50"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{isBackingUp ? 'Mengekspor...' : 'Ekspor Format Excel / CSV'}</span>
              </button>
            </div>
          </div>

          {backupSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{backupSuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setBackupSuccessMessage(null)}
                className="text-emerald-700 hover:text-emerald-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Google Drive File Explorer */}
      {accessToken && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Action toolbar & Breadcrumbs */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1 text-xs text-slate-600 flex-wrap">
              {folderBreadcrumbs.map((bc, idx) => (
                <React.Fragment key={bc.id || 'root'}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
                  <button
                    type="button"
                    onClick={() => navigateBreadcrumb(idx)}
                    className={`font-semibold px-1.5 py-0.5 rounded hover:bg-slate-200 transition cursor-pointer ${
                      idx === folderBreadcrumbs.length - 1 ? 'text-sky-700 font-bold bg-sky-50' : 'text-slate-600'
                    }`}
                  >
                    {bc.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Folder & Upload Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsNewFolderModalOpen(true)}
                className="px-3 py-1.5 border border-slate-300 hover:bg-white text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
              >
                <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
                <span>Folder Baru</span>
              </button>

              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#dc2626] hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
              >
                <CloudUpload className="w-3.5 h-3.5" />
                <span>Upload Berkas</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-slate-100 flex items-center gap-2 bg-white">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') loadDriveData();
              }}
              placeholder="Cari berkas di Google Drive (tekan Enter)..."
              className="w-full text-xs bg-transparent focus:outline-none text-slate-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  loadDriveData();
                }}
                className="text-slate-400 hover:text-slate-600 text-xs px-2"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Table List of Drive Files */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 uppercase font-bold text-slate-500 text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3 min-w-[240px]">NAMA BERKAS / FOLDER</th>
                  <th className="p-3 w-36">TIPE BERKAS</th>
                  <th className="p-3 w-28 text-right">UKURAN</th>
                  <th className="p-3 w-36 text-center">TERAKHIR DIUBAH</th>
                  <th className="p-3 w-28 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingFiles ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
                        <span>Memuat data berkas dari Google Drive...</span>
                      </div>
                    </td>
                  </tr>
                ) : files.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Tidak ada berkas atau folder di direktori Google Drive ini.
                    </td>
                  </tr>
                ) : (
                  files.map((file) => {
                    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                    return (
                      <tr key={file.id} className="hover:bg-slate-50 transition">
                        {/* File Name & Icon */}
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            {getFileIcon(file.mimeType)}
                            {isFolder ? (
                              <button
                                type="button"
                                onClick={() => navigateIntoFolder(file)}
                                className="font-bold text-slate-800 hover:text-sky-600 text-left transition cursor-pointer truncate max-w-sm sm:max-w-md"
                              >
                                {file.name}
                              </button>
                            ) : (
                              <span className="font-medium text-slate-800 truncate max-w-sm sm:max-w-md">
                                {file.name}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* File Type */}
                        <td className="p-3 text-slate-500 font-mono text-[11px]">
                          {isFolder ? 'Folder' : file.mimeType.split('/').pop() || 'File'}
                        </td>

                        {/* File Size */}
                        <td className="p-3 text-right text-slate-600 font-mono text-[11px]">
                          {isFolder ? '-' : formatFileSize(file.size)}
                        </td>

                        {/* Modified Time */}
                        <td className="p-3 text-center text-slate-500 text-[11px]">
                          {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('id-ID') : '-'}
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-md hover:bg-sky-50 text-sky-600 transition"
                                title="Buka di Google Drive"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => setFileToDelete(file)}
                              className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                              title="Hapus Berkas dari Google Drive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: NEW FOLDER MODAL */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4 text-amber-500" />
                <span>Buat Folder Google Drive Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewFolderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Folder
                </label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Contoh: Berkas Mutasi 2026/2027"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder || !newFolderName.trim()}
                  className="px-4 py-1.5 bg-[#0284c7] hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isCreatingFolder ? 'Membuat...' : 'Buat Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD LOCAL FILE MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CloudUpload className="w-4 h-4 text-rose-600" />
                <span>Upload Berkas ke Google Drive</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUploadLocalFile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Berkas dari Komputer
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFileObj(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                />
                {uploadFileObj && (
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Nama: {uploadFileObj.name} ({formatFileSize(uploadFileObj.size.toString())})
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadFileObj}
                  className="px-4 py-1.5 bg-[#dc2626] hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? 'Mengunggah...' : 'Upload Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EXPLICIT CONFIRMATION DIALOG (Mandatory for destructive Google Drive operations) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-amber-400 text-amber-500 flex items-center justify-center mx-auto text-3xl font-light">
              ?
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Hapus Berkas dari Google Drive?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>"{fileToDelete.name}"</strong>? Berkas akan dipindahkan ke Sampah Google Drive Anda.
            </p>
            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-[#5c6873] hover:bg-slate-600 text-white font-bold rounded-lg text-xs cursor-pointer transition shadow-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-[#dc2626] hover:bg-red-700 text-white font-bold rounded-lg text-xs cursor-pointer transition shadow-xs disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Berkas!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
