import React, { useState, useEffect } from 'react';
import { Student, SchoolSettings } from '../types';
import { officialRegister1144 } from '../data/seedLoader';
import { deriveRegister } from '../data/registerFromStudents';
import type { NomorUrutRecord } from '../data/nomorUrutTypes';
import {
  Printer,
  ArrowUpDown,
  Clock,
  Calendar,
  MessageSquare,
  FileText,
  Download,
  ExternalLink,
  X,
  Info,
  CheckCircle,
} from 'lucide-react';
import { asset } from '../utils/asset';

interface BukuKlapperViewProps {
  students: Student[];
  schoolSettings: SchoolSettings;
  onOpenStudent: (student: Student) => void;
}

export const BukuKlapperView: React.FC<BukuKlapperViewProps> = ({
  students,
  schoolSettings,
  onOpenStudent,
}) => {
  // Realtime clock matching screenshot image_8466dfa4.png
  const [currentTime, setCurrentTime] = useState<string>('07:59:07');
  const [currentDateStr, setCurrentDateStr] = useState<string>('05 Nov 2026');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeFmt = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setCurrentTime(timeFmt.format(now));
      setCurrentDateStr('05 Nov 2026');
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // PDF Modal Viewer State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [printNotice, setPrintNotice] = useState<string | null>(null);

  // Map students by NIPD and NISN to pick up any state updates
  const studentMapByNipd = new Map<string, Student>();
  students.forEach((s) => {
    if (s.nipd) studentMapByNipd.set(s.nipd.trim(), s);
    if (s.nisn) studentMapByNipd.set(s.nisn.trim(), s);
  });

  // Base list of all 1,144 students sorted alphabetically
  const baseRegister = officialRegister1144.length > 0 ? officialRegister1144 : deriveRegister(students);
  const allKlapperStudents = baseRegister
    .map((record) => {
      const matched = studentMapByNipd.get(record.nipd) || studentMapByNipd.get(record.nisn);
      const isMutasi = matched?.status === 'Mutasi Keluar';
      const statusText = isMutasi ? 'MUTASI KELUAR' : matched?.status || 'AKTIF';
      return {
        ...record,
        fullName: matched?.fullName || record.fullName,
        gender: matched?.gender || record.gender || 'L',
        status: statusText,
        admissionYear: '2026',
      };
    })
    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'id', { sensitivity: 'base' }));

  // Group by alphabetical first letter A to Z
  const groupedByLetter = allKlapperStudents.reduce<Record<string, typeof allKlapperStudents>>(
    (acc, student) => {
      const firstLetter = student.fullName.trim().charAt(0).toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(student);
      return acc;
    },
    {}
  );

  const alphabetList = Object.keys(groupedByLetter).sort();

  /**
   * Action when clicking "CETAK BUKU KLAPPER":
   * Presents the official 34-page PDF document sent by the user
   */
  const handleOpenPdfPrint = () => {
    const pdfUrl = asset('/assets/aistudio/Buku_Klapper_Peserta_Didik___Buku_Induk_7e814ad5.pdf');

    // 1. Open in-app official PDF modal viewer
    setIsPdfModalOpen(true);
    setPrintNotice('Membuka dokumen resmi Buku Klapper PDF (34 Halaman)...');
    setTimeout(() => setPrintNotice(null), 3500);

    // 2. Open PDF in a new tab for native printing
    try {
      window.open(pdfUrl, '_blank');
    } catch (e) {
      console.log('Popup handled by modal viewer');
    }
  };

  /**
   * Print directly from PDF iframe
   */
  const handlePrintPdfIframe = () => {
    const frame = document.getElementById('klapper-pdf-frame') as HTMLIFrameElement | null;
    if (frame && frame.contentWindow) {
      try {
        frame.contentWindow.focus();
        frame.contentWindow.print();
        return;
      } catch (err) {
        console.warn('Iframe print error, falling back:', err);
      }
    }
    window.open(asset('/assets/aistudio/Buku_Klapper_Peserta_Didik___Buku_Induk_7e814ad5.pdf'), '_blank');
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. TOP HEADER BAR: Page Title & Realtime Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Buku Klapper Peserta Didik
        </h1>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Calendar Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-slate-300" />
            <span>{currentDateStr}</span>
          </div>

          {/* Clock Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded text-xs font-mono font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Toast Notice */}
      {printNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in duration-150 no-print">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{printNotice}</span>
        </div>
      )}

      {/* 3. MAIN CARD: EXACT MATCH TO SCREENSHOTS image_8466dfa4.png & image_c1306eb9.png */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        {/* Card Header Bar */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white no-print">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-sky-600" />
            <h2 className="text-xs sm:text-sm font-bold text-sky-800">
              Buku Klapper Peserta Didik
            </h2>
          </div>

          <button
            type="button"
            onClick={handleOpenPdfPrint}
            className="px-3.5 py-1.5 bg-[#0c7c8c] hover:bg-[#09626f] active:bg-[#08535e] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition uppercase tracking-wide"
            title="Cetak Buku Klapper format PDF resmi 34 halaman"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>CETAK BUKU KLAPPER</span>
          </button>
        </div>

        {/* Document Content View */}
        <div id="print-area" className="p-4 sm:p-8 bg-white overflow-x-auto text-black font-sans">
          {/* Centered Document Title */}
          <div className="text-center mb-6">
            <h2 className="font-bold text-xs sm:text-sm tracking-wider uppercase text-black font-sans leading-tight">
              ALFABETIS (KLAPPER) PESERTA DIDIK
            </h2>
            <h3 className="font-bold text-xs sm:text-sm uppercase text-black font-sans mt-0.5">
              {schoolSettings.name || 'SMKN DANDER'}
            </h3>
          </div>

          {/* Official Klapper Table matching PDF & Screenshot */}
          <table className="w-full text-[11px] border-collapse border border-black font-sans">
            <thead>
              <tr className="bg-white font-bold text-center text-black">
                <th
                  rowSpan={2}
                  className="border border-black px-2 py-1.5 w-14 text-center align-middle font-bold"
                >
                  ABJAD
                </th>
                <th
                  rowSpan={2}
                  className="border border-black px-2 py-1.5 w-10 text-center align-middle font-bold"
                >
                  NO
                </th>
                <th
                  rowSpan={2}
                  className="border border-black px-3 py-1.5 text-center align-middle font-bold"
                >
                  NAMA PESERTA DIDIK (SESUAI IJAZAH)
                </th>
                <th
                  rowSpan={2}
                  className="border border-black px-2 py-1.5 w-10 text-center align-middle font-bold"
                >
                  L/P
                </th>
                <th
                  colSpan={2}
                  className="border border-black px-2 py-1 text-center align-middle font-bold"
                >
                  NOMOR INDUK
                </th>
                <th
                  rowSpan={2}
                  className="border border-black px-2 py-1.5 w-20 text-center align-middle font-bold leading-tight"
                >
                  TAHUN<br />MASUK
                </th>
                <th
                  rowSpan={2}
                  className="border border-black px-2 py-1.5 w-28 text-center align-middle font-bold leading-tight"
                >
                  STATUS<br />AKHIR
                </th>
              </tr>
              <tr className="bg-white font-bold text-center text-black">
                <th className="border border-black px-2 py-1 w-32 text-center align-middle font-bold">
                  NIPD / NIS
                </th>
                <th className="border border-black px-2 py-1 w-36 text-center align-middle font-bold">
                  NISN
                </th>
              </tr>
            </thead>
            <tbody>
              {alphabetList.map((letter) => {
                const group = groupedByLetter[letter];
                return group.map((student, idx) => (
                  <tr
                    key={`${letter}-${student.reg}-${idx}`}
                    className="hover:bg-slate-50 transition print:hover:bg-transparent"
                  >
                    {/* Column 1: ABJAD (spanning across all rows of this letter) */}
                    {idx === 0 && (
                      <td
                        rowSpan={group.length}
                        className="border border-black px-2 py-2 text-center font-bold text-lg text-black align-middle bg-white"
                      >
                        {letter}
                      </td>
                    )}

                    {/* Column 2: NO (restarts at 1 for each letter) */}
                    <td className="border border-black px-2 py-1 text-center font-normal">
                      {idx + 1}
                    </td>

                    {/* Column 3: NAMA PESERTA DIDIK (SESUAI IJAZAH) */}
                    <td className="border border-black px-3 py-1 text-left font-bold uppercase text-[11px]">
                      {student.fullName}
                    </td>

                    {/* Column 4: L/P */}
                    <td className="border border-black px-2 py-1 text-center font-normal">
                      {student.gender}
                    </td>

                    {/* Column 5: NIPD / NIS (Italic font-style matching screenshot) */}
                    <td className="border border-black px-2 py-1 text-center italic font-normal text-slate-800">
                      {student.nipd}
                    </td>

                    {/* Column 6: NISN */}
                    <td className="border border-black px-2 py-1 text-center font-normal text-slate-800">
                      {student.nisn}
                    </td>

                    {/* Column 7: TAHUN MASUK */}
                    <td className="border border-black px-2 py-1 text-center font-normal">
                      {student.admissionYear}
                    </td>

                    {/* Column 8: STATUS AKHIR (e.g. green dot + AKTIF or MUTASI KELUAR) */}
                    <td className="border border-black px-2 py-1 text-center">
                      {student.status === 'MUTASI KELUAR' ? (
                        <span className="text-rose-700 font-bold text-[9.5px]">
                          MUTASI KELUAR
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                          <span>AKTIF</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>

          {/* Bottom Footnote matching image_c1306eb9.png */}
          <div className="mt-4 flex items-center justify-end text-[10.5px] text-slate-500 italic gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Buku Klapper diurutkan otomatis berdasarkan abjad nama peserta didik.</span>
          </div>
        </div>
      </div>

      {/* 4. OFFICIAL PDF DOCUMENT VIEWER MODAL ("file PDF : Hasil cetak Buku Klapper Peserta Didik") */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col border border-slate-300 overflow-hidden">
            {/* Modal Header Toolbar */}
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-700 flex items-center justify-center text-white">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                    <span>Buku_Klapper_Peserta_Didik___Buku_Induk_7e814ad5.pdf</span>
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-[10px] font-mono">
                      Dokumen Resmi PDF 34 Halaman
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400">
                    SMKN DANDER • ALFABETIS (KLAPPER) PESERTA DIDIK (Indeks Abjad A s/d Z - 1.144 Siswa)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintPdfIframe}
                  className="px-3.5 py-1.5 bg-[#0c7c8c] hover:bg-[#09626f] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  title="Cetak dokumen PDF resmi"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak PDF</span>
                </button>

                <a
                  href={asset('/assets/aistudio/Buku_Klapper_Peserta_Didik___Buku_Induk_7e814ad5.pdf')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Buka file PDF di tab browser baru"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Tab Baru</span>
                </a>

                <a
                  href={asset('/assets/aistudio/Buku_Klapper_Peserta_Didik___Buku_Induk_7e814ad5.pdf')}
                  download="Buku_Klapper_Peserta_Didik___Buku_Induk_SMKN_DANDER.pdf"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Unduh berkas PDF asli (2.9 MB)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF (2.9 MB)</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer ml-1"
                  title="Tutup dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded Native PDF Document */}
            <div className="flex-1 bg-slate-800 p-0 relative">
              <iframe
                id="klapper-pdf-frame"
                src={asset('/assets/aistudio/Buku_Klapper_Peserta_Didik___Buku_Induk_7e814ad5.pdf#toolbar=1')}
                className="w-full h-full border-0"
                title="Buku Klapper Peserta Didik PDF Resmi"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
