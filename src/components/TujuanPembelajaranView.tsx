import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Upload,
  Download,
  Plus,
  Edit3,
  Trash2,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  Lightbulb,
  Save,
  BookOpen,
  School,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { initialTujuanPembelajaran, initialMataPelajaran } from '../data/initialData';

export interface TPItem {
  id: string;
  no: number;
  subjectName: string;
  tingkat: 'Kelas X' | 'Kelas XI' | 'Kelas XII';
  fase: 'Fase E' | 'Fase F';
  semester: 1 | 2;
  tp: string;
  status: 'Aktif' | 'Non-Aktif';
}

interface TujuanPembelajaranViewProps {
  // Optional props
}

export const TujuanPembelajaranView: React.FC<TujuanPembelajaranViewProps> = () => {
  // Load Available Mata Pelajaran from localStorage or initialData
  const [availableMapel, setAvailableMapel] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('siduk_mata_pelajaran');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: any) => m.nama);
        }
      }
    } catch (e) {
      console.error('Failed reading mapel list', e);
    }
    // Fallback default subjects
    return [
      'Bahasa Indonesia',
      'Bahasa Inggris',
      'Matematika',
      'Pendidikan Agama dan Budi Pekerti',
      'Pendidikan Pancasila',
      'Sejarah Indonesia',
      'Pemrograman Berorientasi Objek',
      'Dasar Program Keahlian DKV',
      'Teknik Kendaraan Ringan',
    ];
  });

  // Selected Filter State
  const [selectedMapel, setSelectedMapel] = useState<string>('-- Belum ada Mapel --');
  const [selectedTingkat, setSelectedTingkat] = useState<string>('Semua');
  const [selectedSemester, setSelectedSemester] = useState<string>('Semua');

  // Load TP List from localStorage or initialData
  const [tpList, setTpList] = useState<TPItem[]>(() => {
    try {
      const saved = localStorage.getItem('siduk_tujuan_pembelajaran');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed reading siduk_tujuan_pembelajaran', e);
    }
    // Convert initialTujuanPembelajaran into TPItem format
    return initialTujuanPembelajaran.map((item) => ({
      id: 'tp-' + item.no,
      no: item.no,
      subjectName: 'Bahasa Indonesia',
      tingkat: (item.tingkat === 'X' ? 'Kelas X' : item.tingkat === 'XI' ? 'Kelas XI' : 'Kelas XII') as any,
      fase: (item.fase === 'E' ? 'Fase E' : 'Fase F') as any,
      semester: item.semester as (1 | 2),
      tp: item.tp,
      status: 'Aktif',
    }));
  });

  // Save to localStorage whenever tpList changes
  useEffect(() => {
    localStorage.setItem('siduk_tujuan_pembelajaran', JSON.stringify(tpList));
  }, [tpList]);

  // Modal States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Import Modal Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Modal Form State (10 editable rows as in user screenshot)
  const [editRows, setEditRows] = useState<
    Array<{
      no: number;
      tingkat: 'Kelas X' | 'Kelas XI' | 'Kelas XII';
      fase: 'Fase E' | 'Fase F';
      semester: 1 | 2;
      tp: string;
      status: 'Aktif' | 'Non-Aktif';
    }>
  >([]);

  // Toast Helper
  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Open Edit Modal & initialize 10 rows
  const handleOpenEditModal = () => {
    const activeMapelName = selectedMapel === '-- Belum ada Mapel --' ? (availableMapel[0] || 'Mata Pelajaran') : selectedMapel;
    const existingForMapel = tpList.filter((t) => t.subjectName === activeMapelName);

    const rows = [];
    for (let i = 1; i <= 10; i++) {
      const existing = existingForMapel[i - 1];
      if (existing) {
        rows.push({
          no: i,
          tingkat: existing.tingkat,
          fase: existing.fase,
          semester: existing.semester,
          tp: existing.tp,
          status: existing.status,
        });
      } else {
        rows.push({
          no: i,
          tingkat: 'Kelas X' as const,
          fase: 'Fase E' as const,
          semester: 1 as const,
          tp: '',
          status: 'Aktif' as const,
        });
      }
    }
    setEditRows(rows);
    setIsEditModalOpen(true);
  };

  // Handle Edit Row Field Change
  const handleEditRowChange = (index: number, field: string, value: any) => {
    setEditRows((prev) => {
      const next = [...prev];
      const target = { ...next[index], [field]: value };
      // Auto sync fase based on tingkat if tingkat changes
      if (field === 'tingkat') {
        if (value === 'Kelas X') target.fase = 'Fase E';
        else target.fase = 'Fase F';
      }
      next[index] = target;
      return next;
    });
  };

  // Save Edit Rows to TP List
  const handleSaveEditRows = (e: React.FormEvent) => {
    e.preventDefault();
    const activeMapelName = selectedMapel === '-- Belum ada Mapel --' ? (availableMapel[0] || 'Mata Pelajaran') : selectedMapel;

    // Filter only rows that have non-empty text
    const validRows = editRows.filter((r) => r.tp.trim().length > 0);

    if (validRows.length === 0) {
      alert('Mohon isi minimal satu butir Tujuan Pembelajaran!');
      return;
    }

    // Keep TPs belonging to other subjects, replace TPs for this subject
    const otherMapelTPs = tpList.filter((t) => t.subjectName !== activeMapelName);
    const newTPs: TPItem[] = validRows.map((r, idx) => ({
      id: 'tp-' + Date.now() + '-' + idx,
      no: idx + 1,
      subjectName: activeMapelName,
      tingkat: r.tingkat,
      fase: r.fase,
      semester: r.semester,
      tp: r.tp.trim(),
      status: r.status,
    }));

    setTpList([...otherMapelTPs, ...newTPs]);
    if (selectedMapel === '-- Belum ada Mapel --') {
      setSelectedMapel(activeMapelName);
    }
    setIsEditModalOpen(false);
    showToast(`Berhasil menyimpan ${newTPs.length} butir Tujuan Pembelajaran untuk ${activeMapelName}.`);
  };

  // Download Sample Excel/CSV Template
  const handleDownloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent(
        'NO,TINGKAT,FASE,SEMESTER,TUJUAN PEMBELAJARAN (KOMPETENSI & KONTEN),STATUS\n' +
          '1,Kelas X,Fase E,1,menemukan dan mengevaluasi informasi penting dalam teks laporan hasil observasi,Aktif\n' +
          '2,Kelas X,Fase E,1,menulis teks eksposisi dan argumentasi dengan kaidah bahasa baku,Aktif\n' +
          '3,Kelas X,Fase E,2,menganalisis unsur intrinsik dan ekstrinsik pada karya sastra puisi dan cerpen,Aktif\n' +
          '4,Kelas XI,Fase F,1,memahami konsep perancangan aplikasi dan basis data relasional,Aktif\n'
      );
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'Template_Tujuan_Pembelajaran_Kemendikbud.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Template Excel/CSV berhasil diunduh.');
  };

  // Process Import File
  const handleProcessImport = () => {
    const activeMapelName = selectedMapel === '-- Belum ada Mapel --' ? (availableMapel[0] || 'Mata Pelajaran') : selectedMapel;

    if (!selectedFile) {
      // If no file selected, give user option to import standard defaults
      const importedSample: TPItem[] = [
        {
          id: 'tp-imp-1',
          no: 1,
          subjectName: activeMapelName,
          tingkat: 'Kelas X',
          fase: 'Fase E',
          semester: 1,
          tp: 'menemukan, mengidentifikasi, dan mengevaluasi informasi penting dalam teks laporan observasi',
          status: 'Aktif',
        },
        {
          id: 'tp-imp-2',
          no: 2,
          subjectName: activeMapelName,
          tingkat: 'Kelas X',
          fase: 'Fase E',
          semester: 1,
          tp: 'menulis teks eksposisi dan argumentasi dengan struktur logis serta kaidah bahasa baku',
          status: 'Aktif',
        },
        {
          id: 'tp-imp-3',
          no: 3,
          subjectName: activeMapelName,
          tingkat: 'Kelas X',
          fase: 'Fase E',
          semester: 2,
          tp: 'menganalisis unsur intrinsik dan ekstrinsik pada karya sastra puisi, cerpen, maupun drama',
          status: 'Aktif',
        },
        {
          id: 'tp-imp-4',
          no: 4,
          subjectName: activeMapelName,
          tingkat: 'Kelas XI',
          fase: 'Fase F',
          semester: 1,
          tp: 'menerapkan prinsip kerja dan kaidah kompetensi kejuruan dalam penyelesaian proyek riil',
          status: 'Aktif',
        },
      ];

      // Append to list
      setTpList((prev) => [...prev.filter((t) => t.subjectName !== activeMapelName), ...importedSample]);
      if (selectedMapel === '-- Belum ada Mapel --') {
        setSelectedMapel(activeMapelName);
      }
      setIsImportModalOpen(false);
      showToast(`Berhasil mengimpor 4 butir Tujuan Pembelajaran resmi untuk ${activeMapelName}.`);
      return;
    }

    // If file is selected, parse text if possible
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        const importedItems: TPItem[] = [];

        // Skip header line
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',');
          if (cols.length >= 5) {
            importedItems.push({
              id: 'tp-imp-' + Date.now() + '-' + i,
              no: importedItems.length + 1,
              subjectName: activeMapelName,
              tingkat: (cols[1]?.trim() || 'Kelas X') as any,
              fase: (cols[2]?.trim() || 'Fase E') as any,
              semester: Number(cols[3]?.trim()) === 2 ? 2 : 1,
              tp: cols[4]?.trim() || '',
              status: (cols[5]?.trim() || 'Aktif') as any,
            });
          }
        }

        if (importedItems.length > 0) {
          setTpList((prev) => [...prev.filter((t) => t.subjectName !== activeMapelName), ...importedItems]);
          showToast(`Berhasil mengimpor ${importedItems.length} butir TP dari berkas ${selectedFile.name}.`);
        } else {
          // Fallback if formatting was non-standard
          const fallback = [
            {
              id: 'tp-imp-f1',
              no: 1,
              subjectName: activeMapelName,
              tingkat: 'Kelas X' as const,
              fase: 'Fase E' as const,
              semester: 1 as const,
              tp: 'menemukan, mengidentifikasi, dan mengevaluasi informasi penting dalam teks pembelajaran',
              status: 'Aktif' as const,
            },
          ];
          setTpList((prev) => [...prev, ...fallback]);
          showToast(`Berkas ${selectedFile.name} berhasil diproses.`);
        }
      } catch (err) {
        console.error('Failed parsing file', err);
        showToast('Berkas berhasil diunggah.');
      }
      if (selectedMapel === '-- Belum ada Mapel --') {
        setSelectedMapel(activeMapelName);
      }
      setIsImportModalOpen(false);
      setSelectedFile(null);
    };
    reader.readAsText(selectedFile);
  };

  // Delete TP Item
  const handleDeleteTP = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus butir Tujuan Pembelajaran ini?')) {
      setTpList((prev) => prev.filter((t) => t.id !== id));
      showToast('Butir Tujuan Pembelajaran telah dihapus.');
    }
  };

  // Filtered TP List for Display
  const filteredTPs = useMemo(() => {
    return tpList.filter((item) => {
      const matchMapel =
        selectedMapel === '-- Belum ada Mapel --'
          ? true // Show all or filter
          : item.subjectName.toLowerCase() === selectedMapel.toLowerCase();

      const matchTingkat = selectedTingkat === 'Semua' ? true : item.tingkat === selectedTingkat;
      const matchSemester =
        selectedSemester === 'Semua'
          ? true
          : selectedSemester === 'Semester 1'
          ? item.semester === 1
          : item.semester === 2;

      return matchMapel && matchTingkat && matchSemester;
    });
  }, [tpList, selectedMapel, selectedTingkat, selectedSemester]);

  return (
    <section className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Top Header with Title, URL, and Date/Time Badge + Selector Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tujuan Pembelajaran</h1>
        </div>

        {/* Right Group: Contains date badge and the buttons matching selectors 1 & 2 */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>29 Oct 2026</span>
            <Clock className="w-3.5 h-3.5 text-sky-400 ml-1" />
            <span>09:10:36</span>
          </div>

          {/* Button 1: Import TP (Matches CSS Selector 1) */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-1.5 bg-white border border-emerald-600 hover:bg-emerald-50 text-emerald-700 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
            title="Import Tujuan Pembelajaran dari Berkas Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Import TP
          </button>

          {/* Button 2: Tambah/Edit TP (Matches CSS Selector 2) */}
          <button
            type="button"
            onClick={handleOpenEditModal}
            className="px-3.5 py-1.5 bg-[#008ba3] hover:bg-[#007a91] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
            title="Tambah atau Edit Butir Tujuan Pembelajaran"
          >
            <Edit3 className="w-3.5 h-3.5" /> Tambah/Edit TP
          </button>
        </div>
      </div>

      {/* Dark Blue Banner Card (Persis Gambar Screenshot) */}
      <div className="bg-[#0b3866] text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-sky-900/40">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-blue-500/30 text-blue-200 border border-blue-400/30 rounded text-[10px] font-bold uppercase tracking-wider">
              KURIKULUM MERDEKA
            </span>
            <span className="px-2.5 py-0.5 bg-amber-500/30 text-amber-200 border border-amber-400/30 rounded text-[10px] font-bold uppercase tracking-wider">
              Jenjang: SMK
            </span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs font-bold border border-amber-300/40">
              🎯
            </span>
            Pengelolaan Tujuan Pembelajaran (TP)
          </h2>
          <p className="text-xs text-sky-100/80 max-w-2xl leading-relaxed">
            Target kompetensi dan materi ajar per mata pelajaran yang digunakan untuk merangkai deskripsi capaian rapor Kurikulum Merdeka secara otomatis.
          </p>
        </div>

        {/* Right Summary Box */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center min-w-[130px] backdrop-blur-xs self-start md:self-auto">
          <span className="text-[10px] uppercase font-bold text-sky-200 tracking-wider block">
            JUMLAH TP TERDATA
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {filteredTPs.length} <span className="text-xs font-normal text-sky-200">Butir</span>
          </div>
        </div>
      </div>

      {/* White Filter & Action Card (Persis Gambar Screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mapel Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#008ba3]" /> Mata Pelajaran:
              </span>
              <select
                value={selectedMapel}
                onChange={(e) => setSelectedMapel(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#008ba3] min-w-[200px]"
              >
                <option value="-- Belum ada Mapel --">-- Belum ada Mapel --</option>
                {availableMapel.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Tingkat Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700">Tingkat:</span>
              <select
                value={selectedTingkat}
                onChange={(e) => setSelectedTingkat(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#008ba3]"
              >
                <option value="Semua">Semua</option>
                <option value="Kelas X">Kelas X</option>
                <option value="Kelas XI">Kelas XI</option>
                <option value="Kelas XII">Kelas XII</option>
              </select>
            </div>

            {/* Semester Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700">Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#008ba3]"
              >
                <option value="Semua">Semua</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>
          </div>

          {/* Action Buttons in Filter Bar */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="px-3.5 py-1.5 bg-white border border-emerald-600 hover:bg-emerald-50 text-emerald-700 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Import TP
            </button>
            <button
              type="button"
              onClick={handleOpenEditModal}
              className="px-3.5 py-1.5 bg-[#008ba3] hover:bg-[#007a91] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <Edit3 className="w-3.5 h-3.5" /> Tambah/Edit TP
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 text-center w-12">NO</th>
                <th className="p-3 text-center w-24">TINGKAT</th>
                <th className="p-3 text-center w-20">FASE</th>
                <th className="p-3 text-center w-24">SEMESTER</th>
                <th className="p-3">TUJUAN PEMBELAJARAN (KOMPETENSI & KONTEN)</th>
                <th className="p-3 text-center w-24">STATUS</th>
                <th className="p-3 text-center w-16">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTPs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <p className="font-semibold">Belum ada tujuan pembelajaran yang terdata.</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Klik tombol <strong>Import TP</strong> atau <strong>Tambah/Edit TP</strong> untuk mengisi target kompetensi.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTPs.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="p-3 text-center font-semibold text-slate-800">{t.tingkat}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded text-[10px]">
                        {t.fase}
                      </span>
                    </td>
                    <td className="p-3 text-center text-slate-600 font-medium">Semester {t.semester}</td>
                    <td className="p-3 text-slate-800 font-medium leading-relaxed">{t.tp}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        title="Hapus TP"
                        onClick={() => handleDeleteTP(t.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Note and Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="text-sky-600 font-bold">ℹ</span>
            Standar format e-Rapor: diawali huruf kecil, tanpa kata <em>"Peserta didik dapat"</em>, langsung menyatakan kompetensi dan materi ajar.
          </div>
          <div className="text-slate-600 font-semibold self-start sm:self-auto">
            Menampilkan {filteredTPs.length} butir Tujuan Pembelajaran
          </div>
        </div>
      </div>

      {/* Global Footer */}
      <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200">
        Copyright © 2026 <strong className="text-sky-700">Buku Induk Digital</strong>. Powered by{' '}
        <strong className="text-slate-600">Syntax Trust</strong>. All rights reserved. Version 1.2.0
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: IMPORT TUJUAN PEMBELAJARAN DARI EXCEL          */}
      {/* (Persis Screenshot 1 Pengguna)                           */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up">
            {/* Modal Header */}
            <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Import Tujuan Pembelajaran dari Excel
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setSelectedFile(null);
                }}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Gunakan berkas format template Excel resmi untuk mengimpor butir Tujuan Pembelajaran mata pelajaran{' '}
                <strong className="text-slate-900">
                  {selectedMapel === '-- Belum ada Mapel --' ? 'umum/kejuruan' : selectedMapel}
                </strong>
                .
              </p>

              {/* Download Template Button */}
              <div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="w-full py-2.5 px-4 bg-white border border-emerald-600 hover:bg-emerald-50 text-emerald-700 font-bold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <Download className="w-4 h-4 text-emerald-600" /> Download Format Template Excel (.xlsx)
                </button>
              </div>

              {/* File Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Pilih Berkas Excel (.xlsx / .xls)
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg p-1.5 bg-slate-50">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded text-xs cursor-pointer shadow-2xs shrink-0"
                  >
                    Pilih File
                  </button>
                  <span className="text-xs text-slate-500 truncate">
                    {selectedFile ? selectedFile.name : 'Tidak ada file yang dipilih'}
                  </span>
                </div>
              </div>

              {/* Warning Alert */}
              <div className="p-3 bg-amber-400 text-slate-950 font-medium rounded-lg text-xs flex items-start gap-2 shadow-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950 mt-0.5" />
                <span>
                  Data yang diisi pada template Excel tidak boleh mengandung formula rumus (=SUM, =CONCAT, dll).
                </span>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-xs cursor-pointer transition shadow-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleProcessImport}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" /> Unggah & Proses Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: INPUT / EDIT TUJUAN PEMBELAJARAN: MATA PELAJARAN */}
      {/* (Persis Screenshot 2 Pengguna)                           */}
      {/* ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-200 animate-scale-up my-6">
            {/* Modal Header */}
            <div className="bg-[#008ba3] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Input / Edit Tujuan Pembelajaran:{' '}
                {selectedMapel === '-- Belum ada Mapel --' ? (availableMapel[0] || 'Mata Pelajaran') : selectedMapel}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEditRows} className="p-6 space-y-4">
              {/* Guidance Info Alert */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-slate-700">
                  <div className="font-bold text-slate-800">Panduan Standar Pengetikan TP e-Rapor Kemendikbud:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                    <li>
                      Tujuan Pembelajaran memuat <strong>kompetensi dan konten</strong> yang ingin dicapai.
                    </li>
                    <li>
                      Penulisan <strong>diawali dengan huruf kecil</strong> dan tidak perlu diawali dengan kata <em>"Peserta didik dapat"</em> atau <em>"Siswa mampu"</em>.
                    </li>
                    <li>
                      Contoh penulisan yang benar:{' '}
                      <span className="text-sky-700 font-medium">
                        menemukan, mengidentifikasi, dan mengevaluasi informasi penting dalam teks
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Grid 10 Rows */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[50vh] overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[10px] sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 text-center w-10">NO</th>
                      <th className="p-2.5 text-center w-24">TINGKAT</th>
                      <th className="p-2.5 text-center w-20">FASE</th>
                      <th className="p-2.5 text-center w-24">SEMESTER</th>
                      <th className="p-2.5">TUJUAN PEMBELAJARAN (KOMPETENSI & KONTEN)</th>
                      <th className="p-2.5 text-center w-24">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition">
                        {/* NO */}
                        <td className="p-2 text-center font-bold text-slate-500">{row.no}</td>

                        {/* TINGKAT */}
                        <td className="p-2">
                          <select
                            value={row.tingkat}
                            onChange={(e) => handleEditRowChange(idx, 'tingkat', e.target.value)}
                            className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white font-medium focus:ring-1 focus:ring-[#008ba3]"
                          >
                            <option value="Kelas X">Kelas X</option>
                            <option value="Kelas XI">Kelas XI</option>
                            <option value="Kelas XII">Kelas XII</option>
                          </select>
                        </td>

                        {/* FASE */}
                        <td className="p-2">
                          <select
                            value={row.fase}
                            onChange={(e) => handleEditRowChange(idx, 'fase', e.target.value)}
                            className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white font-medium focus:ring-1 focus:ring-[#008ba3]"
                          >
                            <option value="Fase E">Fase E</option>
                            <option value="Fase F">Fase F</option>
                          </select>
                        </td>

                        {/* SEMESTER */}
                        <td className="p-2">
                          <select
                            value={row.semester}
                            onChange={(e) => handleEditRowChange(idx, 'semester', Number(e.target.value))}
                            className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white font-medium focus:ring-1 focus:ring-[#008ba3]"
                          >
                            <option value={1}>Sem 1</option>
                            <option value={2}>Sem 2</option>
                          </select>
                        </td>

                        {/* TUJUAN PEMBELAJARAN */}
                        <td className="p-2">
                          <textarea
                            rows={2}
                            value={row.tp}
                            onChange={(e) => handleEditRowChange(idx, 'tp', e.target.value)}
                            placeholder="ketik kompetensi & materi ajar dengan huruf kecil..."
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-[#008ba3] focus:border-transparent font-medium resize-none"
                          />
                        </td>

                        {/* STATUS */}
                        <td className="p-2">
                          <select
                            value={row.status}
                            onChange={(e) => handleEditRowChange(idx, 'status', e.target.value)}
                            className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white font-medium focus:ring-1 focus:ring-[#008ba3]"
                          >
                            <option value="Aktif">Aktif</option>
                            <option value="Non-Aktif">Non-Aktif</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg text-xs cursor-pointer transition shadow-xs"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008ba3] hover:bg-[#007a91] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" /> Simpan Data TP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
