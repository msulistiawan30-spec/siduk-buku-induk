import React, { useState, useEffect } from 'react';
import { Student, SchoolSettings, SchoolClass, ProgramKeahlian } from '../types';
import { officialRegister1144 } from '../data/seedLoader';
import { deriveRegister } from '../data/registerFromStudents';
import type { NomorUrutRecord } from '../data/nomorUrutTypes';
import {
  Printer,
  List,
  Clock,
  Calendar,
  MessageSquare,
  FileText,
  Download,
  ExternalLink,
  X,
  Maximize2,
  CheckCircle,
} from 'lucide-react';
import { asset } from '../utils/asset';

interface RegisterNomorUrutViewProps {
  students: Student[];
  schoolSettings: SchoolSettings;
  classes?: SchoolClass[];
  programs?: ProgramKeahlian[];
  onOpenStudent: (student: Student) => void;
  onNavigate?: (menu: string) => void;
}

export const RegisterNomorUrutView: React.FC<RegisterNomorUrutViewProps> = ({
  students,
  schoolSettings,
  onOpenStudent,
  onNavigate,
}) => {
  // Realtime clock matching screenshot image_d267a6d6.png
  const [currentTime, setCurrentTime] = useState<string>('07:47:37');
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

  // Combine official 1144 register records with any live student updates from state
  const studentMapByNipd = new Map<string, Student>();
  students.forEach((s) => {
    if (s.nipd) studentMapByNipd.set(s.nipd.trim(), s);
    if (s.nisn) studentMapByNipd.set(s.nisn.trim(), s);
  });

  const baseRegister = officialRegister1144.length > 0 ? officialRegister1144 : deriveRegister(students);
  const allDisplayRecords = baseRegister.map((record) => {
    const matched = studentMapByNipd.get(record.nipd) || studentMapByNipd.get(record.nisn);
    if (matched) {
      return {
        ...record,
        fullName: matched.fullName || record.fullName,
        currentClass: matched.currentClass ? `${matched.currentClass} / Fase ${matched.fase || (matched.currentClass.startsWith('X ') ? 'E' : 'F')}` : record.currentClass,
        gender: matched.gender || record.gender,
      };
    }
    return record;
  });

  /**
   * Action when clicking "Cetak Laporan":
   * Presents the exact official 31-page PDF document sent by the user
   */
  const handleOpenPdfPrint = () => {
    const pdfUrl = asset('/assets/aistudio/Nomor_Urut_Peserta_Didik___Buku_Induk_56d72874.pdf');

    // 1. Open in-app official PDF modal viewer
    setIsPdfModalOpen(true);
    setPrintNotice('Membuka dokumen resmi PDF (31 Halaman)...');
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
    const frame = document.getElementById('official-pdf-frame') as HTMLIFrameElement | null;
    if (frame && frame.contentWindow) {
      try {
        frame.contentWindow.focus();
        frame.contentWindow.print();
        return;
      } catch (err) {
        console.warn('Iframe print error, falling back:', err);
      }
    }
    // Fallback: open in new tab
    window.open(asset('/assets/aistudio/Nomor_Urut_Peserta_Didik___Buku_Induk_56d72874.pdf'), '_blank');
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. TOP HEADER BAR: Page Title & Realtime Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Nomor Urut Peserta Didik
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

      {/* 3. MAIN CARD: EXACT MATCH TO SCREENSHOTS image_d267a6d6.png & image_da0c7f13.png */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        {/* Card Header Bar */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white no-print">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-sky-600" />
            <h2 className="text-xs sm:text-sm font-bold text-sky-800">
              Nomor Urut Peserta Didik
            </h2>
          </div>

          <button
            type="button"
            onClick={handleOpenPdfPrint}
            className="px-3 py-1.5 bg-[#198754] hover:bg-[#157347] active:bg-[#146c43] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            title="Cetak Laporan format PDF resmi 31 halaman"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>
        </div>

        {/* Document Content View */}
        <div id="print-area" className="p-4 sm:p-8 bg-white overflow-x-auto text-black font-sans">
          {/* Centered Document Title */}
          <div className="text-center mb-6">
            <h2 className="font-bold text-xs sm:text-sm tracking-wider uppercase text-black font-sans">
              II. NOMOR URUT PESERTA DIDIK DALAM BUKU INDUK REGISTER
            </h2>
          </div>

          {/* Official 6-Column Table */}
          <table className="w-full text-[11px] border-collapse border border-black font-sans">
            <thead>
              <tr className="bg-white font-bold text-center text-black">
                <th className="border border-black px-2 py-1.5 w-14 text-center align-middle font-bold leading-tight">
                  Nomor<br />Urut
                </th>
                <th className="border border-black px-2 py-1.5 w-36 text-center align-middle font-bold">
                  NIPD
                </th>
                <th className="border border-black px-2 py-1.5 w-48 text-center align-middle font-bold leading-tight">
                  Nomor Induk Peserta Didik<br />Nasional (NISN)
                </th>
                <th className="border border-black px-3 py-1.5 text-center align-middle font-bold">
                  Nama Peserta Didik
                </th>
                <th className="border border-black px-2 py-1.5 w-12 text-center align-middle font-bold">
                  L / P
                </th>
                <th className="border border-black px-3 py-1.5 w-44 text-center align-middle font-bold">
                  Kelas / Fase
                </th>
              </tr>
            </thead>
            <tbody>
              {allDisplayRecords.map((record) => (
                <tr key={record.reg} className="hover:bg-slate-50 transition print:hover:bg-transparent">
                  {/* 1. Nomor Urut */}
                  <td className="border border-black px-2 py-1 text-center font-medium">
                    {record.reg}.
                  </td>

                  {/* 2. NIPD */}
                  <td className="border border-black px-2 py-1 text-center font-medium">
                    {record.nipd}
                  </td>

                  {/* 3. NISN */}
                  <td className="border border-black px-2 py-1 text-center font-medium">
                    {record.nisn}
                  </td>

                  {/* 4. Nama Peserta Didik */}
                  <td className="border border-black px-3 py-1 text-left font-bold uppercase">
                    {record.fullName}
                  </td>

                  {/* 5. L / P */}
                  <td className="border border-black px-2 py-1 text-center font-medium">
                    {record.gender || 'L'}
                  </td>

                  {/* 6. Kelas / Fase */}
                  <td className="border border-black px-3 py-1 text-left font-medium">
                    {record.currentClass}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bottom Official Signatures Section - EXACT MATCH TO SCREENSHOT image_da0c7f13.png */}
          <div className="mt-14 w-full text-xs font-sans text-black break-inside-avoid">
            <div className="flex justify-between items-start">
              {/* Left Signature Block: Kepala Sekolah */}
              <div className="w-64 text-center">
                <div className="h-4"></div>
                <p className="font-normal text-[11px] leading-tight">Mengetahui,</p>
                <p className="font-normal text-[11px] mb-20 leading-tight">Kepala Sekolah,</p>
                <p className="font-bold text-[11px] uppercase tracking-wide border-b border-black inline-block">
                  {schoolSettings.principalName || 'Dr. Molyono.,M.Pd'}
                </p>
                <p className="text-[10px] text-black mt-0.5">
                  NIP -
                </p>
              </div>

              {/* Right Signature Block: Kepala Urusan Tata Usaha */}
              <div className="w-80 text-center">
                <p className="font-normal text-[11px] mb-1 leading-tight">
                  {schoolSettings.regency || 'Bojonegoro'}, 05 November 2026
                </p>
                <p className="font-normal text-[11px] mb-20 leading-tight">
                  Kepala Urusan Tata Usaha,
                </p>
                <p className="font-bold text-[11px] uppercase tracking-wide border-b border-black inline-block">
                  {schoolSettings.administrationHead || 'M. EKO HARIS SULISTIAWAN.,S.SOS'}
                </p>
                <p className="text-[10px] text-black mt-0.5">
                  NIP -
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. OFFICIAL PDF DOCUMENT VIEWER MODAL ("ketika di klik tombol cetak munculnya seperti file pdf yang saya kirim") */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col border border-slate-300 overflow-hidden">
            {/* Modal Header Toolbar */}
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                    <span>Nomor_Urut_Peserta_Didik___Buku_Induk_56d72874.pdf</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-mono">
                      Dokumen Resmi PDF 31 Halaman
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400">
                    SMKN DANDER • II. NOMOR URUT PESERTA DIDIK DALAM BUKU INDUK REGISTER (1 - 1144 Siswa)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintPdfIframe}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  title="Cetak dokumen PDF resmi"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak PDF</span>
                </button>

                <a
                  href={asset('/assets/aistudio/Nomor_Urut_Peserta_Didik___Buku_Induk_56d72874.pdf')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Buka file PDF di tab browser baru"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Tab Baru</span>
                </a>

                <a
                  href={asset('/assets/aistudio/Nomor_Urut_Peserta_Didik___Buku_Induk_56d72874.pdf')}
                  download="Nomor_Urut_Peserta_Didik___Buku_Induk_SMKN_DANDER.pdf"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Unduh berkas PDF asli (2.5 MB)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF (2.5 MB)</span>
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
                id="official-pdf-frame"
                src={asset('/assets/aistudio/Nomor_Urut_Peserta_Didik___Buku_Induk_56d72874.pdf#toolbar=1')}
                className="w-full h-full border-0"
                title="Buku Induk Register PDF Resmi"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
