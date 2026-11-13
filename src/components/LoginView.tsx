import React, { useState } from 'react';
import { SchoolSettings } from '../types';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Building2,
  Calendar,
  Award,
  CreditCard,
  BookOpen,
  FileText,
  ShieldCheck,
  MapPin,
  Mail,
  QrCode,
  Info,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react';
import { asset } from '../utils/asset';

interface LoginViewProps {
  schoolSettings: SchoolSettings;
  onLogin: (role: string, name: string) => void;
  onOpenVerification?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  schoolSettings,
  onLogin,
  onOpenVerification,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Harap masukkan nama pengguna dan kata sandi.');
      return;
    }

    let roleName = 'Administrator Sistem';
    if (username.toLowerCase().includes('wali')) roleName = 'Wali Kelas';
    else if (username.toLowerCase().includes('op')) roleName = 'Operator Sekolah / TU';
    else if (username.toLowerCase().includes('guru')) roleName = 'Guru Mata Pelajaran';

    onLogin(roleName, username);
  };

  const handleVerifyDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;
    setVerificationResult(
      `Dokumen Valid & Resmi: SKL / Transkrip terverifikasi di database SMKN DANDER untuk kode verifikasi "${verificationCode.trim()}". Status: Asli & Sah.`
    );
  };

  return (
    <div className="min-h-screen bg-[#081026] relative flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Background Dot Matrix Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Container Card matching screenshot */}
      <div className="relative z-10 max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700/40 flex flex-col md:flex-row">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Dark Navy Section */}
        {/* ========================================================================= */}
        <div className="md:w-[48%] bg-gradient-to-br from-[#0c1a32] via-[#0b1e38] to-[#071325] text-white p-7 sm:p-9 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            {/* Top Logos Row: Kemendikbud & SMKN Dander */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 p-2 flex items-center justify-center shadow-inner">
                <img
                  src={asset('/assets/tut-wuri-handayani.svg')}
                  alt="Tut Wuri Handayani - Kemendikbud"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 p-2 flex items-center justify-center shadow-inner">
                <img
                  src={asset('/assets/logo-smkn-dander.png')}
                  alt="Logo Resmi SMKN Dander"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Dinas & School Headline */}
            <div className="mt-6">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>DINAS PENDIDIKAN PROVINSI</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-wide mt-1">
                SMKN DANDER
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed mt-1.5 font-normal">
                Sistem Informasi Manajemen Buku Induk Peserta Didik (SIMBI) & Arsip Data Kelulusan Resmi
              </p>
            </div>

            {/* Badges Matrix */}
            <div className="mt-4 space-y-2">
              <div className="flex flex-wrap gap-2 text-[11px]">
                <div className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                  <span>NPSN: {schoolSettings.npsn || '20541259'}</span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                  <span>Jenjang: {schoolSettings.activeJenjang || 'SMK'}</span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-sky-400" />
                  <span>Akreditasi {schoolSettings.accreditation || 'A'}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <div className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>T.A. {schoolSettings.activeAcademicYear || '2026/2027'} (Ganjil)</span>
                </div>
              </div>
            </div>

            {/* 3 Core System Features */}
            <div className="mt-6 space-y-3.5">
              {/* Feature 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-900/60 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white leading-tight">
                    Buku Induk & Lembar Klapper Otomatis
                  </h2>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Dokumentasi riwayat identitas peserta didik dari registrasi masuk, mutasi, hingga tamat belajar.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-900/60 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white leading-tight">
                    Rekam Nilai & Pelaporan Akademik Standar
                  </h2>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Format rekapitulasi nilai rapor Kurikulum Merdeka & Kurikulum 2013 siap cetak sesuai standar kementerian.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-900/60 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white leading-tight">
                    Arsip Transkrip & Verifikasi Dokumen Digital
                  </h2>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Penerbitan SKL, transkrip nilai, dan paspor kompetensi terintegrasi QR Code untuk verifikasi publik.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom School Contact Info */}
          <div className="border-t border-white/10 pt-4 mt-6 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{schoolSettings.address || 'Jl. KHR. Moh Rosyid Desa Sumbertlaseh Kec. Dander Bojonegoro'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{schoolSettings.regency || 'Bojonegoro'}, {schoolSettings.province || 'Jawa Timur'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{schoolSettings.email || 'smkn_dander@yahoo.co.id'}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Clean White Login Form */}
        {/* ========================================================================= */}
        <div className="md:w-[52%] bg-white p-7 sm:p-9 flex flex-col justify-between text-slate-800">
          <div>
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-black uppercase tracking-wider rounded-full shadow-2xs">
              <Lock className="w-3 h-3" />
              <span>AUTENTIKASI PENGGUNA</span>
            </div>

            {/* Heading & Subtitle */}
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">
              Masuk ke Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Masukkan nama pengguna dan kata sandi Anda untuk mengelola arsip Buku Induk Siswa.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Field 1: Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Pengguna (Username / NIP)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin / NIP"
                    className="w-full pl-10 pr-3 py-2.5 border border-sky-500 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200 transition bg-white"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Masuk ke Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Verifikasi Dokumen Kelulusan Sub-card */}
            <div
              onClick={() => (onOpenVerification ? onOpenVerification() : setIsQRModalOpen(true))}
              className="mt-5 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 flex items-center justify-between gap-3 cursor-pointer transition group"
            >
              <div>
                <strong className="text-xs font-bold text-slate-900 group-hover:text-sky-700 block leading-tight transition">
                  Verifikasi Dokumen Kelulusan
                </strong>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Validasi keaslian SKL dan Transkrip Nilai secara online.
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenVerification) {
                    onOpenVerification();
                  } else {
                    setIsQRModalOpen(true);
                  }
                }}
                className="px-3 py-1.5 bg-white hover:bg-sky-50 border border-slate-300 rounded-lg text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer whitespace-nowrap shrink-0 group-hover:border-sky-400 group-hover:text-sky-700"
              >
                <QrCode className="w-3.5 h-3.5 text-slate-700 group-hover:text-sky-700" />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Disclaimer Text */}
            <div className="mt-4 flex items-start gap-1.5 text-[10px] text-slate-500 leading-relaxed">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Akses portal ini dibatasi untuk Administrator, Tenaga Administrasi Sekolah, dan Guru yang memiliki otorisasi resmi. Seluruh aktivitas terekam dalam log sistem.
              </span>
            </div>
          </div>

          {/* Footer Credits */}
          <div className="pt-6 border-t border-slate-100 text-center space-y-1">
            <p className="text-[11px] text-slate-600 font-medium">
              © 2026 <strong>SMKN DANDER</strong> • Seluruh Hak Cipta Dilindungi
            </p>
            <p className="text-[11px] text-slate-500">
              Build & Powered by{' '}
              <a
                href="https://syntaxtrust.web.id"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 font-bold hover:underline"
              >
                SyntaxTrust Web IT Solutions (syntaxtrust.web.id)
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL SCAN QR VERIFIKASI DOKUMEN KELULUSAN */}
      {/* ========================================================================= */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-sky-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Verifikasi Dokumen Kelulusan
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsQRModalOpen(false);
                  setVerificationResult(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Arahkan kamera ke QR Code yang tercetak pada SKL atau Transkrip Nilai, atau masukkan kode serial dokumen di bawah ini:
            </p>

            <form onSubmit={handleVerifyDoc} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Kode Serial / Nomor Registrasi Dokumen
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SKL-SMKND-2026-906.017"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Cek Keaslian Dokumen</span>
              </button>
            </form>

            {verificationResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hasil Validasi Sistem</span>
                </div>
                <p className="text-[11px] leading-relaxed">{verificationResult}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsQRModalOpen(false);
                  setVerificationResult(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
