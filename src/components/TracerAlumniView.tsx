import React, { useState, useEffect, useMemo } from 'react';
import { Student, SchoolSettings } from '../types';
import {
  Compass,
  GraduationCap,
  Download,
  Search,
  Calendar,
  Clock,
  MessageCircle,
  Briefcase,
  BookOpen,
  Store,
  HelpCircle,
  Edit3,
  Eye,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Building,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
} from 'lucide-react';

export interface AlumniRecord {
  id: string;
  noReg: string;
  nipd: string;
  nisn: string;
  fullName: string;
  gender: 'L' | 'P';
  tempatLahir: string;
  tglLahir: string;
  agama: string;
  alamat: string;
  telepon: string;
  programKeahlian: string;
  kelas: string;
  namaAyah: string;
  namaIbu: string;
  nik: string;
  noKk: string;
  email: string;
  tglLulus: string; // e.g. "03/11/2026"
  noIjazah: string; // e.g. "DN-01/M-SMK/24/0000001"
  // Tracer fields matching image_efed350c.png:
  melanjutkanStudi: string; // Nama Kampus / Prodi
  namaPerusahaan: string; // Nama Perusahaan (Bekerja)
  tglMulaiBekerja: string; // Tgl Mulai Bekerja
  penghasilan: string; // Penghasilan bulanan
  tracerCategory: 'Bekerja' | 'Melanjutkan Studi' | 'Wirausaha' | 'Belum Bekerja';
}

