import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import {
  Student,
  ProgramKeahlian,
  SchoolClass,
  SubjectScore,
  PKLRecord,
  UKKRecord,
  MutationRecord,
  AlumniTracer,
  SchoolSettings,
  AuditLogItem,
} from './types';
import {
  initialStudents,
  initialProgramKeahlian,
  initialClasses,
  initialSubjectScores,
  initialPKL,
  initialUKK,
  initialMutations,
  initialTracer,
  initialSchoolSettings,
  initialAuditLogs,
} from './data/initialData';

import { LoginView } from './components/LoginView';
import { PublicVerificationView } from './components/PublicVerificationView';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { StudentManagement } from './components/StudentManagement';
import { BukuIndukPreviewModal } from './components/BukuIndukPreviewModal';
import { BukuKlapperView } from './components/BukuKlapperView';
import { PusatCetakView } from './components/PusatCetakView';
import { SmartChecklistView } from './components/SmartChecklistView';
import { SchoolSettingsView } from './components/SchoolSettingsView';
import { ProfileView } from './components/ProfileView';
import { OperationsViews } from './components/OperationsViews';
import { ReleaseModal } from './components/ReleaseModal';
import { ProgramKeahlianView } from './components/ProgramKeahlianView';
import { ClassManagementView } from './components/ClassManagementView';

