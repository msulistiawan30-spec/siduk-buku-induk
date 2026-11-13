import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { Cloud, CloudOff, CloudUpload, AlertTriangle, Loader2, CheckCircle2, X } from 'lucide-react';
import { getSyncState, subscribeSync, pushNow, pullNow, resolveConflict } from '../services/driveSync';
import { googleSignIn, isDriveConfigured } from '../services/googleDriveService';
import { formatBytes } from '../services/snapshot';

const fmtTime = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-';

export const DriveSyncControl: React.FC = () => {
  const s = useSyncExternalStore(subscribeSync, getSyncState);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (s.status === 'conflict') setOpen(true);
  }, [s.status]);

  const connectNow = async () => {
    setErr('');
    try {
      await googleSignIn();
    } catch (e: any) {
      setErr(e?.code === 'auth/popup-closed-by-user' ? 'Jendela login ditutup.' : e?.message || 'Gagal masuk ke Google.');
    }
  };

  const icon =
    s.status === 'syncing' || s.status === 'connecting' ? (
      <Loader2 className="w-3.5 h-3.5 animate-spin" />
    ) : s.status === 'offline' ? (
      <CloudOff className="w-3.5 h-3.5" />
    ) : s.status === 'error' || s.status === 'conflict' ? (
      <AlertTriangle className="w-3.5 h-3.5" />
    ) : s.status === 'dirty' ? (
      <CloudUpload className="w-3.5 h-3.5" />
    ) : (
      <Cloud className="w-3.5 h-3.5" />
    );

  const tone =
    s.status === 'idle'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : s.status === 'error' || s.status === 'conflict'
      ? 'bg-amber-50 text-amber-800 border-amber-300'
      : s.status === 'offline'
      ? 'bg-slate-50 text-slate-600 border-slate-200'
      : 'bg-sky-50 text-sky-700 border-sky-200';

  const label =
    { offline: 'Drive: putus', connecting: 'Menghubungkan', idle: 'Tersimpan', dirty: 'Belum dikirim', syncing: 'Menyimpan', conflict: 'Perlu dipilih', error: 'Gagal' }[s.status];

  const connected = s.status !== 'offline';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[11px] font-semibold ${tone}`}
        title="Status penyimpanan Google Drive"
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 text-xs text-slate-700">
          <div className="flex items-start justify-between mb-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-sky-600" /> Penyimpanan Google Drive
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="mb-3 leading-relaxed">{s.message}</p>

          {!isDriveConfigured && (
            <p className="mb-3 p-2 rounded bg-amber-50 border border-amber-200 text-amber-800">
              Firebase belum dikonfigurasi. Lihat README bagian "Konfigurasi".
            </p>
          )}

          {connected && (
            <dl className="mb-3 space-y-1 text-[11px]">
              {s.userEmail && (
                <div className="flex justify-between"><dt className="text-slate-500">Akun</dt><dd className="font-semibold">{s.userEmail}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-slate-500">Terakhir sinkron</dt><dd className="font-semibold">{fmtTime(s.lastSyncedAt)}</dd></div>
              {s.sizeBytes > 0 && (
                <div className="flex justify-between"><dt className="text-slate-500">Ukuran data</dt><dd className="font-semibold">{formatBytes(s.sizeBytes)}</dd></div>
              )}
            </dl>
          )}

          {err && <p className="mb-2 text-rose-600">{err}</p>}

          {s.status === 'conflict' ? (
            <div className="space-y-2">
              <button onClick={() => resolveConflict('drive')} className="w-full py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700">
                Pakai data dari Google Drive
              </button>
              <button onClick={() => resolveConflict('device')} className="w-full py-2 rounded-lg border border-slate-300 font-semibold hover:bg-slate-50">
                Pakai data di perangkat ini (timpa Drive)
              </button>
              <p className="text-[10px] text-slate-500">Data yang tidak dipilih tidak akan dipakai lagi. Salinan harian di folder Cadangan tetap ada.</p>
            </div>
          ) : !connected ? (
            <button
              onClick={connectNow}
              disabled={!isDriveConfigured}
              className="w-full py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Hubungkan Google Drive
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => pushNow()} disabled={s.status === 'syncing'} className="flex-1 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-50">
                Simpan sekarang
              </button>
              <button
                onClick={() => window.confirm('Data di perangkat ini akan diganti dengan data dari Google Drive. Lanjutkan?') && pullNow()}
                disabled={s.status === 'syncing'}
                className="flex-1 py-2 rounded-lg border border-slate-300 font-semibold hover:bg-slate-50 disabled:opacity-50"
              >
                Muat dari Drive
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
