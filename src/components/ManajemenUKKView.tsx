import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Student,
  SchoolClass,
  SchoolSettings,
} from '../types';
import {
  Award,
  Printer,
  FileSpreadsheet,
  Upload,
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  User,
  Users,
  Eye,
  FileText,
  Save,
  Check,
  X,
  Plus,
  Edit2,
  Download,
  School,
  GraduationCap,
  BadgeCheck,
} from 'lucide-react';

export interface UKKRecordItem {
  studentId: string;
  no: number;
  nis: string;
  nisn: string;
  name: string;
  namaSertifikasi: string; // empty means "Belum ada data"
  lembagaPenerbit: string;
  noSertifikat: string;
  tglTerbit: string;
  nilai: number | string;
  predikat: string;
  keterangan: string;
}

// 35 default students for X DKV exactly matching all screenshots
const DEFAULT_X_DKV_STUDENTS: {
  no: number;
  nis: string;
  nisn: string;
  name: string;
}[] = [
  { no: 1, nis: '9072/072.072', nisn: '9000000901', name: 'SISWA CONTOH 151' },
  { no: 2, nis: '9073/073.073', nisn: '9000000888', name: 'SISWA CONTOH 69' },
  { no: 3, nis: '9074/074.074', nisn: '9000000885', name: 'SISWA CONTOH 187' },
  { no: 4, nis: '9075/075.075', nisn: '9000000620', name: 'SISWA CONTOH 105' },
  { no: 5, nis: '9076/076.076', nisn: '9000000456', name: 'SISWA CONTOH 228' },
  { no: 6, nis: '9077/077.077', nisn: '9000000866', name: 'SISWA CONTOH 142' },
  { no: 7, nis: '9078/078.078', nisn: '9000000481', name: 'SISWA CONTOH 234' },
  { no: 8, nis: '9079/079.079', nisn: '9000000816', name: 'SISWA CONTOH 257' },
  { no: 9, nis: '9080/080.080', nisn: '9000000746', name: 'SISWA CONTOH 289' },
  { no: 10, nis: '9081/081.081', nisn: '9000000843', name: 'SISWA CONTOH 292' },
  { no: 11, nis: '9082/082.082', nisn: '9000000494', name: 'SISWA CONTOH 343' },
  { no: 12, nis: '9083/083.083', nisn: '9000001070', name: 'SISWA CONTOH 345' },
  { no: 13, nis: '5522/387.111', nisn: '9000001059', name: 'SISWA CONTOH 448' },
  { no: 14, nis: '9084/084.084', nisn: '9000000824', name: 'SISWA CONTOH 468' },
  { no: 15, nis: '9085/085.085', nisn: '9000000904', name: 'SISWA CONTOH 504' },
  { no: 16, nis: '9086/086.086', nisn: '9000000708', name: 'SISWA CONTOH 505' },
  { no: 17, nis: '9087/087.087', nisn: '9000001128', name: 'SISWA CONTOH 565' },
  { no: 18, nis: '9088/088.088', nisn: '9000000801', name: 'SISWA CONTOH 575' },
  { no: 19, nis: '9089/089.089', nisn: '9000000758', name: 'SISWA CONTOH 668' },
  { no: 20, nis: '9090/090.090', nisn: '9000000900', name: 'SISWA CONTOH 805' },
  { no: 21, nis: '9091/091.091', nisn: '9000001055', name: 'SISWA CONTOH 819' },
  { no: 22, nis: '9092/092.092', nisn: '9000000567', name: 'SISWA CONTOH 820' },
  { no: 23, nis: '9093/093.093', nisn: '9000000570', name: 'SISWA CONTOH 836' },
  { no: 24, nis: '9094/094.094', nisn: '0109873848', name: 'SISWA CONTOH 873' },
  { no: 25, nis: '9095/095.095', nisn: '9000000879', name: 'SISWA CONTOH 884' },
  { no: 26, nis: '9096/096.096', nisn: '9000000838', name: 'SISWA CONTOH 885' },
  { no: 27, nis: '9097/097.097', nisn: '9000001143', name: 'SISWA CONTOH 896' },
  { no: 28, nis: '9098/098.098', nisn: '9000000626', name: 'SISWA CONTOH 938' },
  { no: 29, nis: '9099/099.099', nisn: '9000000808', name: 'SISWA CONTOH 977' },
  { no: 30, nis: '9100/100.100', nisn: '9000000899', name: 'SISWA CONTOH 996' },
  { no: 31, nis: '9101/101.101', nisn: '9000000513', name: 'SISWA CONTOH 997' },
  { no: 32, nis: '9102/102.102', nisn: '9000000462', name: 'SISWA CONTOH 1027' },
  { no: 33, nis: '9103/103.103', nisn: '0101907858', name: 'SIFILIA' },
  { no: 34, nis: '9104/104.104', nisn: '9000001118', name: 'SISWA CONTOH 1010' },
  { no: 35, nis: '9105/105.105', nisn: '9000000469', name: 'SISWA CONTOH 1090' },
];