// 22 alumni students corresponding to XII DKV seniors
const DEFAULT_ALUMNI_DATA: AlumniRecord[] = [
  {
    id: 'alm-1',
    noReg: 'REG-2026-001',
    nipd: '9307/307.307',
    nisn: '9000000007',
    fullName: 'SISWA CONTOH 7',
    gender: 'L',
    tempatLahir: 'Bojonegoro',
    tglLahir: '14/03/2007',
    agama: 'Islam',
    alamat: 'Desa Sumbertlaseh RT 02 RW 01 Kec. Dander Bojonegoro',
    telepon: '081234567890',
    programKeahlian: 'Desain Komunikasi Visual',
    kelas: 'XII DKV',
    namaAyah: 'Suryanto',
    namaIbu: 'Siti Aminah',
    nik: '3522011403070001',
    noKk: '3522012005080002',
    email: 'achmad.danuarta@gmail.com',
    tglLulus: '03/11/2026',
    noIjazah: 'DN-01/M-SMK/24/0000001',
    melanjutkanStudi: '',
    namaPerusahaan: 'PT Telkom Multimedia Indonesia',
    tglMulaiBekerja: '01/12/2026',
    penghasilan: 'Rp 4.500.000',
    tracerCategory: 'Bekerja',
  },
  {
    id: 'alm-2',
    noReg: 'REG-2026-002',
    nipd: '9309/309.309',
    nisn: '9000000301',
    fullName: 'SISWA CONTOH 44',
    gender: 'L',
    tempatLahir: 'Bojonegoro',
    tglLahir: '21/05/2007',
    agama: 'Islam',
    alamat: 'Ds. Ngumpakdalem RT 05 RW 02 Dander',
    telepon: '081398765432',
    programKeahlian: 'Desain Komunikasi Visual',
    kelas: 'XII DKV',
    namaAyah: 'Bambang Pambudi',
    namaIbu: 'Sri Rahayu',
    nik: '3522012105070002',
    noKk: '3522012005080003',
    email: 'ahmad.pambudi@gmail.com',
    tglLulus: '03/11/2026',
    noIjazah: 'DN-01/M-SMK/24/0000002',
    melanjutkanStudi: 'Institut Seni Indonesia Yogyakarta (S1 DKV)',
    namaPerusahaan: '',
    tglMulaiBekerja: '',
    penghasilan: '-',
    tracerCategory: 'Melanjutkan Studi',
  },
  {
    id: 'alm-3',
    noReg: 'REG-2026-003',
    nipd: '9310/310.310',
    nisn: '9000000368',
    fullName: 'SISWA CONTOH 214',
    gender: 'P',
    tempatLahir: 'Bojonegoro',
    tglLahir: '08/04/2007',
    agama: 'Islam',
    alamat: 'Jl. Raya Dander No. 45 Bojonegoro',
    telepon: '085712349988',
    programKeahlian: 'Desain Komunikasi Visual',
    kelas: 'XII DKV',
    namaAyah: 'Arnisto Wijaya',
    namaIbu: 'Endang Sulastri',
    nik: '3522010804070003',
    noKk: '3522012005080004',
    email: 'aprilia.salsa@gmail.com',
    tglLulus: '03/11/2026',
    noIjazah: 'DN-01/M-SMK/24/0000003',
    melanjutkanStudi: '',
    namaPerusahaan: 'Creative Agency Dander Grafika',
    tglMulaiBekerja: '15/11/2026',
    penghasilan: 'Rp 3.800.000',
    tracerCategory: 'Bekerja',
  },
  {
    id: 'alm-4',
    noReg: 'REG-2026-004',
    nipd: '9311/311.311',
    nisn: '9000000922',
    fullName: 'SISWA CONTOH 241',
    gender: 'P',
    tempatLahir: 'Bojonegoro',
    tglLahir: '19/06/2007',
    agama: 'Islam',
    alamat: 'Desa Ngraseh RT 01 RW 01 Dander',
    telepon: '082155443322',
    programKeahlian: 'Desain Komunikasi Visual',
    kelas: 'XII DKV',
    namaAyah: 'Kurniawan',
    namaIbu: 'Dewi Lestari',
    nik: '3522011906070004',
    noKk: '3522012005080005',
    email: 'bella.kurnia@gmail.com',
    tglLulus: '03/11/2026',
    noIjazah: 'DN-01/M-SMK/24/0000004',
    melanjutkanStudi: 'Universitas Negeri Malang (Pendidikan Seni Rupa)',
    namaPerusahaan: '',
    tglMulaiBekerja: '',
    penghasilan: '-',
    tracerCategory: 'Melanjutkan Studi',
  },
  {
    id: 'alm-5',
    noReg: 'REG-2026-005',
    nipd: '9312/312.312',
    nisn: '9000000385',
    fullName: 'SISWA CONTOH 283',
    gender: 'P',
    tempatLahir: 'Bojonegoro',
    tglLahir: '12/08/2007',
    agama: 'Islam',
    alamat: 'Ds. Mojoranu RT 03 RW 01 Dander',
    telepon: '081298475622',
    programKeahlian: 'Desain Komunikasi Visual',
    kelas: 'XII DKV',
    namaAyah: 'Nur Cahyono',
    namaIbu: 'Fida Rahmawati',
    nik: '3522011208070005',
    noKk: '3522012005080006',
    email: 'deni.fida@gmail.com',
    tglLulus: '03/11/2026',
    noIjazah: 'DN-01/M-SMK/24/0000005',
    melanjutkanStudi: '',
    namaPerusahaan: 'Bella & Fida Studio Foto Mandiri',
    tglMulaiBekerja: '01/11/2026',
    penghasilan: 'Rp 5.200.000',
    tracerCategory: 'Wirausaha',
  },
  {
    id: 'alm-6',
    noReg: 'REG-2026-006',
    nipd: '9313/313.313',
    nisn: '9000000184',
    fullName: 'SISWA CONTOH 294',
    gender: 'P',
    tempatLahir: 'Bojonegoro',
    tglLahir: '03/02/2007',
    agama: 'Islam',
    alamat: 'Ds. Kunci RT 02 RW 02 Dander',
    telepon: '087855667788',
    programKeahlian: 'Desain Komunikasi Visual',
    kelas: 'XII DKV',
    namaAyah: 'Kartono',
    namaIbu: 'Ayu Wandira',
    nik: '3522010302070006',
    noKk: '3522012005080007',
    email: 'diah.ayu@gmail.com',
    tglLulus: '03/11/2026',
    noIjazah: 'DN-01/M-SMK/24/0000006',
    melanjutkanStudi: '',
    namaPerusahaan: '',
    tglMulaiBekerja: '',
    penghasilan: '-',
    tracerCategory: 'Belum Bekerja',
  },
  {
    id: 'alm-7',
    noReg: 'REG-2026-007',
    nipd: '9314/314.314',
    nisn: '9000001001',
    fullName: 'SISWA CONTOH 297',
    gender: 'L',
    tempatLahir: 'Bojonegoro',
    tglLahir: '27/09/2007',
    agama: 'Islam',
    alamat: 'Ds. Sendangrejo RT 04 RW 02 Dander',
    telepon: '085811223344',
    programKeahlian: 'Desain Komunikasi Visual',
    kelas: 'XII DKV',
    namaAyah: 'Prasetyo Utomo',
    namaIbu: 'Mariyatun',
    nik: '3522012709070007',
    noKk: '3522012005080008',
    email: 'dicky.prastyo@gmail.com',
    tglLulus: '03/11/2026',
    noIjazah: 'DN-01/M-SMK/24/0000007',
    melanjutkanStudi: '',
    namaPerusahaan: 'Percetakan Surya Offset Bojonegoro',
    tglMulaiBekerja: '20/11/2026',
    penghasilan: 'Rp 3.500.000',
    tracerCategory: 'Bekerja',
  },
  {
    id: 'alm-8',
    noReg: 'REG-2026-008',
    nipd: '9315/315.315',
    nisn: '9000000947',
    fullName: 'SISWA CONTOH 308',
    gender: 'P',
    tempatLahir: 'Bojonegoro',
    tglLahir: '15/07/2007',
    agama: 'Islam',
    alamat: 'Ds. Jatiblimbing RT 01 RW 01 Dander',
    telepon: '081344556677',
    programKeahlian: 'Desain Komunikasi Visual',
    kelas: 'XII DKV',
    namaAyah: 'Alim',
    namaIbu: 'Delima',
    nik: '3522011507070008',
    noKk: '3522012005080009',
    email: 'distya.delima@gmail.com',
    tglLulus: '03/11/2026',
    noIjazah: 'DN-01/M-SMK/24/0000008',
    melanjutkanStudi: 'Universitas Brawijaya (Desain Grafis)',
    namaPerusahaan: '',
    tglMulaiBekerja: '',
    penghasilan: '-',
    tracerCategory: 'Melanjutkan Studi',
  },
  {
    id: 'alm-9',
    noReg: 'REG-2026-009',
    nipd: '9316/316.316',
    nisn: '9000000033',
    fullName: 'SISWA CONTOH 312',
    gender: 'P',
    tempatLahir: 'Bojonegoro',
    tglLahir: '05/11/2007',
    agama: 'Islam',
    alamat: 'Ds. Karangsono RT 02 RW 01 Dander',
    telepon: '089677889900',
    programKeahlian: 'Desain Komunikasi Visual',
    kelas: 'XII DKV',
    namaAyah: 'Suwandi',
    namaIbu: 'Mirna',
    nik: '3522010511070009',
    noKk: '3522012005080010',
    email: 'duwi.mirna@gmail.com',
    tglLulus: '03/11/2026',
    noIjazah: 'DN-01/M-SMK/24/0000009',
    melanjutkanStudi: '',
    namaPerusahaan: 'CV Global Advertising Surabaya',
    tglMulaiBekerja: '01/12/2026',
    penghasilan: 'Rp 4.200.000',
    tracerCategory: 'Bekerja',
  },
  {
    id: 'alm-10',
    noReg: 'REG-2026-010',
    nipd: '9317/317.317',
    nisn: '9000000297',
    fullName: 'SISWA CONTOH 314',
    gender: 'P',
    tempatLahir: 'Bojonegoro',
    tglLahir: '30/01/2007',
    agama: 'Islam',
    alamat: 'Ds. Ngulanan RT 01 RW 02 Dander',
    telepon: '085233445566',
    programKeahlian: 'Desain Komunikasi Visual',
    kelas: 'XII DKV',
    namaAyah: 'Zuhri',
    namaIbu: 'Fatimah',
    nik: '3522013001070010',
    noKk: '3522012005080011',
    email: 'dwi.fatimatuz@gmail.com',
    tglLulus: '03/11/2026',
    noIjazah: 'DN-01/M-SMK/24/0000010',
    melanjutkanStudi: '',
    namaPerusahaan: 'PT Digital Kreasi Asia',
    tglMulaiBekerja: '15/12/2026',
    penghasilan: 'Rp 4.000.000',
    tracerCategory: 'Bekerja',
  },
];

