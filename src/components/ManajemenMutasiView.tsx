import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Student, SchoolSettings } from '../types';
import {
  ArrowLeftRight,
  Printer,
  Plus,
  Search,
  Eye,
  RotateCcw,
  CheckCircle2,
  X,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  School,
  Save,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageCircle,
  Undo2,
  Info,
  Lock,
} from 'lucide-react';

export interface MutasiRecordItem {
  id: string;
  studentId: string;
  no: number;
  nipd: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  cls: string;
  status: string; // 'Mutasi Keluar'
  date: string; // '02-11-2026'
  destination: string; // '-' or destination school
  letterNumber: string; // e.g. '421.3/045/SMK-AI/2026'
  reason: string;
}

interface ManajemenMutasiViewProps {
  students: Student[];
  schoolSettings: SchoolSettings;
  initialMode?: 'manajemen' | 'buku_mutasi';
  onNavigate?: (menu: string) => void;
  onUpdateStudent?: (student: Student) => void;
  onUpdateStudents?: (students: Student[]) => void;
}

// Initial mock student matching user screenshot image_a5e37fdb.png
const DEFAULT_MUTASI_LIST: MutasiRecordItem[] = [
  {
    id: 'mut-bunga-01',
    studentId: 's-bunga',
    no: 1,
    nipd: '0000/000.000',
    nisn: '0000000000',
    name: 'SISWA CONTOH',
    gender: 'P',
    cls: 'LPFKK',
    status: 'Keluar',
    date: '02-11-2026',
    destination: 'Keluar',
    letterNumber: '421.3/045/SMK-AI/2026',
    reason: 'Keluar',
  },
  {
    id: 'mut-rizki-01',
    studentId: 's-rizki',
    no: 2,
    nipd: '0000/000.000',
    nisn: '0000000000',
    name: 'SISWA CONTOH',
    gender: 'L',
    cls: 'TSM',
    status: 'Mutasi Keluar',
    date: '02-11-2026',
    destination: '-',
    letterNumber: '421.3/045/SMK-AI/2026',
    reason: 'Pindah domisili mengikuti orang tua',
  },
];

