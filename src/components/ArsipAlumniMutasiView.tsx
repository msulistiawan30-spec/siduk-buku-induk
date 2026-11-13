import React, { useState, useEffect, useMemo } from 'react';
import { Student, SchoolSettings } from '../types';
import {
  Archive,
  GraduationCap,
  ArrowLeftRight,
  Calendar,
  Clock,
  Search,
  LogOut,
  Eye,
  Printer,
  FileText,
  User,
  MapPin,
  FolderOpen,
  ArrowLeft,
  X,
  MessageCircle,
  Download,
  Plus,
  Building,
} from 'lucide-react';

export interface ArsipRecord {
  id: string;
  nipd: string;
  nisn: string;
  fullName: string;
  birthPlace: string;
  birthDate: string; // "01/01/2010"
  gender: 'Laki-laki' | 'Perempuan';
  programKeahlian: string; // e.g. "TSM", "DKV"
  faseKelas: string; // e.g. "E / X TSM 1"
  address: string;
  statusArsip: 'Mutasi Keluar' | 'Alumni / Lulus';
  // Mutasi fields
  tujuanSekolah?: string;
  tglMutasi?: string;
  alasanPindah?: string;
  nomorSuratPindah?: string;
  // Alumni fields
  tahunLulus?: string;
  tglLulus?: string;
  nomorIjazah?: string;
}

const DEFAULT_ARSIP_RECORDS: ArsipRecord[] = [
  {
    id: 'ars-1',
    nipd: '0000/000.000',
    nisn: '0000000000',
    fullName: 'SISWA CONTOH',
    birthPlace: 'BOJONEGORO',
    birthDate: '01/01/2010',
    gender: 'Laki-laki',
    programKeahlian: 'TSM',
    faseKelas: 'E / X TSM 1',
    address: 'Jl. Contoh No. 1',
    statusArsip: 'Mutasi Keluar',
    tujuanSekolah: 'PINDAH SEKOLAH',
    tglMutasi: '02/11/2026',
    alasanPindah: 'Keinginan sendiri / Mengikuti orang tua',
    nomorSuratPindah: '2026 / 0000/000.000 / BID-MK',
  },
];

// Sample alumni records for Tab 2 demo
const SAMPLE_GRADUATED_ALUMNI: ArsipRecord[] = [
  {
    id: 'ars-alm-1',
    nipd: '9307/307.307',
    nisn: '9000000007',
    fullName: 'SISWA CONTOH 7',
    birthPlace: 'BOJONEGORO',
    birthDate: '14/03/2007',
    gender: 'Laki-laki',
    programKeahlian: 'DKV',
    faseKelas: 'F / XII DKV',
    address: 'Desa Sumbertlaseh RT 02 RW 01 Kec. Dander Bojonegoro',
    statusArsip: 'Alumni / Lulus',
    tahunLulus: '2026',
    tglLulus: '03/11/2026',
    nomorIjazah: 'DN-01/M-SMK/24/0000001',
  },
  {
    id: 'ars-alm-2',
    nipd: '9309/309.309',
    nisn: '9000000301',
    fullName: 'SISWA CONTOH 44',
    birthPlace: 'BOJONEGORO',
    birthDate: '21/05/2007',
    gender: 'Laki-laki',
    programKeahlian: 'DKV',
    faseKelas: 'F / XII DKV',
    address: 'Ds. Ngumpakdalem RT 05 RW 02 Dander Bojonegoro',
    statusArsip: 'Alumni / Lulus',
    tahunLulus: '2026',
    tglLulus: '03/11/2026',
    nomorIjazah: 'DN-01/M-SMK/24/0000002',
  },
];

interface ArsipAlumniMutasiViewProps {
  students: Student[];
  schoolSettings?: SchoolSettings;
  onOpenStudent?: (student: Student) => void;
  onNavigate?: (menu: string) => void;
}

