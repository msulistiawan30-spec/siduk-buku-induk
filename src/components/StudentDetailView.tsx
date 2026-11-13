import React, { useState, useEffect } from 'react';
import { Student, SchoolSettings, SubjectScore } from '../types';
import {
  Edit3,
  FileSpreadsheet,
  Star,
  Camera,
  GraduationCap,
  Printer,
  ArrowRightLeft,
  BookOpen,
  ArrowLeft,
  X,
  Upload,
  Save,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { BukuIndukPreviewModal } from './BukuIndukPreviewModal';

interface StudentDetailViewProps {
  student: Student;
  schoolSettings: SchoolSettings;
  scores: SubjectScore[];
  onBack: () => void;
  onUpdateStudent: (updated: Student) => void;
  onEditStudent?: (student: Student) => void;
}

export const StudentDetailView: React.FC<StudentDetailViewProps> = ({
  student,
  schoolSettings,
  scores,
  onBack,
  onUpdateStudent,
  onEditStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'biodata' | 'transkrip'>('biodata');

  // Live Clock
  const [currentTime, setCurrentTime] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');

  // Modals state
  const [isP5ModalOpen, setIsP5ModalOpen] = useState(false);
  const [isFotoMasukOpen, setIsFotoMasukOpen] = useState(false);
  const [isFotoTamatOpen, setIsFotoTamatOpen] = useState(false);
  const [isMutasiModalOpen, setIsMutasiModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);

  // Mutasi state
  const [mutasiType, setMutasiType] = useState('Pindah Sekolah');
  const [mutasiDate, setMutasiDate] = useState('02/10/2026');
  const [mutasiTarget, setMutasiTarget] = useState('');
  const [mutasiReason, setMutasiReason] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeFmt = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const dateFmt = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      setCurrentTime(timeFmt.format(now));
      setCurrentDateStr(dateFmt.format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveMutasi = () => {
    const updated: Student = {
      ...student,
      status: 'Mutasi Keluar',
      catatanKhusus: `Mutasi ke ${mutasiTarget || 'sekolah lain'}. Alasan: ${mutasiReason || 'Pindah domisili'}.`,
    };
    onUpdateStudent(updated);
    setIsMutasiModalOpen(false);
    alert('Status mutasi peserta didik berhasil diperbarui!');
  };

  const handlePrintA4 = () => {
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Top Header with title and live clock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Data Peserta Didik</span>
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Detail Buku Induk Peserta Didik
            </h1>
            <p className="text-[11px] text-slate-500">
              Dokumen Resmi Lembar Fisik Buku Induk &amp; Transkrip Rekapitulasi Rapor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentDateStr || '03 Nov 2026'}</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-800 text-white rounded-lg shadow-2xs flex items-center gap-1.5 font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            <span>{currentTime || '10:45:55'}</span>
          </div>
        </div>
      </div>

      {/* TOP HEADER PROFILE CARD (Matching image_560ae882.png) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden no-print">
        {/* Blue Gradient Banner */}
        <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 p-6 text-white text-center relative">
          <h2 className="text-lg font-black tracking-wide uppercase">{student.fullName}</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-black/25 rounded-full text-xs font-bold mt-1 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{student.fase || 'E'} {student.programKeahlian}</span>
          </div>

          {/* Avatar floating */}
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden mx-auto mt-4 bg-slate-100 flex items-center justify-center">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-slate-500">{student.fullName.charAt(0)}</span>
            )}
          </div>
        </div>

        {/* 4 Stat Boxes under banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100 text-center py-3 bg-slate-50/50 text-xs">
          <div>
            <div className="font-bold text-slate-800 font-mono text-sm">{student.nipd}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">NIPD</div>
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm">{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">JENIS KELAMIN</div>
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm uppercase">{student.birthPlace}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">ASAL KELAHIRAN</div>
          </div>
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-black ${
              student.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
            }`}>
              {student.status}
            </span>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">STATUS</div>
          </div>
        </div>

        {/* Action Button Strip (Matching image_560ae882.png) */}
        <div className="p-4 bg-white flex flex-wrap items-center justify-center gap-2 text-xs">
          {/* Perbarui Data Siswa (Amber) */}
          <button
            type="button"
            onClick={() => {
              if (onEditStudent) {
                onEditStudent(student);
              }
            }}
            className="px-3.5 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Perbarui Data Siswa</span>
          </button>

          {/* Transkrip Nilai Buku Induk (Blue) */}
          <button
            type="button"
            onClick={() => setActiveTab('transkrip')}
            className="px-3.5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Transkrip Nilai Buku Induk</span>
          </button>

          {/* Kelola P5 (Purple) */}
          <button
            type="button"
            onClick={() => setIsP5ModalOpen(true)}
            className="px-3.5 py-2 bg-[#9333ea] hover:bg-[#7e22ce] text-white font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Star className="w-3.5 h-3.5" />
            <span>Kelola P5</span>
          </button>

          {/* Foto Masuk (Cyan) */}
          <button
            type="button"
            onClick={() => setIsFotoMasukOpen(true)}
            className="px-3.5 py-2 bg-[#06b6d4] hover:bg-[#0891b2] text-white font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Foto Masuk</span>
          </button>

          {/* Foto Tamat (Teal) */}
          <button
            type="button"
            onClick={() => setIsFotoTamatOpen(true)}
            className="px-3.5 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Foto Tamat</span>
          </button>

          {/* Cetak Lembar Induk (Emerald Green) */}
          <button
            type="button"
            onClick={handlePrintA4}
            className="px-3.5 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Lembar Induk</span>
          </button>

          {/* Cetak Buku Lengkap (Cyan) */}
          <button
            type="button"
            onClick={handlePrintA4}
            className="px-3.5 py-2 bg-[#0891b2] hover:bg-[#0e7490] text-white font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cetak Buku Lengkap</span>
          </button>

          {/* Unduh PDF Dropdown (Blue) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
              className="px-3.5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {isDownloadDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-left text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsDownloadDropdownOpen(false);
                    handlePrintA4();
                  }}
                  className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Lembar Biodata PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDownloadDropdownOpen(false);
                    handlePrintA4();
                  }}
                  className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
                  <span>Transkrip Nilai PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Proses Mutasi (Red) */}
          <button
            type="button"
            onClick={() => setIsMutasiModalOpen(true)}
            className="px-3.5 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Proses Mutasi</span>
          </button>
        </div>
      </div>

      {/* TABS SELECTOR (Matching image_560ae882.png) */}
      <div className="flex border-b border-slate-200 no-print gap-4 text-xs font-bold pt-2">
        <button
          type="button"
          onClick={() => setActiveTab('biodata')}
          className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'biodata'
              ? 'border-[#008ba3] text-[#008ba3] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Lembar Biodata Induk (Fisik)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('transkrip')}
          className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'transkrip'
              ? 'border-[#008ba3] text-[#008ba3] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Transkrip Nilai Buku Induk</span>
        </button>
      </div>

      {/* TAB 1: LEMBAR BIODATA FISIK (Matching image_800e7e30.png & image_8a1d57af.png) */}
      {activeTab === 'biodata' && (
        <div className="w-full flex justify-center pb-12 print:pb-0">
          <div className="w-full max-w-4xl bg-white text-slate-900 border border-slate-300 p-8 shadow-md text-[11px] leading-relaxed rounded-xl space-y-6">
            {/* Header Lembar 1 */}
            <div className="text-center border-b-2 border-slate-900 pb-2 mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-950">
                KETERANGAN DIRI PESERTA DIDIK
              </h2>
              <p className="text-[10px] font-bold uppercase text-slate-700">
                KURIKULUM MERDEKA - {schoolSettings.name || 'SMKN DANDER'}
              </p>
            </div>

            <div className="flex justify-between items-start text-[10.5px]">
              <div>
                <div>Fase / Semester : <strong>{student.fase || 'E'} / 1 (Satu)</strong></div>
                <div>NIS (NIPD) : <strong>{student.nipd}</strong></div>
                <div>NISN : <strong>{student.nisn}</strong></div>
              </div>
              <div className="border border-slate-800 px-3 py-1 font-bold text-xs uppercase">
                Lembar ke : 1
              </div>
            </div>

            <div className="relative">
              {/* Photo Box */}
              <div className="absolute right-0 top-0 w-28 h-36 border border-slate-400 p-1 bg-slate-50 text-center flex flex-col justify-between items-center shadow-2xs">
                <div className="w-20 h-24 bg-slate-200 overflow-hidden mt-1 border border-slate-300 flex items-center justify-center">
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-slate-400">{student.fullName.charAt(0)}</span>
                  )}
                </div>
                <span className="text-[7px] uppercase font-bold text-slate-500 leading-tight">
                  Cap tiga jari tengah tangan kiri &amp; tanda tangan di atas pas photo
                </span>
              </div>

              {/* Biodata list */}
              <div className="pr-32 space-y-3">
                <div>
                  <h4 className="font-bold border-b border-slate-300 pb-0.5 mb-1 text-[11px] uppercase">
                    A. KETERANGAN DIRI PESERTA DIDIK
                  </h4>
                  <table className="w-full">
                    <tbody>
                      <tr><td className="w-44 font-semibold text-slate-600">1. Nama Peserta Didik</td><td className="w-3">:</td><td className="font-bold uppercase">{student.fullName}</td></tr>
                      <tr><td className="font-semibold text-slate-600">2. Jenis Kelamin</td><td>:</td><td>{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td></tr>
                      <tr><td className="font-semibold text-slate-600">3. Tempat, Tanggal Lahir</td><td>:</td><td>{student.birthPlace}, {student.birthDate}</td></tr>
                      <tr><td className="font-semibold text-slate-600">4. Agama / Kewarganegaraan</td><td>:</td><td>{student.religion} / {student.citizenship || 'WNI'}</td></tr>
                      <tr><td className="font-semibold text-slate-600">5. NIK / No. KK</td><td>:</td><td className="font-mono">{student.nik} / {student.noKk}</td></tr>
                      <tr><td className="font-semibold text-slate-600">6. Bahasa Sehari-hari</td><td>:</td><td>Bahasa Indonesia</td></tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-bold border-b border-slate-300 pb-0.5 mb-1 text-[11px] uppercase">
                    B. KETERANGAN TEMPAT TINGGAL
                  </h4>
                  <table className="w-full">
                    <tbody>
                      <tr><td className="w-44 font-semibold text-slate-600">7. Alamat Lengkap</td><td className="w-3">:</td><td>{student.address}</td></tr>
                      <tr><td className="font-semibold text-slate-600">8. Nomor Telepon / HP</td><td>:</td><td className="font-mono">{student.phone}</td></tr>
                      <tr><td className="font-semibold text-slate-600">9. Tinggal Bersama</td><td>:</td><td>{student.livingWith || 'Orang Tua'}</td></tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-bold border-b border-slate-300 pb-0.5 mb-1 text-[11px] uppercase">
                    C. KETERANGAN KESEHATAN
                  </h4>
                  <table className="w-full">
                    <tbody>
                      <tr><td className="w-44 font-semibold text-slate-600">10. Golongan Darah</td><td className="w-3">:</td><td>O</td></tr>
                      <tr><td className="font-semibold text-slate-600">11. Penyakit Pernah Diderita</td><td>:</td><td>-</td></tr>
                    </tbody>
                  </table>
                  <table className="w-full border border-slate-400 mt-2 text-center text-[10px]">
                    <thead className="bg-slate-100 font-bold">
                      <tr>
                        <th className="border border-slate-400 p-1">Semester</th>
                        <th className="border border-slate-400 p-1">Tahun Pelajaran</th>
                        <th className="border border-slate-400 p-1">Tinggi Badan (cm)</th>
                        <th className="border border-slate-400 p-1">Berat Badan (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-400 p-1">1</td>
                        <td className="border border-slate-400 p-1">2026/2027</td>
                        <td className="border border-slate-400 p-1 font-mono">166</td>
                        <td className="border border-slate-400 p-1 font-mono">54</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-bold border-b border-slate-300 pb-0.5 mb-1 text-[11px] uppercase">
                    D. KETERANGAN PENDIDIKAN
                  </h4>
                  <table className="w-full">
                    <tbody>
                      <tr><td className="w-44 font-semibold text-slate-600">12. Asal Sekolah</td><td className="w-3">:</td><td>{student.prevSchool}</td></tr>
                      <tr><td className="font-semibold text-slate-600">13. Diterima di Sekolah Ini</td><td>:</td><td>15-07-2026 / {student.currentClass}</td></tr>
                      <tr><td className="font-semibold text-slate-600">14. Program Keahlian</td><td>:</td><td className="font-bold">{student.programKeahlian}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Lembar ke 2 section (Matching image_800e7e30.png & image_8a1d57af.png) */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-400 space-y-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold">Nomor Urut: 1 | {student.fullName}</span>
                <span className="border border-slate-800 px-2 py-0.5 font-bold uppercase text-[10px]">Lembar ke : 2</span>
              </div>

              <div>
                <h4 className="font-bold border-b border-slate-300 pb-0.5 mb-1 text-[11px] uppercase">
                  E. KETERANGAN ORANG TUA KANDUNG
                </h4>
                <table className="w-full">
                  <tbody>
                    <tr><td className="w-44 font-semibold text-slate-600">15. Nama Ayah Kandung</td><td className="w-3">:</td><td className="font-bold uppercase">{student.fatherName}</td></tr>
                    <tr><td className="font-semibold text-slate-600">16. Nama Ibu Kandung</td><td>:</td><td className="font-bold uppercase">{student.motherName}</td></tr>
                    <tr><td className="font-semibold text-slate-600">17. Pekerjaan Orang Tua</td><td>:</td><td>{student.parentJob}</td></tr>
                    <tr><td className="font-semibold text-slate-600">18. Alamat Orang Tua</td><td>:</td><td>{student.parentAddress || student.address}</td></tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="font-bold border-b border-slate-300 pb-0.5 mb-1 text-[11px] uppercase">
                  F. KETERANGAN TENTANG WALI (JIKA ADA)
                </h4>
                <table className="w-full">
                  <tbody>
                    <tr><td className="w-44 font-semibold text-slate-600">22. Nama Wali / Hubungan</td><td className="w-3">:</td><td>-</td></tr>
                    <tr><td className="font-semibold text-slate-600">23. Tempat, Tgl Lahir / Agama</td><td className="w-3">:</td><td>-</td></tr>
                    <tr><td className="font-semibold text-slate-600">24. Pendidikan / Pekerjaan</td><td className="w-3">:</td><td>-</td></tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="font-bold border-b border-slate-300 pb-0.5 mb-1 text-[11px] uppercase">
                  G. KEGEMARAN / HOBI
                </h4>
                <table className="w-full">
                  <tbody>
                    <tr><td className="w-44 font-semibold text-slate-600">26. Kesenian / Olahraga</td><td className="w-3">:</td><td>Futsal, Desain Grafis</td></tr>
                    <tr><td className="font-semibold text-slate-600">27. Organisasi / Lain-lain</td><td className="w-3">:</td><td>Pramuka, OSIS</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures & QR Code */}
              <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-center text-center text-xs">
                <div className="w-56">
                  <p className="text-[10px]">Kepala Urusan Tata Usaha,</p>
                  <p className="font-bold underline uppercase mt-12">
                    {schoolSettings.administrationHead || 'M. EKO HARIS SULISTIAWAN, S.SOS'}
                  </p>
                  <p className="text-[9.5px] font-mono text-slate-600">
                    NIP. {schoolSettings.administrationNip || '-'}
                  </p>
                </div>

                {/* Digital Verification Stamp QR */}
                <div className="text-center p-2 border border-slate-300 rounded bg-slate-50">
                  <div className="w-14 h-14 bg-slate-900 mx-auto rounded flex items-center justify-center text-white text-[8px] font-mono">
                    QR VERIFIED
                  </div>
                  <span className="text-[8px] text-slate-500 font-mono block mt-1">
                    DIGITAL VERIFICATION
                  </span>
                </div>

                <div className="w-56">
                  <p className="text-[10px]">{schoolSettings.district || 'Bojonegoro'}, 03 November 2026</p>
                  <p className="text-[10px]">Kepala Sekolah,</p>
                  <p className="font-bold underline uppercase mt-12">
                    {schoolSettings.principalName || 'DR. MOLYONO, M.MPD'}
                  </p>
                  <p className="text-[9.5px] font-mono text-slate-600">
                    NIP. {schoolSettings.principalNip || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRANSKRIP NILAI BUKU INDUK (Matching image_560ae882.png & image_88ab7c37.png) */}
      {activeTab === 'transkrip' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
                <span>Transkrip Rekapitulasi Nilai Rapor Buku Induk</span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Transkrip Nilai Buku Induk - {student.fullName}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert('Editor Matriks Nilai dibuka untuk siswa ini.')}
                className="px-3.5 py-1.5 bg-[#008ba3] hover:bg-[#007a8f] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Buka Editor Matriks Nilai</span>
              </button>
              <button
                type="button"
                onClick={handlePrintA4}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rapor A4</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-200/80 flex flex-wrap justify-between text-xs gap-3">
            <div>
              <div>Nama: <strong>{student.fullName}</strong></div>
              <div>NIPD: <span className="font-mono">{student.nipd}</span> | NISN: <span className="font-mono">{student.nisn}</span></div>
            </div>
            <div>
              <div>Kelas &amp; Jurusan: <strong>{student.currentClass}</strong></div>
              <div className="text-slate-500">{student.programKeahlian}</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 italic">
            ℹ️ Seluruh rekapitulasi nilai rapor semester 1 s.d semester akhir telah terintegrasi dengan tabel matriks dan otomatis tersambung ke lembar cetak buku induk resmi (A4).
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 uppercase font-bold text-center text-[10px] text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-2.5 w-10">NO</th>
                  <th className="p-2.5 text-left">MATA PELAJARAN</th>
                  <th className="p-2.5">KATEGORI</th>
                  <th className="p-2.5 w-16">SEM 1</th>
                  <th className="p-2.5 w-16">SEM 2</th>
                  <th className="p-2.5 w-16">SEM 3</th>
                  <th className="p-2.5 w-16">SEM 4</th>
                  <th className="p-2.5 w-16">SEM 5</th>
                  <th className="p-2.5 w-16">SEM 6</th>
                  <th className="p-2.5 w-16">RATA2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { no: 1, name: 'Bahasa Indonesia', cat: 'Umum', s1: 85, s2: 88, avg: 86.5 },
                  { no: 2, name: 'Bahasa Inggris', cat: 'Umum', s1: 82, s2: 84, avg: 83.0 },
                  { no: 3, name: 'Matematika', cat: 'Umum', s1: 88, s2: 86, avg: 87.0 },
                  { no: 4, name: 'Pendidikan Agama dan Budi Pekerti', cat: 'Umum', s1: 90, s2: 92, avg: 91.0 },
                  { no: 5, name: 'Pendidikan Jasmani, Olahraga, Kesehatan', cat: 'Umum', s1: 86, s2: 88, avg: 87.0 },
                  { no: 6, name: 'Pendidikan Pancasila', cat: 'Umum', s1: 84, s2: 85, avg: 84.5 },
                  { no: 7, name: 'Sejarah Indonesia', cat: 'Umum', s1: 85, s2: 87, avg: 86.0 },
                  { no: 8, name: 'Dasar Pemeliharaan Mesin Sepeda Motor', cat: 'Kejuruan', s1: 92, s2: 94, avg: 93.0 },
                  { no: 9, name: 'Perawatan Kelistrikan Sepeda Motor', cat: 'Kejuruan', s1: 90, s2: 91, avg: 90.5 },
                  { no: 10, name: 'Perawatan Sasis & Suspensi Otomotif', cat: 'Kejuruan', s1: 89, s2: 93, avg: 91.0 },
                  { no: 11, name: 'Informatika', cat: 'Umum', s1: 86, s2: 88, avg: 87.0 },
                  { no: 12, name: 'Projek Kreatif dan Kewirausahaan', cat: 'Kejuruan', s1: 91, s2: 93, avg: 92.0 },
                ].map((row) => (
                  <tr key={row.no} className="hover:bg-slate-50 transition">
                    <td className="p-2.5 text-center font-bold text-slate-500">{row.no}</td>
                    <td className="p-2.5 font-bold text-slate-800">{row.name}</td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.cat === 'Kejuruan' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {row.cat}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-slate-800">{row.s1}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-slate-800">{row.s2}</td>
                    <td className="p-2.5 text-center font-mono text-slate-400">-</td>
                    <td className="p-2.5 text-center font-mono text-slate-400">-</td>
                    <td className="p-2.5 text-center font-mono text-slate-400">-</td>
                    <td className="p-2.5 text-center font-mono text-slate-400">-</td>
                    <td className="p-2.5 text-center font-mono font-black text-emerald-700">{row.avg}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold">
                  <td colSpan={3} className="p-2.5 text-right font-black">RATA-RATA SEMESTER:</td>
                  <td className="p-2.5 text-center text-sky-700 font-mono font-black">87.33</td>
                  <td className="p-2.5 text-center text-sky-700 font-mono font-black">88.91</td>
                  <td className="p-2.5 text-center font-mono text-slate-400">-</td>
                  <td className="p-2.5 text-center font-mono text-slate-400">-</td>
                  <td className="p-2.5 text-center font-mono text-slate-400">-</td>
                  <td className="p-2.5 text-center font-mono text-slate-400">-</td>
                  <td className="p-2.5 text-center text-emerald-800 font-mono font-black">88.12</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: FOTO MASUK */}
      {isFotoMasukOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyan-600" /> Upload Foto Awal Masuk Sekolah
              </h3>
              <button onClick={() => setIsFotoMasukOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs space-y-1">
              <div>Siswa: <strong>{student.fullName}</strong> ({student.nipd})</div>
              <p className="text-[11px] text-cyan-800">
                Foto awal masuk kelas X SMK dengan seragam kejuruan/putih abu resmi.
              </p>
            </div>
            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-700 font-bold">Pilih File Foto Baru</label>
              <input type="file" accept="image/*" className="w-full p-2 border rounded bg-white text-xs" />
              <p className="text-[10px] text-slate-400">Pilih file foto (JPG/PNG/WebP, maks 2MB)...</p>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setIsFotoMasukOpen(false)} className="px-4 py-2 border rounded text-xs font-semibold">
                Batal
              </button>
              <button
                onClick={() => {
                  setIsFotoMasukOpen(false);
                  alert('Foto awal masuk berhasil disimpan!');
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs font-bold"
              >
                Simpan Foto Masuk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FOTO TAMAT */}
      {isFotoTamatOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600" /> Upload Pas Foto Tamat Belajar (Kelulusan)
              </h3>
              <button onClick={() => setIsFotoTamatOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs space-y-1">
              <div>Siswa: <strong>{student.fullName}</strong> ({student.nipd})</div>
              <p className="text-[11px] text-teal-800">
                Pas foto resmi kelulusan / akhir pendidikan berseragam sekolah lengkap atau jas/almamater untuk buku induk dan ijazah.
              </p>
            </div>
            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-700 font-bold">Pilih File Foto Baru</label>
              <input type="file" accept="image/*" className="w-full p-2 border rounded bg-white text-xs" />
              <p className="text-[10px] text-slate-400">Pilih file foto (JPG/PNG/WebP, maks 2MB)...</p>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setIsFotoTamatOpen(false)} className="px-4 py-2 border rounded text-xs font-semibold">
                Batal
              </button>
              <button
                onClick={() => {
                  setIsFotoTamatOpen(false);
                  alert('Foto kelulusan tamat belajar berhasil disimpan!');
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-bold"
              >
                Simpan Foto Tamat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PROSES MUTASI */}
      {isMutasiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-rose-600" /> Proses Status Mutasi Peserta Didik
              </h3>
              <button onClick={() => setIsMutasiModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Pilih Jenis Status Akhir</label>
                <select
                  value={mutasiType}
                  onChange={(e) => setMutasiType(e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                >
                  <option>Pindah Sekolah</option>
                  <option>Keluar (DO/Berhenti)</option>
                  <option>Meninggal Dunia</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">Tanggal Pindah/Keluar</label>
                <input
                  type="date"
                  defaultValue="2026-11-03"
                  className="w-full p-2 border rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">Sekolah Tujuan (Jika Pindah)</label>
                <input
                  type="text"
                  value={mutasiTarget}
                  onChange={(e) => setMutasiTarget(e.target.value)}
                  placeholder="Nama sekolah tujuan..."
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">Alasan</label>
                <textarea
                  rows={2}
                  value={mutasiReason}
                  onChange={(e) => setMutasiReason(e.target.value)}
                  placeholder="Alasan pindah/keluar..."
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setIsMutasiModalOpen(false)} className="px-4 py-2 border rounded text-xs font-semibold">
                Batal
              </button>
              <button
                onClick={handleSaveMutasi}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold"
              >
                Simpan Perubahan Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KELOLA P5 */}
      {isP5ModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" /> Input Nilai P5 / P2RA - {student.fullName}
              </h3>
              <button onClick={() => setIsP5ModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs space-y-1">
              <div>
                Petunjuk Penilaian: <strong>BB</strong> (Belum Berkembang), <strong>MB</strong> (Mulai Berkembang), <strong>BSH</strong> (Berkembang Sesuai Harapan), <strong>SB</strong> (Sangat Berkembang).
              </div>
            </div>
            <div className="p-6 text-center text-slate-500 border border-dashed rounded-xl space-y-3">
              <Star className="w-8 h-8 text-purple-400 mx-auto" />
              <div className="text-xs">Tema Projek P5: Gaya Hidup Berkelanjutan &amp; Kebekerjaan</div>
              <p className="text-[11px] text-slate-400">Predikat siswa: <strong>BSH (Berkembang Sesuai Harapan)</strong></p>
            </div>
            <div className="flex justify-end pt-3">
              <button onClick={() => setIsP5ModalOpen(false)} className="px-4 py-2 border rounded text-xs font-semibold">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Printable Sheet Modal */}
      {isPrintModalOpen && (
        <BukuIndukPreviewModal
          student={student}
          schoolSettings={schoolSettings}
          onClose={() => setIsPrintModalOpen(false)}
          onUpdateStudent={onUpdateStudent}
        />
      )}
    </div>
  );
};
