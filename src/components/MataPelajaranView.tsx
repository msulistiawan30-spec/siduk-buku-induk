import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Layers,
  Target,
  ArrowUpDown,
  GraduationCap,
  Plus,
  PlusCircle,
  RotateCcw,
  Save,
  X,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  School,
  Award,
  Cpu,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { ProgramKeahlian } from '../types';

export interface MataPelajaranItem {
  id: string;
  nama: string;
  kelompok: string; // 'Kelompok A (Wajib)' | 'Kelompok B (Mulok)' | 'C1 Dasar Bidang' | 'C2 Dasar Program' | 'C3 Konsentrasi'
  kktp: number;
  urutan: number;
  programKeahlian: string; // '-- Semua Program Keahlian (Umum) --' or specific program
  tingkat: string[]; // ['Kelas X', 'Kelas XI', 'Kelas XII']
}

interface MataPelajaranViewProps {
  programs?: ProgramKeahlian[];
}

export const MataPelajaranView: React.FC<MataPelajaranViewProps> = ({ programs = [] }) => {
  // Load data from localStorage or default to empty array (matching user screenshot)
  const [mapelList, setMapelList] = useState<MataPelajaranItem[]>(() => {
    try {
      const saved = localStorage.getItem('siduk_mata_pelajaran');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse siduk_mata_pelajaran', e);
    }
    return [];
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('siduk_mata_pelajaran', JSON.stringify(mapelList));
  }, [mapelList]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MataPelajaranItem | null>(null);

  // Filter & Search
  const [activeFilter, setActiveFilter] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const defaultFormData = {
    nama: '',
    kelompok: 'Kelompok A (Wajib)',
    kktp: 78,
    urutan: mapelList.length + 1 || 1,
    programKeahlian: '-- Semua Program Keahlian (Umum) --',
    tingkat: ['Kelas X', 'Kelas XI', 'Kelas XII'],
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Available program options
  const defaultPrograms = [
    'Desain Komunikasi Visual',
    'Desain Pemodelan dan Informasi Bangunan',
    'Layanan Perbankan Syariah',
    'Teknik Kendaraan Ringan',
    'Teknik Ketenagalistrikan',
    'Teknik Pengelasan',
    'Teknik Sepeda Motor',
  ];

  const programOptions = useMemo(() => {
    if (programs && programs.length > 0) {
      return programs.map((p) => p.name);
    }
    return defaultPrograms;
  }, [programs]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      nama: '',
      kelompok: 'Kelompok A (Wajib)',
      kktp: 78,
      urutan: mapelList.length + 1,
      programKeahlian: '-- Semua Program Keahlian (Umum) --',
      tingkat: ['Kelas X', 'Kelas XI', 'Kelas XII'],
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: MataPelajaranItem) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      kelompok: item.kelompok,
      kktp: item.kktp,
      urutan: item.urutan,
      programKeahlian: item.programKeahlian,
      tingkat: [...item.tingkat],
    });
    setIsModalOpen(true);
  };

  // Reset Form
  const handleResetForm = () => {
    if (editingItem) {
      setFormData({
        nama: editingItem.nama,
        kelompok: editingItem.kelompok,
        kktp: editingItem.kktp,
        urutan: editingItem.urutan,
        programKeahlian: editingItem.programKeahlian,
        tingkat: [...editingItem.tingkat],
      });
    } else {
      setFormData({
        nama: '',
        kelompok: 'Kelompok A (Wajib)',
        kktp: 78,
        urutan: mapelList.length + 1,
        programKeahlian: '-- Semua Program Keahlian (Umum) --',
        tingkat: ['Kelas X', 'Kelas XI', 'Kelas XII'],
      });
    }
  };

  // Toggle Class Level in Checkbox
  const handleToggleTingkat = (val: string) => {
    setFormData((prev) => {
      if (prev.tingkat.includes(val)) {
        if (prev.tingkat.length === 1) return prev; // Keep at least one
        return { ...prev, tingkat: prev.tingkat.filter((t) => t !== val) };
      } else {
        return { ...prev, tingkat: [...prev.tingkat, val] };
      }
    });
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      alert('Nama mata pelajaran wajib diisi!');
      return;
    }

    if (editingItem) {
      // Update
      const updatedList = mapelList.map((m) =>
        m.id === editingItem.id
          ? {
              ...m,
              nama: formData.nama.trim(),
              kelompok: formData.kelompok,
              kktp: formData.kktp,
              urutan: Number(formData.urutan),
              programKeahlian: formData.programKeahlian,
              tingkat: formData.tingkat,
            }
          : m
      );
      setMapelList(updatedList);
      showToast(`Mata pelajaran "${formData.nama}" berhasil diperbarui.`);
    } else {
      // Create new
      const newItem: MataPelajaranItem = {
        id: 'mp-' + Date.now(),
        nama: formData.nama.trim(),
        kelompok: formData.kelompok,
        kktp: formData.kktp,
        urutan: Number(formData.urutan),
        programKeahlian: formData.programKeahlian,
        tingkat: formData.tingkat,
      };
      setMapelList((prev) => [...prev, newItem]);
      showToast(`Mata pelajaran "${formData.nama}" berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  // Delete Handler
  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mata pelajaran "${nama}"?`)) {
      setMapelList((prev) => prev.filter((m) => m.id !== id));
      showToast(`Mata pelajaran "${nama}" telah dihapus.`);
    }
  };

  // Toast Helper
  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Metrics Calculation
  const totalMapel = mapelList.length;
  const kelompokACount = mapelList.filter((m) => m.kelompok.includes('Kelompok A') || m.kelompok.includes('Wajib')).length;
  const kejuruanCount = mapelList.filter(
    (m) => m.kelompok.startsWith('C') || m.kelompok.toLowerCase().includes('kejuruan')
  ).length;
  const avgKktp =
    mapelList.length > 0
      ? Math.round((mapelList.reduce((acc, curr) => acc + (curr.kktp || 0), 0) / mapelList.length) * 10) / 10
      : 78;

  // Filtered Mapel
  const filteredMapel = useMemo(() => {
    return mapelList.filter((m) => {
      // Category filter
      let matchesCategory = true;
      if (activeFilter === 'Wajib (A)') {
        matchesCategory = m.kelompok.includes('Kelompok A') || m.kelompok.includes('Wajib');
      } else if (activeFilter === 'Mulok (B)') {
        matchesCategory = m.kelompok.includes('Kelompok B') || m.kelompok.includes('Mulok');
      } else if (activeFilter === 'C1 Dasar Bidang') {
        matchesCategory = m.kelompok.includes('C1');
      } else if (activeFilter === 'C2 Dasar Program') {
        matchesCategory = m.kelompok.includes('C2');
      } else if (activeFilter === 'C3 Konsentrasi') {
        matchesCategory = m.kelompok.includes('C3');
      }

      // Search filter
      const matchesSearch =
        searchTerm.trim() === '' ||
        m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.kelompok.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.programKeahlian.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [mapelList, activeFilter, searchTerm]);

  // Paginated Mapel
  const totalPages = Math.ceil(filteredMapel.length / entriesPerPage) || 1;
  const paginatedMapel = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredMapel.slice(start, start + entriesPerPage);
  }, [filteredMapel, currentPage, entriesPerPage]);

  return (
    <section className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Top Header with Title, URL, and Date/Time Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Data Mata Pelajaran</h1>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>29 Oct 2026</span>
            <Clock className="w-3.5 h-3.5 text-sky-400 ml-1" />
            <span>08:10:09</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-[#008ba3] hover:bg-[#007a91] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Tambah Mapel Baru
        </button>
      </div>

      {/* 4 Stat Cards Persis Gambar Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Mata Pelajaran */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-[#008ba3] p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-sky-700 tracking-wider block">
              TOTAL MATA PELAJARAN
            </span>
            <div className="text-2xl font-black text-slate-900">{totalMapel}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Seluruh Kurikulum
            </div>
          </div>
          <div className="w-11 h-11 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Kelompok A (Wajib) */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
              KELOMPOK A (WAJIB)
            </span>
            <div className="text-2xl font-black text-slate-900">{kelompokACount}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">✔</span> Muatan Nasional
            </div>
          </div>
          <div className="w-11 h-11 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xs">
            <div className="w-4 h-4 rounded-full border-2 border-white" />
          </div>
        </div>

        {/* Card 3: Kejuruan (C1, C2, C3) */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-purple-500 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider block">
              KEJURUAN (C1, C2, C3)
            </span>
            <div className="text-2xl font-black text-slate-900">{kejuruanCount}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-slate-400" /> Keahlian SMK
            </div>
          </div>
          <div className="w-11 h-11 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-xs">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Standar KKTP / KKM */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-amber-500 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block">
              STANDAR KKTP / KKM
            </span>
            <div className="text-2xl font-black text-slate-900">{avgKktp}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-slate-400" /> Rata-rata Ketuntasan
            </div>
          </div>
          <div className="w-11 h-11 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-xs">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card (Persis Gambar Screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        {/* Card Header & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <School className="w-5 h-5 text-[#008ba3]" />
              Daftar Mata Pelajaran
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola kurikulum, kelompok mata pelajaran, urutan rapor, serta alokasi konsentrasi kejuruan
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-[#008ba3] hover:bg-[#007a91] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Tambah Mapel Baru
          </button>
        </div>

        {/* Filter Kelompok Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> FILTER KELOMPOK:
          </span>
          {[
            { id: 'Semua', label: `Semua (${mapelList.length})` },
            { id: 'Wajib (A)', label: 'Wajib (A)' },
            { id: 'Mulok (B)', label: 'Mulok (B)' },
            { id: 'C1 Dasar Bidang', label: 'C1 Dasar Bidang' },
            { id: 'C2 Dasar Program', label: 'C2 Dasar Program' },
            { id: 'C3 Konsentrasi', label: 'C3 Konsentrasi' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  isActive
                    ? 'bg-[#008ba3] text-white border-[#008ba3] shadow-2xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Table Controls: Tampilkan Entries & Cari */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Tampilkan</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-[#008ba3]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>data</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Cari Mata Pelajaran:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Ketik nama / kelompok..."
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-[#008ba3] w-48 sm:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5 text-center w-20">NO. URUT ⇅</th>
                <th className="p-3.5 w-36">KELOMPOK ⇅</th>
                <th className="p-3.5">NAMA MATA PELAJARAN ⇅</th>
                <th className="p-3.5 text-center w-24">KKTP ⇅</th>
                <th className="p-3.5 text-center w-36">TINGKAT ⇅</th>
                <th className="p-3.5 w-52">PERUNTUKAN JURUSAN ⇅</th>
                <th className="p-3.5 text-center w-24">AKSI ⇅</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedMapel.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    Tidak ada data mata pelajaran
                  </td>
                </tr>
              ) : (
                paginatedMapel.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 text-center font-mono font-bold text-slate-500">{m.urutan}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                          m.kelompok.includes('Wajib') || m.kelompok.includes('Kelompok A')
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : m.kelompok.includes('Mulok')
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : 'bg-purple-50 text-purple-800 border-purple-200'
                        }`}
                      >
                        {m.kelompok}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{m.nama}</td>
                    <td className="p-3.5 text-center font-mono font-bold text-amber-700 bg-amber-50/50">
                      {m.kktp}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {m.tingkat.map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-semibold border border-slate-200"
                          >
                            {t.replace('Kelas ', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 text-[11px]">{m.programKeahlian}</td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          title="Ubah Mata Pelajaran"
                          onClick={() => handleOpenEditModal(m)}
                          className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded shadow-xs cursor-pointer transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Hapus Mata Pelajaran"
                          onClick={() => handleDelete(m.id, m.nama)}
                          className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded shadow-xs cursor-pointer transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2">
          <div>
            Menampilkan {filteredMapel.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} sampai{' '}
            {Math.min(currentPage * entriesPerPage, filteredMapel.length)} dari {filteredMapel.length} data
          </div>
          <div className="flex items-center gap-1 self-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-semibold text-slate-700">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Global Footer */}
      <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200">
        Copyright © 2026 <strong className="text-sky-700">Buku Induk Digital</strong>. Powered by{' '}
        <strong className="text-slate-600">Syntax Trust</strong>. All rights reserved. Version 1.2.0
      </div>

      {/* ========================================== */}
      {/* MODAL: TAMBAH / UBAH MATA PELAJARAN BARU   */}
      {/* (Persis Gambar Screenshot Pengguna)       */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-scale-up my-8">
            {/* Modal Header */}
            <div className="bg-[#008ba3] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2 tracking-tight">
                <PlusCircle className="w-4 h-4" />
                {editingItem ? `Ubah Mata Pelajaran: ${editingItem.nama}` : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Field 1: Nama Mata Pelajaran */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  NAMA MATA PELAJARAN <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Pemrograman Berorientasi Objek"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#008ba3] font-medium"
                  />
                </div>
              </div>

              {/* Field 2 & 3: Kelompok Mapel & KKTP (2 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    KELOMPOK MAPEL <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={formData.kelompok}
                      onChange={(e) => setFormData({ ...formData, kelompok: e.target.value })}
                      className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[#008ba3]"
                    >
                      <option value="Kelompok A (Wajib)">Kelompok A (Wajib)</option>
                      <option value="Kelompok B (Mulok)">Kelompok B (Mulok)</option>
                      <option value="C1 Dasar Bidang">C1 Dasar Bidang</option>
                      <option value="C2 Dasar Program">C2 Dasar Program</option>
                      <option value="C3 Konsentrasi">C3 Konsentrasi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    KKTP (KKM) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Target className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={formData.kktp}
                      onChange={(e) => setFormData({ ...formData, kktp: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[#008ba3]"
                    />
                  </div>
                </div>
              </div>

              {/* Field 4 & 5: Urutan di Rapor & Khusus Program Keahlian (2 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    URUTAN DI RAPOR <span className="text-[10px] text-slate-400 font-normal">(MAPPING BUKU INDUK)</span>
                  </label>
                  <div className="relative">
                    <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="number"
                      min={1}
                      value={formData.urutan}
                      onChange={(e) => setFormData({ ...formData, urutan: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[#008ba3]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Angka urutan tampilan mata pelajaran pada rapor & buku induk.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    KHUSUS PROGRAM KEAHLIAN <span className="text-[10px] text-slate-400 font-normal">(OPSIONAL)</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={formData.programKeahlian}
                      onChange={(e) => setFormData({ ...formData, programKeahlian: e.target.value })}
                      className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[#008ba3]"
                    >
                      <option value="-- Semua Program Keahlian (Umum) --">
                        -- Semua Program Keahlian (Umum) --
                      </option>
                      {programOptions.map((prog) => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Kosongkan jika mapel berlaku untuk semua jurusan.
                  </p>
                </div>
              </div>

              {/* Field 6: Diajarkan di Tingkat / Kelas */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  DIAJARKAN DI TINGKAT / KELAS <span className="text-rose-500">*</span>
                </label>
                <div className="border border-slate-300 rounded-lg p-3 bg-white flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.tingkat.includes('Kelas X')}
                      onChange={() => handleToggleTingkat('Kelas X')}
                      className="w-4 h-4 text-[#008ba3] rounded focus:ring-[#008ba3]"
                    />
                    <span>Kelas X</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.tingkat.includes('Kelas XI')}
                      onChange={() => handleToggleTingkat('Kelas XI')}
                      className="w-4 h-4 text-[#008ba3] rounded focus:ring-[#008ba3]"
                    />
                    <span>Kelas XI</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.tingkat.includes('Kelas XII')}
                      onChange={() => handleToggleTingkat('Kelas XII')}
                      className="w-4 h-4 text-[#008ba3] rounded focus:ring-[#008ba3]"
                    />
                    <span>Kelas XII</span>
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Pilih jenjang rombel kelas yang mempelajari mata pelajaran ini.
                </p>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                >
                  <X className="w-3.5 h-3.5" /> Batal
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#008ba3] hover:bg-[#007a91] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Simpan Mapel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
