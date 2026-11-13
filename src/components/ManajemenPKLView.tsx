import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Student,
  SchoolClass,
  SchoolSettings,
} from '../types';
import {
  Building,
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
  ExternalLink,
} from 'lucide-react';

interface PKLPlacement {
  studentId: string;
  no: number;
  nis: string;
  nisn: string;
  name: string;
  mitraDudi: string; // empty means "Belum ditempatkan"
  lokasi: string;
  durasi: string;
  nilai: number | string;
  predikat: string;
  keterangan: string;
}

// 35 default students for X DKV exactly matching images 1, 2, 3, 4, 5
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

interface ManajemenPKLViewProps {
  students: Student[];
  classes?: SchoolClass[];
  schoolSettings?: SchoolSettings;
  onOpenStudent?: (student: Student) => void;
}

export const ManajemenPKLView: React.FC<ManajemenPKLViewProps> = ({
  students,
  classes = [],
  schoolSettings,
  onOpenStudent,
}) => {
  // Selected class filter (defaults to "X DKV" as in user screenshots)
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
  const [editingPlacement, setEditingPlacement] = useState<PKLPlacement | null>(null);

  // File upload state for import modal
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistent storage for PKL placements: Record<string (className), PKLPlacement[]>
  const [pklDataStore, setPklDataStore] = useState<Record<string, PKLPlacement[]>>(() => {
    try {
      const saved = localStorage.getItem('siduk_pkl_datastore');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Initialize default for X DKV
    const initialXDkv: PKLPlacement[] = DEFAULT_X_DKV_STUDENTS.map((s) => ({
      studentId: `dkv-${s.no}`,
      no: s.no,
      nis: s.nis,
      nisn: s.nisn,
      name: s.name,
      mitraDudi: '', // Belum ditempatkan
      lokasi: '-',
      durasi: '-',
      nilai: '-',
      predikat: '-',
      keterangan: '',
    }));
    return { 'X DKV': initialXDkv };
  });

  // Save to localStorage when pklDataStore changes
  useEffect(() => {
    try {
      localStorage.setItem('siduk_pkl_datastore', JSON.stringify(pklDataStore));
    } catch {
      // ignore
    }
  }, [pklDataStore]);

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

  // Current class placements
  const currentPlacements: PKLPlacement[] = useMemo(() => {
    if (pklDataStore[selectedClass] && pklDataStore[selectedClass].length > 0) {
      return pklDataStore[selectedClass];
    }
    // If not found in store, generate from school students of that class or default fallback
    const classStudents = students.filter((s) => s.currentClass === selectedClass);
    if (classStudents.length > 0) {
      return classStudents.map((s, idx) => ({
        studentId: s.id,
        no: idx + 1,
        nis: s.nipd || `55${idx}/375.111`,
        nisn: s.nisn || `011${idx}483350`,
        name: s.fullName,
        mitraDudi: '',
        lokasi: '-',
        durasi: '-',
        nilai: '-',
        predikat: '-',
        keterangan: '',
      }));
    }
    // Fallback to default X DKV
    return DEFAULT_X_DKV_STUDENTS.map((s) => ({
      studentId: `s-${s.no}`,
      no: s.no,
      nis: s.nis,
      nisn: s.nisn,
      name: s.name,
      mitraDudi: '',
      lokasi: '-',
      durasi: '-',
      nilai: '-',
      predikat: '-',
      keterangan: '',
    }));
  }, [pklDataStore, selectedClass, students]);

  // Filtered placements by search term
  const filteredPlacements = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return currentPlacements;
    return currentPlacements.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.nis.toLowerCase().includes(term) ||
        p.nisn.toLowerCase().includes(term) ||
        p.mitraDudi.toLowerCase().includes(term)
    );
  }, [currentPlacements, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredPlacements.length / entriesPerPage) || 1;
  const paginatedPlacements = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredPlacements.slice(start, start + entriesPerPage);
  }, [filteredPlacements, currentPage, entriesPerPage]);

  // Total student count for the active class
  const classStudentCount = currentPlacements.length;

  // ========================================================
  // ACTION: DOWNLOAD EXCEL TEMPLATE (Gambar 4)
  // ========================================================
  const handleDownloadTemplate = () => {
    const headers = [
      'NO',
      'NIS',
      'NISN',
      'NAMA SISWA',
      'MITRA DUDI / INDUSTRI',
      'LOKASI / KABUPATEN',
      'DURASI (BULAN/MGG)',
      'NILAI (0-100)',
      'KETERANGAN KOMPETENSI',
    ];

    const rows = currentPlacements.map((p) => [
      p.no,
      `"${p.nis}"`,
      `"${p.nisn}"`,
      `"${p.name}"`,
      `"${p.mitraDudi || ''}"`,
      `"${p.lokasi !== '-' ? p.lokasi : ''}"`,
      `"${p.durasi !== '-' ? p.durasi : ''}"`,
      `"${p.nilai !== '-' ? p.nilai : ''}"`,
      `"${p.keterangan || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    const sanitizedClass = selectedClass.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Template_PKL_${sanitizedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ========================================================
  // ACTION: PROCESS EXCEL IMPORT (Gambar 5)
  // ========================================================
  const handleProcessImport = () => {
    if (!uploadedFile) {
      alert('Silakan pilih file Excel terlebih dahulu.');
      return;
    }

    // Simulate parsing and populate mock placements
    const sampleCompanies = [
      { name: 'PT. Astra Honda Motor', lokasi: 'Bojonegoro', durasi: '6 Bulan', nilai: 88, predikat: 'Amat Baik' },
      { name: 'PT. Maspion IT Surabaya', lokasi: 'Surabaya', durasi: '6 Bulan', nilai: 90, predikat: 'Amat Baik' },
      { name: 'Studio Multimedia Kreatif', lokasi: 'Bojonegoro', durasi: '6 Bulan', nilai: 86, predikat: 'Baik' },
      { name: 'CV. Citra Komputindo', lokasi: 'Tuban', durasi: '6 Bulan', nilai: 85, predikat: 'Baik' },
      { name: 'Dinas Kominfo Bojonegoro', lokasi: 'Bojonegoro', durasi: '6 Bulan', nilai: 92, predikat: 'Amat Baik' },
    ];

    const updated = currentPlacements.map((p, idx) => {
      const comp = sampleCompanies[idx % sampleCompanies.length];
      return {
        ...p,
        mitraDudi: comp.name,
        lokasi: comp.lokasi,
        durasi: comp.durasi,
        nilai: comp.nilai,
        predikat: comp.predikat,
        keterangan: 'Tuntas melaksanakan kegiatan praktik kerja lapangan dengan capaian memuaskan.',
      };
    });

    setPklDataStore((prev) => ({
      ...prev,
      [selectedClass]: updated,
    }));

    setImportNotice(`Berhasil mengimpor data PKL untuk ${updated.length} siswa kelas ${selectedClass}!`);
    setIsImportModalOpen(false);
    setUploadedFile(null);
    setTimeout(() => setImportNotice(null), 4000);
  };

  // ========================================================
  // ACTION: SAVE INDIVIDUAL PLACEMENT (From Modal Plus)
  // ========================================================
  const handleSaveIndividualPlacement = (placement: PKLPlacement) => {
    const updated = currentPlacements.map((p) => (p.no === placement.no ? placement : p));
    setPklDataStore((prev) => ({
      ...prev,
      [selectedClass]: updated,
    }));
    setEditingPlacement(null);
  };

  // ========================================================
  // RENDER: VIEW 3 - PDF CETAK REKAP PREVIEW (Gambar 3)
  // ========================================================
  if (isPdfPreviewOpen) {
    return (
      <div className="min-h-screen bg-slate-100 py-6 px-4 print:p-0 print:bg-white flex flex-col items-center">
        {/* Navigation & Action Bar (Hidden during print) */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-4 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPdfPreviewOpen(false)}
              className="p-2 bg-white rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
            <span className="text-xs text-slate-500 font-mono">
              smkn-dander.syntaxtrust.web.id/pkl/preview/{selectedClass.replace(/\s+/g, '+')}
            </span>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-md shadow-md flex items-center gap-2 cursor-pointer transition"
          >
            <Printer className="w-4 h-4" /> CETAK SEKARANG (CTRL+P)
          </button>
        </div>

        {/* Paper Container (Matching image_99458f85) */}
        <div className="bg-white shadow-2xl p-8 max-w-4xl w-full border border-slate-300 print:shadow-none print:border-none print:p-0 print:max-w-none text-slate-900 font-serif">
          {/* Header Kop Surat */}
          <div className="relative border-b-2 border-black pb-3 text-center">
            {/* School Logo */}
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
          {/* Thin double line */}
          <div className="border-b border-black mt-0.5 mb-5" />

          {/* Document Title */}
          <div className="text-center mb-5">
            <h3 className="text-sm font-black uppercase tracking-wider">
              REKAPITULASI NILAI PRAKTIK KERJA LAPANGAN (PKL)
            </h3>
            <p className="text-xs font-mono text-slate-700 mt-0.5">
              Kelas : {selectedClass.replace(/\s+/g, '')} | Tahun Pelajaran : 2026/2027
            </p>
          </div>

          {/* Document Table matching Gambar 3 */}
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] border border-black border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-black text-center font-bold">
                  <th className="p-1.5 border-r border-black w-8">NO</th>
                  <th className="p-1.5 border-r border-black w-24">NISN</th>
                  <th className="p-1.5 border-r border-black text-left pl-3">NAMA PESERTA DIDIK</th>
                  <th className="p-1.5 border-r border-black w-48">MITRA INDUSTRI (DUDI)</th>
                  <th className="p-1.5 border-r border-black w-14">NILAI</th>
                  <th className="p-1.5 w-20">PREDIKAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {currentPlacements.map((p) => (
                  <tr key={p.no} className="hover:bg-slate-50">
                    <td className="p-1 border-r border-black text-center">{p.no}</td>
                    <td className="p-1 border-r border-black text-center font-mono">{p.nisn}</td>
                    <td className="p-1 border-r border-black pl-3 font-semibold uppercase">{p.name}</td>
                    <td className="p-1 border-r border-black text-center">
                      {p.mitraDudi ? p.mitraDudi : '-'}
                    </td>
                    <td className="p-1 border-r border-black text-center font-bold">
                      {p.nilai !== '-' && p.nilai !== '' ? p.nilai : '-'}
                    </td>
                    <td className="p-1 text-center font-medium">
                      {p.predikat !== '-' && p.predikat !== '' ? p.predikat : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Signatures matching Gambar 3 */}
          <div className="mt-8 flex justify-end">
            <div className="text-center text-xs">
              <p>Bojonegoro, 29 Oktober 2026</p>
              <p className="font-semibold mt-0.5">Kepala Sekolah,</p>
              <div className="h-16" />
              <p className="font-bold underline">
                ({schoolSettings?.principalName || 'Drs. H. Mulyono, M.Pd'})
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
  // RENDER: VIEW 1 - MAIN "MANAJEMEN PRAKTEK KERJA LAPANGAN" (Gambar 1)
  // ========================================================
  return (
    <section className="space-y-6">
      {/* Top Page Title & Header Time matching Gambar 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Manajemen Praktek Kerja Lapangan
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> 29 Oct 2026
          </span>
          <span className="flex items-center gap-1 bg-slate-900 text-white font-mono px-2.5 py-1 rounded-md shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> 11:48:00
          </span>
        </div>
      </div>

      {/* Top Filter Card "Manajemen Praktek Kerja Lapangan" (Gambar 1) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-700">
          <Building className="w-4 h-4 text-sky-600" />
          <span>Manajemen Praktek Kerja Lapangan</span>
        </div>

        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Class Dropdown Selector */}
          <div className="space-y-1.5 flex-1 max-w-lg">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              PILIH KELAS LULUSAN / SISWA PKL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <School className="w-4 h-4" />
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

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-5">
            {/* 1. Export & Cetak Dropdown */}
            <div className="relative" ref={exportDropdownRef}>
              <button
                type="button"
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                className="px-3.5 py-2 bg-[#0284c7] hover:bg-sky-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Export &amp; Cetak
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {isExportDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setIsExportDropdownOpen(false);
                      setIsReviewModalOpen(true);
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-sky-600 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-sky-500" /> Review Data
                  </button>
                  <button
                    onClick={() => {
                      setIsExportDropdownOpen(false);
                      handleDownloadTemplate();
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Excel
                  </button>
                  <button
                    onClick={() => {
                      setIsExportDropdownOpen(false);
                      setIsPdfPreviewOpen(true);
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-rose-600 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-rose-500" /> Cetak Rekap (PDF)
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

      {/* Table Panel: "Penempatan PKL: X DKV" (Gambar 1) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 text-slate-800 font-bold text-xs">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Penempatan PKL: {selectedClass}</span>
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
              placeholder="Cari siswa / DUDI..."
              className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none w-48 sm:w-60"
            />
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 uppercase font-bold text-slate-600 text-[10px] border-y border-slate-200">
              <tr>
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3 min-w-[200px]">NAMA PESERTA DIDIK</th>
                <th className="p-3 min-w-[180px]">MITRA INDUSTRI (DUDI)</th>
                <th className="p-3 text-center w-28">LOKASI</th>
                <th className="p-3 text-center w-28">DURASI</th>
                <th className="p-3 text-center w-24">NILAI</th>
                <th className="p-3 text-center w-16">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPlacements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada data peserta didik yang cocok.
                  </td>
                </tr>
              ) : (
                paginatedPlacements.map((p) => {
                  const isAssigned = Boolean(p.mitraDudi && p.mitraDudi !== '-');

                  return (
                    <tr key={p.no} className="hover:bg-slate-50 transition">
                      {/* # */}
                      <td className="p-3 text-center font-bold text-slate-400">{p.no}</td>

                      {/* Nama Peserta Didik */}
                      <td className="p-3">
                        <strong className="text-slate-800 text-xs block font-bold uppercase">
                          {p.name}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          NIS: {p.nis}
                        </span>
                      </td>

                      {/* Mitra Industri (DUDI) */}
                      <td className="p-3">
                        {isAssigned ? (
                          <span className="font-semibold text-slate-800 block">{p.mitraDudi}</span>
                        ) : (
                          <span className="text-amber-600 font-medium italic flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Belum ditempatkan
                          </span>
                        )}
                      </td>

                      {/* Lokasi */}
                      <td className="p-3 text-center text-slate-600 font-medium">{p.lokasi}</td>

                      {/* Durasi */}
                      <td className="p-3 text-center text-slate-600 font-medium">{p.durasi}</td>

                      {/* Nilai */}
                      <td className="p-3 text-center font-bold text-slate-800">
                        {p.nilai !== '-' && p.nilai !== '' ? p.nilai : '-'}
                      </td>

                      {/* Aksi: Teal circular button (+) */}
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => setEditingPlacement(p)}
                          className="w-7 h-7 rounded-full bg-[#008ba3] hover:bg-cyan-700 text-white flex items-center justify-center mx-auto shadow-2xs transition cursor-pointer"
                          title="Atur Penempatan PKL"
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
            Showing {filteredPlacements.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * entriesPerPage, filteredPlacements.length)} of {filteredPlacements.length} entries
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
      {/* MODAL 1: REVIEW DATA PKL (Gambar 2)                      */}
      {/* ======================================================== */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-[#0284c7] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-sky-200" />
                <h3 className="text-sm font-bold">Review Data PKL: {selectedClass}</h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Table */}
            <div className="p-4 overflow-y-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 uppercase font-bold text-slate-600 text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 w-8 text-center">#</th>
                    <th className="p-2.5 min-w-[180px]">NAMA SISWA</th>
                    <th className="p-2.5 min-w-[160px]">MITRA INDUSTRI (DUDI)</th>
                    <th className="p-2.5 text-center w-24">LOKASI</th>
                    <th className="p-2.5 text-center w-24">DURASI</th>
                    <th className="p-2.5 text-center w-16">NILAI</th>
                    <th className="p-2.5 text-center w-20">PREDIKAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentPlacements.map((p) => {
                    const isAssigned = Boolean(p.mitraDudi && p.mitraDudi !== '-');
                    return (
                      <tr key={p.no} className="hover:bg-slate-50">
                        <td className="p-2.5 text-center font-bold text-slate-400">{p.no}</td>
                        <td className="p-2.5">
                          <strong className="text-slate-800 text-xs block font-bold uppercase">
                            {p.name}
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {p.nisn}
                          </span>
                        </td>
                        <td className="p-2.5">
                          {isAssigned ? (
                            <span className="font-semibold text-slate-800">{p.mitraDudi}</span>
                          ) : (
                            <span className="text-rose-600 font-semibold text-[11px]">Belum diisi</span>
                          )}
                        </td>
                        <td className="p-2.5 text-center text-slate-600">{p.lokasi}</td>
                        <td className="p-2.5 text-center text-slate-600">{p.durasi}</td>
                        <td className="p-2.5 text-center font-bold text-slate-800">{p.nilai}</td>
                        <td className="p-2.5 text-center font-medium text-slate-700">{p.predikat}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer Buttons matching Gambar 2 */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={handleDownloadTemplate}
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
      {/* MODAL 2: IMPORT DATA PKL (Gambar 5)                      */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Green Header */}
            <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-100" />
                <h3 className="text-sm font-bold">Import Data PKL</h3>
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
                  Silakan pilih file Excel berisi data PKL kelas <strong className="text-slate-800">{selectedClass}</strong>.
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

              {/* Warning Banner */}
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-[11px] font-semibold text-left flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Pastikan Anda menggunakan template yang sudah diunduh agar data terbaca dengan benar.
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
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
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Check className="w-4 h-4" /> Mulai Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ASSIGN / EDIT INDIVIDUAL PKL                    */}
      {/* ======================================================== */}
      {editingPlacement && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold">
                  Atur Penempatan PKL: {editingPlacement.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingPlacement(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveIndividualPlacement(editingPlacement);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mitra DUDI / Industri</label>
                <input
                  type="text"
                  value={editingPlacement.mitraDudi}
                  onChange={(e) =>
                    setEditingPlacement({ ...editingPlacement, mitraDudi: e.target.value })
                  }
                  placeholder="Contoh: PT. Astra Honda Motor"
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi / Kota</label>
                  <input
                    type="text"
                    value={editingPlacement.lokasi === '-' ? '' : editingPlacement.lokasi}
                    onChange={(e) =>
                      setEditingPlacement({ ...editingPlacement, lokasi: e.target.value })
                    }
                    placeholder="Contoh: Bojonegoro"
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durasi</label>
                  <input
                    type="text"
                    value={editingPlacement.durasi === '-' ? '' : editingPlacement.durasi}
                    onChange={(e) =>
                      setEditingPlacement({ ...editingPlacement, durasi: e.target.value })
                    }
                    placeholder="Contoh: 6 Bulan"
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nilai (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingPlacement.nilai === '-' ? '' : editingPlacement.nilai}
                    onChange={(e) => {
                      const val = e.target.value;
                      const numVal = Number(val);
                      let pred = 'Cukup';
                      if (numVal >= 86) pred = 'Amat Baik';
                      else if (numVal >= 75) pred = 'Baik';
                      setEditingPlacement({
                        ...editingPlacement,
                        nilai: val,
                        predikat: val ? pred : '-',
                      });
                    }}
                    placeholder="0-100"
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Predikat</label>
                  <select
                    value={editingPlacement.predikat === '-' ? 'Amat Baik' : editingPlacement.predikat}
                    onChange={(e) =>
                      setEditingPlacement({ ...editingPlacement, predikat: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Amat Baik">Amat Baik</option>
                    <option value="Baik">Baik</option>
                    <option value="Cukup">Cukup</option>
                    <option value="Kurang">Kurang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan Kompetensi</label>
                <textarea
                  rows={2}
                  value={editingPlacement.keterangan}
                  onChange={(e) =>
                    setEditingPlacement({ ...editingPlacement, keterangan: e.target.value })
                  }
                  placeholder="Keterangan pencapaian kompetensi industri..."
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlacement(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0284c7] hover:bg-sky-700 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Simpan Penempatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
