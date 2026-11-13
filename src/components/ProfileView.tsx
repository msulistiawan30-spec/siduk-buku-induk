import React, { useState } from 'react';
import { SchoolSettings } from '../types';
import {
  Save,
  Calendar,
  Clock,
  School,
  GraduationCap,
  Upload,
  CheckCircle,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

interface ProfileViewProps {
  schoolSettings: SchoolSettings;
  activeRole: string;
  currentUser: {
    fullName: string;
    username: string;
    nip: string;
    jabatan: string;
    avatarUrl?: string;
  };
  onUpdateProfile: (updated: {
    fullName: string;
    nip: string;
    jabatan: string;
    avatarUrl?: string;
  }) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  schoolSettings,
  activeRole,
  currentUser,
  onUpdateProfile,
}) => {
  const [fullName, setFullName] = useState(currentUser.fullName || 'M. EKO HARIS SULISTIAWAN');
  const [nip, setNip] = useState(currentUser.nip || '-');
  const [jabatan, setJabatan] = useState(currentUser.jabatan || 'Kepala Tata Usaha');
  const [newPassword, setNewPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>(currentUser.avatarUrl || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      fullName,
      nip,
      jabatan,
      avatarUrl: avatarPreview || currentUser.avatarUrl,
    });
    setSaveSuccess(true);
    setNewPassword('');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Profil Saya</h1>
        
        {/* Right Date & Time pill as shown in screenshot */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>25 Oct 2026</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f172a] text-white rounded-lg font-mono font-bold text-xs shadow-xs">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>22:47:28</span>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profil berhasil diperbarui dan disimpan ke sistem!</span>
        </div>
      )}

      {/* Main Grid: Left Card (Summary) & Right Card (Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Panel Kiri: Ringkasan Profil Card (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Top colored accent line */}
          <div className="h-1 bg-sky-500 w-full"></div>
          
          <div className="p-6 text-center">
            {/* Avatar Circle with Logo / Photo */}
            <div className="w-28 h-28 mx-auto rounded-full bg-white border-4 border-slate-100 shadow-md flex items-center justify-center p-2 mb-4 overflow-hidden relative group">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={fullName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-slate-100">
                  {/* Stylized Logo Icon (Matches Syntax Trust S logo in screenshot) */}
                  <svg
                    className="w-16 h-16 text-teal-600"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M42 14L22 26C18 28.5 16 32 16 36C16 42 21 46 27 46L44 36"
                      stroke="#0284c7"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 50L42 38C46 35.5 48 32 48 28C48 22 43 18 37 18L20 28"
                      stroke="#0d9488"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Nama Lengkap & Role */}
            <h2 className="text-base font-extrabold text-slate-900 tracking-wide uppercase">
              {fullName}
            </h2>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              {activeRole || 'ADMIN'}
            </div>

            {/* Information Key-Value list exactly matching screenshot */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-xs space-y-3.5 text-left">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Username</span>
                <span className="text-slate-600 font-mono">{currentUser.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Jabatan</span>
                <span className="text-slate-600 font-medium">{jabatan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">NIP</span>
                <span className="text-slate-600 font-mono">{nip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Kanan: Form Pengaturan Profil (col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          {/* Badge Tab 'Pengaturan Profil' as in screenshot */}
          <div>
            <div className="inline-block px-4 py-2 bg-[#0284c7] text-white font-bold text-xs rounded-md shadow-xs tracking-wide">
              Pengaturan Profil
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="block text-slate-800 font-bold">Nama Lengkap</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* NIP */}
            <div className="space-y-1.5">
              <label className="block text-slate-800 font-bold">NIP</label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                placeholder="-"
              />
            </div>

            {/* Jabatan */}
            <div className="space-y-1.5">
              <label className="block text-slate-800 font-bold">Jabatan</label>
              <input
                type="text"
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                placeholder="Kepala Tata Usaha"
              />
            </div>

            {/* Note text exactly as screenshot */}
            <div className="pt-2 text-[11px] text-slate-500 italic">
              Kosongkan password jika tidak ingin mengubahnya.
            </div>

            {/* Password Baru */}
            <div className="space-y-1.5">
              <label className="block text-slate-800 font-bold">Password Baru</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                placeholder="Masukkan password baru"
              />
            </div>

            {/* Ganti Foto with custom file selector */}
            <div className="space-y-1.5">
              <label className="block text-slate-800 font-bold">Ganti Foto</label>
              <div className="flex rounded-md border border-slate-300 overflow-hidden bg-white">
                <input
                  type="text"
                  readOnly
                  value={selectedFileName || 'Pilih file...'}
                  className="flex-1 px-3.5 py-2 text-xs text-slate-500 bg-transparent focus:outline-none"
                />
                <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border-l border-slate-300 text-slate-700 font-medium text-xs cursor-pointer transition flex items-center">
                  <span>Browse</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[10px] text-slate-400">Format: JPG, PNG (Max 2MB)</p>
            </div>

            {/* Submit Button exactly as screenshot */}
            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-md shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer copyright matching screenshot */}
      <footer className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div>
          Copyright © 2026 <strong className="text-sky-700 font-semibold">Buku Induk Digital</strong>. Powered by{' '}
          <strong className="text-sky-700 font-semibold">Syntax Trust</strong>. All rights reserved.
        </div>
        <div className="font-mono text-slate-400">Version 1.2.0</div>
      </footer>
    </div>
  );
};
