import React, { useState } from 'react';
import { SchoolSettings, Student } from '../types';
import {
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Calendar,
  MessageSquare,
  RotateCcw,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Trash2,
  X,
  ExternalLink,
  Info,
  Check,
  Search,
  BookOpen,
  HelpCircle,
  FileCode,
  User,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { asset } from '../utils/asset';

interface FormatBerkasWordViewProps {
  schoolSettings?: SchoolSettings;
  students?: Student[];
}

interface UploadedFormatItem {
  id: string;
  name: string;
  filename: string;
  docType: 'SKL' | 'Transkrip Nilai' | 'Surat Aktif' | 'Surat Mutasi' | 'Raport Skill';
  jenjang: string;
  isActive: boolean;
  notes: string;
}

export const FormatBerkasWordView: React.FC<FormatBerkasWordViewProps> = ({
  schoolSettings = {
    name: 'SMKN DANDER',
    npsn: '20541259',
    principalName: 'Dr. Molyono,.M.Pd',
    principalNip: '-',
    district: 'Bojonegoro',
    regency: 'Bojonegoro',
    activeAcademicYear: '2026/2027',
  } as SchoolSettings,
  students = [],
}) => {
  // Navigation Tabs: 'redaksi' | 'word' | 'panduan'
  const [activeTab, setActiveTab] = useState<'redaksi' | 'word' | 'panduan'>('redaksi');
  const [selectedJenjang, setSelectedJenjang] = useState<string>('SMK');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tab 1: Editorial Text Settings (Standard Government Redaction)
  const defaultRedaksi = {
    sklPembuka: `Berdasarkan Kriteria Kelulusan Satuan Pendidikan yang mengacu pada Peraturan Kepala Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP) Kemendikbudristek serta hasil Rapat Pleno Dewan Guru tentang Kelulusan Peserta Didik Tahun Ajaran 2026/2027, Kepala Sekolah SMKN DANDER dengan ini menerangkan bahwa:`,
    sklPenutup: `Surat Keterangan Lulus ini berlaku sementara sampai diterbitkannya Ijazah resmi dan dapat dipergunakan sebagaimana mestinya untuk keperluan melanjutkan pendidikan ke jenjang yang lebih tinggi atau keperluan kedinasan lainnya.`,
    transkripCatatan: `Transkrip nilai akademik dan kejuruan ini memuat rekapitulasi nilai mata pelajaran umum, kejuruan, dan konsentrasi keahlian selama 6 semester pada SMKN DANDER sebagai bukti kompetensi lulusan vokasi.`,
    raportSkill: `Portofolio pasport skill ini mencatat capaian kompetensi kejuruan, riwayat Praktik Kerja Lapangan (PKL) pada Dunia Usaha / Dunia Industri (DUDI), dan hasil Uji Kompetensi Keahlian (UKK) yang telah diverifikasi oleh Asesor Penguji.`,
    suratAktif: `Yang bertanda tangan di bawah ini, Kepala Sekolah SMKN DANDER, menerangkan dengan sesungguhnya bahwa peserta didik tersebut di atas adalah benar-benar siswa aktif terdaftar pada SMKN DANDER pada Tahun Ajaran 2026/2027. Surat keterangan ini diterbitkan dengan sebenarnya untuk dipergunakan sebagaimana mestinya.`,
    suratMutasi: `Berdasarkan surat permohonan pindah sekolah dari orang tua/wali siswa, dengan ini Kepala Sekolah SMKN DANDER menerangkan bahwa peserta didik tersebut di atas disetujui untuk pindah/mutasi sekolah. Selama menjadi siswa pada sekolah/madrasah kami yang bersangkutan berkelakuan baik.`,
  };

  const [redaksi, setRedaksi] = useState(defaultRedaksi);

  // Tab 2: Uploaded Formats List
  const [uploadedFormats, setUploadedFormats] = useState<UploadedFormatItem[]>([
    {
      id: 'fmt-1',
      name: 'Format SKL Dinamis Standar (Kop & Mapel Otomatis)',
      filename: 'template_default_skl_semua.docx',
      docType: 'SKL',
      jenjang: 'SEMUA',
      isActive: true,
      notes: 'Format SKL resmi dengan kop surat dinamis dan tabel mata pelajaran fleksibel otomatis',
    },
    {
      id: 'fmt-2',
      name: 'Format Transkrip Nilai Dinamis Standar',
      filename: 'template_default_transkrip_semua.docx',
      docType: 'Transkrip Nilai',
      jenjang: 'SEMUA',
      isActive: true,
      notes: 'Format Transkrip Nilai resmi dengan kop surat dinamis dan tabel nilai otomatis',
    },
  ]);

  // Modal State for "Uji Preview" (image_66afc3ae.png)
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDocTitle, setPreviewDocTitle] = useState('Format SKL Dinamis Standar (Kop & Mapel Otomatis)');
  const [previewMode, setPreviewMode] = useState<'data_nyata' | 'tag_asli'>('data_nyata');

  // Modal State for "Upload Format Berkas Sekolah" (image_080c0e7e.png, image_9ce17c08.png)
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    docType: 'Surat Keterangan Lulus (SKL)' as string,
    jenjang: 'SMK (Jenjang Sekolah Saat Ini)',
    name: 'Format SKL Resmi (SMK)',
    fileName: '',
    notes: '',
    makeActive: true,
  });

  // Tab 3: Panduan sub-tab per jenjang
  const [guideJenjangTab, setGuideJenjangTab] = useState<'sd' | 'smp' | 'sma' | 'smk'>('smk');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveRedaksi = () => {
    showToast('✓ Pengaturan redaksi teks surat resmi berhasil disimpan dan langsung aktif!');
  };

  const handleResetRedaksi = () => {
    setRedaksi(defaultRedaksi);
    showToast('✓ Redaksi teks dikembalikan ke standar resmi pemerintah BSKAP Kemendikbudristek.');
  };

  const handleOpenUploadModal = (docTypeDefault: string, titleDefault: string) => {
    setUploadForm({
      docType: docTypeDefault,
      jenjang: 'SMK (Jenjang Sekolah Saat Ini)',
      name: titleDefault,
      fileName: '',
      notes: '',
      makeActive: true,
    });
    setUploadModalOpen(true);
  };

  const handleSaveUploadedFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name) {
      alert('Silakan masukkan nama format berkas');
      return;
    }
    const newItem: UploadedFormatItem = {
      id: `fmt-${Date.now()}`,
      name: uploadForm.name,
      filename: uploadForm.fileName || `${uploadForm.name.toLowerCase().replace(/\s+/g, '_')}.docx`,
      docType: uploadForm.docType.includes('SKL')
        ? 'SKL'
        : uploadForm.docType.includes('Transkrip')
        ? 'Transkrip Nilai'
        : uploadForm.docType.includes('Aktif')
        ? 'Surat Aktif'
        : uploadForm.docType.includes('Mutasi')
        ? 'Surat Mutasi'
        : 'Raport Skill',
      jenjang: 'SMK',
      isActive: uploadForm.makeActive,
      notes: uploadForm.notes || 'Format kustom sekolah resmi diunggah staf TU.',
    };

    setUploadedFormats((prev) => [newItem, ...prev]);
    setUploadModalOpen(false);
    showToast(`✓ Berkas "${newItem.name}" berhasil diunggah dan siap digunakan.`);
  };

  const handleDeleteFormat = (id: string) => {
    if (confirm('Yakin ingin menghapus format berkas ini dari daftar sekolah?')) {
      setUploadedFormats((prev) => prev.filter((f) => f.id !== id));
      showToast('Berkas format berhasil dihapus.');
    }
  };

  const handleDownloadDocx = (filename: string, docName: string) => {
    const textContent = `ACUAN RESMI MASTER FORMAT DOKUMEN SEKOLAH (${docName})
KOP SURAT RESMI: ${schoolSettings.name || 'SMKN DANDER'}
NPSN: ${schoolSettings.npsn || '20541259'}

${docName.toUpperCase()}
Nomor: 421/001/SMK/2026

Yang bertanda tangan di bawah ini, Kepala Sekolah menerangkan bahwa:
Nama Lengkap          : \${nama_lengkap}
Tempat, Tanggal Lahir : \${tempat_tanggal_lahir}
Nomor Induk Siswa     : \${nipd}
NISN                  : \${nisn}
Program Keahlian      : \${jurusan}
Konsentrasi Keahlian  : \${konsentrasi}

Dinyatakan            : \${status_kelulusan}

RATA-RATA NILAI       : \${rata_rata_nilai}

${schoolSettings.regency || 'Bojonegoro'}, 05 November 2026
Kepala Sekolah,

${schoolSettings.principalName || 'Dr. Molyono,.M.Pd'}
NIP. ${schoolSettings.principalNip || '-'}
`;
    const blob = new Blob([textContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Mendownload berkas master: ${filename}`);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. TOP HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Format Berkas Dokumen Sekolah
        </h1>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Calendar Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-slate-300" />
            <span>05 Nov 2026</span>
          </div>

          {/* Clock Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded text-xs font-mono font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            <span>08:09:44</span>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in duration-150 no-print">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. BLUE GRADIENT HERO CARD: Pengaturan Redaksi Teks Surat & Format Berkas */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#2563eb] rounded-xl p-5 text-white shadow-sm no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-2.5 py-0.5 bg-blue-900/60 text-blue-200 border border-blue-400/30 rounded font-semibold flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                <span>PENGATURAN SURAT SEKOLAH</span>
              </span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-200 border border-amber-400/30 rounded font-semibold">
                Jenjang Sekolah: SMK
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 rounded font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Aktif Digunakan</span>
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-300" />
              <span>Pengaturan Redaksi Teks Surat & Format Berkas</span>
            </h2>

            <p className="text-xs text-blue-100 max-w-4xl leading-relaxed">
              Atur kata-kata resmi pada SKL, Transkrip Nilai, Surat Siswa Aktif, dan Surat Pindah dengan mudah tanpa perlu memahami pemrograman. Kop surat dan logo sudah <strong className="text-white font-bold">otomatis terpasang</strong> dari Identitas Sekolah.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <span className="text-xs text-blue-200 font-medium whitespace-nowrap">Pilihan Jenjang:</span>
            <div className="relative">
              <select
                value={selectedJenjang}
                onChange={(e) => setSelectedJenjang(e.target.value)}
                className="bg-white text-slate-800 text-xs font-bold pl-3 pr-8 py-1.5 rounded-lg shadow-xs focus:outline-none cursor-pointer"
              >
                <option value="SMK">SMK (Jenjang Sekolah Ini)</option>
                <option value="SMA">SMA</option>
                <option value="MA">MA (Kemenag)</option>
                <option value="SMP">SMP</option>
                <option value="MTS">MTs (Kemenag)</option>
                <option value="SD">SD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN 3 TABS NAVIGATION BAR (Gambar 1, 2, 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 no-print">
        {/* Tab 1 */}
        <button
          type="button"
          onClick={() => setActiveTab('redaksi')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
            activeTab === 'redaksi'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <span>✎ 1. Atur Kalimat Surat (Redaksi)</span>
          <span className={`px-2 py-0.5 rounded text-[10px] ${activeTab === 'redaksi' ? 'bg-sky-800 text-sky-100' : 'bg-slate-100 text-slate-600'}`}>
            Paling Mudah & Praktis
          </span>
        </button>

        {/* Tab 2 */}
        <button
          type="button"
          onClick={() => setActiveTab('word')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
            activeTab === 'word'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <span>📄 2. Format Word Kustom (.docx)</span>
          <span className={`px-2 py-0.5 rounded text-[10px] ${activeTab === 'word' ? 'bg-sky-800 text-sky-100' : 'bg-slate-100 text-slate-600'}`}>
            Desain Khusus Sekolah
          </span>
        </button>

        {/* Tab 3 */}
        <button
          type="button"
          onClick={() => setActiveTab('panduan')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
            activeTab === 'panduan'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <span>📖 3. Panduan & Kamus Kode</span>
          <span className={`px-2 py-0.5 rounded text-[10px] ${activeTab === 'panduan' ? 'bg-sky-800 text-sky-100' : 'bg-slate-100 text-slate-600'}`}>
            Pusat Bantuan
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ATUR KALIMAT SURAT (REDAKSI) - GAMBAR 1 & GAMBAR 2                 */}
      {/* ========================================================================= */}
      {activeTab === 'redaksi' && (
        <div className="space-y-4">
          {/* Green Notice Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Check className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-emerald-950">
                  Kop Surat, Logo Sekolah, dan Alamat Anda Sudah 100% Otomatis!
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-800 mt-0.5">
                  Anda <strong className="font-bold">tidak perlu repot membuat kop surat</strong> atau mengunggah logo di sini. Sistem sudah menghubungkannya secara otomatis dari menu <strong className="font-bold">Identitas Sekolah</strong>. Anda cukup mengisi atau menyesuaikan kalimat redaksi surat bila diperlukan.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetRedaksi}
              className="self-start sm:self-auto px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              title="Kembalikan kalimat redaksi ke standar pemerintah Kemendikbudristek"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Muat Ulang Teks Resmi Pemerintah</span>
            </button>
          </div>

          {/* Section 1: Surat Keterangan Lulus (SKL) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>👨‍🎓 1. Surat Keterangan Lulus (SKL)</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                Diterbitkan untuk Seluruh Siswa Tingkat Akhir
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Input Redaksi */}
              <div className="lg:col-span-7 space-y-4">
                {/* Kalimat Pembuka SKL */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Kalimat Pembuka SKL (Teks Atas)</span>
                    </label>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold border border-slate-200">
                      Standar Pemerintah
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Kalimat pengantar yang menerangkan dasar kelulusan dan hasil rapat dewan guru sebelum rincian identitas siswa.
                  </p>
                  <textarea
                    rows={4}
                    value={redaksi.sklPembuka}
                    onChange={(e) => setRedaksi({ ...redaksi, sklPembuka: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                  />
                </div>

                {/* Kalimat Penutup SKL */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Kalimat Penutup SKL (Teks Bawah)</span>
                    </label>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold border border-slate-200">
                      Standar Pemerintah
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Kalimat penutup yang menerangkan masa berlaku SKL sementara sebelum tanda tangan kepala sekolah.
                  </p>
                  <textarea
                    rows={4}
                    value={redaksi.sklPenutup}
                    onChange={(e) => setRedaksi({ ...redaksi, sklPenutup: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                  />
                </div>
              </div>

              {/* Right Column: Visual Mock A4 Paper (Contoh Tampilan di Lembar Cetak SKL) */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-sky-600" />
                      <span>Contoh Tampilan di Lembar Cetak SKL:</span>
                    </span>
                    <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-600">
                      A4 Portrait
                    </span>
                  </div>

                  {/* Paper sheet simulation */}
                  <div className="bg-white border border-slate-300 rounded shadow-xs p-4 text-[10px] space-y-2.5">
                    {/* Mock Kop */}
                    <div className="text-center border-b-2 border-black pb-1.5">
                      <p className="font-bold text-[10px] text-slate-900">[ KOP SURAT RESMI SEKOLAH ]</p>
                      <p className="text-[8.5px] text-slate-500">(Logo, Alamat, NPSN, dan Akreditasi otomatis dari sistem)</p>
                    </div>

                    <div className="text-center font-bold text-[10px] text-black tracking-wide underline">
                      SURAT KETERANGAN LULUS
                    </div>

                    {/* Pembuka box */}
                    <div className="border border-dashed border-emerald-400 bg-emerald-50/50 p-2 rounded text-[9px] text-emerald-900 leading-tight">
                      <span className="font-bold text-emerald-800 block text-[8px] uppercase">
                        [ Kalimat Pembuka SKL Muncul Di Sini ]
                      </span>
                      &ldquo;{redaksi.sklPembuka.substring(0, 110)}...&rdquo;
                    </div>

                    {/* Mock Identity */}
                    <div className="text-[9px] text-slate-700 space-y-0.5 font-mono">
                      <p>Nama Siswa : <strong className="text-black">[Nama Siswa Otomatis]</strong></p>
                      <p>NISN / NIS : [0081234567 / 2021001]</p>
                      <p>Dinyatakan : <span className="bg-emerald-100 text-emerald-800 px-1 font-bold rounded">LULUS</span></p>
                    </div>

                    {/* Mock Table */}
                    <div className="border border-slate-300 p-2 text-center text-[8.5px] text-slate-500 bg-slate-50 rounded">
                      [ -- Tabel Rekap Nilai Ujian Siswa Otomatis -- ]
                    </div>

                    {/* Penutup box */}
                    <div className="border border-dashed border-sky-400 bg-sky-50/50 p-2 rounded text-[9px] text-sky-900 leading-tight">
                      <span className="font-bold text-sky-800 block text-[8px] uppercase">
                        [ Kalimat Penutup SKL Muncul Di Sini ]
                      </span>
                      &ldquo;{redaksi.sklPenutup.substring(0, 95)}...&rdquo;
                    </div>

                    {/* Mock Signatures */}
                    <div className="text-right text-[8.5px] pt-1">
                      <p>Kepala Sekolah,</p>
                      <p className="h-6"></p>
                      <p className="font-bold text-black">(Nama Kepala &amp; NIP Otomatis)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 text-[10.5px] text-slate-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Desain rapi dan bebas geser baik saat cetak browser maupun Word.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Catatan Transkrip Nilai & Raport Skill */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>📊 2. Catatan Transkrip Nilai & Raport Skill</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Catatan Transkrip Nilai */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Catatan Transkrip Nilai Akademik</span>
                  </label>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold border border-slate-200">
                    Standar Pemerintah
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Dicantumkan di bagian bawah tabel rekap nilai transkrip akademik (SMP, MTs, SMA, MA, SMK).
                </p>
                <textarea
                  rows={4}
                  value={redaksi.transkripCatatan}
                  onChange={(e) => setRedaksi({ ...redaksi, transkripCatatan: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>

              {/* Keterangan Raport Skill */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Keterangan Raport Skill / Pasport Vokasi (SMK)</span>
                  </label>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold border border-slate-200">
                    Standar Pemerintah
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Dicantumkan pada sertifikasi portofolio capaian kompetensi, riwayat PKL/DUDI, dan hasil UKK siswa.
                </p>
                <textarea
                  rows={4}
                  value={redaksi.raportSkill}
                  onChange={(e) => setRedaksi({ ...redaksi, raportSkill: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Surat Administrasi Siswa (Siswa Aktif & Surat Pindah / Mutasi) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>📄 3. Surat Administrasi Siswa (Siswa Aktif & Surat Pindah / Mutasi)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Teks Surat Siswa Aktif Belajar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Teks Surat Siswa Aktif Belajar</span>
                  </label>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold border border-slate-200">
                    Standar Pemerintah
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Menerangkan bahwa siswa bersangkutan benar-benar terdaftar dan aktif belajar di sekolah ini.
                </p>
                <textarea
                  rows={4}
                  value={redaksi.suratAktif}
                  onChange={(e) => setRedaksi({ ...redaksi, suratAktif: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>

              {/* Teks Surat Pindah / Mutasi */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Teks Surat Pindah / Mutasi Siswa</span>
                  </label>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold border border-slate-200">
                    Standar Pemerintah
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Menerangkan persetujuan kepala sekolah dan catatan kelakuan baik saat siswa mengajukan pindah sekolah.
                </p>
                <textarea
                  rows={4}
                  value={redaksi.suratMutasi}
                  onChange={(e) => setRedaksi({ ...redaksi, suratMutasi: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="font-bold text-slate-900">Simpan Pengaturan Kalimat Surat</p>
                <p className="text-[11px] text-slate-500">Perubahan langsung aktif dan digunakan saat mencetak dari browser maupun Word.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveRedaksi}
              className="px-5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Redaksi Teks</span>
            </button>
          </div>

          {/* Callout box to Tab 2 */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-sky-600 shrink-0" />
              <div>
                <p className="font-bold text-sky-950">Butuh mendesain tata letak khusus di Microsoft Word (.docx)?</p>
                <p className="text-[11px] text-sky-800">Jika sekolah Anda ingin memakai bingkai khusus atau kop bertanda khusus dari Word, silakan buka Tab 2.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('word')}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-sky-700 border border-sky-300 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <span>Buka Format Word Kustom</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FORMAT WORD KUSTOM (.DOCX) - GAMBAR 3, 4, 5, 6, 7                  */}
      {/* ========================================================================= */}
      {activeTab === 'word' && (
        <div className="space-y-5">
          {/* Status Bar */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                ● STATUS FORMAT SAAT INI
              </span>
              <span className="font-bold">
                Berkas Format yang Digunakan Sistem untuk Jenjang <span className="underline">SMK</span>
              </span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Jika belum mengunggah format kustom sekolah, sistem secara otomatis menggunakan format standar bawaan aplikasi yang sudah teruji rapi.
            </p>
          </div>

          {/* Grid 5 Document Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. SKL Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold rounded flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>SKL</span>
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Format Sekolah Terpasang</span>
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  Surat Keterangan Lulus (SKL)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Format SKL Dinamis Standar (Kop &amp; Mapel Otomatis)
                </p>

                <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 font-mono flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span className="truncate">template_default_skl_semua.docx</span>
                  <span className="ml-auto bg-slate-200 px-1 rounded text-[9px] font-bold">SEMUA</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 text-[10.5px]">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewDocTitle('Format SKL Dinamis Standar (Kop & Mapel Otomatis)');
                    setPreviewModalOpen(true);
                  }}
                  className="px-2 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                  title="Pratinjau tampilan format dokumen"
                >
                  <Eye className="w-3 h-3" />
                  <span>Uji Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDocx('template_default_skl_semua.docx', 'Surat Keterangan Lulus')}
                  className="px-2 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded font-semibold flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <Download className="w-3 h-3" />
                  <span>Unduh</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenUploadModal('Surat Keterangan Lulus (SKL)', 'Format SKL Resmi (SMK)')}
                  className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold flex items-center justify-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Ganti</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Format SKL dikembalikan ke standar bawaan aplikasi')}
                  className="px-2 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded font-semibold flex items-center justify-center gap-1 cursor-pointer transition"
                  title="Reset ke format standar aplikasi"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* 2. Transkrip Nilai Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Transkrip</span>
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Format Sekolah Terpasang</span>
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  Transkrip Nilai Siswa
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Format Transkrip Nilai Dinamis Standar
                </p>

                <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 font-mono flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate">template_default_transkrip_semua.docx</span>
                  <span className="ml-auto bg-slate-200 px-1 rounded text-[9px] font-bold">SEMUA</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 text-[10.5px]">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewDocTitle('Format Transkrip Nilai Dinamis Standar');
                    setPreviewModalOpen(true);
                  }}
                  className="px-2 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <Eye className="w-3 h-3" />
                  <span>Uji Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDocx('template_default_transkrip_semua.docx', 'Transkrip Nilai')}
                  className="px-2 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded font-semibold flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <Download className="w-3 h-3" />
                  <span>Unduh</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenUploadModal('Transkrip Nilai Siswa', 'Format Transkrip Nilai Resmi (SMK)')}
                  className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold flex items-center justify-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Ganti</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Format Transkrip dikembalikan ke standar bawaan aplikasi')}
                  className="px-2 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded font-semibold flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* 3. Surat Keterangan Aktif Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Surat Aktif</span>
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded">
                    ⚙ Format Standar Bawaan
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  Surat Keterangan Aktif
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Saat ini mencetak dengan <strong className="text-slate-700">format standar bawaan aplikasi</strong>. Ingin memakai kop dan format sekolah sendiri? Silakan upload di bawah.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenUploadModal('Surat Keterangan Aktif', 'Format Surat Siswa Aktif (SMK)')}
                  className="w-full py-2 bg-[#0d6e7e] hover:bg-[#0b5b68] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Format Surat Aktif</span>
                </button>
              </div>
            </div>

            {/* 4. Surat Keterangan Mutasi Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Surat Mutasi</span>
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded">
                    ⚙ Format Standar Bawaan
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  Surat Keterangan Mutasi
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Saat ini mencetak dengan <strong className="text-slate-700">format standar bawaan aplikasi</strong>. Ingin memakai kop dan format sekolah sendiri? Silakan upload di bawah.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenUploadModal('Surat Keterangan Mutasi', 'Format Surat Pindah / Mutasi (SMK)')}
                  className="w-full py-2 bg-[#0d6e7e] hover:bg-[#0b5b68] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Format Surat Mutasi</span>
                </button>
              </div>
            </div>

            {/* 5. Raport Skill / Vokasi Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Raport Skill</span>
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded">
                    ⚙ Format Standar Bawaan
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  Raport Skill / Vokasi
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Khusus program kejuruan (SMK) / sertifikasi vokasi pasport skill kompetensi siswa.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenUploadModal('Raport Skill', 'Format Pasport Skill Vokasi (SMK)')}
                  className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload Raport Skill</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section: Master Word .docx Downloads for all Jenjang */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>📄 Format Acuan Resmi Sekolah (Master Word .docx Siap Pakai)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Gunakan berkas acuan ini untuk sekolah Anda. Kop surat sudah menggunakan <strong className="text-slate-700">Tabel 1×2 (bebas rusak di browser)</strong> dan tabel mata pelajaran sudah menggunakan <strong className="text-slate-700">1 baris dinamis $(no)</strong> yang otomatis mengikuti jurusan &amp; jenjang siswa.
              </p>
            </div>

            {/* Grid of Master Docx per Jenjang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 text-xs">
              {/* SD */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold">
                  SD
                </span>
                <p className="font-bold text-xs text-slate-800">Acuan SD</p>
                <p className="text-[10px] text-slate-500">Pendidikan dasar, tabel nilai tunggal tanpa peminatan, Kop Dinas Pendidikan Kab/Kota.</p>
                <button
                  type="button"
                  onClick={() => handleDownloadDocx('master_skl_sd.docx', 'SKL SD')}
                  className="w-full py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <Download className="w-3 h-3" />
                  <span>SKL SD (.docx)</span>
                </button>
              </div>

              {/* SMP */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded text-[10px] font-bold">
                  SMP
                </span>
                <p className="font-bold text-xs text-slate-800">Acuan SMP</p>
                <p className="text-[10px] text-slate-500">Menengah pertama standar Kemendikbud, kelompok mapel A &amp; B lengkap.</p>
                <button
                  type="button"
                  onClick={() => handleDownloadDocx('master_skl_smp.docx', 'SKL SMP')}
                  className="w-full py-1.5 bg-white hover:bg-sky-50 text-sky-700 border border-sky-300 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <Download className="w-3 h-3" />
                  <span>SKL SMP (.docx)</span>
                </button>
              </div>

              {/* MTs */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                  MTs (Kemenag)
                </span>
                <p className="font-bold text-xs text-slate-800">Acuan MTs</p>
                <p className="text-[10px] text-slate-500">Kop Kemenag resmi, NSM/NPSN, jabatan Kepala Madrasah &amp; mapel PAI MTs terpadu.</p>
                <button
                  type="button"
                  onClick={() => handleDownloadDocx('master_skl_mts.docx', 'SKL MTs')}
                  className="w-full py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <Download className="w-3 h-3" />
                  <span>SKL MTs (.docx)</span>
                </button>
              </div>

              {/* SMA */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold">
                  SMA
                </span>
                <p className="font-bold text-xs text-slate-800">Acuan SMA</p>
                <p className="text-[10px] text-slate-500">Peminatan MIPA / IPS / Bahasa, transkrip nilai akademik &amp; rata-rata nilai.</p>
                <button
                  type="button"
                  onClick={() => handleDownloadDocx('master_skl_sma.docx', 'SKL SMA')}
                  className="w-full py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <Download className="w-3 h-3" />
                  <span>SKL SMA (.docx)</span>
                </button>
              </div>

              {/* MA */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-[10px] font-bold">
                  MA (Kemenag)
                </span>
                <p className="font-bold text-xs text-slate-800">Acuan MA</p>
                <p className="text-[10px] text-slate-500">Kop Kemenag, NSM, Kepala Madrasah, peminatan Keagamaan / MIPA / IPS.</p>
                <button
                  type="button"
                  onClick={() => handleDownloadDocx('master_skl_ma.docx', 'SKL MA')}
                  className="w-full py-1.5 bg-white hover:bg-green-50 text-green-700 border border-green-300 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <Download className="w-3 h-3" />
                  <span>SKL MA (.docx)</span>
                </button>
              </div>

              {/* SMK / MAK */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                  SMK / MAK
                </span>
                <p className="font-bold text-xs text-slate-800">Acuan SMK</p>
                <p className="text-[10px] text-slate-500">Multi-baris lembaga, Bidang/Konsentrasi Keahlian, SKL &amp; Transkrip Nilai.</p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDownloadDocx('master_skl_smk.docx', 'SKL SMK')}
                    className="flex-1 py-1.5 bg-white hover:bg-amber-50 text-amber-700 border border-amber-300 rounded text-[10.5px] font-bold flex items-center justify-center gap-0.5 cursor-pointer transition"
                  >
                    <Download className="w-3 h-3" />
                    <span>SKL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadDocx('master_transkrip_smk.docx', 'Transkrip SMK')}
                    className="flex-1 py-1.5 bg-white hover:bg-amber-50 text-amber-700 border border-amber-300 rounded text-[10.5px] font-bold flex items-center justify-center gap-0.5 cursor-pointer transition"
                  >
                    <Download className="w-3 h-3" />
                    <span>Transkrip</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Master Surat Tambahan Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold mr-2">
                  Format Surat Tambahan
                </span>
                <span className="font-bold text-slate-800">Master Surat Keterangan Siswa (Universal untuk Seluruh Jenjang)</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Surat Keterangan Siswa Aktif dan Surat Keterangan Pindah / Mutasi Siswa dengan kop surat adaptif.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadDocx('master_surat_siswa_aktif.docx', 'Surat Siswa Aktif')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-sky-700 border border-sky-300 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Master Surat Siswa Aktif (.docx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDocx('master_surat_pindah_mutasi.docx', 'Surat Pindah / Mutasi')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-amber-700 border border-amber-300 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Master Surat Pindah / Mutasi (.docx)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section: Uploaded Format List Table (Gambar 7 image_815f1997.png) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>📁 Daftar Berkas Format Sekolah yang Diunggah</span>
              </h3>
              <span className="text-xs text-slate-500">
                Total: <strong className="text-slate-800">{uploadedFormats.length} berkas format</strong>
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5 w-10 text-center">NO</th>
                    <th className="p-2.5">NAMA / JUDUL FORMAT BERKAS</th>
                    <th className="p-2.5 w-28 text-center">JENIS DOKUMEN</th>
                    <th className="p-2.5 w-24 text-center">JENJANG</th>
                    <th className="p-2.5 w-20 text-center">STATUS</th>
                    <th className="p-2.5">KETERANGAN</th>
                    <th className="p-2.5 w-24 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {uploadedFormats.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-2.5 text-center font-bold text-slate-700">{idx + 1}</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        {item.name}
                        <p className="font-mono font-normal text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <FileText className="w-3 h-3 text-slate-400" />
                          <span>{item.filename}</span>
                        </p>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded text-[10px] font-bold">
                          {item.docType}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold border border-slate-200">
                          {item.jenjang}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold flex items-center justify-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Aktif</span>
                        </span>
                      </td>
                      <td className="p-2.5 text-[11px] text-slate-600 max-w-xs">{item.notes}</td>
                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewDocTitle(item.name);
                              setPreviewModalOpen(true);
                            }}
                            className="p-1 hover:bg-sky-50 text-sky-600 rounded cursor-pointer transition"
                            title="Uji Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadDocx(item.filename, item.name)}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded cursor-pointer transition"
                            title="Unduh Berkas"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFormat(item.id)}
                            className="p-1 hover:bg-rose-50 text-rose-600 rounded cursor-pointer transition"
                            title="Hapus Format"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PANDUAN & KAMUS KODE - GAMBAR 8 (image_eebe5ffd.png)               */}
      {/* ========================================================================= */}
      {activeTab === 'panduan' && (
        <div className="space-y-5">
          {/* 3 Langkah Box */}
          <div className="bg-sky-50/70 border border-sky-200 p-5 rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs sm:text-sm text-sky-950 flex items-center gap-2">
                <span>Cara Mudah Menggunakan Format Berkas Sekolah (Untuk Guru &amp; Staf TU)</span>
              </h3>
              <button
                type="button"
                onClick={() => alert('Contoh cara kerja: Download blangko master .docx -> buka di Word -> pasang logo sekolah Anda -> simpan -> upload kembali ke sistem.')}
                className="px-2.5 py-1 bg-white hover:bg-sky-100 text-sky-700 border border-sky-300 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat Contoh Cara Kerjanya</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Tidak perlu paham IT atau pemrograman! Sistem ini bekerja persis seperti fitur <strong className="text-slate-700 font-bold">Mail Merge</strong> di Microsoft Word.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-lg border border-sky-200 space-y-1.5 shadow-xs">
                <span className="font-bold text-sky-900 block flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-sky-600" />
                  <span>Langkah 1: Unduh Blangko</span>
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pilih jenjang sekolah Anda di bawah (SD, SMP, MTs, SMA, MA, atau SMK), lalu klik tombol unduh. File Word (.docx) sudah memiliki kop surat dan format tabel rapi.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('word')}
                  className="text-sky-600 hover:underline text-[11px] font-bold block pt-1"
                >
                  ↓ Unduh pada kotak di bawah
                </button>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-sky-200 space-y-1.5 shadow-xs">
                <span className="font-bold text-sky-900 block flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Langkah 2: Ganti Logo di Word</span>
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Buka file Word di komputer Anda. Pasang <strong className="text-slate-800">Logo Resmi Sekolah</strong> dan edit <strong className="text-slate-800">Alamat Sekolah</strong>. Tulisan seperti <code className="bg-slate-100 text-rose-600 px-1 py-0.5 rounded text-[10px] font-mono">${'{nama_lengkap}'}</code> biarkan saja seperti titik-titik isian otomatis.
                </p>
                <span className="text-emerald-700 font-bold text-[10.5px] block pt-1">
                  ✓ Edit dengan Microsoft Word biasa
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-sky-200 space-y-1.5 shadow-xs">
                <span className="font-bold text-sky-900 block flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Langkah 3: Upload &amp; Siap Cetak!</span>
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Klik tombol <strong className="text-slate-800">Upload Format</strong>, lalu masukkan file Word Anda. Komputer akan langsung mengisi nama siswa, NISN, dan nilai secara otomatis saat mencetak!
                </p>
                <span className="text-blue-700 font-bold text-[10.5px] block pt-1">
                  🖨 Siap cetak per siswa / massal
                </span>
              </div>
            </div>

            {/* Jaminan Aman */}
            <div className="bg-white border border-emerald-300 rounded-lg p-3 flex items-start gap-2.5 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-950">Jaminan Aman &amp; Bebas Khawatir:</p>
                <p className="text-[11px] text-emerald-800">
                  Anda tidak perlu takut salah atau merusak sistem! Jika file Word yang diunggah kurang pas, Anda bisa klik tombol <strong className="font-bold">&ldquo;Reset ke Standar&rdquo;</strong> kapan saja untuk kembali ke format bawaan aplikasi dalam 1 klik.
                </p>
              </div>
            </div>
          </div>

          {/* Panduan Praktis Pengisian Berkas Word per Jenjang */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <span>Panduan Praktis Pengisian Berkas Word per Jenjang (SD, MTS, SMP, MA, SMA, SMK)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Petunjuk detail &amp; contoh konkret bagi operator sekolah dalam menyiapkan berkas Word (.docx) agar terisi otomatis dengan rapi, bebas rusak, dan dinamis.
              </p>
            </div>

            {/* 2 Prinsip Dasar Box */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3 text-xs">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-sky-600" />
                <span>Prinsip Dasar: Di dalam file Word sekolah, hanya ada 2 jenis tulisan:</span>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white border border-emerald-300 rounded-lg p-3 space-y-1">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] inline-block">
                    1. Tulisan Bebas (Boleh Diedit Sekolah)
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Gambar logo sekolah, teks kop surat (nama yayasan/dinas, nama sekolah, alamat, telp, website, NPSN/NSS/NSM), serta kalimat pembuka atau penutup surat bebas diubah sesuai format resmi sekolah Anda.
                  </p>
                </div>

                <div className="bg-white border border-rose-300 rounded-lg p-3 space-y-1">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px] inline-block">
                    2. Kode Sakti / Tag Sistem (${'{...}'})
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Tulisan dalam tanda kurung <code className="bg-slate-100 text-rose-700 px-1 py-0.5 rounded font-mono font-bold">${'{...}'}</code> seperti <code className="font-mono">${'{nama_lengkap}'}</code>, <code className="font-mono">${'{nisn}'}</code>, <code className="font-mono">${'{no}'}</code>, <code className="font-mono">${'{nama_mapel}'}</code>, <code className="font-mono">${'{nilai_akhir}'}</code> <strong className="text-rose-700">JANGAN DIUBAH/DIHAPUS</strong>. Ini adalah &ldquo;wadah otomatis&rdquo; yang diisi komputer dengan data masing-masing siswa saat dicetak!
                  </p>
                </div>
              </div>

              {/* 3 Point Guides */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <p className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1">
                    <span>1. Kop Surat Tabel 1×2</span>
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Gunakan Tabel 1 baris × 2 kolom (Border: None) di Word. Kolom kiri untuk logo, kolom kanan untuk teks kop surat. <em className="text-slate-500">Jangan gunakan Text Box melayang (*Floating Shape*) agar tidak bergeser di browser.</em>
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <p className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1">
                    <span>2. Posisi Logo Sejajar Teks</span>
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Klik kanan logo sekolah di Word → pilih <strong className="text-slate-800">Wrap Text</strong> → pilih <strong className="text-slate-800">In Line with Text</strong> (Sejajar dengan Teks). Ini menjamin logo tidak akan menimpa teks kop surat.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <p className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1">
                    <span>3. Tabel Nilai Cukup 1 Baris</span>
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Cukup buat 1 baris template: <code className="bg-slate-100 text-rose-600 px-1 py-0.5 rounded text-[10px] font-mono">${'{no}'}</code>, <code className="bg-slate-100 text-rose-600 px-1 py-0.5 rounded text-[10px] font-mono">${'{nama_mapel}'}</code>, <code className="bg-slate-100 text-rose-600 px-1 py-0.5 rounded text-[10px] font-mono">${'{nilai_akhir}'}</code>. Komputer secara otomatis menduplikasi baris ke bawah sebanyak mata pelajaran riil siswa.
                  </p>
                </div>
              </div>
            </div>

            {/* Jenjang Tabs */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setGuideJenjangTab('sd')}
                  className={`flex-1 py-2.5 text-center transition cursor-pointer border-r border-slate-200 ${
                    guideJenjangTab === 'sd' ? 'bg-white text-rose-700 border-b-2 border-b-rose-600' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  SD / MI (Dasar)
                </button>
                <button
                  type="button"
                  onClick={() => setGuideJenjangTab('smp')}
                  className={`flex-1 py-2.5 text-center transition cursor-pointer border-r border-slate-200 ${
                    guideJenjangTab === 'smp' ? 'bg-white text-sky-700 border-b-2 border-b-sky-600' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  SMP / MTs (Menengah Pertama)
                </button>
                <button
                  type="button"
                  onClick={() => setGuideJenjangTab('sma')}
                  className={`flex-1 py-2.5 text-center transition cursor-pointer border-r border-slate-200 ${
                    guideJenjangTab === 'sma' ? 'bg-white text-blue-700 border-b-2 border-b-blue-600' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  SMA / MA (Menengah Atas)
                </button>
                <button
                  type="button"
                  onClick={() => setGuideJenjangTab('smk')}
                  className={`flex-1 py-2.5 text-center transition cursor-pointer ${
                    guideJenjangTab === 'smk' ? 'bg-white text-amber-700 border-b-2 border-b-amber-600' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  SMK / MAK (Kejuruan/Vokasi)
                </button>
              </div>

              <div className="p-4 bg-white text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-800">
                    {guideJenjangTab === 'sd' && 'Jenjang Pendidikan Dasar: Berlaku untuk Sekolah Dasar (SD Negeri/Swasta) dan Madrasah Ibtidaiyah (MI).'}
                    {guideJenjangTab === 'smp' && 'Jenjang Menengah Pertama: Berlaku untuk SMP Negeri/Swasta dan MTs (Kemenag).'}
                    {guideJenjangTab === 'sma' && 'Jenjang Menengah Atas: Berlaku untuk SMA (Peminatan MIPA/IPS/Bahasa) dan MA (Keagamaan).'}
                    {guideJenjangTab === 'smk' && 'Jenjang Kejuruan Vokasi: Berlaku untuk SMK / MAK dengan Program & Konsentrasi Keahlian.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownloadDocx(`master_skl_${guideJenjangTab}.docx`, `Master SKL ${guideJenjangTab.toUpperCase()}`)}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh Master Blangko Word ({guideJenjangTab.toUpperCase()})</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-800">A. Bagian Kop Surat:</h5>
                    <p className="text-[11px] text-slate-600">
                      Tuliskan nama dinas pendidikan provinsi/kabupaten, nama satuan pendidikan lengkap, NPSN/NSS, alamat jalan, kecamatan, kabupaten/kota, nomor telepon, dan email sekolah.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-800">B. Bagian Biodata Siswa:</h5>
                    <p className="text-[11px] text-slate-600 font-mono">
                      Nama Lengkap: ${'{nama_lengkap}'}<br />
                      Tempat, Tgl Lahir: ${'{tempat_tanggal_lahir}'}<br />
                      NISN / NIS: ${'{nisn}'} / ${'{nipd}'}<br />
                      {guideJenjangTab === 'smk' ? 'Program Keahlian: ${jurusan}' : 'Kelas: ${kelas}'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: UJI PREVIEW (GAMBAR 4 image_66afc3ae.png)                        */}
      {/* ========================================================================= */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[95vh] flex flex-col border border-slate-300 overflow-hidden">
            {/* Modal Top Bar */}
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <h4 className="font-bold text-xs sm:text-sm text-white truncate max-w-md">
                  {previewDocTitle}
                </h4>
                <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded text-[10px] font-mono">
                  SKL
                </span>
                <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-[10px] font-mono">
                  SEMUA
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Data toggle */}
                <div className="bg-slate-800 p-0.5 rounded-lg flex items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('data_nyata')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                      previewMode === 'data_nyata' ? 'bg-[#0284c7] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <User className="w-3 h-3" />
                    <span>Data Siswa Nyata</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('tag_asli')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                      previewMode === 'tag_asli' ? 'bg-[#0284c7] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <FileCode className="w-3 h-3" />
                    <span>Format Tag Asli</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadDocx('preview_skl_smkn_dander.docx', previewDocTitle)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <Download className="w-3 h-3" />
                  <span>Unduh .docx</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification subbar */}
            <div className="px-4 py-2 bg-slate-800 text-[11px] text-slate-300 border-b border-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-400" />
                <span>Menampilkan format dengan data sampel siswa: <strong>SISWA CONTOH</strong> (NISN: 0000000000, Kelas: X TSM 1).</span>
              </span>
              <span className="text-[10px] text-slate-400">Melihat langsung di layar peramban (tanpa mendownload berkas)</span>
            </div>

            {/* Document Sheet Simulation Body */}
            <div className="flex-1 bg-slate-700/50 overflow-y-auto p-4 sm:p-8 flex justify-center">
              <div className="bg-white shadow-2xl border border-slate-300 max-w-[210mm] w-full p-10 text-slate-900 font-sans text-xs space-y-5">
                {/* Kop Surat SMKN DANDER */}
                <div className="border-b-2 border-black pb-3 flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center shrink-0">
                    <img
                      src={schoolSettings.logoUrl || asset('/assets/logo-smkn-dander.png')}
                      alt="Logo SMKN DANDER"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="flex-1 text-center font-serif">
                    <p className="text-[11px] tracking-wider font-semibold">DINAS PENDIDIKAN PROVINSI JAWA TIMUR</p>
                    <h3 className="font-bold text-sm tracking-wide text-black uppercase">SMKN DANDER</h3>
                    <p className="text-[10px] italic">BIDANG KEAHLIAN TEKNOLOGI DAN REKAYASA</p>
                    <p className="text-[9.5px] text-slate-600">Alamat: Jl. KHR. Moh Rosyid Desa Sumbertlaseh Kec. Dander Bojonegoro</p>
                    <p className="text-[9px] text-slate-600">NPSN: 20541259 • NSS: - • Website: smkn-dander.sch.id</p>
                  </div>
                </div>

                {/* Surat Title */}
                <div className="text-center space-y-0.5">
                  <h4 className="font-bold text-sm tracking-wider uppercase text-black underline">
                    SURAT KETERANGAN LULUS
                  </h4>
                  <p className="text-[11px] text-slate-700">Nomor : 421/001/SMK/2026</p>
                </div>

                {/* Pembuka */}
                <p className="text-xs text-justify leading-relaxed text-black">
                  {previewMode === 'data_nyata'
                    ? redaksi.sklPembuka
                    : '${kalimat_pembuka_skl}'}
                </p>

                {/* Biodata */}
                <div className="space-y-1 text-xs">
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 text-slate-700">Nama Lengkap</span>
                    <span className="col-span-8 font-bold text-black uppercase">
                      : {previewMode === 'data_nyata' ? 'SISWA CONTOH' : '${nama_lengkap}'}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 text-slate-700">Tempat, Tanggal Lahir</span>
                    <span className="col-span-8 text-black">
                      : {previewMode === 'data_nyata' ? 'BOJONEGORO, 01 Januari 2010' : '${tempat_tanggal_lahir}'}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 text-slate-700">Nomor Induk Siswa (NIS)</span>
                    <span className="col-span-8 text-black">
                      : {previewMode === 'data_nyata' ? '0000/000.000' : '${nipd}'}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 text-slate-700">Nomor Induk Siswa Nasional (NISN)</span>
                    <span className="col-span-8 text-black">
                      : {previewMode === 'data_nyata' ? '0000000000' : '${nisn}'}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 text-slate-700">Program Keahlian</span>
                    <span className="col-span-8 text-black">
                      : {previewMode === 'data_nyata' ? 'TSM' : '${jurusan}'}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 text-slate-700">Dinyatakan</span>
                    <span className="col-span-8 font-bold text-emerald-800">
                      : {previewMode === 'data_nyata' ? 'LULUS' : '${status_kelulusan}'}
                    </span>
                  </div>
                </div>

                {/* Table Mapel Sample */}
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-700">dengan rincian perolehan nilai sebagai berikut:</p>
                  <table className="w-full text-xs border-collapse border border-black">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-black p-1.5 w-10">NO</th>
                        <th className="border border-black p-1.5 text-left">MATA PELAJARAN</th>
                        <th className="border border-black p-1.5 w-28">KELOMPOK</th>
                        <th className="border border-black p-1.5 w-24">NILAI AKHIR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black p-1 text-center">1</td>
                        <td className="border border-black p-1 font-medium">Pendidikan Agama dan Budi Pekerti</td>
                        <td className="border border-black p-1 text-center">Umum</td>
                        <td className="border border-black p-1 text-center font-bold">88,50</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1 text-center">2</td>
                        <td className="border border-black p-1 font-medium">Pendidikan Pancasila</td>
                        <td className="border border-black p-1 text-center">Umum</td>
                        <td className="border border-black p-1 text-center font-bold">86,00</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1 text-center">3</td>
                        <td className="border border-black p-1 font-medium">Bahasa Indonesia</td>
                        <td className="border border-black p-1 text-center">Umum</td>
                        <td className="border border-black p-1 text-center font-bold">87,20</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1 text-center">4</td>
                        <td className="border border-black p-1 font-medium">Konsentrasi Keahlian TSM</td>
                        <td className="border border-black p-1 text-center">Kejuruan</td>
                        <td className="border border-black p-1 text-center font-bold">92,00</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={3} className="border border-black p-1.5 text-center">RATA-RATA NILAI</td>
                        <td className="border border-black p-1.5 text-center font-bold">88,42</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Penutup */}
                <p className="text-xs text-justify leading-relaxed text-black">
                  {previewMode === 'data_nyata'
                    ? redaksi.sklPenutup
                    : '${kalimat_penutup_skl}'}
                </p>

                {/* Signatures */}
                <div className="pt-6 flex justify-end text-xs font-sans">
                  <div className="w-64 text-center">
                    <p>Bojonegoro, 05 November 2026</p>
                    <p className="font-bold mb-14">Kepala Sekolah,</p>
                    <p className="font-bold underline uppercase">{schoolSettings.principalName || 'Dr. Molyono,.M.Pd'}</p>
                    <p className="text-[10px] text-slate-600 font-mono">NIP. {schoolSettings.principalNip || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-300 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Tips: Jika ada kode tag seperti <code className="bg-slate-200 text-rose-700 px-1 rounded font-mono font-bold">${'{...}'}</code> yang belum terganti, pastikan ejaannya sesuai dengan Kamus Tag di bawah.
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold cursor-pointer transition shadow-xs"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: UPLOAD FORMAT BERKAS SEKOLAH (.DOCX) - GAMBAR 5 & 6              */}
      {/* ========================================================================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col border border-slate-300 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 bg-[#0284c7] text-white flex items-center justify-between">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload Format Berkas Sekolah (.docx)</span>
              </h4>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1 text-sky-200 hover:text-white rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveUploadedFile} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Jenis Dokumen */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Jenis Dokumen *</label>
                  <select
                    value={uploadForm.docType}
                    onChange={(e) => setUploadForm({ ...uploadForm, docType: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800"
                  >
                    <option value="Surat Keterangan Lulus (SKL)">Surat Keterangan Lulus (SKL)</option>
                    <option value="Transkrip Nilai Siswa">Transkrip Nilai Siswa</option>
                    <option value="Surat Keterangan Aktif">Surat Keterangan Aktif</option>
                    <option value="Surat Keterangan Mutasi">Surat Keterangan Mutasi</option>
                    <option value="Raport Skill">Raport Skill / Pasport Vokasi</option>
                  </select>
                </div>

                {/* Jenjang */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Jenjang Pendidikan *</label>
                  <select
                    value={uploadForm.jenjang}
                    onChange={(e) => setUploadForm({ ...uploadForm, jenjang: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800"
                  >
                    <option value="SMK (Jenjang Sekolah Saat Ini)">SMK (Jenjang Sekolah Saat Ini)</option>
                    <option value="SMA">SMA</option>
                    <option value="MA">MA (Kemenag)</option>
                    <option value="SMP">SMP</option>
                    <option value="MTs">MTs (Kemenag)</option>
                    <option value="SD">SD</option>
                  </select>
                </div>
              </div>

              {/* Nama / Judul Format Berkas */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama / Judul Format Berkas *</label>
                <input
                  type="text"
                  required
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="Contoh: Format SKL Resmi (SMK)"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              {/* File Input */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Pilih File Word (.docx) Sekolah Anda *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={uploadForm.fileName || 'Pilih berkas Word (.docx)...'}
                    className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-600"
                  />
                  <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg font-bold cursor-pointer transition">
                    <span>Browse</span>
                    <input
                      type="file"
                      accept=".docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadForm((prev) => ({ ...prev, fileName: file.name }));
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-[10.5px] text-slate-500">
                  Hanya berkas format <strong className="text-slate-700">.docx</strong> (Microsoft Word). Pastikan berkas sudah disisipi tag placeholder seperti <code className="bg-slate-100 text-rose-600 px-1 py-0.5 rounded font-mono">${'{nama_lengkap}'}</code>, <code className="bg-slate-100 text-rose-600 px-1 py-0.5 rounded font-mono">${'{nisn}'}</code>, dll.
                </p>
              </div>

              {/* Catatan / Deskripsi */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Catatan / Deskripsi Format (Opsional)</label>
                <textarea
                  rows={2}
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                  placeholder="Catatan versi format berkas atau nomor edaran surat (opsional)"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              {/* Checkbox makeActive */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={uploadForm.makeActive}
                  onChange={(e) => setUploadForm({ ...uploadForm, makeActive: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <span className="font-semibold text-slate-800 text-xs">
                  Langsung jadikan sebagai format aktif untuk jenis dokumen dan jenjang ini
                </span>
              </label>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Simpan Format Berkas Sekolah</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
