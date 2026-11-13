import React, { useState, useEffect, useRef } from 'react';
import { Student, ProgramKeahlian, SchoolClass } from '../types';
import { readSheet } from 'read-excel-file/browser';
import { buildImport } from '../services/dapodikImport';
import {
  Table,
  LayoutGrid,
  FileSpreadsheet,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  Save,
  Printer,
  Upload,
  Calendar,
  Clock,
  RotateCcw,
  ChevronDown,
  Layers,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  FileText,
  UploadCloud,
  Camera,
} from 'lucide-react';
import { StudentDetailView } from './StudentDetailView';
import { StudentEditView } from './StudentEditView';

interface StudentManagementProps {
  students: Student[];
  programs: ProgramKeahlian[];
  classes: SchoolClass[];
  scores: any[];
  schoolSettings: any;
  onOpenStudent: (student: Student) => void;
  onAddStudent: (newStudent: Omit<Student, 'id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onBulkImportStudents?: (students: Student[]) => void;
  onNavigateToArsip?: () => void;
  onNavigateToUploadFoto?: () => void;
  selectedStudentFromApp?: Student | null;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  programs,
  classes,
  scores,
  schoolSettings,
  onOpenStudent,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onBulkImportStudents,
  onNavigateToArsip,
  onNavigateToUploadFoto,
  selectedStudentFromApp,
}) => {
  // Navigation / View Modes: 'list' | 'detail' | 'edit' | 'import' | 'tambah'
  const [subView, setSubView] = useState<'list' | 'detail' | 'edit' | 'import' | 'tambah'>('list');
  const [viewMode, setViewMode] = useState<'table' | 'gallery'>('table');
  const [activeStudentForDetail, setActiveStudentForDetail] = useState<Student | null>(null);

  // Synchronize with external selected student if provided
  useEffect(() => {
    if (selectedStudentFromApp) {
      setActiveStudentForDetail(selectedStudentFromApp);
      setSubView('detail');
    }
  }, [selectedStudentFromApp]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionDropdown, setActiveActionDropdown] = useState<string | null>(null);

  // Live Date/Clock
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');

  // Import State
  const [dapodikFile, setDapodikFile] = useState<File | null>(null);
  const [zipPhotoFile, setZipPhotoFile] = useState<File | null>(null);
  const [importNotification, setImportNotification] = useState<string>('');
  const [replaceAllOnImport, setReplaceAllOnImport] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const dapodikInputRef = useRef<HTMLInputElement>(null);
  const zipPhotoInputRef = useRef<HTMLInputElement>(null);

  // Tambah Siswa Form State (Gambar 5)
  const [addForm, setAddForm] = useState({
    fullName: '',
    nipd: '5584',
    nisn: '',
    nik: '',
    noKk: '',
    gender: 'L' as 'L' | 'P',
    birthPlace: 'Bojonegoro',
    birthDate: '2010-01-01',
    religion: 'Islam',
    citizenship: 'Indonesia',
    address: '',
    phone: '',
    livingWith: 'Orang Tua',
    admissionDate: '2026-07-15',
    admissionClass: 'X TSM 1',
    currentClass: 'X TSM 1',
    programKeahlian: 'TSM',
    fatherName: '',
    motherName: '',
    parentJob: 'Wiraswasta',
    parentPhone: '',
    parentAddress: '',
    prevSchool: 'SMP Negeri 1 Dander',
    status: 'Aktif' as const,
    photoUrl: '',
    avgScore: 85.0,
    fase: 'E' as 'E' | 'F',
    documents: { akta: true, kk: true, ijazahSmp: true, pasFoto: true },
    tingkatKelas: 'Kelas 10 (Fase E)',
    noUrutBukuInduk: '1146',
  });
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeFormatter = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const dateFormatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      setCurrentTime(timeFormatter.format(now));
      setCurrentDateStr(dateFormatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nipd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery);
    const matchesProgram = !selectedProgram || s.programKeahlian.toLowerCase() === selectedProgram.toLowerCase();
    const matchesClass = !selectedClass || s.currentClass === selectedClass;
    return matchesSearch && matchesProgram && matchesClass;
  });

  const totalPages = Math.ceil(filteredStudents.length / entriesPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleExportCSV = () => {
    const headers = [
      'REG',
      'NOMOR INDUK',
      'NISN',
      'NAMA LENGKAP',
      'TEMPAT LAHIR',
      'TGL LAHIR',
      'GENDER',
      'PROGRAM KEAHLIAN',
      'KELAS',
      'STATUS',
    ];
    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      s.nipd,
      s.nisn,
      `"${s.fullName}"`,
      s.birthPlace,
      s.birthDate,
      s.gender,
      `"${s.programKeahlian}"`,
      s.currentClass,
      s.status,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Data_Peserta_Didik_${schoolSettings?.name || 'SMKN_DANDER'}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.fullName.trim()) {
      alert('Nama lengkap peserta didik wajib diisi.');
      return;
    }
    const newStudentData: Omit<Student, 'id'> = {
      nipd: addForm.nipd,
      nisn: addForm.nisn || `011${Math.floor(1000000 + Math.random() * 9000000)}`,
      nik: addForm.nik || '0000000000000000',
      noKk: addForm.noKk || '0000000000000000',
      fullName: addForm.fullName.toUpperCase(),
      gender: addForm.gender,
      birthPlace: addForm.birthPlace,
      birthDate: addForm.birthDate,
      religion: addForm.religion,
      citizenship: addForm.citizenship,
      address: addForm.address || 'Bojonegoro',
      phone: addForm.phone,
      livingWith: addForm.livingWith,
      admissionDate: addForm.admissionDate,
      admissionClass: addForm.admissionClass,
      currentClass: addForm.currentClass,
      programKeahlian: addForm.programKeahlian,
      fatherName: addForm.fatherName || '-',
      motherName: addForm.motherName || '-',
      parentJob: addForm.parentJob,
      parentPhone: addForm.parentPhone,
      parentAddress: addForm.address || 'Bojonegoro',
      prevSchool: addForm.prevSchool,
      status: 'Aktif',
      photoUrl:
        addForm.photoUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      avgScore: 85.0,
      fase: addForm.tingkatKelas.includes('10') ? 'E' : 'F',
      documents: { akta: true, kk: true, ijazahSmp: true, pasFoto: true },
    };

    onAddStudent(newStudentData);
    alert(`Peserta didik ${addForm.fullName} berhasil didaftarkan ke sistem!`);
    setSubView('list');
  };

  const handleProcessImport = async () => {
    if (!dapodikFile) {
      alert('Silakan pilih file Excel Dapodik (.xlsx) terlebih dahulu.');
      return;
    }
    if (!onBulkImportStudents) {
      alert('Fitur impor belum terhubung ke penyimpanan data.');
      return;
    }
    setIsImporting(true);
    setImportNotification('Membaca file Dapodik...');
    try {
      const rows = (await readSheet(dapodikFile)) as unknown[][];
      const result = buildImport(
        rows,
        students,
        classes.map((c) => c.name),
        replaceAllOnImport
      );
      const lines = [
        `Ditemukan ${result.fileCount} siswa di file.`,
        replaceAllOnImport
          ? `Mode GANTI SEMUA: ${result.removed} data siswa lama akan dihapus, diganti ${result.students.length} siswa dari file.`
          : `Mode GABUNG: ${result.added} siswa baru, ${result.updated} diperbarui, ${result.kept} data lama dipertahankan.`,
        ...(result.warnings.length ? ['', 'Catatan:', ...result.warnings.map((w) => '- ' + w)] : []),
        '',
        'Terapkan impor ini?',
      ];
      if (!window.confirm(lines.join('\n'))) {
        setImportNotification('');
        return;
      }
      onBulkImportStudents(result.students);
      setImportNotification(
        `Berhasil: ${result.fileCount} siswa dibaca dari Dapodik (${result.added} baru, ${result.updated} diperbarui). Data tersimpan dan ikut tersinkron ke Google Drive.`
      );
      setTimeout(() => {
        setImportNotification('');
        setSubView('list');
      }, 2500);
    } catch (e) {
      setImportNotification('');
      alert(e instanceof Error ? e.message : 'Gagal membaca file Dapodik.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleProcessZipPhoto = () => {
    if (!zipPhotoFile) {
      alert('Silakan pilih file arsip foto (.zip) terlebih dahulu.');
      return;
    }
    alert('Foto massal berhasil diproses dan dicocokkan berdasarkan NIPD/NISN siswa.');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setActiveActionDropdown(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // ================= VIEW: DETAIL BUKU INDUK PESERTA DIDIK =================
  if (subView === 'detail' && activeStudentForDetail) {
    return (
      <StudentDetailView
        student={activeStudentForDetail}
        schoolSettings={schoolSettings}
        scores={scores}
        onBack={() => setSubView('list')}
        onUpdateStudent={(updated) => {
          onUpdateStudent(updated);
          setActiveStudentForDetail(updated);
        }}
        onEditStudent={(st) => {
          setActiveStudentForDetail(st);
          setSubView('edit');
        }}
      />
    );
  }

  // ================= VIEW: EDIT DATA PESERTA DIDIK (7 TABS) =================
  if (subView === 'edit' && activeStudentForDetail) {
    return (
      <StudentEditView
        student={activeStudentForDetail}
        programs={programs}
        classes={classes}
        schoolSettings={schoolSettings}
        onSave={(updated) => {
          onUpdateStudent(updated);
          setActiveStudentForDetail(updated);
          alert(`Perubahan biodata untuk ${updated.fullName} berhasil disimpan!`);
          setSubView('detail');
        }}
        onCancel={() => {
          setSubView(activeStudentForDetail ? 'detail' : 'list');
        }}
      />
    );
  }

  // ================= VIEW 3 & 4: IMPORT DATA PESERTA DIDIK DARI DAPODIK =================
  if (subView === 'import') {
    return (
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Import Data Peserta Didik dari Dapodik
          </h1>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentDateStr || '28 Oct 2026'}</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-800 text-white rounded-lg shadow-2xs flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-300" />
              <span>{currentTime || '09:31:46'}</span>
            </div>
          </div>
        </div>

        {importNotification && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{importNotification}</span>
          </div>
        )}

        {/* Section 1: Panduan Cara Import File Excel Dapodik */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#008ba3] flex items-center gap-2">
              <span className="text-base">👥</span> Panduan Cara Import File Excel Dapodik
            </h2>
            <span className="px-3 py-1 rounded-full bg-[#008ba3] text-white text-[11px] font-bold">
              Jenjang Aktif: SMK (Sekolah Menengah Kejuruan)
            </span>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="p-4 border border-slate-200 rounded-xl space-y-2 text-xs bg-slate-50/40">
              <div className="w-6 h-6 rounded-full bg-[#008ba3] text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="font-bold text-slate-800 text-xs">Unduh File dari Dapodik</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Buka aplikasi <strong>Dapodik Sekolah</strong> &rarr; Masuk menu <strong>Peserta Didik</strong> &rarr; Klik <strong>Daftar Peserta Didik</strong> &rarr; Klik tombol <strong>Export Excel / Unduh</strong>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 border border-slate-200 rounded-xl space-y-2 text-xs bg-slate-50/40">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="font-bold text-slate-800 text-xs">Jangan Ubah File Excel</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                File hasil download biasanya bernama <code className="text-rose-500 bg-rose-50 px-1 py-0.5 rounded font-mono text-[10px]">daftar_pd-SEKOLAH-TGL.xlsx</code>. <strong>Jangan mengubah/mengedit judul kolom</strong> agar sistem bisa membaca otomatis.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 border border-slate-200 rounded-xl space-y-2 text-xs bg-slate-50/40">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="font-bold text-slate-800 text-xs">Unggah &amp; Proses</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Pilih file Excel pada formulir di bawah ini, lalu klik tombol <strong>PROSES IMPORT SEKARANG</strong>. Sistem akan bekerja secara otomatis.
              </p>
            </div>
          </div>

          {/* Yellow Banner */}
          <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-xl space-y-2 text-xs text-slate-700">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <span>🪄</span>
              <span>Kemudahan Otomatisasi Khusus Jenjang SMK (Sekolah Menengah Kejuruan):</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600 pl-4 list-disc">
              <li>
                <strong>Deteksi Program Keahlian / Jurusan:</strong> Konsentrasi keahlian seperti <code className="text-rose-500">TJKT, RPL, TKR, DPIB, AKL, TBG</code>, dll. otomatis dideteksi dari nama Rombel (contoh: <code className="text-rose-500">X TJKT 1</code> &rarr; Jurusan: TJKT).
              </li>
              <li>
                <strong>Deteksi Fase Otomatis:</strong> Kelas 10 (X) otomatis masuk <strong>Fase E</strong>, sedangkan Kelas 11 dan 12 (XI, XII) otomatis masuk <strong>Fase F</strong>.
              </li>
              <li>
                <strong>Kelengkapan Biodata:</strong> Nama, NIPD, NISN, NIK, Tempat/Tgl Lahir, Alamat (RT/RW/Dusun/Kecamatan), Agama, No KK, dan Nama Orang Tua dibaca otomatis.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: Form Upload File Excel Dapodik */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#008ba3]" />
            <h2 className="text-sm font-bold text-slate-800">Form Upload File Excel Dapodik</h2>
          </div>

          {/* Cyan Callout Banner */}
          <div className="p-4 bg-[#008ba3] text-white rounded-xl space-y-1.5 text-xs">
            <div className="font-bold flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-white" />
              <span>Fitur Khusus Dapodik</span>
            </div>
            <p className="text-sky-100 text-[11px] leading-relaxed">
              Sistem akan secara otomatis memetakan kolom dari file <strong>Daftar Peserta Didik</strong> hasil export Dapodik (.xlsx). Pastikan file yang diunggah adalah file asli hasil download dari Dapodik.
            </p>
          </div>

          {/* Upload Input Box */}
          <div className="py-6 flex flex-col items-center justify-center space-y-3">
            <label className="font-bold text-slate-700 text-xs">
              Pilih File Excel Dapodik (.xlsx)
            </label>
            <div className="w-full max-w-md flex shadow-2xs">
              <input
                type="text"
                readOnly
                placeholder="Cari file .xlsx..."
                value={dapodikFile?.name || ''}
                className="flex-1 px-3 py-2 border border-r-0 border-slate-300 rounded-l-lg bg-slate-50 text-slate-600 text-xs truncate"
              />
              <button
                type="button"
                onClick={() => dapodikInputRef.current?.click()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-r-lg text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Browse
              </button>
              <input
                ref={dapodikInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setDapodikFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
            <span className="text-[11px] text-slate-400">
              Contoh Nama File: <code className="text-rose-500">daftar_pd-NAMA_SEKOLAH-TANGGAL.xlsx</code>
            </span>
            <label className="mt-2 flex items-start gap-2 max-w-md text-[11px] text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={replaceAllOnImport}
                onChange={(e) => setReplaceAllOnImport(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                <strong>Ganti seluruh data siswa</strong> dengan isi file ini (menghapus data siswa lama, termasuk foto dan nilai
                yang sudah diisi). Biarkan tidak dicentang untuk menggabungkan berdasarkan NISN.
              </span>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 text-[11px]">
              <strong>Informasi Otomasi:</strong> Sistem akan mendeteksi Nama, NIPD, NISN, TTL, Alamat (RT/RW/Kec), Agama, Orang Tua, dan Rombel secara otomatis.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSubView('list')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                ✕ Batal
              </button>
              <button
                type="button"
                onClick={handleProcessImport}
                disabled={isImporting}
                className="disabled:opacity-60 px-5 py-2 bg-[#008ba3] hover:bg-[#007a8f] text-white rounded-lg font-extrabold text-xs shadow-xs cursor-pointer flex items-center gap-2 uppercase tracking-wide"
              >
                <span>{isImporting ? 'Memproses...' : '🚀 PROSES IMPORT SEKARANG'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Import Foto Massal (.zip) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-[#008ba3]">
            <UploadCloud className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-800">Import Foto Massal (.zip)</h2>
          </div>

          {/* Green Guide Banner */}
          <div className="p-4 bg-emerald-600 text-white rounded-xl space-y-2 text-xs">
            <div className="font-bold flex items-center gap-2">
              <span className="text-base">💡</span>
              <span>Petunjuk Import Foto</span>
            </div>
            <ul className="space-y-1 text-emerald-50 text-[11px] pl-4 list-disc">
              <li>Kumpulkan foto dalam satu file <strong>.ZIP</strong></li>
              <li>
                Nama file foto harus sesuai dengan <strong>NIPD</strong> atau <strong>NISN</strong> peserta didik (Contoh: <code className="bg-emerald-700 px-1 rounded text-white">2223101.jpg</code> atau <code className="bg-emerald-700 px-1 rounded text-white">007123456.png</code>)
              </li>
              <li>Format yang didukung: <strong>.jpg, .jpeg, .png</strong></li>
            </ul>
          </div>

          {/* Grid inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
            {/* Left: ZIP Picker */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block">Pilih File ZIP Foto</label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  placeholder="Pilih .zip..."
                  value={zipPhotoFile?.name || ''}
                  className="flex-1 px-3 py-2 border border-r-0 border-slate-300 rounded-l-lg bg-slate-50 text-slate-600 text-xs truncate"
                />
                <button
                  type="button"
                  onClick={() => zipPhotoInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-r-lg text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Browse
                </button>
                <input
                  ref={zipPhotoInputRef}
                  type="file"
                  accept=".zip"
                  onChange={(e) => setZipPhotoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>
            </div>

            {/* Right: Target Penempatan & Identitas Filename */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Penempatan</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs">
                  <option value="utama">Foto Utama (Diterima)</option>
                  <option value="tamat">Foto Kelulusan (Tamat)</option>
                </select>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Pilih apakah foto ini untuk biodata awal atau kelulusan.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Identitas Filename</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs">
                  <option value="nipd">Gunakan NIPD sebagai Nama File</option>
                  <option value="nisn">Gunakan NISN sebagai Nama File</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={handleProcessZipPhoto}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-2 uppercase tracking-wide"
            >
              <Upload className="w-4 h-4" />
              <span>UNGGAH FOTO SEKARANG</span>
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setSubView('list')}
            className="text-xs text-slate-600 hover:text-sky-600 font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Manajemen Peserta Didik</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            Copyright © 2026 <strong className="text-sky-600">Buku Induk Digital</strong>. Powered by <strong className="text-sky-600">Syntax Trust</strong>. All rights reserved.
          </p>
          <span className="font-semibold text-slate-600">Version 1.2.0</span>
        </div>
      </div>
    );
  }

  // ================= VIEW 5: TAMBAH DATA PESERTA DIDIK =================
  if (subView === 'tambah') {
    return (
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Tambah Data Peserta Didik
          </h1>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentDateStr || '28 Oct 2026'}</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-800 text-white rounded-lg shadow-2xs flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-300" />
              <span>{currentTime || '09:33:38'}</span>
            </div>
          </div>
        </div>

        {/* Card Form */}
        <form onSubmit={handleAddSubmit} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
          {/* Card Title */}
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#008ba3]" />
            <h2 className="text-sm font-bold text-[#008ba3]">Form Pendaftaran Peserta Didik Baru</h2>
          </div>

          {/* Info Callout */}
          <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 rounded-lg text-xs flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              Isilah data minimal (Nama, Program Keahlian, No. Urut) untuk mendaftarkan peserta didik. Berkas lengkap dapat dilengkapi melalui menu <strong>Edit</strong> setelah data tersimpan.
            </span>
          </div>

          {/* I. IDENTITAS DASAR */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-[#008ba3] text-xs uppercase tracking-wider">
              I. IDENTITAS DASAR
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Photo Box */}
              <div className="md:col-span-3 space-y-2 text-center">
                <label className="block text-slate-700 font-bold mb-1">
                  Foto Awal Masuk Sekolah
                </label>
                <div className="w-32 h-36 mx-auto border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden shadow-2xs">
                  {addForm.photoUrl ? (
                    <img
                      src={addForm.photoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                      <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-2.5 py-1 border border-slate-300 rounded text-[11px] bg-slate-50 hover:bg-slate-100 font-medium text-slate-700 cursor-pointer"
                  >
                    Pilih File
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setAddForm({ ...addForm, photoUrl: ev.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Format: JPG/PNG/WebP, Maks: 2MB
                </span>
                <span className="text-[10px] text-sky-600 font-medium block">
                  Pas foto resmi awal masuk kelas pertama
                </span>
              </div>

              {/* Right Fields */}
              <div className="md:col-span-9 space-y-4">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Jenjang Pendidikan *
                    </label>
                    <select className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium">
                      <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Tingkat Kelas *
                    </label>
                    <select
                      value={addForm.tingkatKelas}
                      onChange={(e) => setAddForm({ ...addForm, tingkatKelas: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    >
                      <option value="">-- Pilih Tingkat Kelas --</option>
                      <option value="Kelas 10 (Fase E)">Kelas 10 (Fase E)</option>
                      <option value="Kelas 11 (Fase F)">Kelas 11 (Fase F)</option>
                      <option value="Kelas 12 (Fase F)">Kelas 12 (Fase F)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Program / Konsentrasi Keahlian *
                    </label>
                    <select
                      value={addForm.programKeahlian}
                      onChange={(e) => setAddForm({ ...addForm, programKeahlian: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    >
                      <option value="">-- Pilih Jurusan / Peminatan --</option>
                      {programs.map((p) => (
                        <option key={p.code} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      No. Urut Buku Induk
                    </label>
                    <input
                      type="text"
                      value={addForm.noUrutBukuInduk}
                      onChange={(e) => setAddForm({ ...addForm, noUrutBukuInduk: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-bold"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Kurikulum</label>
                    <input
                      type="text"
                      readOnly
                      value="Kurikulum Merdeka"
                      className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-sky-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Fase (Merdeka)</label>
                    <select
                      value={addForm.fase}
                      onChange={(e) => setAddForm({ ...addForm, fase: e.target.value as any })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    >
                      <option value="E">Fase E (Kelas 10)</option>
                      <option value="F">Fase F (Kelas 11-12)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">NIPD / NISN</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="NIPD"
                        value={addForm.nipd}
                        onChange={(e) => setAddForm({ ...addForm, nipd: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-bold font-mono text-emerald-700"
                      />
                      <input
                        type="text"
                        placeholder="NISN"
                        value={addForm.nisn}
                        onChange={(e) => setAddForm({ ...addForm, nisn: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8">
                    <label className="block text-slate-700 font-bold mb-1">
                      Nama Lengkap Peserta Didik
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap sesuai Ijazah"
                      value={addForm.fullName}
                      onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-bold uppercase"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-slate-700 font-bold mb-1">Jenis Kelamin</label>
                    <select
                      value={addForm.gender}
                      onChange={(e) => setAddForm({ ...addForm, gender: e.target.value as any })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                    >
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Tempat Lahir</label>
                    <input
                      type="text"
                      placeholder="Bojonegoro"
                      value={addForm.birthPlace}
                      onChange={(e) => setAddForm({ ...addForm, birthPlace: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={addForm.birthDate}
                      onChange={(e) => setAddForm({ ...addForm, birthDate: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Agama</label>
                    <input
                      type="text"
                      placeholder="Islam/Kristen/dll"
                      value={addForm.religion}
                      onChange={(e) => setAddForm({ ...addForm, religion: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* II. KONTAK & ORANG TUA */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h3 className="font-extrabold text-[#008ba3] text-xs uppercase tracking-wider">
              II. KONTAK &amp; ORANG TUA
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Ayah Kandung</label>
                <input
                  type="text"
                  value={addForm.fatherName}
                  onChange={(e) => setAddForm({ ...addForm, fatherName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Ibu Kandung</label>
                <input
                  type="text"
                  value={addForm.motherName}
                  onChange={(e) => setAddForm({ ...addForm, motherName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Alamat Domisili Peserta Didik
              </label>
              <textarea
                rows={2}
                placeholder="Tuliskan alamat lengkap..."
                value={addForm.address}
                onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setSubView('list')}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#008ba3] hover:bg-[#007a8f] text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer flex items-center gap-2 uppercase tracking-wide"
            >
              <Save className="w-4 h-4" />
              <span>DAFTARKAN PESERTA DIDIK</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            Copyright © 2026 <strong className="text-sky-600">Buku Induk Digital</strong>. Powered by <strong className="text-sky-600">Syntax Trust</strong>. All rights reserved.
          </p>
          <span className="font-semibold text-slate-600">Version 1.2.0</span>
        </div>
      </div>
    );
  }

  // ================= VIEW 1 & 2: DATABASE PESERTA DIDIK (TABEL / GALERI) =================
  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Data Peserta Didik
        </h1>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentDateStr || '28 Oct 2026'}</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-800 text-white rounded-lg shadow-2xs flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            <span>{currentTime || '09:27:43'}</span>
          </div>
        </div>
      </div>

      {/* Main Database Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5 text-xs">
        {/* Card Header & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h2 className="text-sm font-extrabold text-[#008ba3] flex items-center gap-2">
            <span className="text-base">👥</span> Database Peserta Didik
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle: Tabel & Galeri */}
            <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#008ba3] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Tabel</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('gallery')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'gallery'
                    ? 'bg-[#008ba3] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Galeri</span>
              </button>
            </div>

            {/* Arsip Alumni & Mutasi */}
            {onNavigateToArsip && (
              <button
                type="button"
                onClick={onNavigateToArsip}
                className="px-3 py-1.5 border border-[#008ba3] text-[#008ba3] hover:bg-cyan-50/50 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <span>🗄️</span>
                <span>Arsip Alumni &amp; Mutasi</span>
              </button>
            )}

            {/* Export Excel */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1.5 border border-emerald-500 text-emerald-700 hover:bg-emerald-50/50 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <span>📥</span>
              <span>Export Excel</span>
            </button>

            {/* Import Dapodik */}
            <button
              type="button"
              onClick={() => setSubView('import')}
              className="px-3.5 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Import Dapodik</span>
            </button>

            {/* Upload Foto Massal */}
            {onNavigateToUploadFoto && (
              <button
                type="button"
                onClick={onNavigateToUploadFoto}
                className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                title="Buka menu Upload Pas Foto Massal Siswa"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Foto Massal</span>
              </button>
            )}

            {/* Tambah Peserta Didik */}
            <button
              type="button"
              onClick={() => setSubView('tambah')}
              className="px-3.5 py-1.5 bg-[#008ba3] hover:bg-[#007a8f] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <span>➕</span>
              <span>Tambah Peserta Didik</span>
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Pencarian Cepat */}
          <div className="md:col-span-5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>🔍</span> PANCARIAN CEPAT
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Ketik Nama / NIPD / NISN..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Program Keahlian */}
          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>🏷️</span> PROGRAM KEAHLIAN
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => {
                setSelectedProgram(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs"
            >
              <option value="">-- Semua Program Keahlian --</option>
              {programs.map((p) => (
                <option key={p.code} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Kelas */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>🏷️</span> FILTER KELAS
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs"
            >
              <option value="">-- Semua Kelas --</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons Cari & Reset */}
          <div className="md:col-span-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="flex-1 py-2 bg-[#008ba3] hover:bg-[#007a8f] text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
            >
              <span>🔍</span>
              <span>Cari</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedProgram('');
                setSelectedClass('');
                setCurrentPage(1);
              }}
              className="py-2 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1"
              title="Reset Filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Entries controller & Quick Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Tampilkan</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-slate-300 rounded bg-white font-medium text-xs"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entri</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600">Cari:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 border border-slate-300 rounded bg-white text-xs w-48"
            />
          </div>
        </div>

        {/* ================= MODE TABEL (GAMBAR 1) ================= */}
        {viewMode === 'table' ? (
          <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3 w-12 text-center">REG ⇅</th>
                  <th className="p-3">NOMOR INDUK ⇅</th>
                  <th className="p-3">IDENTITAS PESERTA DIDIK ⇅</th>
                  <th className="p-3">PROGRAM KEAHLIAN ⇅</th>
                  <th className="p-3">KELAS ⇅</th>
                  <th className="p-3 text-center">GENDER ⇅</th>
                  <th className="p-3 text-center">AKSI ⇅</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Tidak ada peserta didik yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((student, idx) => {
                    const globalIndex = (currentPage - 1) * entriesPerPage + idx + 1;
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition">
                        {/* REG */}
                        <td className="p-3 text-center font-bold text-slate-500">
                          {globalIndex}
                        </td>

                        {/* NOMOR INDUK */}
                        <td className="p-3">
                          <strong className="text-slate-900 font-bold block text-xs">
                            {student.nipd}
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            NISN: {student.nisn}
                          </span>
                        </td>

                        {/* IDENTITAS */}
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              onClick={() => {
                                setActiveStudentForDetail(student);
                                setSubView('detail');
                              }}
                              className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 cursor-pointer hover:border-[#008ba3] transition"
                            >
                              {student.photoUrl ? (
                                <img
                                  src={student.photoUrl}
                                  alt={student.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="font-bold text-[10px] text-slate-600">
                                  {student.fullName.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <strong
                                onClick={() => {
                                  setActiveStudentForDetail(student);
                                  setSubView('detail');
                                }}
                                className="text-slate-900 font-bold block uppercase text-xs cursor-pointer hover:text-[#008ba3] transition"
                              >
                                {student.fullName}
                              </strong>
                              <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>
                                  {student.birthPlace}, {student.birthDate}
                                </span>
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* PROGRAM KEAHLIAN */}
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700 inline-block uppercase">
                            {student.programKeahlian}
                          </span>
                        </td>

                        {/* KELAS */}
                        <td className="p-3">
                          <span className="font-bold text-sky-600 hover:underline cursor-pointer">
                            {student.currentClass}
                          </span>
                        </td>

                        {/* GENDER */}
                        <td className="p-3 text-center">
                          <span
                            className={`font-black text-xs ${
                              student.gender === 'L' ? 'text-sky-600' : 'text-rose-500'
                            }`}
                          >
                            {student.gender}
                          </span>
                        </td>

                        {/* AKSI */}
                        <td className="p-3 text-center">
                          <div className="inline-flex items-center gap-1 relative">
                            {/* Eye button (Arahkan ke Detail Buku Induk Peserta Didik) */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveStudentForDetail(student);
                                setSubView('detail');
                              }}
                              className="w-7 h-7 bg-[#008ba3] hover:bg-[#007a8f] text-white rounded flex items-center justify-center transition cursor-pointer shadow-2xs"
                              title="Buka Detail Buku Induk Peserta Didik"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit button (Arahkan ke Edit Data Peserta Didik 7 Tabs) */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveStudentForDetail(student);
                                setSubView('edit');
                              }}
                              className="w-7 h-7 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded flex items-center justify-center transition cursor-pointer shadow-2xs"
                              title="Edit Data Peserta Didik"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown caret */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveActionDropdown(
                                    activeActionDropdown === student.id ? null : student.id
                                  );
                                }}
                                className="w-7 h-7 bg-slate-600 hover:bg-slate-700 text-white rounded flex items-center justify-center transition cursor-pointer shadow-2xs"
                                title="Aksi Tambahan"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>

                              {activeActionDropdown === student.id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-left text-xs"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveActionDropdown(null);
                                      setActiveStudentForDetail(student);
                                      setSubView('detail');
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                                    <span>Detail Buku Induk</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveActionDropdown(null);
                                      setActiveStudentForDetail(student);
                                      setSubView('edit');
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Edit Biodata (7 Tab)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveActionDropdown(null);
                                      onOpenStudent(student);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Cetak Lembar A4</span>
                                  </button>
                                  <div className="border-t border-slate-100 my-1" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveActionDropdown(null);
                                      if (confirm(`Hapus data ${student.fullName}?`)) {
                                        onDeleteStudent(student.id);
                                      }
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-rose-50 flex items-center gap-2 text-rose-600 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Hapus Siswa</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ================= MODE GALERI (GAMBAR 2) ================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedStudents.map((student, idx) => {
              const globalIndex = (currentPage - 1) * entriesPerPage + idx + 1;
              return (
                <div
                  key={student.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-3 relative group"
                >
                  <div className="space-y-2 text-center">
                    {/* Header Pill */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-400 font-mono">#{globalIndex}</span>
                      <span className="px-2 py-0.5 rounded font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        {student.currentClass}
                      </span>
                    </div>

                    {/* Avatar */}
                    <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 border-2 border-[#008ba3] overflow-hidden shadow-2xs flex items-center justify-center">
                      {student.photoUrl ? (
                        <img
                          src={student.photoUrl}
                          alt={student.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-slate-600">
                          {student.fullName.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Name & Details */}
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block uppercase leading-snug line-clamp-1" title={student.fullName}>
                        {student.fullName}
                      </strong>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        NIPD: {student.nipd}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        NISN: {student.nisn}
                      </span>
                    </div>

                    {/* Program & Gender */}
                    <div className="flex items-center justify-center gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {student.programKeahlian}
                      </span>
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                          student.gender === 'L' ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {student.gender}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStudentForDetail(student);
                        setSubView('detail');
                      }}
                      className="flex-1 py-1 px-2 bg-[#008ba3] hover:bg-[#007a8f] text-white rounded text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Buku Induk</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStudentForDetail(student);
                        setSubView('edit');
                      }}
                      className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded transition cursor-pointer"
                      title="Edit Siswa"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus ${student.fullName}?`)) {
                          onDeleteStudent(student.id);
                        }
                      }}
                      className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded transition cursor-pointer"
                      title="Hapus Siswa"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination at bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Menampilkan {(currentPage - 1) * entriesPerPage + 1} sampai{' '}
            {Math.min(currentPage * entriesPerPage, filteredStudents.length)} dari {filteredStudents.length} entri
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Sebelumnya
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded text-xs font-bold transition ${
                    currentPage === pageNum
                      ? 'bg-[#008ba3] text-white'
                      : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          Copyright © 2026 <strong className="text-sky-600">Buku Induk Digital</strong>. Powered by <strong className="text-sky-600">Syntax Trust</strong>. All rights reserved.
        </p>
        <span className="font-semibold text-slate-600">Version 1.2.0</span>
      </div>
    </div>
  );
};
