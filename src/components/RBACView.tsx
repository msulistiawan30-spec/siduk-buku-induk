import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  UserPlus,
  Save,
  Check,
  X,
  RotateCcw,
  Edit2,
  Trash2,
  Plus,
  KeyRound,
  CheckSquare,
  AlertCircle,
  Clock,
  Search,
  Lock,
  ArrowLeft,
  ChevronRight,
  Info,
  Sliders,
  Sparkles,
} from 'lucide-react';

export interface RoleDef {
  key: string;
  name: string;
  slug: string;
  badge: string;
  badgeType: 'SISTEM' | 'KUSTOM';
  isSystem: boolean;
  isFullAccess?: boolean;
  description: string;
}

export interface PermissionDef {
  id: string;
  module: string;
  action: string;
  code: string;
  name: string;
  description: string;
}

export interface ModuleCategoryDef {
  moduleKey: string;
  groupTitle: string;
  badge: string;
  permissions: PermissionDef[];
}

export interface UserAccount {
  id: number;
  name: string;
  nip: string;
  jabatan: string;
  username: string;
  roleKey: string;
  status: 'Aktif' | 'Nonaktif';
}

const DEFAULT_ROLES: RoleDef[] = [
  {
    key: 'admin',
    name: 'ADMINISTRATOR SISTEM',
    slug: 'admin',
    badge: 'ADMIN',
    badgeType: 'SISTEM',
    isSystem: true,
    isFullAccess: true,
    description: 'Akses penuh tanpa batas ke seluruh modul, konfigurasi sistem, dan manajemen hak akses.',
  },
  {
    key: 'operator',
    name: 'OPERATOR SEKOLAH / TU',
    slug: 'operator',
    badge: 'OPERATOR',
    badgeType: 'SISTEM',
    isSystem: true,
    description: 'Mengelola operasional siswa, cetak buku induk, mutasi, dan kelulusan.',
  },
  {
    key: 'wali_kelas',
    name: 'GURU KELAS / WALI KELAS',
    slug: 'wali_kelas',
    badge: 'WALI_KELAS',
    badgeType: 'SISTEM',
    isSystem: true,
    description: 'Mengelola data kelas, pengisian nilai rapor semester, dan mutasi kelas bimbingan.',
  },
  {
    key: 'guru',
    name: 'GURU MATA PELAJARAN',
    slug: 'guru',
    badge: 'GURU',
    badgeType: 'SISTEM',
    isSystem: true,
    description: 'Menginput dan memverifikasi nilai capaian pembelajaran mata pelajaran yang diampu.',
  },
  {
    key: 'kepala_sekolah',
    name: 'KEPALA SEKOLAH / MADRASAH',
    slug: 'kepala_sekolah',
    badge: 'KEPALA_SEKOLAH',
    badgeType: 'SISTEM',
    isSystem: true,
    description: 'Meninjau rekapitulasi buku induk, validasi kelulusan, dan tanda tangan digital dokumen resmi.',
  },
  {
    key: 'guru_kejuruan',
    name: 'GURU PEMBIMBING PKL / UKK',
    slug: 'guru_kejuruan',
    badge: 'GURU_KEJURUAN',
    badgeType: 'SISTEM',
    isSystem: true,
    description: 'Mengelola penilaian Praktik Kerja Lapangan (PKL) dan Uji Kompetensi Keahlian (UKK).',
  },
  {
    key: 'siswa',
    name: 'PESERTA DIDIK / ALUMNI',
    slug: 'siswa',
    badge: 'SISWA',
    badgeType: 'SISTEM',
    isSystem: true,
    description: 'Melihat lembar biodata pribadi, transkrip nilai kelulusan, dan riwayat mutasi.',
  },
];

