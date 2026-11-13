import React, { useState, useEffect } from 'react';
import { Student, SchoolSettings } from '../types';
import {
  Menu,
  Search,
  School,
  Calendar,
  Clock,
  Tv,
  Bell,
  Sparkles,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { DriveSyncControl } from './DriveSyncControl';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  students: Student[];
  onSelectStudent: (student: Student) => void;
  schoolSettings: SchoolSettings;
  currentUser?: {
    fullName: string;
    avatarUrl?: string;
  };
  onOpenReleaseModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  students,
  onSelectStudent,
  schoolSettings,
  currentUser,
  onOpenReleaseModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [liveTime, setLiveTime] = useState('');
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredSearchStudents = searchQuery.trim()
    ? students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.nipd.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.nisn.includes(searchQuery)
      )
    : [];

  const togglePresentation = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsPresentationMode(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsPresentationMode(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search & Mobile toggle */}
      <div className="flex items-center gap-3 flex-1 max-w-md relative">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg border border-slate-200"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
            placeholder="Cari Nama / NISN / NIPD Siswa..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          />

          {/* Quick Search Dropdown */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-72 overflow-y-auto">
              <div className="p-2 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Hasil Pencarian Siswa ({filteredSearchStudents.length})
              </div>
              {filteredSearchStudents.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Tidak ditemukan siswa dengan kata kunci "{searchQuery}"
                </div>
              ) : (
                filteredSearchStudents.map((student) => (
                  <button
                    key={student.id}
                    onMouseDown={() => {
                      onSelectStudent(student);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-sky-50 flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                        {student.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-900">{student.fullName}</div>
                        <div className="text-[10px] text-slate-500">
                          NISN: {student.nisn} • {student.currentClass} • {student.programKeahlian}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-sky-600 font-semibold flex items-center gap-0.5">
                      Buka Induk <ChevronRight className="w-3 h-3" />
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Header Info & Actions Matching Screenshot */}
      <div className="flex items-center gap-2 md:gap-3 text-xs">
        <DriveSyncControl />

        {/* Jenjang Pill */}
        <div className="flex items-center gap-1.5 bg-[#0284c7] text-white px-2.5 py-1.5 rounded-md font-semibold text-xs shadow-xs">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Jenjang:</span>
          <span className="bg-white text-[#0284c7] px-1 py-0.2 rounded font-black text-[10px]">
            {schoolSettings.activeJenjang}
          </span>
        </div>

        {/* School Name Pill */}
        <div className="hidden lg:flex items-center gap-1.5 text-slate-700 font-bold text-xs bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
          <School className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate max-w-[200px]">{schoolSettings.name}</span>
        </div>

        {/* User avatar indicator */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center overflow-hidden">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              'M.'
            )}
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-slate-700">Sekolah</span>
        </div>
      </div>
    </header>
  );
};
