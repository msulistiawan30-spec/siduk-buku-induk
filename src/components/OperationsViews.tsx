import React, { useState } from 'react';
import {
  Student,
  ProgramKeahlian,
  SchoolClass,
  SubjectScore,
  PKLRecord,
  UKKRecord,
  MutationRecord,
  AlumniTracer,
  AuditLogItem,
  SchoolSettings,
} from '../types';
import {
  School,
  Layers,
  FileEdit,
  Building,
  Award,
  ArrowLeftRight,
  GraduationCap,
  TrendingUp,
  Compass,
  Clock,
  Shield,
  UserCircle,
  Plus,
  CheckCircle,
  MapPin,
  Search,
  Printer,
  ChevronRight,
  FileText,
  BadgeCheck,
} from 'lucide-react';

interface OperationsViewsProps {
  currentMenu: string;
  students: Student[];
  programs: ProgramKeahlian[];
  classes: SchoolClass[];
  scores: SubjectScore[];
  pklList: PKLRecord[];
  ukkList: UKKRecord[];
  mutations: MutationRecord[];
  tracers: AlumniTracer[];
  auditLogs: AuditLogItem[];
  schoolSettings: SchoolSettings;
  activeRole: string;
  onOpenStudent: (student: Student) => void;
  onNavigate: (menuKey: string) => void;
}

