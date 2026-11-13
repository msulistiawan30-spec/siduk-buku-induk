import React from 'react';
import { SchoolSettings } from '../types';
import {
  LayoutDashboard,
  UserCircle,
  Users,
  Layers,
  Book,
  Target,
  FileEdit,
  Building,
  Award,
  ArrowLeftRight,
  GraduationCap,
  TrendingUp,
  Compass,
  Archive,
  Printer,
  ClipboardCheck,
  CheckSquare,
  ListOrdered,
  FileSpreadsheet,
  FileText,
  UserCog,
  Shield,
  Sliders,
  Wrench,
  Clock,
  LogOut,
  School,
  X,
  Settings,
  Camera,
  Cloud,
} from 'lucide-react';
import { asset } from '../utils/asset';

interface SidebarProps {
  currentMenu: string;
  onSelectMenu: (menu: string) => void;
  schoolSettings: SchoolSettings;
  activeRole: string;
  currentUser?: {
    fullName: string;
    username: string;
    avatarUrl?: string;
  };
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMenu,
  onSelectMenu,
  schoolSettings,
  activeRole,
  currentUser,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}) => {
  const operasionalItems = [
    { key: 'siswa', label: 'Manajemen Peserta Didik', icon: Users },
    { key: 'upload-foto-massal', label: 'Upload Foto Massal', icon: Camera, badge: 'Baru' },
    { key: 'kelas', label: 'Manajemen Kelas', icon: School },
    { key: 'keahlian', label: 'Program Keahlian', icon: Layers },
    { key: 'mapel', label: 'Mata Pelajaran', icon: Book },
    { key: 'tp', label: 'Tujuan Pembelajaran', icon: Target },
    { key: 'nilai', label: 'Penilaian & Rapor', icon: FileEdit },
    { key: 'pkl', label: 'Manajemen PKL', icon: Building },
    { key: 'ukk', label: 'Manajemen UKK', icon: Award },
    { key: 'mutasi', label: 'Manajemen Mutasi', icon: ArrowLeftRight },
    { key: 'kelulusan', label: 'Manajemen Kelulusan', icon: GraduationCap },
    { key: 'kenaikan-massal', label: 'Kenaikan Kelas Massal', icon: TrendingUp },
    { key: 'validasi-kelulusan', label: 'Validasi Kelulusan Massal', icon: CheckSquare },
    { key: 'tracer', label: 'Tracer Alumni', icon: Compass },
  ];

  const arsipItems = [
    { key: 'arsip-alumni', label: 'Arsip Alumni & Mutasi', icon: Archive },
    { key: 'pusat-cetak', label: 'Cetak Laporan Induk', icon: Printer, highlight: true },
    { key: 'buku-pemeriksaan', label: 'Buku Pemeriksaan', icon: ClipboardCheck },
    { key: 'smart-checklist', label: 'Smart Checklist', icon: CheckSquare, badge: '83%' },
    { key: 'register-induk', label: 'Register Buku Induk', icon: ListOrdered },
    { key: 'buku-klapper', label: 'Buku Klapper (A-Z)', icon: FileSpreadsheet, highlight: true },
    { key: 'buku-mutasi', label: 'Buku Mutasi', icon: ArrowLeftRight },
    { key: 'google-drive', label: 'Google Drive & Cadangan', icon: Cloud, highlight: true },
  ];

  const sistemItems = [
    { key: 'template-dokumen', label: 'Template Dokumen', icon: FileText },
    { key: 'manajemen-pengguna', label: 'Manajemen Pengguna', icon: UserCog },
    { key: 'rbac', label: 'Hak Akses & Role (RBAC)', icon: Shield },
    { key: 'pengaturan', label: 'Konfigurasi Instansi', icon: Sliders },
  ];

  const renderNavButton = (item: {
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    highlight?: boolean;
  }) => {
    const isActive = currentMenu === item.key;
    const Icon = item.icon;

    return (
      <button
        key={item.key}
        onClick={() => {
          onSelectMenu(item.key);
          onCloseMobile();
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs transition duration-150 group cursor-pointer ${
          isActive
            ? 'bg-[#008ba3] text-white shadow-xs font-semibold'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              isActive
                ? 'text-white'
                : item.highlight
                ? 'text-sky-600'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span className="truncate">{item.label}</span>
        </div>
        {item.badge && (
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
              isActive
                ? 'bg-sky-700 text-white'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-white text-slate-700 flex-shrink-0 flex flex-col border-r border-slate-200 transform transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Identitas Singkat Sekolah */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 bg-sky-50 border border-sky-100 text-sky-600 rounded-lg flex items-center justify-center font-bold text-lg shrink-0 shadow-xs overflow-hidden p-0.5">
              <img
                src={(schoolSettings as any)?.logoUrl || asset('/assets/logo-smkn-dander.png')}
                alt="Logo SMKN DANDER"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-extrabold text-slate-900 truncate tracking-wide" title={schoolSettings.name}>
                {schoolSettings.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card as in screenshot */}
        <div className="p-3.5 border-b border-slate-100 bg-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-700 font-bold text-xs">
                {currentUser?.fullName?.charAt(0) || 'A'}
              </div>
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="text-xs font-bold text-slate-800 truncate" title={currentUser?.fullName || 'Administrator Sistem'}>
              {currentUser?.fullName || 'Administrator Sistem'}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-700">{activeRole || 'ADMIN'}</span>
            </div>
          </div>
        </div>

        {/* Quick Switcher Jenjang Aktif with Settings icon as in screenshot */}
        <div className="px-3.5 py-2.5">
          <div className="p-2.5 bg-slate-50/80 border border-slate-200/90 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-sky-100/70 border border-sky-200/80 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 text-sky-600" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
                  JENJANG AKTIF
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="px-1 py-0.2 bg-sky-600 text-white rounded font-bold text-[9px] leading-tight">
                    SMK
                  </span>
                  <span className="text-slate-700 font-bold text-xs truncate">
                    Sekolah Men...
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onSelectMenu('pengaturan');
                onCloseMobile();
              }}
              className="w-6 h-6 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-xs shrink-0"
              title="Konfigurasi Instansi"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* List Menu Navigasi Lengkap */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 text-xs custom-scrollbar">
          {/* Main overview */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                onSelectMenu('dashboard');
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-xs transition cursor-pointer ${
                currentMenu === 'dashboard'
                  ? 'bg-[#008ba3] text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard Overview</span>
            </button>
            <button
              onClick={() => {
                onSelectMenu('profil');
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-xs transition cursor-pointer ${
                currentMenu === 'profil'
                  ? 'bg-[#008ba3] text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <UserCircle className="w-4 h-4 shrink-0" />
              <span>Profil Saya</span>
            </button>
          </div>

          {/* OPERASIONAL DATA */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5 flex items-center justify-between">
              <span>OPERASIONAL DATA</span>
            </div>
            <div className="space-y-0.5">{operasionalItems.map(renderNavButton)}</div>
          </div>

          {/* ARSIP & PELAPORAN */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5 flex items-center justify-between">
              <span>ARSIP & PELAPORAN</span>
            </div>
            <div className="space-y-0.5">{arsipItems.map(renderNavButton)}</div>
          </div>

          {/* SISTEM APLIKASI */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5 flex items-center justify-between">
              <span>PENGATURAN & SISTEM</span>
            </div>
            <div className="space-y-0.5">{sistemItems.map(renderNavButton)}</div>
          </div>

          {/* Logout button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-xs text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout Sesi</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};
