import React, { useState } from 'react';
import { Student, SchoolSettings } from '../types';
import {
  FileText,
  TrendingUp,
  Download,
  Upload,
  Printer,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  X,
  BookOpen,
  ArrowRightLeft,
  Search,
} from 'lucide-react';
import { initialMataPelajaran, initialTujuanPembelajaran } from '../data/initialData';

// 1. OLAH NILAI PESERTA DIDIK (PDF Page 56)
export const OlahNilaiView: React.FC<{
  students: Student[];
  onOpenStudent: (student: Student) => void;
  onOpenKenaikanModal: () => void;
}> = ({ students, onOpenStudent, onOpenKenaikanModal }) => {
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [search, setSearch] = useState('');

  const filtered = students.filter((s) => {
    const matchClass = selectedClass === 'Semua Kelas' || s.currentClass === selectedClass;
    const matchSearch = s.fullName.toLowerCase().includes(search.toLowerCase()) || s.nipd.includes(search);
    return matchClass && matchSearch;
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Olah Nilai Peserta Didik</h1>
          <p className="text-xs text-slate-500">Rekapitulasi pengisian nilai semester dan capaian pembelajaran.</p>
        </div>
      </div>

      {/* 3 Metrics Cards as in PDF Page 56 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0284c7] text-white p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-3xl font-black">32</span>
            <div className="text-xs text-sky-100 font-semibold mt-1">Total Seluruh Peserta Didik</div>
          </div>
          <span className="text-[11px] font-bold text-white/90 mt-4">Lihat Detail &rarr;</span>
        </div>

        <div className="bg-[#10b981] text-white p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-3xl font-black">32</span>
            <div className="text-xs text-emerald-100 font-semibold mt-1">Peserta Didik Sudah Terisi Nilai</div>
          </div>
          <span className="text-[11px] font-bold text-white/90 mt-4">100% Progres Terisi</span>
        </div>

        <div className="bg-[#f59e0b] text-white p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-3xl font-black">0</span>
            <div className="text-xs text-amber-100 font-semibold mt-1">Peserta Didik Belum Ada Nilai</div>
          </div>
          <span className="text-[11px] font-bold text-white/90 mt-4">Butuh Perhatian ⚠</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700">FILTER PER KELAS:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="p-1.5 border border-slate-300 rounded text-xs bg-white font-medium"
          >
            <option>Semua Kelas</option>
            <option>X TKJ 1</option>
            <option>XI TKJ 1</option>
            <option>XII TKJ 1</option>
            <option>XI AKL 1</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenKenaikanModal}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" /> Kenaikan Kelas Massal
          </button>
          <button
            onClick={() => alert('Fitur impor nilai Excel dibuka!')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Impor Nilai Massal (Excel)
          </button>
        </div>
      </div>

      {/* Table as in PDF Page 56 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 uppercase font-bold text-slate-600 text-[10px] border-b">
              <tr>
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3">NAMA LENGKAP PESERTA DIDIK</th>
                <th className="p-3">NIPD & KELAS</th>
                <th className="p-3">PROGRAM KEAHLIAN</th>
                <th className="p-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                  <td className="p-3">
                    <strong className="text-slate-900 block font-bold">{s.fullName}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">NISN: {s.nisn}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-slate-800 font-mono block">{s.nipd}</span>
                    <span className="text-[10px] text-slate-500">Kelas: {s.currentClass}</span>
                  </td>
                  <td className="p-3 text-slate-600 font-medium">{s.programKeahlian}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onOpenStudent(s)}
                      className="px-3 py-1 bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white rounded border border-sky-200 font-bold transition cursor-pointer"
                    >
                      Input / Lihat Nilai
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// 2. DATA MATA PELAJARAN (Dedicated component)
export { MataPelajaranView } from './MataPelajaranView';


// 3. TUJUAN PEMBELAJARAN (PDF Page 57)
export const TujuanPembelajaranView: React.FC = () => {
  const [tpList, setTpList] = useState(initialTujuanPembelajaran);

  const handleDelete = (no: number) => {
    setTpList(tpList.filter((item) => item.no !== no));
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tujuan Pembelajaran (TP)</h1>
          <p className="text-xs text-slate-500">Kumpulan TP Kurikulum Merdeka Fase E & F untuk pengisian rapor resmi.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => alert('Impor TP')} className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Import TP
          </button>
          <button onClick={() => alert('Tambah TP')} className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Tambah/Edit TP
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-4 text-xs">
        <div>
          <label className="block text-slate-500 mb-1 font-bold">PILIH MATA PELAJARAN:</label>
          <select className="p-1.5 border rounded bg-white font-medium">
            <option>Bahasa Indonesia (X, XI, XII)</option>
            <option>Matematika</option>
            <option>Bahasa Inggris</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 uppercase font-bold text-slate-600 text-[10px] border-b">
              <tr>
                <th className="p-3 w-10 text-center">NO</th>
                <th className="p-3 w-20 text-center">TINGKAT</th>
                <th className="p-3 w-16 text-center">FASE</th>
                <th className="p-3 w-24 text-center">SEMESTER</th>
                <th className="p-3">TUJUAN PEMBELAJARAN</th>
                <th className="p-3 w-20 text-center">STATUS</th>
                <th className="p-3 w-16 text-center">HAPUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tpList.map((t) => (
                <tr key={t.no} className="hover:bg-slate-50 transition">
                  <td className="p-3 text-center font-bold text-slate-400">{t.no}</td>
                  <td className="p-3 text-center font-bold text-slate-800">{t.tingkat}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                      {t.fase}
                    </span>
                  </td>
                  <td className="p-3 text-center text-slate-600 font-medium">Semester {t.semester}</td>
                  <td className="p-3 text-slate-800 leading-relaxed font-medium">{t.tp}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Aktif
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleDelete(t.no)} className="p-1 text-slate-400 hover:text-rose-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// 4. BUKU MUTASI PESERTA DIDIK (PDF Page 15, 32, 53)
export const MutasiPesertaDidikView: React.FC<{
  schoolSettings: SchoolSettings;
  students?: Student[];
}> = ({ schoolSettings, students = [] }) => {
  const handlePrint = () => {
    window.print();
  };

  // Synchronized with students from Manajemen Peserta Didik
  const mutasiList = students.filter(s => s.status === 'Lulus' || s.status === 'Mutasi Keluar' || s.currentClass.startsWith('XII')).slice(0, 15).map((s, i) => ({
    no: i + 1,
    nipd: s.nipd,
    nisn: s.nisn,
    name: s.fullName,
    gender: s.gender,
    cls: s.currentClass,
    date: s.admissionDate || '02/10/2026',
    status: s.status === 'Mutasi Keluar' ? 'MUTASI' : 'LULUS',
    reason: s.catatanKhusus || (s.status === 'Mutasi Keluar' ? 'Pindah Mengikuti Orang Tua' : 'Tamat Belajar SMKN DANDER'),
  }));

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Buku Mutasi Peserta Didik</h1>
          <p className="text-xs text-rose-700 font-semibold flex items-center gap-1.5 mt-0.5">
            <ArrowRightLeft className="w-3.5 h-3.5" /> Rekapitulasi Buku Mutasi Peserta Didik
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4" /> CETAK BUKU MUTASI (A4)
        </button>
      </div>

      <div id="print-area">
        <div className="page-sheet bg-white text-slate-900 border border-slate-300 p-8 shadow-xs text-xs">
          <div className="text-center mb-6 border-b-2 border-slate-900 pb-2">
            <h2 className="font-black text-sm tracking-wider uppercase text-slate-950">
              REKAPITULASI MUTASI PESERTA DIDIK
            </h2>
            <p className="text-[10px] font-bold uppercase text-slate-700">{schoolSettings.name}</p>
            <p className="text-[10px] text-slate-500">Tahun Pelajaran: {schoolSettings.activeAcademicYear}</p>
          </div>

          <table className="w-full text-xs border-collapse border border-slate-400">
            <thead className="bg-slate-100 uppercase font-black text-center text-[10px]">
              <tr>
                <th rowSpan={2} className="border border-slate-400 p-2 w-10">NO</th>
                <th rowSpan={2} className="border border-slate-400 p-2 w-32">NIPD / NISN</th>
                <th rowSpan={2} className="border border-slate-400 p-2 text-left">NAMA LENGKAP</th>
                <th rowSpan={2} className="border border-slate-400 p-2 w-10">L/P</th>
                <th rowSpan={2} className="border border-slate-400 p-2 w-20">KELAS</th>
                <th colSpan={3} className="border border-slate-400 p-1.5 bg-slate-200/60">KETERANGAN MUTASI (KELUAR)</th>
              </tr>
              <tr>
                <th className="border border-slate-400 p-1.5 w-24">TANGGAL</th>
                <th className="border border-slate-400 p-1.5 w-24">STATUS</th>
                <th className="border border-slate-400 p-1.5">ALASAN / SEKOLAH TUJUAN</th>
              </tr>
            </thead>
            <tbody>
              {mutasiList.map((m) => (
                <tr key={m.no} className="hover:bg-slate-50 transition">
                  <td className="border border-slate-400 p-2 text-center font-bold">{m.no}</td>
                  <td className="border border-slate-400 p-2 text-center font-mono">
                    <strong className="block">{m.nipd}</strong>
                    <span className="text-[10px] text-slate-500">{m.nisn}</span>
                  </td>
                  <td className="border border-slate-400 p-2 font-bold uppercase">{m.name}</td>
                  <td className="border border-slate-400 p-2 text-center">{m.gender}</td>
                  <td className="border border-slate-400 p-2 text-center font-semibold">{m.cls}</td>
                  <td className="border border-slate-400 p-2 text-center">{m.date}</td>
                  <td className="border border-slate-400 p-2 text-center font-bold text-sky-700">{m.status}</td>
                  <td className="border border-slate-400 p-2 text-center text-slate-400">{m.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-14 flex justify-between text-center text-xs">
            <div>
              <p className="text-[10px]">Mengetahui,</p>
              <p className="font-semibold mb-14 text-[10.5px]">Kepala Sekolah,</p>
              <p className="font-bold underline uppercase">{schoolSettings.principalName}</p>
              <p className="text-[9.5px] font-mono text-slate-600">NIP. {schoolSettings.principalNip}</p>
            </div>
            <div>
              <p className="text-[10px]">{schoolSettings.district}, 02 Oktober 2026</p>
              <p className="font-semibold mb-14 text-[10.5px]">Kepala Urusan Tata Usaha,</p>
              <p className="font-bold underline uppercase">{schoolSettings.administrationHead}</p>
              <p className="text-[9.5px] font-mono text-slate-600">NIP. {schoolSettings.administrationNip}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 5. MODAL KENAIKAN KELAS MASSAL (PDF Page 45)
export const KenaikanKelasModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (fromClass: string, toClass: string) => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const [fromClass, setFromClass] = useState('X TKJ 1');
  const [toClass, setToClass] = useState('XI TKJ 1');
  const [method, setMethod] = useState<'latest' | 'global'>('latest');

  if (!isOpen) return null;

  const handleProses = () => {
    onSuccess(fromClass, toClass);
    onClose();
    alert(`Sukses memproses kenaikan kelas massal dari ${fromClass} ke ${toClass}!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Kenaikan Kelas Massal</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Gunakan fitur ini untuk memindahkan seluruh rombel ke kelas baru secara cepat.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Dari Kelas (Asal):</label>
            <select
              value={fromClass}
              onChange={(e) => setFromClass(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white font-medium"
            >
              <option>X TKJ 1</option>
              <option>X RPL 1</option>
              <option>X AKL 1</option>
              <option>X TKR 1</option>
              <option>XI TKJ 1</option>
              <option>XI RPL 1</option>
              <option>XI AKL 1</option>
              <option>XI TKR 1</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Ke Kelas (Tujuan):</label>
            <input
              type="text"
              value={toClass}
              onChange={(e) => setToClass(e.target.value)}
              className="w-full p-2 border rounded-lg font-bold text-slate-900"
              placeholder="Contoh: XI TKJ 1"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="font-bold text-slate-600 block text-[10px] uppercase">METODE PEMBARUAN:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="method"
                checked={method === 'latest'}
                onChange={() => setMethod('latest')}
                className="accent-sky-600"
              />
              <span className="font-semibold text-slate-800">Hanya Semester Terbaru</span>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold">Safe</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="method"
                checked={method === 'global'}
                onChange={() => setMethod('global')}
                className="accent-sky-600"
              />
              <span className="font-semibold text-slate-800">Global (Semua Histori)</span>
            </label>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[10px]">
            Fitur ini akan memperbarui data <strong>KOLOM KELAS</strong> pada tabel siswa. Pastikan data sudah benar sebelum memproses.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={onClose}
            className="py-2.5 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button
            onClick={handleProses}
            className="py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition shadow-xs"
          >
            PROSES SEKARANG
          </button>
        </div>
      </div>
    </div>
  );
};