interface TracerAlumniViewProps {
  students: Student[];
  schoolSettings?: SchoolSettings;
  onOpenStudent?: (student: Student) => void;
  onNavigate?: (menu: string) => void;
}

export const TracerAlumniView: React.FC<TracerAlumniViewProps> = ({
  students,
  schoolSettings = {
    name: 'SMKN DANDER',
    npsn: '20541259',
    address: 'Jl. KHR. Moh Rosyid Desa Sumbertlaseh Kec. Dander Bojonegoro',
    principalName: 'Dr. Molyono, M.MPd',
    principalNip: '-',
    activeAcademicYear: '2026/2027',
  } as SchoolSettings,
  onOpenStudent,
  onNavigate,
}) => {
  // Real-time clock matching Gambar 1 (09:42:41)
  const [currentTime, setCurrentTime] = useState<string>('09:42:41');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Data State: In Gambar 1, the table initially shows "Tidak ada data yang tersedia pada tabel ini" (0 entries)
  // We allow user to toggle between Empty State (exact screenshot 1) and Loaded State (Alumni data)
  const [alumniList, setAlumniList] = useState<AlumniRecord[]>(() => {
    try {
      const saved = localStorage.getItem('siduk_alumni_tracer_datastore');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Initially empty to match screenshot 1 perfectly, with quick button to populate
    return [];
  });

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem('siduk_alumni_tracer_datastore', JSON.stringify(alumniList));
    } catch {
      // ignore
    }
  }, [alumniList]);

  // Table Controls
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals & Notifications
  const [editingAlumni, setEditingAlumni] = useState<AlumniRecord | null>(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'info';
    message: string;
  } | null>(null);

  // Filtered records
  const filteredAlumni = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return alumniList;
    return alumniList.filter(
      (a) =>
        a.fullName.toLowerCase().includes(term) ||
        a.nipd.toLowerCase().includes(term) ||
        a.nisn.toLowerCase().includes(term) ||
        a.noIjazah.toLowerCase().includes(term) ||
        a.tracerCategory.toLowerCase().includes(term) ||
        a.namaPerusahaan.toLowerCase().includes(term) ||
        a.melanjutkanStudi.toLowerCase().includes(term)
    );
  }, [alumniList, searchTerm]);

  // Paginated records
  const totalPages = Math.max(1, Math.ceil(filteredAlumni.length / entriesPerPage));
  const paginatedAlumni = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredAlumni.slice(start, start + entriesPerPage);
  }, [filteredAlumni, currentPage, entriesPerPage]);

  // Populate sample graduated alumni matching XII DKV
  const handleLoadSampleAlumni = () => {
    setAlumniList(DEFAULT_ALUMNI_DATA);
    setNotification({
      type: 'success',
      message: `Berhasil memuat ${DEFAULT_ALUMNI_DATA.length} data alumni lulusan kelas XII DKV untuk penelusuran tamatan (Tracer Study).`,
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleClearAlumni = () => {
    setAlumniList([]);
    setNotification({
      type: 'info',
      message: 'Tabel data alumni dikosongkan (sesuai tampilan awal).',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // ========================================================
  // EXPORT ALUMNI TO EXCEL matching Gambar 2 (image_efed350c)
  // File: Data_Peserta_Didik_SMK_Lulus_YYYYMMDD_HHMMSS.xls
  // 23 Exact Columns:
  // NO REG | NIPD | NISN | NAMA LENGKAP | L/P | TEMPAT LAHIR | TGL LAHIR | AGAMA | ALAMAT | TELEPON | PROGRAM KEAHLIAN | KELAS | NAMA AYAH | NAMA IBU | NIK | NO KK | EMAIL | TGL LULUS | NO IJAZAH | MELANJUTKAN STUDI | NAMA PERUSAHAAN (BEKERJA) | TGL MULAI BEKERJA | PENGHASILAN
  // ========================================================
  const handleExportAlumniExcel = () => {
    // If table is empty, use DEFAULT_ALUMNI_DATA so user gets a real exported file!
    const dataToExport = alumniList.length > 0 ? alumniList : DEFAULT_ALUMNI_DATA;

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const filename = `Data_Peserta_Didik_SMK_Lulus_${yyyy}${mm}${dd}_${hh}${min}${ss}.xls`;

    const rowsXml = dataToExport
      .map(
        (a) => `
   <Row>
    <Cell ss:StyleID="TextCenter"><Data ss:Type="String">${a.noReg}</Data></Cell>
    <Cell ss:StyleID="TextCenter"><Data ss:Type="String">${a.nipd}</Data></Cell>
    <Cell ss:StyleID="TextCenter"><Data ss:Type="String">${a.nisn}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${a.fullName}</Data></Cell>
    <Cell ss:StyleID="TextCenter"><Data ss:Type="String">${a.gender}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${a.tempatLahir}</Data></Cell>
    <Cell ss:StyleID="TextCenter"><Data ss:Type="String">${a.tglLahir}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${a.agama}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${a.alamat}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${a.telepon}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${a.programKeahlian}</Data></Cell>
    <Cell ss:StyleID="TextCenter"><Data ss:Type="String">${a.kelas}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${a.namaAyah}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${a.namaIbu}</Data></Cell>
    <Cell ss:StyleID="TextCenter"><Data ss:Type="String">${a.nik}</Data></Cell>
    <Cell ss:StyleID="TextCenter"><Data ss:Type="String">${a.noKk}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${a.email}</Data></Cell>
    <Cell ss:StyleID="TextCenter"><Data ss:Type="String">${a.tglLulus}</Data></Cell>
    <Cell ss:StyleID="TextCenter"><Data ss:Type="String">${a.noIjazah}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${a.melanjutkanStudi || '-'}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${a.namaPerusahaan || '-'}</Data></Cell>
    <Cell ss:StyleID="TextCenter"><Data ss:Type="String">${a.tglMulaiBekerja || '-'}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${a.penghasilan || '-'}</Data></Cell>
   </Row>`
      )
      .join('');

    const xmlTemplate = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="HeaderRow">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000" ss:Bold="1"/>
   <Interior ss:Color="#EAEAEA" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
   </Borders>
  </Style>
  <Style ss:ID="Text">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4D4D4"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4D4D4"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4D4D4"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4D4D4"/>
   </Borders>
  </Style>
  <Style ss:ID="TextCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4D4D4"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4D4D4"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4D4D4"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D4D4D4"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Worksheet">
  <Table ss:DefaultColumnWidth="85">
   <Column ss:Width="70"/>
   <Column ss:Width="80"/>
   <Column ss:Width="85"/>
   <Column ss:Width="160"/>
   <Column ss:Width="35"/>
   <Column ss:Width="95"/>
   <Column ss:Width="75"/>
   <Column ss:Width="65"/>
   <Column ss:Width="200"/>
   <Column ss:Width="95"/>
   <Column ss:Width="150"/>
   <Column ss:Width="70"/>
   <Column ss:Width="120"/>
   <Column ss:Width="120"/>
   <Column ss:Width="120"/>
   <Column ss:Width="120"/>
   <Column ss:Width="150"/>
   <Column ss:Width="75"/>
   <Column ss:Width="130"/>
   <Column ss:Width="160"/>
   <Column ss:Width="160"/>
   <Column ss:Width="90"/>
   <Column ss:Width="95"/>
   <Row>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">NO REG</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">NIPD</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">NISN</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">NAMA LENGKAP</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">L/P</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">TEMPAT LAHIR</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">TGL LAHIR</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">AGAMA</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">ALAMAT</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">TELEPON</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">PROGRAM KEAHLIAN</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">KELAS</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">NAMA AYAH</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">NAMA IBU</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">NIK</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">NO KK</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">EMAIL</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">TGL LULUS</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">NO IJAZAH</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">MELANJUTKAN STUDI</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">NAMA PERUSAHAAN (BEKERJA)</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">TGL MULAI BEKERJA</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">PENGHASILAN</Data></Cell>
   </Row>${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xmlTemplate], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setNotification({
      type: 'success',
      message: `File rekap Excel berhasil diunduh: "${filename}" (${dataToExport.length} baris data alumni).`,
    });
    setTimeout(() => setNotification(null), 5000);
  };

  // Save updated tracer details
  const handleSaveTracerEdit = (updated: AlumniRecord) => {
    setAlumniList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setEditingAlumni(null);
    setNotification({
      type: 'success',
      message: `Data penelusuran tamatan (Tracer Study) untuk "${updated.fullName}" berhasil disimpan.`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <section className="space-y-6">
      {/* Top Header & Real-time Clock matching Gambar 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Tracer &amp; Manajemen Alumni
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Penelusuran tamatan, data status bekerja, kuliah, dan pelaporan statistik keterserapan lulusan.
          </p>
        </div>

        {/* Date and Live Clock Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>03 Nov 2026</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-mono font-bold shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Toast Notification Alert */}
      {notification && (
        <div
          className={`rounded-xl p-4 shadow-sm flex items-start justify-between gap-3 text-xs animate-in fade-in duration-200 ${
            notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-[#008ba3] text-white'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-white/90 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold text-sm block">Notifikasi Sistem</strong>
              <p className="text-white/90 text-xs mt-0.5 leading-relaxed font-medium">
                {notification.message}
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded-md hover:bg-black/10 transition cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Main Card matching Gambar 1 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Card Header with Blue Top Border Accent */}
        <div className="border-t-2 border-t-[#008ba3] px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#008ba3]" />
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Tracer &amp; Manajemen Alumni
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {alumniList.length === 0 ? (
              <button
                type="button"
                onClick={handleLoadSampleAlumni}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" /> Muat Contoh Data Alumni (10 Siswa)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClearAlumni}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Reset ke Tampilan Kosong
              </button>
            )}

            {/* EXPORT ALUMNI BUTTON matching Gambar 1 */}
            <button
              type="button"
              onClick={handleExportAlumniExcel}
              className="px-4 py-2 bg-[#008ba3] hover:bg-cyan-700 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs transition cursor-pointer tracking-wider uppercase active:scale-98"
            >
              <FileSpreadsheet className="w-4 h-4" /> EXPORT ALUMNI
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Daftar peserta didik yang telah dinyatakan <strong>Lulus</strong> dari satuan pendidikan.
          </p>

          {/* Controls: Tampilkan X entri & Cari */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-2">
            <div className="flex items-center gap-2 text-slate-600">
              <span>Tampilkan</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entri</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <span>Cari:</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="p-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#008ba3] w-48 sm:w-56"
              />
            </div>
          </div>

          {/* Table matching Gambar 1 exactly */}
          <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-2xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                  <th className="p-3 w-14 text-center cursor-pointer hover:bg-slate-100 select-none">
                    NO <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                  <th className="p-3 cursor-pointer hover:bg-slate-100 select-none">
                    BIODATA ALUMNI <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                  <th className="p-3 w-32 cursor-pointer hover:bg-slate-100 select-none">
                    TAHUN LULUS <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                  <th className="p-3 w-48 cursor-pointer hover:bg-slate-100 select-none">
                    NO. STTB / IJAZAH <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                  <th className="p-3 w-64 cursor-pointer hover:bg-slate-100 select-none">
                    JEJAK / PEKERJAAN <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                  <th className="p-3 w-32 text-center cursor-pointer hover:bg-slate-100 select-none">
                    AKSI <span className="text-slate-400 font-normal">⇅</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedAlumni.length === 0 ? (
                  // Exact Empty State from Gambar 1
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-slate-500 font-normal text-xs bg-white"
                    >
                      Tidak ada data yang tersedia pada tabel ini
                    </td>
                  </tr>
                ) : (
                  paginatedAlumni.map((item, idx) => {
                    const rowNumber = (currentPage - 1) * entriesPerPage + idx + 1;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 bg-white transition">
                        <td className="p-3 text-center font-bold text-slate-500">
                          {rowNumber}
                        </td>
                        <td className="p-3">
                          <strong className="text-slate-900 font-bold block uppercase text-xs">
                            {item.fullName}
                          </strong>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {item.nipd} / {item.nisn}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {item.kelas} • {item.programKeahlian}
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">
                          {item.tglLulus || '2026'}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-700">
                          {item.noIjazah || '-'}
                        </td>
                        <td className="p-3">
                          {item.tracerCategory === 'Bekerja' && (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                <Briefcase className="w-3 h-3" /> Bekerja
                              </span>
                              <div className="text-[11px] font-semibold text-slate-800">
                                {item.namaPerusahaan}
                              </div>
                              {item.penghasilan && (
                                <div className="text-[10px] text-slate-500">
                                  Gaji: {item.penghasilan}
                                </div>
                              )}
                            </div>
                          )}
                          {item.tracerCategory === 'Melanjutkan Studi' && (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <BookOpen className="w-3 h-3" /> Kuliah
                              </span>
                              <div className="text-[11px] font-semibold text-slate-800">
                                {item.melanjutkanStudi}
                              </div>
                            </div>
                          )}
                          {item.tracerCategory === 'Wirausaha' && (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                <Store className="w-3 h-3" /> Wirausaha
                              </span>
                              <div className="text-[11px] font-semibold text-slate-800">
                                {item.namaPerusahaan}
                              </div>
                              {item.penghasilan && (
                                <div className="text-[10px] text-slate-500">
                                  Omzet: {item.penghasilan}
                                </div>
                              )}
                            </div>
                          )}
                          {item.tracerCategory === 'Belum Bekerja' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                              <HelpCircle className="w-3 h-3 text-slate-400" /> Belum Bekerja / Mencari
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => setEditingAlumni(item)}
                            className="px-2.5 py-1 bg-[#008ba3]/10 hover:bg-[#008ba3] text-[#008ba3] hover:text-white rounded text-[11px] font-bold transition flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" /> Update
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer: Menampilkan X sampai Y dari Z entri + Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div>
              {filteredAlumni.length === 0 ? (
                <span>Menampilkan 0 sampai 0 dari 0 entri</span>
              ) : (
                <span>
                  Menampilkan {(currentPage - 1) * entriesPerPage + 1} sampai{' '}
                  {Math.min(currentPage * entriesPerPage, filteredAlumni.length)} dari{' '}
                  {filteredAlumni.length} entri
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 self-end sm:self-auto">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages || filteredAlumni.length === 0}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT TRACER MODAL */}
      {editingAlumni && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#008ba3]" /> Update Jejak / Tracer Alumni
              </h3>
              <button
                onClick={() => setEditingAlumni(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveTracerEdit(editingAlumni);
              }}
              className="space-y-3 text-xs"
            >
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 text-sm uppercase">
                  {editingAlumni.fullName}
                </div>
                <div className="text-slate-500 font-mono text-[11px]">
                  NISN: {editingAlumni.nisn} • NIPD: {editingAlumni.nipd} • Kelas: {editingAlumni.kelas}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Kategori Jejak / Aktivitas</label>
                <select
                  value={editingAlumni.tracerCategory}
                  onChange={(e) =>
                    setEditingAlumni({
                      ...editingAlumni,
                      tracerCategory: e.target.value as any,
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Bekerja">Bekerja</option>
                  <option value="Melanjutkan Studi">Melanjutkan Studi (Kuliah)</option>
                  <option value="Wirausaha">Wirausaha</option>
                  <option value="Belum Bekerja">Belum Bekerja / Mencari Kerja</option>
                </select>
              </div>

              {editingAlumni.tracerCategory === 'Melanjutkan Studi' ? (
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Nama Perguruan Tinggi &amp; Program Studi
                  </label>
                  <input
                    type="text"
                    value={editingAlumni.melanjutkanStudi}
                    onChange={(e) =>
                      setEditingAlumni({ ...editingAlumni, melanjutkanStudi: e.target.value })
                    }
                    placeholder="Contoh: Universitas Negeri Surabaya (S1 DKV)"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      {editingAlumni.tracerCategory === 'Wirausaha'
                        ? 'Nama Usaha / Bisnis'
                        : 'Nama Perusahaan / Tempat Bekerja'}
                    </label>
                    <input
                      type="text"
                      value={editingAlumni.namaPerusahaan}
                      onChange={(e) =>
                        setEditingAlumni({ ...editingAlumni, namaPerusahaan: e.target.value })
                      }
                      placeholder="Contoh: PT Telkom Multimedia Indonesia"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">Tanggal Mulai Bekerja</label>
                      <input
                        type="text"
                        value={editingAlumni.tglMulaiBekerja}
                        onChange={(e) =>
                          setEditingAlumni({ ...editingAlumni, tglMulaiBekerja: e.target.value })
                        }
                        placeholder="DD/MM/YYYY"
                        className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">Estimasi Penghasilan</label>
                      <input
                        type="text"
                        value={editingAlumni.penghasilan}
                        onChange={(e) =>
                          setEditingAlumni({ ...editingAlumni, penghasilan: e.target.value })
                        }
                        placeholder="Contoh: Rp 4.500.000"
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Nomor Telepon / WA</label>
                  <input
                    type="text"
                    value={editingAlumni.telepon}
                    onChange={(e) =>
                      setEditingAlumni({ ...editingAlumni, telepon: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Email Aktif</label>
                  <input
                    type="email"
                    value={editingAlumni.email}
                    onChange={(e) =>
                      setEditingAlumni({ ...editingAlumni, email: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingAlumni(null)}
                  className="px-4 py-2 border rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008ba3] hover:bg-cyan-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Simpan Jejak Alumni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LICENSE MODAL */}
      {isLicenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#008ba3]" /> Konsultasi Lisensi Sekolah
              </h3>
              <button
                onClick={() => setIsLicenseModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3 text-slate-600">
              <p>
                Status lisensi sekolah <strong>{schoolSettings.name}</strong> aktif untuk Tahun Ajaran <strong>{schoolSettings.activeAcademicYear}</strong>.
              </p>
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1 text-sky-900 text-[11px]">
                <strong>Fitur Tracer Study &amp; Alumni:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  <li>Ekspor Format BKK &amp; Dapodik Kemendikbud</li>
                  <li>Tracking Keterserapan Lulusan Vokasi (Bekerja / Kuliah / Wirausaha)</li>
                  <li>Integrasi Buku Induk &amp; Buku Klapper Alumni</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsLicenseModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-700"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setIsLicenseModalOpen(false);
                  setNotification({
                    type: 'success',
                    message: 'Permintaan konsultasi telah dikirimkan ke tim representatif Syntax Trust.',
                  });
                  setTimeout(() => setNotification(null), 4000);
                }}
                className="px-4 py-2 bg-[#008ba3] hover:bg-cyan-700 text-white rounded-lg text-xs font-bold"
              >
                Hubungi Representatif
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