// Dedicated PDF Page modules
import { RegisterNomorUrutView } from './components/RegisterNomorUrutView';
import { BukuPemeriksaanView } from './components/BukuPemeriksaanView';
import { MaintenancePowerToolsView } from './components/MaintenancePowerToolsView';
import { AuditLogView } from './components/AuditLogView';
import { RBACView } from './components/RBACView';
import { FormatBerkasWordView } from './components/FormatBerkasWordView';
import { KelulusanMassalView } from './components/KelulusanMassalView';
import { ManajemenKelulusanView } from './components/ManajemenKelulusanView';
import {
  MutasiPesertaDidikView,
  KenaikanKelasModal,
} from './components/ExtraOperationsViews';
import { OlahNilaiView } from './components/OlahNilaiView';
import { MataPelajaranView } from './components/MataPelajaranView';
import { TujuanPembelajaranView } from './components/TujuanPembelajaranView';
import { ManajemenPKLView } from './components/ManajemenPKLView';
import { ManajemenUKKView } from './components/ManajemenUKKView';
import { ManajemenMutasiView } from './components/ManajemenMutasiView';
import { TracerAlumniView } from './components/TracerAlumniView';
import { ArsipAlumniMutasiView } from './components/ArsipAlumniMutasiView';
import { UploadFotoMassalView } from './components/UploadFotoMassalView';
import { GoogleDriveView } from './components/GoogleDriveView';
import { asset } from './utils/asset';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('siduk_auth') === 'true';
  });
  const [activeRole, setActiveRole] = useState<string>(() => {
    return localStorage.getItem('siduk_role') || 'ADMIN';
  });
  const [activeUser, setActiveUser] = useState<string>(() => {
    return localStorage.getItem('siduk_user') || 'admin';
  });

  // User Profile State (Matching screenshot default)
  const [userProfile, setUserProfile] = useState<{
    fullName: string;
    username: string;
    nip: string;
    jabatan: string;
    avatarUrl?: string;
  }>(() => {
    const saved = localStorage.getItem('siduk_user_profile');
    return saved
      ? JSON.parse(saved)
      : {
          fullName: 'M. EKO HARIS SULISTIAWAN',
          username: 'admin',
          nip: '-',
          jabatan: 'Kepala Tata Usaha',
          avatarUrl: '',
        };
  });

  // Presentation Mode State (Full screen dashboard presentation)
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  // Navigation State
  const [currentMenu, setCurrentMenu] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isPublicVerification, setIsPublicVerification] = useState<boolean>(false);

  // Core Data States (with LocalStorage)
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('siduk_school_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialSchoolSettings,
          ...parsed,
          logoUrl: parsed.logoUrl || asset('/assets/logo-smkn-dander.png'),
        };
      } catch {
        return initialSchoolSettings;
      }
    }
    return initialSchoolSettings;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('siduk_students');
    if (saved) {
      try {
        const parsed: Student[] = JSON.parse(saved);
        // Pastikan setiap siswa punya ID unik; data tersimpan tidak boleh dibuang
        if (Array.isArray(parsed) && parsed.length > 0) {
          const seen = new Set<string>();
          return parsed.map((s, idx) => {
            if (!s.id || seen.has(s.id)) {
              const uniqueId = `s-${String(idx + 1).padStart(3, '0')}`;
              seen.add(uniqueId);
              return { ...s, id: uniqueId, registrationNumber: idx + 1 };
            }
            seen.add(s.id);
            return s;
          });
        }
      } catch {
        return initialStudents;
      }
    }
    return initialStudents;
  });

  const [programs, setPrograms] = useState<ProgramKeahlian[]>(() => {
    const saved = localStorage.getItem('siduk_programs');
    return saved ? JSON.parse(saved) : initialProgramKeahlian;
  });
  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('siduk_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });
  const [scores] = useState<SubjectScore[]>(initialSubjectScores);
  const [pklList] = useState<PKLRecord[]>(initialPKL);
  const [ukkList] = useState<UKKRecord[]>(initialUKK);
  const [mutations] = useState<MutationRecord[]>(initialMutations);
  const [tracers] = useState<AlumniTracer[]>(initialTracer);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('siduk_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Modal States
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);
  const [selectedStudentForManagement, setSelectedStudentForManagement] = useState<Student | null>(null);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('siduk_school_settings', JSON.stringify(schoolSettings));
  }, [schoolSettings]);

  useEffect(() => {
    localStorage.setItem('siduk_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('siduk_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('siduk_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('siduk_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Auth Handlers
  const handleLogin = (role: string, user: string) => {
    setIsLoggedIn(true);
    setActiveRole(role);
    setActiveUser(user);
    localStorage.setItem('siduk_auth', 'true');
    localStorage.setItem('siduk_role', role);
    localStorage.setItem('siduk_user', user);

    // Record login in audit log
    addAuditLog('Login ke Sistem', `Autentikasi akun ${user} (${role})`);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsLoggedIn(false);
    localStorage.setItem('siduk_auth', 'false');
    addAuditLog('Logout dari Sistem', `Sesi diakhiri oleh ${activeUser}`);
  };

  // Helper Audit Log
  const addAuditLog = (action: string, target: string) => {
    const newLog: AuditLogItem = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `${activeUser} (${activeRole})`,
      role: activeRole,
      action,
      target,
      ipAddress: '192.168.1.105',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Student CRUD Handlers
  const handleAddStudent = (newStudentData: Omit<Student, 'id'>) => {
    const newId = 's-' + Date.now();
    const newStudent: Student = {
      id: newId,
      ...newStudentData,
    };
    setStudents((prev) => [newStudent, ...prev]);
    addAuditLog('Tambah Peserta Didik Baru', `${newStudent.fullName} (${newStudent.nipd})`);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    addAuditLog('Perbarui Biodata Siswa', `${updatedStudent.fullName} (${updatedStudent.nipd})`);
  };

  const handleDeleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (target) {
      addAuditLog('Hapus Peserta Didik', `${target.fullName} (${target.nipd})`);
    }
  };

  const handleToggleStudentDoc = (
    studentId: string,
    docKey: 'akta' | 'kk' | 'ijazahSmp' | 'pasFoto'
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            documents: {
              ...s.documents,
              [docKey]: !s.documents[docKey],
            },
          };
        }
        return s;
      })
    );
  };

  const handleSaveSettings = (newSettings: SchoolSettings) => {
    setSchoolSettings(newSettings);
    addAuditLog('Perbarui Pengaturan Sekolah', `Identitas instansi ${newSettings.name}`);
  };

  const handleRestoreData = (data: any) => {
    if (data.schoolSettings) setSchoolSettings(data.schoolSettings);
    if (data.students) setStudents(data.students);
    addAuditLog('Pemulihan Cadangan Database', 'Restorasi data lengkap dari berkas JSON');
  };

  // If user is not logged in, show Login Screen (Page 1) or Public Verification View
  if (!isLoggedIn) {
    if (isPublicVerification) {
      return (
        <PublicVerificationView
          schoolSettings={schoolSettings}
          students={students}
          onBackToLogin={() => setIsPublicVerification(false)}
        />
      );
    }
    return (
      <LoginView
        schoolSettings={schoolSettings}
        onLogin={handleLogin}
        onOpenVerification={() => setIsPublicVerification(true)}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* Sidebar Navigation - Hidden in presentation mode */}
      {!isPresentationMode && (
        <Sidebar
          currentMenu={currentMenu}
          onSelectMenu={(menu) => {
            setCurrentMenu(menu);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          schoolSettings={schoolSettings}
          activeRole={activeRole}
          currentUser={userProfile}
          onLogout={handleLogout}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Topbar Header - Hidden in presentation mode */}
        {!isPresentationMode && (
          <Header
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
            students={students}
            onSelectStudent={(student) => {
              setSelectedStudentForManagement(student);
              setCurrentMenu('siswa');
            }}
            schoolSettings={schoolSettings}
            currentUser={userProfile}
            onOpenReleaseModal={() => setIsReleaseModalOpen(true)}
          />
        )}

        {/* Dynamic Body Content */}
        <div className={`flex-1 ${isPresentationMode ? 'p-4 md:p-6 lg:p-8' : 'p-4 md:p-8'}`}>
          {currentMenu === 'dashboard' && (
            <DashboardView
              students={students}
              programs={programs}
              schoolSettings={schoolSettings}
              onNavigate={(menu) => setCurrentMenu(menu)}
              onOpenStudent={(student) => {
                setSelectedStudentForManagement(student);
                setCurrentMenu('siswa');
              }}
              onOpenReleaseModal={() => setIsReleaseModalOpen(true)}
              isPresentationMode={isPresentationMode}
              onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
            />
          )}

          {currentMenu === 'siswa' && (
            <StudentManagement
              students={students}
              programs={programs}
              classes={classes}
              scores={scores}
              schoolSettings={schoolSettings}
              onOpenStudent={(student) => setPreviewStudent(student)}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onBulkImportStudents={(list) => setStudents(list)}
              onNavigateToArsip={() => setCurrentMenu('arsip-alumni')}
              onNavigateToUploadFoto={() => setCurrentMenu('upload-foto-massal')}
              selectedStudentFromApp={selectedStudentForManagement}
            />
          )}

          {currentMenu === 'upload-foto-massal' && (
            <UploadFotoMassalView
              students={students}
              schoolSettings={schoolSettings}
              classes={classes}
              onUpdateStudents={(updated) => setStudents(updated)}
              onNavigate={(menu) => setCurrentMenu(menu)}
              onOpenStudent={(student) => setPreviewStudent(student)}
            />
          )}

          {currentMenu === 'register-induk' && (
            <RegisterNomorUrutView
              students={students}
              schoolSettings={schoolSettings}
              classes={classes}
              programs={programs}
              onOpenStudent={(student) => {
                setSelectedStudentForManagement(student);
                setCurrentMenu('siswa');
              }}
              onNavigate={(menu) => setCurrentMenu(menu)}
            />
          )}

          {currentMenu === 'buku-klapper' && (
            <BukuKlapperView
              students={students}
              schoolSettings={schoolSettings}
              onOpenStudent={(student) => setPreviewStudent(student)}
            />
          )}

          {currentMenu === 'pusat-cetak' && (
            <PusatCetakView
              students={students}
              schoolSettings={schoolSettings}
              classes={classes}
              programs={programs}
              onOpenStudent={(student) => setPreviewStudent(student)}
              onNavigate={(menu) => setCurrentMenu(menu)}
            />
          )}

          {currentMenu === 'buku-pemeriksaan' && (
            <BukuPemeriksaanView schoolSettings={schoolSettings} />
          )}

          {currentMenu === 'smart-checklist' && (
            <SmartChecklistView
              students={students}
              schoolSettings={schoolSettings}
              classes={classes}
              programs={programs}
              onUpdateStudent={handleUpdateStudent}
              onToggleDoc={handleToggleStudentDoc}
              onOpenStudent={(student) => setPreviewStudent(student)}
              onNavigate={(menu) => setCurrentMenu(menu)}
            />
          )}

          {currentMenu === 'kelulusan' && (
            <ManajemenKelulusanView
              students={students}
              schoolSettings={schoolSettings}
              onOpenStudent={(student) => setPreviewStudent(student)}
            />
          )}

          {currentMenu === 'validasi-kelulusan' && (
            <KelulusanMassalView
              students={students}
              classes={classes}
              schoolSettings={schoolSettings}
              onOpenStudent={(student) => setPreviewStudent(student)}
              onNavigate={(menu) => setCurrentMenu(menu)}
              onUpdateStudents={(updated) => setStudents(updated)}
            />
          )}

          {currentMenu === 'kelas' && (
            <ClassManagementView
              students={students}
              programs={programs}
              classes={classes}
              scores={scores}
              schoolSettings={schoolSettings}
              activeRole={activeRole}
              initialSubView="list"
              onOpenStudent={(student) => setPreviewStudent(student)}
              onNavigate={(menu) => setCurrentMenu(menu)}
              onAddStudent={handleAddStudent}
              onUpdateClasses={(updated) => setClasses(updated)}
            />
          )}

          {currentMenu === 'kenaikan-massal' && (
            <ClassManagementView
              students={students}
              programs={programs}
              classes={classes}
              scores={scores}
              schoolSettings={schoolSettings}
              activeRole={activeRole}
              initialSubView="kenaikan"
              onOpenStudent={(student) => setPreviewStudent(student)}
              onNavigate={(menu) => setCurrentMenu(menu)}
              onAddStudent={handleAddStudent}
              onUpdateClasses={(updated) => setClasses(updated)}
            />
          )}

          {currentMenu === 'mutasi' && (
            <ManajemenMutasiView
              students={students}
              schoolSettings={schoolSettings}
              initialMode="manajemen"
              onNavigate={(menu) => setCurrentMenu(menu)}
              onUpdateStudent={handleUpdateStudent}
              onUpdateStudents={(updated) => setStudents(updated)}
            />
          )}

          {currentMenu === 'buku-mutasi' && (
            <ManajemenMutasiView
              students={students}
              schoolSettings={schoolSettings}
              initialMode="buku_mutasi"
              onNavigate={(menu) => setCurrentMenu(menu)}
              onUpdateStudent={handleUpdateStudent}
              onUpdateStudents={(updated) => setStudents(updated)}
            />
          )}

          {currentMenu === 'arsip-alumni' && (
            <ArsipAlumniMutasiView
              students={students}
              schoolSettings={schoolSettings}
              onOpenStudent={(student) => setPreviewStudent(student)}
              onNavigate={(menu) => setCurrentMenu(menu)}
            />
          )}

          {currentMenu === 'nilai' && (
            <OlahNilaiView
              students={students}
              programs={programs}
              classes={classes}
              schoolSettings={schoolSettings}
              onOpenStudent={(student) => setPreviewStudent(student)}
              onOpenKenaikanModal={() => setCurrentMenu('kenaikan-massal')}
            />
          )}

          {currentMenu === 'mapel' && <MataPelajaranView programs={programs} />}

          {currentMenu === 'tp' && <TujuanPembelajaranView />}

          {currentMenu === 'pkl' && (
            <ManajemenPKLView
              students={students}
              classes={classes}
              schoolSettings={schoolSettings}
              onOpenStudent={(student) => setPreviewStudent(student)}
            />
          )}

          {currentMenu === 'ukk' && (
            <ManajemenUKKView
              students={students}
              classes={classes}
              schoolSettings={schoolSettings}
              onOpenStudent={(student) => setPreviewStudent(student)}
            />
          )}

          {currentMenu === 'template-dokumen' && (
            <FormatBerkasWordView
              schoolSettings={schoolSettings}
              students={students}
            />
          )}

          {currentMenu === 'google-drive' && (
            <GoogleDriveView
              students={students}
              schoolSettings={schoolSettings}
              onNavigate={(menu) => setCurrentMenu(menu)}
            />
          )}

          {currentMenu === 'profil' && (
            <ProfileView
              schoolSettings={schoolSettings}
              activeRole={activeRole}
              currentUser={userProfile}
              onUpdateProfile={(updated) => {
                const newProfile = { ...userProfile, ...updated };
                setUserProfile(newProfile);
                localStorage.setItem('siduk_user_profile', JSON.stringify(newProfile));
                addAuditLog('Perbarui Profil Pengguna', `Nama: ${updated.fullName}, Jabatan: ${updated.jabatan}`);
              }}
            />
          )}

          {currentMenu === 'pengaturan' && (
            <SchoolSettingsView
              settings={schoolSettings}
              students={students}
              onSaveSettings={handleSaveSettings}
              onRestoreData={handleRestoreData}
              onNavigate={(menu) => setCurrentMenu(menu)}
            />
          )}

          {currentMenu === 'maintenance' && (
            <MaintenancePowerToolsView
              students={students}
              schoolSettings={schoolSettings}
              onResetData={() => handleRestoreData({})}
              onComplianceRepair={() => addAuditLog('Compliance Repair', 'Validasi dan perbaikan data selesai')}
            />
          )}

          {currentMenu === 'audit-log' && (
            <AuditLogView
              logs={auditLogs}
              onClearLogs={() => setAuditLogs([])}
              onBackToSettings={() => setCurrentMenu('pengaturan')}
            />
          )}

          {(currentMenu === 'rbac' || currentMenu === 'manajemen-pengguna') && (
            <RBACView initialTab={currentMenu === 'manajemen-pengguna' ? 'pengguna' : 'matriks'} />
          )}

          {currentMenu === 'keahlian' && (
            <ProgramKeahlianView
              programs={programs}
              schoolSettings={schoolSettings}
              onUpdatePrograms={(updated) => setPrograms(updated)}
              onAddAuditLog={(action, details) => addAuditLog(action, details)}
            />
          )}

          {currentMenu === 'tracer' && (
            <TracerAlumniView
              students={students}
              schoolSettings={schoolSettings}
              onOpenStudent={(student) => setPreviewStudent(student)}
              onNavigate={(menu) => setCurrentMenu(menu)}
            />
          )}
        </div>
      </main>

      {/* Official A4 Buku Induk Preview & Print Modal */}
      <BukuIndukPreviewModal
        student={previewStudent}
        schoolSettings={schoolSettings}
        onClose={() => setPreviewStudent(null)}
        onUpdateStudent={handleUpdateStudent}
      />

      {/* Release Notes Modal */}
      <ReleaseModal
        isOpen={isReleaseModalOpen}
        onClose={() => setIsReleaseModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <LogOut className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Konfirmasi Keluar Sesi</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Apakah Anda yakin ingin mengakhiri sesi akun <strong>{activeUser}</strong>? Perubahan yang belum disimpan mungkin akan hilang.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ya, Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
