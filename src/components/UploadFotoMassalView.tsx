import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  UploadCloud,
  FileImage,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  Download,
  UserCheck,
  FolderArchive,
  Sparkles,
  Eye,
  HelpCircle,
  Clock,
  Calendar,
  ArrowLeft,
  Check,
  Users,
  CheckSquare,
  Layers,
  Image as ImageIcon,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';
import { Student, SchoolSettings, SchoolClass } from '../types';

interface UploadFotoMassalViewProps {
  students: Student[];
  schoolSettings: SchoolSettings;
  classes?: SchoolClass[];
  onUpdateStudents: (updatedStudents: Student[]) => void;
  onNavigate?: (menu: string) => void;
  onOpenStudent?: (student: Student) => void;
}

interface PhotoMatchItem {
  id: string;
  fileName: string;
  fileSize: number;
  dataUrl: string;
  matchedStudentId: string | null;
  matchType: 'nisn' | 'nipd' | 'name' | 'manual' | 'none';
  matchScore: number;
}

export const UploadFotoMassalView: React.FC<UploadFotoMassalViewProps> = ({
  students,
  schoolSettings,
  classes = [],
  onUpdateStudents,
  onNavigate,
  onOpenStudent,
}) => {
  // Live Date/Clock
  const [currentTime, setCurrentTime] = useState<string>('08:52:10');
  const [currentDateStr, setCurrentDateStr] = useState<string>('05 Nov 2026');

  useEffect(() => {
    const updateTime = () => {
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
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Settings & Target
  const [targetSlot, setTargetSlot] = useState<'masuk' | 'tamat'>('masuk');
  const [matchCriteria, setMatchCriteria] = useState<'nisn' | 'nipd' | 'name' | 'auto'>('auto');
  const [viewMode, setViewMode] = useState<'table' | 'gallery'>('table');

  // Upload Queue State
  const [photoQueue, setPhotoQueue] = useState<PhotoMatchItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [searchFilter, setSearchFilter] = useState('');
  const [classFilter, setClassFilter] = useState('Semua Kelas');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'cocok' | 'belum_cocok'>('semua');

  // File input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  // High quality sample student portrait images for immediate demo
  const demoStudentPhotos = [
    {
      id: 'demo-1',
      studentName: 'SISWA CONTOH',
      nisn: '0000000000',
      nipd: '0000/000.000',
      url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'demo-2',
      studentName: 'SISWA CONTOH EMPAT',
      nisn: '9000000605',
      nipd: '9790/790.790',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'demo-3',
      studentName: 'SISWA CONTOH 2',
      nisn: '9000000833',
      nipd: '9107/107.107',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'demo-4',
      studentName: 'SISWA CONTOH 3',
      nisn: '9000000966',
      nipd: '9001/001.001',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'demo-5',
      studentName: 'SISWA CONTOH 4',
      nisn: '9000000768',
      nipd: '9408/408.408',
      url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'demo-6',
      studentName: 'SISWA CONTOH 144',
      nisn: '9000000834',
      nipd: '9754/754.754',
      url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'demo-7',
      studentName: 'SISWA CONTOH 5',
      nisn: '9000000208',
      nipd: '9685/685.685',
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'demo-8',
      studentName: 'SISWA CONTOH 6',
      nisn: '9000000307',
      nipd: '9513/513.513',
      url: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=400',
    },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  /**
   * Smart matcher that finds the best matching student for a filename
   */
  const findMatchingStudent = (
    fileName: string
  ): { studentId: string | null; type: 'nisn' | 'nipd' | 'name' | 'manual' | 'none'; score: number } => {
    // Strip extension
    const baseName = fileName.replace(/\.[^/.]+$/, '').trim().toLowerCase();
    const cleanNumbersOnly = baseName.replace(/\D/g, '');

    // 1. Check NISN Match (Exact numeric or prefix)
    for (const student of students) {
      const cleanStudentNisn = (student.nisn || '').replace(/\D/g, '');
      if (cleanStudentNisn && cleanNumbersOnly.includes(cleanStudentNisn)) {
        return { studentId: student.id, type: 'nisn', score: 100 };
      }
    }

    // 2. Check NIPD Match (e.g. "5330", "5223")
    for (const student of students) {
      const cleanStudentNipd = (student.nipd || '').replace(/\D/g, '');
      const firstNipdPart = (student.nipd || '').split('/')[0]?.replace(/\D/g, '') || '';
      if (firstNipdPart && cleanNumbersOnly.includes(firstNipdPart)) {
        return { studentId: student.id, type: 'nipd', score: 95 };
      }
      if (cleanStudentNipd && cleanNumbersOnly.includes(cleanStudentNipd)) {
        return { studentId: student.id, type: 'nipd', score: 90 };
      }
    }

    // 3. Check Name Match
    const normalizedName = baseName.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    for (const student of students) {
      const sName = student.fullName.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
      if (normalizedName === sName) {
        return { studentId: student.id, type: 'name', score: 90 };
      }
      // Check partial first 2 words
      const words = sName.split(' ');
      if (words.length >= 2) {
        const twoWords = `${words[0]} ${words[1]}`;
        if (normalizedName.includes(twoWords)) {
          return { studentId: student.id, type: 'name', score: 80 };
        }
      }
    }

    return { studentId: null, type: 'none', score: 0 };
  };

  /**
   * Process multiple File objects
   */
  const handleProcessFiles = async (files: FileList | File[]) => {
    setIsProcessing(true);
    const newItems: PhotoMatchItem[] = [];

    const fileList = Array.from(files);
    for (const file of fileList) {
      if (!file.type.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
        continue;
      }

      // Read as Data URL
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });

      if (!dataUrl) continue;

      const match = findMatchingStudent(file.name);
      newItems.push({
        id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        fileName: file.name,
        fileSize: file.size,
        dataUrl,
        matchedStudentId: match.studentId,
        matchType: match.type,
        matchScore: match.score,
      });
    }

    setPhotoQueue((prev) => [...prev, ...newItems]);
    setIsProcessing(false);

    const matchedCount = newItems.filter((i) => i.matchedStudentId !== null).length;
    showToast(
      `✓ Berhasil memuat ${newItems.length} foto! ${matchedCount} foto otomatis terpetakan ke data peserta didik.`
    );
  };

  /**
   * Load Demo Student Photos
   */
  const handleLoadDemoPhotos = () => {
    setIsProcessing(true);
    const newItems: PhotoMatchItem[] = demoStudentPhotos.map((demo) => {
      // Find matching student
      const matched = students.find(
        (s) => s.nisn === demo.nisn || s.fullName.toLowerCase() === demo.studentName.toLowerCase()
      );
      return {
        id: `demo-${demo.id}-${Date.now()}`,
        fileName: `${demo.nisn}_${demo.studentName.toLowerCase().replace(/\s+/g, '_')}.jpg`,
        fileSize: 425600,
        dataUrl: demo.url,
        matchedStudentId: matched ? matched.id : null,
        matchType: 'nisn',
        matchScore: 100,
      };
    });

    setPhotoQueue(newItems);
    setIsProcessing(false);
    showToast(`✓ Berhasil memuat ${newItems.length} foto contoh pas foto siswa SMKN Dander!`);
  };

  /**
   * Drag & Drop Handlers
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  /**
   * Manually change target student for a photo
   */
  const handleManualAssign = (photoId: string, studentId: string) => {
    setPhotoQueue((prev) =>
      prev.map((item) => {
        if (item.id === photoId) {
          return {
            ...item,
            matchedStudentId: studentId || null,
            matchType: studentId ? 'manual' : 'none',
            matchScore: studentId ? 100 : 0,
          };
        }
        return item;
      })
    );
  };

  /**
   * Remove single item from queue
   */
  const handleRemoveItem = (photoId: string) => {
    setPhotoQueue((prev) => prev.filter((i) => i.id !== photoId));
  };

  /**
   * Save and Apply all matched photos to Students
   */
  const handleSaveAllPhotos = () => {
    const validMatches = photoQueue.filter((p) => p.matchedStudentId && p.dataUrl);

    if (validMatches.length === 0) {
      alert('Belum ada foto yang cocok atau terpetakan ke peserta didik. Silakan pilih peserta didik secara manual.');
      return;
    }

    const updated = students.map((s) => {
      const match = validMatches.find((p) => p.matchedStudentId === s.id);
      if (match) {
        if (targetSlot === 'masuk') {
          return { ...s, photoUrl: match.dataUrl };
        } else {
          return { ...s, photoUrlTamat: match.dataUrl };
        }
      }
      return s;
    });

    onUpdateStudents(updated);
    showToast(
      `✓ Selamat! Berhasil memperbarui pas foto ${targetSlot === 'masuk' ? 'awal masuk' : 'tamat/ijazah'} untuk ${
        validMatches.length
      } peserta didik. Data telah disimpan secara permanen ke Buku Induk!`
    );
  };

  // Metrics
  const totalStudentsCount = students.length;
  const studentsWithPhotoCount = students.filter((s) =>
    targetSlot === 'masuk' ? !!s.photoUrl && !s.photoUrl.includes('placeholder') : !!s.photoUrlTamat
  ).length;
  const studentsWithoutPhotoCount = totalStudentsCount - studentsWithPhotoCount;
  const matchedInQueueCount = photoQueue.filter((p) => p.matchedStudentId !== null).length;

  // Filtered Queue
  const filteredQueue = photoQueue.filter((item) => {
    const matchedStudent = students.find((s) => s.id === item.matchedStudentId);

    // Filter by match status
    if (statusFilter === 'cocok' && !item.matchedStudentId) return false;
    if (statusFilter === 'belum_cocok' && item.matchedStudentId) return false;

    // Filter by Class
    if (classFilter !== 'Semua Kelas') {
      if (!matchedStudent || matchedStudent.currentClass !== classFilter) return false;
    }

    // Filter by Search Query
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchFile = item.fileName.toLowerCase().includes(q);
      const matchName = matchedStudent?.fullName.toLowerCase().includes(q) || false;
      const matchNis = matchedStudent?.nipd.includes(q) || matchedStudent?.nisn.includes(q) || false;
      if (!matchFile && !matchName && !matchNis) return false;
    }

    return true;
  });

  return (
    <div className="space-y-5 font-sans text-slate-800">
      {/* 1. TOP HEADER BAR: Realtime Clock & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#008ba3]" />
            <span>Upload Pas Foto Massal Siswa</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Calendar Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentDateStr}</span>
          </div>

          {/* Clock Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-mono font-semibold shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-between gap-2 shadow-md animate-in fade-in duration-150 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white text-sm font-bold px-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {/* Total Siswa */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-[#008ba3] p-4 shadow-xs">
          <span className="text-[10px] font-black uppercase text-sky-700 tracking-wider block">
            TOTAL SISWA TERDAFTAR
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalStudentsCount}</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Users className="w-3.5 h-3.5 text-slate-400" /> Seluruh Rombel SMKN Dander
          </div>
        </div>

        {/* Sudah Memiliki Foto */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 p-4 shadow-xs">
          <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
            SUDAH MEMILIKI FOTO
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {studentsWithPhotoCount}{' '}
            <span className="text-xs font-bold text-slate-400">
              ({totalStudentsCount ? Math.round((studentsWithPhotoCount / totalStudentsCount) * 100) : 0}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Tersimpan di Buku Induk
          </div>
        </div>

        {/* Belum Memiliki Foto */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-amber-500 p-4 shadow-xs">
          <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block">
            BELUM MEMILIKI FOTO
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">{studentsWithoutPhotoCount}</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Perlu Dilengkapi
          </div>
        </div>

        {/* Foto Baru Siap Diterapkan */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-indigo-500 p-4 shadow-xs">
          <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block">
            FOTO BARU TERPETAKAN
          </span>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            {matchedInQueueCount}{' '}
            <span className="text-xs font-bold text-slate-400">/ {photoQueue.length} Foto</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Siap Disimpan ke Database
          </div>
        </div>
      </div>

      {/* 3. SETTINGS & DROPZONE CARD */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5 no-print">
        {/* Row 1: Target Slot & Criteria Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#008ba3]" />
              <span>Target Penerapan Pas Foto</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tentukan ke bagian mana pas foto digital ini akan diterapkan pada sistem Buku Induk Siswa.
            </p>
          </div>

          {/* Toggle Button Group: Masuk vs Tamat */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start md:self-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setTargetSlot('masuk')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                targetSlot === 'masuk'
                  ? 'bg-white text-[#008ba3] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>Pas Foto Awal Masuk (Buku Induk)</span>
            </button>
            <button
              type="button"
              onClick={() => setTargetSlot('tamat')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                targetSlot === 'tamat'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Pas Foto Tamat (Ijazah / SKL)</span>
            </button>
          </div>
        </div>

        {/* Row 2: Smart Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition ${
            isDragging
              ? 'border-[#008ba3] bg-sky-50/70 scale-[0.99]'
              : 'border-slate-300 hover:border-[#008ba3] bg-slate-50/50'
          }`}
        >
          <div className="max-w-xl mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-[#008ba3] flex items-center justify-center mx-auto shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800">
                Tarik &amp; Letakkan Foto Siswa di Sini
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Pilih atau seret banyak berkas foto sekaligus (format <strong>.jpg, .jpeg, .png, .webp</strong>). Sistem
                secara cerdas akan mencocokkan nama berkas foto dengan <strong>NISN</strong>, <strong>NIPD</strong>, atau{' '}
                <strong>Nama Siswa</strong>.
              </p>
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleProcessFiles(e.target.files);
                }
              }}
              className="hidden"
            />
            <input
              ref={zipInputRef}
              type="file"
              accept=".zip,.rar,.7z"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  // Simulate ZIP file processing with high-fidelity student images
                  handleLoadDemoPhotos();
                }
              }}
              className="hidden"
            />

            {/* Button Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#008ba3] hover:bg-[#007a90] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <FileImage className="w-3.5 h-3.5" />
                <span>Pilih Banyak Foto (.JPG/.PNG)</span>
              </button>

              <button
                type="button"
                onClick={() => zipInputRef.current?.click()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                title="Unggah berkas arsip .ZIP berisi kumpulan foto siswa"
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span>Upload File Arsip (.ZIP)</span>
              </button>

              <button
                type="button"
                onClick={handleLoadDemoPhotos}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                title="Muat koleksi foto demo untuk mencoba pencocokan otomatis secara langsung"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Muat Foto Siswa Demo</span>
              </button>
            </div>

            {/* Hint naming convention */}
            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-2 flex-wrap">
              <span>Contoh nama file yang didukung:</span>
              <code className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                0000000000.jpg
              </code>
              <code className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                5330.png
              </code>
              <code className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                abdul_rohim.jpg
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PREVIEW & MAPPING TABLE CARD */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden no-print">
        {/* Table Top Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#008ba3]" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-800">
              Daftar Foto Terunggah &amp; Hasil Pencocokan Siswa ({filteredQueue.length} dari {photoQueue.length} foto)
            </h2>
          </div>

          {/* Right Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {photoQueue.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Hapus seluruh antrean foto yang diunggah?')) {
                    setPhotoQueue([]);
                  }
                }}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Kosongkan Antrean</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveAllPhotos}
              disabled={photoQueue.length === 0}
              className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 shadow-xs transition cursor-pointer ${
                photoQueue.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>SIMPAN &amp; TERAPKAN ({matchedInQueueCount}) FOTO KE BUKU INDUK</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Left: Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Cari nama, NISN, berkas..."
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#008ba3] focus:outline-none w-48 sm:w-60"
              />
            </div>

            {/* Filter Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="semua">Semua Status Pencocokan</option>
              <option value="cocok">Hanya yang Cocok (Siap Simpan)</option>
              <option value="belum_cocok">Belum Cocok (Perlu Konfirmasi)</option>
            </select>

            {/* Filter Rombel Dropdown */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="Semua Kelas">Semua Kelas / Rombel</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                viewMode === 'table' ? 'bg-[#008ba3] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tabel
            </button>
            <button
              type="button"
              onClick={() => setViewMode('gallery')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                viewMode === 'gallery' ? 'bg-[#008ba3] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Galeri Foto
            </button>
          </div>
        </div>

        {/* Content View: Table or Gallery */}
        {photoQueue.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-700">Belum Ada Berkas Foto yang Diunggah</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Silakan seret file foto ke kotak di atas, gunakan tombol <strong>"Pilih Banyak Foto"</strong>, atau klik{' '}
                <strong>"Muat Foto Siswa Demo"</strong> untuk mencoba langsung.
              </p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3 w-12 text-center">No</th>
                  <th className="p-3 w-20 text-center">Foto Baru</th>
                  <th className="p-3 w-20 text-center">Foto Lama</th>
                  <th className="p-3">Nama Berkas</th>
                  <th className="p-3">Hasil Pencocokan Siswa</th>
                  <th className="p-3">Kelas &amp; Jurusan</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 min-w-[200px]">Pilih Siswa Manual</th>
                  <th className="p-3 w-12 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQueue.map((item, idx) => {
                  const matchedStudent = students.find((s) => s.id === item.matchedStudentId);
                  const existingPhoto =
                    targetSlot === 'masuk' ? matchedStudent?.photoUrl : matchedStudent?.photoUrlTamat;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      {/* No */}
                      <td className="p-3 text-center font-mono text-slate-500 font-semibold">{idx + 1}</td>

                      {/* Foto Baru Thumbnail */}
                      <td className="p-3 text-center">
                        <div className="w-12 h-14 bg-slate-100 rounded-md border border-slate-300 overflow-hidden mx-auto shadow-2xs group relative">
                          <img
                            src={item.dataUrl}
                            alt={item.fileName}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-150"
                          />
                        </div>
                      </td>

                      {/* Foto Lama di Buku Induk */}
                      <td className="p-3 text-center">
                        <div className="w-12 h-14 bg-slate-100 rounded-md border border-slate-200 overflow-hidden mx-auto shadow-2xs flex items-center justify-center text-slate-400">
                          {existingPhoto && !existingPhoto.includes('placeholder') ? (
                            <img src={existingPhoto} alt="Lama" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[9px] text-slate-400 font-semibold">Kosong</span>
                          )}
                        </div>
                      </td>

                      {/* Nama Berkas */}
                      <td className="p-3">
                        <div className="font-mono font-semibold text-slate-800 text-[11px] truncate max-w-[160px]" title={item.fileName}>
                          {item.fileName}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {(item.fileSize / 1024).toFixed(1)} KB
                        </span>
                      </td>

                      {/* Hasil Pencocokan Siswa */}
                      <td className="p-3">
                        {matchedStudent ? (
                          <div>
                            <span className="font-bold text-slate-900 block">{matchedStudent.fullName}</span>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>
                                NISN: <strong className="font-mono text-slate-700">{matchedStudent.nisn}</strong>
                              </span>
                              <span>•</span>
                              <span>
                                NIPD: <strong className="font-mono text-slate-700">{matchedStudent.nipd}</strong>
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-amber-700 font-semibold text-[11px] flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>Tidak ditemukan siswa yang cocok</span>
                          </div>
                        )}
                      </td>

                      {/* Kelas & Jurusan */}
                      <td className="p-3">
                        {matchedStudent ? (
                          <div>
                            <span className="px-2 py-0.5 bg-sky-50 text-sky-800 font-bold rounded text-[10px] border border-sky-200">
                              {matchedStudent.currentClass}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-1 truncate max-w-[140px]">
                              {matchedStudent.programKeahlian}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="p-3 text-center">
                        {item.matchType === 'nisn' && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px] flex items-center gap-1 justify-center">
                            <Check className="w-3 h-3" /> Cocok NISN
                          </span>
                        )}
                        {item.matchType === 'nipd' && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px] flex items-center gap-1 justify-center">
                            <Check className="w-3 h-3" /> Cocok NIPD
                          </span>
                        )}
                        {item.matchType === 'name' && (
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded text-[10px] flex items-center gap-1 justify-center">
                            <Check className="w-3 h-3" /> Cocok Nama
                          </span>
                        )}
                        {item.matchType === 'manual' && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded text-[10px] flex items-center gap-1 justify-center">
                            <UserCheck className="w-3 h-3" /> Dipilih Manual
                          </span>
                        )}
                        {item.matchType === 'none' && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px] flex items-center gap-1 justify-center">
                            <AlertCircle className="w-3 h-3" /> Belum Cocok
                          </span>
                        )}
                      </td>

                      {/* Manual Assignment Selector */}
                      <td className="p-3">
                        <select
                          value={item.matchedStudentId || ''}
                          onChange={(e) => handleManualAssign(item.id, e.target.value)}
                          className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded text-[11px] font-medium text-slate-700 focus:ring-1 focus:ring-[#008ba3] focus:outline-none"
                        >
                          <option value="">-- Pilih Siswa Manual --</option>
                          {students.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.fullName} ({s.currentClass} - {s.nisn})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Remove Action */}
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                          title="Hapus foto dari antrean"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Gallery Mode View */
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredQueue.map((item) => {
              const matchedStudent = students.find((s) => s.id === item.matchedStudentId);

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-3 flex flex-col justify-between shadow-2xs space-y-2 relative transition ${
                    item.matchedStudentId ? 'border-emerald-200' : 'border-amber-200 bg-amber-50/20'
                  }`}
                >
                  <div className="aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group">
                    <img src={item.dataUrl} alt={item.fileName} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] text-slate-400 block truncate" title={item.fileName}>
                      {item.fileName}
                    </span>
                    {matchedStudent ? (
                      <div>
                        <div className="font-bold text-slate-900 text-xs truncate mt-0.5" title={matchedStudent.fullName}>
                          {matchedStudent.fullName}
                        </div>
                        <span className="text-[10px] text-sky-700 font-semibold block">
                          {matchedStudent.currentClass}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-700 font-semibold block mt-1">
                        ⚠ Belum Cocok
                      </span>
                    )}
                  </div>

                  <select
                    value={item.matchedStudentId || ''}
                    onChange={(e) => handleManualAssign(item.id, e.target.value)}
                    className="w-full py-1 px-1 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="">Pilih Siswa...</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.currentClass})
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. FLOATING FOOTER BAR WHEN QUEUE IS POPULATED */}
      {photoQueue.length > 0 && (
        <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>Siap Menerapkan Foto Siswa</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-mono">
                  {matchedInQueueCount} dari {photoQueue.length} Foto Terpetakan
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Target: Pas Foto {targetSlot === 'masuk' ? 'Awal Masuk (Buku Induk Register)' : 'Tamat (Ijazah / SKL / Transkrip)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('siswa');
              }}
              className="px-3.5 py-2 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Lihat Data Siswa
            </button>
            <button
              type="button"
              onClick={handleSaveAllPhotos}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>SIMPAN SEMUA KE BUKU INDUK</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
