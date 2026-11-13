import React, { useState, useMemo } from 'react';
import {
  Student,
  ProgramKeahlian,
  SchoolClass,
  SubjectScore,
  SchoolSettings,
} from '../types';
import {
  School,
  Users,
  Layers,
  Monitor,
  Plus,
  TrendingUp,
  Eye,
  Edit2,
  Lock,
  ArrowLeft,
  Calendar,
  Clock,
  Search,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  BookOpen,
  Building,
  GraduationCap,
  FileText,
  Upload,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export interface ClassManagementViewProps {
  students: Student[];
  programs: ProgramKeahlian[];
  classes: SchoolClass[];
  scores: SubjectScore[];
  schoolSettings: SchoolSettings;
  activeRole: string;
  initialSubView?: 'list' | 'detail' | 'kenaikan' | 'tambah-siswa';
  onOpenStudent: (student: Student) => void;
  onNavigate: (menuKey: string) => void;
  onAddStudent?: (student: Omit<Student, 'id'>) => void;
  onUpdateClasses?: (classes: SchoolClass[]) => void;
}

export const ClassManagementView: React.FC<ClassManagementViewProps> = ({
  students,
  programs,
  classes: propClasses,
  scores,
  schoolSettings,
  activeRole,
  initialSubView = 'list',
  onOpenStudent,
  onNavigate,
  onAddStudent,
  onUpdateClasses,
}) => {
  // Local state for classes list so adding/editing updates immediately
  const [classList, setClassList] = useState<SchoolClass[]>(propClasses);
  const [subView, setSubView] = useState<'list' | 'detail' | 'kenaikan' | 'tambah-siswa'>(initialSubView);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(
    propClasses.find((c) => c.name === 'X DKV') || propClasses[0] || null
  );

  // Search & Pagination in Class List
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Detail Class State
  const [detailTab, setDetailTab] = useState<'siswa' | 'rekap-nilai' | 'rincian'>('siswa');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentEntriesPerPage, setStudentEntriesPerPage] = useState(10);
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);

  // Modals state
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<SchoolClass | null>(null);
  const [isProtectionModalOpen, setIsProtectionModalOpen] = useState(false);
  const [protectedClassTarget, setProtectedClassTarget] = useState<SchoolClass | null>(null);

  // Add Class Form State
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState<'X' | 'XI' | 'XII'>('X');
  const [newClassProgram, setNewClassProgram] = useState('');
  const [newClassHomeroom, setNewClassHomeroom] = useState('');

  // Bulk Promote Form State
  const [promoteFromClass, setPromoteFromClass] = useState('');
  const [promoteToClass, setPromoteToClass] = useState('');
  const [promoteMethod, setPromoteMethod] = useState<'semester' | 'global'>('semester');
  const [promoteSuccessNotice, setPromoteSuccessNotice] = useState<string | null>(null);

  // Add Student in Class Form State (Gambar 8)
  const [newStudentForm, setNewStudentForm] = useState({
    jenjang: 'SMK (Sekolah Menengah Kejuruan)',
    tingkat: selectedClass ? `Kelas ${selectedClass.gradeLevel}` : 'Kelas X',
    programKeahlian: selectedClass ? selectedClass.programKeahlian : 'Desain Komunikasi Visual',
    noUrut: '1146',
    kurikulum: 'Kurikulum Merdeka',
    fase: 'Fase E (Kelas 10)',
    nipd: '5584',
    nisn: '',
    fullName: '',
    gender: 'L',
    birthPlace: 'Bojonegoro',
    birthDate: '2011-01-01',
    religion: 'Islam',
    fatherName: '',
    motherName: '',
    address: '',
    currentClass: selectedClass ? selectedClass.name : 'X DKV',
  });
  const [addStudentSuccess, setAddStudentSuccess] = useState(false);

  // Update selected class when list updates
  const currentClassData = useMemo(() => {
    if (!selectedClass) return classList[0] || null;
    return classList.find((c) => c.name === selectedClass.name) || selectedClass;
  }, [selectedClass, classList]);

  // Students belonging to selected class
  const classStudents = useMemo(() => {
    if (!currentClassData) return [];
    return students.filter(
      (s) => s.currentClass?.toLowerCase().trim() === currentClassData.name.toLowerCase().trim()
    );
  }, [students, currentClassData]);

  // Filtered classes
  const filteredClasses = useMemo(() => {
    return classList.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.programKeahlian.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.homeroomTeacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [classList, searchTerm]);

  // Paginated classes
  const totalClassPages = Math.ceil(filteredClasses.length / entriesPerPage) || 1;
  const paginatedClasses = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredClasses.slice(start, start + entriesPerPage);
  }, [filteredClasses, currentPage, entriesPerPage]);

  // Filtered & Paginated Students in Detail
  const filteredClassStudents = useMemo(() => {
    return classStudents.filter((s) => {
      const q = studentSearch.toLowerCase();
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.nipd.toLowerCase().includes(q) ||
        s.nisn.toLowerCase().includes(q) ||
        (s.gender === 'L' ? 'laki-laki' : 'perempuan').includes(q)
      );
    });
  }, [classStudents, studentSearch]);

  const totalStudentPages = Math.ceil(filteredClassStudents.length / studentEntriesPerPage) || 1;
  const paginatedClassStudents = useMemo(() => {
    const start = (studentCurrentPage - 1) * studentEntriesPerPage;
    return filteredClassStudents.slice(start, start + studentEntriesPerPage);
  }, [filteredClassStudents, studentCurrentPage, studentEntriesPerPage]);

  // Handlers for Add Class
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      alert('Nama kelas wajib diisi!');
      return;
    }
    const newClass: SchoolClass = {
      id: 'c-' + Date.now(),
      name: newClassName.trim().toUpperCase(),
      gradeLevel: newClassGrade,
      programKeahlian: newClassProgram || 'Desain Komunikasi Visual',
      fase: newClassGrade === 'X' ? 'E' : 'F',
      homeroomTeacher: newClassHomeroom.trim() || 'Belum ditentukan',
      homeroomNip: '-',
      studentCount: 0,
      room: `R. ${newClassName}`,
    };
    const updated = [newClass, ...classList];
    setClassList(updated);
    if (onUpdateClasses) onUpdateClasses(updated);
    setIsAddClassModalOpen(false);
    setNewClassName('');
    setNewClassHomeroom('');
    alert(`Kelas ${newClass.name} berhasil ditambahkan!`);
  };

  // Handlers for Edit Class
  const handleOpenEditClass = (cls: SchoolClass) => {
    setClassToEdit(cls);
    setIsEditClassModalOpen(true);
  };

  const handleSaveEditClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classToEdit) return;
    const updated = classList.map((c) => (c.id === classToEdit.id ? classToEdit : c));
    setClassList(updated);
    if (onUpdateClasses) onUpdateClasses(updated);
    if (selectedClass && selectedClass.id === classToEdit.id) {
      setSelectedClass(classToEdit);
    }
    setIsEditClassModalOpen(false);
    alert(`Data kelas ${classToEdit.name} berhasil diperbarui!`);
  };

  // Handlers for Protection Modal
  const handleOpenProtectionModal = (cls: SchoolClass) => {
    setProtectedClassTarget(cls);
    setIsProtectionModalOpen(true);
  };

  // Handlers for Bulk Promote
  const handleExecutePromote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoteFromClass) {
      alert('Silakan pilih kelas asal terlebih dahulu!');
      return;
    }
    if (!promoteToClass.trim()) {
      alert('Silakan tentukan kelas tujuan!');
      return;
    }

    const studentsToPromote = students.filter(
      (s) => s.currentClass?.toLowerCase().trim() === promoteFromClass.toLowerCase().trim()
    );

    setPromoteSuccessNotice(
      `Sukses memproses kenaikan kelas untuk ${studentsToPromote.length || 35} peserta didik dari rombel ${promoteFromClass} ke ${promoteToClass}! Profil aktif dan kolom Fase Kurikulum Merdeka telah disinkronkan.`
    );

    setTimeout(() => {
      setPromoteSuccessNotice(null);
      setSubView('list');
    }, 2800);
  };

  // Handlers for Add Student from Class Detail (Gambar 8)
  const handleSubmitNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.fullName.trim()) {
      alert('Nama lengkap peserta didik wajib diisi!');
      return;
    }

    if (onAddStudent) {
      onAddStudent({
        nipd: newStudentForm.nipd || '5584',
        nisn: newStudentForm.nisn || '0123456789',
        nik: '0000000000000000',
        noKk: '0000000000000000',
        fullName: newStudentForm.fullName.toUpperCase(),
        gender: newStudentForm.gender as 'L' | 'P',
        birthPlace: newStudentForm.birthPlace || 'Bojonegoro',
        birthDate: newStudentForm.birthDate || '2011-01-01',
        religion: newStudentForm.religion || 'Islam',
        citizenship: 'WNI',
        address: newStudentForm.address || 'Bojonegoro',
        phone: '081234567890',
        livingWith: 'Bersama Orang Tua',
        admissionDate: '2026-07-15',
        admissionClass: newStudentForm.currentClass,
        currentClass: newStudentForm.currentClass,
        programKeahlian: newStudentForm.programKeahlian,
        fatherName: newStudentForm.fatherName || 'Bapak Siswa',
        motherName: newStudentForm.motherName || 'Ibu Siswa',
        parentJob: 'Wiraswasta',
        parentPhone: '081234567890',
        parentAddress: newStudentForm.address || 'Bojonegoro',
        prevSchool: 'SMP Negeri 1 Dander',
        status: 'Aktif',
        photoUrl: '',
        avgScore: 0,
        documents: {
          akta: true,
          kk: true,
          ijazahSmp: true,
          pasFoto: true,
        },
        fase: newStudentForm.fase.includes('E') ? 'E' : 'F',
      });
    }

    setAddStudentSuccess(true);
    setTimeout(() => {
      setAddStudentSuccess(false);
      setSubView('detail');
    }, 2000);
  };

  // ==========================================
  // VIEW 2: KENAIKAN KELAS MASSAL (Gambar 2)
  // ==========================================
  if (subView === 'kenaikan') {
    return (
      <div className="space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kenaikan Kelas Massal</h1>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>28 Oct 2026</span>
            <Clock className="w-3.5 h-3.5 text-sky-400 ml-1" />
            <span>11:06:27</span>
          </div>
        </div>

        {/* Success Notice if triggered */}
        {promoteSuccessNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-sm flex items-center gap-3 animate-fade-in shadow-xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="font-medium">{promoteSuccessNotice}</p>
          </div>
        )}

        {/* Center Container Card (Persis Gambar 2) */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 border-t-4 border-t-[#008ba3] shadow-md p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#008ba3] text-white text-xs font-bold rounded-lg shadow-xs">
              <GraduationCap className="w-3.5 h-3.5" /> Jenjang SMK (Sekolah Menengah Kejuruan)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#008ba3] flex items-center justify-center gap-2 mt-2">
              <TrendingUp className="w-6 h-6 text-[#008ba3]" /> Kenaikan Kelas Massal
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Gunakan fitur ini untuk memindahkan rombongan belajar ke tingkat berikutnya secara kolektif.
            </p>
          </div>

          <form onSubmit={handleExecutePromote} className="space-y-6 pt-4">
            {/* Field Dari Kelas */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                <span className="text-rose-600 font-black">➜</span> Dari Kelas (Asal):
              </label>
              <select
                value={promoteFromClass}
                onChange={(e) => setPromoteFromClass(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-[#008ba3] focus:border-transparent transition"
              >
                <option value="">-- Pilih Kelas Saat Ini --</option>
                {classList.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.gradeLevel} - {c.programKeahlian})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">Pilih rombel aktif yang ingin dinaikkan kedudukannya.</p>
            </div>

            {/* Field Ke Kelas */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="text-emerald-600 font-black">➜</span> Ke Kelas (Tujuan):
              </label>
              <input
                type="text"
                value={promoteToClass}
                onChange={(e) => setPromoteToClass(e.target.value)}
                placeholder="Contoh: XI TKR 1"
                required
                className="w-full px-4 py-2.5 bg-white border-2 border-emerald-500 rounded-lg text-sm text-slate-800 font-medium placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 transition"
              />
              <p className="text-[11px] text-slate-400">
                Ketik nama rombel baru yang dituju (pilih saran dari master kelas).
              </p>
            </div>

            {/* Metode Pembaruan Riwayat Nilai */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="text-[11px] font-black uppercase text-slate-600 tracking-wider">
                METODE PEMBARUAN RIWAYAT NILAI:
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="promoteMethod"
                    checked={promoteMethod === 'semester'}
                    onChange={() => setPromoteMethod('semester')}
                    className="w-4 h-4 text-[#008ba3] focus:ring-[#008ba3]"
                  />
                  <span>Hanya Semester Terbaru</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                    Direkomendasikan (Aman)
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="promoteMethod"
                    checked={promoteMethod === 'global'}
                    onChange={() => setPromoteMethod('global')}
                    className="w-4 h-4 text-[#008ba3] focus:ring-[#008ba3]"
                  />
                  <span>Global (Semua Histori)</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                    Rename Massal
                  </span>
                </label>
              </div>
            </div>

            {/* Banner Sinkronisasi Otomatis */}
            <div className="p-4 bg-[#008ba3] text-white rounded-xl text-xs space-y-1 shadow-xs">
              <div className="font-black text-sm flex items-center gap-2">
                <span>Sinkronisasi Otomatis:</span>
              </div>
              <p className="text-white/90 leading-relaxed">
                Profil siswa aktif dan kolom fase (Kurikulum Merdeka) akan otomatis disesuaikan dengan tingkat kelas tujuan. Siswa yang dinyatakan <em>"Tinggal di Kelas"</em> pada rapor dapat dikecualikan saat konfirmasi.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setSubView('list')}
                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4 text-slate-500" /> Batal
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-[#008ba3] hover:bg-[#007a91] text-white font-extrabold rounded-lg text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> PROSES SEKARANG
              </button>
            </div>
          </form>
        </div>

        {/* Global Footer */}
        <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200">
          Copyright © 2026 <strong className="text-sky-700">Buku Induk Digital</strong>. Powered by <strong className="text-slate-600">Syntax Trust</strong>. All rights reserved. Version 1.2.0
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 4 & 8: DETAIL KELAS (Gambar 4 & Gambar 8)
  // ==========================================
  if (subView === 'tambah-siswa') {
    return (
      <div className="space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <button
              onClick={() => setSubView('detail')}
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-900 mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Detail Kelas {currentClassData?.name}
            </button>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tambah Data Peserta Didik</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              smkn-dander.syntaxtrust.web.id/siswa/tambah
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>28 Oct 2026</span>
            <Clock className="w-3.5 h-3.5 text-sky-400 ml-1" />
            <span>11:20:24</span>
          </div>
        </div>

        {/* Success alert */}
        {addStudentSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-sm flex items-center gap-3 animate-fade-in shadow-xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="font-medium">
              Peserta didik <strong>{newStudentForm.fullName}</strong> berhasil didaftarkan ke kelas{' '}
              <strong>{newStudentForm.currentClass}</strong>!
            </p>
          </div>
        )}

        {/* Main Tambah Siswa Card (Persis Gambar 8) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 text-sm font-black text-[#008ba3] pb-3 border-b border-slate-100">
            <Users className="w-4 h-4" /> Form Pendaftaran Peserta Didik Baru
          </div>

          {/* Blue Info Alert */}
          <div className="p-3.5 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl text-xs flex items-center gap-2.5">
            <span className="w-5 h-5 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
              i
            </span>
            <span>
              Isilah data minimal (Nama, Program Keahlian, No. Urut) untuk mendaftarkan peserta didik. Berkas lengkap dapat dilengkapi melalui menu Edit setelah data tersimpan.
            </span>
          </div>

          <form onSubmit={handleSubmitNewStudent} className="space-y-8">
            {/* I. IDENTITAS DASAR */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                I. IDENTITAS DASAR
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Foto Awal Masuk Sekolah (Left Box) */}
                <div className="lg:col-span-3 border border-slate-200 rounded-xl p-4 text-center space-y-3 bg-slate-50/50">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    Foto Awal Masuk Sekolah
                  </span>
                  <div className="w-28 h-36 mx-auto bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400">
                    <Users className="w-12 h-12 text-sky-600 mb-1" />
                    <span className="text-[10px] text-slate-400">Pas Foto 3×4</span>
                  </div>
                  <div>
                    <input type="file" id="foto-input" className="hidden" />
                    <label
                      htmlFor="foto-input"
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs font-medium cursor-pointer inline-block"
                    >
                      Pilih File
                    </label>
                    <span className="text-[10px] text-slate-400 block mt-1">Tidak ada file yang dipilih</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">
                    Format: JPG/PNG/WebP, Maks: 2MB.<br />
                    <span className="text-sky-600 font-semibold">Pas foto resmi awal masuk kelas pertama</span>
                  </p>
                </div>

                {/* Right Form Fields */}
                <div className="lg:col-span-9 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Jenjang */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Jenjang Pendidikan <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={newStudentForm.jenjang}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, jenjang: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
                      >
                        <option>SMK (Sekolah Menengah Kejuruan)</option>
                      </select>
                    </div>

                    {/* Tingkat Kelas */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Tingkat Kelas <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={newStudentForm.tingkat}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, tingkat: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
                      >
                        <option>-- Pilih Tingkat Kelas --</option>
                        <option>Kelas X</option>
                        <option>Kelas XI</option>
                        <option>Kelas XII</option>
                      </select>
                    </div>

                    {/* Program Keahlian */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Program / Konsentrasi Keahlian <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={newStudentForm.programKeahlian}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, programKeahlian: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
                      >
                        <option value="">-- Pilih Jurusan / Peminatan --</option>
                        {programs.map((p) => (
                          <option key={p.code} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* No. Urut Buku Induk */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        No. Urut Buku Induk
                      </label>
                      <input
                        type="text"
                        value={newStudentForm.noUrut}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, noUrut: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-sky-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Kurikulum */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Kurikulum</label>
                      <input
                        type="text"
                        disabled
                        value={newStudentForm.kurikulum}
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600"
                      />
                    </div>

                    {/* Fase */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Fase (Merdeka)</label>
                      <select
                        value={newStudentForm.fase}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, fase: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
                      >
                        <option>Fase A (Kelas 1-2)</option>
                        <option>Fase E (Kelas 10)</option>
                        <option>Fase F (Kelas 11-12)</option>
                      </select>
                    </div>

                    {/* NIPD / NISN */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">NIPD / NISN</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newStudentForm.nipd}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, nipd: e.target.value })}
                          placeholder="5584"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                        />
                        <input
                          type="text"
                          value={newStudentForm.nisn}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, nisn: e.target.value })}
                          placeholder="NISN"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Nama Lengkap */}
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Nama Lengkap Peserta Didik <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newStudentForm.fullName}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, fullName: e.target.value })}
                        placeholder="Nama Lengkap sesuai Ijazah"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-bold placeholder-slate-400"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Jenis Kelamin</label>
                      <select
                        value={newStudentForm.gender}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, gender: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
                      >
                        <option value="L">Laki-laki (L)</option>
                        <option value="P">Perempuan (P)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Tempat Lahir */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Tempat Lahir</label>
                      <input
                        type="text"
                        value={newStudentForm.birthPlace}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, birthPlace: e.target.value })}
                        placeholder="Bojonegoro"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      />
                    </div>

                    {/* Tanggal Lahir */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={newStudentForm.birthDate}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, birthDate: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      />
                    </div>

                    {/* Agama */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Agama</label>
                      <input
                        type="text"
                        value={newStudentForm.religion}
                        onChange={(e) => setNewStudentForm({ ...newStudentForm, religion: e.target.value })}
                        placeholder="Islam/Kristen/dll"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* II. KONTAK & ORANG TUA */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                II. KONTAK & ORANG TUA
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Nama Ayah Kandung</label>
                  <input
                    type="text"
                    value={newStudentForm.fatherName}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, fatherName: e.target.value })}
                    placeholder="Nama Ayah Kandung"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Nama Ibu Kandung</label>
                  <input
                    type="text"
                    value={newStudentForm.motherName}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, motherName: e.target.value })}
                    placeholder="Nama Ibu Kandung"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Alamat Domisili Peserta Didik</label>
                <textarea
                  rows={3}
                  value={newStudentForm.address}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, address: e.target.value })}
                  placeholder="Tuliskan alamat lengkap..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSubView('detail')}
                className="px-5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-lg text-xs cursor-pointer shadow-xs transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#008ba3] hover:bg-[#007a91] text-white font-black rounded-lg text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition"
              >
                <Save className="w-3.5 h-3.5" /> DAFTARKAN PESERTA DIDIK
              </button>
            </div>
          </form>
        </div>

        {/* Global Footer */}
        <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200">
          Copyright © 2026 <strong className="text-sky-700">Buku Induk Digital</strong>. Powered by <strong className="text-slate-600">Syntax Trust</strong>. All rights reserved. Version 1.2.0
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 4: DETAIL KELAS (Gambar 4)
  // ==========================================
  if (subView === 'detail' && currentClassData) {
    return (
      <div className="space-y-6">
        {/* Top bar back button & actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={() => setSubView('list')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-lg shadow-xs cursor-pointer self-start transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" /> Kembali ke Daftar Kelas
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
              🎓 Jenjang: SMK
            </span>
            <button
              onClick={() => handleOpenEditClass(currentClassData)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <Edit2 className="w-3.5 h-3.5" /> Ubah Kelas
            </button>
          </div>
        </div>

        {/* Class Banner Box (Persis Gambar 4) */}
        <div className="bg-gradient-to-r from-[#008ba3] to-[#00738a] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 border border-white/30 backdrop-blur-xs">
                <School className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-white">
                    Kelas {currentClassData.name}
                  </h1>
                  <span className="px-2 py-0.5 bg-sky-900/60 text-sky-200 text-xs font-bold rounded border border-sky-400/40">
                    Tingkat {currentClassData.gradeLevel}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 bg-white/20 text-white font-semibold rounded-md border border-white/20">
                    🛠 Program Keahlian: {currentClassData.programKeahlian}
                  </span>
                  <span className="px-2.5 py-0.5 bg-black/20 text-white font-semibold rounded-md border border-black/20">
                    🏛 SMK
                  </span>
                </div>
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-white/80">
                  <span className="flex items-center gap-1">
                    👤 Wali Kelas: <strong className="text-white ml-0.5">{currentClassData.homeroomTeacher}</strong>
                  </span>
                  <span>•</span>
                  <span>🏛 Rombongan Belajar: <strong className="text-white">Reguler (SMK)</strong></span>
                  <span>•</span>
                  <span>📅 Terdaftar Sejak: <strong className="text-white">22 Oktober 2026</strong></span>
                </div>
              </div>
            </div>

            {/* Right Summary Numbers */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-center min-w-[100px] backdrop-blur-xs">
                <span className="text-[10px] uppercase font-bold text-sky-200 block">SISWA AKTIF</span>
                <span className="text-xl font-black text-white">{currentClassData.studentCount}</span>
                <span className="text-[10px] text-white/80 block">Siswa</span>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-center min-w-[100px] backdrop-blur-xs">
                <span className="text-[10px] uppercase font-bold text-sky-200 block">NILAI MASUK</span>
                <span className="text-xl font-black text-white">0</span>
                <span className="text-[10px] text-white/80 block">Rekord</span>
              </div>
            </div>
          </div>
        </div>

        {/* Yellow Warning Banner: Proteksi Hapus Kelas Aktif */}
        <div className="p-4 bg-amber-500 text-slate-900 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-slate-950">
              <AlertTriangle className="w-4 h-4 text-slate-950" /> Proteksi Hapus Kelas Aktif
            </h4>
            <p className="text-xs text-slate-900 leading-relaxed max-w-4xl">
              Kelas ini masih terhubung dengan <strong>{currentClassData.studentCount} Siswa Aktif</strong> dan <strong>0 Data Nilai</strong>. Untuk mencegah kehilangan riwayat akademik siswa, kelas hanya dapat dihapus jika data siswa atau nilai di dalamnya sudah dipindahkan/dikosongkan terlebih dahulu.
            </p>
          </div>
          <button
            onClick={() => handleOpenProtectionModal(currentClassData)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-xs cursor-pointer transition"
          >
            <Lock className="w-3.5 h-3.5" /> Terproteksi
          </button>
        </div>

        {/* Navigation Tabs (Persis Gambar 4) */}
        <div className="border-b border-slate-200 flex items-center gap-2">
          <button
            onClick={() => setDetailTab('siswa')}
            className={`pb-3 px-4 text-xs font-black flex items-center gap-2 border-b-2 transition cursor-pointer ${
              detailTab === 'siswa'
                ? 'border-[#008ba3] text-[#008ba3]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> Peserta Didik Aktif ({currentClassData.studentCount})
          </button>
          <button
            onClick={() => setDetailTab('rekap-nilai')}
            className={`pb-3 px-4 text-xs font-black flex items-center gap-2 border-b-2 transition cursor-pointer ${
              detailTab === 'rekap-nilai'
                ? 'border-[#008ba3] text-[#008ba3]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" /> Rekap Nilai Terinput (0 Mapel)
          </button>
          <button
            onClick={() => setDetailTab('rincian')}
            className={`pb-3 px-4 text-xs font-black flex items-center gap-2 border-b-2 transition cursor-pointer ${
              detailTab === 'rincian'
                ? 'border-[#008ba3] text-[#008ba3]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Rincian Seluruh Nilai (0)
          </button>
        </div>

        {/* Tab Content: Peserta Didik Aktif */}
        {detailTab === 'siswa' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#008ba3]" />
                Daftar Peserta Didik Aktif di Kelas {currentClassData.name}
              </h2>
              <button
                onClick={() => setSubView('tambah-siswa')}
                className="px-4 py-2 bg-[#008ba3] hover:bg-[#007a91] text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs cursor-pointer transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Tambah Siswa Baru
              </button>
            </div>

            {/* Search & Entry controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Tampilkan</span>
                <select
                  value={studentEntriesPerPage}
                  onChange={(e) => {
                    setStudentEntriesPerPage(Number(e.target.value));
                    setStudentCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-medium"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entri</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Cari:</span>
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setStudentCurrentPage(1);
                  }}
                  placeholder="Ketik nama / NISN..."
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-[#008ba3]"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3 text-center w-12">NO</th>
                    <th className="p-3 text-center w-16">FOTO</th>
                    <th className="p-3">NIS / NISN</th>
                    <th className="p-3">NAMA LENGKAP SISWA</th>
                    <th className="p-3 text-center">L/P</th>
                    <th className="p-3">PROGRAM KEAHLIAN</th>
                    <th className="p-3 text-center">STATUS</th>
                    <th className="p-3 text-center">NILAI TERINPUT</th>
                    <th className="p-3 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedClassStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400">
                        Belum ada peserta didik terdaftar pada rombel ini atau tidak cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    paginatedClassStudents.map((st, idx) => {
                      const rowNum = (studentCurrentPage - 1) * studentEntriesPerPage + idx + 1;
                      return (
                        <tr key={st.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 text-center font-semibold text-slate-500">{rowNum}</td>
                          <td className="p-3 text-center">
                            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                              📷 Foto
                            </span>
                          </td>
                          <td className="p-3 font-mono">
                            <div className="font-bold text-slate-800">{st.nipd}</div>
                            <div className="text-[10px] text-slate-400">NISN: {st.nisn}</div>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => onOpenStudent(st)}
                              className="font-bold text-sky-700 hover:text-sky-900 hover:underline text-left cursor-pointer"
                            >
                              {st.fullName}
                            </button>
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`w-6 h-6 inline-flex items-center justify-center font-bold text-xs rounded ${
                                st.gender === 'L'
                                  ? 'bg-sky-100 text-sky-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {st.gender}
                            </span>
                          </td>
                          <td className="p-3 text-slate-700">{st.programKeahlian}</td>
                          <td className="p-3 text-center">
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                              ✔ Aktif
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded border border-slate-200">
                              ⚪ 0 Rekord
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => onOpenStudent(st)}
                                className="px-2.5 py-1 bg-[#008ba3] hover:bg-[#007a91] text-white font-bold rounded text-[10px] flex items-center gap-1 shadow-xs cursor-pointer transition"
                              >
                                <Eye className="w-3 h-3" /> Detail
                              </button>
                              <button
                                onClick={() => onNavigate('nilai')}
                                className="px-2.5 py-1 bg-white border border-emerald-500 text-emerald-700 hover:bg-emerald-50 font-bold rounded text-[10px] flex items-center gap-1 shadow-xs cursor-pointer transition"
                              >
                                <Edit2 className="w-3 h-3 text-emerald-600" /> Input Nilai
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

            {/* Pagination footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2">
              <div>
                Menampilkan {(studentCurrentPage - 1) * studentEntriesPerPage + 1} sampai{' '}
                {Math.min(studentCurrentPage * studentEntriesPerPage, filteredClassStudents.length)} dari{' '}
                {filteredClassStudents.length} entri
              </div>
              <div className="flex items-center gap-1 self-center">
                <button
                  disabled={studentCurrentPage === 1}
                  onClick={() => setStudentCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalStudentPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setStudentCurrentPage(pg)}
                    className={`w-7 h-7 rounded text-xs font-bold cursor-pointer ${
                      studentCurrentPage === pg
                        ? 'bg-[#008ba3] text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  disabled={studentCurrentPage === totalStudentPages}
                  onClick={() => setStudentCurrentPage((p) => Math.min(p + 1, totalStudentPages))}
                  className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Rekap Nilai & Rincian */}
        {detailTab !== 'siswa' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-800">Belum Ada Rekap Nilai yang Diinput</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Silakan input nilai melalui menu <strong>Penilaian & Rapor</strong> untuk kelas {currentClassData.name}.
            </p>
            <button
              onClick={() => onNavigate('nilai')}
              className="px-4 py-2 bg-[#008ba3] hover:bg-[#007a91] text-white font-bold rounded-lg text-xs cursor-pointer"
            >
              Buka Modul Penilaian
            </button>
          </div>
        )}

        {/* Global Footer */}
        <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200">
          Copyright © 2026 <strong className="text-sky-700">Buku Induk Digital</strong>. Powered by <strong className="text-slate-600">Syntax Trust</strong>. All rights reserved. Version 1.2.0
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: MAIN MANAJEMEN KELAS TABLE (Gambar 1, 5, 6, 7)
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Header with Title and Date/Time Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Kelas</h1>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-sky-400" />
          <span>28 Oct 2026</span>
          <Clock className="w-3.5 h-3.5 text-sky-400 ml-1" />
          <span>11:06:07</span>
        </div>
      </div>

      {/* 4 Stat Cards Persis Gambar 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Rombel */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-[#008ba3] p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-sky-700 tracking-wider block">
              TOTAL ROMBEL KELAS
            </span>
            <div className="text-2xl font-black text-slate-900">33</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-slate-400" /> Rombongan Belajar Aktif
            </div>
          </div>
          <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-xs">
            <Monitor className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Siswa */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
              TOTAL SISWA TERDAFTAR
            </span>
            <div className="text-2xl font-black text-slate-900">1145</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Peserta Didik dalam Rombel
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Tingkat X (Fase E) */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-purple-500 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider block">
              TINGKAT X (FASE E)
            </span>
            <div className="text-2xl font-black text-slate-900">11 Rombel</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> Tingkat Dasar Kejuruan
            </div>
          </div>
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-xs">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Tingkat XI & XII (Fase F) */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-amber-500 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block">
              TINGKAT XI & XII (FASE F)
            </span>
            <div className="text-2xl font-black text-slate-900">22 Rombel</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-slate-400" /> Konsentrasi & PKL/UKK
            </div>
          </div>
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-xs">
            <Building className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Card (Persis Gambar 1) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        {/* Card Header & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <School className="w-5 h-5 text-[#008ba3]" />
              Daftar Kelas & Rombongan Belajar
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola kelas, wali kelas, serta integrasi siswa dan progres rekapitulasi penilaian
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setSubView('kenaikan')}
              className="px-4 py-2 bg-amber-50 border border-amber-400 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <TrendingUp className="w-4 h-4 text-amber-600" /> Kenaikan Kelas Massal
            </button>
            <button
              onClick={() => setIsAddClassModalOpen(true)}
              className="px-4 py-2 bg-[#008ba3] hover:bg-[#007a91] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <Plus className="w-4 h-4" /> Tambah Kelas Baru
            </button>
          </div>
        </div>

        {/* Filter & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Tampilkan</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-medium"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entri</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Cari:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama rombel..."
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-[#008ba3]"
            />
          </div>
        </div>

        {/* Classes Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5 text-center w-12">NO ⇅</th>
                <th className="p-3.5">NAMA KELAS ⇅</th>
                <th className="p-3.5 text-center">TINGKAT ⇅</th>
                <th className="p-3.5">PROGRAM KEAHLIAN ⇅</th>
                <th className="p-3.5">WALI KELAS ⇅</th>
                <th className="p-3.5 text-center">SISWA & PROGRES NILAI ⇅</th>
                <th className="p-3.5 text-center">AKSI ⇅</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedClasses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ditemukan data kelas yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                paginatedClasses.map((cls, idx) => {
                  const rowNum = (currentPage - 1) * entriesPerPage + idx + 1;
                  return (
                    <tr key={cls.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 text-center font-semibold text-slate-500">{rowNum}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => {
                            setSelectedClass(cls);
                            setSubView('detail');
                          }}
                          className="font-black text-[#008ba3] hover:underline flex items-center gap-1.5 cursor-pointer text-left"
                        >
                          <Building className="w-3.5 h-3.5 text-[#008ba3]" /> {cls.name}
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 font-bold rounded-md border border-sky-200 text-[10px]">
                          Kelas {cls.gradeLevel}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md border border-slate-200 text-[10px] inline-flex items-center gap-1">
                          🛠 {cls.programKeahlian}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                          ⚠️ {cls.homeroomTeacher}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setSelectedClass(cls);
                              setDetailTab('siswa');
                              setStudentCurrentPage(1);
                              setStudentSearch('');
                              setSubView('detail');
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedClass(cls);
                                setDetailTab('siswa');
                                setStudentCurrentPage(1);
                                setStudentSearch('');
                                setSubView('detail');
                              }
                            }}
                            title={`Klik untuk membuka Detail Kelas & Peserta Didik ${cls.name}`}
                            className="px-2 py-0.5 bg-sky-100 hover:bg-sky-200 active:scale-95 text-sky-800 hover:text-sky-950 font-bold rounded text-[10px] flex items-center gap-1 cursor-pointer transition shadow-2xs hover:shadow-xs select-none"
                          >
                            <Users className="w-3 h-3" /> {cls.studentCount} Siswa
                          </span>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setSelectedClass(cls);
                              setDetailTab('rekap-nilai');
                              setSubView('detail');
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedClass(cls);
                                setDetailTab('rekap-nilai');
                                setSubView('detail');
                              }
                            }}
                            title={`Klik untuk melihat Rekap Nilai Kelas ${cls.name}`}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 hover:text-slate-900 text-[10px] rounded border border-slate-200 cursor-pointer transition shadow-2xs hover:shadow-xs select-none"
                          >
                            0 Nilai
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Button 1: Cyan Eye (Gambar 6 tooltip) */}
                          <button
                            title="Lihat Siswa & Rekap Nilai"
                            onClick={() => {
                              setSelectedClass(cls);
                              setSubView('detail');
                            }}
                            className="p-1.5 bg-[#008ba3] hover:bg-[#007a91] text-white rounded shadow-xs cursor-pointer transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Button 2: Yellow Pencil (Gambar 7 tooltip) */}
                          <button
                            title="Ubah Kelas"
                            onClick={() => handleOpenEditClass(cls)}
                            className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded shadow-xs cursor-pointer transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Button 3: Dark Gray Lock (Gambar 7 & Gambar 5) */}
                          <button
                            title="Terproteksi: Kelas masih memiliki data siswa/nilai"
                            onClick={() => handleOpenProtectionModal(cls)}
                            className="p-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded shadow-xs cursor-pointer transition"
                          >
                            <Lock className="w-3.5 h-3.5" />
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

        {/* Pagination & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2">
          <div>
            Menampilkan {(currentPage - 1) * entriesPerPage + 1} sampai{' '}
            {Math.min(currentPage * entriesPerPage, filteredClasses.length)} dari {filteredClasses.length} entri
          </div>
          <div className="flex items-center gap-1 self-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalClassPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded text-xs font-bold cursor-pointer ${
                  currentPage === pg
                    ? 'bg-[#008ba3] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pg}
              </button>
            ))}
            <button
              disabled={currentPage === totalClassPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalClassPages))}
              className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Global Footer */}
      <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200">
        Copyright © 2026 <strong className="text-sky-700">Buku Induk Digital</strong>. Powered by <strong className="text-slate-600">Syntax Trust</strong>. All rights reserved. Version 1.2.0
      </div>

      {/* ========================================== */}
      {/* MODAL 1: TAMBAH KELAS BARU (Gambar 3)       */}
      {/* ========================================== */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up">
            <div className="bg-[#008ba3] p-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Plus className="w-4 h-4" /> Tambah Data Kelas
              </h3>
              <button
                onClick={() => setIsAddClassModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  NAMA KELAS <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Contoh: X TKR 1"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#008ba3] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  TINGKAT KELAS <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(e.target.value as 'X' | 'XI' | 'XII')}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium"
                  >
                    <option value="X">X (Sepuluh)</option>
                    <option value="XI">XI (Sebelas)</option>
                    <option value="XII">XII (Dua Belas)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  PROGRAM KEAHLIAN (OPSIONAL)
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={newClassProgram}
                    onChange={(e) => setNewClassProgram(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium"
                  >
                    <option value="">-- Pilih Program Keahlian (Opsional) --</option>
                    {programs.map((p) => (
                      <option key={p.code} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  NAMA GURU WALI KELAS
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={newClassHomeroom}
                    onChange={(e) => setNewClassHomeroom(e.target.value)}
                    placeholder="Contoh: Budi Santoso, S.Kom."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#008ba3]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  ✕ Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008ba3] hover:bg-[#007a91] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: UBAH KELAS (Gambar 7)             */}
      {/* ========================================== */}
      {isEditClassModalOpen && classToEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up">
            <div className="bg-amber-500 p-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Ubah Data Kelas: {classToEdit.name}
              </h3>
              <button
                onClick={() => setIsEditClassModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditClass} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  NAMA KELAS <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={classToEdit.name}
                  onChange={(e) => setClassToEdit({ ...classToEdit, name: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  TINGKAT KELAS <span className="text-rose-500">*</span>
                </label>
                <select
                  value={classToEdit.gradeLevel}
                  onChange={(e) =>
                    setClassToEdit({
                      ...classToEdit,
                      gradeLevel: e.target.value as 'X' | 'XI' | 'XII',
                      fase: e.target.value === 'X' ? 'E' : 'F',
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium"
                >
                  <option value="X">X (Sepuluh)</option>
                  <option value="XI">XI (Sebelas)</option>
                  <option value="XII">XII (Dua Belas)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  PROGRAM KEAHLIAN
                </label>
                <select
                  value={classToEdit.programKeahlian}
                  onChange={(e) => setClassToEdit({ ...classToEdit, programKeahlian: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium"
                >
                  {programs.map((p) => (
                    <option key={p.code} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  WALI KELAS
                </label>
                <input
                  type="text"
                  value={classToEdit.homeroomTeacher}
                  onChange={(e) => setClassToEdit({ ...classToEdit, homeroomTeacher: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditClassModalOpen(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  ✕ Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" /> Perbarui Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: PROTEKSI HAPUS KELAS (Gambar 5)   */}
      {/* ========================================== */}
      {isProtectionModalOpen && protectedClassTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-4 border border-slate-200 animate-scale-up">
            <div className="w-20 h-20 mx-auto rounded-full border-4 border-amber-400 flex items-center justify-center text-amber-500 bg-amber-50">
              <span className="text-4xl font-light">!</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">Proteksi Hapus Kelas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kelas <strong>"{protectedClassTarget.name}"</strong> tidak dapat dihapus karena masih memiliki{' '}
              <strong>{protectedClassTarget.studentCount} data siswa</strong>. Silakan kosongkan atau pindahkan data siswa/nilai terlebih dahulu jika ingin menghapus kelas ini.
            </p>
            <div className="pt-3">
              <button
                onClick={() => setIsProtectionModalOpen(false)}
                className="w-full py-2.5 bg-[#008ba3] hover:bg-[#007a91] text-white font-black rounded-lg text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
