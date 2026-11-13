import React, { useState, useEffect } from 'react';
import { Student, ProgramKeahlian, SchoolSettings } from '../types';
import {
  Users,
  Layers,
  FileCheck,
  AlertTriangle,
  Star,
  CheckCircle2,
  ArrowRight,
  UserPlus,
  Sparkles,
  PieChart,
  BarChart3,
  TrendingUp,
  School,
  Building,
  Check,
  Calendar,
  Clock,
  Tv,
  X,
  Award,
  FileText,
  Shield,
  Briefcase,
  GitFork,
  ChevronRight,
  Download,
  CheckSquare,
  GraduationCap,
} from 'lucide-react';

interface DashboardViewProps {
  students: Student[];
  programs: ProgramKeahlian[];
  schoolSettings: SchoolSettings;
  onNavigate: (menuKey: string) => void;
  onOpenStudent: (student: Student) => void;
  onOpenReleaseModal: () => void;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  programs,
  schoolSettings,
  onNavigate,
  onOpenStudent,
  onOpenReleaseModal,
  isPresentationMode = false,
  onTogglePresentationMode,
}) => {
  const totalSiswa = students.length;
  const faseE = students.filter((s) => s.fase === 'E').length;
  const faseF = students.filter((s) => s.fase === 'F').length;
  const isPlaceholderPhoto = (u?: string) => !u || /unsplash|dicebear/.test(u);
  const fotoKosong = students.filter((s) => isPlaceholderPhoto(s.photoUrl)).length;
  const nilaiKosong = students.filter((s) => !s.avgScore).length;
  const nisnKurang = students.filter((s) => !/^\d{10}$/.test((s.nisn || '').trim())).length;
  const siapCetak = students.filter(
    (s) =>
      !isPlaceholderPhoto(s.photoUrl) &&
      !!s.avgScore &&
      /^\d{10}$/.test((s.nisn || '').trim()) &&
      !!(s.fatherName || s.motherName)
  ).length;
  const pctSiap = totalSiswa ? Math.round((siapCetak / totalSiswa) * 100) : 0;

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeFormatter = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const dateFormatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      setCurrentTime(timeFormatter.format(now));
      setCurrentDateStr(dateFormatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Preset students list matching screenshot if students list is standard
  const sampleRegistrations = [
    {
      id: 'reg-1',
      fullName: 'SISWA CONTOH 1124',
      nipd: '9684/684.684',
      program: 'LPFKK',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'reg-2',
      fullName: 'SISWA CONTOH 1123',
      nipd: '9613/613.613',
      program: 'TSM',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'reg-3',
      fullName: 'SISWA CONTOH 1122',
      nipd: '9071/071.071',
      program: 'LPFKK',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'reg-4',
      fullName: 'SISWA CONTOH DUA',
      nipd: '9753/753.753',
      program: 'DPB',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'reg-5',
      fullName: 'SISWA CONTOH 1120',
      nipd: '9372/372.372',
      program: 'DPB',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header Row / Presentation Mode Bar */}
      {isPresentationMode ? (
        <div className="flex items-center justify-end pb-2">
          <button
            type="button"
            onClick={onTogglePresentationMode}
            className="px-4 py-2 bg-[#1e293b] hover:bg-[#0f172a] text-white font-extrabold rounded-lg shadow-md transition cursor-pointer flex items-center gap-2 text-xs uppercase tracking-wider"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>KELUAR PRESENTASI</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Dashboard Overview
          </h1>
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentDateStr || '28 Oct 2026'}</span>
              </div>
              <div className="px-3 py-1.5 bg-slate-800 text-white rounded-lg shadow-2xs flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-300" />
                <span>{currentTime || '09:04:06'}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onTogglePresentationMode}
              className="px-4 py-1.5 bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold rounded-lg shadow-2xs transition cursor-pointer flex items-center gap-2 text-xs uppercase tracking-wider"
            >
              <Tv className="w-3.5 h-3.5 text-sky-400" />
              <span>MODE PRESENTASI</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. 4 KARTU METRIK UTAMA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Peserta Didik */}
        <div className="bg-[#008ba3] rounded-xl p-5 text-white shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <GraduationCap className="w-24 h-24 text-white/15 absolute -right-3 -bottom-3 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-4xl font-extrabold tracking-tight">{totalSiswa}</span>
            <p className="text-xs font-medium text-sky-100 mt-1">Total Peserta Didik</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('siswa')}
            className="mt-4 text-xs font-semibold text-white/95 hover:text-white flex items-center gap-1 cursor-pointer relative z-10 w-fit"
          >
            <span>Lihat Detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Program Keahlian */}
        <div className="bg-[#10b981] rounded-xl p-5 text-white shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <Award className="w-24 h-24 text-white/15 absolute -right-3 -bottom-3 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-4xl font-extrabold tracking-tight">7</span>
            <p className="text-xs font-medium text-emerald-100 mt-1">Program Keahlian</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('keahlian')}
            className="mt-4 text-xs font-semibold text-white/95 hover:text-white flex items-center gap-1 cursor-pointer relative z-10 w-fit"
          >
            <span>Lihat Detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Nilai */}
        <div className="bg-[#f59e0b] rounded-xl p-5 text-white shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <FileText className="w-24 h-24 text-white/15 absolute -right-3 -bottom-3 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-4xl font-extrabold tracking-tight">0</span>
            <p className="text-xs font-medium text-amber-100 mt-1">Total Nilai</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('nilai')}
            className="mt-4 text-xs font-semibold text-white/95 hover:text-white flex items-center gap-1 cursor-pointer relative z-10 w-fit"
          >
            <span>Lihat Detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Log Berkas */}
        <div className="bg-[#e11d48] rounded-xl p-5 text-white shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <Shield className="w-24 h-24 text-white/15 absolute -right-3 -bottom-3 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-4xl font-extrabold tracking-tight">0</span>
            <p className="text-xs font-medium text-rose-100 mt-1">Log Berkas</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('smart-checklist')}
            className="mt-4 text-xs font-semibold text-white/95 hover:text-white flex items-center gap-1 cursor-pointer relative z-10 w-fit"
          >
            <span>Lihat Detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. STATISTIK KURIKULUM MERDEKA */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>STATISTIK KURIKULUM MERDEKA</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Total Fase E */}
          <div className="bg-white rounded-r-xl border border-slate-200 border-l-4 border-l-purple-500 p-3.5 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                TOTAL FASE E
              </span>
              <div className="text-2xl font-black text-slate-800 mt-0.5">{faseE}</div>
            </div>
            <Layers className="w-7 h-7 text-purple-400" />
          </div>

          {/* Total Fase F */}
          <div className="bg-white rounded-r-xl border border-slate-200 border-l-4 border-l-pink-500 p-3.5 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                TOTAL FASE F
              </span>
              <div className="text-2xl font-black text-slate-800 mt-0.5">{faseF}</div>
            </div>
            <Layers className="w-7 h-7 text-pink-400" />
          </div>

          {/* Projek P5 Aktif */}
          <div className="bg-white rounded-r-xl border border-slate-200 border-l-4 border-l-teal-500 p-3.5 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                PROJEK P5 AKTIF
              </span>
              <div className="text-2xl font-black text-slate-800 mt-0.5">0</div>
            </div>
            <div className="w-7 h-7 flex items-center justify-center text-teal-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="12" r="3" />
                <path d="M6 9v6M9 6h4l3 3M9 18h4l3-3" />
              </svg>
            </div>
          </div>

          {/* Siswa Dinilai P5 */}
          <div className="bg-white rounded-r-xl border border-slate-200 border-l-4 border-l-amber-500 p-3.5 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                SISWA DINILAI P5
              </span>
              <div className="text-2xl font-black text-slate-800 mt-0.5">0</div>
            </div>
            <div className="w-7 h-7 flex items-center justify-center text-amber-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
          </div>

          {/* Rekord PKL Terdata */}
          <div className="bg-white rounded-r-xl border border-slate-200 border-l-4 border-l-cyan-500 p-3.5 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                REKORD PKL TERDATA
              </span>
              <div className="text-2xl font-black text-slate-800 mt-0.5">0</div>
            </div>
            <Briefcase className="w-7 h-7 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* 3. ROW: AUDIT KESIAPAN CETAK & VERSI SISTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Audit Kesiapan Cetak Buku Induk & Kelulusan */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#008ba3]" />
              <span>Audit Kesiapan Cetak Buku Induk & Kelulusan</span>
            </h3>
            <span className="px-2 py-0.5 bg-[#e11d48] text-white text-[10px] font-bold rounded-sm">
              {pctSiap}% Siap Cetak
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Status kelengkapan elemen penting cetak (Pas Foto 3×4 resmi, NISN tervalidasi, Nilai Raport, dan Data Orang Tua) sebelum dilakukan pencetakan massal Buku Induk atau SKL.
          </p>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>{siapCetak} dari {totalSiswa} Siswa Siap Cetak Lengkap</span>
              <span>{pctSiap}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-[#008ba3] h-2 rounded-full w-0" />
            </div>
          </div>

          {/* 4 Stats Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
              <div className="text-xl font-black text-emerald-600">{siapCetak}</div>
              <span className="text-[11px] font-medium text-slate-600 flex items-center justify-center gap-1 mt-0.5">
                <Check className="w-3 h-3 text-emerald-600" /> Siap Cetak
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
              <div className="text-xl font-black text-amber-600">{fotoKosong}</div>
              <span className="text-[11px] font-medium text-slate-600 flex items-center justify-center gap-1 mt-0.5">
                <AlertTriangle className="w-3 h-3 text-amber-600" /> Foto Kosong
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
              <div className="text-xl font-black text-sky-600">{nilaiKosong}</div>
              <span className="text-[11px] font-medium text-slate-600 flex items-center justify-center gap-1 mt-0.5">
                <FileText className="w-3 h-3 text-sky-600" /> Nilai Kosong
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
              <div className="text-xl font-black text-rose-600">{nisnKurang}</div>
              <span className="text-[11px] font-medium text-slate-600 flex items-center justify-center gap-1 mt-0.5">
                <Shield className="w-3 h-3 text-rose-600" /> NISN Kurang
              </span>
            </div>
          </div>

          {/* Bottom Bar: Action & Timestamp */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <button
              type="button"
              onClick={() => onNavigate('smart-checklist')}
              className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-700 font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>📋 Rincian Audit Per Rombel & Siswa</span>
            </button>
            <div className="flex items-center gap-3 text-slate-500 text-[11px]">
              <span>Audit: 28 Oct 2026 09:03</span>
              <button
                type="button"
                onClick={() => alert('Audit kesiapan cetak diperbarui!')}
                className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <span>🛠️ Repair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Versi Sistem v1.2.0 */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-slate-600" />
              <span>Versi Sistem v1.2.0</span>
            </h3>
            <button
              type="button"
              onClick={onOpenReleaseModal}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Update 1 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                🚀
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-800 text-[11px] font-bold">
                    Major Update: Keamanan & Akurasi Data
                  </strong>
                  <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                    v1.2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed truncate">
                  Implementasi Role-Based Access Control (RBAC) yang le...
                </p>
              </div>
            </div>

            {/* Update 2 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                🚀
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-800 text-[11px] font-bold">
                    Integrasi Kurikulum Merdeka
                  </strong>
                  <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                    v1.1.1
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed truncate">
                  Penambahan fitur fase E dan F serta laporan projek P5.
                </p>
              </div>
            </div>

            {/* Update 3 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                🚀
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-800 text-[11px] font-bold">
                    Manajemen Alumni (Tracer)
                  </strong>
                  <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                    v1.1.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed truncate">
                  Fitur penelusuran jejak alumni dan statistik pekerjaan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ROW: INSIGHT JEJAK ALUMNI (TRACER) */}
      <div className="space-y-3">
        <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-[#008ba3]" />
          <span>INSIGHT JEJAK ALUMNI (TRACER)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Total Alumni */}
          <div className="md:col-span-3 bg-[#334155] text-white p-5 rounded-xl shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                TOTAL ALUMNI
              </span>
              <div className="text-3xl font-extrabold mt-1">0</div>
            </div>
            <span className="text-[10px] text-slate-400 mt-3">Terdata sejak sistem aktif</span>
          </div>

          {/* Bekerja & Kuliah */}
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-around">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">BEKERJA</span>
              <span className="text-xs font-semibold text-slate-600 block mt-1">(0%)</span>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">KULIAH</span>
              <span className="text-xs font-semibold text-slate-600 block mt-1">(0%)</span>
            </div>
          </div>

          {/* Tren Kelulusan Line Chart */}
          <div className="md:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                TREN KELULUSAN (5 TAHUN TERAKHIR)
              </span>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block font-bold uppercase">LULUSAN TERBARU</span>
                <span className="text-xl font-black text-sky-600 block leading-tight">0</span>
                <span className="text-[9px] text-slate-500 block">Tahun Lulus: 2026</span>
              </div>
            </div>

            {/* Line SVG Chart matching screenshot */}
            <div className="h-16 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 40">
                <line x1="10" y1="30" x2="490" y2="30" stroke="#0284c7" strokeWidth="2" />
                <circle cx="10" cy="30" r="4" fill="#0284c7" />
                <circle cx="130" cy="30" r="4" fill="#0284c7" />
                <circle cx="250" cy="30" r="4" fill="#0284c7" />
                <circle cx="370" cy="30" r="4" fill="#0284c7" />
                <circle cx="490" cy="30" r="4" fill="#0284c7" />
              </svg>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
                <span>2025</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ROW: TREN PENDAFTARAN & SEBARAN PROGRAM KEAHLIAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Tren Pendaftaran Tahunan */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 text-sky-600" />
              <span>Tren Pendaftaran Tahunan</span>
            </h3>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 p-1 rounded"
              title="Download Data"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-end gap-4 h-72 pt-4">
            {/* Y-axis Labels */}
            <div className="flex flex-col justify-between h-full text-[9px] font-mono text-slate-400 text-right pr-2 select-none">
              <span>1145</span>
              <span>1095</span>
              <span>1045</span>
              <span>995</span>
              <span>945</span>
              <span>895</span>
              <span>845</span>
              <span>795</span>
              <span>745</span>
              <span>695</span>
              <span>645</span>
              <span>595</span>
              <span>545</span>
              <span>495</span>
              <span>445</span>
              <span>395</span>
              <span>345</span>
              <span>295</span>
              <span>245</span>
              <span>195</span>
              <span>145</span>
              <span>95</span>
              <span>45</span>
            </div>

            {/* Chart Area with Grid and Bar */}
            <div className="flex-1 h-full border-b border-l border-slate-200 flex flex-col justify-end items-center relative">
              {/* Background horizontal lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border-b border-slate-200 w-full" />
                ))}
              </div>

              {/* Bar at 2026 reaching 1145 */}
              <div className="w-16 bg-sky-500 hover:bg-sky-600 transition rounded-t-sm h-full flex items-center justify-center shadow-xs cursor-pointer group relative">
                <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 absolute -top-5 transition">
                  1145
                </span>
              </div>
            </div>
          </div>
          <div className="text-center text-xs font-mono text-slate-600 pl-10 font-bold">
            2026
          </div>
        </div>

        {/* Sebaran Program Keahlian */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Sebaran Program Keahlian
            </h3>
          </div>

          <div className="py-2 flex flex-col items-center justify-center">
            {/* SVG Donut Chart */}
            <div className="relative w-44 h-44 my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                {/* 7 Segments */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0284c7" strokeWidth="12" strokeDasharray="34 205" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="34 205" strokeDashoffset="-34" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="12" strokeDasharray="34 205" strokeDashoffset="-68" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#facc15" strokeWidth="12" strokeDasharray="34 205" strokeDashoffset="-102" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray="34 205" strokeDashoffset="-136" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#475569" strokeWidth="12" strokeDasharray="34 205" strokeDashoffset="-170" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#cbd5e1" strokeWidth="12" strokeDasharray="35 205" strokeDashoffset="-204" />
              </svg>
            </div>

            {/* Legend 7 Programs matching screenshot */}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[10px] text-slate-700 font-medium pt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                <span>Desain Komunikasi Visual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span>DPB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                <span>DPIB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#facc15]" />
                <span>LPFKK</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span>Teknik Kendaraan Ringan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#475569]" />
                <span>TL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]" />
                <span>TSM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. ROW: REGISTRASI TERBARU & IDENTITAS SEKOLAH + DEMOGRAFI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Registrasi Peserta Didik Terbaru */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Users className="w-4 h-4 text-[#008ba3]" />
              <span>Registrasi Peserta Didik Terbaru</span>
            </h3>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1 border-b border-slate-100">
            <span className="col-span-6">PESERTA DIDIK</span>
            <span className="col-span-4">PROGRAM KEAHLIAN</span>
            <span className="col-span-2 text-right">STATUS</span>
          </div>

          {/* Student Rows */}
          <div className="divide-y divide-slate-100 text-xs">
            {sampleRegistrations.map((student) => (
              <div
                key={student.id}
                className="py-3 grid grid-cols-12 items-center hover:bg-slate-50/80 transition px-1 rounded-lg"
              >
                <div className="col-span-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 border border-slate-200 shrink-0">
                    <img
                      src={student.avatar}
                      alt={student.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <strong className="text-slate-800 text-xs block font-bold leading-tight">
                      {student.fullName}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-mono">
                      NIPD: {student.nipd}
                    </span>
                  </div>
                </div>

                <div className="col-span-4">
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-700">
                    {student.program}
                  </span>
                </div>

                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onNavigate('siswa')}
                    className="w-6 h-6 rounded-full border border-sky-400 text-sky-600 hover:bg-sky-50 flex items-center justify-center transition cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => onNavigate('siswa')}
              className="text-xs font-bold text-slate-700 hover:text-sky-600 uppercase tracking-wide cursor-pointer"
            >
              LIHAT SEMUA PESERTA DIDIK &gt;
            </button>
          </div>
        </div>

        {/* Right: Identitas Sekolah Card & Demografi Gender */}
        <div className="lg:col-span-4 space-y-4">
          {/* Dark Navy School Card */}
          <div className="bg-[#0b1b2b] text-white p-5 rounded-xl shadow-xs space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide">
                  {schoolSettings.name || 'SMKN DANDER'}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  # NPSN: {schoolSettings.npsn || '20541259'}
                </span>
              </div>
              <div className="w-9 h-11 bg-white p-1 rounded shadow-xs flex items-center justify-center">
                {/* Mini School Shield */}
                <svg className="w-full h-full" viewBox="0 0 100 115" fill="none">
                  <path d="M50 3L93 18C93 65 67 100 50 110C33 100 7 65 7 18L50 3Z" fill="#38bdf8" />
                  <path d="M50 10L86 23C86 63 64 94 50 102C36 94 14 63 14 23L50 10Z" fill="#0284c7" />
                  <circle cx="50" cy="55" r="14" fill="#ffffff" />
                  <path d="M50 35C45 42 43 47 48 53C53 48 56 42 50 35Z" fill="#f97316" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-800">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block">Tahun Ajaran</span>
                <strong className="text-xs font-extrabold text-white">
                  {schoolSettings.activeAcademicYear || '2026/2027'}
                </strong>
              </div>
              <div className="text-center border-l border-slate-800">
                <span className="text-[10px] text-slate-400 block">Semester</span>
                <strong className="text-xs font-extrabold text-white">
                  {schoolSettings.activeSemester || '1 (Ganjil)'}
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">Kepala Sekolah</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white shrink-0" />
                <strong className="text-xs text-white">
                  {schoolSettings.principalName || 'Dr. Molyono,.M.Pd'}
                </strong>
              </div>
            </div>
          </div>

          {/* Demografi Gender with Yellow Top Border */}
          <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-amber-400 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Demografi Gender
            </h4>

            {/* Laki-laki */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="text-sky-600 font-bold">♂</span> Laki-laki
                </span>
                <span className="text-slate-600 font-medium">840 Peserta Didik (73%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#008ba3] h-2 rounded-full" style={{ width: '73%' }} />
              </div>
            </div>

            {/* Perempuan */}
            <div className="space-y-1 text-xs pt-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="text-pink-500 font-bold">♀</span> Perempuan
                </span>
                <span className="text-slate-600 font-medium">305 Peserta Didik (27%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: '27%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. ROW: PERBANDINGAN PRESTASI & RINGKASAN KETIDAKHADIRAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Perbandingan Prestasi Akademik with Gold Top Border */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 border-t-4 border-t-amber-400 p-5 shadow-xs space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎓</span> Perbandingan Prestasi Akademik
            </h3>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Rata-rata Nilai Akhir per Program Keahlian
            </span>
          </div>

          <div className="h-44 border-b border-l border-slate-200 relative flex items-end justify-center">
            {/* Grid lines */}
            <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20 px-2">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="border-r border-slate-200 h-full" />
              ))}
            </div>
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
            <span>0</span>
            <span>10</span>
            <span>20</span>
            <span>30</span>
            <span>40</span>
            <span>50</span>
            <span>60</span>
            <span>70</span>
            <span>80</span>
            <span>90</span>
            <span>100</span>
          </div>
        </div>

        {/* Ringkasan Ketidakhadiran with Green Top Border */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 border-t-4 border-t-emerald-500 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ringkasan Ketidakhadiran</span>
                </h3>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Total Akumulasi Izin, Sakit & Alfa
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-medium text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1.5 bg-sky-500 rounded-sm" /> Sakit
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1.5 bg-amber-500 rounded-sm" /> Izin
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1.5 bg-rose-500 rounded-sm" /> Alfa
                </span>
              </div>
            </div>

            <div className="h-28 flex items-center justify-center text-slate-400 text-xs">
              {/* Clean canvas area */}
            </div>
          </div>

          {/* Bottom Numbers matching screenshot */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
            <div>
              <span className="text-xl font-bold text-sky-600 block">0</span>
              <span className="text-[10px] text-slate-500 font-medium">Sakit</span>
            </div>
            <div>
              <span className="text-xl font-bold text-amber-500 block">0</span>
              <span className="text-[10px] text-slate-500 font-medium">Izin</span>
            </div>
            <div>
              <span className="text-xl font-bold text-rose-600 block">0</span>
              <span className="text-[10px] text-slate-500 font-medium">Alfa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
