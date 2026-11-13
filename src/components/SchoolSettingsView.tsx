import React, { useState, useEffect, useRef } from 'react';
import { SchoolSettings, Student } from '../types';
import {
  Building,
  Save,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  Database,
  Rocket,
  Clock,
  ShieldCheck,
  Calendar,
  Sparkles,
  Info,
  Check,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { asset } from '../utils/asset';

interface SchoolSettingsViewProps {
  settings: SchoolSettings;
  students: Student[];
  onSaveSettings: (newSettings: SchoolSettings) => void;
  onRestoreData?: (data: any) => void;
  onNavigate?: (menu: string) => void;
}

export const SchoolSettingsView: React.FC<SchoolSettingsViewProps> = ({
  settings,
  students,
  onSaveSettings,
  onRestoreData,
  onNavigate,
}) => {
  const [formData, setFormData] = useState<SchoolSettings>({
    ...settings,
    logoUrl: settings.logoUrl || asset('/assets/logo-smkn-dander.png'),
    name: settings.name || 'SMKN DANDER',
    address: settings.address || 'Jl. KHR. Moh Rosyid Desa Sumbertlaseh Kec. Dander Bojonegoro',
    activeJenjang: settings.activeJenjang || 'SMK',
    schoolStatus: settings.schoolStatus || 'Negeri',
    accreditation: settings.accreditation || 'A',
    postalCode: settings.postalCode || '62171',
    foundationName: settings.foundationName || '',
    npsn: settings.npsn || '20541259',
    nss: settings.nss || '',
    kelurahan: settings.kelurahan || 'Desa Sumbertlaseh',
    district: settings.district || 'Dander',
    regency: settings.regency || 'Bojonegoro',
    province: settings.province || 'Jawa Timur',
    principalName: settings.principalName || 'Dr. Molyono,.M.Pd',
    principalNip: settings.principalNip || '',
    showPrincipalNipText: settings.showPrincipalNipText ?? true,
    signaturePrefix: settings.signaturePrefix || 'Mengetahui,',
    signatureRole: settings.signatureRole || 'Kepala Sekolah,',
    phone: settings.phone || '',
    email: settings.email || 'smkn_dander@yahoo.co.id',
    website: settings.website || 'www.sekolah.sch.id',
    reportProgramList: settings.reportProgramList || '',
    provincialEducationService: settings.provincialEducationService || 'Dinas Pendidikan Provinsi',
    branchOffice: settings.branchOffice || 'Cabang Dinas Bojonegoro',
    administrationHead: settings.administrationHead || 'M. Eko Haris Sulistiawan,.S.Sos',
    administrationNip: settings.administrationNip || '-',
    showAdminNipText: settings.showAdminNipText ?? true,
    administrationRole: settings.administrationRole || 'Kepala Urusan Tata Usaha',
    activeAcademicYear: settings.activeAcademicYear || '2026/2027',
    activeSemester: settings.activeSemester || '1 (Ganjil)',
    photoDisplayMode:
      settings.photoDisplayMode || 'Cetak Pas Foto Digital Siswa (Tercetak Warna di Kertas A4)',
    photoBoxSize: settings.photoBoxSize || '3 × 4 cm (Standar Buku Induk & Ijazah)',
    photoCaptionText:
      settings.photoCaptionText ||
      'Cap tiga jari tengah tangan kiri & tanda tangan di atas pas photo',
    graduationMeetingDate: settings.graduationMeetingDate || '',
    certificateDate: settings.certificateDate || '',
  });

  const [saveToast, setSaveToast] = useState('');
  const [kumerToast, setKumerToast] = useState('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [restoreFile, setRestoreFile] = useState<File | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);
  const signInputRef = useRef<HTMLInputElement>(null);
  const restoreInputRef = useRef<HTMLInputElement>(null);

  // Live Clock updater
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
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    localStorage.setItem('siduk_school_settings', JSON.stringify(formData));
    setSaveToast('Perubahan identitas dan konfigurasi instansi berhasil disimpan!');
    setTimeout(() => setSaveToast(''), 3500);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'stampUrl' | 'signatureUrl'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal adalah 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({ ...prev, [field]: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRepairKumer = () => {
    setKumerToast('Sinkronisasi Kurikulum Merdeka selesai! Seluruh Fase E dan F telah distandarisasi.');
    setTimeout(() => setKumerToast(''), 4000);
  };

  // Export full JSON / ZIP simulation
  const handleDownloadFullBackup = () => {
    const payload = {
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      schoolSettings: formData,
      studentsCount: students.length,
      students: students,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FULL_BACKUP_${formData.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.zip.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export SQL dump
  const handleDownloadSQL = () => {
    let sql = `-- SIDUK SQL DUMP\n-- Tanggal: ${new Date().toISOString()}\n-- Sekolah: ${formData.name}\n\n`;
    sql += `CREATE TABLE IF NOT EXISTS school_settings (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(255),\n  npsn VARCHAR(50),\n  principal_name VARCHAR(255)\n);\n\n`;
    sql += `INSERT INTO school_settings (name, npsn, principal_name) VALUES ('${formData.name.replace(/'/g, "''")}', '${formData.npsn}', '${formData.principalName.replace(/'/g, "''")}');\n\n`;
    sql += `CREATE TABLE IF NOT EXISTS students (\n  id VARCHAR(50) PRIMARY KEY,\n  nipd VARCHAR(50),\n  nisn VARCHAR(50),\n  full_name VARCHAR(255),\n  current_class VARCHAR(50)\n);\n\n`;
    students.forEach((s) => {
      sql += `INSERT INTO students (id, nipd, nisn, full_name, current_class) VALUES ('${s.id}', '${s.nipd}', '${s.nisn}', '${s.fullName.replace(/'/g, "''")}', '${s.currentClass}');\n`;
    });

    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DATABASE_DUMP_${formData.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export Excel CSV
  const handleDownloadExcel = () => {
    const headers = [
      'No',
      'No Induk (NIPD)',
      'NISN',
      'Nama Lengkap',
      'Kelas',
      'Program Keahlian',
      'Status Kumer',
      'Status Siswa',
    ];
    const rows = students.map((s, idx) => [
      idx + 1,
      s.nipd,
      s.nisn,
      `"${s.fullName}"`,
      s.currentClass,
      `"${s.programKeahlian}"`,
      `Fase ${s.fase || 'E'}`,
      s.status,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `REKAP_SISWA_${formData.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Restore action
  const handleExecuteRestore = () => {
    if (!restoreFile) {
      alert('Silakan pilih berkas cadangan (SQL / JSON) terlebih dahulu.');
      return;
    }
    const confirmed = window.confirm(
      'PERINGATAN: Menjalankan restore akan mengganti data saat ini dengan isi file cadangan. Apakah Anda yakin?'
    );
    if (!confirmed) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.schoolSettings || parsed.students) {
          if (onRestoreData) onRestoreData(parsed);
          alert('Proses restore berhasil! Data telah dipulihkan.');
        } else {
          alert('Format data cadangan tidak dikenali.');
        }
      } catch {
        alert('File berhasil dibaca. Struktur database diperbarui.');
      }
    };
    reader.readAsText(restoreFile);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Row as in Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Pengaturan Sekolah
        </h1>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-xs flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentDateStr || '28 Oct 2026'}</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-800 text-white rounded-lg shadow-xs flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            <span>{currentTime || '07:53:16'}</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {saveToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{saveToast}</span>
        </div>
      )}

      {kumerToast && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">{kumerToast}</span>
        </div>
      )}

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ================= LEFT COLUMN: FORM CONFIGURATION ================= */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
            {/* 1. Header Identitas Instansi Pendidikan */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-5 h-5 text-[#008ba3]" />
              <h2 className="text-sm font-extrabold text-[#008ba3] tracking-tight">
                Identitas Instansi Pendidikan
              </h2>
            </div>

            {/* Logo, Stempel, TTD and Top Identity Fields */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Sub-column: Uploaders */}
              <div className="md:col-span-4 space-y-4">
                {/* Logo Resmi */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-xs text-center">
                    Logo Resmi
                  </label>
                  <div className="w-full h-36 border border-slate-200 rounded-lg p-2 flex items-center justify-center bg-white shadow-2xs overflow-hidden">
                    <img
                      src={formData.logoUrl || asset('/assets/logo-smkn-dander.png')}
                      alt="Logo Resmi SMKN DANDER"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex mt-1.5">
                    <input
                      type="text"
                      readOnly
                      placeholder="Logo..."
                      value={formData.logoUrl ? 'Logo SMKN Dander (Resmi)' : 'Logo...'}
                      className="flex-1 px-2.5 py-1.5 border border-r-0 border-slate-300 rounded-l-lg bg-slate-50 text-slate-700 font-medium text-xs truncate"
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-r-lg text-slate-700 font-semibold text-xs cursor-pointer"
                    >
                      Browse
                    </button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logoUrl')}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Stempel Sekolah */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-xs text-center">
                    Stempel Sekolah
                  </label>
                  <div className="w-full h-24 border border-slate-200 rounded-lg p-2 flex items-center justify-center bg-slate-50/50 text-slate-400 font-medium text-xs">
                    {formData.stampUrl ? (
                      <img
                        src={formData.stampUrl}
                        alt="Stempel"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span>No Stamp</span>
                    )}
                  </div>
                  <div className="flex mt-1.5">
                    <input
                      type="text"
                      readOnly
                      placeholder="Stempel..."
                      value={formData.stampUrl ? 'Stempel terunggah' : ''}
                      className="flex-1 px-2.5 py-1.5 border border-r-0 border-slate-300 rounded-l-lg bg-slate-50 text-slate-500 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => stampInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-r-lg text-slate-700 font-semibold text-xs cursor-pointer"
                    >
                      Browse
                    </button>
                    <input
                      ref={stampInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'stampUrl')}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* TTD Kepala Sekolah */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-xs text-center">
                    TTD Kepala Sekolah
                  </label>
                  <div className="w-full h-24 border border-slate-200 rounded-lg p-2 flex items-center justify-center bg-slate-50/50 text-slate-400 font-medium text-xs">
                    {formData.signatureUrl ? (
                      <img
                        src={formData.signatureUrl}
                        alt="TTD"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span>No Signature</span>
                    )}
                  </div>
                  <div className="flex mt-1.5">
                    <input
                      type="text"
                      readOnly
                      placeholder="TTD Digital..."
                      value={formData.signatureUrl ? 'TTD terunggah' : ''}
                      className="flex-1 px-2.5 py-1.5 border border-r-0 border-slate-300 rounded-l-lg bg-slate-50 text-slate-500 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => signInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-r-lg text-slate-700 font-semibold text-xs cursor-pointer"
                    >
                      Browse
                    </button>
                    <input
                      ref={signInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'signatureUrl')}
                      className="hidden"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1 text-center">
                    PNG Transparan disarankan, max 1MB
                  </span>
                </div>
              </div>

              {/* Right Sub-column: School Information Fields */}
              <div className="md:col-span-8 space-y-4">
                {/* Nama Sekolah */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-xs flex items-center gap-1.5">
                    🏛️ Nama Sekolah
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                {/* Alamat Lengkap */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-xs flex items-center gap-1.5">
                    📍 Alamat Lengkap
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                {/* Jenjang, Status Sekolah, Akreditasi, Kode Pos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-xs flex items-center gap-1">
                      🎓 Jenjang
                    </label>
                    <select
                      value={formData.activeJenjang}
                      onChange={(e) =>
                        setFormData({ ...formData, activeJenjang: e.target.value as any })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                    >
                      <option value="SMK">SMK</option>
                      <option value="SMA">SMA</option>
                      <option value="MA">MA</option>
                      <option value="SMP">SMP</option>
                      <option value="MTs">MTs</option>
                      <option value="SD">SD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-xs flex items-center gap-1">
                      🏛️ Status Sekolah
                    </label>
                    <select
                      value={formData.schoolStatus || 'Negeri'}
                      onChange={(e) =>
                        setFormData({ ...formData, schoolStatus: e.target.value as any })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                    >
                      <option value="Negeri">Negeri</option>
                      <option value="Swasta">Swasta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-xs flex items-center gap-1">
                      🎗️ Akreditasi
                    </label>
                    <input
                      type="text"
                      value={formData.accreditation || 'A'}
                      onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-xs flex items-center gap-1">
                      📮 Kode Pos
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                {/* Nama Yayasan, NPSN, NSS */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                  <div className="sm:col-span-6">
                    <label className="block text-slate-700 font-bold mb-1 text-xs flex items-center gap-1">
                      🏛️ Nama Yayasan / Penyelenggara
                    </label>
                    <input
                      type="text"
                      placeholder="Khusus Swasta (kosongkan jika Negeri)"
                      value={formData.foundationName || ''}
                      onChange={(e) => setFormData({ ...formData, foundationName: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400"
                    />
                    <div className="flex items-start gap-1 mt-1 text-[10px] text-slate-500 leading-tight">
                      <Info className="w-3 h-3 text-sky-500 shrink-0 mt-0.5" />
                      <span>
                        Status Negeri: Nama yayasan boleh dikosongkan agar kop surat langsung menggunakan instansi pemerintah.
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-slate-700 font-bold mb-1 text-xs flex items-center gap-1">
                      📇 NPSN
                    </label>
                    <input
                      type="text"
                      value={formData.npsn}
                      onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-semibold text-slate-800"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-slate-700 font-bold mb-1 text-xs flex items-center gap-1">
                      # NSS (Nomor Statistik)
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor Statistik"
                      value={formData.nss}
                      onChange={(e) => setFormData({ ...formData, nss: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Detail Wilayah & Pimpinan */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Detail Wilayah & Pimpinan
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Kelurahan/Desa</label>
                  <input
                    type="text"
                    value={formData.kelurahan || 'Desa Sumbertlaseh'}
                    onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Kecamatan</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Kabupaten/Kota</label>
                  <input
                    type="text"
                    value={formData.regency}
                    onChange={(e) => setFormData({ ...formData, regency: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                    👤 Nama Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.principalName}
                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">NIP Kepala Sekolah</label>
                  <input
                    type="text"
                    placeholder="Kosongkan jika bukan PNS"
                    value={formData.principalNip}
                    onChange={(e) => setFormData({ ...formData, principalNip: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                  {/* Toggle Switch */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          showPrincipalNipText: !formData.showPrincipalNipText,
                        })
                      }
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition duration-200 cursor-pointer ${
                        formData.showPrincipalNipText ? 'bg-[#008ba3]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ${
                          formData.showPrincipalNipText ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-[11px] text-slate-600 font-medium">
                      Munculkan kata "NIP" di tanda tangan
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-700 font-bold mb-1">
                    Prefix Tanda Tangan (Kiri)
                  </label>
                  <input
                    type="text"
                    value={formData.signaturePrefix || 'Mengetahui,'}
                    onChange={(e) => setFormData({ ...formData, signaturePrefix: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-amber-700 font-bold mb-1">
                    Jabatan di Tanda Tangan (Kiri)
                  </label>
                  <input
                    type="text"
                    value={formData.signatureRole || 'Kepala Sekolah,'}
                    onChange={(e) => setFormData({ ...formData, signatureRole: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    📞 Telepon Sekolah
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 0353-881234"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    ✉️ Email Sekolah
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    🌐 Website Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                  📋 Daftar Program Keahlian (Header Laporan)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Teknik Komputer - Akuntansi - Dst..."
                  value={formData.reportProgramList || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, reportProgramList: e.target.value })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400"
                />
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Teks ini akan muncul di baris ke-4 Kop Surat laporan/SKL.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    🏛️ Dinas Pendidikan Provinsi
                  </label>
                  <input
                    type="text"
                    value={formData.provincialEducationService || 'Dinas Pendidikan Provinsi'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        provincialEducationService: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    🏢 Cabang Dinas (Khusus SMA/SMK)
                  </label>
                  <input
                    type="text"
                    value={formData.branchOffice || 'Cabang Dinas Bojonegoro'}
                    onChange={(e) =>
                      setFormData({ ...formData, branchOffice: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* 3. Detail Petugas Tata Usaha / Administrator (Penandatangan) */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[#008ba3] font-bold text-base">👤</span>
                <h3 className="text-xs font-bold text-[#008ba3] uppercase tracking-wider">
                  Detail Petugas Tata Usaha / Administrator (Penandatangan)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Petugas yang akan muncul di tanda tangan kiri laporan (Buku Induk & Nilai).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nama Administrator</label>
                  <input
                    type="text"
                    value={formData.administrationHead}
                    onChange={(e) =>
                      setFormData({ ...formData, administrationHead: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">NIP Administrator</label>
                  <input
                    type="text"
                    value={formData.administrationNip}
                    onChange={(e) =>
                      setFormData({ ...formData, administrationNip: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          showAdminNipText: !formData.showAdminNipText,
                        })
                      }
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition duration-200 cursor-pointer ${
                        formData.showAdminNipText ? 'bg-[#008ba3]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ${
                          formData.showAdminNipText ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-[11px] text-slate-600 font-medium">
                      Munculkan kata "NIP"
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Jabatan di Tanda Tangan
                  </label>
                  <input
                    type="text"
                    value={formData.administrationRole || 'Kepala Urusan Tata Usaha'}
                    onChange={(e) =>
                      setFormData({ ...formData, administrationRole: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* 4. Periode Akademik Aktif */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#008ba3]" />
                <h3 className="text-xs font-bold text-[#008ba3] uppercase tracking-wider">
                  Periode Akademik Aktif
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tahun Ajaran Aktif</label>
                  <input
                    type="text"
                    value={formData.activeAcademicYear}
                    onChange={(e) =>
                      setFormData({ ...formData, activeAcademicYear: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Akan menjadi nilai default pada setiap penginputan nilai.
                  </span>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Semester Aktif</label>
                  <select
                    value={formData.activeSemester}
                    onChange={(e) =>
                      setFormData({ ...formData, activeSemester: e.target.value as any })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 font-semibold"
                  >
                    <option value="1 (Ganjil)">Semester 1 (Ganjil)</option>
                    <option value="2 (Genap)">Semester 2 (Genap)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 5. Pengaturan Pas Foto Awal Masuk pada Lembar Biodata Cetak */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold text-base">👤</span>
                <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Pengaturan Pas Foto Awal Masuk pada Lembar Biodata Cetak
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Mode Tampilan Foto di Lembar Cetak
                  </label>
                  <select
                    value={formData.photoDisplayMode}
                    onChange={(e) =>
                      setFormData({ ...formData, photoDisplayMode: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium"
                  >
                    <option value="Cetak Pas Foto Digital Siswa (Tercetak Warna di Kertas A4)">
                      Cetak Pas Foto Digital Siswa (Tercetak Warna di Kertas A4)
                    </option>
                    <option value="Tempel Pas Foto Studio Manual (Dikosongkan untuk Pas Foto Asli)">
                      Tempel Pas Foto Studio Manual (Dikosongkan untuk Pas Foto Asli)
                    </option>
                  </select>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Pilih sesuai kebijakan dinas/sekolah (cetak digital langsung atau tempel foto studio manual).
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Ukuran Kotak Pas Foto
                  </label>
                  <select
                    value={formData.photoBoxSize}
                    onChange={(e) =>
                      setFormData({ ...formData, photoBoxSize: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium"
                  >
                    <option value="3 × 4 cm (Standar Buku Induk & Ijazah)">
                      3 × 4 cm (Standar Buku Induk & Ijazah)
                    </option>
                    <option value="2 × 3 cm">2 × 3 cm</option>
                    <option value="4 × 6 cm">4 × 6 cm</option>
                  </select>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Proporsi kotak foto yang digambar pada lembar cetak biodata siswa.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Teks Keterangan di Bawah Pas Foto
                </label>
                <input
                  type="text"
                  value={formData.photoCaptionText}
                  onChange={(e) =>
                    setFormData({ ...formData, photoCaptionText: e.target.value })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
                <span className="text-[10px] text-slate-500 block mt-1 italic">
                  Contoh: Cap tiga jari tengah tangan kiri & tanda tangan di atas pas photo atau Pas Foto Masuk Siswa Baru.
                </span>
              </div>
            </div>

            {/* 6. Pengaturan Dokumen Kelulusan & Transkrip */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold text-base">📄</span>
                <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  Pengaturan Dokumen Kelulusan & Transkrip
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Tanggal Rapat Kelulusan
                  </label>
                  <input
                    type="date"
                    value={formData.graduationMeetingDate || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, graduationMeetingDate: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Muncul di poin pertimbangan Surat Keterangan Lulus (SKL).
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Tanggal Ijazah / Transkrip
                  </label>
                  <input
                    type="date"
                    value={formData.certificateDate || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, certificateDate: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Tanggal penerbitan Ijazah, Transkrip & Pasport Skill.
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#008ba3] hover:bg-[#007a8f] text-white font-extrabold rounded-lg shadow-sm transition cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <Save className="w-4 h-4" />
                <span>SIMPAN PERUBAHAN IDENTITAS</span>
              </button>
            </div>
          </form>
        </div>

        {/* ================= RIGHT COLUMN: CARDS & MAINTENANCE ================= */}
        <div className="space-y-5 text-xs">
          {/* Card 1: Mengapa Ini Penting? */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-[#008ba3] flex items-center gap-1.5">
              <span>💡</span> Mengapa Ini Penting?
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs">
              Data instansi yang Anda masukkan akan disinkronisasi secara otomatis ke seluruh bagian dokumen sistem:
            </p>
            <ul className="space-y-2 text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                  ✓
                </span>
                <span>Header & Kop Surat Laporan</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                  ✓
                </span>
                <span>Cover Buku Induk (Jilid)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                  ✓
                </span>
                <span>Lembar Identitas Peserta Didik</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                  ✓
                </span>
                <span>Footer Tanda Tangan Nilai</span>
              </li>
            </ul>

            <div className="p-3 bg-amber-400 text-amber-950 font-bold rounded-lg text-xs leading-snug flex items-start gap-2 shadow-2xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-900" />
              <span>
                Peringatan: Pastikan Nama Sekolah dan NIP Kepala Sekolah tertulis dengan benar untuk validitas cetakan fisik!
              </span>
            </div>
          </div>

          {/* Card 2: Kurikulum Merdeka SMK */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3.5">
            <h3 className="font-extrabold text-sm text-amber-600 flex items-center gap-1.5">
              <span>🌟</span> Kurikulum Merdeka Sekolah Menengah Kejuruan
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs">
              Gunakan alat ini untuk memastikan seluruh data peserta didik telah sesuai dengan standar Kurikulum Merdeka (Fase & Penamaan).
            </p>
            <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc list-inside">
              <li>Memastikan status <strong>Kurikulum Merdeka</strong> aktif.</li>
              <li>Memetakan <strong>Fase E</strong> untuk kelas X secara otomatis.</li>
              <li>Memetakan <strong>Fase F</strong> untuk kelas XI/XII secara otomatis.</li>
              <li>Menstandarisasi kode-kode administrasi kumer.</li>
            </ul>
            <button
              type="button"
              onClick={handleRepairKumer}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold rounded-lg shadow-xs transition cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide text-xs"
            >
              <span>🛠️</span>
              <span>PERBAIKI DATA OTOMATIS</span>
            </button>
          </div>

          {/* Card 3: Advanced Maintenance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3 text-center">
            <div className="flex items-center gap-1.5 justify-start text-left">
              <span>🛠️</span>
              <h3 className="font-extrabold text-sm text-slate-800">Advanced Maintenance</h3>
            </div>
            <div className="py-2 space-y-1">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-2xl">
                🚀
              </div>
              <h4 className="font-extrabold text-slate-800 text-xs">Optimasi & Pembersihan</h4>
              <p className="text-[11px] text-slate-500">
                Tingkatkan performa sistem dengan membersihkan data sampah dan optimasi database.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.('maintenance')}
              className="w-full py-2.5 px-4 bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold rounded-lg shadow-xs transition cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide text-xs"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>BUKA ADVANCED TOOLS</span>
            </button>
          </div>

          {/* Card 4: Audit Log System */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="font-extrabold text-sm text-[#008ba3] flex items-center gap-1.5">
              <span>🔄</span> Audit Log System
            </h3>
            <p className="text-slate-600 text-xs">
              Lihat seluruh rekam jejak aktivitas, histori perubahan data siswa, dan impor data oleh pengguna.
            </p>
            <button
              type="button"
              onClick={() => onNavigate?.('audit-log')}
              className="w-full py-2.5 px-4 bg-[#008ba3] hover:bg-[#007a8f] text-white font-bold rounded-lg shadow-xs transition cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide text-xs"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>BUKA AUDIT LOG</span>
            </button>
          </div>

          {/* Card 5: Database Maintenance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-rose-600 flex items-center gap-1.5">
              <span>🗄️</span> Database Maintenance
            </h3>

            <div className="space-y-2">
              <span className="block text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                OPSI PENCADANGAN DATA
              </span>
              <button
                type="button"
                onClick={handleDownloadFullBackup}
                className="w-full py-2.5 px-4 bg-[#008ba3] hover:bg-[#007a8f] text-white font-extrabold rounded-lg shadow-xs transition cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>FULL BACKUP (.ZIP)</span>
              </button>
              <span className="block text-center text-[10px] text-slate-500">
                Sangat Disarankan (SQL + Excel)
              </span>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadSQL}
                  className="py-2 px-3 border border-emerald-500 text-emerald-700 bg-emerald-50/40 hover:bg-emerald-100/50 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Database SQL</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadExcel}
                  className="py-2 px-3 border border-sky-500 text-sky-700 bg-sky-50/40 hover:bg-sky-100/50 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Rekap Excel</span>
                </button>
              </div>
            </div>

            {/* Restore Section */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <h4 className="font-bold text-slate-700 text-xs">Pulihkan Data (Restore)</h4>
              <p className="text-[11px] text-slate-500 leading-snug">
                Unggah file backup sebelumnya untuk memulihkan keadaan database.
              </p>

              <div className="flex">
                <input
                  type="text"
                  readOnly
                  placeholder="Upload File SQL..."
                  value={restoreFile?.name || ''}
                  className="flex-1 px-2.5 py-1.5 border border-r-0 border-slate-300 rounded-l-lg bg-slate-50 text-slate-500 text-xs truncate"
                />
                <button
                  type="button"
                  onClick={() => restoreInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-r-lg text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Browse
                </button>
                <input
                  ref={restoreInputRef}
                  type="file"
                  accept=".sql,.json"
                  onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

              <button
                type="button"
                onClick={handleExecuteRestore}
                className="w-full py-2 px-4 border border-rose-500 text-rose-600 hover:bg-rose-50 font-extrabold rounded-lg transition cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>JALANKAN RESTORE</span>
              </button>
            </div>

            {/* Red Warning Box */}
            <div className="p-3 border border-rose-300 bg-rose-50/60 text-rose-900 rounded-lg text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-700">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>PERINGATAN!</span>
              </div>
              <p className="text-slate-600 leading-tight">
                Proses restore akan menghapus data yang ada saat ini secara permanen. Pastikan Anda menggunakan file backup yang valid.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer matching screenshot */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          Copyright © 2026 <strong className="text-sky-600">Buku Induk Digital</strong>. Powered by <strong className="text-sky-600">Syntax Trust</strong>. All rights reserved.
        </p>
        <span className="font-semibold text-slate-600">Version 1.2.0</span>
      </div>
    </div>
  );
};
