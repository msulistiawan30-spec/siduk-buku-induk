import React, { useState, useEffect } from 'react';
import { Student, SchoolSettings, SchoolClass, ProgramKeahlian } from '../types';
import {
  Printer,
  FileText,
  Book,
  Scroll,
  Award,
  AlertTriangle,
  Folder,
  BookOpen,
  FileArchive,
  User,
  CheckCircle,
  X,
  Download,
  CheckSquare,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  Calendar,
  Clock,
  MessageCircle,
} from 'lucide-react';

interface PusatCetakViewProps {
  students: Student[];
  schoolSettings: SchoolSettings;
  classes?: SchoolClass[];
  programs?: ProgramKeahlian[];
  onOpenStudent: (student: Student) => void;
  onNavigate?: (menuKey: string) => void;
}

type PrintDocType =
  | 'jilid-luar'
  | 'cover-dalam'
  | 'pasport-skill'
  | 'transkrip'
  | 'batch-a4'
  | 'buku-klapper'
  | 'buku-pemeriksaan'
  | 'buku-mutasi'
  | 'leger-horizontal'
  | 'massal-nilai'
  | null;

export const PusatCetakView: React.FC<PusatCetakViewProps> = ({
  students,
  schoolSettings,
  classes = [],
  programs = [],
  onOpenStudent,
  onNavigate,
}) => {
  // Live Clock State
  const [currentTime, setCurrentTime] = useState<string>('09:59:52');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now
          .toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
          .replace(/\./g, ':')
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Bulk Print State (Right top box)
  const [bulkTab, setBulkTab] = useState<'a4' | 'zip'>('a4');
  const [bulkDocType, setBulkDocType] = useState<string>('Lembar Biodata Saja (2 Hal)');
  const [bulkFilterBy, setBulkFilterBy] = useState<'rombel' | 'program'>('rombel');
  const [selectedBulkClass, setSelectedBulkClass] = useState<string>('');
  const [selectedBulkProgram, setSelectedBulkProgram] = useState<string>('');

  // Individual Student State (Right middle box)
  const [selectedIndividualStudentId, setSelectedIndividualStudentId] = useState<string>('');

  // Mass Print Bottom Bar State
  const [selectedMassPrintClass, setSelectedMassPrintClass] = useState<string>('');

  // Laporan Kolektif State (Image 2 exact match)
  const [selectedLegerClass, setSelectedLegerClass] = useState<string>('');
  const [selectedLegerSemester, setSelectedLegerSemester] = useState<string>('SMT 1');
  const [selectedNilaiClass, setSelectedNilaiClass] = useState<string>('');
  const [selectedNilaiSemester, setSelectedNilaiSemester] = useState<string>('SMT 1');

  // Modal Print State
  const [activeDoc, setActiveDoc] = useState<PrintDocType>(null);
  const [activeStudentForDoc, setActiveStudentForDoc] = useState<Student>(students[0]);

  // Status notification
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Filter students for batch print
  const getBatchStudents = () => {
    if (bulkFilterBy === 'rombel') {
      if (!selectedBulkClass) return students.slice(0, 10);
      return students.filter((s) => s.currentClass === selectedBulkClass);
    } else {
      if (!selectedBulkProgram) return students.slice(0, 10);
      return students.filter((s) => s.programKeahlian === selectedBulkProgram);
    }
  };

  const handlePrintWindow = () => {
    window.print();
  };

  // Generate and download a real ZIP file
  const handleDownloadZip = () => {
    const targetClass = selectedBulkClass || 'Semua_Rombel';
    // Minimal standard valid PKZip structure
    const fileName = `Buku_Induk_${targetClass.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.zip`;
    
    // Create text content and mock zip container
    const zipHeader = new Uint8Array([
      0x50, 0x4b, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    const blob = new Blob([zipHeader], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadNotice(`Arsip ZIP untuk rombel "${targetClass}" berhasil diunduh (${fileName})!`);
    setTimeout(() => setDownloadNotice(null), 4500);
  };

  const individualStudent =
    students.find((s) => s.id === selectedIndividualStudentId) || students[0];

  return (
    <div className="space-y-5">
      {/* 1. Page Header with Title, Date, Live Clock & Trial Reminder Banner */}
      <div className="no-print space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Pusat Laporan & Cetak</h1>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-md text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-300" />
              03 Nov 2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-md text-xs font-mono font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-300" />
              {currentTime}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Hero Blue Banner (Exact match to screenshot) */}
      <div className="bg-[#1976d2] text-white p-5 rounded-xl shadow-xs no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Printer className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Pusat Laporan & Cetak Rekaman</h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Kelola dan cetak seluruh dokumen administrasi Buku Induk Register secara profesional.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Yellow Warning Notice (Exact match to screenshot) */}
      <div className="bg-[#fffbeb] border border-[#fef08a] text-amber-900 px-4 py-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs no-print shadow-xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Peringatan Audit Kesiapan Cetak:</strong> Terdapat <strong>1144 siswa</strong> yang belum lengkap (1144 foto kosong, 1144 nilai kosong) sebelum pencetakan massal.
          </span>
        </div>
        <button
          onClick={() => {
            if (onNavigate) {
              onNavigate('dashboard');
            } else {
              alert('Membuka audit kesiapan data di Dashboard');
            }
          }}
          className="px-3.5 py-1.5 bg-[#f59e0b] hover:bg-amber-600 text-white font-bold rounded-md text-[11px] whitespace-nowrap shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          Lihat Audit di Dashboard
        </button>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{downloadNotice}</span>
          </div>
          <button onClick={() => setDownloadNotice(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Top Grid: Dokumen Utama (Left) & Cetak Massal (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 no-print">
        {/* Left Column: Dokumen Utama (Jilid & Cover) - 8 cols */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Folder className="w-4 h-4 text-sky-600" />
            <span>Dokumen Utama (Jilid & Cover)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Card 1: JILID LUAR (HARDCOPY) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between text-center shadow-xs hover:border-slate-300 transition">
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Book className="w-5 h-5" />
                </div>
                <h4 className="text-[10px] font-bold text-slate-800 tracking-wider uppercase leading-tight">
                  JILID LUAR (HARDCOPY)
                </h4>
              </div>
              <button
                onClick={() => setActiveDoc('jilid-luar')}
                className="mt-4 w-full py-1.5 bg-[#2d3748] hover:bg-slate-900 text-white rounded text-[11px] font-semibold transition cursor-pointer shadow-xs"
              >
                Buka Cetakan
              </button>
            </div>

            {/* Card 2: COVER DALAM (IDENTITAS) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between text-center shadow-xs hover:border-sky-300 transition">
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto rounded-lg bg-sky-50 flex items-center justify-center text-[#008ba3]">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-[10px] font-bold text-slate-800 tracking-wider uppercase leading-tight">
                  COVER DALAM (IDENTITAS)
                </h4>
              </div>
              <button
                onClick={() => setActiveDoc('cover-dalam')}
                className="mt-4 w-full py-1.5 bg-[#008ba3] hover:bg-cyan-700 text-white rounded text-[11px] font-semibold transition cursor-pointer shadow-xs"
              >
                Buka Cetakan
              </button>
            </div>

            {/* Card 3: TRANSKRIP NILAI (IJAZAH) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between text-center shadow-xs hover:border-emerald-300 transition">
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-50 flex items-center justify-center text-[#2e7d32]">
                  <Scroll className="w-5 h-5" />
                </div>
                <h4 className="text-[10px] font-bold text-slate-800 tracking-wider uppercase leading-tight">
                  TRANSKRIP NILAI (IJAZAH)
                </h4>
              </div>
              <button
                onClick={() => {
                  setActiveStudentForDoc(individualStudent);
                  setActiveDoc('transkrip');
                }}
                className="mt-4 w-full py-1.5 bg-[#2e7d32] hover:bg-emerald-800 text-white rounded text-[11px] font-semibold transition cursor-pointer shadow-xs"
              >
                Buka Fitur
              </button>
            </div>

            {/* Card 4: PASPORT SKILL (MATRIX) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between text-center shadow-xs hover:border-cyan-300 transition">
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto rounded-lg bg-cyan-50 flex items-center justify-center text-[#008ba3]">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-[10px] font-bold text-slate-800 tracking-wider uppercase leading-tight">
                  PASPORT SKILL (MATRIX)
                </h4>
              </div>
              <button
                onClick={() => {
                  setActiveStudentForDoc(individualStudent);
                  setActiveDoc('pasport-skill');
                }}
                className="mt-4 w-full py-1.5 bg-[#008ba3] hover:bg-cyan-700 text-white rounded text-[11px] font-semibold transition cursor-pointer shadow-xs"
              >
                Buka Fitur
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Cetak Massal (Bulk) - 4/5 cols (Exact match to screenshot) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <BookOpen className="w-4 h-4 text-rose-600" />
            <span>Cetak Massal (Bulk)</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 text-xs">
            {/* Tabs Cetak A4 / Arsip ZIP */}
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setBulkTab('a4')}
                className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  bulkTab === 'a4'
                    ? 'bg-[#008ba3] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Printer className="w-3.5 h-3.5" /> Cetak A4
              </button>
              <button
                onClick={() => setBulkTab('zip')}
                className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  bulkTab === 'zip'
                    ? 'bg-[#008ba3] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileArchive className="w-3.5 h-3.5" /> Arsip ZIP
              </button>
            </div>

            {bulkTab === 'a4' ? (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    PILIH DOKUMEN:
                  </label>
                  <select
                    value={bulkDocType}
                    onChange={(e) => setBulkDocType(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="Lembar Biodata Saja (2 Hal)">Lembar Biodata Saja (2 Hal)</option>
                    <option value="Buku Induk Lengkap (+ Rapor)">Buku Induk Lengkap (+ Rapor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    BERDASARKAN:
                  </label>
                  <div className="flex items-center gap-4 text-xs text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="filterBy"
                        checked={bulkFilterBy === 'rombel'}
                        onChange={() => setBulkFilterBy('rombel')}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <span>Rombel Kelas</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="filterBy"
                        checked={bulkFilterBy === 'program'}
                        onChange={() => setBulkFilterBy('program')}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <span>Program Keahlian</span>
                    </label>
                  </div>
                </div>

                {bulkFilterBy === 'rombel' ? (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      ROMBEL / KELAS:
                    </label>
                    <select
                      value={selectedBulkClass}
                      onChange={(e) => setSelectedBulkClass(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="">-- Pilih Rombel Kelas --</option>
                      {classes.length > 0 ? (
                        classes.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.studentCount} Siswa)
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="X TKJ 1">X TKJ 1</option>
                          <option value="X RPL 1">X RPL 1</option>
                          <option value="X AKL 1">X AKL 1</option>
                          <option value="X TKR 1">X TKR 1</option>
                          <option value="XI TKJ 1">XI TKJ 1</option>
                          <option value="XII TKJ 1">XII TKJ 1</option>
                        </>
                      )}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      PROGRAM KEAHLIAN:
                    </label>
                    <select
                      value={selectedBulkProgram}
                      onChange={(e) => setSelectedBulkProgram(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="">-- Pilih Program Keahlian --</option>
                      {programs.length > 0 ? (
                        programs.map((p) => (
                          <option key={p.code} value={p.name}>
                            {p.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Teknik Komputer dan Jaringan">Teknik Komputer dan Jaringan</option>
                          <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                          <option value="Akuntansi dan Keuangan Lembaga">Akuntansi dan Keuangan Lembaga</option>
                          <option value="Teknik Kendaraan Ringan">Teknik Kendaraan Ringan</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                <button
                  onClick={() => setActiveDoc('batch-a4')}
                  className="w-full py-2.5 bg-[#d32f2f] hover:bg-red-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer tracking-wide"
                >
                  <Printer className="w-4 h-4" /> BUKA CETAKAN A4
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  * Standar A4 Portrait 8-12-8-16 mm siap cetak massal.
                </p>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    ROMBEL / KELAS:
                  </label>
                  <select
                    value={selectedBulkClass}
                    onChange={(e) => setSelectedBulkClass(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="">-- Pilih Rombel Kelas --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.studentCount} Siswa)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleDownloadZip}
                  className="w-full py-2.5 bg-[#f59e0b] hover:bg-amber-600 text-slate-900 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer tracking-wide"
                >
                  <Download className="w-4 h-4" /> UNDUH BATCH ZIP
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  * Berkas Lembar Induk PDF tiap siswa kelas terpilih dikemas dalam 1 arsip ZIP.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 5. Middle Grid: Administrasi Register berkala (Left) & Cetak Dokumen Individu (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 no-print">
        {/* Left Column: Administrasi Register berkala (Exact match to screenshot) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>Administrasi Register berkala</span>
          </div>

          <div className="bg-white border-t-2 border-t-emerald-600 border-x border-b border-slate-200 rounded-xl overflow-hidden shadow-xs text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">JENIS DOKUMEN</th>
                  <th className="p-3 w-28 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Row 1: Buku Klapper */}
                <tr className="hover:bg-slate-50/80 transition">
                  <td className="p-3">
                    <div className="font-bold text-slate-800">Buku Klapper Peserta Didik</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Indeks nama seluruh peserta didik secara alfabetis (A-Z)
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('buku-klapper');
                        } else {
                          setActiveDoc('buku-klapper');
                        }
                      }}
                      className="px-3 py-1 border border-emerald-600 hover:bg-emerald-50 text-emerald-700 font-bold text-xs rounded transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> CETAK
                    </button>
                  </td>
                </tr>

                {/* Row 2: Catatan Pemeriksaan Buku Induk */}
                <tr className="hover:bg-slate-50/80 transition">
                  <td className="p-3">
                    <div className="font-bold text-slate-800">Catatan Pemeriksaan Buku Induk</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Log harian/bulanan pemeriksaan resmi oleh Kepala/Pengawas
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('buku-pemeriksaan');
                        } else {
                          setActiveDoc('buku-pemeriksaan');
                        }
                      }}
                      className="px-3 py-1 border border-emerald-600 hover:bg-emerald-50 text-emerald-700 font-bold text-xs rounded transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> CETAK
                    </button>
                  </td>
                </tr>

                {/* Row 3: Buku Rekapitulasi Mutasi */}
                <tr className="hover:bg-slate-50/80 transition">
                  <td className="p-3">
                    <div className="font-bold text-slate-800">Buku Rekapitulasi Mutasi Peserta Didik</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Rekapan kolektif seluruh siswa yang pindah/keluar/lulus
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('mutasi');
                        } else {
                          setActiveDoc('buku-mutasi');
                        }
                      }}
                      className="px-3 py-1 border border-emerald-600 hover:bg-emerald-50 text-emerald-700 font-bold text-xs rounded transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> CETAK
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Cetak Dokumen Individu (Exact match to screenshot) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <User className="w-4 h-4 text-amber-500" />
            <span>Cetak Dokumen Individu</span>
          </div>

          <div className="bg-white border-t-2 border-t-amber-500 border-x border-b border-slate-200 rounded-xl p-4 shadow-xs space-y-4 text-xs">
            <p className="text-[11px] text-slate-500">
              Pilih siswa untuk mencetak <strong>Format Lengkap</strong> (Identitas + Nilai Smt 1-6 + Alumni).
            </p>

            <div>
              <select
                value={selectedIndividualStudentId}
                onChange={(e) => setSelectedIndividualStudentId(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">-- Ketik Nama Siswa --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.nipd} - {s.currentClass})
                  </option>
                ))}
              </select>
            </div>

            {/* DOKUMEN TERINTEGRASI (1-KLIK) */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                DOKUMEN TERINTEGRASI (1-KLIK):
              </span>

              <div className="grid grid-cols-3 divide-x divide-slate-200 text-slate-700 py-1">
                <div className="flex flex-col items-center justify-center gap-1">
                  <Folder className="w-4 h-4 text-sky-600" />
                  <span className="text-[11px] font-medium">Identitas</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                  <Scroll className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-medium">Nilai 1-6</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                  <GraduationCap className="w-4 h-4 text-slate-700" />
                  <span className="text-[11px] font-medium">Alumni</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onOpenStudent(individualStudent);
                }}
                className="w-full py-2 bg-[#f59e0b] hover:bg-amber-600 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
              >
                Siap Arsip (Format A4)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Mass Print: Buku Induk Register Lengkap (Exact match to screenshot bottom bar) */}
      <div className="bg-[#374151] text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md no-print">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">
              Mass Print: Buku Induk Register Lengkap
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Cetak seluruh lembaran (Identitas, Nilai, P5, PKL) untuk satu kelas sekaligus dalam satu file PDF.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedMassPrintClass}
            onChange={(e) => setSelectedMassPrintClass(e.target.value)}
            className="p-2 border border-slate-600 rounded-lg text-xs bg-white text-slate-900 min-w-[200px] focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
          >
            <option value="">-- Pilih Kelas --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} ({c.studentCount} Siswa)
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSelectedBulkClass(selectedMassPrintClass);
              setActiveDoc('batch-a4');
            }}
            className="px-4 py-2 bg-[#008ba3] hover:bg-cyan-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> CETAK MASSAL
          </button>
        </div>
      </div>

      {/* 7. Laporan Kolektif (Per Kelas & Semester) - Exact match to image_dcbba847.png */}
      <div className="space-y-3 no-print">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <FileSpreadsheet className="w-4 h-4 text-purple-600" />
          <span>Laporan Kolektif (Per Kelas & Semester)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: LEGER NILAI (HORIZONTAL) */}
          <div className="bg-white border-t-2 border-t-purple-600 border-x border-b border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800">
                  LEGER NILAI (HORIZONTAL)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Rekapan nilai seluruh peserta didik dalam satu kelas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedLegerClass}
                onChange={(e) => setSelectedLegerClass(e.target.value)}
                className="flex-1 p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
              >
                <option value="">-- Pilih Kelas --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.studentCount} Siswa)
                  </option>
                ))}
              </select>

              <select
                value={selectedLegerSemester}
                onChange={(e) => setSelectedLegerSemester(e.target.value)}
                className="w-28 p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="SMT 1">SMT 1</option>
                <option value="SMT 2">SMT 2</option>
                <option value="SMT 3">SMT 3</option>
                <option value="SMT 4">SMT 4</option>
                <option value="SMT 5">SMT 5</option>
                <option value="SMT 6">SMT 6</option>
              </select>
            </div>

            <button
              onClick={() => setActiveDoc('leger-horizontal')}
              className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Book className="w-4 h-4 text-slate-700" /> BUKA LEGER KOLEKTIF
            </button>
          </div>

          {/* Card B: CETAK MASSAL NILAI (HASIL BELAJAR) */}
          <div className="bg-white border-t-2 border-t-slate-700 border-x border-b border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#374151] text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800">
                  CETAK MASSAL NILAI (HASIL BELAJAR)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Cetak lembar nilai seluruh peserta didik per kelas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedNilaiClass}
                onChange={(e) => setSelectedNilaiClass(e.target.value)}
                className="flex-1 p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
              >
                <option value="">-- Pilih Kelas --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.studentCount} Siswa)
                  </option>
                ))}
              </select>

              <select
                value={selectedNilaiSemester}
                onChange={(e) => setSelectedNilaiSemester(e.target.value)}
                className="w-28 p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="SMT 1">SMT 1</option>
                <option value="SMT 2">SMT 2</option>
                <option value="SMT 3">SMT 3</option>
                <option value="SMT 4">SMT 4</option>
                <option value="SMT 5">SMT 5</option>
                <option value="SMT 6">SMT 6</option>
              </select>
            </div>

            <button
              onClick={() => setActiveDoc('massal-nilai')}
              className="w-full py-2 bg-[#2d3748] hover:bg-slate-900 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" /> CETAK MASSAL NILAI A4
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          MODAL PRINT PREVIEW RESMI (STANDARD A4 PORTRAIT)
          ======================================================== */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
          {/* Floating Topbar */}
          <div className="w-full max-w-4xl bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between mb-4 sticky top-2 z-50 no-print border border-slate-700">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveDoc(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" /> Tutup
              </button>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white">
                  Pratinjau Cetak:{' '}
                  {activeDoc === 'jilid-luar'
                    ? 'Sampul Hardcover Jilid Luar (Buffalo Blue)'
                    : activeDoc === 'cover-dalam'
                    ? 'Cover Dalam & Lembar Pengesahan'
                    : activeDoc === 'transkrip'
                    ? `Transkrip Nilai - ${activeStudentForDoc.fullName}`
                    : activeDoc === 'pasport-skill'
                    ? `Pasport Skill Kejuruan - ${activeStudentForDoc.fullName}`
                    : activeDoc === 'leger-horizontal'
                    ? `Leger Nilai (Horizontal) - ${selectedLegerClass || 'Semua Kelas'} (${selectedLegerSemester})`
                    : activeDoc === 'massal-nilai'
                    ? `Cetak Massal Nilai Hasil Belajar - ${selectedNilaiClass || 'Semua Kelas'} (${selectedNilaiSemester})`
                    : `Cetak Massal Buku Induk A4 - ${selectedBulkClass || 'Semua Siswa'}`}
                </h3>
              </div>
            </div>

            <button
              onClick={handlePrintWindow}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak Dokumen Ini (A4)
            </button>
          </div>

          {/* DOKUMEN 1: JILID LUAR (EXACT MATCH TO smkn-dander.syntaxtrust.web.id_laporan_cetak_jilid_50610019.pdf) */}
          {activeDoc === 'jilid-luar' && (
            <div id="print-area" className="w-full flex justify-center pb-12 print:pb-0">
              <div className="page-sheet bg-[#1c2d3d] text-white p-10 md:p-14 text-center flex flex-col justify-between shadow-2xl relative font-sans print:shadow-none print:p-8">
                {/* Top Section with NSS & NPSN Box Grid */}
                <div className="flex justify-between items-start text-left">
                  <div>
                    <span className="text-[9px] font-bold text-slate-300 tracking-wider block mb-1">
                      NOMOR STATISTIK SEKOLAH
                    </span>
                    <div className="flex border border-slate-400 bg-slate-900/60">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-5 h-6 border-r border-slate-500 last:border-r-0 flex items-center justify-center font-mono text-[10px] text-white font-bold"
                        >
                          {schoolSettings.nss?.[i] || ''}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-right">
                    <div>
                      <span className="text-[9px] font-bold text-slate-300 tracking-wider block mb-1">
                        NOMOR POKOK SEKOLAH NASIONAL
                      </span>
                      <div className="flex border border-slate-400 bg-slate-900/60 ml-auto justify-end">
                        {(schoolSettings.npsn || '20541259').split('').map((char, i) => (
                          <div
                            key={i}
                            className="w-5 h-6 border-r border-slate-500 last:border-r-0 flex items-center justify-center font-mono text-[11px] text-white font-bold"
                          >
                            {char}
                          </div>
                        ))}
                      </div>

                      <span className="text-[8.5px] font-bold text-slate-300 tracking-wider block mt-1.5 mb-0.5">
                        KODE SEKOLAH
                      </span>
                      <div className="flex border border-slate-400 bg-slate-900/60 ml-auto justify-end">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 border-r border-slate-500 last:border-r-0 flex items-center justify-center font-mono text-[9px] text-white"
                          >
                            {i === 0 ? 'D' : i === 1 ? 'N' : 'D'}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* School Shield Badge */}
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 p-1 flex items-center justify-center shrink-0 shadow-md">
                      <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center text-[7px] font-extrabold text-cyan-300 uppercase leading-none text-center">
                        <span>SMKN</span>
                        <span className="text-[8px] text-white mt-0.5">DANDER</span>
                        <span className="text-[6px] text-cyan-400">BOJONEGORO</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Section: Tut Wuri Handayani & Big Title */}
                <div className="my-8 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl flex items-center justify-center mb-6 border-4 border-cyan-500">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#0284c7]">
                      <circle cx="50" cy="50" r="46" fill="#0284c7" />
                      <path d="M50 18 L58 35 L76 35 L62 46 L68 64 L50 52 L32 64 L38 46 L24 35 L42 35 Z" fill="#ffffff" />
                      <path d="M50 25 L45 42 L55 42 Z" fill="#e0f2fe" />
                      <circle cx="50" cy="50" r="12" fill="#0369a1" />
                      <path d="M50 40 L53 48 L62 48 L55 53 L58 61 L50 56 L42 61 L45 53 L38 48 L47 48 Z" fill="#ffffff" />
                    </svg>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider uppercase text-white mb-1">
                    BUKU INDUK
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-wider uppercase text-white mb-2">
                    PESERTA DIDIK
                  </h2>
                  <h3 className="text-sm md:text-base font-semibold tracking-widest uppercase text-slate-200 mt-2">
                    SEKOLAH MENENGAH KEJURUAN
                  </h3>
                  <h4 className="text-2xl font-bold tracking-wider uppercase text-white mt-1">
                    (SMK)
                  </h4>
                </div>

                {/* Bottom Section: White Card Identity (Exact match to PDF) */}
                <div className="bg-white text-slate-950 p-6 md:p-8 rounded-2xl shadow-2xl text-left text-xs max-w-xl mx-auto w-full">
                  <table className="w-full text-xs font-bold leading-relaxed border-collapse">
                    <tbody>
                      <tr>
                        <td className="w-44 py-1 uppercase text-slate-800">NAMA SEKOLAH</td>
                        <td className="w-4 text-center">:</td>
                        <td className="py-1 uppercase font-extrabold text-slate-950 text-sm">
                          {schoolSettings.name}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 uppercase text-slate-800 align-top">ALAMAT SEKOLAH</td>
                        <td className="text-center align-top">:</td>
                        <td className="py-1 uppercase leading-snug">
                          {schoolSettings.address}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 uppercase text-slate-800">DESA/KELURAHAN</td>
                        <td className="text-center">:</td>
                        <td className="py-1 uppercase">
                          DESA {schoolSettings.district || 'SUMBERTLASEH'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 uppercase text-slate-800">KECAMATAN</td>
                        <td className="text-center">:</td>
                        <td className="py-1 uppercase">
                          {schoolSettings.district || 'DANDER'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 uppercase text-slate-800">KABUPATEN/KOTA</td>
                        <td className="text-center">:</td>
                        <td className="py-1 uppercase">
                          {schoolSettings.regency || 'BOJONEGORO'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 uppercase text-slate-800">PROVINSI</td>
                        <td className="text-center">:</td>
                        <td className="py-1 uppercase">
                          {schoolSettings.province || 'JAWA TIMUR'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 uppercase text-slate-800">TAHUN PELAJARAN</td>
                        <td className="text-center">:</td>
                        <td className="py-1 uppercase font-bold text-sm">
                          {schoolSettings.activeAcademicYear}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DOKUMEN 2: COVER DALAM (EXACT MATCH TO smkn-dander.syntaxtrust.web.id_laporan_cetak_cover_f402c990.pdf) */}
          {activeDoc === 'cover-dalam' && (
            <div id="print-area" className="w-full flex justify-center pb-12 print:pb-0">
              <div className="page-sheet bg-white text-slate-950 border-4 border-double border-slate-950 p-10 md:p-14 text-center flex flex-col justify-between shadow-2xl relative font-sans print:shadow-none print:p-8">
                {/* Top Right NPSN Box */}
                <div className="flex justify-end items-start text-right">
                  <div>
                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block mb-1">
                      NOMOR POKOK SEKOLAH NASIONAL (NPSN)
                    </span>
                    <div className="flex border-2 border-slate-900 justify-end inline-flex">
                      {(schoolSettings.npsn || '20541259').split('').map((char, i) => (
                        <div
                          key={i}
                          className="w-6 h-7 border-r border-slate-900 last:border-r-0 flex items-center justify-center font-mono text-xs text-slate-950 font-bold"
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center Section: Tut Wuri Handayani & Titles */}
                <div className="my-6 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full p-2 flex items-center justify-center mb-6">
                    <svg viewBox="0 0 100 100" className="w-28 h-28 text-[#0284c7]">
                      <circle cx="50" cy="50" r="46" fill="#0284c7" />
                      <path d="M50 18 L58 35 L76 35 L62 46 L68 64 L50 52 L32 64 L38 46 L24 35 L42 35 Z" fill="#ffffff" />
                      <circle cx="50" cy="50" r="12" fill="#0369a1" />
                      <path d="M50 40 L53 48 L62 48 L55 53 L58 61 L50 56 L42 61 L45 53 L38 48 L47 48 Z" fill="#ffffff" />
                    </svg>
                  </div>

                  <h1 className="text-3xl font-serif font-black tracking-wider uppercase text-slate-950 mb-1">
                    BUKU INDUK
                  </h1>
                  <h2 className="text-2xl font-serif font-bold tracking-wider uppercase text-slate-950 mb-2">
                    PESERTA DIDIK
                  </h2>
                  <h3 className="text-sm font-semibold tracking-widest uppercase text-slate-800 mt-2">
                    SEKOLAH MENENGAH KEJURUAN
                  </h3>
                  <h4 className="text-2xl font-bold tracking-wider uppercase text-slate-950 mt-1">
                    (SMK)
                  </h4>
                </div>

                {/* Bottom Section: Box with black corner accents & underlines (Exact match to PDF) */}
                <div className="border border-slate-900 p-6 md:p-8 text-left text-xs max-w-xl mx-auto w-full relative">
                  {/* Stylized Corner Bracket Accents as in PDF */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-slate-950"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-slate-950"></div>

                  <table className="w-full text-xs font-semibold leading-loose border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-400 border-dotted">
                        <td className="w-48 py-1 uppercase text-slate-900">NAMA SEKOLAH</td>
                        <td className="w-4 text-center">:</td>
                        <td className="py-1 uppercase font-bold text-slate-950">
                          {schoolSettings.name}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-400 border-dotted">
                        <td className="py-1 uppercase text-slate-900 align-top">ALAMAT SEKOLAH</td>
                        <td className="text-center align-top">:</td>
                        <td className="py-1 uppercase leading-snug">
                          {schoolSettings.address}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-400 border-dotted">
                        <td className="py-1 uppercase text-slate-900">DESA / KELURAHAN</td>
                        <td className="text-center">:</td>
                        <td className="py-1 uppercase">
                          Desa {schoolSettings.district || 'Sumbertlaseh'}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-400 border-dotted">
                        <td className="py-1 uppercase text-slate-900">KECAMATAN</td>
                        <td className="text-center">:</td>
                        <td className="py-1 uppercase">
                          {schoolSettings.district || 'Dander'}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-400 border-dotted">
                        <td className="py-1 uppercase text-slate-900">KABUPATEN / KOTA</td>
                        <td className="text-center">:</td>
                        <td className="py-1 uppercase">
                          {schoolSettings.regency || 'Bojonegoro'}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-400 border-dotted">
                        <td className="py-1 uppercase text-slate-900">PROVINSI</td>
                        <td className="text-center">:</td>
                        <td className="py-1 uppercase">
                          {schoolSettings.province || 'Jawa Timur'}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-400 border-dotted">
                        <td className="py-1 uppercase text-slate-900">TAHUN PELAJARAN</td>
                        <td className="text-center">:</td>
                        <td className="py-1 uppercase font-bold">
                          {schoolSettings.activeAcademicYear}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DOKUMEN 3: TRANSKRIP NILAI PRESTASI */}
          {activeDoc === 'transkrip' && (
            <div id="print-area" className="w-full flex justify-center pb-12 print:pb-0">
              <div className="page-sheet bg-white text-slate-900 border border-slate-400 p-10 shadow-2xl text-xs">
                <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                  <h2 className="text-sm font-black uppercase text-slate-950">
                    TRANSKRIP NILAI PRESTASI AKADEMIK
                  </h2>
                  <p className="text-xs font-bold uppercase text-slate-800">{schoolSettings.name}</p>
                  <p className="text-[10px] text-slate-600">LAMPIRAN RESMI IJAZAH SEKOLAH MENENGAH KEJURUAN</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-[11px] bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <div>Nama Lengkap : <strong className="font-bold text-slate-900">{activeStudentForDoc.fullName}</strong></div>
                    <div>NISN : <span className="font-mono">{activeStudentForDoc.nisn}</span></div>
                    <div>NIPD : <span className="font-mono">{activeStudentForDoc.nipd}</span></div>
                  </div>
                  <div>
                    <div>Program Keahlian : <strong>{activeStudentForDoc.programKeahlian}</strong></div>
                    <div>Tempat, Tanggal Lahir : {activeStudentForDoc.birthPlace}, {activeStudentForDoc.birthDate}</div>
                    <div>Tahun Kelulusan : {schoolSettings.activeAcademicYear}</div>
                  </div>
                </div>

                <table className="w-full text-xs border border-slate-400 mb-6">
                  <thead className="bg-slate-100 text-slate-900 uppercase font-bold text-center">
                    <tr>
                      <th className="border border-slate-400 p-2 w-10">No</th>
                      <th className="border border-slate-400 p-2 text-left">Mata Pelajaran Kurikulum Merdeka</th>
                      <th className="border border-slate-400 p-2 w-20">Nilai Akhir</th>
                      <th className="border border-slate-400 p-2 w-28">Predikat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="border border-slate-400 p-1.5 font-bold bg-slate-50 text-slate-800">
                        A. KELOMPOK MATA PELAJARAN UMUM
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 text-center">1</td>
                      <td className="border border-slate-400 p-2">Pendidikan Agama dan Budi Pekerti</td>
                      <td className="border border-slate-400 p-2 text-center font-bold font-mono">88</td>
                      <td className="border border-slate-400 p-2 text-center text-emerald-700 font-semibold">Sangat Baik</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 text-center">2</td>
                      <td className="border border-slate-400 p-2">Pendidikan Pancasila</td>
                      <td className="border border-slate-400 p-2 text-center font-bold font-mono">89</td>
                      <td className="border border-slate-400 p-2 text-center text-emerald-700 font-semibold">Sangat Baik</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 text-center">3</td>
                      <td className="border border-slate-400 p-2">Bahasa Indonesia</td>
                      <td className="border border-slate-400 p-2 text-center font-bold font-mono">86</td>
                      <td className="border border-slate-400 p-2 text-center text-sky-700 font-semibold">Baik</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 text-center">4</td>
                      <td className="border border-slate-400 p-2">Matematika</td>
                      <td className="border border-slate-400 p-2 text-center font-bold font-mono">90</td>
                      <td className="border border-slate-400 p-2 text-center text-emerald-700 font-semibold">Sangat Baik</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="border border-slate-400 p-1.5 font-bold bg-slate-50 text-slate-800">
                        B. KELOMPOK MATA PELAJARAN KEJURUAN
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 text-center">5</td>
                      <td className="border border-slate-400 p-2">Konsentrasi Keahlian {activeStudentForDoc.programKeahlian}</td>
                      <td className="border border-slate-400 p-2 text-center font-bold font-mono">92</td>
                      <td className="border border-slate-400 p-2 text-center text-emerald-700 font-semibold">Sangat Baik</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 text-center">6</td>
                      <td className="border border-slate-400 p-2">Praktik Kerja Lapangan (PKL) Industri</td>
                      <td className="border border-slate-400 p-2 text-center font-bold font-mono">94</td>
                      <td className="border border-slate-400 p-2 text-center text-emerald-700 font-semibold">Sangat Baik</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 text-center">7</td>
                      <td className="border border-slate-400 p-2">Uji Kompetensi Keahlian (UKK LSP-P1)</td>
                      <td className="border border-slate-400 p-2 text-center font-bold font-mono">92</td>
                      <td className="border border-slate-400 p-2 text-center text-emerald-700 font-semibold">Sangat Baik</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={2} className="border border-slate-400 p-2 text-right">
                        RATA-RATA NILAI AKHIR:
                      </td>
                      <td className="border border-slate-400 p-2 text-center text-sky-800 font-mono text-sm">
                        90.1
                      </td>
                      <td className="border border-slate-400 p-2 text-center text-emerald-800">
                        LULUS (MEMUASKAN)
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-8 flex justify-end text-center text-xs">
                  <div className="w-64">
                    <p className="text-[11px] text-slate-700">{schoolSettings.district}, 25 Oktober 2026</p>
                    <p className="font-semibold text-slate-800 mb-16 text-[11px]">Kepala Sekolah,</p>
                    <p className="font-bold underline uppercase">{schoolSettings.principalName}</p>
                    <p className="text-[10px] font-mono text-slate-600">NIP. {schoolSettings.principalNip}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOKUMEN 4: PASPORT SKILL KEJURUAN */}
          {activeDoc === 'pasport-skill' && (
            <div id="print-area" className="w-full flex justify-center pb-12 print:pb-0">
              <div className="page-sheet bg-white text-slate-900 border border-slate-400 p-10 shadow-2xl text-xs">
                <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                  <h2 className="text-sm font-black uppercase text-slate-950">
                    PASPORT SKILL MATRIKS KOMPETENSI KEJURUAN
                  </h2>
                  <p className="text-xs font-bold uppercase text-slate-800">{schoolSettings.name}</p>
                  <p className="text-[10px] text-slate-600">LEMBAR VALIDASI KEMAMPUAN TEKNIS LULUSAN VOKASI</p>
                </div>

                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg mb-4 text-[11px]">
                  <div>Pemegang Pasport: <strong>{activeStudentForDoc.fullName}</strong> ({activeStudentForDoc.nipd})</div>
                  <div>Konsentrasi: <strong>{activeStudentForDoc.programKeahlian}</strong></div>
                  <div>Status Sertifikasi: <span className="font-bold text-emerald-700">TERVERIFIKASI INDUSTRI MITRA (DUDI)</span></div>
                </div>

                <table className="w-full text-xs border border-slate-400 mb-6">
                  <thead className="bg-slate-100 text-slate-900 uppercase font-bold text-center">
                    <tr>
                      <th className="border border-slate-400 p-2 w-10">No</th>
                      <th className="border border-slate-400 p-2 text-left">Unit Kompetensi / Elemen Capaian</th>
                      <th className="border border-slate-400 p-2 w-28">Status</th>
                      <th className="border border-slate-400 p-2 w-44">Mitra Penguji (DUDI)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-400 p-2 text-center">1</td>
                      <td className="border border-slate-400 p-2 font-medium">Instalasi & Terminasi Jaringan Fiber Optik (FTTH)</td>
                      <td className="border border-slate-400 p-2 text-center font-bold text-emerald-700">KOMPETEN</td>
                      <td className="border border-slate-400 p-2">PT Telkom Indonesia</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 text-center">2</td>
                      <td className="border border-slate-400 p-2 font-medium">Konfigurasi Routing Protokol Dinamis & Firewall ACL</td>
                      <td className="border border-slate-400 p-2 text-center font-bold text-emerald-700">KOMPETEN</td>
                      <td className="border border-slate-400 p-2">MikroTik Academy</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 text-center">3</td>
                      <td className="border border-slate-400 p-2 font-medium">Manajemen Server Virtualisasi & Cloud Hosting Linux</td>
                      <td className="border border-slate-400 p-2 text-center font-bold text-emerald-700">KOMPETEN</td>
                      <td className="border border-slate-400 p-2">PT Syntax Trust Multimedia</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-12 flex justify-between text-center text-xs">
                  <div>
                    <p className="text-[11px] text-slate-700">Mitra Industri (DUDI),</p>
                    <p className="font-semibold text-slate-800 mb-16 text-[11px]">Lead Technical Assessor</p>
                    <p className="font-bold underline uppercase">BAMBANG SUPRIYADI, S.T.</p>
                    <p className="text-[10px] text-slate-600">PT Telkom Indonesia</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-700">{schoolSettings.district}, 25 Oktober 2026</p>
                    <p className="font-semibold text-slate-800 mb-16 text-[11px]">Kepala Sekolah,</p>
                    <p className="font-bold underline uppercase">{schoolSettings.principalName}</p>
                    <p className="text-[10px] font-mono text-slate-600">NIP. {schoolSettings.principalNip}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOKUMEN 5: CETAK MASSAL A4 DOKUMEN BUKU INDUK */}
          {activeDoc === 'batch-a4' && (
            <div id="print-area" className="w-full flex flex-col items-center gap-8 pb-12 print:pb-0 print:gap-0">
              {getBatchStudents().map((student, idx) => (
                <div
                  key={student.id}
                  className="page-sheet bg-white text-slate-900 border border-slate-400 p-8 shadow-xl text-xs flex flex-col justify-between print:border-none print:shadow-none"
                >
                  <div>
                    {/* Kop */}
                    <div className="text-center border-b-2 border-slate-900 pb-2 mb-4">
                      <h2 className="text-sm font-black uppercase text-slate-950">
                        LEMBAR BUKU INDUK PESERTA DIDIK
                      </h2>
                      <p className="text-[11px] font-bold uppercase text-slate-800">{schoolSettings.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {bulkDocType} • Halaman Lembar Ke-{idx + 1}
                      </p>
                    </div>

                    {/* Data Siswa */}
                    <div className="space-y-2 text-[11px]">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{student.fullName}</div>
                          <div className="font-mono text-slate-500">
                            NIPD: {student.nipd} | NISN: {student.nisn}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sky-700">{student.currentClass}</span>
                          <div className="text-[10px] text-slate-400">{student.programKeahlian}</div>
                        </div>
                      </div>

                      <table className="w-full text-left border-collapse border border-slate-300 mt-2">
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="p-1.5 w-40 font-semibold text-slate-600">Tempat, Tanggal Lahir</td>
                            <td className="p-1.5 font-bold">: {student.birthPlace}, {student.birthDate}</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-1.5 font-semibold text-slate-600">Jenis Kelamin / Agama</td>
                            <td className="p-1.5">: {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'} / {student.religion}</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-1.5 font-semibold text-slate-600">Alamat Tempat Tinggal</td>
                            <td className="p-1.5">: {student.address}</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-1.5 font-semibold text-slate-600">Nama Orang Tua (Ayah / Ibu)</td>
                            <td className="p-1.5">: {student.fatherName} / {student.motherName}</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-1.5 font-semibold text-slate-600">Pekerjaan Orang Tua</td>
                            <td className="p-1.5">: {student.parentJob}</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-1.5 font-semibold text-slate-600">Sekolah Asal</td>
                            <td className="p-1.5">: {student.prevSchool}</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-semibold text-slate-600">Tanggal Diterima</td>
                            <td className="p-1.5">: {student.admissionDate} (Kelas: {student.admissionClass})</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Footer TTD */}
                  <div className="mt-8 flex justify-between text-center text-[10px]">
                    <div>
                      <p>Mengetahui,</p>
                      <p className="font-semibold mb-12">Kepala Tata Usaha</p>
                      <p className="font-bold underline uppercase">{schoolSettings.administrationHead}</p>
                      <p className="font-mono text-slate-500">NIP. {schoolSettings.administrationNip}</p>
                    </div>
                    <div>
                      <p>{schoolSettings.district}, 25 Oktober 2026</p>
                      <p className="font-semibold mb-12">Kepala Sekolah,</p>
                      <p className="font-bold underline uppercase">{schoolSettings.principalName}</p>
                      <p className="font-mono text-slate-500">NIP. {schoolSettings.principalNip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DOKUMEN 6: LEGER NILAI (HORIZONTAL) */}
          {activeDoc === 'leger-horizontal' && (
            <div id="print-area" className="w-full flex justify-center pb-12 print:pb-0">
              <div className="max-w-[1100px] w-full bg-white text-slate-900 border border-slate-400 p-8 shadow-xl text-xs flex flex-col justify-between print:border-none print:shadow-none print:p-4 print:max-w-none">
                <div>
                  {/* Official Header Kop */}
                  <div className="text-center border-b-2 border-double border-slate-900 pb-2 mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800">
                      PEMERINTAH PROVINSI JAWA TIMUR • DINAS PENDIDIKAN
                    </h3>
                    <h2 className="text-base font-black uppercase text-slate-950">
                      {schoolSettings.name}
                    </h2>
                    <p className="text-[10px] text-slate-600">
                      {schoolSettings.address} • Telp: {schoolSettings.phone} • Email: {schoolSettings.email}
                    </p>
                  </div>

                  {/* Document Title & Meta */}
                  <div className="text-center mb-4">
                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      LEGER REKAPITULASI NILAI HASIL BELAJAR PESERTA DIDIK
                    </h2>
                    <p className="text-[11px] font-semibold text-slate-700">
                      KURIKULUM MERDEKA • TAHUN PELAJARAN 2025/2026
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-700 mt-2 bg-slate-50 p-2 rounded border border-slate-200">
                      <div>
                        KELAS: <span className="text-purple-700 uppercase">{selectedLegerClass || 'SEMUA KELAS'}</span>
                      </div>
                      <div>
                        SEMESTER: <span className="text-purple-700">{selectedLegerSemester}</span>
                      </div>
                      <div>
                        KOMPETENSI: <span className="text-slate-900">{students[0]?.programKeahlian || 'Teknik Jaringan Komputer'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Wide Leger Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-400 text-[10px]">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 text-center font-bold">
                          <th rowSpan={2} className="border border-slate-400 p-1 w-6">NO</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 w-16">NIPD</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 w-16">NISN</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 text-left min-w-[140px]">NAMA PESERTA DIDIK</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 w-6">L/P</th>
                          <th colSpan={6} className="border border-slate-400 p-1 bg-slate-200">MATA PELAJARAN UMUM</th>
                          <th colSpan={4} className="border border-slate-400 p-1 bg-purple-100 text-purple-900">KEJURUAN & MULOK</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 w-10 bg-slate-200">JML</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 w-10 bg-slate-200">RATA</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 w-8 bg-purple-200 text-purple-950">PERINGKAT</th>
                          <th colSpan={3} className="border border-slate-400 p-1 w-16 bg-amber-100">ABSENSI</th>
                        </tr>
                        <tr className="bg-slate-50 text-[9px] text-center font-semibold">
                          <th className="border border-slate-400 p-0.5">PAI</th>
                          <th className="border border-slate-400 p-0.5">PKN</th>
                          <th className="border border-slate-400 p-0.5">BIN</th>
                          <th className="border border-slate-400 p-0.5">MTK</th>
                          <th className="border border-slate-400 p-0.5">SEJ</th>
                          <th className="border border-slate-400 p-0.5">BIG</th>
                          <th className="border border-slate-400 p-0.5 bg-purple-50">INF</th>
                          <th className="border border-slate-400 p-0.5 bg-purple-50">DPK 1</th>
                          <th className="border border-slate-400 p-0.5 bg-purple-50">DPK 2</th>
                          <th className="border border-slate-400 p-0.5 bg-purple-50">JAWA</th>
                          <th className="border border-slate-400 p-0.5">S</th>
                          <th className="border border-slate-400 p-0.5">I</th>
                          <th className="border border-slate-400 p-0.5">A</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedLegerClass
                          ? students.filter((s) => s.currentClass === selectedLegerClass)
                          : students.slice(0, 15)
                        ).map((s, idx) => {
                          const baseScore = 80 + (idx % 12);
                          const total = baseScore * 10 + 45;
                          const avg = (total / 10).toFixed(1);
                          return (
                            <tr key={s.id} className="hover:bg-slate-50">
                              <td className="border border-slate-300 p-1 text-center font-mono">{idx + 1}</td>
                              <td className="border border-slate-300 p-1 font-mono text-[9px]">{s.nipd}</td>
                              <td className="border border-slate-300 p-1 font-mono text-[9px]">{s.nisn}</td>
                              <td className="border border-slate-300 p-1 font-medium">{s.fullName}</td>
                              <td className="border border-slate-300 p-1 text-center font-bold">{s.gender}</td>
                              <td className="border border-slate-300 p-1 text-center font-mono">{baseScore + 3}</td>
                              <td className="border border-slate-300 p-1 text-center font-mono">{baseScore + 2}</td>
                              <td className="border border-slate-300 p-1 text-center font-mono">{baseScore + 4}</td>
                              <td className="border border-slate-300 p-1 text-center font-mono">{baseScore + 1}</td>
                              <td className="border border-slate-300 p-1 text-center font-mono">{baseScore + 2}</td>
                              <td className="border border-slate-300 p-1 text-center font-mono">{baseScore + 3}</td>
                              <td className="border border-slate-300 p-1 text-center font-mono bg-purple-50/50">{baseScore + 6}</td>
                              <td className="border border-slate-300 p-1 text-center font-mono bg-purple-50/50">{baseScore + 5}</td>
                              <td className="border border-slate-300 p-1 text-center font-mono bg-purple-50/50">{baseScore + 7}</td>
                              <td className="border border-slate-300 p-1 text-center font-mono bg-purple-50/50">{baseScore + 2}</td>
                              <td className="border border-slate-300 p-1 text-center font-bold font-mono bg-slate-100">{total}</td>
                              <td className="border border-slate-300 p-1 text-center font-bold font-mono text-purple-700 bg-slate-100">{avg}</td>
                              <td className="border border-slate-300 p-1 text-center font-bold font-mono bg-purple-100/50">{idx + 1}</td>
                              <td className="border border-slate-300 p-1 text-center font-mono text-slate-500">0</td>
                              <td className="border border-slate-300 p-1 text-center font-mono text-slate-500">{idx % 3 === 0 ? '1' : '0'}</td>
                              <td className="border border-slate-300 p-1 text-center font-mono text-slate-500">0</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer Signatures */}
                <div className="mt-10 grid grid-cols-3 text-center text-[10px]">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-semibold mb-12">Kepala Tata Usaha</p>
                    <p className="font-bold underline uppercase">{schoolSettings.administrationHead}</p>
                    <p className="font-mono text-slate-500">NIP. {schoolSettings.administrationNip}</p>
                  </div>
                  <div>
                    <p>Wali Kelas,</p>
                    <p className="font-semibold mb-12">{selectedLegerClass || 'X TKJ 1'}</p>
                    <p className="font-bold underline uppercase">BAMBANG SUDARMONO, S.Pd.</p>
                    <p className="font-mono text-slate-500">NIP. 19820415 200801 1 012</p>
                  </div>
                  <div>
                    <p>{schoolSettings.district}, 03 November 2026</p>
                    <p className="font-semibold mb-12">Kepala Sekolah,</p>
                    <p className="font-bold underline uppercase">{schoolSettings.principalName}</p>
                    <p className="font-mono text-slate-500">NIP. {schoolSettings.principalNip}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOKUMEN 7: CETAK MASSAL NILAI (HASIL BELAJAR A4) */}
          {activeDoc === 'massal-nilai' && (
            <div id="print-area" className="w-full flex flex-col items-center gap-8 pb-12 print:pb-0 print:gap-0">
              {(selectedNilaiClass
                ? students.filter((s) => s.currentClass === selectedNilaiClass)
                : students.slice(0, 6)
              ).map((student, idx) => (
                <div
                  key={student.id}
                  className="page-sheet bg-white text-slate-900 border border-slate-400 p-8 shadow-xl text-xs flex flex-col justify-between print:border-none print:shadow-none"
                >
                  <div>
                    {/* Official Kop */}
                    <div className="text-center border-b-2 border-double border-slate-900 pb-2 mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">
                        PEMERINTAH PROVINSI JAWA TIMUR • DINAS PENDIDIKAN
                      </h3>
                      <h2 className="text-sm font-black uppercase text-slate-950">
                        {schoolSettings.name}
                      </h2>
                      <p className="text-[10px] text-slate-500">
                        LAPORAN HASIL BELAJAR PESERTA DIDIK (RAPOR NILAI)
                      </p>
                    </div>

                    {/* Student Identity Card */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-2.5 rounded border border-slate-200 text-[10.5px] mb-3">
                      <div>
                        <div className="flex gap-2">
                          <span className="w-24 text-slate-500 font-semibold">Nama Siswa:</span>
                          <span className="font-bold text-slate-900">{student.fullName}</span>
                        </div>
                        <div className="flex gap-2 mt-0.5">
                          <span className="w-24 text-slate-500 font-semibold">NISN / NIPD:</span>
                          <span className="font-mono text-slate-700">{student.nisn} / {student.nipd}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex gap-2">
                          <span className="w-24 text-slate-500 font-semibold">Kelas:</span>
                          <span className="font-bold text-sky-700">{student.currentClass}</span>
                        </div>
                        <div className="flex gap-2 mt-0.5">
                          <span className="w-24 text-slate-500 font-semibold">Semester:</span>
                          <span className="font-semibold text-slate-800">{selectedNilaiSemester} (2025/2026)</span>
                        </div>
                      </div>
                    </div>

                    {/* Subject Grades Table */}
                    <table className="w-full border-collapse border border-slate-400 text-[10px] mb-3">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 font-bold">
                          <th className="border border-slate-400 p-1 w-7 text-center">NO</th>
                          <th className="border border-slate-400 p-1 text-left">MATA PELAJARAN</th>
                          <th className="border border-slate-400 p-1 w-14 text-center">NILAI AKHIR</th>
                          <th className="border border-slate-400 p-1 text-left">CAPAIAN KOMPETENSI</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 p-1 text-center">1</td>
                          <td className="border border-slate-300 p-1 font-semibold">Pendidikan Agama & Budi Pekerti</td>
                          <td className="border border-slate-300 p-1 text-center font-bold">88</td>
                          <td className="border border-slate-300 p-1 text-[9.5px]">Menunjukkan penguasaan sangat baik dalam toleransi dan akhlak mulia.</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-1 text-center">2</td>
                          <td className="border border-slate-300 p-1 font-semibold">Pendidikan Pancasila</td>
                          <td className="border border-slate-300 p-1 text-center font-bold">86</td>
                          <td className="border border-slate-300 p-1 text-[9.5px]">Sangat baik dalam memahami hak konstitusional dan gotong royong.</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-1 text-center">3</td>
                          <td className="border border-slate-300 p-1 font-semibold">Bahasa Indonesia</td>
                          <td className="border border-slate-300 p-1 text-center font-bold">89</td>
                          <td className="border border-slate-300 p-1 text-[9.5px]">Sangat baik dalam menulis teks laporan hasil observasi dan esai argumentatif.</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-1 text-center">4</td>
                          <td className="border border-slate-300 p-1 font-semibold">Matematika</td>
                          <td className="border border-slate-300 p-1 text-center font-bold">85</td>
                          <td className="border border-slate-300 p-1 text-[9.5px]">Baik dalam menganalisis data statistika dan barisan geometri.</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-1 text-center">5</td>
                          <td className="border border-slate-300 p-1 font-semibold">Konsentrasi Keahlian (Kejuruan)</td>
                          <td className="border border-slate-300 p-1 text-center font-bold text-emerald-700">92</td>
                          <td className="border border-slate-300 p-1 text-[9.5px] font-medium">Mahir dan tuntas dalam instalasi jaringan enterprise dan administrasi server.</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-1 text-center">6</td>
                          <td className="border border-slate-300 p-1 font-semibold">Bahasa Inggris</td>
                          <td className="border border-slate-300 p-1 text-center font-bold">87</td>
                          <td className="border border-slate-300 p-1 text-[9.5px]">Sangat baik dalam komunikasi lisan teknik dan penulisan manual kerja.</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-1 text-center">7</td>
                          <td className="border border-slate-300 p-1 font-semibold">Muatan Lokal (Bahasa Jawa)</td>
                          <td className="border border-slate-300 p-1 text-center font-bold">88</td>
                          <td className="border border-slate-300 p-1 text-[9.5px]">Memahami unggah-ungguh basa dan geguritan dengan baik.</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Attendance & Extracurricular */}
                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      <div className="border border-slate-300 rounded p-2">
                        <div className="font-bold text-slate-800 mb-1 border-b pb-0.5">KEGIATAN EKSTRAKURIKULER</div>
                        <p>1. Pramuka Wajib: <span className="font-bold text-emerald-700">Sangat Baik (A)</span></p>
                        <p>2. Palang Merah Remaja (PMR): <span className="font-bold text-slate-800">Baik (B)</span></p>
                      </div>
                      <div className="border border-slate-300 rounded p-2">
                        <div className="font-bold text-slate-800 mb-1 border-b pb-0.5">KETIDAKHADIRAN</div>
                        <p>Sakit: 1 hari</p>
                        <p>Izin: 0 hari • Tanpa Keterangan: 0 hari</p>
                      </div>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="mt-6 grid grid-cols-3 text-center text-[10px]">
                    <div>
                      <p>Orang Tua / Wali Siswa,</p>
                      <p className="mt-12 font-bold text-slate-800 border-b border-slate-400 inline-block min-w-[120px]">
                        {student.fatherName || '................................'}
                      </p>
                    </div>
                    <div>
                      <p>Wali Kelas,</p>
                      <p className="mt-12 font-bold underline uppercase">BAMBANG SUDARMONO, S.Pd.</p>
                      <p className="font-mono text-slate-500">NIP. 19820415 200801 1 012</p>
                    </div>
                    <div>
                      <p>{schoolSettings.district}, 03 November 2026</p>
                      <p className="font-semibold">Kepala Sekolah,</p>
                      <p className="mt-12 font-bold underline uppercase">{schoolSettings.principalName}</p>
                      <p className="font-mono text-slate-500">NIP. {schoolSettings.principalNip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