const DEFAULT_CATEGORIES: ModuleCategoryDef[] = [
  {
    moduleKey: 'jurusan',
    groupTitle: 'PROGRAM KEAHLIAN / PEMINATAN (SMA/SMK/MA)',
    badge: '2 HAK AKSES',
    permissions: [
      {
        id: 'jurusan.view',
        module: 'jurusan',
        action: 'view',
        code: 'jurusan.view',
        name: 'Lihat Program Keahlian / Peminatan',
        description: 'Melihat konsentrasi keahlian / peminatan',
      },
      {
        id: 'jurusan.manage',
        module: 'jurusan',
        action: 'manage',
        code: 'jurusan.manage',
        name: 'Kelola Program Keahlian / Peminatan',
        description: 'Menambah, mengubah, dan menghapus konsentrasi keahlian',
      },
    ],
  },
  {
    moduleKey: 'kelas',
    groupTitle: 'ROMBONGAN BELAJAR (KELAS)',
    badge: '4 HAK AKSES',
    permissions: [
      {
        id: 'kelas.view',
        module: 'kelas',
        action: 'view',
        code: 'kelas.view',
        name: 'Lihat Data Kelas',
        description: 'Melihat daftar rombongan belajar dan anggota kelas',
      },
      {
        id: 'kelas.create',
        module: 'kelas',
        action: 'create',
        code: 'kelas.create',
        name: 'Tambah Kelas',
        description: 'Membuat rombongan belajar baru',
      },
      {
        id: 'kelas.edit',
        module: 'kelas',
        action: 'edit',
        code: 'kelas.edit',
        name: 'Ubah Data Kelas',
        description: 'Memperbarui informasi rombongan belajar dan wali kelas',
      },
      {
        id: 'kelas.delete',
        module: 'kelas',
        action: 'delete',
        code: 'kelas.delete',
        name: 'Hapus Kelas',
        description: 'Menghapus rombongan belajar',
      },
    ],
  },
  {
    moduleKey: 'kelulusan',
    groupTitle: 'KELULUSAN, SKL, & TRANSKRIP NILAI',
    badge: '3 HAK AKSES',
    permissions: [
      {
        id: 'kelulusan.view',
        module: 'kelulusan',
        action: 'view',
        code: 'kelulusan.view',
        name: 'Lihat Manajemen Kelulusan',
        description: 'Melihat status kelulusan dan penelusuran alumni',
      },
      {
        id: 'kelulusan.manage',
        module: 'kelulusan',
        action: 'manage',
        code: 'kelulusan.manage',
        name: 'Proses Kelulusan & SKL',
        description: 'Menetapkan kelulusan, nomor ijazah, dan tracer alumni',
      },
      {
        id: 'kelulusan.cetak',
        module: 'kelulusan',
        action: 'cetak',
        code: 'kelulusan.cetak',
        name: 'Cetak SKL & Transkrip Nilai',
        description: 'Mencetak Surat Keterangan Lulus dan Transkrip Nilai',
      },
    ],
  },
  {
    moduleKey: 'laporan',
    groupTitle: 'BUKU INDUK RESMI & CETAK LEMBAR',
    badge: '3 HAK AKSES',
    permissions: [
      {
        id: 'laporan.view',
        module: 'laporan',
        action: 'view',
        code: 'laporan.view',
        name: 'Lihat Laporan Buku Induk',
        description: 'Mengakses menu laporan dan rekapitulasi data buku induk',
      },
      {
        id: 'laporan.cetak',
        module: 'laporan',
        action: 'cetak',
        code: 'laporan.cetak',
        name: 'Cetak Lembar Buku Induk Resmi',
        description: 'Mencetak Lembar Induk A4 (Biodata, Rapor, dan Jilid)',
      },
      {
        id: 'laporan.export',
        module: 'laporan',
        action: 'export',
        code: 'laporan.export',
        name: 'Ekspor Buku Induk (PDF/Word)',
        description: 'Mengunduh PDF dan dokumen resmi per siswa / massal',
      },
    ],
  },
  {
    moduleKey: 'mapel',
    groupTitle: 'MATA PELAJARAN & KURIKULUM',
    badge: '4 HAK AKSES',
    permissions: [
      {
        id: 'mapel.view',
        module: 'mapel',
        action: 'view',
        code: 'mapel.view',
        name: 'Lihat Mata Pelajaran',
        description: 'Melihat daftar mata pelajaran kurikulum',
      },
      {
        id: 'mapel.create',
        module: 'mapel',
        action: 'create',
        code: 'mapel.create',
        name: 'Tambah Mata Pelajaran',
        description: 'Menambahkan mata pelajaran baru',
      },
      {
        id: 'mapel.edit',
        module: 'mapel',
        action: 'edit',
        code: 'mapel.edit',
        name: 'Ubah Mata Pelajaran',
        description: 'Memperbarui data mata pelajaran dan kelompok mapel',
      },
      {
        id: 'mapel.delete',
        module: 'mapel',
        action: 'delete',
        code: 'mapel.delete',
        name: 'Hapus Mata Pelajaran',
        description: 'Menghapus mata pelajaran',
      },
    ],
  },
  {
    moduleKey: 'mutasi',
    groupTitle: 'BUKU MUTASI SISWA KELUAR / MASUK',
    badge: '2 HAK AKSES',
    permissions: [
      {
        id: 'mutasi.view',
        module: 'mutasi',
        action: 'view',
        code: 'mutasi.view',
        name: 'Lihat Buku Mutasi',
        description: 'Melihat riwayat mutasi masuk dan keluar siswa',
      },
      {
        id: 'mutasi.manage',
        module: 'mutasi',
        action: 'manage',
        code: 'mutasi.manage',
        name: 'Proses Mutasi Siswa',
        description: 'Memproses mutasi keluar/masuk dan cetak surat pindah',
      },
    ],
  },
  {
    moduleKey: 'nilai',
    groupTitle: 'PENILAIAN & KENAIKAN KELAS',
    badge: '4 HAK AKSES',
    permissions: [
      {
        id: 'nilai.view',
        module: 'nilai',
        action: 'view',
        code: 'nilai.view',
        name: 'Lihat Rekap Nilai',
        description: 'Melihat rekapitulasi nilai rapor peserta didik',
      },
      {
        id: 'nilai.input',
        module: 'nilai',
        action: 'input',
        code: 'nilai.input',
        name: 'Input & Edit Nilai Rapor',
        description: 'Mengisi nilai rapor semester per kelas / per mapel',
      },
      {
        id: 'nilai.delete',
        module: 'nilai',
        action: 'delete',
        code: 'nilai.delete',
        name: 'Hapus Nilai Rapor',
        description: 'Menghapus entri nilai rapor yang salah',
      },
      {
        id: 'nilai.promote',
        module: 'nilai',
        action: 'promote',
        code: 'nilai.promote',
        name: 'Kenaikan Kelas Massal',
        description: 'Memproses kenaikan tingkat / fase peserta didik',
      },
    ],
  },
  {
    moduleKey: 'p5',
    groupTitle: 'PROJEK PENGUATAN PROFIL PELAJAR (P5/P2RA)',
    badge: '2 HAK AKSES',
    permissions: [
      {
        id: 'p5.view',
        module: 'p5',
        action: 'view',
        code: 'p5.view',
        name: 'Lihat Projek P5',
        description: 'Melihat tema, dimensi, dan rekapan projek P5',
      },
      {
        id: 'p5.manage',
        module: 'p5',
        action: 'manage',
        code: 'p5.manage',
        name: 'Kelola Projek & Nilai P5',
        description: 'Input tema projek dan penilaian capaian P5 siswa',
      },
    ],
  },
  {
    moduleKey: 'pemeriksaan',
    groupTitle: 'BUKU PEMERIKSAAN & BUKU KLAPPER',
    badge: '2 HAK AKSES',
    permissions: [
      {
        id: 'pemeriksaan.view',
        module: 'pemeriksaan',
        action: 'view',
        code: 'pemeriksaan.view',
        name: 'Lihat Buku Pemeriksaan & Klapper',
        description: 'Melihat Buku Klapper alfabetis dan checklist kelengkapan',
      },
      {
        id: 'pemeriksaan.manage',
        module: 'pemeriksaan',
        action: 'manage',
        code: 'pemeriksaan.manage',
        name: 'Kelola Catatan Pemeriksaan',
        description: 'Menyimpan catatan pemeriksaan dan register nomor induk',
      },
    ],
  },
  {
    moduleKey: 'pengguna',
    groupTitle: 'MANAJEMEN PENGGUNA & RBAC',
    badge: '3 HAK AKSES',
    permissions: [
      {
        id: 'pengguna.view',
        module: 'pengguna',
        action: 'view',
        code: 'pengguna.view',
        name: 'Lihat Daftar Pengguna',
        description: 'Melihat akun pengguna sistem buku induk',
      },
      {
        id: 'pengguna.manage',
        module: 'pengguna',
        action: 'manage',
        code: 'pengguna.manage',
        name: 'Kelola Pengguna',
        description: 'Menambah, mengubah, dan menghapus akun pengguna',
      },
      {
        id: 'pengguna.roles',
        module: 'pengguna',
        action: 'roles',
        code: 'pengguna.roles',
        name: 'Kelola Matriks Hak Akses (RBAC)',
        description: 'Mengatur izin dan hak akses permission untuk masing-masing role',
      },
    ],
  },
  {
    moduleKey: 'pkl',
    groupTitle: 'PRAKTIK KERJA LAPANGAN (KHUSUS SMK/MAK)',
    badge: '2 HAK AKSES',
    permissions: [
      {
        id: 'pkl.view',
        module: 'pkl',
        action: 'view',
        code: 'pkl.view',
        name: 'Lihat Data PKL',
        description: 'Melihat daftar penempatan industri dan nilai PKL',
      },
      {
        id: 'pkl.manage',
        module: 'pkl',
        action: 'manage',
        code: 'pkl.manage',
        name: 'Kelola Data PKL',
        description: 'Input data DUDI, jurnal, pembimbing, dan nilai PKL',
      },
    ],
  },
  {
    moduleKey: 'settings',
    groupTitle: 'KONFIGURASI SEKOLAH & IDENTITAS',
    badge: '2 HAK AKSES',
    permissions: [
      {
        id: 'settings.view',
        module: 'settings',
        action: 'view',
        code: 'settings.view',
        name: 'Lihat Konfigurasi Sekolah',
        description: 'Melihat data profil sekolah, logo, dan kop surat',
      },
      {
        id: 'settings.manage',
        module: 'settings',
        action: 'manage',
        code: 'settings.manage',
        name: 'Ubah Konfigurasi Sekolah',
        description: 'Memperbarui profil sekolah, jenjang, kurikulum, dan mode foto cetak',
      },
    ],
  },
  {
    moduleKey: 'siswa',
    groupTitle: 'KESISWAAN & BIODATA SISWA',
    badge: '7 HAK AKSES',
    permissions: [
      {
        id: 'siswa.view',
        module: 'siswa',
        action: 'view',
        code: 'siswa.view',
        name: 'Lihat Data Siswa',
        description: 'Melihat daftar dan biodata lengkap peserta didik',
      },
      {
        id: 'siswa.create',
        module: 'siswa',
        action: 'create',
        code: 'siswa.create',
        name: 'Tambah Siswa',
        description: 'Menambahkan peserta didik baru ke buku induk',
      },
      {
        id: 'siswa.edit',
        module: 'siswa',
        action: 'edit',
        code: 'siswa.edit',
        name: 'Ubah Data Siswa',
        description: 'Memperbarui biodata peserta didik dan riwayatnya',
      },
      {
        id: 'siswa.delete',
        module: 'siswa',
        action: 'delete',
        code: 'siswa.delete',
        name: 'Hapus Siswa',
        description: 'Menghapus data peserta didik dari buku induk',
      },
      {
        id: 'siswa.import',
        module: 'siswa',
        action: 'import',
        code: 'siswa.import',
        name: 'Impor Data Siswa',
        description: 'Mengimpor data siswa via Excel / Dapodik / EMIS / ZIP foto',
      },
      {
        id: 'siswa.export',
        module: 'siswa',
        action: 'export',
        code: 'siswa.export',
        name: 'Ekspor Data Siswa',
        description: 'Mengekspor data siswa ke format Excel / CSV',
      },
      {
        id: 'siswa.upload_foto',
        module: 'siswa',
        action: 'upload_foto',
        code: 'siswa.upload_foto',
        name: 'Upload Pas Foto Siswa',
        description: 'Mengunggah pas foto awal masuk dan pas foto tamat',
      },
    ],
  },
  {
    moduleKey: 'template',
    groupTitle: 'MANAJEMEN TEMPLATE WORD EKSPOR',
    badge: '2 HAK AKSES',
    permissions: [
      {
        id: 'template.view',
        module: 'template',
        action: 'view',
        code: 'template.view',
        name: 'Lihat Template Dokumen',
        description: 'Melihat format acuan dokumen master Word per jenjang',
      },
      {
        id: 'template.manage',
        module: 'template',
        action: 'manage',
        code: 'template.manage',
        name: 'Kelola Template Word',
        description: 'Mengunggah template kustom sekolah dan unduh master',
      },
    ],
  },
  {
    moduleKey: 'tp',
    groupTitle: 'TUJUAN PEMBELAJARAN (TP E-RAPOR KURIKULUM MERDEKA)',
    badge: '2 HAK AKSES',
    permissions: [
      {
        id: 'tp.view',
        module: 'tp',
        action: 'view',
        code: 'tp.view',
        name: 'Lihat Tujuan Pembelajaran (TP)',
        description: 'Melihat tujuan pembelajaran Kurikulum Merdeka & e-Rapor',
      },
      {
        id: 'tp.manage',
        module: 'tp',
        action: 'manage',
        code: 'tp.manage',
        name: 'Kelola Tujuan Pembelajaran (TP)',
        description: 'Menambah, mengedit, menghapus, import dan download format TP',
      },
    ],
  },
  {
    moduleKey: 'ukk',
    groupTitle: 'UJI KOMPETENSI KEAHLIAN (KHUSUS SMK/MAK)',
    badge: '2 HAK AKSES',
    permissions: [
      {
        id: 'ukk.view',
        module: 'ukk',
        action: 'view',
        code: 'ukk.view',
        name: 'Lihat Sertifikasi UKK',
        description: 'Melihat rekapan skor Uji Kompetensi Keahlian',
      },
      {
        id: 'ukk.manage',
        module: 'ukk',
        action: 'manage',
        code: 'ukk.manage',
        name: 'Kelola Sertifikasi UKK',
        description: 'Input penguji, skema sertifikasi, dan skor UKK siswa',
      },
    ],
  },
];