export const OperationsViews: React.FC<OperationsViewsProps> = ({
  currentMenu,
  students,
  programs,
  classes,
  scores,
  pklList,
  ukkList,
  mutations,
  tracers,
  auditLogs,
  schoolSettings,
  activeRole,
  onOpenStudent,
  onNavigate,
}) => {
  // 1. MANAJEMEN KELAS
  if (currentMenu === 'kelas') {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <School className="w-5 h-5 text-sky-600" /> Manajemen Rombongan Belajar (Kelas)
            </h1>
            <p className="text-xs text-slate-500">
              Daftar rombel aktif, wali kelas, ruang belajar, dan rekapitulasi jumlah siswa.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-sky-300 transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-sky-50 text-sky-700 font-bold rounded text-[10px] border border-sky-200">
                    Tingkat {cls.gradeLevel} • Fase {cls.fase}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{cls.name}</h3>
                  <p className="text-xs text-slate-500">{cls.programKeahlian}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-sky-700">{cls.studentCount}</span>
                  <span className="text-[10px] text-slate-400 block">Siswa</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                <div>
                  Wali Kelas: <strong className="text-slate-900">{cls.homeroomTeacher}</strong>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">NIP. {cls.homeroomNip}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {cls.room}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 2. PROGRAM KEAHLIAN
  if (currentMenu === 'keahlian') {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" /> Program & Konsentrasi Keahlian
          </h1>
          <p className="text-xs text-slate-500">
            Bidang keahlian vokasi yang terdaftar secara resmi di Kemendikbudristek untuk {schoolSettings.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((prog) => (
            <div
              key={prog.code}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded text-[10px] border border-emerald-200 uppercase">
                    Kode: {prog.code} • {prog.category}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1.5">{prog.name}</h3>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700 font-black text-sm">
                  {prog.totalStudents} Siswa
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{prog.description}</p>

              <div className="pt-3 border-t border-slate-100 text-xs flex justify-between items-center text-slate-500">
                <span>
                  Ketua Program: <strong className="text-slate-800">{prog.headOfProgram}</strong>
                </span>
                <span className="text-emerald-700 font-semibold text-[11px]">Akreditasi A</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 3. PENILAIAN & RAPOR (KURIKULUM MERDEKA)
  if (currentMenu === 'nilai' || currentMenu === 'tp' || currentMenu === 'mapel') {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-sky-600" /> Penilaian & Capaian Pembelajaran (TP)
          </h1>
          <p className="text-xs text-slate-500">
            Rekapitulasi penilaian sumatif, formatif, dan deskripsi capaian pembelajaran Kurikulum Merdeka Fase E & F.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Rekap Nilai Siswa Terdaftar (48 Capaian Pembelajaran Terinput)</span>
            <span className="text-[11px] text-slate-400 font-normal">Semester Ganjil 2025/2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Peserta Didik</th>
                  <th className="p-3">Mata Pelajaran</th>
                  <th className="p-3">Tujuan Pembelajaran (TP)</th>
                  <th className="p-3 text-center">Formatif</th>
                  <th className="p-3 text-center">Sumatif</th>
                  <th className="p-3 text-center">Nilai Akhir</th>
                  <th className="p-3 text-center">Predikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scores.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">{sc.studentName}</td>
                    <td className="p-3 text-slate-800 font-medium">
                      {sc.subjectName}
                      <span className="block text-[10px] text-slate-400">{sc.category}</span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs leading-relaxed">
                      <strong className="text-slate-800">{sc.tpCode}:</strong> {sc.tpDescription}
                    </td>
                    <td className="p-3 text-center font-mono">{sc.formativeScore}</td>
                    <td className="p-3 text-center font-mono">{sc.summativeScore}</td>
                    <td className="p-3 text-center font-mono font-bold text-sky-700 text-sm">
                      {sc.finalScore}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {sc.predicate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  // 4. MANAJEMEN PKL
  if (currentMenu === 'pkl') {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-5 h-5 text-cyan-600" /> Manajemen Praktik Kerja Lapangan (PKL)
          </h1>
          <p className="text-xs text-slate-500">
            Pemantauan penempatan industri mitra (DUDI), pembimbing lapangan, dan penilaian sertifikat magang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pklList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-cyan-50 text-cyan-800 font-bold rounded text-[10px] border border-cyan-200">
                    {item.classGrade} • {item.programKeahlian}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{item.studentName}</h3>
                  <div className="text-xs font-semibold text-cyan-700">{item.companyName}</div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-cyan-700 font-mono">{item.score}</span>
                  <span className="text-[10px] text-emerald-700 font-bold block">{item.predicate}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                <div>
                  Bidang: <strong>{item.companyField}</strong>
                </div>
                <div>
                  Mentor DUDI: <strong>{item.mentorName}</strong>
                </div>
                <div>
                  Guru Pembimbing: <strong>{item.supervisorTeacher}</strong>
                </div>
                <div className="text-[11px] text-slate-400">Periode: {item.period}</div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {item.status}
                </span>
                <span className="text-sky-600 font-semibold cursor-pointer hover:underline text-[11px]">
                  Cetak Lembar Nilai PKL &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 5. MANAJEMEN UKK
  if (currentMenu === 'ukk') {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" /> Uji Kompetensi Keahlian (UKK) & LSP
          </h1>
          <p className="text-xs text-slate-500">
            Penilaian sertifikasi keahlian vokasi dengan penguji internal dan asesor eksternal dari industri.
          </p>
        </div>

        <div className="space-y-4">
          {ukkList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-bold rounded text-[10px] border border-amber-200">
                  {item.programKeahlian}
                </span>
                <h3 className="text-base font-bold text-slate-900">{item.studentName}</h3>
                <p className="text-xs text-slate-600 font-medium">{item.clusterScheme}</p>
                <div className="text-xs text-slate-500 pt-1">
                  Asesor Eksternal: <strong>{item.assessorExternal}</strong>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  No. Sertifikat: {item.certificateNumber}
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                <div className="text-right">
                  <div className="text-2xl font-black text-amber-600 font-mono">{item.finalScore}</div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 6. MANAJEMEN MUTASI
  if (currentMenu === 'mutasi' || currentMenu === 'arsip-alumni') {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-sky-600" /> Manajemen Mutasi & Riwayat Pindah
          </h1>
          <p className="text-xs text-slate-500">
            Pencatatan resmi mutasi masuk dan mutasi keluar sesuai nomor surat dinas.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Peserta Didik</th>
                  <th className="p-3 text-center">Jenis Mutasi</th>
                  <th className="p-3">Tanggal & Nomor Surat</th>
                  <th className="p-3">Sekolah Asal / Tujuan</th>
                  <th className="p-3">Alasan Kepindahan</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mutations.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{m.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {m.nipd} • {m.nisn}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                        {m.type}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{m.date}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{m.letterNumber}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{m.schoolTargetOrOrigin}</td>
                    <td className="p-3 text-slate-600 max-w-xs">{m.reason}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  // 7. TRACER ALUMNI (BMW)
  if (currentMenu === 'tracer') {
    const bekerjaCount = tracers.filter((t) => t.category === 'Bekerja').length;
    const kuliahCount = tracers.filter((t) => t.category === 'Kuliah').length;
    const wirausahaCount = tracers.filter((t) => t.category === 'Wirausaha').length;

    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600" /> Tracer Study Jejak Alumni (BMW)
          </h1>
          <p className="text-xs text-slate-500">
            Penelusuran keterserapan lulusan: Bekerja, Melanjutkan Kuliah, Wirausaha (BMW).
          </p>
        </div>

        {/* 3 Statistik BMW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-500 text-white p-4 rounded-xl shadow-xs">
            <span className="text-xs uppercase font-bold text-emerald-100 tracking-wider">BEKERJA (INDUSTRI)</span>
            <div className="text-3xl font-black mt-1">{bekerjaCount} Siswa</div>
            <p className="text-[11px] text-emerald-100 mt-1">Terserap di PT Telkom, Auto2000, dsb.</p>
          </div>
          <div className="bg-sky-500 text-white p-4 rounded-xl shadow-xs">
            <span className="text-xs uppercase font-bold text-sky-100 tracking-wider">MELANJUTKAN (KULIAH)</span>
            <div className="text-3xl font-black mt-1">{kuliahCount} Siswa</div>
            <p className="text-[11px] text-sky-100 mt-1">Perguruan Tinggi Negeri & Swasta</p>
          </div>
          <div className="bg-amber-500 text-white p-4 rounded-xl shadow-xs">
            <span className="text-xs uppercase font-bold text-amber-100 tracking-wider">WIRAUSAHA MANDIRI</span>
            <div className="text-3xl font-black mt-1">{wirausahaCount} Siswa</div>
            <p className="text-[11px] text-amber-100 mt-1">Mendirikan Usaha Jasa / Digital</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Nama Alumni</th>
                  <th className="p-3">Tahun Lulus</th>
                  <th className="p-3">Program Keahlian</th>
                  <th className="p-3 text-center">Status Jejak</th>
                  <th className="p-3">Instansi / Kampus / Bisnis</th>
                  <th className="p-3">Posisi / Jurusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tracers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">{t.studentName}</td>
                    <td className="p-3 font-mono text-slate-600">{t.graduationYear}</td>
                    <td className="p-3 text-slate-600">{t.programKeahlian}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.category === 'Bekerja'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.category === 'Kuliah'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{t.institutionName}</td>
                    <td className="p-3 text-slate-600">{t.fieldOrMajor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  // 8. AUDIT LOG SISTEM
  if (currentMenu === 'audit-log') {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" /> Audit Log & Rekaman Aktivitas
          </h1>
          <p className="text-xs text-slate-500">
            Jejak digital setiap akses pengubahan buku induk, nilai, dan otentikasi operator.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Waktu (Timestamp)</th>
                  <th className="p-3">Pengguna & Peran</th>
                  <th className="p-3">Aktivitas / Aksi</th>
                  <th className="p-3">Target Dokumen</th>
                  <th className="p-3 text-right">Alamat IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 text-slate-500">{log.timestamp}</td>
                    <td className="p-3 font-sans">
                      <strong className="text-slate-900 font-bold block">{log.user}</strong>
                      <span className="text-[10px] text-sky-600">{log.role}</span>
                    </td>
                    <td className="p-3 font-sans font-semibold text-slate-800">{log.action}</td>
                    <td className="p-3 font-sans text-slate-600">{log.target}</td>
                    <td className="p-3 text-right text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  // 9. RBAC & PROFIL SAYA
  if (currentMenu === 'rbac' || currentMenu === 'manajemen-pengguna') {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-600" /> Hak Akses & Matriks Role (RBAC)
          </h1>
          <p className="text-xs text-slate-500">
            Konfigurasi izin otorisasi peran pengguna dalam mengelola buku induk sekolah.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
            Matriks Izin Role v1.2.0
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-200 text-left">
              <thead className="bg-slate-50 uppercase font-bold text-[10px] text-slate-700">
                <tr>
                  <th className="p-3 border-r border-slate-200">Menu & Fitur</th>
                  <th className="p-3 text-center border-r border-slate-200">Administrator</th>
                  <th className="p-3 text-center border-r border-slate-200">Operator Dapodik</th>
                  <th className="p-3 text-center border-r border-slate-200">Wali Kelas</th>
                  <th className="p-3 text-center">Pengawas Dinas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-medium">Buku Induk Register (Tambah & Edit)</td>
                  <td className="p-3 text-center font-bold text-emerald-600">Penuh</td>
                  <td className="p-3 text-center font-bold text-emerald-600">Penuh</td>
                  <td className="p-3 text-center text-slate-400">Lihat Saja</td>
                  <td className="p-3 text-center text-slate-400">Lihat Saja</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Cetak Dokumen Resmi A4</td>
                  <td className="p-3 text-center font-bold text-emerald-600">Penuh</td>
                  <td className="p-3 text-center font-bold text-emerald-600">Penuh</td>
                  <td className="p-3 text-center font-bold text-emerald-600">Penuh</td>
                  <td className="p-3 text-center font-bold text-emerald-600">Penuh</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Pengaturan Sekolah & Database Backup</td>
                  <td className="p-3 text-center font-bold text-emerald-600">Penuh</td>
                  <td className="p-3 text-center text-rose-500">Terkunci</td>
                  <td className="p-3 text-center text-rose-500">Terkunci</td>
                  <td className="p-3 text-center text-rose-500">Terkunci</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  // 10. PROFIL SAYA
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-sky-600" /> Profil Pengguna Sesi
        </h1>
        <p className="text-xs text-slate-500">Informasi akun yang sedang aktif di sistem SIDUK.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-sky-600 text-white text-2xl font-black flex items-center justify-center shadow-md shadow-sky-600/30">
            AD
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Administrator Utama</h3>
            <span className="text-xs text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              {activeRole}
            </span>
            <div className="text-xs text-slate-400 mt-1">{schoolSettings.name}</div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs space-y-2 text-slate-600">
          <div className="flex justify-between">
            <span>Status Akun:</span>
            <strong className="text-emerald-700">Terverifikasi Aktif</strong>
          </div>
          <div className="flex justify-between">
            <span>Tahun Ajaran Aktif:</span>
            <strong className="text-slate-900">{schoolSettings.activeAcademicYear}</strong>
          </div>
          <div className="flex justify-between">
            <span>Jenjang:</span>
            <strong className="text-slate-900">{schoolSettings.activeJenjang}</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