export const ManajemenMutasiView: React.FC<ManajemenMutasiViewProps> = ({
  students,
  schoolSettings,
  initialMode = 'manajemen',
  onNavigate,
  onUpdateStudent,
  onUpdateStudents,
}) => {
  // Current active sub-tab: 'manajemen' (/siswa/mutasi) or 'buku_mutasi' (/laporan/buku_mutasi)
  const [activeTab, setActiveTab] = useState<'manajemen' | 'buku_mutasi'>(initialMode);

  // Sync when initialMode prop changes (e.g. user clicked sidebar "Buku Mutasi" vs "Manajemen Mutasi")
  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  // Persistent mutasi state
  const [mutasiRecords, setMutasiRecords] = useState<MutasiRecordItem[]>(() => {
    try {
      const saved = localStorage.getItem('siduk_mutasi_datastore');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_MUTASI_LIST;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('siduk_mutasi_datastore', JSON.stringify(mutasiRecords));
    } catch {
      // ignore
    }
  }, [mutasiRecords]);

  // Alert & Notification Banner
  const [notification, setNotification] = useState<string | null>(null);

  // Auto-dismiss notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Modal controls
  const [isProsesModalOpen, setIsProsesModalOpen] = useState<boolean>(false);
  const [selectedStudentForSurat, setSelectedStudentForSurat] = useState<MutasiRecordItem | null>(null);
  const [studentToRestore, setStudentToRestore] = useState<MutasiRecordItem | null>(null);

  // Table filtering and pagination
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Form state for "Proses Mutasi Keluar Peserta Didik" (Gambar 4)
  const [formStudentId, setFormStudentId] = useState<string>('');
  const [formDate, setFormDate] = useState<string>('2026-11-02');
  const [formDestination, setFormDestination] = useState<string>('');
  const [formLetterNumber, setFormLetterNumber] = useState<string>('');
  const [formReason, setFormReason] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Real-time clock (matching screenshot date format)
  const [currentTime, setCurrentTime] = useState<string>('09:44:15');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered mutasi records
  const filteredRecords = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return mutasiRecords;
    return mutasiRecords.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.nipd.toLowerCase().includes(term) ||
        m.nisn.toLowerCase().includes(term) ||
        m.cls.toLowerCase().includes(term) ||
        m.destination.toLowerCase().includes(term) ||
        m.status.toLowerCase().includes(term)
    );
  }, [mutasiRecords, searchTerm]);

  // Paginated records
  const totalPages = Math.ceil(filteredRecords.length / entriesPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredRecords.slice(start, start + entriesPerPage);
  }, [filteredRecords, currentPage, entriesPerPage]);

  // Active students eligible for mutasi (not already mutated)
  const availableStudents = useMemo(() => {
    const mutatedNipds = new Set(mutasiRecords.map((m) => m.nipd));
    return students.filter((s) => !mutatedNipds.has(s.nipd));
  }, [students, mutasiRecords]);

  // Format date helper: YYYY-MM-DD -> DD-MM-YYYY
  const formatDisplayDate = (dStr: string) => {
    if (!dStr) return '-';
    if (dStr.includes('-') && dStr.split('-')[0].length === 4) {
      const [y, m, d] = dStr.split('-');
      return `${d}-${m}-${y}`;
    }
    return dStr;
  };

  // ==========================================================
  // ACTION: SUBMIT PROSES MUTASI (Gambar 4 -> Gambar 5)
  // ==========================================================
  const handleSaveMutasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentId) {
      setFormError('Silakan pilih peserta didik aktif terlebih dahulu.');
      return;
    }

    const targetStudent = students.find((s) => s.id === formStudentId);
    if (!targetStudent) {
      setFormError('Data siswa tidak ditemukan.');
      return;
    }

    const newRecord: MutasiRecordItem = {
      id: `mut-${Date.now()}`,
      studentId: targetStudent.id,
      no: mutasiRecords.length + 1,
      nipd: targetStudent.nipd || '0000/000.000',
      nisn: targetStudent.nisn || '0000000000',
      name: targetStudent.fullName,
      gender: (targetStudent.gender as 'L' | 'P') || 'L',
      cls: targetStudent.currentClass || targetStudent.programKeahlian || 'TSM',
      status: 'Mutasi Keluar',
      date: formatDisplayDate(formDate),
      destination: formDestination.trim() || '-',
      letterNumber: formLetterNumber.trim() || '421.3/045/SMK-AI/2026',
      reason: formReason.trim() || 'Pindah sekolah / mutasi keluar',
    };

    // Update master students data if callbacks available
    if (onUpdateStudents && students) {
      onUpdateStudents(
        students.map((s) =>
          s.id === targetStudent.id
            ? {
                ...s,
                status: 'Mutasi Keluar' as const,
                catatanKhusus: `Mutasi keluar tgl ${formatDisplayDate(formDate)}: ${formReason.trim()}`,
              }
            : s
        )
      );
    } else if (onUpdateStudent) {
      onUpdateStudent({
        ...targetStudent,
        status: 'Mutasi Keluar' as const,
        catatanKhusus: `Mutasi keluar tgl ${formatDisplayDate(formDate)}: ${formReason.trim()}`,
      });
    }

    setMutasiRecords((prev) => [newRecord, ...prev]);
    setIsProsesModalOpen(false);
    setFormStudentId('');
    setFormDestination('');
    setFormLetterNumber('');
    setFormReason('');
    setFormError(null);

    // Green notification matching Gambar 5
    setNotification('Data berhasil Siswa berhasil dimutasi keluar dan dicatat di riwayat mutasi.');
  };

  // ==========================================================
  // ACTION: RESTORE STUDENT BACK TO ACTIVE (Kembalikan Ke Aktif)
  // ==========================================================
  const handleRestoreToActive = (item: MutasiRecordItem) => {
    // Open dedicated interactive in-app confirmation modal (works reliably inside iframes)
    setStudentToRestore(item);
  };

  const confirmRestoreAction = () => {
    if (!studentToRestore) return;
    const item = studentToRestore;

    // Remove from mutasi records
    setMutasiRecords((prev) => prev.filter((m) => m.id !== item.id));

    // Restore student in master list
    if (onUpdateStudents && students) {
      onUpdateStudents(
        students.map((s) => {
          if (s.id === item.studentId || s.nipd === item.nipd || s.fullName.toLowerCase() === item.name.toLowerCase()) {
            return {
              ...s,
              status: 'Aktif' as const,
              catatanKhusus: undefined,
            };
          }
          return s;
        })
      );
    } else if (onUpdateStudent && students) {
      const existing = students.find((s) => s.id === item.studentId || s.nipd === item.nipd || s.fullName.toLowerCase() === item.name.toLowerCase());
      if (existing) {
        onUpdateStudent({
          ...existing,
          status: 'Aktif' as const,
          catatanKhusus: undefined,
        });
      }
    }

    setNotification(`✓ Siswa ${item.name} berhasil dikembalikan ke status Aktif.`);
    setStudentToRestore(null);
  };

  // ==========================================================
  // RENDER: SUB-VIEW 2 & 3: BUKU MUTASI PESERTA DIDIK (Gambar 2 & 3)
  // ==========================================================
  const renderBukuMutasiTab = () => {
    return (
      <div className="space-y-6">
        {/* Top Title & Header matching Gambar 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Buku Mutasi Peserta Didik
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              smkn-dander.syntaxtrust.web.id/laporan/buku_mutasi
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> 02 Nov 2026
            </span>
            <span className="flex items-center gap-1 bg-slate-900 text-white font-mono px-2.5 py-1 rounded-md shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> {currentTime}
            </span>
          </div>
        </div>

        {/* Card: Rekapitulasi Buku Mutasi Peserta Didik */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Card Top Action Bar matching Gambar 2 */}
          <div className="p-3.5 bg-white border-b border-rose-200/60 flex items-center justify-between flex-wrap gap-3 print:hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
              <ArrowLeftRight className="w-4 h-4 text-rose-600" />
              <span>Rekapitulasi Buku Mutasi Peserta Didik</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('manajemen')}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Ke Manajemen Mutasi
              </button>

              {/* Red Print Button matching Gambar 2 */}
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-[#dc2626] hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
              >
                <Printer className="w-3.5 h-3.5" /> CETAK BUKU MUTASI
              </button>
            </div>
          </div>

          {/* Printable Document Sheet matching Gambar 2 & Gambar 3 */}
          <div className="p-8 sm:p-12 text-slate-900 bg-white" id="buku-mutasi-print">
            {/* Title Block */}
            <div className="text-center mb-8">
              <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-950 font-serif">
                REKAPITULASI MUTASI PESERTA DIDIK
              </h2>
              <p className="text-xs sm:text-sm font-bold uppercase text-slate-800 font-serif tracking-wide mt-1">
                {schoolSettings.name || 'SMKN DANDER'}
              </p>
              <p className="text-[11px] text-slate-600 font-serif mt-0.5">
                Tahun Pelajaran: {schoolSettings.activeAcademicYear || '2026/2027'}
              </p>
            </div>

            {/* Official Two-Tier Table matching Gambar 2 & 3 */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-900 font-sans">
                <thead className="bg-slate-50 uppercase text-[10px] font-extrabold text-slate-950 text-center">
                  <tr>
                    <th rowSpan={2} className="border border-slate-900 p-2 w-10">
                      NO
                    </th>
                    <th rowSpan={2} className="border border-slate-900 p-2 w-36">
                      NIPD / NISN
                    </th>
                    <th rowSpan={2} className="border border-slate-900 p-2 text-left min-w-[200px]">
                      NAMA LENGKAP
                    </th>
                    <th rowSpan={2} className="border border-slate-900 p-2 w-12 text-center">
                      L/P
                    </th>
                    <th rowSpan={2} className="border border-slate-900 p-2 w-20 text-center">
                      KELAS
                    </th>
                    <th colSpan={3} className="border border-slate-900 p-2 bg-slate-100/70 text-center">
                      KETERANGAN MUTASI (KELUAR)
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-slate-900 p-2 w-28 text-center">
                      TANGGAL
                    </th>
                    <th className="border border-slate-900 p-2 w-28 text-center">
                      STATUS
                    </th>
                    <th className="border border-slate-900 p-2 text-center">
                      ALASAN / SEKOLAH TUJUAN
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mutasiRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="border border-slate-900 p-8 text-center text-slate-400 italic text-[11px]"
                      >
                        Tidak ada data mutasi yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    mutasiRecords.map((m, idx) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="border border-slate-900 p-2 text-center font-bold">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-900 p-2 text-center font-mono">
                          <strong className="block text-slate-900">{m.nipd}</strong>
                          <span className="text-[10px] text-slate-500">{m.nisn}</span>
                        </td>
                        <td className="border border-slate-900 p-2 font-bold uppercase text-slate-900">
                          {m.name}
                        </td>
                        <td className="border border-slate-900 p-2 text-center font-semibold">
                          {m.gender}
                        </td>
                        <td className="border border-slate-900 p-2 text-center font-semibold">
                          {m.cls}
                        </td>
                        <td className="border border-slate-900 p-2 text-center font-medium">
                          {m.date}
                        </td>
                        <td className="border border-slate-900 p-2 text-center font-bold text-rose-700">
                          {m.status}
                        </td>
                        <td className="border border-slate-900 p-2 text-center text-slate-700">
                          {m.destination || m.reason || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Signature Block matching Gambar 2 & 3 */}
            <div className="mt-16 grid grid-cols-2 text-center text-xs text-slate-900 font-serif">
              {/* Left: Kepala Sekolah */}
              <div className="flex flex-col items-center">
                <p className="text-[11px]">Mengetahui,</p>
                <p className="font-semibold mb-20 text-[11px]">Kepala Sekolah,</p>
                <p className="font-bold underline text-xs">
                  {schoolSettings.principalName || 'Dr. Molyono.,M.Mpd'}
                </p>
                <p className="text-[10px] text-slate-600 font-sans mt-0.5">
                  NIP. {schoolSettings.principalNip || '-'}
                </p>
              </div>

              {/* Right: Kepala Urusan Tata Usaha */}
              <div className="flex flex-col items-center">
                <p className="text-[11px]">Bojonegoro, 02 November 2026</p>
                <p className="font-semibold mb-20 text-[11px]">Kepala Urusan Tata Usaha,</p>
                <p className="font-bold underline uppercase text-xs">
                  {schoolSettings.administrationHead || 'M. EKO HARIS SULISTIAWAN.,S.SOS'}
                </p>
                <p className="text-[10px] text-slate-600 font-sans mt-0.5">
                  NIP. {schoolSettings.administrationNip || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================
  // RENDER: MAIN "MANAJEMEN MUTASI PESERTA DIDIK" (Gambar 1 & Gambar 5)
  // ==========================================================
  if (activeTab === 'buku_mutasi') {
    return renderBukuMutasiTab();
  }

  return (
    <section className="space-y-6">
      {/* Top Title & Header matching Gambar 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Manajemen Mutasi Peserta Didik
          </h1>
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

      {/* Card: Manajemen Mutasi & Peserta Didik Keluar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Card Header matching Gambar 1 */}
        <div className="p-3.5 bg-white border-b border-rose-200/60 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
            <ArrowLeftRight className="w-4 h-4 text-rose-600" />
            <span>Manajemen Mutasi &amp; Peserta Didik Keluar</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Button 1: Buku Mutasi Register */}
            <button
              type="button"
              onClick={() => setActiveTab('buku_mutasi')}
              className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" /> Buku Mutasi Register
            </button>

            {/* Button 2: + Proses Mutasi Siswa */}
            <button
              type="button"
              onClick={() => {
                setFormError(null);
                setIsProsesModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-[#dc2626] hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" /> + Proses Mutasi Siswa
            </button>
          </div>
        </div>

        {/* Table Controls (Show entries & Search) matching Gambar 1 */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span>Tampilkan</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-300 rounded px-2 py-1 text-xs bg-white focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entri</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Cari:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder=""
              className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none w-48 sm:w-60"
            />
          </div>
        </div>

        {/* Table matching Gambar 1 & Gambar 5 */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 uppercase font-bold text-slate-600 text-[10px] border-y border-slate-200">
              <tr>
                <th className="p-3 w-12 text-center">NO</th>
                <th className="p-3 w-36">NIPD</th>
                <th className="p-3 min-w-[200px]">NAMA LENGKAP</th>
                <th className="p-3 text-center w-36">STATUS</th>
                <th className="p-3 text-center w-32">TANGGAL</th>
                <th className="p-3 text-center min-w-[180px]">ALASAN / SEKOLAH TUJUAN</th>
                <th className="p-3 text-center w-28">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada data yang tersedia pada tabel ini
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((m, idx) => {
                  const globalIdx = (currentPage - 1) * entriesPerPage + idx + 1;

                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition">
                      {/* NO */}
                      <td className="p-3 text-center font-bold text-slate-400">
                        {globalIdx}
                      </td>

                      {/* NIPD & NISN */}
                      <td className="p-3 font-mono">
                        <strong className="block text-slate-900 text-xs">{m.nipd}</strong>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {m.nisn}
                        </span>
                      </td>

                      {/* NAMA LENGKAP & KELAS */}
                      <td className="p-3">
                        <strong className="text-slate-900 text-xs block font-bold uppercase">
                          {m.name}
                        </strong>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase block mt-0.5">
                          {m.cls}
                        </span>
                      </td>

                      {/* STATUS: Red pill matching Gambar 5 */}
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#dc2626] text-white shadow-2xs">
                          ➜ {m.status}
                        </span>
                      </td>

                      {/* TANGGAL */}
                      <td className="p-3 text-center font-mono text-slate-700">
                        {m.date}
                      </td>

                      {/* ALASAN / SEKOLAH TUJUAN */}
                      <td className="p-3 text-center text-slate-600">
                        {m.destination || m.reason || '-'}
                      </td>

                      {/* AKSI: Cyan eye & Orange undo button matching Gambar 5 */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1. Cyan Eye Button (Cetak Surat Keterangan Pindah) */}
                          <button
                            type="button"
                            onClick={() => setSelectedStudentForSurat(m)}
                            className="w-7 h-7 rounded bg-[#008ba3] hover:bg-cyan-700 text-white flex items-center justify-center shadow-2xs transition cursor-pointer"
                            title="Lihat / Cetak Surat Keterangan Pindah"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. Orange Undo Button (Kembalikan Ke Aktif) */}
                          <button
                            type="button"
                            onClick={() => handleRestoreToActive(m)}
                            className="w-7 h-7 rounded bg-[#f59e0b] hover:bg-amber-600 active:scale-95 text-white flex items-center justify-center shadow-2xs transition cursor-pointer"
                            title="Kembalikan Ke Aktif"
                            aria-label={`Kembalikan ${m.name} ke status Aktif`}
                          >
                            <Undo2 className="w-3.5 h-3.5 pointer-events-none" />
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

        {/* Table Footer: Entries count & Pagination matching Gambar 1 & 5 */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Menampilkan {filteredRecords.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} sampai{' '}
            {Math.min(currentPage * entriesPerPage, filteredRecords.length)} dari {filteredRecords.length} entri
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-300 rounded text-xs font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded text-xs font-bold transition cursor-pointer ${
                  currentPage === pg
                    ? 'bg-[#008ba3] text-white'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-slate-300 rounded text-xs font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 4: PROSES MUTASI KELUAR PESERTA DIDIK (Gambar 4)   */}
      {/* ======================================================== */}
      {isProsesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Red Modal Header matching Gambar 4 */}
            <div className="p-4 bg-[#dc2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-white" />
                <h3 className="text-sm font-bold">Proses Mutasi Keluar Peserta Didik</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProsesModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form matching Gambar 4 */}
            <form onSubmit={handleSaveMutasi} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-medium">
                  {formError}
                </div>
              )}

              {/* 1. Pilih Peserta Didik Aktif * */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Pilih Peserta Didik Aktif <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white cursor-pointer"
                >
                  <option value="">-- Pilih Siswa --</option>
                  {/* Default sample option matching Gambar 5 */}
                  <option value="s-rizki">
                    SISWA CONTOH (0000/000.000 - TSM)
                  </option>
                  {availableStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.nipd} - {s.currentClass || s.programKeahlian})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Tanggal Mutasi * */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Tanggal Mutasi <span className="text-rose-600">*</span>
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* 3. Sekolah Tujuan / Alasan Keluar * */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Sekolah Tujuan / Alasan Keluar <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={formDestination}
                  onChange={(e) => setFormDestination(e.target.value)}
                  placeholder="Nama sekolah tujuan pindah atau alasan keluar"
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* 4. Nomor Surat Mutasi (Opsional) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nomor Surat Mutasi (Opsional)
                </label>
                <input
                  type="text"
                  value={formLetterNumber}
                  onChange={(e) => setFormLetterNumber(e.target.value)}
                  placeholder="Contoh: 421.3/045/SMK-AI/2026"
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* 5. Alasan Tambahan / Catatan */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Alasan Tambahan / Catatan
                </label>
                <textarea
                  rows={3}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Keterangan pendukung mutasi siswa..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
                />
              </div>

              {/* Footer Buttons matching Gambar 4 */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsProsesModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#dc2626] hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Simpan Mutasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: SURAT KETERANGAN PINDAH SEKOLAH RESMI           */}
      {/* ======================================================== */}
      {selectedStudentForSurat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-[#008ba3] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-200" />
                <h3 className="text-sm font-bold">
                  Surat Keterangan Pindah: {selectedStudentForSurat.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudentForSurat(null)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Printable Document */}
            <div className="p-6 overflow-y-auto flex-1 font-serif text-slate-900 bg-white space-y-4">
              {/* Header Surat */}
              <div className="text-center border-b-2 border-slate-900 pb-3">
                <h3 className="text-base font-black tracking-wide uppercase">
                  PEMERINTAH PROVINSI JAWA TIMUR
                </h3>
                <h2 className="text-lg font-black tracking-wider uppercase">
                  DINAS PENDIDIKAN
                </h2>
                <h1 className="text-xl font-black uppercase text-sky-950 font-sans">
                  {schoolSettings.name || 'SMK NEGERI DANDER'}
                </h1>
                <p className="text-[10px] font-sans text-slate-700 mt-0.5">
                  Jl. KHR. Moh Rosyid Desa Sumbertlaseh Kec. Dander Bojonegoro • NPSN: {schoolSettings.npsn || '20541259'}
                </p>
              </div>

              {/* Document Title */}
              <div className="text-center py-2">
                <h4 className="font-black text-sm uppercase underline tracking-wide">
                  SURAT KETERANGAN PINDAH SEKOLAH
                </h4>
                <p className="text-xs font-mono text-slate-600 mt-0.5">
                  Nomor: {selectedStudentForSurat.letterNumber || '421.3/045/SMK-AI/2026'}
                </p>
              </div>

              {/* Opening Statement */}
              <p className="text-xs leading-relaxed text-justify">
                Yang bertanda tangan di bawah ini Kepala {schoolSettings.name || 'SMK Negeri Dander'}, Kabupaten Bojonegoro, dengan ini menerangkan bahwa:
              </p>

              {/* Student Biodata */}
              <div className="pl-6 space-y-1.5 text-xs">
                <div className="grid grid-cols-4">
                  <span className="font-semibold text-slate-700">Nama Peserta Didik</span>
                  <span className="col-span-3 font-bold uppercase">: {selectedStudentForSurat.name}</span>
                </div>
                <div className="grid grid-cols-4">
                  <span className="font-semibold text-slate-700">Nomor Induk / NISN</span>
                  <span className="col-span-3 font-mono">: {selectedStudentForSurat.nipd} / {selectedStudentForSurat.nisn}</span>
                </div>
                <div className="grid grid-cols-4">
                  <span className="font-semibold text-slate-700">Jenis Kelamin</span>
                  <span className="col-span-3">: {selectedStudentForSurat.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>
                <div className="grid grid-cols-4">
                  <span className="font-semibold text-slate-700">Kelas / Program Keahlian</span>
                  <span className="col-span-3 font-semibold">: {selectedStudentForSurat.cls}</span>
                </div>
                <div className="grid grid-cols-4">
                  <span className="font-semibold text-slate-700">Tanggal Mutasi Keluar</span>
                  <span className="col-span-3">: {selectedStudentForSurat.date}</span>
                </div>
                <div className="grid grid-cols-4">
                  <span className="font-semibold text-slate-700">Sekolah Tujuan</span>
                  <span className="col-span-3 font-bold">: {selectedStudentForSurat.destination || '-'}</span>
                </div>
                <div className="grid grid-cols-4">
                  <span className="font-semibold text-slate-700">Alasan Pindah</span>
                  <span className="col-span-3">: {selectedStudentForSurat.reason || 'Pindah domisili mengikuti orang tua'}</span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-justify mt-3">
                Sesuai dengan surat permohonan dari orang tua / wali peserta didik, yang bersangkutan telah resmi keluar dari sekolah kami dan diberikan berkas Surat Keterangan Pindah beserta Buku Laporan Hasil Belajar (Rapor).
              </p>

              {/* Official Signatures */}
              <div className="pt-8 grid grid-cols-2 text-center text-xs">
                <div></div>
                <div className="flex flex-col items-center">
                  <p>Bojonegoro, {selectedStudentForSurat.date || '02 November 2026'}</p>
                  <p className="font-semibold mb-16">Kepala Sekolah,</p>
                  <p className="font-bold underline uppercase">
                    {schoolSettings.principalName || 'Dr. Molyono.,M.Mpd'}
                  </p>
                  <p className="text-[10px] text-slate-600 font-sans">
                    NIP. {schoolSettings.principalNip || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedStudentForSurat(null)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-xs cursor-pointer transition"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#008ba3] hover:bg-cyan-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
              >
                <Printer className="w-4 h-4" /> Cetak Surat (A4)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: KONFIRMASI KEMBALIKAN STATUS (image_a5e37fdb.png) */}
      {/* ======================================================== */}
      {studentToRestore && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-[430px] w-full pt-8 pb-7 px-8 text-center animate-in fade-in zoom-in-95 duration-150">
            {/* Circular question icon outline */}
            <div className="w-[82px] h-[82px] rounded-full border-[3px] border-[#87a3b8] flex items-center justify-center mx-auto mb-4">
              <span className="text-[52px] font-light leading-none text-[#64748b] select-none font-sans -mt-1">
                ?
              </span>
            </div>

            {/* Title */}
            <h2 className="text-[23px] font-bold text-slate-800 mb-2.5 tracking-tight">
              Kembalikan Status?
            </h2>

            {/* Subtitle description */}
            <p className="text-[13px] text-slate-600 leading-relaxed mb-6 max-w-[340px] mx-auto">
              Apakah Anda yakin ingin mengembalikan status peserta didik ini menjadi AKTIF? Data mutasi tetap tersimpan.
            </p>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setStudentToRestore(null)}
                className="px-6 py-2.5 bg-[#5c6873] hover:bg-[#4b555f] active:scale-95 text-white font-semibold text-xs rounded transition cursor-pointer shadow-xs min-w-[70px]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmRestoreAction}
                className="px-6 py-2.5 bg-[#1ea84b] hover:bg-[#188d3f] active:scale-95 text-white font-semibold text-xs rounded transition cursor-pointer shadow-xs"
              >
                Ya, Aktifkan Kembali!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
          <p className="text-xs font-semibold leading-tight flex-1">{notification}</p>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-emerald-700 rounded text-white cursor-pointer transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