export const ArsipAlumniMutasiView: React.FC<ArsipAlumniMutasiViewProps> = ({
  students,
  schoolSettings = {
    name: 'SMKN DANDER',
    npsn: '20541259',
    address: 'Jl. KHR. Moh Rosyid Desa Sumbertlaseh Kec. Dander Bojonegoro',
    principalName: 'DR. MOLYONO.,M.MPD',
    principalNip: '-',
    activeAcademicYear: '2026/2027',
  } as SchoolSettings,
  onOpenStudent,
  onNavigate,
}) => {
  // Real-time clock matching Gambar 1 (09:52:09)
  const [currentTime, setCurrentTime] = useState<string>('09:52:09');
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

  // Active Tab state: 'semua' | 'alumni' | 'mutasi' (matching Gambar 1, 2, 3)
  const [activeTab, setActiveTab] = useState<'semua' | 'alumni' | 'mutasi'>('semua');

  // Datastore
  const [records, setRecords] = useState<ArsipRecord[]>(() => {
    try {
      const saved = localStorage.getItem('siduk_arsip_alumni_mutasi_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_ARSIP_RECORDS;
  });

  // Table controls
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [previewSuratPindah, setPreviewSuratPindah] = useState<ArsipRecord | null>(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState<boolean>(false);

  // Filtered records based on active tab and search
  const filteredRecords = useMemo(() => {
    let list = records;
    if (activeTab === 'alumni') {
      list = records.filter((r) => r.statusArsip === 'Alumni / Lulus');
    } else if (activeTab === 'mutasi') {
      list = records.filter((r) => r.statusArsip === 'Mutasi Keluar');
    }

    const term = searchTerm.toLowerCase().trim();
    if (!term) return list;
    return list.filter(
      (r) =>
        r.fullName.toLowerCase().includes(term) ||
        r.nipd.toLowerCase().includes(term) ||
        r.nisn.toLowerCase().includes(term) ||
        r.programKeahlian.toLowerCase().includes(term) ||
        (r.tujuanSekolah && r.tujuanSekolah.toLowerCase().includes(term))
    );
  }, [records, activeTab, searchTerm]);

  // Paginated records
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / entriesPerPage));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredRecords.slice(start, start + entriesPerPage);
  }, [filteredRecords, currentPage, entriesPerPage]);

  // Load sample alumni toggle
  const handleToggleSampleAlumni = () => {
    const hasAlumni = records.some((r) => r.statusArsip === 'Alumni / Lulus');
    if (hasAlumni) {
      setRecords(DEFAULT_ARSIP_RECORDS);
    } else {
      setRecords([...DEFAULT_ARSIP_RECORDS, ...SAMPLE_GRADUATED_ALUMNI]);
    }
  };

  // Direct print handler for Surat Pindah
  const handlePrintSurat = (record: ArsipRecord) => {
    setPreviewSuratPindah(record);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <section className="space-y-6">
      {/* Top Header & Real-time Clock matching Gambar 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Arsip Alumni &amp; Mutasi Siswa
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Database rekam jejak berkas arsip siswa yang telah lulus (alumni) maupun mutasi keluar dari sekolah.
          </p>
        </div>

        {/* Date and Live Clock Badges */}
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

      {/* Main Card: Arsip Alumni & Riwayat Mutasi Siswa */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden no-print">
        {/* Card Header matching Gambar 1 */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Archive className="w-5 h-5 text-slate-600" />
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Arsip Alumni &amp; Riwayat Mutasi Siswa
            </h2>
            <span className="px-2 py-0.5 bg-sky-50 text-sky-700 font-bold text-[10px] rounded border border-sky-200 flex items-center gap-1">
              <Building className="w-3 h-3 text-sky-600" /> Jenjang: SMK
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSampleAlumni}
              className="text-[11px] text-slate-500 hover:text-slate-800 underline mr-2 cursor-pointer"
            >
              {records.some((r) => r.statusArsip === 'Alumni / Lulus')
                ? 'Tutup Contoh Data Alumni'
                : '+ Muat Contoh Alumni Lulus'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('siswa');
              }}
              className="px-3.5 py-1.5 border border-sky-600 text-sky-700 hover:bg-sky-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Data Siswa Aktif
            </button>
          </div>
        </div>

        {/* Tab Navigation: 3 Tabs matching Gambar 1, 2, 3 */}
        <div className="px-6 pt-4 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          {/* Tab 1: Semua Arsip */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('semua');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'semua'
                ? 'bg-[#008ba3] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Archive className="w-3.5 h-3.5" /> Semua Arsip
          </button>

          {/* Tab 2: Alumni / Lulus */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('alumni');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'alumni'
                ? 'bg-[#008ba3] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Alumni / Lulus
          </button>

          {/* Tab 3: Riwayat Mutasi Keluar */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('mutasi');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'mutasi'
                ? 'bg-[#008ba3] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" /> Riwayat Mutasi Keluar
          </button>
        </div>

        {/* Card Body & Table Controls */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span>Tampilkan</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entri</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <span>Cari:</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="p-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#008ba3] w-48 sm:w-56"
              />
            </div>
          </div>

          {/* Table matching Gambar 1, 2, 3 */}
          <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-2xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase">
                  <th className="p-3 w-12 text-center cursor-pointer hover:bg-slate-100 select-none">
                    NO <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                  <th className="p-3 w-36 cursor-pointer hover:bg-slate-100 select-none">
                    NIPD / NISN <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                  <th className="p-3 cursor-pointer hover:bg-slate-100 select-none">
                    IDENTITAS SISWA <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                  <th className="p-3 w-36 cursor-pointer hover:bg-slate-100 select-none">
                    PROGRAM KEAHLIAN <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                  <th className="p-3 w-36 cursor-pointer hover:bg-slate-100 select-none">
                    STATUS ARSIP <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                  <th className="p-3 w-60 cursor-pointer hover:bg-slate-100 select-none">
                    KETERANGAN KELULUSAN / MUTASI <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                  <th className="p-3 w-28 text-center cursor-pointer hover:bg-slate-100 select-none">
                    AKSI <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRecords.length === 0 ? (
                  // Exact Empty State from Gambar 2 (image_4ef3bcb1)
                  <tr>
                    <td colSpan={7} className="py-14 text-center bg-white">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FolderOpen className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                        <span className="text-xs text-slate-500 font-medium">
                          Tidak ada data arsip alumni atau mutasi untuk jenjang <strong>SMK</strong>.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((item, idx) => {
                    const rowNumber = (currentPage - 1) * entriesPerPage + idx + 1;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 bg-white transition">
                        {/* NO */}
                        <td className="p-3 text-center font-bold text-slate-500">
                          {rowNumber}
                        </td>

                        {/* NIPD / NISN */}
                        <td className="p-3">
                          <strong className="text-slate-800 text-xs font-bold block">
                            {item.nipd}
                          </strong>
                          <span className="text-[11px] text-slate-400 font-mono">
                            NISN: {item.nisn}
                          </span>
                        </td>

                        {/* IDENTITAS SISWA */}
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-slate-900 font-bold uppercase text-xs block">
                                {item.fullName}
                              </strong>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                {item.birthPlace}, {item.birthDate}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* PROGRAM KEAHLIAN */}
                        <td className="p-3">
                          <span className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] rounded">
                            {item.programKeahlian}
                          </span>
                        </td>

                        {/* STATUS ARSIP */}
                        <td className="p-3">
                          {item.statusArsip === 'Mutasi Keluar' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-[#d9534f] text-white shadow-2xs">
                              <LogOut className="w-3 h-3" /> Mutasi Keluar
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-600 text-white shadow-2xs">
                              <GraduationCap className="w-3 h-3" /> Alumni / Lulus
                            </span>
                          )}
                        </td>

                        {/* KETERANGAN KELULUSAN / MUTASI */}
                        <td className="p-3 text-[11px] text-slate-700 space-y-0.5">
                          {item.statusArsip === 'Mutasi Keluar' ? (
                            <>
                              <div>
                                <strong>Tujuan:</strong> {item.tujuanSekolah || 'Pindah sekolah'}
                              </div>
                              <div className="text-slate-500">
                                <strong>Tgl Mutasi:</strong> {item.tglMutasi || '02/11/2026'}
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <strong>Tahun Lulus:</strong> {item.tahunLulus || '2026'}
                              </div>
                              <div className="text-slate-500 font-mono text-[10px]">
                                <strong>No Ijazah:</strong> {item.nomorIjazah || '-'}
                              </div>
                            </>
                          )}
                        </td>

                        {/* AKSI matching Gambar 1 & Gambar 3 */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* 1. Preview Surat */}
                            <button
                              type="button"
                              title="Lihat Pratinjau Surat Pindah"
                              onClick={() => setPreviewSuratPindah(item)}
                              className="p-1.5 bg-[#008ba3] hover:bg-cyan-700 text-white rounded transition shadow-2xs cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* 2. Print Surat */}
                            <button
                              type="button"
                              title="Cetak Surat Keterangan Pindah Sekolah"
                              onClick={() => handlePrintSurat(item)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition shadow-2xs cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {/* 3. Detail Induk */}
                            <button
                              type="button"
                              title="Buka Berkas Buku Induk"
                              onClick={() => {
                                const found = students.find((s) => s.nipd === item.nipd);
                                if (found && onOpenStudent) {
                                  onOpenStudent(found);
                                } else {
                                  setPreviewSuratPindah(item);
                                }
                              }}
                              className="p-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded transition shadow-2xs cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
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

          {/* Table Footer: Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div>
              {filteredRecords.length === 0 ? (
                <span>Menampilkan 0 sampai 0 dari 0 entri</span>
              ) : (
                <span>
                  Menampilkan {(currentPage - 1) * entriesPerPage + 1} sampai{' '}
                  {Math.min(currentPage * entriesPerPage, filteredRecords.length)} dari{' '}
                  {filteredRecords.length} entri
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 self-end sm:self-auto">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                className="px-3 py-1.5 bg-[#008ba3] text-white rounded text-xs font-bold shadow-2xs"
              >
                1
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages || filteredRecords.length === 0}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MODAL PREVIEW & CETAK: SURAT KETERANGAN PINDAH SEKOLAH
          Matching Surat_Keterangan_Pindah_-_SISWA_CONTOH_b3e9c0d4.pdf
         ======================================================== */}
      {previewSuratPindah && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3 no-print">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-600" /> Pratinjau Surat Keterangan Pindah Sekolah
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak Dokumen (A4)
                </button>
                <button
                  onClick={() => setPreviewSuratPindah(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* A4 Sheet Preview matching the PDF */}
            <div className="p-8 border border-slate-300 rounded-lg bg-white shadow-inner font-serif text-slate-900 text-xs leading-relaxed max-h-[75vh] overflow-y-auto">
              {/* Header / Kop Surat matching PDF */}
              <div className="text-center relative pb-3 border-b-2 border-black">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full border border-slate-400 flex items-center justify-center text-sky-800 font-bold text-lg">
                    🎓
                  </div>
                  <div className="text-center space-y-0.5">
                    <div className="font-bold text-xs uppercase tracking-wider">
                      DINAS PENDIDIKAN PROVINSI
                    </div>
                    <div className="font-bold text-xs uppercase tracking-wider">
                      CABANG DINAS BOJONEGORO
                    </div>
                    <div className="font-black text-lg tracking-wide uppercase text-slate-900">
                      {schoolSettings.name}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700">
                      TERAKREDITASI : "A" | NPSN : {schoolSettings.npsn}
                    </div>
                    <div className="text-[10px] text-slate-600 font-sans">
                      Alamat : {schoolSettings.address}
                    </div>
                    <div className="text-[10px] text-slate-600 font-sans">
                      Website : smkn-dander.syntaxtrust.web.id • E-mail : smkn_dander@yahoo.co.id • Telp.
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Nomor Surat */}
              <div className="text-center mt-6 mb-5 space-y-0.5">
                <div className="font-bold text-sm uppercase underline tracking-wider">
                  SURAT KETERANGAN PINDAH SEKOLAH
                </div>
                <div className="text-xs font-sans text-slate-700">
                  Nomor: {previewSuratPindah.nomorSuratPindah || '2026 / 0000/000.000 / BID-MK'}
                </div>
              </div>

              {/* Body */}
              <p className="mt-4 mb-3 font-sans text-xs">
                Yang bertanda tangan di bawah ini, Kepala Sekolah {schoolSettings.name}, menerangkan bahwa:
              </p>

              {/* Data Table */}
              <table className="w-full text-xs font-sans mb-4 ml-2">
                <tbody>
                  <tr>
                    <td className="w-56 py-1 text-slate-700">Nama Peserta Didik</td>
                    <td className="w-4">:</td>
                    <td className="font-bold uppercase text-slate-900">{previewSuratPindah.fullName}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-700">Nomor Induk Peserta Didik (NIPD)</td>
                    <td>:</td>
                    <td className="font-bold">{previewSuratPindah.nipd}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-700">Nomor Induk Siswa Nasional (NISN)</td>
                    <td>:</td>
                    <td className="font-mono">{previewSuratPindah.nisn}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-700">Tempat, Tanggal Lahir</td>
                    <td>:</td>
                    <td>{previewSuratPindah.birthPlace}, {previewSuratPindah.birthDate}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-700">Jenis Kelamin</td>
                    <td>:</td>
                    <td>{previewSuratPindah.gender}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-700">Program Keahlian</td>
                    <td>:</td>
                    <td className="font-bold">{previewSuratPindah.programKeahlian}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-700">Fase / Kelas saat pindah</td>
                    <td>:</td>
                    <td>{previewSuratPindah.faseKelas}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-700 align-top">Alamat Peserta Didik</td>
                    <td className="align-top">:</td>
                    <td>{previewSuratPindah.address}</td>
                  </tr>
                </tbody>
              </table>

              <p className="font-sans text-xs my-2">
                Telah mengajukan pindah sekolah atas permintaan sendiri/orang tua dengan alasan:
              </p>

              <div className="font-bold font-sans text-xs my-2 italic pl-6 text-slate-800">
                "{previewSuratPindah.alasanPindah || 'Keinginan sendiri / Mengikuti orang tua'}"
              </div>

              <p className="font-sans text-xs my-2">
                Peserta didik tersebut di atas akan pindah ke sekolah:
              </p>

              <table className="w-full text-xs font-sans mb-4 ml-2">
                <tbody>
                  <tr>
                    <td className="w-56 py-1 text-slate-700">Nama Sekolah Tujuan</td>
                    <td className="w-4">:</td>
                    <td className="font-bold uppercase text-slate-900">{previewSuratPindah.tujuanSekolah || 'PINDAH SEKOLAH'}</td>
                  </tr>
                </tbody>
              </table>

              <p className="font-sans text-xs mt-3 mb-8">
                Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.
              </p>

              {/* Signatures matching PDF */}
              <div className="grid grid-cols-2 gap-8 text-center font-sans text-xs pt-4">
                <div className="space-y-16">
                  <div>Orang Tua / Wali,</div>
                  <div>
                    <span className="inline-block border-b border-black w-48"></span>
                  </div>
                </div>

                <div className="space-y-16">
                  <div>
                    <div>Bojonegoro, {previewSuratPindah.tglMutasi || '03 November 2026'}</div>
                    <div>Kepala Sekolah,</div>
                  </div>
                  <div>
                    <div className="font-bold uppercase underline">
                      {schoolSettings.principalName || 'DR. MOLYONO.,M.MPD'}
                    </div>
                    <div className="text-[11px] text-slate-600">NIP. {schoolSettings.principalNip || '-'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t no-print">
              <button
                type="button"
                onClick={() => setPreviewSuratPindah(null)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* License Modal */}
      {isLicenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
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
                <strong>Fitur Arsip Alumni &amp; Mutasi:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  <li>Penyimpanan Permanen Berkas Mutasi Keluar &amp; Buku Alumni</li>
                  <li>Cetak Otomatis Blanko Surat Keterangan Pindah Sekolah (Format Standar Kemendikbud)</li>
                  <li>Sinkronisasi Buku Klapper &amp; Buku Register Induk</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsLicenseModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