// Initial active matrix map: key = `${roleKey}:${permissionId}`
const INITIAL_ACTIVE_PERMISSIONS = new Set<string>([
  // OPERATOR has almost all general view & manage permissions
  'operator:jurusan.view',
  'operator:jurusan.manage',
  'operator:kelas.view',
  'operator:kelas.create',
  'operator:kelas.edit',
  'operator:kelas.delete',
  'operator:kelulusan.view',
  'operator:kelulusan.manage',
  'operator:kelulusan.cetak',
  'operator:laporan.view',
  'operator:laporan.cetak',
  'operator:laporan.export',
  'operator:mapel.view',
  'operator:mapel.create',
  'operator:mapel.edit',
  'operator:mapel.delete',
  'operator:mutasi.view',
  'operator:mutasi.manage',
  'operator:nilai.view',
  'operator:nilai.input',
  'operator:nilai.delete',
  'operator:nilai.promote',
  'operator:p5.view',
  'operator:p5.manage',
  'operator:pemeriksaan.view',
  'operator:pemeriksaan.manage',
  'operator:pengguna.view',
  'operator:pkl.view',
  'operator:pkl.manage',
  'operator:settings.view',
  'operator:settings.manage',
  'operator:siswa.view',
  'operator:siswa.create',
  'operator:siswa.edit',
  'operator:siswa.delete',
  'operator:siswa.import',
  'operator:siswa.export',
  'operator:siswa.upload_foto',
  'operator:template.view',
  'operator:template.manage',
  'operator:ukk.view',
  'operator:ukk.manage',

  // WALI KELAS
  'wali_kelas:jurusan.manage',
  'wali_kelas:kelas.create',
  'wali_kelas:kelas.edit',
  'wali_kelas:mapel.create',
  'wali_kelas:mapel.edit',
  'wali_kelas:siswa.view',
  'wali_kelas:siswa.create',
  'wali_kelas:siswa.import',
  'wali_kelas:siswa.export',
]);

