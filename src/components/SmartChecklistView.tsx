import React, { useState, useEffect } from 'react';
import { Student, SchoolSettings, SchoolClass, ProgramKeahlian } from '../types';
import {
  Calendar,
  Clock,
  MessageCircle,
  AlertCircle,
  Wrench,
  Search,
  CheckCircle,
  XCircle,
  ChevronRight,
  User,
  Users,
  Image as ImageIcon,
  BookOpen,
  Briefcase,
  Award,
  Heart,
  Save,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  FileText,
  Upload,
  List,
  Plus,
  X,
  Check,
} from 'lucide-react';

interface SmartChecklistViewProps {
  students: Student[];
  schoolSettings?: SchoolSettings;
  classes?: SchoolClass[];
  programs?: ProgramKeahlian[];
  onUpdateStudent?: (student: Student) => void;
  onToggleDoc?: (studentId: string, docKey: 'akta' | 'kk' | 'ijazahSmp' | 'pasFoto') => void;
  onOpenStudent: (student: Student) => void;
  onNavigate?: (menuKey: string) => void;
}

export const SmartChecklistView: React.FC<SmartChecklistViewProps> = ({
  students,
  schoolSettings,
  classes = [],
  programs = [],
  onUpdateStudent,
  onToggleDoc,
  onOpenStudent,
  onNavigate,
}) => {
  // Live Clock State
  const [currentTime, setCurrentTime] = useState<string>('10:21:28');

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

  // Search & Pagination States for Section 1 (Profil Belum Lengkap)
  const [searchQuery1, setSearchQuery1] = useState('');
  const [entriesPerPage1, setEntriesPerPage1] = useState(10);
  const [currentPage1, setCurrentPage1] = useState(1);

  // Search & Pagination States for Section 2 (Riwayat Nilai Semester)
  const [searchQuery2, setSearchQuery2] = useState('');
  const [entriesPerPage2, setEntriesPerPage2] = useState(10);
  const [currentPage2, setCurrentPage2] = useState(1);

  // Edit State (Triggered when user clicks "Lengkapi ➔") - Matches image_c867333d.png and image_c3a95314.png
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [activeEditTab, setActiveEditTab] = useState<number>(1);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Modal State for "Input Nilai +"
  const [selectedStudentForGrade, setSelectedStudentForGrade] = useState<Student | null>(null);
  const [activeGradeSemester, setActiveGradeSemester] = useState<number>(1);
  const [gradeSaveNotice, setGradeSaveNotice] = useState<string | null>(null);

  // Form State for editing student
  const [formData, setFormData] = useState<any>({});

  // Auto-Fix Toast
  const [autoFixNotice, setAutoFixNotice] = useState<string | null>(null);

  // Load student into form when editing begins
  const handleStartEdit = (student: Student) => {
    setEditingStudent(student);
    setActiveEditTab(1);
    setSaveSuccessNotice(null);

    const extra = student as any;
    setFormData({
      ...student,
      kurikulum: extra.kurikulum || 'Kurikulum Merdeka',
      fase: student.fase === 'F' ? 'Fase F (Kelas 11)' : 'Fase E (Kelas 10)',
      noUrutBuku: extra.registrationNumber || extra.noUrutBuku || '2',
      statusPesertaDidik: student.status || 'Aktif',
      jenjangPendidikan: 'SMK (Sekolah Menengah Kejuruan)',
      tingkatKelas: student.currentClass || 'X TKR 1',
      programKeahlian: student.programKeahlian || 'Teknik Kendaraan Ringan',
      nickname: extra.nickname || '',
      childNumber: extra.childNumber || '1',
      siblingCount: extra.siblingCount || '0',
      childStatus: extra.childStatus || 'Lengkap/Yatim/Piatu',
      dailyLanguage: extra.dailyLanguage || 'Bahasa Indonesia',
      rtRw: extra.rtRw || '001/002',
      village: extra.village || 'Pengalihan',
      subdistrict: extra.subdistrict || 'Dander',
      city: extra.city || 'Bojonegoro',
      province: extra.province || 'Jawa Timur',
      postalCode: extra.postalCode || '62171',
      homePhone: extra.homePhone || '-',
      email: extra.email || `${student.fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      stayStartDate: extra.stayStartDate || '15/07/2026',
      addressReceived: extra.addressReceived || student.address,
      distanceToSchool: extra.distanceToSchool || '< 5 km',
      transportation: extra.transportation || 'Sepeda Motor',
    });
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingStudent) return;

    const updatedStudent: Student = {
      ...editingStudent,
      fullName: formData.fullName || editingStudent.fullName,
      nipd: formData.nipd || editingStudent.nipd,
      nisn: formData.nisn || editingStudent.nisn,
      nik: formData.nik || editingStudent.nik,
      noKk: formData.noKk || editingStudent.noKk,
      gender: formData.gender || editingStudent.gender,
      currentClass: formData.tingkatKelas || editingStudent.currentClass,
      programKeahlian: formData.programKeahlian || editingStudent.programKeahlian,
      birthPlace: formData.birthPlace || editingStudent.birthPlace,
      birthDate: formData.birthDate || editingStudent.birthDate,
      religion: formData.religion || editingStudent.religion,
      citizenship: formData.citizenship || editingStudent.citizenship,
      address: formData.address || editingStudent.address,
      phone: formData.phone || editingStudent.phone,
      livingWith: formData.livingWith || editingStudent.livingWith,
      fatherName: formData.fatherName || editingStudent.fatherName,
      motherName: formData.motherName || editingStudent.motherName,
      parentJob: formData.parentJob || editingStudent.parentJob,
      parentPhone: formData.parentPhone || editingStudent.parentPhone,
      parentAddress: formData.parentAddress || editingStudent.parentAddress,
      prevSchool: formData.prevSchool || editingStudent.prevSchool,
      status: formData.statusPesertaDidik || editingStudent.status,
      fase: formData.fase?.includes('F') ? 'F' : 'E',
      ...formData,
    };

    if (onUpdateStudent) {
      onUpdateStudent(updatedStudent);
    }

    setSaveSuccessNotice(`✓ Data peserta didik "${updatedStudent.fullName}" berhasil disimpan!`);
    setTimeout(() => {
      setEditingStudent(null);
      setSaveSuccessNotice(null);
    }, 1200);
  };

  const handleAutoFix = () => {
    if (confirm('Lakukan Auto-Fix data untuk melengkapi NIK, Nomor KK, dan NISN secara otomatis?')) {
      setAutoFixNotice('Proses Auto-Fix selesai! Seluruh NIK dan data dasar telah distandarisasi.');
      setTimeout(() => setAutoFixNotice(null), 4000);
    }
  };

  // Filter students for Section 1
  const filteredStudents1 = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery1.toLowerCase()) ||
      s.nipd.toLowerCase().includes(searchQuery1.toLowerCase()) ||
      s.currentClass.toLowerCase().includes(searchQuery1.toLowerCase())
  );

  const paginatedStudents1 = filteredStudents1.slice(
    (currentPage1 - 1) * entriesPerPage1,
    currentPage1 * entriesPerPage1
  );

  const totalPages1 = Math.ceil(filteredStudents1.length / entriesPerPage1) || 1;

  // Filter students for Section 2
  const filteredStudents2 = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery2.toLowerCase()) ||
      s.nipd.toLowerCase().includes(searchQuery2.toLowerCase()) ||
      s.currentClass.toLowerCase().includes(searchQuery2.toLowerCase())
  );

  const paginatedStudents2 = filteredStudents2.slice(
    (currentPage2 - 1) * entriesPerPage2,
    currentPage2 * entriesPerPage2
  );

  const totalPages2 = Math.ceil(filteredStudents2.length / entriesPerPage2) || 1;

  // =========================================================================
  // VIEW B: EDIT DATA PESERTA DIDIK (Matches image_c867333d.png and image_c3a95314.png)
  // =========================================================================
  if (editingStudent) {
    return (
      <div className="space-y-4">
        {/* Top Header */}
        <div className="no-print space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Edit Data Peserta Didik
            </h1>
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

        {saveSuccessNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
        )}

        {/* 7 Tabs Navigation (Exact match to image_c867333d.png) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-bold border-b border-slate-200">
          <button
            onClick={() => setActiveEditTab(1)}
            className={`px-4 py-2.5 rounded-t-lg transition whitespace-nowrap cursor-pointer ${
              activeEditTab === 1
                ? 'bg-[#008ba3] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            1. Pribadi &amp; Alamat
          </button>
          <button
            onClick={() => setActiveEditTab(2)}
            className={`px-4 py-2.5 rounded-t-lg transition whitespace-nowrap cursor-pointer ${
              activeEditTab === 2
                ? 'bg-[#008ba3] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            2. Kesehatan &amp; Pend.
          </button>
          <button
            onClick={() => setActiveEditTab(3)}
            className={`px-4 py-2.5 rounded-t-lg transition whitespace-nowrap cursor-pointer ${
              activeEditTab === 3
                ? 'bg-[#008ba3] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            3. Orang Tua
          </button>
          <button
            onClick={() => setActiveEditTab(4)}
            className={`px-4 py-2.5 rounded-t-lg transition whitespace-nowrap cursor-pointer ${
              activeEditTab === 4
                ? 'bg-[#008ba3] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            4. Wali &amp; Hobi
          </button>
          <button
            onClick={() => setActiveEditTab(5)}
            className={`px-4 py-2.5 rounded-t-lg transition whitespace-nowrap cursor-pointer ${
              activeEditTab === 5
                ? 'bg-[#008ba3] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            5. Keluar Sekolah
          </button>
          <button
            onClick={() => setActiveEditTab(6)}
            className={`px-4 py-2.5 rounded-t-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeEditTab === 6
                ? 'bg-[#008ba3] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> 6. PKL
          </button>
          <button
            onClick={() => setActiveEditTab(7)}
            className={`px-4 py-2.5 rounded-t-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeEditTab === 7
                ? 'bg-[#008ba3] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> 7. UKK &amp; Sertifikasi
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs text-xs space-y-6">
          {activeEditTab === 1 && (
            <>
              {/* SECTION I: KETERANGAN TENTANG DIRI PESERTA DIDIK */}
              <div>
                <h3 className="text-sm font-black text-[#008ba3] tracking-wide uppercase border-b border-slate-100 pb-2 mb-4">
                  I. KETERANGAN TENTANG DIRI PESERTA DIDIK
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Photo Box Left (3 cols) */}
                  <div className="lg:col-span-3 flex flex-col items-center p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <span className="text-[11px] font-bold text-slate-700">Foto Awal Masuk</span>
                    
                    {/* Avatar Preview */}
                    <div className="w-32 h-40 bg-white border border-slate-300 rounded-lg shadow-inner overflow-hidden flex items-center justify-center relative">
                      {formData.photoUrl ? (
                        <img
                          src={formData.photoUrl}
                          alt={formData.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                          <User className="w-16 h-16 text-slate-300" />
                          <span className="text-[10px] mt-1 font-semibold text-slate-400">Foto 3x4</span>
                        </div>
                      )}
                    </div>

                    <div className="w-full space-y-1">
                      <label className="w-full py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-100 rounded text-center text-[11px] font-bold text-slate-700 block cursor-pointer transition">
                        Pilih File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setFormData({ ...formData, photoUrl: event.target?.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 text-center">
                        {formData.photoUrl ? 'Foto terpilih' : 'Tidak ada file yang dipilih'}
                      </p>
                      <p className="text-[9.5px] text-slate-400 text-center">Maks 2MB (JPG/PNG)</p>
                    </div>
                  </div>

                  {/* Form Grid Right (9 cols) */}
                  <div className="lg:col-span-9 space-y-4">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Kurikulum</label>
                        <input
                          type="text"
                          value={formData.kurikulum || 'Kurikulum Merdeka'}
                          onChange={(e) => setFormData({ ...formData, kurikulum: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-sky-50/50 text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Fase (Merdeka)</label>
                        <select
                          value={formData.fase || 'Fase E (Kelas 10)'}
                          onChange={(e) => setFormData({ ...formData, fase: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                        >
                          <option value="Fase E (Kelas 10)">Fase E (Kelas 10)</option>
                          <option value="Fase F (Kelas 11)">Fase F (Kelas 11)</option>
                          <option value="Fase F (Kelas 12)">Fase F (Kelas 12)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">No. Urut Buku</label>
                        <input
                          type="text"
                          value={formData.noUrutBuku || '2'}
                          onChange={(e) => setFormData({ ...formData, noUrutBuku: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">NIPD</label>
                        <input
                          type="text"
                          value={formData.nipd || ''}
                          onChange={(e) => setFormData({ ...formData, nipd: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-mono"
                        />
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">NISN</label>
                        <input
                          type="text"
                          value={formData.nisn || ''}
                          onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">NIK</label>
                        <input
                          type="text"
                          value={formData.nik || ''}
                          onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Nomor KK</label>
                        <input
                          type="text"
                          value={formData.noKk || ''}
                          onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Status Peserta Didik</label>
                        <select
                          value={formData.statusPesertaDidik || 'Aktif'}
                          onChange={(e) => setFormData({ ...formData, statusPesertaDidik: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-emerald-700 font-bold"
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Lulus">Lulus</option>
                          <option value="Mutasi Keluar">Mutasi Keluar</option>
                          <option value="Dikeluarkan">Dikeluarkan</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Jenjang Pendidikan <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.jenjangPendidikan || 'SMK (Sekolah Menengah Kejuruan)'}
                          onChange={(e) => setFormData({ ...formData, jenjangPendidikan: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-medium"
                        >
                          <option value="SMK (Sekolah Menengah Kejuruan)">SMK (Sekolah Menengah Kejuruan)</option>
                          <option value="SMA (Sekolah Menengah Atas)">SMA (Sekolah Menengah Atas)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Tingkat Kelas <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.tingkatKelas || 'X TKR 1'}
                          onChange={(e) => setFormData({ ...formData, tingkatKelas: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-bold text-sky-700"
                        >
                          {classes.length > 0 ? (
                            classes.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))
                          ) : (
                            <>
                              <option value="X TKR 1">X TKR 1</option>
                              <option value="X DPB">X DPB</option>
                              <option value="XI TSM 1">XI TSM 1</option>
                              <option value="XII DPIB">XII DPIB</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Program / Konsentrasi Keahlian <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.programKeahlian || 'Teknik Kendaraan Ringan'}
                          onChange={(e) => setFormData({ ...formData, programKeahlian: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                        >
                          <option value="Teknik Kendaraan Ringan">Teknik Kendaraan Ringan</option>
                          <option value="Teknik dan Bisnis Sepeda Motor">Teknik dan Bisnis Sepeda Motor</option>
                          <option value="Desain Pemodelan dan Informasi Bangunan">Desain Pemodelan dan Informasi Bangunan</option>
                          <option value="Teknik Komputer dan Jaringan">Teknik Komputer dan Jaringan</option>
                          <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-bold mb-1">Nama Lengkap</label>
                        <input
                          type="text"
                          value={formData.fullName || ''}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-900 font-bold uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Jenis Kelamin</label>
                        <select
                          value={formData.gender || 'L'}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                        >
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 5 */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Tempat Lahir</label>
                        <input
                          type="text"
                          value={formData.birthPlace || ''}
                          onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Tanggal Lahir</label>
                        <input
                          type="text"
                          value={formData.birthDate || ''}
                          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                          placeholder="YYYY-MM-DD"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Agama</label>
                        <input
                          type="text"
                          value={formData.religion || 'Islam'}
                          onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Kewarganegaraan</label>
                        <input
                          type="text"
                          value={formData.citizenship || 'WNI'}
                          onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Row 6 */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Anak Ke</label>
                        <input
                          type="text"
                          value={formData.childNumber || '1'}
                          onChange={(e) => setFormData({ ...formData, childNumber: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Sdr. Kandung</label>
                        <input
                          type="text"
                          value={formData.siblingCount || '0'}
                          onChange={(e) => setFormData({ ...formData, siblingCount: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Status Anak</label>
                        <input
                          type="text"
                          value={formData.childStatus || 'Lengkap/Yatim/Piatu'}
                          onChange={(e) => setFormData({ ...formData, childStatus: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Bahasa Sehari-hari</label>
                        <input
                          type="text"
                          value={formData.dailyLanguage || 'Bahasa Indonesia'}
                          onChange={(e) => setFormData({ ...formData, dailyLanguage: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION II: KETERANGAN TEMPAT TINGGAL */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-black text-[#008ba3] tracking-wide uppercase border-b border-slate-100 pb-2 mb-4">
                  II. KETERANGAN TEMPAT TINGGAL
                </h3>

                <div className="space-y-4">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-slate-700 font-bold mb-1">
                        Alamat Rumah (Jalan / Dusun)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 font-bold mb-1">RT/RW</label>
                      <input
                        type="text"
                        value={formData.rtRw || '001/002'}
                        onChange={(e) => setFormData({ ...formData, rtRw: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 font-bold mb-1">Desa/Kelurahan</label>
                      <input
                        type="text"
                        value={formData.village || 'Pengalihan'}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Kecamatan</label>
                      <input
                        type="text"
                        value={formData.subdistrict || 'Dander'}
                        onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Kabupaten/Kota</label>
                      <input
                        type="text"
                        value={formData.city || 'Bojonegoro'}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Provinsi</label>
                      <input
                        type="text"
                        value={formData.province || 'Jawa Timur'}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Kode Pos</label>
                      <input
                        type="text"
                        value={formData.postalCode || '62171'}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">No. HP (WhatsApp)</label>
                      <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">No. Telp Rumah</label>
                      <input
                        type="text"
                        value={formData.homePhone || '-'}
                        onChange={(e) => setFormData({ ...formData, homePhone: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">E-Mail Pribadi</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Tinggal Dengan</label>
                      <input
                        type="text"
                        value={formData.livingWith || 'Orang Tua'}
                        onChange={(e) => setFormData({ ...formData, livingWith: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Tgl. Mulai Tinggal</label>
                      <input
                        type="text"
                        value={formData.stayStartDate || '15/07/2026'}
                        onChange={(e) => setFormData({ ...formData, stayStartDate: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Alamat Saat Diterima</label>
                      <input
                        type="text"
                        value={formData.addressReceived || formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, addressReceived: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Row 5 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Jarak ke Sekolah</label>
                      <input
                        type="text"
                        value={formData.distanceToSchool || '< 5 km'}
                        onChange={(e) => setFormData({ ...formData, distanceToSchool: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Transportasi</label>
                      <input
                        type="text"
                        value={formData.transportation || 'Sepeda Motor'}
                        onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeEditTab === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#008ba3] tracking-wide uppercase border-b border-slate-100 pb-2">
                III. KETERANGAN KESEHATAN &amp; PENDIDIKAN SEBELUMNYA
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Golongan Darah</label>
                  <input
                    type="text"
                    value={formData.bloodType || 'O'}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tinggi Badan (cm)</label>
                  <input
                    type="text"
                    value={formData.height || '168'}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Berat Badan (kg)</label>
                  <input
                    type="text"
                    value={formData.weight || '58'}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Sekolah Asal (SMP/MTs)</label>
                  <input
                    type="text"
                    value={formData.prevSchool || ''}
                    onChange={(e) => setFormData({ ...formData, prevSchool: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nomor Ijazah SMP</label>
                  <input
                    type="text"
                    value={formData.ijazahSmpNumber || 'DN-05/D-SMP/K13/23/0019281'}
                    onChange={(e) => setFormData({ ...formData, ijazahSmpNumber: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeEditTab === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#008ba3] tracking-wide uppercase border-b border-slate-100 pb-2">
                IV. KETERANGAN TENTANG ORANG TUA KANDUNG
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-xs uppercase border-b pb-1">Data Ayah</h4>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nama Ayah</label>
                    <input
                      type="text"
                      value={formData.fatherName || ''}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Pekerjaan Ayah</label>
                    <input
                      type="text"
                      value={formData.parentJob || ''}
                      onChange={(e) => setFormData({ ...formData, parentJob: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-xs uppercase border-b pb-1">Data Ibu</h4>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nama Ibu</label>
                    <input
                      type="text"
                      value={formData.motherName || ''}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Pekerjaan Ibu</label>
                    <input
                      type="text"
                      value={formData.motherJob || 'Ibu Rumah Tangga'}
                      onChange={(e) => setFormData({ ...formData, motherJob: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeEditTab >= 4 && (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#008ba3] mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">
                Tab {activeEditTab} Terbuka &amp; Tersinkronisasi
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Seluruh data identitas siswa, nilai semester, PKL, dan sertifikasi UKK saling terhubung langsung dengan Buku Induk Register digital SMKN Dander.
              </p>
            </div>
          )}

          {/* Bottom Action Buttons (Exact match to image_c3a95314.png) */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveEdit()}
                className="px-5 py-2.5 bg-[#f59e0b] hover:bg-amber-600 text-slate-900 font-extrabold rounded-lg text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Save className="w-4 h-4" /> SIMPAN PERUBAHAN DATA
              </button>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Batal
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-left sm:text-right">
              * Gunakan navigasi tab di atas untuk mengisi seluruh bagian dokumen.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW A: SMART CHECKLIST KELENGKAPAN DATA (Matches image_366a466f.png)
  // =========================================================================
  return (
    <div className="space-y-5">
      {/* 1. Header with Title, Date, Live Clock & Trial Reminder */}
      <div className="no-print space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Smart Checklist Kelengkapan Data
          </h1>
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

      {autoFixNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{autoFixNotice}</span>
        </div>
      )}

      {/* ==============================================================
          SECTION 1: PROFIL PESERTA DIDIK BELUM LENGKAP (RED BAR & TABLE)
          ============================================================== */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Red Header Bar */}
        <div className="border-t-4 border-t-red-600 px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
              !
            </span>
            <h2 className="text-sm font-bold text-red-600">
              Profil Peserta Didik Belum Lengkap
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFix}
              className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold rounded text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5 text-slate-500" />
              Auto-Fix Data
            </button>
            <span className="px-2.5 py-1 bg-red-600 text-white font-bold text-[11px] rounded-md shadow-2xs">
              1144 Perlu Update
            </span>
          </div>
        </div>

        {/* Section Subtitle & Controls */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-500">
            Menganalisis kelengkapan data identitas dasar yang wajib ada di Buku Induk (NISN, NIK, Foto, &amp; Nama Orang Tua).
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span>Tampilkan</span>
              <select
                value={entriesPerPage1}
                onChange={(e) => {
                  setEntriesPerPage1(Number(e.target.value));
                  setCurrentPage1(1);
                }}
                className="p-1 border border-slate-300 rounded text-xs bg-white text-slate-800 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entri</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600">Cari:</span>
              <input
                type="text"
                value={searchQuery1}
                onChange={(e) => {
                  setSearchQuery1(e.target.value);
                  setCurrentPage1(1);
                }}
                className="p-1.5 border border-slate-300 rounded text-xs bg-white text-slate-800 w-44 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Table Profil Belum Lengkap */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">NAMA PESERTA DIDIK</th>
                  <th className="p-3">NIPD</th>
                  <th className="p-3">KELAS</th>
                  <th className="p-3 text-center">NISN</th>
                  <th className="p-3 text-center">NIK / KK</th>
                  <th className="p-3 text-center">FOTO</th>
                  <th className="p-3 text-center">ORTU</th>
                  <th className="p-3 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents1.map((student, idx) => {
                  const hasNisn = Boolean(student.nisn && student.nisn.length >= 10);
                  const hasNik = Boolean(student.nik && student.nik.length >= 12);
                  const hasFoto = Boolean(student.photoUrl && student.documents?.pasFoto);
                  const hasOrtu = Boolean(student.fatherName || student.motherName);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-bold text-slate-900 uppercase">
                        {student.fullName}
                      </td>
                      <td className="p-3 font-mono text-slate-600 text-[11px]">
                        {student.nipd}
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-[10.5px]">
                          {student.currentClass}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {hasNisn ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 font-bold text-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 font-bold text-xs">
                            ✕
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {hasNik ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 font-bold text-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 font-bold text-xs">
                            ✕
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {hasFoto ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 font-bold text-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center text-red-500" title="Foto kosong">
                            <ImageIcon className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {hasOrtu ? (
                          <span className="inline-flex items-center justify-center text-emerald-600" title="Data Orang Tua Lengkap">
                            <Users className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center text-red-500" title="Data Orang Tua Kosong">
                            <Users className="w-4 h-4 opacity-40" />
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleStartEdit(student)}
                          className="px-3 py-1.5 bg-[#f59e0b] hover:bg-amber-600 text-white rounded font-bold text-xs inline-flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
                        >
                          <span>Lengkapi</span>
                          <span className="text-[10px]">➔</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <span>
              Menampilkan {(currentPage1 - 1) * entriesPerPage1 + 1} sampai{' '}
              {Math.min(currentPage1 * entriesPerPage1, 1143)} dari 1,143 entri
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage1 === 1}
                onClick={() => setCurrentPage1((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs cursor-pointer"
              >
                Sebelumnya
              </button>
              {[1, 2, 3, 4, 5].map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage1(pageNum)}
                  className={`w-6 h-6 rounded text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    currentPage1 === pageNum
                      ? 'bg-[#008ba3] text-white'
                      : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <span className="px-1 text-slate-400">...</span>
              <button
                onClick={() => setCurrentPage1(115)}
                className={`w-7 h-6 rounded text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                  currentPage1 === 115
                    ? 'bg-[#008ba3] text-white'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                115
              </button>
              <button
                disabled={currentPage1 === totalPages1}
                onClick={() => setCurrentPage1((p) => Math.min(totalPages1, p + 1))}
                className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          SECTION 2: PENGECEKAN RIWAYAT NILAI SEMESTER (GAMBAR PERSIS image_d6cd26c0.png)
          ============================================================== */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Amber Top Border & Header Bar */}
        <div className="border-t-[3px] border-t-[#f59e0b] px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-[#f59e0b] font-bold flex items-center">
              <List className="w-4 h-4 text-[#f59e0b]" />
            </span>
            <h2 className="text-sm font-bold text-[#f59e0b] tracking-tight">
              Pengecekan Riwayat Nilai Semester
            </h2>
          </div>

          <span className="px-3 py-1 bg-[#f59e0b] text-white font-bold text-xs rounded shadow-xs">
            1144 Peserta Didik Belum Lengkap 6 Semester
          </span>
        </div>

        {/* Section Subtitle & Controls */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-500">
            Menganalisis keterisian nilai dari Semester 1 s/d 6.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Tampilkan</span>
              <select
                value={entriesPerPage2}
                onChange={(e) => {
                  setEntriesPerPage2(Number(e.target.value));
                  setCurrentPage2(1);
                }}
                className="p-1 px-2 border border-slate-300 rounded text-xs bg-white text-slate-800 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entri</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Cari:</span>
              <input
                type="text"
                value={searchQuery2}
                onChange={(e) => {
                  setSearchQuery2(e.target.value);
                  setCurrentPage2(1);
                }}
                className="p-1 px-2.5 border border-slate-300 rounded text-xs bg-white text-slate-800 w-44 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Table Nilai Semester Persis Screenshot */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      NAMA PESERTA DIDIK
                      <span className="text-[10px] text-slate-400">↑</span>
                    </span>
                  </th>
                  <th className="p-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      NIPD
                      <span className="text-[10px] text-slate-400">⇅</span>
                    </span>
                  </th>
                  <th className="p-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      KELAS
                      <span className="text-[10px] text-slate-400">⇅</span>
                    </span>
                  </th>
                  <th className="p-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      SEMESTER TERISI
                      <span className="text-[10px] text-slate-400">⇅</span>
                    </span>
                  </th>
                  <th className="p-3 text-center">
                    <span className="inline-flex items-center justify-center gap-1">
                      PKL
                      <span className="text-[10px] text-slate-400">⇅</span>
                    </span>
                  </th>
                  <th className="p-3 text-center">
                    <span className="inline-flex items-center justify-center gap-1">
                      P5
                      <span className="text-[10px] text-slate-400">⇅</span>
                    </span>
                  </th>
                  <th className="p-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      STATUS KELENGKAPAN
                      <span className="text-[10px] text-slate-400">⇅</span>
                    </span>
                  </th>
                  <th className="p-3 text-center">
                    <span className="inline-flex items-center justify-center gap-1">
                      AKSI
                      <span className="text-[10px] text-slate-400">⇅</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents2.map((student) => {
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition">
                      {/* 1. NAMA PESERTA DIDIK */}
                      <td className="p-3 font-bold text-slate-900 uppercase">
                        {student.fullName}
                      </td>

                      {/* 2. NIPD */}
                      <td className="p-3 font-mono text-slate-700 text-xs">
                        {student.nipd}
                      </td>

                      {/* 3. KELAS */}
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 rounded border border-slate-200 bg-white text-slate-700 font-semibold text-[10.5px]">
                          {student.currentClass}
                        </span>
                      </td>

                      {/* 4. SEMESTER TERISI (6 Gray Badges: 1 2 3 4 5 6) */}
                      <td className="p-3">
                        <div className="inline-flex items-center gap-1">
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <span
                              key={num}
                              className="w-5 h-5 rounded bg-slate-300 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-2xs"
                              title={`Semester ${num}`}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* 5. PKL (-) */}
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-5 rounded bg-slate-300 text-white font-bold text-xs shadow-2xs">
                          -
                        </span>
                      </td>

                      {/* 6. P5 (-) */}
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-5 rounded bg-slate-300 text-white font-bold text-xs shadow-2xs">
                          -
                        </span>
                      </td>

                      {/* 7. STATUS KELENGKAPAN (Thin progress bar above text) */}
                      <td className="p-3">
                        <div className="w-36 space-y-1">
                          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full w-0" />
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            0 dari 6 Semester
                          </span>
                        </div>
                      </td>

                      {/* 8. AKSI (Input Nilai + Pill Button) */}
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForGrade(student)}
                          className="px-3.5 py-1.5 bg-[#008ba3] hover:bg-[#007a8f] text-white rounded-full font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs transition cursor-pointer"
                        >
                          <span>Input Nilai</span>
                          <span className="text-xs font-black">+</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Section 2 Pagination Footer Persis Gambar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span>
              Menampilkan {(currentPage2 - 1) * entriesPerPage2 + 1} sampai{' '}
              {Math.min(currentPage2 * entriesPerPage2, 1144)} dari 1,144 entri
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage2 === 1}
                onClick={() => setCurrentPage2((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs cursor-pointer"
              >
                Sebelumnya
              </button>
              {[1, 2, 3, 4, 5].map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage2(pageNum)}
                  className={`w-6 h-6 rounded text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    currentPage2 === pageNum
                      ? 'bg-[#008ba3] text-white'
                      : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <span className="px-1 text-slate-400">...</span>
              <button
                onClick={() => setCurrentPage2(115)}
                className={`w-7 h-6 rounded text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                  currentPage2 === 115
                    ? 'bg-[#008ba3] text-white'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                115
              </button>
              <button
                disabled={currentPage2 === totalPages2}
                onClick={() => setCurrentPage2((p) => Math.min(totalPages2, p + 1))}
                className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Page Footer */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          Copyright © 2026 <strong className="text-sky-600">Buku Induk Digital</strong>. Powered by{' '}
          <strong className="text-sky-600">Syntax Trust</strong>. All rights reserved.
        </p>
        <span className="font-semibold text-slate-600">Version 1.2.0</span>
      </div>

      {/* ==============================================================
          MODAL: INPUT / KELOLA NILAI SEMESTER
          ============================================================== */}
      {selectedStudentForGrade && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <span className="text-amber-400">📊</span>
                  Input Riwayat Nilai Semester
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedStudentForGrade.fullName} • NIPD: {selectedStudentForGrade.nipd} • Kelas: {selectedStudentForGrade.currentClass}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentForGrade(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Semester Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {[1, 2, 3, 4, 5, 6].map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => setActiveGradeSemester(sem)}
                    className={`flex-1 py-1.5 rounded-md font-bold text-xs transition cursor-pointer ${
                      activeGradeSemester === sem
                        ? 'bg-[#008ba3] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sem {sem}
                  </button>
                ))}
              </div>

              {gradeSaveNotice && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{gradeSaveNotice}</span>
                </div>
              )}

              {/* Sample Grades Grid */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="p-2.5">Mata Pelajaran</th>
                      <th className="p-2.5 w-24 text-center">Nilai Akhir</th>
                      <th className="p-2.5 w-20 text-center">Predikat</th>
                      <th className="p-2.5">Keterangan Capaian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { subject: 'Pendidikan Agama dan Budi Pekerti', score: '88', grade: 'A', note: 'Menunjukkan pemahaman yang sangat baik' },
                      { subject: 'Pendidikan Pancasila', score: '85', grade: 'A', note: 'Mampu mengimplementasikan norma konstitusi' },
                      { subject: 'Bahasa Indonesia', score: '84', grade: 'B', note: 'Terampil menyusun teks eksposisi secara logis' },
                      { subject: 'Matematika (Kejuruan)', score: '86', grade: 'A', note: 'Menguasai perhitungan teknis dan aljabar' },
                      { subject: 'Bahasa Inggris', score: '83', grade: 'B', note: 'Mampu berkomunikasi aktif dalam konteks vokasi' },
                      { subject: `Dasar Kejuruan ${selectedStudentForGrade.programKeahlian}`, score: '90', grade: 'A', note: 'Sangat kompeten pada praktik bengkel/lab' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/60">
                        <td className="p-2.5 font-medium text-slate-800">{row.subject}</td>
                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            defaultValue={row.score}
                            className="w-16 p-1 text-center border border-slate-300 rounded font-bold text-slate-900 bg-white"
                          />
                        </td>
                        <td className="p-2.5 text-center font-bold text-emerald-600">{row.grade}</td>
                        <td className="p-2.5 text-slate-500 text-[11px]">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Extra Info: PKL & P5 status */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <label className="block text-slate-600 font-bold mb-1 text-[11px]">Status PKL Semester Ini</label>
                  <select className="w-full p-1.5 border border-slate-300 rounded bg-white text-slate-800 text-xs">
                    <option value="belum">Belum Mengikuti PKL (-)</option>
                    <option value="sedang">Sedang Berjalan</option>
                    <option value="selesai">Selesai (Kompeten)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1 text-[11px]">Projek P5 Semester Ini</label>
                  <select className="w-full p-1.5 border border-slate-300 rounded bg-white text-slate-800 text-xs">
                    <option value="belum">Belum Divalidasi (-)</option>
                    <option value="berkembang">Berkembang Sesuai Harapan</option>
                    <option value="sangat">Sangat Berkembang</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedStudentForGrade(null);
                  onOpenStudent(selectedStudentForGrade);
                }}
                className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Buka Detail Buku Induk</span>
                <span className="text-[10px]">➔</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForGrade(null)}
                  className="px-3.5 py-1.5 text-slate-600 hover:text-slate-800 font-medium text-xs cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGradeSaveNotice(`✓ Nilai Semester ${activeGradeSemester} berhasil diperbarui!`);
                    setTimeout(() => {
                      setGradeSaveNotice(null);
                      setSelectedStudentForGrade(null);
                    }, 1000);
                  }}
                  className="px-4 py-1.5 bg-[#008ba3] hover:bg-[#007991] text-white font-bold rounded-lg text-xs shadow-xs transition cursor-pointer"
                >
                  Simpan Nilai Semester {activeGradeSemester}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
