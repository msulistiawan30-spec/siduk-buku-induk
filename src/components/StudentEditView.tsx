import React, { useState, useEffect } from 'react';
import { Student, ProgramKeahlian, SchoolClass, SchoolSettings } from '../types';
import {
  Calendar,
  Clock,
  Briefcase,
  Award,
  Save,
  Plus,
  Trash2,
  X,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface StudentEditViewProps {
  student: Student;
  programs: ProgramKeahlian[];
  classes: SchoolClass[];
  schoolSettings: SchoolSettings;
  onSave: (updated: Student) => void;
  onCancel: () => void;
}

export const StudentEditView: React.FC<StudentEditViewProps> = ({
  student,
  programs,
  classes,
  schoolSettings,
  onSave,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [formData, setFormData] = useState<Student>({ ...student });

  // Clock state
  const [currentTime, setCurrentTime] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');

  // PKL & UKK records within formData
  const [pklRecords, setPklRecords] = useState<Array<{
    id: string;
    mitra: string;
    alamat: string;
    lamaBulan: number;
    nilai: string;
    keterangan: string;
  }>>([
    {
      id: 'pkl-1',
      mitra: 'Bengkel Resmi Yamaha Dander',
      alamat: 'Jl. Raya Dander No. 45 Bojonegoro',
      lamaBulan: 6,
      nilai: 'Sangat Baik (92)',
      keterangan: 'Perawatan berkala sistem injeksi sepeda motor matic dan manual.',
    },
  ]);

  const [ukkRecords, setUkkRecords] = useState<Array<{
    id: string;
    bidang: string;
    penerbit: string;
    noSertifikat: string;
    tglTerbit: string;
    predikat: string;
    keterangan?: string;
  }>>([
    {
      id: 'ukk-1',
      bidang: 'Teknik Sepeda Motor Level II KKNI',
      penerbit: 'LSP P1 SMKN Dander / BNSP',
      noSertifikat: 'LSP-SMK-2026-0921',
      tglTerbit: '2026-10-15',
      predikat: 'Sangat Memuaskan',
      keterangan: 'Kompeten pada seluruh skema sertifikasi kejuruan otomotif.',
    },
  ]);

  // Riwayat Kesehatan Semesteran
  const [healthHistory, setHealthHistory] = useState<Array<{
    id: string;
    tahunAjaran: string;
    semester: number;
    tb: number;
    bb: number;
    pendengaran: string;
    penglihatan: string;
    gigi: string;
    lainnya: string;
  }>>([
    {
      id: 'h-1',
      tahunAjaran: '2025/2026',
      semester: 1,
      tb: 165,
      bb: 54,
      pendengaran: 'Normal',
      penglihatan: 'Normal',
      gigi: 'Baik',
      lainnya: '-',
    },
    {
      id: 'h-2',
      tahunAjaran: '2025/2026',
      semester: 2,
      tb: 167,
      bb: 56,
      pendengaran: 'Normal',
      penglihatan: 'Normal',
      gigi: 'Baik',
      lainnya: '-',
    },
  ]);

  // Modal sub-dialogs
  const [isPklModalOpen, setIsPklModalOpen] = useState(false);
  const [newPkl, setNewPkl] = useState({
    mitra: '',
    alamat: '',
    lamaBulan: 6,
    nilai: '',
    keterangan: '',
  });

  const [isUkkModalOpen, setIsUkkModalOpen] = useState(false);
  const [newUkk, setNewUkk] = useState({
    bidang: '',
    penerbit: '',
    noSertifikat: '',
    tglTerbit: '2026-11-03',
    predikat: 'Sangat Memuaskan',
    keterangan: '',
  });

  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [newHealth, setNewHealth] = useState({
    tahunAjaran: '2026/2027',
    semester: 3,
    tb: 168,
    bb: 58,
    pendengaran: 'Normal',
    penglihatan: 'Normal',
    gigi: 'Baik',
    lainnya: '-',
  });

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePkl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkl.mitra.trim()) {
      alert('Nama Mitra DUDI wajib diisi.');
      return;
    }
    setPklRecords((prev) => [
      ...prev,
      { id: 'pkl-' + Date.now(), ...newPkl },
    ]);
    setIsPklModalOpen(false);
    setNewPkl({ mitra: '', alamat: '', lamaBulan: 6, nilai: '', keterangan: '' });
  };

  const handleSaveUkk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUkk.bidang.trim()) {
      alert('Nama Sertifikasi / Kompetensi wajib diisi.');
      return;
    }
    setUkkRecords((prev) => [
      ...prev,
      { id: 'ukk-' + Date.now(), ...newUkk },
    ]);
    setIsUkkModalOpen(false);
    setNewUkk({
      bidang: '',
      penerbit: '',
      noSertifikat: '',
      tglTerbit: '2026-11-03',
      predikat: 'Sangat Memuaskan',
      keterangan: '',
    });
  };

  const handleSaveHealth = (e: React.FormEvent) => {
    e.preventDefault();
    setHealthHistory((prev) => [
      ...prev,
      { id: 'h-' + Date.now(), ...newHealth },
    ]);
    setIsHealthModalOpen(false);
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Top Header with title and live clock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            Edit Data Peserta Didik
          </h1>
          <p className="text-[11px] text-slate-500">
            Formulir Pembaruan 7 Bagian Dokumen Resmi Buku Induk Peserta Didik
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentDateStr || '03 Nov 2026'}</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-800 text-white rounded-lg shadow-2xs flex items-center gap-1.5 font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            <span>{currentTime || '10:40:50'}</span>
          </div>
        </div>
      </div>

      {/* 7 Tabs Bar */}
      <div className="bg-[#008ba3] p-1 rounded-t-xl flex flex-wrap gap-1 shadow-xs">
        {[
          { id: 1, label: '1. Pribadi & Alamat' },
          { id: 2, label: '2. Kesehatan & Pend.' },
          { id: 3, label: '3. Orang Tua' },
          { id: 4, label: '4. Wali & Hobi' },
          { id: 5, label: '5. Keluar Sekolah' },
          { id: 6, label: '6. PKL', icon: '💼' },
          { id: 7, label: '7. UKK & Sertifikasi', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-white text-[#008ba3] shadow-xs'
                : 'text-white hover:bg-white/15'
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Tab Content Card */}
      <div className="bg-white border border-slate-200 rounded-b-xl shadow-xs p-6 space-y-6">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* ================= TAB 1: PRIBADI & ALAMAT ================= */}
          {activeTab === 1 && (
            <div className="space-y-6">
              {/* Section I */}
              <div className="space-y-4">
                <h2 className="text-xs font-black text-[#008ba3] uppercase tracking-wider border-b border-cyan-100 pb-2">
                  I. KETERANGAN TENTANG DIRI PESERTA DIDIK
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Photo Column */}
                  <div className="lg:col-span-3 flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Foto Awal Masuk
                    </span>
                    <div className="w-28 h-36 rounded-lg bg-slate-200 border-2 border-slate-300 overflow-hidden shadow-2xs flex items-center justify-center">
                      {formData.photoUrl ? (
                        <img
                          src={formData.photoUrl}
                          alt={formData.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-black text-slate-400">
                          {formData.fullName?.charAt(0) || 'S'}
                        </span>
                      )}
                    </div>
                    <label className="w-full">
                      <span className="block text-[10px] text-slate-500 mb-1">Maks 2MB (JPG/PNG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-[#008ba3] file:text-white hover:file:bg-[#007a8f] cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Form Grid */}
                  <div className="lg:col-span-9 space-y-3">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Kurikulum</label>
                        <input
                          type="text"
                          readOnly
                          value="Kurikulum Merdeka"
                          className="w-full p-2 border border-slate-300 rounded-lg bg-slate-100 text-sky-800 font-semibold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Fase (Merdeka)</label>
                        <select
                          value={formData.fase === 'F' ? 'Fase F (Kelas 11-12)' : 'Fase E (Kelas 10)'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fase: e.target.value.includes('Fase F') ? 'F' : 'E',
                            })
                          }
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs"
                        >
                          <option value="Fase E (Kelas 10)">Fase E (Kelas 10)</option>
                          <option value="Fase F (Kelas 11-12)">Fase F (Kelas 11-12)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">No. Urut Buku</label>
                        <input
                          type="text"
                          value="1"
                          readOnly
                          className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">NIPD</label>
                        <input
                          type="text"
                          value={formData.nipd}
                          onChange={(e) => setFormData({ ...formData, nipd: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-xs"
                        />
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">NISN</label>
                        <input
                          type="text"
                          value={formData.nisn}
                          onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">NIK</label>
                        <input
                          type="text"
                          value={formData.nik}
                          onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Nomor KK</label>
                        <input
                          type="text"
                          value={formData.noKk}
                          onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Status Peserta Didik</label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value as any })
                          }
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white text-emerald-700 font-bold text-xs"
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
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                          Jenjang Pendidikan *
                        </label>
                        <select
                          value="SMK (Sekolah Menengah Kejuruan)"
                          disabled
                          className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 text-xs cursor-not-allowed"
                        >
                          <option value="SMK (Sekolah Menengah Kejuruan)">
                            SMK (Sekolah Menengah Kejuruan)
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                          Tingkat Kelas *
                        </label>
                        <select
                          value={formData.currentClass}
                          onChange={(e) =>
                            setFormData({ ...formData, currentClass: e.target.value })
                          }
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs"
                        >
                          {classes.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                          Program / Konsentrasi Keahlian *
                        </label>
                        <select
                          value={formData.programKeahlian}
                          onChange={(e) =>
                            setFormData({ ...formData, programKeahlian: e.target.value })
                          }
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs font-semibold"
                        >
                          {programs.map((p) => (
                            <option key={p.code} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5">
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Nama Lengkap</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value.toUpperCase() })
                          }
                          className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs uppercase"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Nama Panggilan</label>
                        <input
                          type="text"
                          placeholder="Nama panggilan sehari-hari"
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Jenis Kelamin</label>
                        <select
                          value={formData.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gender: e.target.value === 'Laki-laki' ? 'L' : 'P',
                            })
                          }
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs"
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 5 */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Tempat Lahir</label>
                        <input
                          type="text"
                          value={formData.birthPlace}
                          onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Tanggal Lahir</label>
                        <input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Agama</label>
                        <input
                          type="text"
                          value={formData.religion}
                          onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Kewarganegaraan</label>
                        <input
                          type="text"
                          value={formData.citizenship || 'WNI'}
                          onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                        />
                      </div>
                    </div>

                    {/* Row 6 */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Anak Ke</label>
                        <input
                          type="number"
                          defaultValue={1}
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Sdr. Kandung</label>
                        <input
                          type="number"
                          defaultValue={0}
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Status Anak</label>
                        <input
                          type="text"
                          defaultValue="Lengkap"
                          placeholder="Lengkap/Yatim/Piatu"
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1 text-[11px]">Bahasa Sehari-hari</label>
                        <input
                          type="text"
                          defaultValue="Bahasa Indonesia"
                          className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section II */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h2 className="text-xs font-black text-[#008ba3] uppercase tracking-wider border-b border-cyan-100 pb-2">
                  II. KETERANGAN TEMPAT TINGGAL
                </h2>

                <div>
                  <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                    Alamat Rumah (Jalan / Dusun)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">RT/RW</label>
                    <input
                      type="text"
                      placeholder="Contoh: RT.15 / RW.02"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Desa/Kelurahan</label>
                    <input
                      type="text"
                      placeholder="Bendo"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Kecamatan</label>
                    <input
                      type="text"
                      placeholder="Kapas"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Kabupaten/Kota</label>
                    <input
                      type="text"
                      placeholder="Bojonegoro"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Provinsi</label>
                    <input
                      type="text"
                      defaultValue="Jawa Timur"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Kode Pos</label>
                    <input
                      type="text"
                      placeholder="62171"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">No. HP (WhatsApp)</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">E-Mail Pribadi</label>
                    <input
                      type="email"
                      placeholder="siswa@gmail.com"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Tinggal Dengan</label>
                    <input
                      type="text"
                      value={formData.livingWith || 'Orang Tua'}
                      onChange={(e) => setFormData({ ...formData, livingWith: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Jarak ke Sekolah</label>
                    <input
                      type="text"
                      placeholder="Contoh: 3.5 km"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Transportasi</label>
                    <input
                      type="text"
                      placeholder="Sepeda Motor / Angkutan"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: KESEHATAN & PENDIDIKAN ================= */}
          {activeTab === 2 && (
            <div className="space-y-6">
              {/* III. KESEHATAN */}
              <div className="space-y-3">
                <h2 className="text-xs font-black text-[#008ba3] uppercase tracking-wider border-b border-cyan-100 pb-2">
                  III. KETERANGAN KESEHATAN
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Gol. Darah</label>
                    <input
                      type="text"
                      placeholder="A / B / AB / O"
                      defaultValue="O"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Berat (kg)</label>
                    <input
                      type="number"
                      defaultValue={54}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Tinggi (cm)</label>
                    <input
                      type="number"
                      defaultValue={166}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Penyakit Pernah Diderita</label>
                    <input
                      type="text"
                      placeholder="Tidak ada / Asma / dll"
                      defaultValue="-"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Kelainan Jasmani</label>
                    <input
                      type="text"
                      defaultValue="-"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>

                {/* Table Data Riwayat Kesehatan Semesteran */}
                <div className="pt-2">
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                      <span>🩺</span> Data Riwayat Kesehatan Semesteran
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsHealthModalOpen(true)}
                      className="px-2.5 py-1 bg-[#008ba3] hover:bg-[#007a8f] text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Tambah Data Berkala
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">TAHUN PELAJARAN</th>
                          <th className="p-2.5 text-center">SEM</th>
                          <th className="p-2.5 text-center">TB (CM)</th>
                          <th className="p-2.5 text-center">BB (KG)</th>
                          <th className="p-2.5">PENDENGARAN</th>
                          <th className="p-2.5">PENGLIHATAN</th>
                          <th className="p-2.5">GIGI</th>
                          <th className="p-2.5">LAINNYA</th>
                          <th className="p-2.5 text-center">AKSI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {healthHistory.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-800">{item.tahunAjaran}</td>
                            <td className="p-2.5 text-center font-mono">{item.semester}</td>
                            <td className="p-2.5 text-center font-mono">{item.tb}</td>
                            <td className="p-2.5 text-center font-mono">{item.bb}</td>
                            <td className="p-2.5">{item.pendengaran}</td>
                            <td className="p-2.5">{item.penglihatan}</td>
                            <td className="p-2.5">{item.gigi}</td>
                            <td className="p-2.5 text-slate-500">{item.lainnya}</td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setHealthHistory((prev) => prev.filter((h) => h.id !== item.id))
                                }
                                className="text-rose-500 hover:text-rose-700"
                              >
                                <Trash2 className="w-3.5 h-3.5 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* IV. PENDIDIKAN SEBELUMNYA */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h2 className="text-xs font-black text-[#008ba3] uppercase tracking-wider border-b border-cyan-100 pb-2">
                  IV. KETERANGAN PENDIDIKAN SEBELUMNYA
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                      Lulusan Dari (Asal Sekolah)
                    </label>
                    <input
                      type="text"
                      value={formData.prevSchool}
                      onChange={(e) => setFormData({ ...formData, prevSchool: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                      Tanggal Ijazah/STTB
                    </label>
                    <input
                      type="date"
                      defaultValue="2025-06-20"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                      Nomor Ijazah/STTB
                    </label>
                    <input
                      type="text"
                      placeholder="DN-05/D-SMP/K13/2025/..."
                      defaultValue="DN-05/D-SMP/25/08219"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                    Nomor Transkrip Nilai (Khusus SMK)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 809/092/SMK.A/V/2025"
                    defaultValue="809/092/SMKN-DANDER/V/2026"
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    * Nomor ini akan muncul di bagian atas cetakan Transkrip Nilai.
                  </span>
                </div>

                {/* Banner Pindahan */}
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-3">
                  <div className="font-bold text-sky-900 flex items-center gap-1.5 text-xs">
                    <span>⇄</span> Data Pindahan (Jika Masuk Bukan Jalur Biasa)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                        Pindahan Dari Sekolah
                      </label>
                      <input
                        type="text"
                        placeholder="Nama sekolah asal"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1 text-[11px]">Dari Tingkat</label>
                      <input
                        type="text"
                        placeholder="Kelas X / XI"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                        Diterima Tanggal
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                        No. Surat Keterangan
                      </label>
                      <input
                        type="text"
                        placeholder="Nomor surat pindah"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Alasan Pindah</label>
                    <input
                      type="text"
                      placeholder="Mengikuti domisili orang tua / mutasi tugas kerja"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: ORANG TUA ================= */}
          {activeTab === 3 && (
            <div className="space-y-6">
              {/* V. AYAH */}
              <div className="space-y-3">
                <h2 className="text-xs font-black text-[#008ba3] uppercase tracking-wider border-b border-cyan-100 pb-2">
                  V. KETERANGAN TENTANG AYAH KANDUNG
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Nama Lengkap Ayah</label>
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Pendidikan Terakhir</label>
                    <input
                      type="text"
                      defaultValue="SMA / Sederajat"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Pekerjaan</label>
                    <input
                      type="text"
                      value={formData.parentJob}
                      onChange={(e) => setFormData({ ...formData, parentJob: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1 text-[11px]">Alamat Ayah</label>
                  <input
                    type="text"
                    value={formData.parentAddress || formData.address}
                    onChange={(e) => setFormData({ ...formData, parentAddress: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* VI. IBU */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h2 className="text-xs font-black text-[#008ba3] uppercase tracking-wider border-b border-cyan-100 pb-2">
                  VI. KETERANGAN TENTANG IBU KANDUNG
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Nama Lengkap Ibu</label>
                    <input
                      type="text"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Pendidikan Terakhir</label>
                    <input
                      type="text"
                      defaultValue="SMA / Sederajat"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Pekerjaan</label>
                    <input
                      type="text"
                      defaultValue="Ibu Rumah Tangga"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1 text-[11px]">Alamat Ibu</label>
                  <input
                    type="text"
                    defaultValue={formData.address}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: WALI & HOBI ================= */}
          {activeTab === 4 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-xs font-black text-[#008ba3] uppercase tracking-wider border-b border-cyan-100 pb-2">
                  VII. KETERANGAN TENTANG WALI (JIKA ADA)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Nama Lengkap Wali</label>
                    <input
                      type="text"
                      placeholder="Nama wali murid"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Hubungan Keluarga</label>
                    <input
                      type="text"
                      placeholder="Paman / Kakek / Saudara"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Pekerjaan Wali</label>
                    <input
                      type="text"
                      placeholder="Wiraswasta / PNS / dll"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1 text-[11px]">Alamat Wali</label>
                  <input
                    type="text"
                    placeholder="Alamat lengkap wali peserta didik"
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h2 className="text-xs font-black text-[#008ba3] uppercase tracking-wider border-b border-cyan-100 pb-2">
                  VIII. KEGEMARAN / HOBI
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Kesenian / Olahraga</label>
                    <input
                      type="text"
                      defaultValue="Futsal, Desain Grafis"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Organisasi / Lain-lain</label>
                    <input
                      type="text"
                      defaultValue="Pramuka, OSIS"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: KELUAR SEKOLAH ================= */}
          {activeTab === 5 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-xs font-black text-[#008ba3] uppercase tracking-wider border-b border-cyan-100 pb-2">
                  IX. MENINGGALKAN SEKOLAH
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                      Tanggal Meninggalkan Sekolah
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">
                      Alasan Meninggalkan Sekolah
                    </label>
                    <input
                      type="text"
                      placeholder="Tamat Belajar / Pindah Sekolah / Mengundurkan Diri"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h2 className="text-xs font-black text-[#008ba3] uppercase tracking-wider border-b border-cyan-100 pb-2">
                  X. AKHIR PENDIDIKAN (LULUS)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Tamat Tanggal / Ijazah</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Nomor Ijazah</label>
                    <input
                      type="text"
                      placeholder="M-SMK/06/..."
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-[11px]">Melanjutkan Ke / Bekerja Di</label>
                    <input
                      type="text"
                      placeholder="Perguruan Tinggi / Perusahaan"
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 6: PKL ================= */}
          {activeTab === 6 && (
            <div className="space-y-4">
              <div className="border-b border-cyan-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xs font-black text-[#008ba3] uppercase tracking-wider">
                    XI. KETERANGAN PRAKTIK KERJA LAPANGAN (PKL)
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ℹ️ PKL adalah komponen wajib bagi siswa SMK pada Kurikulum Merdeka Fase F.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPklModalOpen(true)}
                  className="px-3 py-1.5 bg-[#008ba3] hover:bg-[#007a8f] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Pengalaman PKL
                </button>
              </div>

              {/* Table PKL */}
              <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">MITRA DUDI (DUNIA KERJA)</th>
                      <th className="p-3">LAMA (BULAN)</th>
                      <th className="p-3">NILAI</th>
                      <th className="p-3">KETERANGAN</th>
                      <th className="p-3 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pklRecords.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400">
                          Belum ada data pengalaman PKL yang dicatat.
                        </td>
                      </tr>
                    ) : (
                      pklRecords.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <strong className="text-slate-900 block">{item.mitra}</strong>
                            <span className="text-[10px] text-slate-400 block">{item.alamat}</span>
                          </td>
                          <td className="p-3 font-semibold text-slate-700">{item.lamaBulan} Bulan</td>
                          <td className="p-3 font-bold text-emerald-700">{item.nilai}</td>
                          <td className="p-3 text-slate-600">{item.keterangan}</td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                setPklRecords((prev) => prev.filter((p) => p.id !== item.id))
                              }
                              className="text-rose-500 hover:text-rose-700 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 7: UKK & SERTIFIKASI ================= */}
          {activeTab === 7 && (
            <div className="space-y-4">
              <div className="border-b border-cyan-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xs font-black text-[#008ba3] uppercase tracking-wider">
                    XII. UKK &amp; SERTIFIKASI KOMPETENSI
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ℹ️ Catatan sertifikasi keahlian atau Uji Kompetensi Keahlian (UKK) yang diikuti peserta didik.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUkkModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Sertifikasi/UKK
                </button>
              </div>

              {/* Table UKK */}
              <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">NAMA SERTIFIKASI / BIDANG</th>
                      <th className="p-3">PENERBIT / LSP</th>
                      <th className="p-3">NO. SERTIFIKAT</th>
                      <th className="p-3">TGL TERBIT</th>
                      <th className="p-3">PREDIKAT</th>
                      <th className="p-3 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ukkRecords.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          Belum ada sertifikasi dicatat.
                        </td>
                      </tr>
                    ) : (
                      ukkRecords.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{item.bidang}</td>
                          <td className="p-3 text-slate-700">{item.penerbit}</td>
                          <td className="p-3 font-mono text-slate-600">{item.noSertifikat}</td>
                          <td className="p-3 text-slate-600">{item.tglTerbit}</td>
                          <td className="p-3 font-bold text-emerald-700">{item.predikat}</td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                setUkkRecords((prev) => prev.filter((u) => u.id !== item.id))
                              }
                              className="text-rose-500 hover:text-rose-700 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons (Matching image_8f9f8719.png) */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-slate-900 font-black rounded-lg text-xs shadow-xs cursor-pointer flex items-center gap-2 uppercase tracking-wide transition"
              >
                <Save className="w-4 h-4" />
                <span>SIMPAN PERUBAHAN DATA</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer transition"
              >
                Batal
              </button>
            </div>
            <span className="text-[11px] text-slate-400 italic">
              * Gunakan navigasi tab di atas untuk mengisi seluruh bagian dokumen.
            </span>
          </div>
        </form>
      </div>

      {/* SUB-MODAL: Tambah Pengalaman PKL (Matching image_1e8c7675.png) */}
      {isPklModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-xs">
            <div className="bg-[#008ba3] p-4 text-white flex items-center justify-between">
              <div className="font-bold flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-white" />
                <span>Tambah Pengalaman PKL</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPklModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePkl} className="p-5 space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                  Mitra Dunia Kerja (DUDI)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT. Sumber Alfaria Trijaya"
                  value={newPkl.mitra}
                  onChange={(e) => setNewPkl({ ...newPkl, mitra: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                  Lokasi / Alamat DUDI
                </label>
                <textarea
                  rows={2}
                  placeholder="Alamat lengkap tempat PKL..."
                  value={newPkl.alamat}
                  onChange={(e) => setNewPkl({ ...newPkl, alamat: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                    Lamanya (Bulan)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 6"
                    value={newPkl.lamaBulan}
                    onChange={(e) => setNewPkl({ ...newPkl, lamaBulan: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                    Nilai Akhir PKL
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Sangat Baik / 90"
                    value={newPkl.nilai}
                    onChange={(e) => setNewPkl({ ...newPkl, nilai: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                  Keterangan / Kompetensi yang Dicapai
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Melakukan perbaikan mesin ringan..."
                  value={newPkl.keterangan}
                  onChange={(e) => setNewPkl({ ...newPkl, keterangan: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPklModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50 cursor-pointer text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008ba3] hover:bg-[#007a8f] text-white font-bold rounded-lg cursor-pointer text-xs shadow-xs"
                >
                  Simpan Data PKL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL: Tambah Sertifikasi / UKK (Matching image_c9ef68d1.png) */}
      {isUkkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-xs">
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="font-bold flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-white" />
                <span>Tambah Sertifikasi / UKK</span>
              </div>
              <button
                type="button"
                onClick={() => setIsUkkModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUkk} className="p-5 space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                  Nama Sertifikasi / Kompetensi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Skema KKNI Level II Rekayasa Perangkat Lunak"
                  value={newUkk.bidang}
                  onChange={(e) => setNewUkk({ ...newUkk, bidang: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                  Lembaga Penerbit / LSP
                </label>
                <input
                  type="text"
                  placeholder="Contoh: LSP SMK Negeri 1 Jakarta / BNSP"
                  value={newUkk.penerbit}
                  onChange={(e) => setNewUkk({ ...newUkk, penerbit: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                    Nomor Sertifikat
                  </label>
                  <input
                    type="text"
                    placeholder="Reg. / No. Sertifikat"
                    value={newUkk.noSertifikat}
                    onChange={(e) => setNewUkk({ ...newUkk, noSertifikat: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                    Tanggal Terbit
                  </label>
                  <input
                    type="date"
                    value={newUkk.tglTerbit}
                    onChange={(e) => setNewUkk({ ...newUkk, tglTerbit: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                  Nilai Predikat
                </label>
                <select
                  value={newUkk.predikat}
                  onChange={(e) => setNewUkk({ ...newUkk, predikat: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs"
                >
                  <option value="Sangat Memuaskan">Sangat Memuaskan</option>
                  <option value="Memuaskan">Memuaskan</option>
                  <option value="Baik">Baik</option>
                  <option value="Cukup">Cukup</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                  Keterangan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={newUkk.keterangan}
                  onChange={(e) => setNewUkk({ ...newUkk, keterangan: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUkkModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50 cursor-pointer text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer text-xs shadow-xs"
                >
                  Simpan Sertifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL: Tambah Data Berkala Kesehatan */}
      {isHealthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-xs">
            <div className="bg-[#008ba3] p-4 text-white flex items-center justify-between">
              <span className="font-bold text-sm">Tambah Pemeriksaan Kesehatan Berkala</span>
              <button
                type="button"
                onClick={() => setIsHealthModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveHealth} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tahun Pelajaran</label>
                  <input
                    type="text"
                    value={newHealth.tahunAjaran}
                    onChange={(e) => setNewHealth({ ...newHealth, tahunAjaran: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Semester</label>
                  <input
                    type="number"
                    value={newHealth.semester}
                    onChange={(e) => setNewHealth({ ...newHealth, semester: Number(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    value={newHealth.tb}
                    onChange={(e) => setNewHealth({ ...newHealth, tb: Number(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Berat Badan (kg)</label>
                  <input
                    type="number"
                    value={newHealth.bb}
                    onChange={(e) => setNewHealth({ ...newHealth, bb: Number(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pendengaran</label>
                  <input
                    type="text"
                    value={newHealth.pendengaran}
                    onChange={(e) => setNewHealth({ ...newHealth, pendengaran: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Penglihatan</label>
                  <input
                    type="text"
                    value={newHealth.penglihatan}
                    onChange={(e) => setNewHealth({ ...newHealth, penglihatan: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gigi</label>
                  <input
                    type="text"
                    value={newHealth.gigi}
                    onChange={(e) => setNewHealth({ ...newHealth, gigi: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsHealthModalOpen(false)}
                  className="px-3 py-1.5 border rounded font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#008ba3] text-white rounded font-bold"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          Copyright © 2026 <strong className="text-sky-600">Buku Induk Digital</strong>. Powered by <strong className="text-sky-600">Syntax Trust</strong>. All rights reserved.
        </p>
        <span className="font-semibold text-slate-600">Version 1.2.0</span>
      </div>
    </div>
  );
};