interface RBACViewProps {
  initialTab?: 'pengguna' | 'matriks';
}

export const RBACView: React.FC<RBACViewProps> = ({ initialTab = 'matriks' }) => {
  const [activeTab, setActiveTab] = useState<'pengguna' | 'matriks'>(initialTab);
  const [roles, setRoles] = useState<RoleDef[]>(DEFAULT_ROLES);
  const [categories, setCategories] = useState<ModuleCategoryDef[]>(DEFAULT_CATEGORIES);
  const [matrixMap, setMatrixMap] = useState<Set<string>>(INITIAL_ACTIVE_PERMISSIONS);
  const [saveToast, setSaveToast] = useState('');

  // Modals state
  const [roleModalMode, setRoleModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleDef | null>(null);
  const [roleFormSlug, setRoleFormSlug] = useState('');
  const [roleFormName, setRoleFormName] = useState('');
  const [roleFormDesc, setRoleFormDesc] = useState('');

  const [permModalMode, setPermModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedPerm, setSelectedPerm] = useState<PermissionDef | null>(null);
  const [permFormModule, setPermFormModule] = useState('');
  const [permFormAction, setPermFormAction] = useState('');
  const [permFormName, setPermFormName] = useState('');
  const [permFormCode, setPermFormCode] = useState('');
  const [permFormDesc, setPermFormDesc] = useState('');

  // User Accounts
  const [userList, setUserList] = useState<UserAccount[]>([
    {
      id: 1,
      name: 'Administrator Sistem',
      nip: '-',
      jabatan: 'Kepala Tata Usaha',
      username: 'admin',
      roleKey: 'admin',
      status: 'Aktif',
    },
    {
      id: 2,
      name: 'M. Eko Haris Sulistiawan,.S.Sos',
      nip: '19790514 200801 1 012',
      jabatan: 'Kepala Urusan Tata Usaha',
      username: 'haris.tu',
      roleKey: 'operator',
      status: 'Aktif',
    },
    {
      id: 3,
      name: 'Dr. Molyono,.M.Pd',
      nip: '19680312 199412 1 002',
      jabatan: 'Kepala Sekolah',
      username: 'molyono.ks',
      roleKey: 'kepala_sekolah',
      status: 'Aktif',
    },
    {
      id: 4,
      name: 'Siti Rohmah, S.Pd',
      nip: '19840215 201001 2 021',
      jabatan: 'Wali Kelas X TKJ 1',
      username: 'siti.walikelas',
      roleKey: 'wali_kelas',
      status: 'Aktif',
    },
    {
      id: 5,
      name: 'Budi Santoso, S.Kom',
      nip: '19900418 201502 1 005',
      jabatan: 'Guru Pemrograman Kejuruan & Pembimbing PKL',
      username: 'budi.kejuruan',
      roleKey: 'guru_kejuruan',
      status: 'Aktif',
    },
  ]);

  // Form for New User
  const [newUserName, setNewUserName] = useState('');
  const [newUserNip, setNewUserNip] = useState('');
  const [newUserJabatan, setNewUserJabatan] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('operator');
  const [searchUser, setSearchUser] = useState('');

  // Switch tab on prop change
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Total permissions count
  const totalPermCount = categories.reduce((acc, cat) => acc + cat.permissions.length, 0);

  // Checkbox toggle
  const togglePermission = (roleKey: string, permId: string) => {
    if (roleKey === 'admin') return; // Admin always full access
    const key = `${roleKey}:${permId}`;
    setMatrixMap((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Toggle all for a specific role
  const handleToggleAllForRole = (roleKey: string) => {
    if (roleKey === 'admin') return;
    const allPermIds: string[] = [];
    categories.forEach((cat) => {
      cat.permissions.forEach((p) => allPermIds.push(p.id));
    });

    const currentRoleActiveCount = allPermIds.filter((pId) => matrixMap.has(`${roleKey}:${pId}`)).length;
    const next = new Set(matrixMap);

    if (currentRoleActiveCount === allPermIds.length) {
      // Uncheck all
      allPermIds.forEach((pId) => next.delete(`${roleKey}:${pId}`));
    } else {
      // Check all
      allPermIds.forEach((pId) => next.add(`${roleKey}:${pId}`));
    }
    setMatrixMap(next);
  };

  // Restore Default 46 Permissions
  const handleRestoreDefaults = () => {
    if (confirm('Pulihkan 46 Hak Akses Standar Bawaan ke konfigurasi awal?')) {
      setCategories(DEFAULT_CATEGORIES);
      setRoles(DEFAULT_ROLES);
      setMatrixMap(new Set(INITIAL_ACTIVE_PERMISSIONS));
      setSaveToast('46 Hak Akses Standar Bawaan berhasil dipulihkan!');
      setTimeout(() => setSaveToast(''), 3500);
    }
  };

  // Save Matrix
  const handleSaveMatrix = () => {
    setSaveToast('Matriks Hak Akses & Izin Role berhasil disimpan ke sistem!');
    setTimeout(() => setSaveToast(''), 3500);
  };

  // Open Edit Role modal
  const handleOpenEditRole = (role: RoleDef) => {
    setSelectedRole(role);
    setRoleFormSlug(role.slug);
    setRoleFormName(role.name);
    setRoleFormDesc(role.description);
    setRoleModalMode('edit');
  };

  // Open Create Role modal
  const handleOpenCreateRole = () => {
    setSelectedRole(null);
    setRoleFormSlug('');
    setRoleFormName('');
    setRoleFormDesc('');
    setRoleModalMode('create');
  };

  // Save Role modal
  const handleSaveRoleModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleFormName.trim()) return;

    if (roleModalMode === 'edit' && selectedRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.key === selectedRole.key
            ? { ...r, name: roleFormName.trim(), description: roleFormDesc.trim() }
            : r
        )
      );
      setSaveToast(`Peran "${roleFormName}" berhasil diperbarui!`);
    } else if (roleModalMode === 'create') {
      const cleanSlug = (roleFormSlug.trim() || roleFormName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_'))
        .toLowerCase();
      const newRole: RoleDef = {
        key: cleanSlug,
        name: roleFormName.trim().toUpperCase(),
        slug: cleanSlug,
        badge: cleanSlug.toUpperCase(),
        badgeType: 'KUSTOM',
        isSystem: false,
        description: roleFormDesc.trim() || 'Peran khusus institusi pendidikan.',
      };
      setRoles((prev) => [...prev, newRole]);
      setSaveToast(`Peran baru "${roleFormName}" berhasil ditambahkan!`);
    }

    setRoleModalMode(null);
    setTimeout(() => setSaveToast(''), 3500);
  };

  // Open Edit Permission modal
  const handleOpenEditPerm = (perm: PermissionDef) => {
    setSelectedPerm(perm);
    setPermFormModule(perm.module);
    setPermFormAction(perm.action);
    setPermFormName(perm.name);
    setPermFormCode(perm.code);
    setPermFormDesc(perm.description);
    setPermModalMode('edit');
  };

  // Open Create Permission modal
  const handleOpenCreatePerm = () => {
    setSelectedPerm(null);
    setPermFormModule('');
    setPermFormAction('');
    setPermFormName('');
    setPermFormCode('');
    setPermFormDesc('');
    setPermModalMode('create');
  };

  // Save Permission modal
  const handleSavePermModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permFormName.trim() || !permFormModule.trim()) return;

    const mod = permFormModule.trim().toLowerCase();
    const act = permFormAction.trim().toLowerCase() || 'view';
    const code = permFormCode.trim() || `${mod}.${act}`;

    if (permModalMode === 'edit' && selectedPerm) {
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          permissions: cat.permissions.map((p) =>
            p.id === selectedPerm.id
              ? {
                  ...p,
                  module: mod,
                  action: act,
                  name: permFormName.trim(),
                  description: permFormDesc.trim(),
                }
              : p
          ),
        }))
      );
      setSaveToast(`Hak akses "${permFormName}" berhasil diperbarui!`);
    } else if (permModalMode === 'create') {
      const newPerm: PermissionDef = {
        id: code,
        module: mod,
        action: act,
        code: code,
        name: permFormName.trim(),
        description: permFormDesc.trim() || 'Deskripsi hak akses kustom.',
      };

      // Check if module category exists, otherwise create new
      setCategories((prev) => {
        const existingCatIdx = prev.findIndex((c) => c.moduleKey === mod);
        if (existingCatIdx >= 0) {
          const updated = [...prev];
          updated[existingCatIdx] = {
            ...updated[existingCatIdx],
            permissions: [...updated[existingCatIdx].permissions, newPerm],
            badge: `${updated[existingCatIdx].permissions.length + 1} HAK AKSES`,
          };
          return updated;
        } else {
          const newCat: ModuleCategoryDef = {
            moduleKey: mod,
            groupTitle: mod.toUpperCase(),
            badge: '1 HAK AKSES',
            permissions: [newPerm],
          };
          return [...prev, newCat];
        }
      });
      setSaveToast(`Hak akses "${permFormName}" berhasil ditambahkan!`);
    }

    setPermModalMode(null);
    setTimeout(() => setSaveToast(''), 3500);
  };

  // Delete Permission
  const handleDeletePerm = (perm: PermissionDef) => {
    if (confirm(`Hapus hak akses "${perm.name}" (${perm.code})?`)) {
      setCategories((prev) =>
        prev
          .map((cat) => {
            const filtered = cat.permissions.filter((p) => p.id !== perm.id);
            return {
              ...cat,
              permissions: filtered,
              badge: `${filtered.length} HAK AKSES`,
            };
          })
          .filter((cat) => cat.permissions.length > 0)
      );
      setSaveToast(`Hak akses "${perm.name}" dihapus!`);
      setTimeout(() => setSaveToast(''), 3500);
    }
  };

  // Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserUsername.trim()) return;

    const matchedRole = roles.find((r) => r.key === newUserRole);
    const newUser: UserAccount = {
      id: userList.length + 1,
      name: newUserName.trim(),
      nip: newUserNip.trim() || '-',
      jabatan: newUserJabatan.trim() || matchedRole?.name || 'Staf Tata Usaha',
      username: newUserUsername.trim(),
      roleKey: newUserRole,
      status: 'Aktif',
    };

    setUserList([...userList, newUser]);
    setNewUserName('');
    setNewUserNip('');
    setNewUserJabatan('');
    setNewUserUsername('');
    setNewUserPassword('');
    setSaveToast(`Pengguna "${newUser.name}" berhasil didaftarkan!`);
    setTimeout(() => setSaveToast(''), 3500);
  };

  const filteredUsers = userList.filter((u) => {
    const q = searchUser.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.nip.toLowerCase().includes(q) ||
      u.jabatan.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Page Title & Tab Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            {activeTab === 'pengguna' ? 'Manajemen Pengguna' : 'Matriks Hak Akses & Peran'}
          </h1>
          <p className="text-xs text-slate-500">
            {activeTab === 'pengguna'
              ? 'Kelola akun staf, administrator, wali kelas, guru mapel, dan hak masuk sistem buku induk.'
              : 'Kelola hak akses, kontrol visibilitas menu, dan aksi CRUD untuk seluruh peran institusi pendidikan.'}
          </p>
        </div>

        {/* Top Tabs */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
          <button
            onClick={() => setActiveTab('pengguna')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pengguna'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Daftar Pengguna</span>
          </button>
          <button
            onClick={() => setActiveTab('matriks')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'matriks'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Matriks Hak Akses & Peran (RBAC)</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: DAFTAR PENGGUNA */}
      {/* ========================================================================= */}
      {activeTab === 'pengguna' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Form Tambah Pengguna */}
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-sm">
                <UserPlus className="w-4 h-4 text-sky-600" />
                <span>Tambah Pengguna Baru</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">Formulir Akun</span>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dr. Molyono,.M.Pd"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  NIP (Nomor Induk Pegawai)
                </label>
                <input
                  type="text"
                  placeholder="Opsional (untuk Tanda Tangan Cetak)"
                  value={newUserNip}
                  onChange={(e) => setNewUserNip(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Jabatan Kedinasan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Staf Tata Usaha / Wali Kelas"
                  value={newUserJabatan}
                  onChange={(e) => setNewUserJabatan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Username login..."
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Peran & Hak Akses (Role) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
                >
                  {roles.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Izin fitur dan modul peran ini dikonfigurasi pada menu Matriks Hak Akses & Peran (RBAC).
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setNewUserName('');
                    setNewUserUsername('');
                    setNewUserPassword('');
                  }}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Simpan Pengguna</span>
                </button>
              </div>
            </form>
          </div>

          {/* Table Daftar Akun Pengguna */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="font-extrabold text-slate-800 text-sm">
                  Daftar Akun Pengguna ({userList.length})
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold text-[10px]">
                  Terverifikasi
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari akun / NIP..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <button
                  onClick={() => setActiveTab('matriks')}
                  className="text-sky-600 hover:text-sky-800 font-bold whitespace-nowrap cursor-pointer flex items-center gap-1"
                >
                  <span>Atur Matriks Izin</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 uppercase font-black text-slate-600 text-[10px] border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="p-3 w-10 text-center">NO</th>
                    <th className="p-3">IDENTITAS & JABATAN</th>
                    <th className="p-3">USERNAME</th>
                    <th className="p-3 text-center">PERAN SISTEM</th>
                    <th className="p-3 text-center">STATUS</th>
                    <th className="p-3 text-center w-20">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u, idx) => {
                    const roleObj = roles.find((r) => r.key === u.roleKey);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-3">
                          <strong className="text-slate-900 block text-xs">{u.name}</strong>
                          <span className="text-[11px] text-slate-500 font-medium">
                            NIP. {u.nip} • {u.jabatan}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-sky-700">{u.username}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.roleKey === 'admin'
                                ? 'bg-slate-800 text-white'
                                : u.roleKey === 'operator'
                                ? 'bg-sky-100 text-sky-800'
                                : u.roleKey === 'wali_kelas'
                                ? 'bg-indigo-100 text-indigo-800'
                                : u.roleKey === 'kepala_sekolah'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {roleObj?.name || u.roleKey}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              title="Reset Password"
                              onClick={() => alert(`Password akun ${u.username} di-reset ke default.`)}
                              className="p-1 text-slate-500 hover:text-sky-600 rounded hover:bg-slate-100 cursor-pointer"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="Hapus Akun"
                              disabled={u.roleKey === 'admin'}
                              onClick={() => {
                                if (confirm(`Hapus akun ${u.name}?`)) {
                                  setUserList(userList.filter((item) => item.id !== u.id));
                                }
                              }}
                              className={`p-1 rounded cursor-pointer ${
                                u.roleKey === 'admin'
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MATRIKS HAK AKSES & PERAN (RBAC) */}
      {/* ========================================================================= */}
      {activeTab === 'matriks' && (
        <div className="space-y-4">
          {/* Banner Bar matching screenshots */}
          <div className="bg-white rounded-xl border border-sky-200/80 shadow-xs p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 tracking-tight">
                    Matriks Hak Akses & Kontrol Menu (RBAC Multi-Jenjang)
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Kelola hak akses, kontrol visibilitas menu, dan aksi CRUD untuk seluruh peran institusi pendidikan (SD, MI, SMP, MTs, SMA, MA, SMK).
                  </p>
                </div>
              </div>

              {/* Action Buttons in Banner */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleOpenCreateRole}
                  className="px-3 py-1.5 rounded-lg border border-sky-300 bg-white hover:bg-sky-50 text-sky-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <span>+ Tambah Peran</span>
                </button>
                <button
                  onClick={handleOpenCreatePerm}
                  className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+ Tambah Hak Akses</span>
                </button>
                <button
                  title="Pulihkan 46 Hak Akses Standar Bawaan"
                  onClick={handleRestoreDefaults}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs group relative"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                  <span>Pulihkan Standar</span>
                </button>
              </div>
            </div>

            {/* Sub banner with Save button & notice */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Info className="w-4 h-4 text-sky-500 shrink-0" />
                <span>
                  Peran <strong>Administrator</strong> memiliki bypass otomatis dan selalu memiliki seluruh hak akses sistem.
                </span>
              </div>
              <button
                onClick={handleSaveMatrix}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition whitespace-nowrap"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Matriks Hak Akses</span>
              </button>
            </div>
          </div>

          {/* Table Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[1250px]">
                {/* Header Row */}
                <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="p-3 w-80 font-black uppercase text-[10px] text-slate-600 tracking-wider">
                      MODUL & HAK AKSES
                    </th>
                    {roles.map((role) => (
                      <th
                        key={role.key}
                        className={`p-3 text-center align-top border-l border-slate-200 w-36 ${
                          role.key === 'admin' ? 'bg-slate-50/80' : ''
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-black text-slate-800 text-[10px] uppercase block tracking-tight">
                            {role.name}
                          </span>
                          <button
                            title="Ubah Nama/Deskripsi Peran"
                            onClick={() => handleOpenEditRole(role)}
                            className="text-slate-400 hover:text-sky-600 p-0.5 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <span className="px-1.5 py-0.2 rounded bg-slate-700 text-white font-mono text-[9px] font-bold">
                            {role.badge}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-teal-600 text-white font-bold text-[9px]">
                            {role.badgeType}
                          </span>
                        </div>

                        {/* Under-badge action */}
                        {role.isFullAccess ? (
                          <div className="mt-1.5 text-emerald-600 font-extrabold text-[10px] flex items-center justify-center gap-1">
                            <span>✓</span>
                            <span>AKSES PENUH</span>
                          </div>
                        ) : (
                          <div className="mt-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleAllForRole(role.key)}
                              className="px-2 py-0.5 rounded border border-sky-400 text-sky-700 hover:bg-sky-50 text-[10px] font-bold transition cursor-pointer"
                            >
                              Toggle All
                            </button>
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <React.Fragment key={cat.moduleKey}>
                      {/* Module Category Row */}
                      <tr className="bg-[#f1f5f9] border-y border-slate-200 font-black text-slate-800 text-[11px]">
                        <td colSpan={1 + roles.length} className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-700 text-sm">📁</span>
                            <span className="tracking-wide uppercase">{cat.groupTitle}</span>
                            <span className="px-2 py-0.5 bg-white rounded border border-slate-300 text-slate-600 text-[9px] font-bold">
                              {cat.badge}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Permissions in this Category */}
                      {cat.permissions.map((perm) => (
                        <tr key={perm.id} className="hover:bg-sky-50/30 transition">
                          {/* Modul & Hak Akses Name & Actions */}
                          <td className="p-3 align-middle">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-0.5">
                                <strong className="text-slate-900 block font-bold text-xs">
                                  {perm.name}
                                </strong>
                                <div className="text-[10px] text-slate-500 font-medium">
                                  <span className="font-mono text-rose-600 font-semibold">{perm.code}</span>
                                  <span> - {perm.description}</span>
                                </div>
                              </div>

                              {/* Action buttons on each row: Edit & Trash */}
                              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                                <button
                                  title="Edit Hak Akses"
                                  onClick={() => handleOpenEditPerm(perm)}
                                  className="w-6 h-6 border border-slate-300 hover:bg-slate-100 rounded text-slate-700 flex items-center justify-center cursor-pointer transition shadow-2xs"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  title="Hapus Hak Akses"
                                  onClick={() => handleDeletePerm(perm)}
                                  className="w-6 h-6 border border-rose-300 hover:bg-rose-50 rounded text-rose-600 flex items-center justify-center cursor-pointer transition shadow-2xs"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Role Checkbox Columns */}
                          {roles.map((role) => {
                            if (role.isFullAccess) {
                              return (
                                <td
                                  key={role.key}
                                  className="p-3 text-center align-middle border-l border-slate-200 bg-slate-50/40"
                                >
                                  <div className="flex justify-center">
                                    <input
                                      type="checkbox"
                                      checked={true}
                                      disabled
                                      className="w-4 h-4 rounded text-slate-400 bg-slate-100 border-slate-300 cursor-not-allowed opacity-60"
                                    />
                                  </div>
                                </td>
                              );
                            }

                            const isActive = matrixMap.has(`${role.key}:${perm.id}`);
                            return (
                              <td
                                key={role.key}
                                className="p-3 text-center align-middle border-l border-slate-200"
                              >
                                <div className="flex justify-center">
                                  <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={() => togglePermission(role.key, perm.id)}
                                    className="w-4 h-4 rounded text-teal-600 accent-teal-600 border-slate-300 focus:ring-teal-500 cursor-pointer"
                                  />
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Row */}
            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60">
              <button
                type="button"
                onClick={() => setActiveTab('pengguna')}
                className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 rounded-lg text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Daftar Pengguna</span>
              </button>

              <button
                type="button"
                onClick={handleSaveMatrix}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Matriks Hak Akses</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT HAK AKSES (PERMISSION) */}
      {/* ========================================================================= */}
      {permModalMode === 'edit' && selectedPerm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="bg-sky-600 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="font-extrabold flex items-center gap-2 text-sm">
                <Edit2 className="w-4 h-4" />
                <span>Edit Hak Akses (Permission)</span>
              </div>
              <button
                onClick={() => setPermModalMode(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSavePermModal} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Modul <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={permFormModule}
                    onChange={(e) => setPermFormModule(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Aksi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={permFormAction}
                    onChange={(e) => setPermFormAction(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Label Hak Akses <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={permFormName}
                  onChange={(e) => setPermFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Kode Permission <span className="text-slate-400 font-normal">(modul.aksi)</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${permFormModule}.${permFormAction}`}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Deskripsi Penjelasan
                </label>
                <textarea
                  rows={3}
                  value={permFormDesc}
                  onChange={(e) => setPermFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPermModalMode(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Perbarui Hak Akses</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TAMBAH HAK AKSES (PERMISSION) BARU */}
      {/* ========================================================================= */}
      {permModalMode === 'create' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="bg-emerald-600 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="font-extrabold flex items-center gap-2 text-sm">
                <KeyRound className="w-4 h-4" />
                <span>Tambah Hak Akses (Permission) Baru</span>
              </div>
              <button
                onClick={() => setPermModalMode(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSavePermModal} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Modul <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="contoh: siswa, nilai, pkl, ..."
                    value={permFormModule}
                    onChange={(e) => setPermFormModule(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Aksi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="contoh: view, create, edit, ..."
                    value={permFormAction}
                    onChange={(e) => setPermFormAction(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Label Hak Akses <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="contoh: Cetak Berita Acara Kelulusan"
                  value={permFormName}
                  onChange={(e) => setPermFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Kode Permission (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Otomatis terisi: modul.aksi (contoh: surat.cetak)"
                  value={permFormCode}
                  onChange={(e) => setPermFormCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Jika dikosongkan, akan otomatis dibentuk dari modul.aksi.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Deskripsi Penjelasan
                </label>
                <textarea
                  rows={3}
                  placeholder="Penjelasan fungsi dari hak akses ini"
                  value={permFormDesc}
                  onChange={(e) => setPermFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPermModalMode(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Simpan Hak Akses</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT DATA PERAN (ROLE) */}
      {/* ========================================================================= */}
      {roleModalMode === 'edit' && selectedRole && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden text-xs">
            {/* Header */}
            <div className="bg-sky-600 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="font-extrabold flex items-center gap-2 text-sm">
                <Edit2 className="w-4 h-4" />
                <span>Edit Data Peran (Role)</span>
              </div>
              <button
                onClick={() => setRoleModalMode(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSaveRoleModal} className="p-5 space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Kode / Slug Peran
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedRole.slug}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-xs font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Peran sistem bawaan terkunci demi keamanan aplikasi.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama Label Peran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={roleFormName}
                  onChange={(e) => setRoleFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Deskripsi Peran
                </label>
                <textarea
                  rows={3}
                  value={roleFormDesc}
                  onChange={(e) => setRoleFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              {/* Footer */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRoleModalMode(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Perbarui Peran</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: TAMBAH PERAN (ROLE) BARU */}
      {/* ========================================================================= */}
      {roleModalMode === 'create' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden text-xs">
            {/* Header */}
            <div className="bg-sky-600 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="font-extrabold flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                <span>Tambah Peran (Role) Baru</span>
              </div>
              <button
                onClick={() => setRoleModalMode(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSaveRoleModal} className="p-5 space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Kode / Slug Peran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="contoh: staf_tu, bendahara, konselor"
                  value={roleFormSlug}
                  onChange={(e) => setRoleFormSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Format teknis huruf kecil tanpa spasi (contoh: bendahara_sekolah).
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama Label Peran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="contoh: Bendahara Sekolah / BOS"
                  value={roleFormName}
                  onChange={(e) => setRoleFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Deskripsi Peran
                </label>
                <textarea
                  rows={3}
                  placeholder="Tugas dan wewenang peran ini di sistem buku induk"
                  value={roleFormDesc}
                  onChange={(e) => setRoleFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              {/* Footer */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRoleModalMode(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Simpan Peran</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Branding matching screenshots */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          Copyright © 2026 <strong className="text-sky-600">Buku Induk Digital</strong>. Powered by{' '}
          <strong className="text-sky-600">Syntax Trust</strong>. All rights reserved.
        </p>
        <span className="font-semibold text-slate-600">Version 1.2.0</span>
      </div>
    </div>
  );
};
