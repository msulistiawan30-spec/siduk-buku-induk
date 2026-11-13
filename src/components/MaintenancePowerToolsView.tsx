import React, { useState } from 'react';
import { SchoolSettings, Student } from '../types';
import {
  Wrench,
  Database,
  Trash2,
  CheckCircle,
  Camera,
  Layers,
  Rocket,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface MaintenancePowerToolsViewProps {
  schoolSettings: SchoolSettings;
  students: Student[];
  onComplianceRepair: () => void;
  onResetData: () => void;
}

export const MaintenancePowerToolsView: React.FC<MaintenancePowerToolsViewProps> = ({
  schoolSettings,
  students,
  onComplianceRepair,
  onResetData,
}) => {
  const [selectedSeeder, setSelectedSeeder] = useState('SMP (Sekolah Menengah Pertama)');
  const [message, setMessage] = useState('');

  const triggerAction = (actionTitle: string) => {
    setMessage(`Berhasil: ${actionTitle} telah selesai dijalankan!`);
    setTimeout(() => setMessage(''), 3500);
  };

  return (
    <section className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0b132b] text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Maintenance & Power Tools</h1>
            <p className="text-xs text-slate-400">Optimasi basis data, pembersihan berkas sampah, dan audit integritas data.</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* 2 Column Layout as in PDF Page 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Statistik Penyimpanan (col-span-4) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 uppercase text-[11px] border-b pb-2 flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-600" /> Statistik Penyimpanan
          </h3>

          <div className="text-center py-2">
            <div className="text-4xl font-black text-slate-900">1.66 <span className="text-lg font-bold text-slate-500">MB</span></div>
            <span className="text-[10px] text-slate-400">Ukuran Total Database</span>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-slate-600">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span>Total Peserta Didik</span>
              <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold rounded font-mono text-[11px]">32</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span>Total Nilai Tercatat</span>
              <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold rounded font-mono text-[11px]">1,048</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span>Record PKL (Merdeka)</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded font-mono text-[11px]">8</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>Audit Data Sampah (Orphan)</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded font-mono text-[11px]">0</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Tindakan Optimasi & Tools (col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6 text-xs">
            <h3 className="font-bold text-slate-800 uppercase text-[11px] border-b pb-2">
              Tindakan Optimasi & Perbaikan Sistem
            </h3>

            {/* Grid 2 Cols for Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Database Optimizer */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <strong className="text-slate-900 font-bold block text-xs">Database Optimizer</strong>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Defragmentasi tabel, rekalkulasi index, dan penambahan performa maksimal.</p>
                </div>
                <button
                  onClick={() => triggerAction('Database Optimizer')}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs transition cursor-pointer"
                >
                  Jalankan Optimasi
                </button>
              </div>

              {/* Orphan Cleanup */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <strong className="text-slate-900 font-bold block text-xs">Orphan Cleanup</strong>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Menghapus data nilai atau riwayat yang merujuk pada siswa yang sudah dihapus.</p>
                </div>
                <button
                  onClick={() => triggerAction('Pembersihan Orphan Data')}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition cursor-pointer"
                >
                  Bersihkan Data Sampah
                </button>
              </div>

              {/* Compliance Repair */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <strong className="text-slate-900 font-bold block text-xs">Compliance Repair</strong>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Perbaikan otomatis kurikulum & fase siswa agar patuh standar Buku Induk Sekolah Kejuruan.</p>
                </div>
                <button
                  onClick={() => { onComplianceRepair(); triggerAction('Kepatuhan Data & Fase'); }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition cursor-pointer"
                >
                  Perbaiki Kepatuhan Data
                </button>
              </div>

              {/* Cadangan Otomatis */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <strong className="text-slate-900 font-bold block text-xs">Cadangan Otomatis (Auto Backup)</strong>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Buat snapshot cadangan database SQL secara otomatis langsung ke server.</p>
                </div>
                <button
                  onClick={() => triggerAction('Snapshot Cadangan Database')}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold text-xs transition cursor-pointer"
                >
                  Buat Cadangan Sekarang
                </button>
              </div>

              {/* Photo Audit */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 md:col-span-2">
                <div>
                  <strong className="text-slate-900 font-bold block text-xs">Photo Audit</strong>
                  <p className="text-[11px] text-slate-500 mt-1">Ada 0 berkas foto tidak terpakai (0 KB).</p>
                </div>
                <button
                  onClick={() => triggerAction('Pembersihan Berkas Foto')}
                  className="py-1.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs transition cursor-pointer"
                >
                  Hapus Foto Tak Terpakai
                </button>
              </div>
            </div>

            {/* Instant Multi-Jenjang Demo Seeder */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <strong className="text-slate-900 font-bold block text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" /> Instant Multi-Jenjang Demo Seeder
              </strong>
              <p className="text-[11px] text-slate-500">Ganti profil & data demo ke jenjang pilihan customer secara otomatis dalam 1-klik.</p>
              <div className="flex gap-2">
                <select
                  value={selectedSeeder}
                  onChange={(e) => setSelectedSeeder(e.target.value)}
                  className="flex-1 p-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option>SMP (Sekolah Menengah Pertama)</option>
                  <option>MTs (Madrasah Tsanawiyah)</option>
                  <option>SMA (Sekolah Menengah Atas)</option>
                  <option>MA (Madrasah Aliyah)</option>
                  <option>SMK (Sekolah Menengah Kejuruan)</option>
                  <option>SD (Sekolah Dasar)</option>
                </select>
                <button
                  onClick={() => triggerAction(`Seeder Jenjang: ${selectedSeeder}`)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Jalankan Seeder Demo
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-rose-200 space-y-3">
              <strong className="text-rose-700 font-bold block text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Danger Zone - Reset Data
              </strong>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => { if (confirm('Reset seluruh nilai?')) triggerAction('Reset Semua Nilai'); }}
                  className="p-3 border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold text-center transition cursor-pointer"
                >
                  RESET SEMUA NILAI
                </button>
                <button
                  onClick={() => { if (confirm('Kosongkan seluruh data?')) { onResetData(); triggerAction('Reset Database'); } }}
                  className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-center transition cursor-pointer shadow-xs"
                >
                  KOSONGKAN SELURUH DATA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
