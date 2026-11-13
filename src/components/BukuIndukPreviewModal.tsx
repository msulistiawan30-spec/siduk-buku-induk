import React, { useState } from 'react';
import { Student, SchoolSettings } from '../types';
import {
  Printer,
  X,
  Download,
  Camera,
  GraduationCap,
  Layers,
  ChevronDown,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

interface BukuIndukPreviewModalProps {
  student: Student | null;
  schoolSettings: SchoolSettings;
  onClose: () => void;
  onUpdateStudent?: (updated: Student) => void;
}

// Reusable Dotted Row matching Indonesian Buku Induk typography
const DottedRow: React.FC<{
  no?: string;
  label: string;
  value?: string | number | null;
  isBoldValue?: boolean;
  indent?: boolean;
  labelWidthClass?: string;
}> = ({
  no,
  label,
  value = '-',
  isBoldValue = false,
  indent = false,
  labelWidthClass = 'w-48',
}) => {
  const displayVal =
    value !== undefined && value !== null && String(value).trim() !== ''
      ? value
      : '-';

  return (
    <div
      className={`flex items-baseline text-[11px] leading-[19px] font-serif text-black ${
        indent ? 'pl-4' : ''
      }`}
    >
      <div className={`flex shrink-0 ${labelWidthClass}`}>
        {no && <span className="w-6 shrink-0">{no}</span>}
        <span className="truncate">{label}</span>
      </div>
      <span className="shrink-0 w-3 text-center">:</span>
      <span className={`shrink-0 mr-1.5 ${isBoldValue ? 'font-bold' : ''}`}>
        {displayVal}
      </span>
      <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[3px]" />
    </div>
  );
};

export const BukuIndukPreviewModal: React.FC<BukuIndukPreviewModalProps> = ({
  student,
  schoolSettings,
  onClose,
  onUpdateStudent,
}) => {
  if (!student) return null;

  // View Mode: 'all' | 'biodata' | 'rapor' | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6'
  const [viewMode, setViewMode] = useState<string>('all');
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);

  // Foto Masuk / Foto Tamat Modals
  const [isFotoMasukModalOpen, setIsFotoMasukModalOpen] = useState(false);
  const [isFotoTamatModalOpen, setIsFotoTamatModalOpen] = useState(false);
  const [fotoMasukUrl, setFotoMasukUrl] = useState(student.photoUrl);
  const [fotoTamatUrl, setFotoTamatUrl] = useState(
    student.photoUrlTamat || student.photoUrl
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setIsDownloadDropdownOpen(false);
    window.print();
  };

  const handleSaveFotoMasuk = () => {
    if (onUpdateStudent) {
      onUpdateStudent({ ...student, photoUrl: fotoMasukUrl });
    }
    setIsFotoMasukModalOpen(false);
  };

  const handleSaveFotoTamat = () => {
    if (onUpdateStudent) {
      onUpdateStudent({ ...student, photoUrlTamat: fotoTamatUrl });
    }
    setIsFotoTamatModalOpen(false);
  };

  const modeLabels: Record<string, string> = {
    all: 'MODE: SEMUA',
    biodata: 'BIODATA SAJA (HAL 1-3)',
    rapor: 'RAPOR SAJA (HAL 4-6)',
    p1: 'HALAMAN 1 (BIODATA AWAL)',
    p2: 'HALAMAN 2 (ORANG TUA)',
    p3: 'HALAMAN 3 (WALI & TTD)',
    p4: 'HALAMAN 4 (RAPOR SMT 1-2)',
    p5: 'HALAMAN 5 (RAPOR SMT 3-4)',
    p6: 'HALAMAN 6 (RAPOR SMT 5-6)',
  };

  const showPage = (pageNumber: number) => {
    if (viewMode === 'all') return true;
    if (viewMode === 'biodata') return pageNumber <= 3;
    if (viewMode === 'rapor') return pageNumber >= 4;
    if (viewMode === `p${pageNumber}`) return true;
    return false;
  };

  // Watermark SVG component
  const WatermarkEmblem = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.045] z-0 select-none">
      <svg viewBox="0 0 400 400" className="w-[340px] h-[340px]">
        <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="8" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="4" />
        <path
          d="M200 60 L240 150 L340 160 L260 220 L280 320 L200 270 L120 320 L140 220 L60 160 L160 150 Z"
          fill="currentColor"
        />
        <text
          x="200"
          y="370"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          letterSpacing="4"
          fill="currentColor"
        >
          SMKN DANDER
        </text>
      </svg>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#525659] flex flex-col items-center p-2 sm:p-6 print:p-0 print:bg-white print:static">
      {/* 6-PAGE A4 CONTAINER */}
      <div
        id="print-area"
        className="w-full flex flex-col items-center gap-8 pb-28 print:pb-0 print:gap-0"
      >
        {/* ========================================================
            HALAMAN 1: KETERANGAN DIRI PESERTA DIDIK (LEMBAR KE : 1)
            ======================================================== */}
        {showPage(1) && (
          <div className="page-sheet bg-white text-black border border-slate-300 p-10 shadow-2xl relative font-serif text-xs print:border-none print:shadow-none print:p-8 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="text-center mb-5">
                <h1 className="font-serif font-black text-[15px] tracking-wider uppercase text-black underline decoration-1 underline-offset-4">
                  KETERANGAN DIRI PESERTA DIDIK
                </h1>
                <h2 className="font-serif text-[11px] font-bold tracking-wide uppercase text-black mt-1">
                  DINAS PENDIDIKAN PROVINSI • {schoolSettings.name}
                </h2>
              </div>

              {/* Info Bar with Leader Dots */}
              <div className="flex justify-between items-start text-[11px] pb-2 mb-3">
                <div className="w-[430px] space-y-0.5">
                  <div className="flex items-baseline">
                    <span className="w-32 shrink-0">Fase / Semester</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      {student.fase || 'E'} / 1 (Satu)
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[3px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-32 shrink-0">NIS (NIPD)</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold font-mono">
                      {student.nipd}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[3px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-32 shrink-0">NISN</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold font-mono">
                      {student.nisn}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[3px]" />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px]">
                    Lembar ke :{' '}
                    <span className="border border-black px-1.5 py-0.5 font-bold ml-0.5">
                      1
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="relative">
                {/* Pas Foto Box (Waktu Awal Masuk) */}
                <div className="absolute right-0 top-0 w-32 border border-black p-1.5 bg-white text-center flex flex-col items-center">
                  <span className="text-[9.5px] font-bold uppercase text-black mb-0.5">
                    PAS FOTO
                  </span>
                  <span className="text-[8px] text-black mb-1 leading-tight">
                    (Waktu Awal Masuk)
                  </span>
                  <div className="w-24 h-32 bg-slate-100 overflow-hidden border border-black">
                    <img
                      src={fotoMasukUrl || student.photoUrl}
                      alt={student.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[7.5px] italic text-black leading-tight mt-1.5 px-0.5">
                    Cap tiga jari tengah tangan kiri & tanda tangan di atas pas photo
                  </span>
                </div>

                {/* Data Items Column */}
                <div className="pr-36 space-y-3.5 text-[11px] leading-relaxed">
                  {/* A. KETERANGAN DIRI PESERTA DIDIK */}
                  <div>
                    <h3 className="font-bold text-[11px] uppercase tracking-wide text-black mb-0.5">
                      A. KETERANGAN DIRI PESERTA DIDIK
                    </h3>
                    <div className="space-y-0.5">
                      <div className="flex items-baseline text-[11px]">
                        <span className="w-6 shrink-0">1.</span>
                        <span>Nama Peserta Didik :</span>
                      </div>
                      <DottedRow
                        indent
                        label="a. Nama Lengkap"
                        value={student.fullName}
                        isBoldValue
                        labelWidthClass="w-44"
                      />
                      <DottedRow
                        indent
                        label="b. Nama Panggilan"
                        value="-"
                        labelWidthClass="w-44"
                      />
                      <DottedRow
                        no="2."
                        label="Jenis Kelamin"
                        value={student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="3."
                        label="Tempat, Tanggal Lahir"
                        value={`${student.birthPlace}, ${student.birthDate}`}
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="4."
                        label="Agama / Kewarganegaraan"
                        value={`${student.religion || 'Islam'} / ${
                          student.citizenship || 'WNI'
                        }`}
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="5."
                        label="NIK / No. KK"
                        value={`${student.nik} / ${student.noKk}`}
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="6."
                        label="Email"
                        value="-"
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="7."
                        label="Anak Ke / Status Anak"
                        value="1"
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="8."
                        label="Jml. Saudara (Kndg/Tiri/Angkt)"
                        value="0 / 0 / 0"
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="9."
                        label="Bahasa Sehari-hari"
                        value="-"
                        labelWidthClass="w-50"
                      />
                    </div>
                  </div>

                  {/* B. KETERANGAN TEMPAT TINGGAL */}
                  <div>
                    <h3 className="font-bold text-[11px] uppercase tracking-wide text-black mb-0.5">
                      B. KETERANGAN TEMPAT TINGGAL
                    </h3>
                    <div className="space-y-0.5">
                      <DottedRow
                        no="10."
                        label="Alamat Lengkap"
                        value={student.address}
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="11."
                        label="Nomor Telepon/HP & Rumah"
                        value={student.phone}
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="12."
                        label="Tinggal Dengan / Tgl Tinggal"
                        value="-"
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="13."
                        label="Jarak ke Sekolah / Transp."
                        value="-"
                        labelWidthClass="w-50"
                      />
                    </div>
                  </div>

                  {/* C. KETERANGAN KESEHATAN */}
                  <div>
                    <h3 className="font-bold text-[11px] uppercase tracking-wide text-black mb-0.5">
                      C. KETERANGAN KESEHATAN
                    </h3>
                    <div className="space-y-0.5">
                      <DottedRow
                        no="14."
                        label="Golongan Darah"
                        value="-"
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="15."
                        label="Penyakit Pernah Diderita"
                        value="-"
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="16."
                        label="Kelainan Jasmani"
                        value="-"
                        labelWidthClass="w-50"
                      />
                    </div>

                    <table className="w-full mt-1.5 text-[10.5px] border border-black border-collapse text-center">
                      <thead className="font-bold">
                        <tr>
                          <th className="border border-black p-1 w-14">Sem</th>
                          <th className="border border-black p-1">Tahun Pelajaran</th>
                          <th className="border border-black p-1 w-28">Tb (cm)</th>
                          <th className="border border-black p-1 w-28">Bb (kg)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-black p-1">1</td>
                          <td className="border border-black p-1">-</td>
                          <td className="border border-black p-1">0</td>
                          <td className="border border-black p-1">0</td>
                        </tr>
                        <tr>
                          <td className="border border-black p-1">2</td>
                          <td className="border border-black p-1">-</td>
                          <td className="border border-black p-1">-</td>
                          <td className="border border-black p-1">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* D. KETERANGAN PENDIDIKAN */}
                  <div>
                    <h3 className="font-bold text-[11px] uppercase tracking-wide text-black mb-0.5">
                      D. KETERANGAN PENDIDIKAN
                    </h3>
                    <div className="space-y-0.5">
                      <div className="flex items-baseline text-[11px]">
                        <span className="w-6 shrink-0">17.</span>
                        <span>Asal Mula Diterima :</span>
                      </div>
                      <DottedRow
                        indent
                        label="a. Lulusan Dari"
                        value={student.prevSchool || '-'}
                        labelWidthClass="w-44"
                      />
                      <DottedRow
                        indent
                        label="b. Tanggal / No. STTB-Ijazah"
                        value="-"
                        labelWidthClass="w-44"
                      />
                      <DottedRow
                        indent
                        label="c. Lama Belajar"
                        value="-"
                        labelWidthClass="w-44"
                      />

                      <div className="flex items-baseline text-[11px] mt-0.5">
                        <span className="w-6 shrink-0">18.</span>
                        <span>Pindahan (Jika ada) :</span>
                      </div>
                      <DottedRow
                        indent
                        label="a. Dari Sekolah / Alasan"
                        value="-"
                        labelWidthClass="w-44"
                      />
                      <DottedRow
                        indent
                        label="b. Tingkat / Tgl Diterima"
                        value="-"
                        labelWidthClass="w-44"
                      />
                      <DottedRow
                        indent
                        label="c. No. Surat Keterangan Pindah"
                        value="-"
                        labelWidthClass="w-44"
                      />

                      <div className="flex items-baseline text-[11px] mt-0.5">
                        <span className="w-6 shrink-0">19.</span>
                        <span>Diterima di Sekolah ini :</span>
                      </div>
                      <DottedRow
                        indent
                        label="a. Tanggal / Rombel"
                        value={`22-10-2026 / ${student.currentClass}`}
                        labelWidthClass="w-44"
                      />
                      <DottedRow
                        indent
                        label="b. Program Keahlian"
                        value={student.programKeahlian}
                        isBoldValue
                        labelWidthClass="w-44"
                      />
                    </div>
                  </div>

                  {/* E. KETERANGAN ORANG TUA KANDUNG (Starts on page 1) */}
                  <div>
                    <h3 className="font-bold text-[11px] uppercase tracking-wide text-black mb-0.5">
                      E. KETERANGAN ORANG TUA KANDUNG
                    </h3>
                    <div className="space-y-0.5">
                      <div className="flex items-baseline text-[11px]">
                        <span className="w-6 shrink-0">20.</span>
                        <span>Ayah Kandung :</span>
                      </div>
                      <DottedRow
                        indent
                        label="a. Nama Lengkap"
                        value={student.fatherName || '-'}
                        isBoldValue
                        labelWidthClass="w-44"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Page 1 */}
            <div className="mt-6 pt-3 border-t border-slate-300 flex justify-between text-[9px] text-slate-600 font-serif">
              <span>Buku Induk Peserta Didik — Halaman 1 dari 6</span>
              <span className="font-mono">
                NIS: {student.nipd} | Dicetak: 26/10/2026 07:02
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            HALAMAN 2: ORANG TUA KANDUNG LANJUTAN (HALAMAN 2 DARI 6)
            ======================================================== */}
        {showPage(2) && (
          <div className="page-sheet bg-white text-black border border-slate-300 p-10 shadow-2xl relative font-serif text-xs print:border-none print:shadow-none print:p-8 flex flex-col justify-between">
            <div className="space-y-1">
              <DottedRow
                indent
                label="b. Tempat, Tgl Lahir / Agama"
                value="-"
                labelWidthClass="w-50"
              />
              <DottedRow
                indent
                label="c. Pendidikan / Pekerjaan"
                value={student.parentJob || '-'}
                labelWidthClass="w-50"
              />
              <DottedRow
                indent
                label="d. Penghasilan per Bulan"
                value="-"
                labelWidthClass="w-50"
              />
              <DottedRow
                indent
                label="e. Alamat Ayah"
                value="-"
                labelWidthClass="w-50"
              />

              <div className="flex items-baseline text-[11px] pt-3">
                <span className="w-6 shrink-0">21.</span>
                <span>Ibu Kandung :</span>
              </div>
              <DottedRow
                indent
                label="a. Nama Lengkap"
                value={student.motherName || '-'}
                isBoldValue
                labelWidthClass="w-50"
              />
              <DottedRow
                indent
                label="b. Tempat, Tgl Lahir / Agama"
                value="-"
                labelWidthClass="w-50"
              />
              <DottedRow
                indent
                label="c. Pendidikan / Pekerjaan"
                value="-"
                labelWidthClass="w-50"
              />
              <DottedRow
                indent
                label="d. Penghasilan per Bulan"
                value="-"
                labelWidthClass="w-50"
              />
              <DottedRow
                indent
                label="e. Alamat Ibu"
                value="-"
                labelWidthClass="w-50"
              />
            </div>

            {/* Footer Page 2 */}
            <div className="mt-auto pt-3 border-t border-slate-300 flex justify-between text-[9px] text-slate-600 font-serif">
              <span>Buku Induk Peserta Didik — Halaman 2 dari 6</span>
              <span className="font-mono">
                NIS: {student.nipd} | Dicetak: 26/10/2026 07:02
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            HALAMAN 3: WALI, HOBI, PERKEMBANGAN & TTD (LEMBAR KE : 2)
            ======================================================== */}
        {showPage(3) && (
          <div className="page-sheet bg-white text-black border border-slate-300 p-10 shadow-2xl relative font-serif text-xs print:border-none print:shadow-none print:p-8 flex flex-col justify-between">
            <div>
              {/* Header Lembar 2 */}
              <div className="flex justify-between items-center border-b-2 border-black pb-1.5 mb-4 font-bold text-xs">
                <span>Nomor Urut: 1 | {student.fullName}</span>
                <div className="text-[11px]">
                  Lembar ke :{' '}
                  <span className="border border-black px-1.5 py-0.5 font-bold ml-0.5">
                    2
                  </span>
                </div>
              </div>

              <div className="relative">
                {/* Pas Foto Box (Waktu Tamat Belajar) */}
                <div className="absolute right-0 top-0 w-32 border border-black p-1.5 bg-white text-center flex flex-col items-center">
                  <span className="text-[9.5px] font-bold uppercase text-black mb-0.5">
                    PAS FOTO
                  </span>
                  <span className="text-[8px] text-black mb-1 leading-tight">
                    (Waktu Tamat Belajar)
                  </span>
                  <div className="w-24 h-32 bg-slate-100 overflow-hidden border border-black">
                    <img
                      src={fotoTamatUrl}
                      alt="Foto Tamat"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[7.5px] italic text-black leading-tight mt-1.5 px-0.5">
                    Cap tiga jari tengah tangan kiri & tanda tangan di atas pas photo
                  </span>
                </div>

                {/* Body Left Sections */}
                <div className="pr-36 space-y-3.5 text-[11px] leading-relaxed">
                  {/* F. WALI */}
                  <div>
                    <h3 className="font-bold text-[11px] uppercase tracking-wide text-black mb-0.5">
                      F. KETERANGAN TENTANG WALI (JIKA ADA)
                    </h3>
                    <div className="space-y-0.5">
                      <DottedRow
                        no="22."
                        label="Nama Wali / Hubungan"
                        value="-"
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="23."
                        label="Tempat, Tgl Lahir / Agama"
                        value="-"
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="24."
                        label="Pendidikan / Pekerjaan"
                        value="-"
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="25."
                        label="Penghasilan / Alamat"
                        value="-"
                        labelWidthClass="w-50"
                      />
                    </div>
                  </div>

                  {/* G. HOBI */}
                  <div>
                    <h3 className="font-bold text-[11px] uppercase tracking-wide text-black mb-0.5">
                      G. KEGEMARAN / HOBI
                    </h3>
                    <div className="space-y-0.5">
                      <DottedRow
                        no="26."
                        label="Kesenian / Olahraga"
                        value="-"
                        labelWidthClass="w-50"
                      />
                      <DottedRow
                        no="27."
                        label="Organisasi / Lain-lain"
                        value="-"
                        labelWidthClass="w-50"
                      />
                    </div>
                  </div>

                  {/* H. PERKEMBANGAN PESERTA DIDIK */}
                  <div>
                    <h3 className="font-bold text-[11px] uppercase tracking-wide text-black mb-0.5">
                      H. PERKEMBANGAN PESERTA DIDIK
                    </h3>
                    <div className="space-y-0.5">
                      <div className="flex items-baseline text-[11px]">
                        <span className="w-6 shrink-0">28.</span>
                        <span>Meninggalkan Sekolah :</span>
                      </div>
                      <DottedRow
                        indent
                        label="a. Tanggal / Alasan"
                        value="-"
                        labelWidthClass="w-44"
                      />

                      <div className="flex items-baseline text-[11px] mt-0.5">
                        <span className="w-6 shrink-0">29.</span>
                        <span>Akhir Pendidikan (Lulus) :</span>
                      </div>
                      <DottedRow
                        indent
                        label="a. Tamat Tanggal / Ijazah"
                        value="-"
                        labelWidthClass="w-44"
                      />
                      <DottedRow
                        indent
                        label="b. Nilai Uji Kompetensi Keahlian"
                        value="-"
                        labelWidthClass="w-44"
                      />
                    </div>
                  </div>

                  {/* I. SETELAH SELESAI */}
                  <div>
                    <h3 className="font-bold text-[11px] uppercase tracking-wide text-black mb-0.5">
                      I. SETELAH SELESAI PENDIDIKAN
                    </h3>
                    <div className="space-y-0.5">
                      <DottedRow
                        no="30."
                        label="Melanjutkan Ke / Bekerja di"
                        value="-"
                        labelWidthClass="w-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* K. BEASISWA */}
              <div className="mt-4">
                <h3 className="font-bold text-[11px] uppercase tracking-wide text-black mb-1">
                  K. KETERANGAN BEASISWA
                </h3>
                <table className="w-full text-[10.5px] border border-black border-collapse text-center">
                  <thead className="font-bold">
                    <tr>
                      <th className="border border-black p-1 w-12">NO</th>
                      <th className="border border-black p-1">JENIS BEASISWA</th>
                      <th className="border border-black p-1 w-28">TAHUN</th>
                      <th className="border border-black p-1">SUMBER / KETERANGAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-1">1</td>
                      <td className="border border-black p-1">-</td>
                      <td className="border border-black p-1">-</td>
                      <td className="border border-black p-1">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* L. CATATAN PRESTASI */}
              <div className="mt-3">
                <h3 className="font-bold text-[11px] uppercase tracking-wide text-black mb-1">
                  L. CATATAN PRESTASI & PENTING LAINNYA
                </h3>
                <table className="w-full text-[10.5px] border border-black border-collapse text-center">
                  <thead className="font-bold">
                    <tr>
                      <th className="border border-black p-1 w-12">NO</th>
                      <th className="border border-black p-1">
                        PRESTASI YANG PERNAH DICAPAI / CATATAN
                      </th>
                      <th className="border border-black p-1 w-32">TAHUN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-1">1</td>
                      <td className="border border-black p-1">-</td>
                      <td className="border border-black p-1">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tanda Tangan Resmi & QR Code Digital Verification */}
              <div className="mt-6 flex justify-between items-end text-center text-[10.5px]">
                <div className="w-60">
                  <p className="invisible text-[9px] mb-1">Placeholder</p>
                  <p className="mb-14">Kepala Urusan Tata Usaha,</p>
                  <p className="font-bold underline uppercase">
                    {schoolSettings.administrationHead || 'M. EKO HARIS SULISTIAWAN.,S.SOS'}
                  </p>
                  <p className="font-mono text-[10px]">
                    NIP. {schoolSettings.administrationNip || '-'}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center pb-2">
                  <div className="w-14 h-14 border border-black p-1 bg-white">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                      <rect x="0" y="0" width="100" height="100" fill="white" />
                      <path
                        d="M10 10h30v30h-30z M60 10h30v30h-30z M10 60h30v30h-30z M20 20h10v10h-10z M70 20h10v10h-10z M20 70h10v10h-10z M50 20h5v15h-5z M60 60h10v10h-10z M80 60h10v20h-10z M50 70h20v5h-20z M60 85h25v5h-25z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <span className="text-[7.5px] font-mono tracking-widest uppercase text-black mt-1">
                    DIGITAL VERIFICATION
                  </span>
                </div>

                <div className="w-60">
                  <p className="text-[10px] text-black mb-1">
                    {schoolSettings.regency || 'Bojonegoro'}, 26 Oktober 2026
                  </p>
                  <p className="mb-14">Kepala Sekolah,</p>
                  <p className="font-bold underline uppercase">
                    {schoolSettings.principalName || 'DR. MOLYONO.,M.MPD'}
                  </p>
                  <p className="font-mono text-[10px]">
                    NIP. {schoolSettings.principalNip || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Page 3 */}
            <div className="mt-4 pt-3 border-t border-slate-300 flex justify-between text-[9px] text-slate-600 font-serif">
              <span>Buku Induk Peserta Didik — Halaman 3 dari 6</span>
              <span className="font-mono">
                NIS: {student.nipd} | Dicetak: 26/10/2026 07:02
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            HALAMAN 4: RAPOR SEMESTER 1 & 2 (LEMBAR KE : 3)
            ======================================================== */}
        {showPage(4) && (
          <div className="page-sheet bg-white text-black border border-slate-300 p-10 shadow-2xl relative font-serif text-xs print:border-none print:shadow-none print:p-8 flex flex-col justify-between">
            <WatermarkEmblem />

            <div className="relative z-10">
              <div className="text-center mb-4">
                <h2 className="font-serif font-black text-sm uppercase text-black">
                  LAPORAN HASIL BELAJAR (RAPOR)
                </h2>
                <h3 className="font-serif text-[11px] font-bold uppercase tracking-wider text-black">
                  KURIKULUM MERDEKA
                </h3>
              </div>

              {/* Student Metadata with Leader Dots */}
              <div className="grid grid-cols-2 text-[11px] border-b border-black pb-2 mb-3">
                <div className="space-y-0.5">
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Nama Peserta Didik</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold uppercase">
                      {student.fullName}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">NIPD / NISN</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold font-mono">
                      {student.nipd} / {student.nisn}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Kelas / Fase</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      {student.currentClass} / {student.fase || 'E'}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Semester</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      1 (SATU) dan 2 (DUA)
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                </div>

                <div className="space-y-0.5 pl-6">
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Lembar ke</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">3</span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Program Keahlian</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      {student.programKeahlian}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Tahun Pelajaran</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      {schoolSettings.activeAcademicYear}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                </div>
              </div>

              {/* Grades Table */}
              <table className="w-full text-[10px] border border-black border-collapse mb-3">
                <thead className="font-bold text-center">
                  <tr>
                    <th rowSpan={2} className="border border-black p-1 w-8">
                      NO
                    </th>
                    <th rowSpan={2} className="border border-black p-1 text-left">
                      MATA PELAJARAN
                    </th>
                    <th colSpan={3} className="border border-black p-1">
                      SEMESTER 1 ({student.currentClass})
                    </th>
                    <th colSpan={3} className="border border-black p-1">
                      SEMESTER 2 ({student.currentClass})
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-black p-1 w-12">KKTP</th>
                    <th className="border border-black p-1 w-12">NILAI</th>
                    <th className="border border-black p-1 w-40">
                      CAPAIAN KOMPETENSI
                    </th>
                    <th className="border border-black p-1 w-12">KKTP</th>
                    <th className="border border-black p-1 w-12">NILAI</th>
                    <th className="border border-black p-1 w-40">
                      CAPAIAN KOMPETENSI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-bold">
                    <td colSpan={8} className="border border-black p-1 text-left">
                      A. KELOMPOK UMUM
                    </td>
                  </tr>
                  {[1, 2, 3, 4].map((num) => (
                    <tr key={`umum-${num}`}>
                      <td className="border border-black p-1 text-center">{num}</td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1"></td>
                    </tr>
                  ))}

                  <tr className="font-bold">
                    <td colSpan={8} className="border border-black p-1 text-left">
                      B. KELOMPOK KEJURUAN (DASAR & KONSENTRASI KEAHLIAN)
                    </td>
                  </tr>
                  {[1, 2, 3, 4].map((num) => (
                    <tr key={`kejuruan-${num}`}>
                      <td className="border border-black p-1 text-center">{num}</td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1"></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Ekstrakurikuler & Kehadiran */}
              <table className="w-full text-[10px] border border-black border-collapse mb-3 text-center">
                <thead>
                  <tr className="font-bold">
                    <th className="border border-black p-1 w-8">No</th>
                    <th className="border border-black p-1 text-left">
                      Komponen Pendukung
                    </th>
                    <th className="border border-black p-1 w-32">
                      Semester 1 (SATU)
                    </th>
                    <th className="border border-black p-1 w-32">
                      Semester 2 (DUA)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-bold">
                    <td colSpan={4} className="border border-black p-1 text-left">
                      A. KEGIATAN EKSTRAKURIKULER
                    </td>
                  </tr>
                  {[1, 2, 3].map((num) => (
                    <tr key={`ekskul-${num}`}>
                      <td className="border border-black p-1">{num}</td>
                      <td className="border border-black p-1 text-left">-</td>
                      <td className="border border-black p-1">-</td>
                      <td className="border border-black p-1">-</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={4} className="border border-black p-1 text-left">
                      B. KETIDAKHADIRAN
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">1</td>
                    <td className="border border-black p-1 text-left">Sakit</td>
                    <td className="border border-black p-1">-</td>
                    <td className="border border-black p-1">-</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">2</td>
                    <td className="border border-black p-1 text-left">Izin</td>
                    <td className="border border-black p-1">-</td>
                    <td className="border border-black p-1">-</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">3</td>
                    <td className="border border-black p-1 text-left">
                      Tanpa Keterangan (Alpa)
                    </td>
                    <td className="border border-black p-1">-</td>
                    <td className="border border-black p-1">-</td>
                  </tr>
                </tbody>
              </table>

              {/* Keputusan Box */}
              <div className="border border-black p-2 text-[10px] space-y-1 mb-4">
                <p>
                  Keputusan: Berdasarkan pencapaian seluruh kompetensi, peserta didik dinyatakan:
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">NAIK KE KELAS / LULUS :</span>
                  <span className="grow border-b border-dotted border-black min-w-24"></span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">TINGGAL DI KELAS :</span>
                  <span className="grow border-b border-dotted border-black min-w-24"></span>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-4 flex justify-between text-center text-[10.5px]">
                <div className="w-60">
                  <p className="invisible mb-1 text-[9px]">Placeholder</p>
                  <p className="mb-14">Kepala Urusan Tata Usaha,</p>
                  <p className="font-bold underline uppercase">
                    {schoolSettings.administrationHead || 'M. EKO HARIS SULISTIAWAN.,S.SOS'}
                  </p>
                  <p className="font-mono text-[10px]">
                    NIP. {schoolSettings.administrationNip || '-'}
                  </p>
                </div>
                <div className="w-60">
                  <p className="text-[10px] text-black mb-1">
                    {schoolSettings.regency || 'Bojonegoro'}, 26 Oktober 2026
                  </p>
                  <p className="mb-14">Kepala Sekolah,</p>
                  <p className="font-bold underline uppercase">
                    {schoolSettings.principalName || 'DR. MOLYONO.,M.MPD'}
                  </p>
                  <p className="font-mono text-[10px]">
                    NIP. {schoolSettings.principalNip || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Page 4 */}
            <div className="mt-4 pt-3 border-t border-slate-300 flex justify-between text-[9px] text-slate-600 font-serif">
              <span>Buku Induk Peserta Didik — Halaman 4 dari 6</span>
              <span className="font-mono">
                NIS: {student.nipd} | Dicetak: 26/10/2026 07:02
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            HALAMAN 5: RAPOR SEMESTER 3 & 4 (LEMBAR KE : 4)
            ======================================================== */}
        {showPage(5) && (
          <div className="page-sheet bg-white text-black border border-slate-300 p-10 shadow-2xl relative font-serif text-xs print:border-none print:shadow-none print:p-8 flex flex-col justify-between">
            <WatermarkEmblem />

            <div className="relative z-10">
              <div className="text-center mb-4">
                <h2 className="font-serif font-black text-sm uppercase text-black">
                  LAPORAN HASIL BELAJAR (RAPOR)
                </h2>
                <h3 className="font-serif text-[11px] font-bold uppercase tracking-wider text-black">
                  KURIKULUM MERDEKA
                </h3>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-2 text-[11px] border-b border-black pb-2 mb-3">
                <div className="space-y-0.5">
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Nama Peserta Didik</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold uppercase">
                      {student.fullName}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">NIPD / NISN</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold font-mono">
                      {student.nipd} / {student.nisn}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Kelas / Fase</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      {student.currentClass} / {student.fase || 'E'}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Semester</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      3 (TIGA) dan 4 (EMPAT)
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                </div>

                <div className="space-y-0.5 pl-6">
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Lembar ke</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">4</span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Program Keahlian</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      {student.programKeahlian}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Tahun Pelajaran</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      {schoolSettings.activeAcademicYear}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                </div>
              </div>

              {/* Grades Table */}
              <table className="w-full text-[10px] border border-black border-collapse mb-3">
                <thead className="font-bold text-center">
                  <tr>
                    <th rowSpan={2} className="border border-black p-1 w-8">
                      NO
                    </th>
                    <th rowSpan={2} className="border border-black p-1 text-left">
                      MATA PELAJARAN
                    </th>
                    <th colSpan={3} className="border border-black p-1">
                      SEMESTER 3 ({student.currentClass})
                    </th>
                    <th colSpan={3} className="border border-black p-1">
                      SEMESTER 4 ({student.currentClass})
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-black p-1 w-12">KKTP</th>
                    <th className="border border-black p-1 w-12">NILAI</th>
                    <th className="border border-black p-1 w-40">
                      CAPAIAN KOMPETENSI
                    </th>
                    <th className="border border-black p-1 w-12">KKTP</th>
                    <th className="border border-black p-1 w-12">NILAI</th>
                    <th className="border border-black p-1 w-40">
                      CAPAIAN KOMPETENSI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-bold">
                    <td colSpan={8} className="border border-black p-1 text-left">
                      A. KELOMPOK UMUM
                    </td>
                  </tr>
                  {[1, 2, 3, 4].map((num) => (
                    <tr key={`umum-p5-${num}`}>
                      <td className="border border-black p-1 text-center">{num}</td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1"></td>
                    </tr>
                  ))}

                  <tr className="font-bold">
                    <td colSpan={8} className="border border-black p-1 text-left">
                      B. KELOMPOK KEJURUAN (DASAR & KONSENTRASI KEAHLIAN)
                    </td>
                  </tr>
                  {[1, 2, 3, 4].map((num) => (
                    <tr key={`kejuruan-p5-${num}`}>
                      <td className="border border-black p-1 text-center">{num}</td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1"></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Ekstrakurikuler & Kehadiran */}
              <table className="w-full text-[10px] border border-black border-collapse mb-3 text-center">
                <thead>
                  <tr className="font-bold">
                    <th className="border border-black p-1 w-8">No</th>
                    <th className="border border-black p-1 text-left">
                      Komponen Pendukung
                    </th>
                    <th className="border border-black p-1 w-32">
                      Semester 3 (TIGA)
                    </th>
                    <th className="border border-black p-1 w-32">
                      Semester 4 (EMPAT)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-bold">
                    <td colSpan={4} className="border border-black p-1 text-left">
                      A. KEGIATAN EKSTRAKURIKULER
                    </td>
                  </tr>
                  {[1, 2, 3].map((num) => (
                    <tr key={`ekskul-p5-${num}`}>
                      <td className="border border-black p-1">{num}</td>
                      <td className="border border-black p-1 text-left">-</td>
                      <td className="border border-black p-1">-</td>
                      <td className="border border-black p-1">-</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={4} className="border border-black p-1 text-left">
                      B. KETIDAKHADIRAN
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">1</td>
                    <td className="border border-black p-1 text-left">Sakit</td>
                    <td className="border border-black p-1">-</td>
                    <td className="border border-black p-1">-</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">2</td>
                    <td className="border border-black p-1 text-left">Izin</td>
                    <td className="border border-black p-1">-</td>
                    <td className="border border-black p-1">-</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">3</td>
                    <td className="border border-black p-1 text-left">
                      Tanpa Keterangan (Alpa)
                    </td>
                    <td className="border border-black p-1">-</td>
                    <td className="border border-black p-1">-</td>
                  </tr>
                </tbody>
              </table>

              {/* Keputusan Box */}
              <div className="border border-black p-2 text-[10px] space-y-1 mb-4">
                <p>
                  Keputusan: Berdasarkan pencapaian seluruh kompetensi, peserta didik dinyatakan:
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">NAIK KE KELAS / LULUS :</span>
                  <span className="grow border-b border-dotted border-black min-w-24"></span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">TINGGAL DI KELAS :</span>
                  <span className="grow border-b border-dotted border-black min-w-24"></span>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-4 flex justify-between text-center text-[10.5px]">
                <div className="w-60">
                  <p className="invisible mb-1 text-[9px]">Placeholder</p>
                  <p className="mb-14">Kepala Urusan Tata Usaha,</p>
                  <p className="font-bold underline uppercase">
                    {schoolSettings.administrationHead || 'M. EKO HARIS SULISTIAWAN.,S.SOS'}
                  </p>
                  <p className="font-mono text-[10px]">
                    NIP. {schoolSettings.administrationNip || '-'}
                  </p>
                </div>
                <div className="w-60">
                  <p className="text-[10px] text-black mb-1">
                    {schoolSettings.regency || 'Bojonegoro'}, 26 Oktober 2026
                  </p>
                  <p className="mb-14">Kepala Sekolah,</p>
                  <p className="font-bold underline uppercase">
                    {schoolSettings.principalName || 'DR. MOLYONO.,M.MPD'}
                  </p>
                  <p className="font-mono text-[10px]">
                    NIP. {schoolSettings.principalNip || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Page 5 */}
            <div className="mt-4 pt-3 border-t border-slate-300 flex justify-between text-[9px] text-slate-600 font-serif">
              <span>Buku Induk Peserta Didik — Halaman 5 dari 6</span>
              <span className="font-mono">
                NIS: {student.nipd} | Dicetak: 26/10/2026 07:02
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            HALAMAN 6: RAPOR SEMESTER 5 & 6 (LEMBAR KE : 5 - KELULUSAN)
            ======================================================== */}
        {showPage(6) && (
          <div className="page-sheet bg-white text-black border border-slate-300 p-10 shadow-2xl relative font-serif text-xs print:border-none print:shadow-none print:p-8 flex flex-col justify-between">
            <WatermarkEmblem />

            <div className="relative z-10">
              <div className="text-center mb-4">
                <h2 className="font-serif font-black text-sm uppercase text-black">
                  LAPORAN HASIL BELAJAR (RAPOR)
                </h2>
                <h3 className="font-serif text-[11px] font-bold uppercase tracking-wider text-black">
                  KURIKULUM MERDEKA
                </h3>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-2 text-[11px] border-b border-black pb-2 mb-3">
                <div className="space-y-0.5">
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Nama Peserta Didik</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold uppercase">
                      {student.fullName}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">NIPD / NISN</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold font-mono">
                      {student.nipd} / {student.nisn}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Kelas / Fase</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      {student.currentClass} / {student.fase || 'E'}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Semester</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      5 (LIMA) dan 6 (ENAM)
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                </div>

                <div className="space-y-0.5 pl-6">
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Lembar ke</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">5</span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Program Keahlian</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      {student.programKeahlian}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-36 shrink-0">Tahun Pelajaran</span>
                    <span className="w-3 shrink-0 text-center">:</span>
                    <span className="shrink-0 mr-1.5 font-bold">
                      {schoolSettings.activeAcademicYear}
                    </span>
                    <span className="grow border-b border-dotted border-black/70 min-w-4 mb-[2px]" />
                  </div>
                </div>
              </div>

              {/* Grades Table */}
              <table className="w-full text-[10px] border border-black border-collapse mb-3">
                <thead className="font-bold text-center">
                  <tr>
                    <th rowSpan={2} className="border border-black p-1 w-8">
                      NO
                    </th>
                    <th rowSpan={2} className="border border-black p-1 text-left">
                      MATA PELAJARAN
                    </th>
                    <th colSpan={3} className="border border-black p-1">
                      SEMESTER 5 ({student.currentClass})
                    </th>
                    <th colSpan={3} className="border border-black p-1">
                      SEMESTER 6 ({student.currentClass})
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-black p-1 w-12">KKTP</th>
                    <th className="border border-black p-1 w-12">NILAI</th>
                    <th className="border border-black p-1 w-40">
                      CAPAIAN KOMPETENSI
                    </th>
                    <th className="border border-black p-1 w-12">KKTP</th>
                    <th className="border border-black p-1 w-12">NILAI</th>
                    <th className="border border-black p-1 w-40">
                      CAPAIAN KOMPETENSI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-bold">
                    <td colSpan={8} className="border border-black p-1 text-left">
                      A. KELOMPOK UMUM
                    </td>
                  </tr>
                  {[1, 2, 3, 4].map((num) => (
                    <tr key={`umum-p6-${num}`}>
                      <td className="border border-black p-1 text-center">{num}</td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1"></td>
                    </tr>
                  ))}

                  <tr className="font-bold">
                    <td colSpan={8} className="border border-black p-1 text-left">
                      B. KELOMPOK KEJURUAN (DASAR & KONSENTRASI KEAHLIAN)
                    </td>
                  </tr>
                  {[1, 2, 3, 4].map((num) => (
                    <tr key={`kejuruan-p6-${num}`}>
                      <td className="border border-black p-1 text-center">{num}</td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1 text-center"></td>
                      <td className="border border-black p-1"></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Ekstrakurikuler & Kehadiran */}
              <table className="w-full text-[10px] border border-black border-collapse mb-3 text-center">
                <thead>
                  <tr className="font-bold">
                    <th className="border border-black p-1 w-8">No</th>
                    <th className="border border-black p-1 text-left">
                      Komponen Pendukung
                    </th>
                    <th className="border border-black p-1 w-32">
                      Semester 5 (LIMA)
                    </th>
                    <th className="border border-black p-1 w-32">
                      Semester 6 (ENAM)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-bold">
                    <td colSpan={4} className="border border-black p-1 text-left">
                      A. KEGIATAN EKSTRAKURIKULER
                    </td>
                  </tr>
                  {[1, 2, 3].map((num) => (
                    <tr key={`ekskul-p6-${num}`}>
                      <td className="border border-black p-1">{num}</td>
                      <td className="border border-black p-1 text-left">-</td>
                      <td className="border border-black p-1">-</td>
                      <td className="border border-black p-1">-</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={4} className="border border-black p-1 text-left">
                      B. KETIDAKHADIRAN
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">1</td>
                    <td className="border border-black p-1 text-left">Sakit</td>
                    <td className="border border-black p-1">-</td>
                    <td className="border border-black p-1">-</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">2</td>
                    <td className="border border-black p-1 text-left">Izin</td>
                    <td className="border border-black p-1">-</td>
                    <td className="border border-black p-1">-</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1">3</td>
                    <td className="border border-black p-1 text-left">
                      Tanpa Keterangan (Alpa)
                    </td>
                    <td className="border border-black p-1">-</td>
                    <td className="border border-black p-1">-</td>
                  </tr>
                </tbody>
              </table>

              {/* Keputusan Box */}
              <div className="border border-black p-2 text-[10px] space-y-1 mb-4">
                <p>
                  Keputusan: Berdasarkan pencapaian seluruh kompetensi, peserta didik dinyatakan:
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">NAIK KE KELAS / LULUS :</span>
                  <span className="grow border-b border-dotted border-black min-w-24"></span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold">TINGGAL DI KELAS :</span>
                  <span className="grow border-b border-dotted border-black min-w-24"></span>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-4 flex justify-between text-center text-[10.5px]">
                <div className="w-60">
                  <p className="invisible mb-1 text-[9px]">Placeholder</p>
                  <p className="mb-14">Kepala Urusan Tata Usaha,</p>
                  <p className="font-bold underline uppercase">
                    {schoolSettings.administrationHead || 'M. EKO HARIS SULISTIAWAN.,S.SOS'}
                  </p>
                  <p className="font-mono text-[10px]">
                    NIP. {schoolSettings.administrationNip || '-'}
                  </p>
                </div>
                <div className="w-60">
                  <p className="text-[10px] text-black mb-1">
                    {schoolSettings.regency || 'Bojonegoro'}, 26 Oktober 2026
                  </p>
                  <p className="mb-14">Kepala Sekolah,</p>
                  <p className="font-bold underline uppercase">
                    {schoolSettings.principalName || 'DR. MOLYONO.,M.MPD'}
                  </p>
                  <p className="font-mono text-[10px]">
                    NIP. {schoolSettings.principalNip || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Page 6 */}
            <div className="mt-4 pt-3 border-t border-slate-300 flex justify-between text-[9px] text-slate-600 font-serif">
              <span>Buku Induk Peserta Didik — Halaman 6 dari 6</span>
              <span className="font-mono">
                NIS: {student.nipd} | Dicetak: 26/10/2026 07:02
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          FLOATING BOTTOM TOOLBAR (EXACT 1:1 MATCH TO image_2828e5e5.png)
          ======================================================== */}
      <div className="fixed bottom-3 inset-x-0 z-50 flex items-center justify-center px-4 no-print pointer-events-none">
        <div className="bg-[#1e293b]/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-2 flex-wrap justify-center pointer-events-auto">
          {/* 1. FOTO AWAL MASUK (Cyan #06b6d4) */}
          <button
            onClick={() => setIsFotoMasukModalOpen(true)}
            className="px-4 py-2 bg-[#00bcd4] hover:bg-cyan-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-cyan-600/30 transition cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>FOTO AWAL MASUK</span>
          </button>

          {/* 2. FOTO TAMAT (Amber/Orange #f59e0b) */}
          <button
            onClick={() => setIsFotoTamatModalOpen(true)}
            className="px-4 py-2 bg-[#f59e0b] hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-amber-600/30 transition cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-slate-950" />
            <span>FOTO TAMAT</span>
          </button>

          {/* 3. MODE: SEMUA ▼ (Dark Slate #475569) */}
          <div className="relative">
            <button
              onClick={() => {
                setIsModeDropdownOpen(!isModeDropdownOpen);
                setIsDownloadDropdownOpen(false);
              }}
              className="px-4 py-2 bg-[#475569] hover:bg-slate-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Layers className="w-4 h-4 text-slate-300" />
              <span>{modeLabels[viewMode] || 'MODE: SEMUA'}</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-slate-300" />
            </button>

            {isModeDropdownOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 text-xs text-slate-200 z-50">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  PILIH TAMPILAN LEMBAR:
                </div>
                {[
                  { key: 'all', label: 'Mode: Semua (6 Halaman)' },
                  { key: 'biodata', label: 'Biodata Lengkap (Hal 1-3)' },
                  { key: 'rapor', label: 'Rapor Lengkap (Hal 4-6)' },
                  { key: 'p1', label: 'Lembar 1: Identitas & Diri' },
                  { key: 'p2', label: 'Lembar 2: Orang Tua Kandung' },
                  { key: 'p3', label: 'Lembar 3: Wali, Hobi & TTD' },
                  { key: 'p4', label: 'Lembar 4: Rapor Semester 1-2' },
                  { key: 'p5', label: 'Lembar 5: Rapor Semester 3-4' },
                  { key: 'p6', label: 'Lembar 6: Rapor Semester 5-6' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setViewMode(item.key);
                      setIsModeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition cursor-pointer ${
                      viewMode === item.key
                        ? 'bg-sky-600 text-white font-bold'
                        : 'hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    {viewMode === item.key && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. KEMBALI (Dark Navy #1e293b) */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1e293b] hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-slate-300" />
            <span>KEMBALI</span>
          </button>

          {/* 5. DOWNLOAD PDF ▼ (Emerald Green #10b981) */}
          <div className="relative">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-[#10b981] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD PDF</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          {/* 6. CETAK BUKU INDUK (Blue #0284c7) */}
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-[#0284c7] hover:bg-sky-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/30 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>CETAK BUKU INDUK</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          MODAL FOTO AWAL MASUK (KELAS X)
          ======================================================== */}
      {isFotoMasukModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-600" /> Pas Foto Masuk (Kelas X)
              </h3>
              <button
                onClick={() => setIsFotoMasukModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-32 h-40 mx-auto bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-300">
              <img
                src={fotoMasukUrl}
                alt="Foto Masuk"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">
                URL / Ganti Foto Awal Masuk:
              </label>
              <input
                type="text"
                value={fotoMasukUrl}
                onChange={(e) => setFotoMasukUrl(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setIsFotoMasukModalOpen(false)}
                className="px-3 py-1.5 border rounded-lg text-slate-600 font-semibold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={handleSaveFotoMasuk}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold cursor-pointer"
              >
                Simpan Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL FOTO TAMAT BELAJAR (KELAS XII)
          ======================================================== */}
      {isFotoTamatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-600" /> Pas Foto Tamat Belajar (Kelas XII)
              </h3>
              <button
                onClick={() => setIsFotoTamatModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-32 h-40 mx-auto bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-300">
              <img
                src={fotoTamatUrl}
                alt="Foto Tamat"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">
                URL / Ganti Foto Kelulusan:
              </label>
              <input
                type="text"
                value={fotoTamatUrl}
                onChange={(e) => setFotoTamatUrl(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setIsFotoTamatModalOpen(false)}
                className="px-3 py-1.5 border rounded-lg text-slate-600 font-semibold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={handleSaveFotoTamat}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold cursor-pointer"
              >
                Simpan Foto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
