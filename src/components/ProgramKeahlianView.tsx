import React, { useState, useEffect } from 'react';
import { ProgramKeahlian, SchoolSettings } from '../types';
import {
  Landmark,
  Cpu,
  Award,
  GraduationCap,
  Plus,
  PlusCircle,
  FileEdit,
  Trash2,
  Tag,
  Wrench,
  Search,
  ArrowUpDown,
  X,
  RotateCcw,
  Save,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Layers,
  Network,
} from 'lucide-react';

interface ProgramKeahlianViewProps {
  programs: ProgramKeahlian[];
  schoolSettings: SchoolSettings;
  onUpdatePrograms: (programs: ProgramKeahlian[]) => void;
  onAddAuditLog?: (action: string, details: string) => void;
}

export const ProgramKeahlianView: React.FC<ProgramKeahlianViewProps> = ({
  programs,
  schoolSettings,
  onUpdatePrograms,
  onAddAuditLog,
}) => {
  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<keyof ProgramKeahlian>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    konsentrasi: string;
    description: string;
  }>({
    code: '',
    name: '',
    konsentrasi: '',
    description: '',
  });

  const [selectedProgram, setSelectedProgram] = useState<ProgramKeahlian | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Live Clock (matching reference header badge)
  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Sorting Handler
  const handleSort = (field: keyof ProgramKeahlian) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered & Sorted Programs
  const filteredPrograms = programs
    .filter((p) => {
      const q = searchTerm.toLowerCase();
      const code = p.code.toLowerCase();
      const name = p.name.toLowerCase();
      const kons = (p.konsentrasi || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return code.includes(q) || name.includes(q) || kons.includes(q) || desc.includes(q);
    })
    .sort((a, b) => {
      const valA = (a[sortField] || '').toString().toLowerCase();
      const valB = (b[sortField] || '').toString().toLowerCase();
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination calculations
  const totalEntries = filteredPrograms.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedPrograms = filteredPrograms.slice(startIndex, startIndex + entriesPerPage);

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      code: '',
      name: '',
      konsentrasi: '',
      description: 'Otomatis dari Import Dapodik',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (program: ProgramKeahlian) => {
    setSelectedProgram(program);
    setFormData({
      code: program.code,
      name: program.name,
      konsentrasi: program.konsentrasi || program.name,
      description: program.description || 'Otomatis dari Import Dapodik',
    });
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (program: ProgramKeahlian) => {
    setSelectedProgram(program);
    setIsDeleteModalOpen(true);
  };

  // Submit Add Program
  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim() || !formData.konsentrasi.trim()) {
      alert('Mohon lengkapi seluruh kolom yang bertanda bintang (*)');
      return;
    }

    const upperCode = formData.code.trim().toUpperCase();
    if (programs.some((p) => p.code.toUpperCase() === upperCode)) {
      alert(`Kode Program Keahlian "${upperCode}" sudah terdaftar. Gunakan kode lain!`);
      return;
    }

    const newProg: ProgramKeahlian = {
      code: upperCode,
      name: formData.name.trim(),
      konsentrasi: formData.konsentrasi.trim(),
      description: formData.description.trim() || 'Otomatis dari Import Dapodik',
      headOfProgram: `Kajur ${upperCode}`,
      totalStudents: 30,
      category: 'Pendidikan Vokasi',
    };

    const updatedList = [...programs, newProg];
    onUpdatePrograms(updatedList);
    setIsAddModalOpen(false);
    showNotification(`Program Keahlian "${newProg.name}" (${newProg.code}) berhasil ditambahkan!`);
    if (onAddAuditLog) {
      onAddAuditLog('Tambah Program Keahlian', `Menambahkan program ${newProg.code} - ${newProg.name}`);
    }
  };

  // Submit Edit Program
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;

    if (!formData.code.trim() || !formData.name.trim() || !formData.konsentrasi.trim()) {
      alert('Mohon lengkapi seluruh kolom yang bertanda bintang (*)');
      return;
    }

    const updatedList = programs.map((p) => {
      if (p.code === selectedProgram.code) {
        return {
          ...p,
          code: formData.code.trim().toUpperCase(),
          name: formData.name.trim(),
          konsentrasi: formData.konsentrasi.trim(),
          description: formData.description.trim() || 'Otomatis dari Import Dapodik',
        };
      }
      return p;
    });

    onUpdatePrograms(updatedList);
    setIsEditModalOpen(false);
    showNotification(`Data Program Keahlian "${formData.code}" berhasil diperbarui!`);
    if (onAddAuditLog) {
      onAddAuditLog('Ubah Program Keahlian', `Memperbarui data program ${selectedProgram.code} ke ${formData.code}`);
    }
  };

  // Confirm Delete Program
  const handleConfirmDelete = () => {
    if (!selectedProgram) return;

    const updatedList = programs.filter((p) => p.code !== selectedProgram.code);
    onUpdatePrograms(updatedList);
    setIsDeleteModalOpen(false);
    showNotification(`Program Keahlian "${selectedProgram.code}" berhasil dihapus!`);
    if (onAddAuditLog) {
      onAddAuditLog('Hapus Program Keahlian', `Menghapus program ${selectedProgram.code} - ${selectedProgram.name}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Title & Date/Clock Badges (Exact match to image_9bcee35f.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Data Program Keahlian</h1>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold">
          <div className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>26 Oct 2026</span>
          </div>

          <div className="bg-[#0f172a] text-white font-mono px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Stat Cards (3 Cards Row - Exact Match to image_9bcee35f.png) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: TOTAL PROGRAM KEAHLIAN (Cyan) */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-[#0284c7] p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#0284c7] uppercase tracking-wider block">
              TOTAL PROGRAM KEAHLIAN
            </span>
            <div className="text-3xl font-black text-slate-900">{programs.length}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Kompetensi Kejuruan Terdaftar</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#0284c7] flex items-center justify-center text-white shadow-sm shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: KONSENTRASI KEAHLIAN (Purple) */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-purple-600 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">
              KONSENTRASI KEAHLIAN
            </span>
            <div className="text-3xl font-black text-slate-900">{programs.length}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
              <Network className="w-3.5 h-3.5 text-slate-400" />
              <span>Spesialisasi Vokasi</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: JENJANG PENDIDIKAN (Green) */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
              JENJANG PENDIDIKAN
            </span>
            <div className="text-3xl font-black text-slate-900">{schoolSettings.activeJenjang || 'SMK'}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span>Pendidikan Vokasi & Kejuruan</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Main Container Card (Exact match to image_9bcee35f.png) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        {/* Card Header: Title & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#0284c7]" />
              <h3 className="font-bold text-sm text-slate-900">Daftar Program Keahlian Terdaftar</h3>
            </div>
            <p className="text-xs text-slate-500 pl-6">
              Kelola master data program studi, kode singkatan, dan konsentrasi spesialisasi kejuruan
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#0284c7] hover:bg-sky-600 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Program Keahlian Baru</span>
          </button>
        </div>

        {/* Table Controls: Entries per page & Live Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-2">
            <span>Tampilkan</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-slate-300 rounded-md text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entri</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Cari:</span>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-44 sm:w-56 px-2.5 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10.5px]">
              <tr>
                <th
                  onClick={() => handleSort('code')}
                  className="p-3 w-28 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>KODE</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>PROGRAM KEAHLIAN</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('konsentrasi')}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>KONSENTRASI KEAHLIAN</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('description')}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>DESKRIPSI / KETERANGAN</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 w-24 text-center select-none">
                  <div className="flex items-center justify-center gap-1">
                    <span>AKSI</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPrograms.length > 0 ? (
                paginatedPrograms.map((item) => (
                  <tr key={item.code} className="hover:bg-slate-50/80 transition">
                    {/* 1. KODE (Cyan Badge) */}
                    <td className="p-3">
                      <span className="inline-block px-2.5 py-1 bg-[#0284c7] text-white font-bold text-[11px] rounded-md tracking-wider">
                        {item.code}
                      </span>
                    </td>

                    {/* 2. PROGRAM KEAHLIAN (Graduation Cap + Name) */}
                    <td className="p-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                    </td>

                    {/* 3. KONSENTRASI KEAHLIAN (Wrench Tool Badge) */}
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-50 border border-cyan-300 text-[#0284c7] rounded-md font-semibold text-[11px]">
                        <Wrench className="w-3 h-3 text-[#0284c7]" />
                        <span>{item.konsentrasi || item.name}</span>
                      </span>
                    </td>

                    {/* 4. DESKRIPSI / KETERANGAN */}
                    <td className="p-3 text-slate-500 text-xs">
                      {item.description || 'Otomatis dari Import Dapodik'}
                    </td>

                    {/* 5. AKSI (Edit Amber + Delete Red) */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Ubah Data"
                          className="w-7 h-7 bg-[#f59e0b] hover:bg-amber-600 text-white rounded flex items-center justify-center shadow-2xs transition cursor-pointer"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(item)}
                          title="Hapus Data"
                          className="w-7 h-7 bg-[#ef4444] hover:bg-rose-600 text-white rounded flex items-center justify-center shadow-2xs transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Tidak ada program keahlian yang cocok dengan pencarian "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Info & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-1">
          <div>
            Menampilkan {totalEntries > 0 ? startIndex + 1 : 0} sampai{' '}
            {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri
          </div>

          <div className="flex items-center gap-1 self-start sm:self-auto">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border rounded-md font-medium text-xs transition cursor-pointer ${
                currentPage === 1
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Sebelumnya
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={`page-${i + 1}`}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-md font-bold text-xs flex items-center justify-center transition cursor-pointer ${
                  currentPage === i + 1
                    ? 'bg-[#0284c7] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1.5 border rounded-md font-medium text-xs transition cursor-pointer ${
                currentPage === totalPages || totalPages === 0
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          MODAL: TAMBAH PROGRAM KEAHLIAN BARU (Exact to image_21bd439b.png)
          ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header (Cyan #0284c7) */}
            <div className="bg-[#0284c7] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-wide">Tambah Program Keahlian Baru</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveNew} className="p-6 space-y-4 text-xs">
              {/* Row 1: Kode Singkatan & Nama Lengkap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[11px] text-slate-700 uppercase mb-1">
                    KODE SINGKATAN <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <Tag className="w-4 h-4 text-[#0284c7]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="CONTOH: TKJ"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[11px] text-slate-700 uppercase mb-1">
                    NAMA LENGKAP PROGRAM KEAHLIAN <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <Landmark className="w-4 h-4 text-[#0284c7]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Teknik Komputer & Jaringan"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Konsentrasi Keahlian */}
              <div>
                <label className="block font-bold text-[11px] text-slate-700 uppercase mb-1">
                  KONSENTRASI KEAHLIAN <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Cpu className="w-4 h-4 text-[#0284c7]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.konsentrasi}
                    onChange={(e) => setFormData({ ...formData, konsentrasi: e.target.value })}
                    placeholder="Contoh: Teknik Komputer dan Jaringan"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <p className="text-[10.5px] text-slate-400 mt-1">
                  Spesialisasi paket keahlian pada kurikulum merdeka.
                </p>
              </div>

              {/* Row 3: Deskripsi Singkat / Profil Lulusan */}
              <div>
                <label className="block font-bold text-[11px] text-slate-700 uppercase mb-1">
                  DESKRIPSI SINGKAT / PROFIL LULUSAN
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan tambahan profil lulusan kejuruan atau catatan kompetensi..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#64748b] hover:bg-slate-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Batal</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        code: '',
                        name: '',
                        konsentrasi: '',
                        description: 'Otomatis dari Import Dapodik',
                      })
                    }
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0284c7] hover:bg-sky-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Data</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: UBAH DATA PROGRAM KEAHLIAN (Exact to image_ea517154.png)
          ======================================================== */}
      {isEditModalOpen && selectedProgram && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header (Cyan #0284c7) */}
            <div className="bg-[#0284c7] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-wide">Ubah Data Program Keahlian</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              {/* Row 1: Kode Singkatan & Nama Lengkap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[11px] text-slate-700 uppercase mb-1">
                    KODE SINGKATAN <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <Tag className="w-4 h-4 text-[#0284c7]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[11px] text-slate-700 uppercase mb-1">
                    NAMA LENGKAP PROGRAM KEAHLIAN <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <Landmark className="w-4 h-4 text-[#0284c7]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Konsentrasi Keahlian */}
              <div>
                <label className="block font-bold text-[11px] text-slate-700 uppercase mb-1">
                  KONSENTRASI KEAHLIAN <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Cpu className="w-4 h-4 text-[#0284c7]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.konsentrasi}
                    onChange={(e) => setFormData({ ...formData, konsentrasi: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <p className="text-[10.5px] text-slate-400 mt-1">
                  Spesialisasi paket keahlian pada kurikulum merdeka.
                </p>
              </div>

              {/* Row 3: Deskripsi Singkat / Profil Lulusan */}
              <div>
                <label className="block font-bold text-[11px] text-slate-700 uppercase mb-1">
                  DESKRIPSI SINGKAT / PROFIL LULUSAN
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-[#64748b] hover:bg-slate-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Batal</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        code: selectedProgram.code,
                        name: selectedProgram.name,
                        konsentrasi: selectedProgram.konsentrasi || selectedProgram.name,
                        description: selectedProgram.description || 'Otomatis dari Import Dapodik',
                      })
                    }
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#f59e0b] hover:bg-amber-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Perbarui Data</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: KONFIRMASI HAPUS PROGRAM KEAHLIAN
          ======================================================== */}
      {isDeleteModalOpen && selectedProgram && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Konfirmasi Hapus Program Keahlian</h3>
                <p className="text-[11px] text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data program keahlian{' '}
              <strong className="text-slate-900">
                "{selectedProgram.name}" ({selectedProgram.code})
              </strong>
              ? Seluruh riwayat dan spesialisasi terkait akan dilepas dari sistem.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
              >
                Hapus Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