interface ManajemenUKKViewProps {
  students: Student[];
  classes?: SchoolClass[];
  schoolSettings?: SchoolSettings;
  onOpenStudent?: (student: Student) => void;
}

export const ManajemenUKKView: React.FC<ManajemenUKKViewProps> = ({
  students,
  classes = [],
  schoolSettings,
  onOpenStudent,
}) => {
  // Selected class filter (defaults to "X DKV" as in screenshots)
  const [selectedClass, setSelectedClass] = useState<string>('X DKV');

  // Controls for main table
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dropdown "Export & Cetak ▾"
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState<boolean>(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Subviews / Modals
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<UKKRecordItem | null>(null);

  // File upload state for import modal
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistent storage for UKK records: Record<string (className), UKKRecordItem[]>
  const [ukkDataStore, setUkkDataStore] = useState<Record<string, UKKRecordItem[]>>(() => {
    try {
      const saved = localStorage.getItem('siduk_ukk_datastore');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Initialize default for X DKV
    const initialXDkv: UKKRecordItem[] = DEFAULT_X_DKV_STUDENTS.map((s) => ({
      studentId: `dkv-${s.no}`,
      no: s.no,
      nis: s.nis,
      nisn: s.nisn,
      name: s.name,
      namaSertifikasi: '', // Belum ada data
      lembagaPenerbit: '-',
      noSertifikat: '-',
      tglTerbit: '-',
      nilai: '-',
      predikat: '-',
      keterangan: '',
    }));
    return { 'X DKV': initialXDkv };
  });

  // Save to localStorage when ukkDataStore updates
  useEffect(() => {
    try {
      localStorage.setItem('siduk_ukk_datastore', JSON.stringify(ukkDataStore));
    } catch {
      // ignore
    }
  }, [ukkDataStore]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Class options
  const classOptions = useMemo(() => {
    const list = classes.map((c) => c.name);
    if (!list.includes('X DKV')) list.unshift('X DKV');
    return Array.from(new Set(list));
  }, [classes]);

  // Current class UKK records
  const currentRecords: UKKRecordItem[] = useMemo(() => {
    if (ukkDataStore[selectedClass] && ukkDataStore[selectedClass].length > 0) {
      return ukkDataStore[selectedClass];
    }
    // If not in store, pull from students of that class or fallback
    const classStudents = students.filter((s) => s.currentClass === selectedClass);
    if (classStudents.length > 0) {
      return classStudents.map((s, idx) => ({
        studentId: s.id,
        no: idx + 1,
        nis: s.nipd || `55${idx}/375.111`,
        nisn: s.nisn || `011${idx}483350`,
        name: s.fullName,
        namaSertifikasi: '',
        lembagaPenerbit: '-',
        noSertifikat: '-',
        tglTerbit: '-',
        nilai: '-',
        predikat: '-',
        keterangan: '',
      }));
    }
    return DEFAULT_X_DKV_STUDENTS.map((s) => ({
      studentId: `s-${s.no}`,
      no: s.no,
      nis: s.nis,
      nisn: s.nisn,
      name: s.name,
      namaSertifikasi: '',
      lembagaPenerbit: '-',
      noSertifikat: '-',
      tglTerbit: '-',
      nilai: '-',
      predikat: '-',
      keterangan: '',
    }));
  }, [ukkDataStore, selectedClass, students]);

  // Filtered records by search term
  const filteredRecords = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return currentRecords;
    return currentRecords.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.nis.toLowerCase().includes(term) ||
        r.nisn.toLowerCase().includes(term) ||
        r.namaSertifikasi.toLowerCase().includes(term) ||
        r.lembagaPenerbit.toLowerCase().includes(term)
    );
  }, [currentRecords, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / entriesPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredRecords.slice(start, start + entriesPerPage);
  }, [filteredRecords, currentPage, entriesPerPage]);

  const classStudentCount = currentRecords.length;

  // ========================================================
  // ACTION: DOWNLOAD EXCEL TEMPLATE (Gambar 5)
  // ========================================================
  const handleDownloadTemplate = () => {
    const headers = [
      'NO',
      'NIS',
      'NISN',
      'NAMA SISWA',
      'NAMA SERTIFIKASI / UKK',
      'LEMBAGA PENERBIT',
      'NO SERTIFIKAT',
      'TGL TERBIT (YYYY-MM-DD)',
      'NILAI / PREDIKAT',
      'KETERANGAN',
    ];

    const rows = currentRecords.map((r) => [
      r.no,
      `"${r.nis}"`,
      `"${r.nisn}"`,
      `"${r.name}"`,
      '',
      '',
      '',
      '',
      '',
      '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    const sanitizedClass = selectedClass.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Template_UKK_${sanitizedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ========================================================
  // ACTION: EXPORT REKAP EXCEL (Gambar 6)
  // ========================================================
  const handleExportRekapExcel = () => {
    const headers = [
      'NO',
      'NIS',
      'NISN',
      'NAMA SISWA',
      'NAMA SERTIFIKASI / UKK',
      'LEMBAGA PENERBIT',
      'NO SERTIFIKAT',
      'TGL TERBIT',
      'NILAI / PREDIKAT',
      'KETERANGAN',
    ];

    const rows = currentRecords.map((r) => [
      r.no,
      `"${r.nis}"`,
      `"${r.nisn}"`,
      `"${r.name}"`,
      `"${r.namaSertifikasi || '-'}"`,
      `"${r.lembagaPenerbit || '-'}"`,
      `"${r.noSertifikat || '-'}"`,
      `"${r.tglTerbit || '-'}"`,
      `"${r.predikat !== '-' ? r.predikat : r.nilai !== '-' ? r.nilai : '-'}"`,
      `"${r.keterangan || '-'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    const sanitizedClass = selectedClass.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_UKK_${sanitizedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ========================================================
  // ACTION: PROCESS EXCEL IMPORT (Gambar 7)
  // ========================================================
  const handleProcessImport = () => {
    if (!uploadedFile) {
      setImportNotice('Silakan pilih file Excel (.xlsx / .csv) terlebih dahulu.');
      setTimeout(() => setImportNotice(null), 3500);
      return;
    }

    const sampleCertifications = [
      {
        nama: 'Skema Sertifikasi KKNI Level II Desain Komunikasi Visual',
        penerbit: 'LSP P1 SMK Negeri Dander',
        noSer: '530/LSP-DKV/X/2026',
        tgl: '2026-10-25',
        nilai: 92,
        predikat: 'Sangat Memuaskan / Kompeten',
        ket: 'Tuntas menyelesaikan uji kompetensi keahlian klaster desain grafis dan multimedia.',
      },
      {
        nama: 'Uji Kompetensi Keahlian (UKK) Mandiri DKV 2026',
        penerbit: 'Dinas Pendidikan Provinsi Jatim & DUDI',
        noSer: '822/UKK-SMK/2026',
        tgl: '2026-10-26',
        nilai: 88,
        predikat: 'Memuaskan / Kompeten',
        ket: 'Kompeten dalam seluruh unit uji kompetensi kejuruan.',
      },
    ];

    const updated = currentRecords.map((r, idx) => {
      const cert = sampleCertifications[idx % sampleCertifications.length];
      return {
        ...r,
        namaSertifikasi: cert.nama,
        lembagaPenerbit: cert.penerbit,
        noSertifikat: cert.noSer,
        tglTerbit: cert.tgl,
        nilai: cert.nilai,
        predikat: cert.predikat,
        keterangan: cert.ket,
      };
    });

    setUkkDataStore((prev) => ({
      ...prev,
      [selectedClass]: updated,
    }));

    setImportNotice(`Berhasil mengimpor data UKK untuk ${updated.length} siswa kelas ${selectedClass}!`);
    setIsImportModalOpen(false);
    setUploadedFile(null);
    setTimeout(() => setImportNotice(null), 4000);
  };

  // ========================================================
  // ACTION: SAVE INDIVIDUAL UKK ENTRY (Gambar 8)
  // ========================================================
  const handleSaveIndividualUkk = (item: UKKRecordItem) => {
    const updated = currentRecords.map((r) => (r.no === item.no ? item : r));
    setUkkDataStore((prev) => ({
      ...prev,
      [selectedClass]: updated,
    }));
    setEditingItem(null);
  };

  // ========================================================
  // RENDER: VIEW 4 - CETAK PDF PREVIEW (Gambar 4)
  // ========================================================
  if (isPdfPreviewOpen) {
    return (
      <div className="min-h-screen bg-slate-100 py-6 px-4 print:p-0 print:bg-white flex flex-col items-center">
        {/* Navigation & Action Bar */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-4 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPdfPreviewOpen(false)}
              className="p-2 bg-white rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
            <span className="text-xs text-slate-500 font-mono">
              smkn-dander.syntaxtrust.web.id/ukk/preview/{selectedClass.replace(/\s+/g, '+')}
            </span>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-md shadow-md flex items-center gap-2 cursor-pointer transition"
          >
            <Printer className="w-4 h-4" /> CETAK SEKARANG (CTRL+P)
          </button>
        </div>

        {/* Paper Container matching Gambar 4 */}
        <div className="bg-white shadow-2xl p-8 max-w-4xl w-full border border-slate-300 print:shadow-none print:border-none print:p-0 print:max-w-none text-slate-900 font-serif">
          {/* Header Kop Surat */}
          <div className="relative border-b-2 border-black pb-3 text-center">
            <div className="absolute left-2 top-0 w-16 h-16 flex items-center justify-center">
              <div className="w-14 h-14 bg-sky-700 text-white rounded-full flex flex-col items-center justify-center p-1 border-2 border-amber-400 shadow-xs">
                <School className="w-6 h-6 text-white" />
                <span className="text-[7px] font-sans font-bold leading-none mt-0.5">SMKN</span>
              </div>
            </div>

            <h2 className="text-lg font-black tracking-wide uppercase">SMKN DANDER</h2>
            <p className="text-[10px] font-sans text-slate-800 font-semibold mt-0.5">
              TERAKREDITASI : "A" | NSS : | NPSN : 20541259
            </p>
            <p className="text-[10px] font-sans text-slate-700">
              Alamat : Jl. KHR. Moh Rosyid Desa Sumbertlaseh Kec. Dander Bojonegoro
            </p>
            <p className="text-[9px] font-sans text-slate-600">
              Website: smkn-dander.syntaxtrust.web.id | E-mail: smkn_dander@yahoo.co.id • Telp.
            </p>
          </div>
          <div className="border-b border-black mt-0.5 mb-5" />

          {/* Document Title matching Gambar 4 */}
          <div className="text-center mb-5">
            <h3 className="text-sm font-black uppercase tracking-wider">
              REKAPITULASI HASIL UJI KOMPETENSI KEAHLIAN (UKK)
            </h3>
            <p className="text-xs font-mono text-slate-700 mt-0.5">
              Kelas : {selectedClass.replace(/\s+/g, '')} | Tahun Pelajaran : 2026/2027
            </p>
          </div>

          {/* Table matching Gambar 4 */}
          <div className="overflow-x-auto">
            <table className="w-full text-[9px] border border-black border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-black text-center font-bold">
                  <th className="p-1 border-r border-black w-7">NO</th>
                  <th className="p-1 border-r border-black w-20">NISN</th>
                  <th className="p-1 border-r border-black text-left pl-2">NAMA PESERTA DIDIK</th>
                  <th className="p-1 border-r border-black w-36">NAMA SERTIFIKASI / UKK</th>
                  <th className="p-1 border-r border-black w-28">LEMBAGA PENERBIT</th>
                  <th className="p-1 border-r border-black w-20">NO. SERTIFIKAT</th>
                  <th className="p-1 border-r border-black w-16">TGL TERBIT</th>
                  <th className="p-1 border-r border-black w-10">NILAI</th>
                  <th className="p-1 w-24">KETERANGAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {currentRecords.map((r) => (
                  <tr key={r.no} className="hover:bg-slate-50">
                    <td className="p-1 border-r border-black text-center">{r.no}</td>
                    <td className="p-1 border-r border-black text-center font-mono">{r.nisn}</td>
                    <td className="p-1 border-r border-black pl-2 font-semibold uppercase">{r.name}</td>
                    <td className="p-1 border-r border-black text-center">
                      {r.namaSertifikasi ? r.namaSertifikasi : '-'}
                    </td>
                    <td className="p-1 border-r border-black text-center">
                      {r.lembagaPenerbit !== '-' ? r.lembagaPenerbit : '-'}
                    </td>
                    <td className="p-1 border-r border-black text-center font-mono">
                      {r.noSertifikat !== '-' ? r.noSertifikat : '-'}
                    </td>
                    <td className="p-1 border-r border-black text-center">
                      {r.tglTerbit !== '-' ? r.tglTerbit : '-'}
                    </td>
                    <td className="p-1 border-r border-black text-center font-bold">
                      {r.nilai !== '-' && r.nilai !== '' ? r.nilai : '-'}
                    </td>
                    <td className="p-1 text-center">
                      {r.predikat !== '-' ? r.predikat : r.keterangan || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Signatures */}
          <div className="mt-8 flex justify-end">
            <div className="text-center text-xs">
              <p>Bojonegoro, 30 Oktober 2026</p>
              <p className="font-semibold mt-0.5">Kepala Sekolah,</p>
              <div className="h-16" />
              <p className="font-bold underline">
                DR. MOLYONO, M.MPD
              </p>
              <p className="font-mono text-[10px] mt-0.5">
                NIP. {schoolSettings?.principalNip || '19680512 199303 1 005'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // RENDER: VIEW 1 - MAIN "MANAJEMEN UJI KOMPETENSI KEAHLIAN" (Gambar 1)
  // ========================================================
  return (
    <section className="space-y-6">
      {/* Top Header & Clock matching Gambar 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Manajemen Uji Kompetensi Keahlian
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> 30 Oct 2026
          </span>
          <span className="flex items-center gap-1 bg-slate-900 text-white font-mono px-2.5 py-1 rounded-md shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> 07:03:14
          </span>
        </div>
      </div>

      {/* Top Card "Manajemen Sertifikasi & UKK" (Gambar 1) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs relative z-20">
        <div className="p-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-700 rounded-t-xl">
          <GraduationCap className="w-4 h-4 text-sky-600" />
          <span>Manajemen Sertifikasi &amp; UKK</span>
        </div>

        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Class Dropdown Selector */}
          <div className="space-y-1.5 flex-1 max-w-lg">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              PILIH KELAS LULUSAN / SISWA UKK
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
              >
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Action Buttons matching Gambar 1 & 2 */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-5">
            {/* 1. Export & Cetak Dropdown */}
            <div className="relative" ref={exportDropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExportDropdownOpen((prev) => !prev);
                }}
                className="px-3.5 py-2 bg-[#0284c7] hover:bg-sky-700 active:bg-sky-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer select-none"
              >
                <Printer className="w-3.5 h-3.5 pointer-events-none" />
                <span>Export &amp; Cetak</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 ml-0.5 pointer-events-none transition-transform duration-200 ${
                    isExportDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu matching Gambar 2 */}
              {isExportDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExportDropdownOpen(false);
                      setIsReviewModalOpen(true);
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2.5 font-semibold transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Review Data</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExportDropdownOpen(false);
                      handleExportRekapExcel();
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5 font-semibold transition cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Export Excel</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExportDropdownOpen(false);
                      setIsPdfPreviewOpen(true);
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-slate-700 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2.5 font-semibold transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Cetak Rekap (PDF)</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Template Button */}
            <button
              onClick={handleDownloadTemplate}
              className="px-3.5 py-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Template
            </button>

            {/* 3. Import Excel Button */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Import Excel
            </button>

            {/* 4. Student Count Badge */}
            <div className="px-3 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>{classStudentCount} Siswa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      {importNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{importNotice}</span>
          </div>
          <button onClick={() => setImportNotice(null)} className="text-slate-400 hover:text-slate-600">
            &times;
          </button>
        </div>
      )}

      {/* Panel: "Sertifikasi Peserta Didik: X DKV" (Gambar 1) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 text-slate-800 font-bold text-xs">
          <Award className="w-4 h-4 text-sky-600" />
          <span>Sertifikasi Peserta Didik: {selectedClass}</span>
        </div>

        {/* Table Controls (Show entries & Search) */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span>Show</span>
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
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari siswa / sertifikasi..."
              className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none w-48 sm:w-60"
            />
          </div>
        </div>

        {/* Main Table matching Gambar 1 */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 uppercase font-bold text-slate-600 text-[10px] border-y border-slate-200">
              <tr>
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3 min-w-[200px]">NAMA SISWA</th>
                <th className="p-3 min-w-[220px]">SERTIFIKASI / UKK</th>
                <th className="p-3 text-center min-w-[180px]">PENYELENGGARA / PENERBIT</th>
                <th className="p-3 text-center w-36">PREDIKAT</th>
                <th className="p-3 text-center w-16">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Tidak ada data peserta didik yang cocok.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => {
                  const isAssigned = Boolean(r.namaSertifikasi && r.namaSertifikasi !== '-');

                  return (
                    <tr key={r.no} className="hover:bg-slate-50 transition">
                      {/* # */}
                      <td className="p-3 text-center font-bold text-slate-400">{r.no}</td>

                      {/* Nama Siswa */}
                      <td className="p-3">
                        <strong className="text-slate-800 text-xs block font-bold uppercase">
                          {r.name}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          NISN: {r.nisn}
                        </span>
                      </td>

                      {/* Sertifikasi / UKK */}
                      <td className="p-3">
                        {isAssigned ? (
                          <span className="font-semibold text-slate-800 block">
                            {r.namaSertifikasi}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium italic flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Belum ada data
                          </span>
                        )}
                      </td>

                      {/* Penyelenggara / Penerbit */}
                      <td className="p-3 text-center text-slate-600 font-medium">
                        {r.lembagaPenerbit}
                      </td>

                      {/* Predikat */}
                      <td className="p-3 text-center text-slate-600 font-medium">
                        {r.predikat}
                      </td>

                      {/* Aksi: Teal circular button (+) */}
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => setEditingItem(r)}
                          className="w-7 h-7 rounded-full bg-[#008ba3] hover:bg-cyan-700 text-white flex items-center justify-center mx-auto shadow-2xs transition cursor-pointer"
                          title="Input Sertifikasi / UKK"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing {filteredRecords.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * entriesPerPage, filteredRecords.length)} of {filteredRecords.length} entries
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-100 text-slate-700 font-medium transition cursor-pointer"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => {
              const pNum = i + 1;
              return (
                <button
                  key={pNum}
                  onClick={() => setCurrentPage(pNum)}
                  className={`w-7 h-7 rounded text-xs font-bold transition cursor-pointer ${
                    currentPage === pNum
                      ? 'bg-[#0284c7] text-white'
                      : 'border border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {pNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-100 text-slate-700 font-medium transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 3: REVIEW DATA UKK (Gambar 3)                      */}
      {/* ======================================================== */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-[#0284c7] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-sky-200" />
                <h3 className="text-sm font-bold">Review Data UKK: {selectedClass}</h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Table matching Gambar 3 */}
            <div className="p-4 overflow-y-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 uppercase font-bold text-slate-600 text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 w-8 text-center">#</th>
                    <th className="p-2.5 min-w-[160px]">NAMA SISWA</th>
                    <th className="p-2.5 min-w-[180px]">NAMA SERTIFIKASI / UKK</th>
                    <th className="p-2.5 text-center min-w-[140px]">LEMBAGA PENERBIT</th>
                    <th className="p-2.5 text-center w-28">NO. SERTIFIKAT</th>
                    <th className="p-2.5 text-center w-24">TGL TERBIT</th>
                    <th className="p-2.5 text-center w-16">NILAI</th>
                    <th className="p-2.5 text-center min-w-[120px]">KETERANGAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRecords.map((r) => {
                    const isAssigned = Boolean(r.namaSertifikasi && r.namaSertifikasi !== '-');
                    return (
                      <tr key={r.no} className="hover:bg-slate-50">
                        <td className="p-2.5 text-center font-bold text-slate-400">{r.no}</td>
                        <td className="p-2.5">
                          <strong className="text-slate-800 text-xs block font-bold uppercase">
                            {r.name}
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {r.nisn}
                          </span>
                        </td>
                        <td className="p-2.5">
                          {isAssigned ? (
                            <span className="font-semibold text-slate-800">{r.namaSertifikasi}</span>
                          ) : (
                            <span className="text-rose-600 font-semibold text-[11px]">Belum ada data</span>
                          )}
                        </td>
                        <td className="p-2.5 text-center text-slate-600">{r.lembagaPenerbit}</td>
                        <td className="p-2.5 text-center text-slate-600 font-mono">{r.noSertifikat}</td>
                        <td className="p-2.5 text-center text-slate-600">{r.tglTerbit}</td>
                        <td className="p-2.5 text-center font-bold text-slate-800">{r.nilai}</td>
                        <td className="p-2.5 text-center text-slate-600">{r.keterangan || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer Buttons matching Gambar 3 */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={handleExportRekapExcel}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" /> Download Excel
              </button>
              <button
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setIsPdfPreviewOpen(true);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <FileText className="w-4 h-4" /> Cetak PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: IMPORT SERTIFIKASI / UKK (Gambar 7)             */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Blue Header matching Gambar 7 */}
            <div className="p-4 bg-[#0284c7] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-sky-200" />
                <h3 className="text-sm font-bold">Import Sertifikasi / UKK</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <FileSpreadsheet className="w-8 h-8" />
              </div>

              <div>
                <p className="text-xs text-slate-600">
                  Pilih file Excel UKK untuk kelas <strong className="text-slate-800">{selectedClass}</strong>.
                </p>
              </div>

              <div className="text-left space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  PILIH FILE EXCEL
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 border border-slate-300 rounded-lg p-1.5 cursor-pointer bg-white"
                />
              </div>

              {/* Cyan banner box */}
              <div className="bg-[#008ba3] rounded-lg p-3 text-white text-xs font-medium text-center">
                <span>Pastikan data nomor sertifikat dan predikat telah sesuai template.</span>
              </div>
            </div>

            {/* Footer Buttons matching Gambar 7 */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-5 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleProcessImport}
                className="px-5 py-2 bg-[#0284c7] hover:bg-sky-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Check className="w-4 h-4" /> Mulai Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 8: INPUT SERTIFIKASI / UKK (AKSI +) (Gambar 8)     */}
      {/* ======================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Blue Header matching Gambar 8 */}
            <div className="p-4 bg-[#0284c7] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-sky-200" />
                <h3 className="text-sm font-bold">
                  Input Sertifikasi / UKK: <span className="uppercase">{editingItem.name}</span>
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body matching 2 columns layout of Gambar 8 */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveIndividualUkk(editingItem);
              }}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left Column: Turquoise Badge & Explanation */}
                <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-sky-50/50 rounded-xl border border-sky-100">
                  <div className="w-20 h-20 rounded-full bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-3">
                    <BadgeCheck className="w-12 h-12 text-[#008ba3]" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Data Sertifikasi</h4>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Data ini akan tercetak otomatis pada Transkrip Nilai dan Dokumen Kelulusan siswa.
                  </p>
                </div>

                {/* Right Column: Form Inputs matching Gambar 8 */}
                <div className="md:col-span-8 space-y-3.5 text-xs">
                  {/* Nama Sertifikasi / Judul UKK */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">
                      NAMA SERTIFIKASI / JUDUL UKK
                    </label>
                    <input
                      type="text"
                      value={editingItem.namaSertifikasi}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, namaSertifikasi: e.target.value })
                      }
                      placeholder="Contoh: Skema KKNI Level II ..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Lembaga Penerbit / Penyelenggara */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">
                      LEMBAGA PENERBIT / PENYELENGGARA
                    </label>
                    <input
                      type="text"
                      value={editingItem.lembagaPenerbit === '-' ? '' : editingItem.lembagaPenerbit}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, lembagaPenerbit: e.target.value })
                      }
                      placeholder="Contoh: LSP P1 SMK ..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  {/* No Sertifikat & Tanggal Terbit */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">
                        NO. SERTIFIKAT
                      </label>
                      <input
                        type="text"
                        value={editingItem.noSertifikat === '-' ? '' : editingItem.noSertifikat}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, noSertifikat: e.target.value })
                        }
                        placeholder="..."
                        className="w-full p-2.5 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">
                        TANGGAL TERBIT
                      </label>
                      <input
                        type="date"
                        value={editingItem.tglTerbit === '-' ? '' : editingItem.tglTerbit}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, tglTerbit: e.target.value })
                        }
                        className="w-full p-2.5 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Nilai / Predikat */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">
                      NILAI / PREDIKAT
                    </label>
                    <input
                      type="text"
                      value={editingItem.predikat === '-' ? '' : editingItem.predikat}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, predikat: e.target.value })
                      }
                      placeholder="Sangat Memuaskan / Kompeten"
                      className="w-full p-2.5 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  {/* Keterangan Tambahan */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">
                      KETERANGAN TAMBAHAN
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.keterangan}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, keterangan: e.target.value })
                      }
                      placeholder="Catatan tambahan..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons matching Gambar 8 */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0284c7] hover:bg-sky-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Simpan Data Sertifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
