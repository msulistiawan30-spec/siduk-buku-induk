import React, { useState, useEffect, useMemo } from 'react';
import { Student, SchoolSettings, SchoolClass } from '../types';
import {
  GraduationCap,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Check,
  X,
  MessageCircle,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface KelulusanMassalViewProps {
  students: Student[];
  classes?: SchoolClass[];
  schoolSettings?: SchoolSettings;
  onOpenStudent?: (student: Student) => void;
  onNavigate?: (menu: string) => void;
  onUpdateStudents?: (updated: Student[]) => void;
}

interface SeniorStudentItem {
  id: string;
  nipd: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  cls: string;
  major: string;
  raportComplete: boolean;
  raportSemCount: number; // e.g. 0/6
  pklComplete: boolean;
  status: 'Aktif' | 'Lulus' | 'Mutasi';
}

// 22 XII DKV students matching image_d9aa2a4b.png & image_41646b71.png exactly
const DEFAULT_SENIORS_DKV: SeniorStudentItem[] = [
  {
    id: 'sen-1',
    nipd: '9307/307.307',
    nisn: '9000000007',
    name: 'SISWA CONTOH 7',
    gender: 'L',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-2',
    nipd: '9309/309.309',
    nisn: '9000000301',
    name: 'SISWA CONTOH 44',
    gender: 'L',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-3',
    nipd: '9310/310.310',
    nisn: '9000000368',
    name: 'SISWA CONTOH 214',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-4',
    nipd: '9311/311.311',
    nisn: '9000000922',
    name: 'SISWA CONTOH 241',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-5',
    nipd: '9312/312.312',
    nisn: '9000000385',
    name: 'SISWA CONTOH 283',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-6',
    nipd: '9313/313.313',
    nisn: '9000000184',
    name: 'SISWA CONTOH 294',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-7',
    nipd: '9314/314.314',
    nisn: '9000001001',
    name: 'SISWA CONTOH 297',
    gender: 'L',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-8',
    nipd: '9315/315.315',
    nisn: '9000000947',
    name: 'SISWA CONTOH 308',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-9',
    nipd: '9316/316.316',
    nisn: '9000000033',
    name: 'SISWA CONTOH 312',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-10',
    nipd: '9317/317.317',
    nisn: '9000000297',
    name: 'SISWA CONTOH 314',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-11',
    nipd: '9328/328.328',
    nisn: '9000001023',
    name: 'SISWA CONTOH 822',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-12',
    nipd: '9329/329.329',
    nisn: '9000000195',
    name: 'SISWA CONTOH 858',
    gender: 'L',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-13',
    nipd: '9330/330.330',
    nisn: '9000000941',
    name: 'SISWA CONTOH 893',
    gender: 'L',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-14',
    nipd: '9331/331.331',
    nisn: '9000000042',
    name: 'SISWA CONTOH 907',
    gender: 'L',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-15',
    nipd: '9332/332.332',
    nisn: '9000000440',
    name: 'SISWA CONTOH TIGA',
    gender: 'L',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-16',
    nipd: '9333/333.333',
    nisn: '9000000940',
    name: 'SISWA CONTOH 1006',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-17',
    nipd: '9334/334.334',
    nisn: '9000000946',
    name: 'SISWA CONTOH 1012',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-18',
    nipd: '9335/335.335',
    nisn: '9000001015',
    name: 'SISWA CONTOH 1013',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-19',
    nipd: '9337/337.337',
    nisn: '9000000995',
    name: 'SISWA CONTOH 1050',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-20',
    nipd: '9340/340.340',
    nisn: '9000000306',
    name: 'SISWA CONTOH 1088',
    gender: 'P',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-21',
    nipd: '9342/342.342',
    nisn: '9000000332',
    name: 'SISWA CONTOH 1101',
    gender: 'L',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
  {
    id: 'sen-22',
    nipd: '9344/344.344',
    nisn: '9000000200',
    name: 'SISWA CONTOH 1113',
    gender: 'L',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    raportComplete: false,
    raportSemCount: 0,
    pklComplete: false,
    status: 'Aktif',
  },
];

export const KelulusanMassalView: React.FC<KelulusanMassalViewProps> = ({
  students,
  classes = [],
  schoolSettings = {
    name: 'SMKN DANDER',
    npsn: '20541259',
    address: 'Jl. KHR. Moh Rosyid Desa Sumbertlaseh Kec. Dander Bojonegoro',
    principalName: 'Dr. Molyono, M.MPd',
    principalNip: '-',
    activeAcademicYear: '2026/2027',
  } as SchoolSettings,
  onOpenStudent,
  onNavigate,
  onUpdateStudents,
}) => {
  // Real-time clock matching Gambar 1 (09:17:35)
  const [currentTime, setCurrentTime] = useState<string>('09:17:35');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter state
  const [selectedClass, setSelectedClass] = useState<string>('XII DKV');
  const [graduationDate, setGraduationDate] = useState<string>('03/11/2026');

  // Datastore
  const [seniorList, setSeniorList] = useState<SeniorStudentItem[]>(() => {
    try {
      const saved = localStorage.getItem('siduk_lulus_massal_students');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_SENIORS_DKV;
  });

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem('siduk_lulus_massal_students', JSON.stringify(seniorList));
    } catch {
      // ignore
    }
  }, [seniorList]);

  // Selected student IDs (checkmarked)
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());

  // Notification Banner
  const [notification, setNotification] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  // Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState<boolean>(false);

  // Available classes list
  const classOptions = [
    'XII DKV',
    'XII AKL 1',
    'XII AKL 2',
    'XII RPL 1',
    'XII TKJ 1',
    'XII TKR 1',
  ];

  // Filtered students by class
  const displayedStudents = useMemo(() => {
    return seniorList.filter((s) => s.cls === selectedClass);
  }, [seniorList, selectedClass]);

  // Master checkbox toggle
  const isAllSelected =
    displayedStudents.length > 0 &&
    displayedStudents.every((s) => selectedStudentIds.has(s.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedStudentIds(new Set());
    } else {
      const allIds = new Set(displayedStudents.map((s) => s.id));
      setSelectedStudentIds(allIds);
    }
  };

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Reset / Cancel selections
  const handleResetSelection = () => {
    setSelectedStudentIds(new Set());
    setNotification({
      type: 'warning',
      message: 'Pilihan centang peserta didik telah dibatalkan.',
    });
    setTimeout(() => setNotification(null), 3500);
  };

  // Trigger Process Graduation
  const handleInitiateGraduation = () => {
    if (selectedStudentIds.size === 0) {
      setNotification({
        type: 'warning',
        message: 'Silakan centang minimal satu peserta didik yang akan diproses kelulusannya.',
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }
    setIsConfirmModalOpen(true);
  };

  // Confirm and Execute Graduation
  const handleConfirmGraduation = () => {
    const updatedSeniors = seniorList.map((s) => {
      if (selectedStudentIds.has(s.id)) {
        return {
          ...s,
          status: 'Lulus' as const,
        };
      }
      return s;
    });

    setSeniorList(updatedSeniors);

    // Sync with global kelulusan datastore if present
    try {
      const kelStore = localStorage.getItem('siduk_kelulusan_datastore');
      if (kelStore) {
        const parsed = JSON.parse(kelStore);
        const updatedKel = parsed.map((item: any) => {
          const matched = seniorList.find(
            (s) => s.nisn === item.nisn && selectedStudentIds.has(s.id)
          );
          if (matched) {
            return {
              ...item,
              status: 'LULUS',
            };
          }
          return item;
        });
        localStorage.setItem('siduk_kelulusan_datastore', JSON.stringify(updatedKel));
      }
    } catch {
      // ignore
    }

    const count = selectedStudentIds.size;
    setIsConfirmModalOpen(false);
    setSelectedStudentIds(new Set());

    setNotification({
      type: 'success',
      message: `Selamat! Berhasil memproses kelulusan massal untuk ${count} peserta didik kelas ${selectedClass} tertanggal ${graduationDate}. Status peserta didik kini resmi "Lulus" dan masuk ke data alumni.`,
    });
    setTimeout(() => setNotification(null), 6000);
  };

  return (
    <section className="space-y-6">
      {/* Top Header & Real-time Clock matching Gambar 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Kelulusan Massal Peserta Didik
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Validasi status akhir dan penetapan kelulusan massal peserta didik tingkat akhir (Kelas XII).
          </p>
        </div>

        {/* Date and Live Clock Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>03 Nov 2026</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-mono font-bold shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Toast / Notification Alert */}
      {notification && (
        <div
          className={`rounded-xl p-4 shadow-sm flex items-start justify-between gap-3 text-xs animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white'
              : notification.type === 'warning'
              ? 'bg-amber-500 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-100 shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="font-extrabold text-sm block">
                {notification.type === 'success' ? 'Berhasil!' : 'Perhatian'}
              </strong>
              <p className="text-white/90 text-xs mt-0.5 leading-relaxed font-medium">
                {notification.message}
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded-md hover:bg-black/10 transition cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Main Card: Kelulusan Massal Peserta Didik */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Card Header with Top Green Accent Border */}
        <div className="border-t-2 border-t-emerald-600 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-emerald-700 tracking-tight">
              Kelulusan Massal Peserta Didik
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            Total Siswa Terpilih: <strong className="text-emerald-700">{selectedStudentIds.size}</strong> / {displayedStudents.length}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          {/* Form Control: Pilih Kelas / Rombel */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Pilih Kelas / Rombel
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedStudentIds(new Set());
                }}
                className="w-full sm:w-80 p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  setNotification({
                    type: 'success',
                    message: `Memuat data peserta didik kelas ${selectedClass} (${displayedStudents.length} siswa ditemukan).`,
                  });
                  setTimeout(() => setNotification(null), 3000);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" /> Tampilkan Siswa
              </button>
            </div>
          </div>

          {/* Row: Tanggal Kelulusan + Info Banner matching Gambar 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Tanggal Kelulusan (Tamat Belajar)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={graduationDate}
                  onChange={(e) => setGraduationDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#008ba3] pr-10"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="bg-[#008ba3] text-white p-3 rounded-lg text-xs flex items-center gap-2 font-medium shadow-2xs leading-relaxed">
                <Info className="w-4 h-4 shrink-0 text-cyan-200" />
                <span>
                  Centang peserta didik yang akan diluluskan. Status mereka akan berubah menjadi <strong>"Lulus"</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Table matching Gambar 1 & Gambar 2 */}
          <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-2xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <th className="p-3 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                    />
                  </th>
                  <th className="p-3 w-44">NIPD / NISN</th>
                  <th className="p-3">NAMA LENGKAP</th>
                  <th className="p-3 w-14 text-center">L/P</th>
                  <th className="p-3 w-56">PROGRAM KEAHLIAN</th>
                  <th className="p-3 w-64">STATUS DATA INDUK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedStudents.map((s) => {
                  const isChecked = selectedStudentIds.has(s.id);
                  return (
                    <tr
                      key={s.id}
                      onClick={() => handleToggleStudent(s.id)}
                      className={`transition cursor-pointer ${
                        isChecked
                          ? 'bg-[#e0f7fa]/60 hover:bg-[#b2ebf2]/60'
                          : 'hover:bg-slate-50/80 bg-white'
                      }`}
                    >
                      {/* Checkbox column */}
                      <td
                        className="p-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleStudent(s.id)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                        />
                      </td>

                      {/* NIPD / NISN */}
                      <td className="p-3">
                        <strong className="text-slate-800 text-xs font-bold block">
                          {s.nipd}
                        </strong>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {s.nisn}
                        </span>
                      </td>

                      {/* NAMA LENGKAP */}
                      <td className="p-3">
                        <strong className="text-slate-900 font-bold text-xs uppercase block">
                          {s.name}
                        </strong>
                        {s.status === 'Lulus' && (
                          <span className="inline-block mt-0.5 px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-extrabold uppercase">
                            Sudah Lulus
                          </span>
                        )}
                      </td>

                      {/* L/P */}
                      <td className="p-3 text-center text-slate-700 font-medium">
                        {s.gender}
                      </td>

                      {/* PROGRAM KEAHLIAN */}
                      <td className="p-3 text-slate-700 font-medium">
                        {s.major}
                      </td>

                      {/* STATUS DATA INDUK matching Gambar 1 */}
                      <td className="p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-medium">
                          <XCircle className="w-3.5 h-3.5 shrink-0 fill-rose-100 text-rose-600" />
                          <span>
                            Raport belum lengkap ({s.raportSemCount}/6 sem)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-medium">
                          <XCircle className="w-3.5 h-3.5 shrink-0 fill-rose-100 text-rose-600" />
                          <span>Data PKL kosong</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Action Bar matching Gambar 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
            <div className="text-xs text-slate-500">
              Menampilkan <strong>{displayedStudents.length}</strong> peserta didik tingkat akhir ({selectedClass}).
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleResetSelection}
                className="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-xs shadow-xs transition cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleInitiateGraduation}
                className="px-6 py-2.5 bg-[#dc2626] hover:bg-red-700 text-white font-extrabold rounded-lg text-xs flex items-center gap-2 shadow-sm uppercase tracking-wide cursor-pointer transition active:scale-98"
              >
                <GraduationCap className="w-4 h-4" /> PROSES KELULUSAN SEKARANG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-red-600" /> Konfirmasi Kelulusan Massal
              </h3>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1">
                <strong className="block font-bold text-xs text-red-900">
                  Peringatan Penetapan Status Kelulusan:
                </strong>
                <p className="text-[11px]">
                  Anda akan memproses kelulusan sebanyak{' '}
                  <strong className="text-red-900 font-extrabold text-sm">
                    {selectedStudentIds.size} peserta didik
                  </strong>{' '}
                  pada rombel <strong>{selectedClass}</strong> dengan tanggal tamat belajar{' '}
                  <strong>{graduationDate}</strong>.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Instansi:</span>
                  <strong className="text-slate-800">{schoolSettings.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kelas / Rombel:</span>
                  <strong className="text-slate-800">{selectedClass}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Tamat Belajar:</span>
                  <strong className="text-slate-800 font-mono">{graduationDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status Data Induk:</span>
                  <span className="text-amber-700 font-bold">Tetap diluluskan (Disetujui Admin)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                Setelah diproses, status peserta didik akan tersimpan permanen sebagai "Lulus" dan otomatis tercatat pada Buku Alumni &amp; Tracer Study.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmGraduation}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-extrabold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Ya, Proses Kelulusan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LICENSE CONSULTATION MODAL */}
      {isLicenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#008ba3]" /> Konsultasi Lisensi Sekolah
              </h3>
              <button
                onClick={() => setIsLicenseModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3 text-slate-600">
              <p>
                Status lisensi sekolah <strong>{schoolSettings.name}</strong> aktif untuk Tahun Ajaran <strong>{schoolSettings.activeAcademicYear}</strong>.
              </p>
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1 text-sky-900 text-[11px]">
                <strong>Paket Lisensi Tersedia:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  <li>Paket Standar Tahunan (Full Fitur Buku Induk + Kelulusan)</li>
                  <li>Paket Unlimited Sekolah Menengah Kejuruan (SMK)</li>
                  <li>Dukungan Cetak Blangko Ijazah &amp; Akreditasi BAN-PDM</li>
                </ul>
              </div>
              <p className="text-[11px] text-slate-500">
                Hubungi tim sales resmi Syntax Trust melalui WhatsApp atau email resmi untuk aktivasi kode lisensi permanen.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsLicenseModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-700"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setIsLicenseModalOpen(false);
                  setNotification({
                    type: 'success',
                    message: 'Permintaan konsultasi telah dikirimkan ke tim representatif Syntax Trust.',
                  });
                  setTimeout(() => setNotification(null), 4000);
                }}
                className="px-4 py-2 bg-[#008ba3] hover:bg-cyan-700 text-white rounded-lg text-xs font-bold"
              >
                Hubungi Representatif
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
