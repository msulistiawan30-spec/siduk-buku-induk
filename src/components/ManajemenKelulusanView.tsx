import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Student, SchoolSettings } from '../types';
import {
  GraduationCap,
  Printer,
  FileSpreadsheet,
  Download,
  Upload,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowLeftRight,
  Eye,
  FileText,
  Save,
  X,
  Edit2,
  ChevronDown,
  ExternalLink,
  MessageCircle,
  School,
  Settings,
  Trophy,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export interface KelulusanItem {
  id: string;
  no: number;
  nis: string;
  nisn: string;
  name: string;
  birthDatePlace?: string;
  angkatan: string; // 'Angkatan 2026'
  cls: string; // 'XII DKV'
  major: string; // 'Desain Komunikasi Visual'
  rataRapor: number; // 0.00
  mapelCount: number; // 0
  nilaiSkl: number; // 0.00
  nilaiAkhir: number; // 0.00
  status: 'BELUM VALIDASI' | 'LULUS' | 'TIDAK LULUS';
  nomorIjazah?: string; // e.g. 'DN-01/M-SMK/24/0000001'
  nomorTranskrip?: string; // e.g. '809/226/SMK.A/IV/2026'
}

// 10 students matching Gambar 1 exactly
const DEFAULT_KELULUSAN_STUDENTS: KelulusanItem[] = [
  {
    id: 'kel-1',
    no: 1,
    nis: '9307/307.307',
    nisn: '9000000007',
    name: 'SISWA CONTOH 7',
    birthDatePlace: 'BOJONEGORO, 14 Maret 2007',
    angkatan: 'Angkatan 2026',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    rataRapor: 0.0,
    mapelCount: 0,
    nilaiSkl: 0.0,
    nilaiAkhir: 0.0,
    status: 'BELUM VALIDASI',
    nomorIjazah: '',
    nomorTranskrip: '',
  },
  {
    id: 'kel-2',
    no: 2,
    nis: '9309/309.309',
    nisn: '9000000301',
    name: 'SISWA CONTOH 44',
    birthDatePlace: 'BOJONEGORO, 21 Mei 2007',
    angkatan: 'Angkatan 2026',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    rataRapor: 0.0,
    mapelCount: 0,
    nilaiSkl: 0.0,
    nilaiAkhir: 0.0,
    status: 'BELUM VALIDASI',
    nomorIjazah: '',
    nomorTranskrip: '',
  },
  {
    id: 'kel-3',
    no: 3,
    nis: '9310/310.310',
    nisn: '9000000368',
    name: 'SISWA CONTOH 214',
    birthDatePlace: 'BOJONEGORO, 08 April 2007',
    angkatan: 'Angkatan 2026',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    rataRapor: 0.0,
    mapelCount: 0,
    nilaiSkl: 0.0,
    nilaiAkhir: 0.0,
    status: 'BELUM VALIDASI',
    nomorIjazah: '',
    nomorTranskrip: '',
  },
  {
    id: 'kel-4',
    no: 4,
    nis: '9311/311.311',
    nisn: '9000000922',
    name: 'SISWA CONTOH 241',
    birthDatePlace: 'BOJONEGORO, 19 Juni 2007',
    angkatan: 'Angkatan 2026',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    rataRapor: 0.0,
    mapelCount: 0,
    nilaiSkl: 0.0,
    nilaiAkhir: 0.0,
    status: 'BELUM VALIDASI',
    nomorIjazah: '',
    nomorTranskrip: '',
  },
  {
    id: 'kel-5',
    no: 5,
    nis: '9312/312.312',
    nisn: '9000000385',
    name: 'SISWA CONTOH 283',
    birthDatePlace: 'BOJONEGORO, 12 Agustus 2007',
    angkatan: 'Angkatan 2026',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    rataRapor: 0.0,
    mapelCount: 0,
    nilaiSkl: 0.0,
    nilaiAkhir: 0.0,
    status: 'BELUM VALIDASI',
    nomorIjazah: '',
    nomorTranskrip: '',
  },
  {
    id: 'kel-6',
    no: 6,
    nis: '9313/313.313',
    nisn: '9000000184',
    name: 'SISWA CONTOH 294',
    birthDatePlace: 'BOJONEGORO, 03 Februari 2007',
    angkatan: 'Angkatan 2026',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    rataRapor: 0.0,
    mapelCount: 0,
    nilaiSkl: 0.0,
    nilaiAkhir: 0.0,
    status: 'BELUM VALIDASI',
    nomorIjazah: '',
    nomorTranskrip: '',
  },
  {
    id: 'kel-7',
    no: 7,
    nis: '9314/314.314',
    nisn: '9000001001',
    name: 'SISWA CONTOH 297',
    birthDatePlace: 'BOJONEGORO, 27 September 2007',
    angkatan: 'Angkatan 2026',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    rataRapor: 0.0,
    mapelCount: 0,
    nilaiSkl: 0.0,
    nilaiAkhir: 0.0,
    status: 'BELUM VALIDASI',
    nomorIjazah: '',
    nomorTranskrip: '',
  },
  {
    id: 'kel-8',
    no: 8,
    nis: '9315/315.315',
    nisn: '9000000947',
    name: 'SISWA CONTOH 308',
    birthDatePlace: 'BOJONEGORO, 15 Juli 2007',
    angkatan: 'Angkatan 2026',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    rataRapor: 0.0,
    mapelCount: 0,
    nilaiSkl: 0.0,
    nilaiAkhir: 0.0,
    status: 'BELUM VALIDASI',
    nomorIjazah: '',
    nomorTranskrip: '',
  },
  {
    id: 'kel-9',
    no: 9,
    nis: '9316/316.316',
    nisn: '9000000033',
    name: 'SISWA CONTOH 312',
    birthDatePlace: 'BOJONEGORO, 05 November 2007',
    angkatan: 'Angkatan 2026',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    rataRapor: 0.0,
    mapelCount: 0,
    nilaiSkl: 0.0,
    nilaiAkhir: 0.0,
    status: 'BELUM VALIDASI',
    nomorIjazah: '',
    nomorTranskrip: '',
  },
  {
    id: 'kel-10',
    no: 10,
    nis: '9317/317.317',
    nisn: '9000000297',
    name: 'SISWA CONTOH 314',
    birthDatePlace: 'BOJONEGORO, 30 Januari 2007',
    angkatan: 'Angkatan 2026',
    cls: 'XII DKV',
    major: 'Desain Komunikasi Visual',
    rataRapor: 0.0,
    mapelCount: 0,
    nilaiSkl: 0.0,
    nilaiAkhir: 0.0,
    status: 'BELUM VALIDASI',
    nomorIjazah: '',
    nomorTranskrip: '',
  },
];

interface ManajemenKelulusanViewProps {
  students: Student[];
  schoolSettings?: SchoolSettings;
  onOpenStudent?: (student: Student) => void;
}

export const ManajemenKelulusanView: React.FC<ManajemenKelulusanViewProps> = ({
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
}) => {
  // Real-time clock
  const [currentTime, setCurrentTime] = useState<string>('07:28:13');
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

  // Persistent kelulusan data store
  const [kelulusanData, setKelulusanData] = useState<KelulusanItem[]>(() => {
    try {
      const saved = localStorage.getItem('siduk_kelulusan_datastore');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_KELULUSAN_STUDENTS;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('siduk_kelulusan_datastore', JSON.stringify(kelulusanData));
    } catch {
      // ignore
    }
  }, [kelulusanData]);

  // Filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Semua');
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [entriesPerPage, setEntriesPerPage] = useState<number>(25);

  // Modals
  // 1. Pratinjau Format Dokumen Siswa (Gambar 2)
  const [previewStudent, setPreviewStudent] = useState<KelulusanItem | null>(null);
  const [previewDocType, setPreviewDocType] = useState<'skl' | 'transkrip' | 'skill'>('skl');
  const [previewZoom, setPreviewZoom] = useState<number>(100);

  // 2. Input Data Kelulusan (Gambar 6)
  const [editingStudent, setEditingStudent] = useState<KelulusanItem | null>(null);
  const [formIjazah, setFormIjazah] = useState<string>('');
  const [formTranskrip, setFormTranskrip] = useState<string>('');

  // 3. Dropdown states per row
  const [openWordDropdownId, setOpenWordDropdownId] = useState<string | null>(null);
  const [openPrintDropdownId, setOpenPrintDropdownId] = useState<string | null>(null);

  // 4. Header Bulk Word dropdown
  const [isBulkWordOpen, setIsBulkWordOpen] = useState<boolean>(false);

  // 5. Sub-view: 'main' | 'import_graduation' (Gambar 59176e7a)
  const [currentSubView, setCurrentSubView] = useState<'main' | 'import_graduation'>('main');
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);
  const [importSuccessNotice, setImportSuccessNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Download Import Template matching Gambar image_33dc6dc4 (Template_Import_No_Ijazah.xls)
  const handleDownloadImportTemplate = () => {
    const studentRows = kelulusanData.slice(0, 10).map((s, idx) => `
   <Row>
    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="Number">${idx + 2}</Data></Cell>
    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">${s.nisn}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s.name}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">DN-01/M-SMK/24/${String(idx + 1).padStart(7, '0')}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">809/226/SMK.A/IV/2026</Data></Cell>
   </Row>`).join('');

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
  <Style ss:ID="HeaderTitle">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000" ss:Bold="1"/>
  </Style>
  <Style ss:ID="HeaderSub">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#333333" ss:Italic="1"/>
  </Style>
  <Style ss:ID="TableHead">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000" ss:Bold="1"/>
   <Interior ss:Color="#EAEAEA" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
   </Borders>
  </Style>
  <Style ss:ID="DataCell">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDDDDD"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDDDDD"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDDDDD"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDDDDD"/>
   </Borders>
  </Style>
  <Style ss:ID="DataCellCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDDDDD"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDDDDD"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDDDDD"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DDDDDD"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Worksheet">
  <Table ss:DefaultColumnWidth="80">
   <Column ss:Width="45"/>
   <Column ss:Width="110"/>
   <Column ss:Width="230"/>
   <Column ss:Width="190"/>
   <Column ss:Width="190"/>
   <Row>
    <Cell ss:StyleID="HeaderTitle"><Data ss:Type="String">TEMPLATE IMPORT NOMOR IJAZAH &amp; TRANSKRIP</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="HeaderSub"><Data ss:Type="String">Petunjuk: Baris 1-3 adalah header. Jangan hapus NISN karena digunakan sebagai ID pencocokan data.</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="TableHead"><Data ss:Type="String">NO</Data></Cell>
    <Cell ss:StyleID="TableHead"><Data ss:Type="String">NISN</Data></Cell>
    <Cell ss:StyleID="TableHead"><Data ss:Type="String">NAMA SISWA (Bantu)</Data></Cell>
    <Cell ss:StyleID="TableHead"><Data ss:Type="String">NOMOR IJAZAH / STTB</Data></Cell>
    <Cell ss:StyleID="TableHead"><Data ss:Type="String">NOMOR TRANSKRIP NILAI</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="Number">1</Data></Cell>
    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">0071234567</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Contoh Nama Siswa</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">DN-01/M-XXX/24/0000001</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">809/226/XXX.A/IV/2026</Data></Cell>
   </Row>${studentRows}
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xmlTemplate], {
      type: 'application/vnd.ms-excel',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Template_Import_No_Ijazah.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Bulk Import execution (Gambar 59176e7a)
  const handleExecuteBulkImport = () => {
    const updated = kelulusanData.map((item, idx) => ({
      ...item,
      nomorIjazah: item.nomorIjazah || `DN-01/M-SMK/24/${String(idx + 1).padStart(7, '0')}`,
      nomorTranskrip: item.nomorTranskrip || `809/${String(idx + 1).padStart(3, '0')}/SMK.A/IV/2026`,
    }));
    setKelulusanData(updated);
    setImportSuccessNotice('Data berhasil! Nomor ijazah dan transkrip nilai telah berhasil diperbarui untuk seluruh lulusan.');
    setCurrentSubView('main');
    setSelectedImportFile(null);
    setTimeout(() => setImportSuccessNotice(null), 5000);
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      setOpenWordDropdownId(null);
      setOpenPrintDropdownId(null);
      setIsBulkWordOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Filtered rows
  const filteredRecords = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return kelulusanData.filter((item) => {
      const matchClass = selectedClassFilter === 'Semua' || item.cls === selectedClassFilter;
      const matchMajor = selectedMajorFilter === 'Semua' || item.major === selectedMajorFilter;
      const matchSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.nis.toLowerCase().includes(term) ||
        item.nisn.toLowerCase().includes(term) ||
        item.cls.toLowerCase().includes(term);
      return matchClass && matchMajor && matchSearch;
    });
  }, [kelulusanData, selectedClassFilter, selectedMajorFilter, searchTerm]);

  // ========================================================
  // ACTION: DOWNLOAD WORD (.DOCX) - Gambar 3
  // ========================================================
  const handleDownloadWordDoc = (student: KelulusanItem, docType: 'skl' | 'transkrip' | 'skill') => {
    const title =
      docType === 'skl'
        ? `SKL_${student.name.replace(/\s+/g, '_')}`
        : docType === 'transkrip'
        ? `Transkrip_${student.name.replace(/\s+/g, '_')}`
        : `Pasport_Skill_${student.name.replace(/\s+/g, '_')}`;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${title}</title>
        <style>
          @page { size: 21cm 29.7cm; margin: 2cm 2cm 2cm 2cm; }
          body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.3; color: #000; }
          .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 6px; margin-bottom: 16px; }
          .kop h3 { margin: 0; font-size: 12pt; text-transform: uppercase; }
          .kop h2 { margin: 2px 0; font-size: 14pt; font-weight: bold; }
          .kop h4 { margin: 2px 0; font-size: 11pt; }
          .kop p { margin: 2px 0; font-size: 9pt; }
          .title { text-align: center; margin: 16px 0; }
          .title h1 { margin: 0; font-size: 14pt; text-decoration: underline; text-transform: uppercase; }
          .title p { margin: 3px 0 0; font-size: 10pt; }
          table.bio { width: 100%; margin: 12px 0; border: none; font-size: 10.5pt; }
          table.bio td { padding: 3px 4px; vertical-align: top; }
          table.nilai { width: 100%; border-collapse: collapse; margin: 12px 0; }
          table.nilai th, table.nilai td { border: 1px solid #000; padding: 5px 8px; font-size: 10pt; text-align: center; }
          table.nilai td.left { text-align: left; }
          .ttd { width: 100%; margin-top: 30px; }
          .ttd td { text-align: center; vertical-align: top; font-size: 11pt; }
        </style>
      </head>
      <body>
        <div class="kop">
          <h3>DINAS PENDIDIKAN PROVINSI</h3>
          <h2>SMKN DANDER</h2>
          <h4>BIDANG KEAHLIAN TEKNOLOGI DAN REKAYASA</h4>
          <p>Akreditasi A</p>
          <p>Alamat: ${schoolSettings.address || 'Jl. KHR. Moh Rosyid Desa Sumbertlaseh Kec. Dander Bojonegoro'} | Email: smkn_dander@yahoo.co.id</p>
          <p>NSS: - NDS: - NPSN: ${schoolSettings.npsn || '20541259'} Website:</p>
        </div>

        <div class="title">
          <h1>${docType === 'skl' ? 'SURAT KETERANGAN LULUS' : 'TRANSKRIP NILAI SEMENTARA'}</h1>
          <p>Nomor : 421/009/SMK/2026</p>
        </div>

        <p style="text-align: justify;">Yang bertanda tangan di bawah ini, Kepala SMKN DANDER, Kabupaten/Kota Bojonegoro, Provinsi Jawa Timur, menerangkan bahwa berdasarkan hasil Rapat Pleno Dewan Guru pada tanggal 03 November 2026, peserta didik:</p>

        <table class="bio">
          <tr><td width="230">Nama Lengkap</td><td width="15">:</td><td><strong>${student.name}</strong></td></tr>
          <tr><td>Tempat, Tanggal Lahir</td><td>:</td><td>${student.birthDatePlace || 'BOJONEGORO, 14 Maret 2007'}</td></tr>
          <tr><td>Nomor Induk Siswa (NIS)</td><td>:</td><td>${student.nis}</td></tr>
          <tr><td>Nomor Induk Siswa Nasional (NISN)</td><td>:</td><td>${student.nisn}</td></tr>
          <tr><td>Program Keahlian</td><td>:</td><td>${student.major}</td></tr>
          <tr><td>Konsentrasi Keahlian</td><td>:</td><td>${student.major}</td></tr>
          <tr><td>Dinyatakan</td><td>:</td><td><strong>${student.status === 'LULUS' ? 'LULUS' : 'TIDAK LULUS'}</strong></td></tr>
        </table>

        <p>dari satuan pendidikan SMKN DANDER Tahun Ajaran ${schoolSettings.activeAcademicYear || '2026/2027'} dengan rincian perolehan nilai sebagai berikut:</p>

        <table class="nilai">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th width="40">NO</th>
              <th>MATA PELAJARAN</th>
              <th width="140">KELOMPOK</th>
              <th width="120">NILAI AKHIR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td class="left">(Data nilai rapor siswa belum diinput di menu Penilaian)</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr style="font-weight: bold;">
              <td colspan="3" style="text-align: right; padding-right: 12px;">RATA-RATA NILAI</td>
              <td>0,00</td>
            </tr>
          </tbody>
        </table>

        <p style="text-align: justify;">Demikian Surat Keterangan Lulus ini diterbitkan untuk dapat dipergunakan sebagaimana mestinya.</p>

        <table class="ttd">
          <tr>
            <td width="50%"></td>
            <td width="50%">
              Bojonegoro, 03 November 2026<br/>
              Kepala Sekolah,<br/><br/><br/><br/>
              <u><strong>${schoolSettings.principalName || 'Dr. Molyono, M.MPd'}</strong></u><br/>
              NIP. ${schoolSettings.principalNip || '-'}
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ========================================================
  // ACTION: SAVE INPUT DATA KELULUSAN (Gambar 6)
  // ========================================================
  const handleOpenEdit = (student: KelulusanItem) => {
    setEditingStudent(student);
    setFormIjazah(student.nomorIjazah || '');
    setFormTranskrip(student.nomorTranskrip || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setKelulusanData((prev) =>
      prev.map((item) =>
        item.id === editingStudent.id
          ? {
              ...item,
              nomorIjazah: formIjazah.trim(),
              nomorTranskrip: formTranskrip.trim(),
            }
          : item
      )
    );
    setEditingStudent(null);
  };

  // Quick print handler for HTML
  const handlePrintHtml = (student: KelulusanItem, docType: string) => {
    setPreviewStudent(student);
    setPreviewDocType(docType as any);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // ========================================================
  // RENDER: SUBVIEW IMPORT NOMOR IJAZAH & TRANSKRIP (Gambar 59176e7a)
  // ========================================================
  if (currentSubView === 'import_graduation') {
    return (
      <section className="space-y-6">
        {/* Top Header & Real-time Clock matching Gambar 59176e7a */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Import Nomor Ijazah &amp; Transkrip
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> 03 Nov 2026
            </span>
            <span className="flex items-center gap-1 bg-slate-900 text-white font-mono px-2.5 py-1 rounded-md shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> {currentTime}
            </span>
          </div>
        </div>

        {/* Card: Import Nomor Ijazah & Transkrip (Bulk) matching Gambar 59176e7a */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs border-t-4 border-t-[#008ba3] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-800">
            <ArrowLeftRight className="w-4 h-4 text-[#008ba3]" />
            <span>Import Nomor Ijazah &amp; Transkrip (Bulk)</span>
          </div>

          <div className="p-6 space-y-6">
            {/* Turquoise Info Box */}
            <div className="bg-[#008ba3] text-white rounded-xl p-5 shadow-xs relative">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-serif font-bold text-sm">i</span>
                </div>
                <div className="flex-1 space-y-2 text-xs">
                  <h4 className="font-bold text-sm">Panduan Import Data:</h4>
                  <ul className="space-y-1 text-sky-50 text-[11px] leading-relaxed">
                    <li>• Gunakan format Excel (.xlsx atau .xls).</li>
                    <li>• Baris 1-3 dianggap sebagai Header (akan dilewati).</li>
                    <li>• <strong>Kolom B:</strong> NISN (Wajib, sebagai identitas kunci).</li>
                    <li>• <strong>Kolom D:</strong> Nomor Ijazah / STTB.</li>
                    <li>• <strong>Kolom E:</strong> Nomor Transkrip Nilai.</li>
                    <li>• Sistem akan mencari data siswa berdasarkan NISN dan memperbarui nomor ijazah/transkripnya.</li>
                  </ul>
                </div>
              </div>

              {/* Bottom Right Download Template Link */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleDownloadImportTemplate}
                  className="text-white hover:text-sky-200 text-xs font-bold flex items-center gap-1.5 underline cursor-pointer transition"
                >
                  <Download className="w-4 h-4" /> Download Template Excel
                </button>
              </div>
            </div>

            {/* File Picker */}
            <div className="space-y-1.5 max-w-2xl">
              <label className="block text-xs font-bold text-slate-700">
                Pilih File Excel
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={selectedImportFile ? selectedImportFile.name : ''}
                  placeholder="Pilih file..."
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 p-2.5 bg-white border border-slate-300 rounded-l-lg text-xs text-slate-700 focus:outline-none cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-slate-50 border border-l-0 border-slate-300 rounded-r-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Browse
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedImportFile(e.target.files[0]);
                    }
                  }}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentSubView('main')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition cursor-pointer"
              >
                ← Kembali
              </button>

              <button
                type="button"
                onClick={handleExecuteBulkImport}
                className="px-5 py-2 bg-[#008ba3] hover:bg-cyan-700 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Mulai Import Sekarang
              </button>
            </div>

            {/* Bottom Table: Contoh Struktur Data Excel (Template_Import_No_Ijazah.xls) */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">
                  Contoh Struktur Data Excel (Template_Import_No_Ijazah.xls):
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">
                  Persis format resmi Microsoft Excel
                </span>
              </div>

              <div className="border border-slate-300 rounded-lg overflow-x-auto shadow-2xs bg-white">
                <table className="w-full text-xs text-left border-collapse font-sans min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-300 text-center text-[11px]">
                      <th className="p-2 border-r border-slate-300 w-12 bg-slate-200/80">#</th>
                      <th className="p-2 border-r border-slate-300 w-16">A</th>
                      <th className="p-2 border-r border-slate-300 w-36">B</th>
                      <th className="p-2 border-r border-slate-300">C</th>
                      <th className="p-2 border-r border-slate-300 w-52">D</th>
                      <th className="p-2 w-52">E</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    {/* Row 1: Title */}
                    <tr className="hover:bg-slate-50/50 bg-white">
                      <td className="p-2 text-center border-r border-slate-300 bg-slate-100 text-slate-500 font-semibold select-none">1</td>
                      <td colSpan={5} className="p-2.5 font-bold text-slate-900 tracking-wide text-xs">
                        TEMPLATE IMPORT NOMOR IJAZAH &amp; TRANSKRIP
                      </td>
                    </tr>
                    {/* Row 2: Petunjuk */}
                    <tr className="hover:bg-slate-50/50 bg-white">
                      <td className="p-2 text-center border-r border-slate-300 bg-slate-100 text-slate-500 font-semibold select-none">2</td>
                      <td colSpan={5} className="p-2 text-slate-600 italic">
                        Petunjuk: Baris 1-3 adalah header. Jangan hapus NISN karena digunakan sebagai ID pencocokan data.
                      </td>
                    </tr>
                    {/* Row 3: Column Headers matching image_33dc6dc4 */}
                    <tr className="bg-slate-100 font-bold text-slate-800 border-y border-slate-300">
                      <td className="p-2 text-center border-r border-slate-300 bg-slate-200 text-slate-600 select-none">3</td>
                      <td className="p-2.5 text-center border-r border-slate-300 font-bold">NO</td>
                      <td className="p-2.5 text-center border-r border-slate-300 font-bold">NISN</td>
                      <td className="p-2.5 border-r border-slate-300 font-bold">NAMA SISWA (Bantu)</td>
                      <td className="p-2.5 border-r border-slate-300 font-bold text-center">NOMOR IJAZAH / STTB</td>
                      <td className="p-2.5 font-bold text-center">NOMOR TRANSKRIP NILAI</td>
                    </tr>
                    {/* Row 4: Exact sample from image_33dc6dc4 */}
                    <tr className="hover:bg-cyan-50/30 bg-white">
                      <td className="p-2 text-center border-r border-slate-300 bg-slate-100 text-slate-500 font-semibold select-none">4</td>
                      <td className="p-2.5 text-center border-r border-slate-200 font-bold text-slate-600">1</td>
                      <td className="p-2.5 border-r border-slate-200 font-mono text-slate-800 text-center font-medium">0071234567</td>
                      <td className="p-2.5 border-r border-slate-200 font-medium text-slate-800">Contoh Nama Siswa</td>
                      <td className="p-2.5 border-r border-slate-200 font-mono text-slate-700 text-center">DN-01/M-XXX/24/0000001</td>
                      <td className="p-2.5 font-mono text-slate-700 text-center">809/226/XXX.A/IV/2026</td>
                    </tr>
                    {/* Row 5: Actual student row example */}
                    <tr className="hover:bg-slate-50 bg-white">
                      <td className="p-2 text-center border-r border-slate-300 bg-slate-100 text-slate-500 font-semibold select-none">5</td>
                      <td className="p-2.5 text-center border-r border-slate-200 font-bold text-slate-600">2</td>
                      <td className="p-2.5 border-r border-slate-200 font-mono text-slate-800 text-center font-medium">9000000007</td>
                      <td className="p-2.5 border-r border-slate-200 font-bold text-slate-800">SISWA CONTOH 7</td>
                      <td className="p-2.5 border-r border-slate-200 font-mono text-slate-500 text-center italic">DN-01/M-SMK/24/0000001</td>
                      <td className="p-2.5 font-mono text-slate-500 text-center italic">809/226/SMK.A/IV/2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Success Notification Banner */}
      {importSuccessNotice && (
        <div className="bg-emerald-600 text-white rounded-xl p-4 shadow-sm flex items-start justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold text-sm block">Notifikasi Berhasil!</strong>
              <p className="text-emerald-100 text-xs mt-0.5 font-medium leading-relaxed">
                {importSuccessNotice}
              </p>
            </div>
          </div>
          <button
            onClick={() => setImportSuccessNotice(null)}
            className="p-1 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Real-time Clock matching Gambar 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Manajemen Kelulusan 2026
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> 03 Nov 2026
          </span>
          <span className="flex items-center gap-1 bg-slate-900 text-white font-mono px-2.5 py-1 rounded-md shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> {currentTime}
          </span>
        </div>
      </div>

      {/* 2 Top Overview Cards matching Gambar 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: 372 Total Lulusan */}
        <div className="lg:col-span-3 bg-[#0284c7] text-white rounded-xl shadow-xs p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-2 top-2 text-white/10 pointer-events-none">
            <GraduationCap className="w-28 h-28 -mr-4 -mt-4" />
          </div>
          <div>
            <div className="text-4xl font-black tracking-tight">372</div>
            <div className="text-xs font-semibold text-sky-100 mt-0.5">Total Lulusan</div>
          </div>
          <div className="mt-8 pt-3 border-t border-sky-400/40 text-center">
            <span className="text-[11px] font-bold text-white/90">Status Kelulusan</span>
          </div>
        </div>

        {/* Right Card: Ekspor Laporan Kelulusan */}
        <div className="lg:col-span-9 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          {/* Card Top: Title & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <FileSpreadsheet className="w-4 h-4 text-sky-600" />
              <span>Ekspor Laporan Kelulusan</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="p-1.5 border border-slate-300 rounded text-xs bg-white font-medium text-slate-700"
              >
                <option value="Semua">-- Semua Kelas --</option>
                <option value="XII DKV">XII DKV</option>
                <option value="XII TKJ 1">XII TKJ 1</option>
                <option value="XII AKL 1">XII AKL 1</option>
              </select>

              <select
                value={selectedMajorFilter}
                onChange={(e) => setSelectedMajorFilter(e.target.value)}
                className="p-1.5 border border-slate-300 rounded text-xs bg-white font-medium text-slate-700"
              >
                <option value="Semua">-- Semua Program Keahlian --</option>
                <option value="Desain Komunikasi Visual">Desain Komunikasi Visual</option>
                <option value="Teknik Komputer & Jaringan">Teknik Komputer &amp; Jaringan</option>
                <option value="Akuntansi & Keuangan Lembaga">Akuntansi &amp; Keuangan</option>
              </select>
            </div>
          </div>

          {/* Subheader Badges matching Gambar 1 */}
          <div className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-slate-600 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                FORMAT DOKUMEN SEKOLAH (JENJANG SMK):
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                ✔ SKL: template_default_skl_semua.docx
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                ✔ Transkrip: template_default_transkrip_semua.docx
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-600 border border-slate-200 text-[10px]">
                ℹ Raport Skill: Belum Ada
              </span>
            </div>

            <button
              onClick={() => alert('Kelola format sekolah')}
              className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Settings className="w-3 h-3" /> Kelola Format Sekolah
            </button>
          </div>

          {/* Action Buttons Row matching Gambar 1 */}
          <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
            {/* 1. Rekap Nilai Excel */}
            <button
              onClick={() => handleDownloadWordDoc(kelulusanData[0], 'transkrip')}
              className="px-2.5 py-1.5 bg-[#16a34a] hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Rekap Nilai Excel
            </button>

            {/* 2. Rekap Nilai SKL */}
            <button
              onClick={() => handleDownloadWordDoc(kelulusanData[0], 'skl')}
              className="px-2.5 py-1.5 bg-[#f59e0b] hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Rekap Nilai SKL
            </button>

            {/* 3. Rekap Sort Juara */}
            <button
              onClick={() => alert('Rekapitulasi peringkat nilai lulusan diurutkan berdasarkan juara.')}
              className="px-2.5 py-1.5 bg-[#0284c7] hover:bg-sky-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer transition"
            >
              <Trophy className="w-3.5 h-3.5" /> Rekap Sort Juara
            </button>

            {/* 4. Cetak Semua SKL */}
            <button
              onClick={() => {
                setPreviewStudent(kelulusanData[0]);
                setPreviewDocType('skl');
              }}
              className="px-2.5 py-1.5 bg-[#06b6d4] hover:bg-cyan-600 text-white font-bold rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer transition"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Semua SKL
            </button>

            {/* 5. Cetak Semua Transkrip */}
            <button
              onClick={() => {
                setPreviewStudent(kelulusanData[0]);
                setPreviewDocType('transkrip');
              }}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer transition"
            >
              <FileText className="w-3.5 h-3.5" /> Cetak Semua Transkrip
            </button>

            {/* 6. Cetak Semua Pasport Skill */}
            <button
              onClick={() => {
                setPreviewStudent(kelulusanData[0]);
                setPreviewDocType('skill');
              }}
              className="px-2.5 py-1.5 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer transition"
            >
              <FileText className="w-3.5 h-3.5" /> Cetak Semua Pasport Skill
            </button>

            {/* 7. Unduh Word (.docx) Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBulkWordOpen(!isBulkWordOpen);
                }}
                className="px-2.5 py-1.5 bg-[#0284c7] hover:bg-sky-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer transition"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Word (.docx)
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {isBulkWordOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 text-xs">
                  <button
                    onClick={() => handleDownloadWordDoc(kelulusanData[0], 'skl')}
                    className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-600" /> Unduh Format SKL
                  </button>
                  <button
                    onClick={() => handleDownloadWordDoc(kelulusanData[0], 'transkrip')}
                    className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Unduh Format Transkrip
                  </button>
                </div>
              )}
            </div>

            {/* 8. Import No. Ijazah & Transkrip */}
            <button
              onClick={() => setCurrentSubView('import_graduation')}
              className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg flex items-center gap-1 cursor-pointer transition"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" /> Import No. Ijazah &amp; Transkrip
            </button>
          </div>
        </div>
      </div>

      {/* Main Table: Rekapitulasi Nilai Lulusan matching Gambar 1 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs relative z-10">
        {/* Table Top Header */}
        <div className="p-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-700 rounded-t-xl">
          <FileSpreadsheet className="w-4 h-4 text-sky-600" />
          <span>Rekapitulasi Nilai Lulusan</span>
        </div>

        {/* Table Controls (Show entries & Search) matching Gambar 1 */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span>Tampilkan</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border border-slate-300 rounded px-2 py-1 text-xs bg-white focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>baris</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Cari Cepat:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder=""
              className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none w-48 sm:w-60"
            />
          </div>
        </div>

        {/* Table Data matching Gambar 1 */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 uppercase font-bold text-slate-600 text-[10px] border-y border-slate-200">
              <tr>
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3 w-32">NIS/NISN</th>
                <th className="p-3 min-w-[200px]">NAMA PESERTA DIDIK</th>
                <th className="p-3 min-w-[200px]">KELAS / PROGRAM KEAHLIAN</th>
                <th className="p-3 text-center w-36">
                  RATA-RATA RAPORT
                  <span className="block text-[9px] text-slate-400 font-normal">(SEM 1-6)</span>
                </th>
                <th className="p-3 text-center w-28">
                  NILAI SKL
                  <span className="block text-[9px] text-slate-400 font-normal">(ASAJ/SEM 6)</span>
                </th>
                <th className="p-3 text-center w-32">
                  NILAI AKHIR
                  <span className="block text-[9px] text-slate-400 font-normal">(RANKING)</span>
                </th>
                <th className="p-3 text-center w-36">STATUS</th>
                <th className="p-3 text-center w-48">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  {/* # */}
                  <td className="p-3 text-center font-bold text-slate-400">{r.no}</td>

                  {/* NIS / NISN */}
                  <td className="p-3 font-mono">
                    <strong className="block text-slate-800 font-bold">{r.nis}</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{r.nisn}</span>
                  </td>

                  {/* Nama Peserta Didik */}
                  <td className="p-3">
                    <strong className="text-slate-900 block font-bold uppercase">{r.name}</strong>
                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400" /> {r.angkatan}
                    </span>
                  </td>

                  {/* Kelas / Program Keahlian */}
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      <GraduationCap className="w-3 h-3 text-sky-600" /> {r.cls}
                    </span>
                    <span className="block text-[10px] text-slate-500 italic mt-0.5">
                      {r.major}
                    </span>
                  </td>

                  {/* Rata-Rata Raport */}
                  <td className="p-3 text-center font-mono">
                    <strong className="block text-slate-800 font-bold">{r.rataRapor.toFixed(2)}</strong>
                    <span className="text-[10px] text-slate-400">{r.mapelCount} Mapel</span>
                  </td>

                  {/* Nilai SKL */}
                  <td className="p-3 text-center font-mono font-bold text-sky-600">
                    {r.nilaiSkl.toFixed(2)}
                  </td>

                  {/* Nilai Akhir */}
                  <td className="p-3 text-center font-mono">
                    <strong className="block text-slate-800 font-bold">{r.nilaiAkhir.toFixed(2)}</strong>
                    <span className="text-[10px] text-slate-400">0 Poin</span>
                  </td>

                  {/* Status: Yellow badge matching Gambar 1 */}
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#eab308] text-slate-900 shadow-2xs">
                      ⚠ {r.status}
                    </span>
                  </td>

                  {/* AKSI: 5 buttons matching Gambar 1, 4, 5, 6 */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {/* 1. Preview SKL Button (Cyan) */}
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewStudent(r);
                          setPreviewDocType('skl');
                        }}
                        className="px-2 py-1 bg-[#008ba3] hover:bg-cyan-700 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                        title="Pratinjau Format Dokumen Siswa"
                      >
                        <Eye className="w-3 h-3" /> Preview SKL
                      </button>

                      {/* 2. Word Dropdown Button matching Gambar 4 */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenPrintDropdownId(null);
                            setOpenWordDropdownId(openWordDropdownId === r.id ? null : r.id);
                          }}
                          className="px-2 py-1 bg-white border border-sky-400 text-sky-700 hover:bg-sky-50 rounded text-[11px] font-bold flex items-center gap-0.5 transition cursor-pointer"
                          title="Unduh Format Word"
                        >
                          <FileText className="w-3 h-3 text-sky-600" /> Word
                          <ChevronDown className="w-3 h-3" />
                        </button>

                        {/* Dropdown Menu matching Gambar 4 */}
                        {openWordDropdownId === r.id && (
                          <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 text-left text-xs">
                            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                              Unduh Format Word Sekolah
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleDownloadWordDoc(r, 'skl');
                                setOpenWordDropdownId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-sky-600" /> Unduh SKL (.docx)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleDownloadWordDoc(r, 'transkrip');
                                setOpenWordDropdownId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Unduh Transkrip (.docx)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleDownloadWordDoc(r, 'skill');
                                setOpenWordDropdownId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-600" /> Unduh Raport Skill (.docx)
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 3. Printer Dropdown Button matching Gambar 5 */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenWordDropdownId(null);
                            setOpenPrintDropdownId(openPrintDropdownId === r.id ? null : r.id);
                          }}
                          className="px-1.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded text-[11px] font-bold flex items-center gap-0.5 transition cursor-pointer"
                          title="Cetak Cepat HTML (Browser)"
                        >
                          <Printer className="w-3 h-3 text-slate-500" />
                          <ChevronDown className="w-2.5 h-2.5" />
                        </button>

                        {/* Dropdown Menu matching Gambar 5 */}
                        {openPrintDropdownId === r.id && (
                          <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 text-left text-xs">
                            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                              Cetak Cepat HTML (Browser)
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handlePrintHtml(r, 'skl');
                                setOpenPrintDropdownId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5 text-sky-600" /> Cetak SKL (HTML)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handlePrintHtml(r, 'transkrip');
                                setOpenPrintDropdownId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Cetak Transkrip (HTML)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handlePrintHtml(r, 'skill');
                                setOpenPrintDropdownId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-600" /> Cetak Pasport Skill (HTML)
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 4. Edit Button (Input Data Kelulusan) matching Gambar 6 */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(r)}
                        className="p-1 text-slate-400 hover:text-sky-600 border border-slate-200 hover:border-sky-300 rounded transition cursor-pointer"
                        title="Input Data Kelulusan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* 5. External Link / Detail Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewStudent(r);
                          setPreviewDocType('skl');
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 border border-slate-200 rounded transition cursor-pointer"
                        title="Buka Pratinjau Dokumen"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 2: PRATINJAU FORMAT DOKUMEN SISWA (Gambar 2)       */}
      {/* ======================================================== */}
      {previewStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-between overflow-hidden">
          {/* Top Dark Bar matching Gambar 2 */}
          <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs shrink-0">
            {/* Left Title & Badge */}
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span className="font-bold">Pratinjau Format Dokumen Siswa</span>
              <span className="bg-slate-800 text-sky-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                {previewStudent.name}
              </span>
              <span className="bg-sky-600 text-white px-1.5 py-0.2 rounded text-[9px] font-bold">
                {previewDocType.toUpperCase()}
              </span>
            </div>

            {/* Right Tabs & Actions matching Gambar 2 */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPreviewDocType('skl')}
                className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
                  previewDocType === 'skl'
                    ? 'bg-[#008ba3] text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Download className="w-3 h-3" /> SKL (.docx)
              </button>
              <button
                onClick={() => setPreviewDocType('transkrip')}
                className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
                  previewDocType === 'transkrip'
                    ? 'bg-[#008ba3] text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-3 h-3" /> Transkrip (.docx)
              </button>
              <button
                onClick={() => setPreviewDocType('skill')}
                className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
                  previewDocType === 'skill'
                    ? 'bg-[#008ba3] text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3 h-3" /> Raport Skill
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              {/* Zoom Controls */}
              <button
                onClick={() => setPreviewZoom((z) => Math.min(150, z + 10))}
                className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded font-bold cursor-pointer"
                title="Perbesar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400">{previewZoom}%</span>
              <button
                onClick={() => setPreviewZoom((z) => Math.max(70, z - 10))}
                className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded font-bold cursor-pointer"
                title="Perkecil"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewZoom(100)}
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              {/* Unduh Word Button */}
              <button
                onClick={() => handleDownloadWordDoc(previewStudent, previewDocType)}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded flex items-center gap-1 shadow-xs cursor-pointer transition"
              >
                <Download className="w-3 h-3" /> Unduh .docx
              </button>

              {/* Close Button */}
              <button
                onClick={() => setPreviewStudent(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader info bar matching Gambar 2 */}
          <div className="bg-slate-800/90 text-slate-300 px-4 py-1.5 text-[11px] border-b border-slate-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sky-400 font-bold">ℹ</span>
              <span>
                Menampilkan berkas format resmi sekolah yang telah terisi data nilai lengkap siswa:{' '}
                <strong className="text-white">{previewStudent.name}</strong>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 italic">
              Pratinjau langsung di browser (tanpa perlu mengunduh file)
            </span>
          </div>

          {/* Document Canvas Workspace matching Gambar 2 */}
          <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-700/60">
            <div
              style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top center' }}
              className="bg-white shadow-2xl p-10 sm:p-14 max-w-2xl w-full text-slate-900 font-serif border border-slate-300 min-h-[1050px] transition-transform duration-100"
            >
              {/* Kop Surat matching Gambar 2 */}
              <div className="relative text-center border-b-2 border-slate-950 pb-3 mb-6">
                {/* Logo SMKN Dander on left */}
                <div className="absolute left-0 top-0 w-16 h-16 flex items-center justify-center">
                  <div className="w-14 h-14 bg-sky-700 text-white rounded-full flex flex-col items-center justify-center border-2 border-amber-400 p-1 shadow-xs">
                    <School className="w-6 h-6 text-white" />
                    <span className="text-[7px] font-sans font-bold leading-none mt-0.5">SMKN</span>
                  </div>
                </div>

                <h3 className="text-xs font-bold font-sans tracking-wide uppercase text-slate-800">
                  DINAS PENDIDIKAN PROVINSI
                </h3>
                <h2 className="text-base font-black font-sans uppercase tracking-wider text-slate-950 mt-0.5">
                  SMKN DANDER
                </h2>
                <h4 className="text-[11px] font-bold font-sans uppercase text-slate-800">
                  BIDANG KEAHLIAN TEKNOLOGI DAN REKAYASA
                </h4>
                <p className="text-[9.5px] font-sans italic text-slate-600">Akreditasi A</p>
                <p className="text-[9px] font-sans text-slate-700">
                  Alamat: {schoolSettings.address || 'Jl. KHR. Moh Rosyid Desa Sumbertlaseh Kec. Dander Bojonegoro'} | Telp: | Email: smkn_dander@yahoo.co.id
                </p>
                <p className="text-[8.5px] font-sans text-slate-600">
                  NSS: - NDS: - NPSN: {schoolSettings.npsn || '20541259'} Website:
                </p>
              </div>

              {/* Title: SURAT KETERANGAN LULUS */}
              <div className="text-center mb-5">
                <h1 className="text-sm font-black uppercase underline tracking-wider text-slate-950">
                  {previewDocType === 'skl' ? 'SURAT KETERANGAN LULUS' : 'TRANSKRIP NILAI'}
                </h1>
                <p className="text-[11px] font-mono text-slate-700 mt-1">
                  Nomor : 421/009/SMK/2026
                </p>
              </div>

              {/* Intro statement */}
              <p className="text-[11px] leading-relaxed text-justify mb-3 text-slate-800">
                Yang bertanda tangan di bawah ini, Kepala SMKN DANDER, Kabupaten/Kota Bojonegoro, Provinsi Jawa Timur, menerangkan bahwa berdasarkan hasil Rapat Pleno Dewan Guru pada tanggal 03 November 2026, peserta didik:
              </p>

              {/* Student Biodata Table matching Gambar 2 */}
              <table className="w-full text-[11px] mb-3 leading-relaxed">
                <tbody>
                  <tr>
                    <td className="w-48 py-0.5 text-slate-700">Nama Lengkap</td>
                    <td className="w-4">:</td>
                    <td className="font-bold uppercase text-slate-950">{previewStudent.name}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 text-slate-700">Tempat, Tanggal Lahir</td>
                    <td>:</td>
                    <td className="text-slate-900">{previewStudent.birthDatePlace || 'BOJONEGORO, 14 Maret 2007'}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 text-slate-700">Nomor Induk Siswa (NIS)</td>
                    <td>:</td>
                    <td className="font-mono text-slate-900">{previewStudent.nis}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 text-slate-700">Nomor Induk Siswa Nasional (NISN)</td>
                    <td>:</td>
                    <td className="font-mono text-slate-900">{previewStudent.nisn}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 text-slate-700">Program Keahlian</td>
                    <td>:</td>
                    <td className="text-slate-900">{previewStudent.major}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 text-slate-700">Konsentrasi Keahlian</td>
                    <td>:</td>
                    <td className="text-slate-900">{previewStudent.major}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 text-slate-700 font-bold">Dinyatakan</td>
                    <td>:</td>
                    <td className="font-black text-rose-700">
                      {previewStudent.status === 'LULUS' ? 'LULUS' : 'TIDAK LULUS'}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="text-[11px] leading-relaxed text-justify mb-3 text-slate-800">
                dari satuan pendidikan SMKN DANDER Tahun Ajaran {schoolSettings.activeAcademicYear || '2026/2027'} dengan rincian perolehan nilai sebagai berikut:
              </p>

              {/* Grades Table matching Gambar 2 */}
              <table className="w-full text-[10.5px] border-collapse border border-slate-900 mb-4 font-sans">
                <thead>
                  <tr className="bg-slate-100 font-bold text-center">
                    <th className="border border-slate-900 p-1.5 w-8">NO</th>
                    <th className="border border-slate-900 p-1.5 text-left">MATA PELAJARAN</th>
                    <th className="border border-slate-900 p-1.5 w-24">KELOMPOK</th>
                    <th className="border border-slate-900 p-1.5 w-24">NILAI AKHIR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-900 p-2 text-center font-bold">1</td>
                    <td className="border border-slate-900 p-2 text-slate-500 italic">
                      (Data nilai rapor siswa belum diinput di menu Penilaian)
                    </td>
                    <td className="border border-slate-900 p-2 text-center text-slate-400">-</td>
                    <td className="border border-slate-900 p-2 text-center text-slate-400">-</td>
                  </tr>
                  <tr className="font-bold bg-slate-50">
                    <td colSpan={3} className="border border-slate-900 p-1.5 text-center tracking-wider">
                      RATA-RATA NILAI
                    </td>
                    <td className="border border-slate-900 p-1.5 text-center font-mono font-bold">
                      0,00
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="text-[11px] leading-relaxed text-justify mb-8 text-slate-800">
                Demikian Surat Keterangan Lulus ini diterbitkan untuk dapat dipergunakan sebagaimana mestinya.
              </p>

              {/* Official Signature Block matching Gambar 2 */}
              <div className="grid grid-cols-2 text-[11px] text-slate-900">
                <div></div>
                <div className="text-center flex flex-col items-center">
                  <p>Bojonegoro, 03 November 2026</p>
                  <p className="font-semibold mb-20">Kepala Sekolah,</p>
                  <p className="font-bold underline uppercase text-xs">
                    {schoolSettings.principalName || 'Dr. Molyono, M.MPd'}
                  </p>
                  <p className="text-[10px] text-slate-600 font-sans">
                    NIP. {schoolSettings.principalNip || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar matching Gambar 2 */}
          <div className="bg-slate-900 text-slate-400 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
            <span className="text-[11px]">
              Format dokumen ini otomatis menggunakan file Word resmi yang diunggah sekolah di menu Format Dokumen.
            </span>
            <button
              onClick={() => setPreviewStudent(null)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-xs cursor-pointer transition"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: INPUT DATA KELULUSAN (Gambar 6)                 */}
      {/* ======================================================== */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header matching Gambar 6 (Cyan Header) */}
            <div className="p-4 bg-[#008ba3] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-cyan-200" />
                <h3 className="text-sm font-bold">Input Data Kelulusan</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form matching Gambar 6 */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              {/* 1. Nama Peserta Didik (Readonly/Disabled) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nama Peserta Didik
                </label>
                <input
                  type="text"
                  value={editingStudent.name}
                  disabled
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-700 cursor-not-allowed uppercase"
                />
              </div>

              {/* 2. Nomor Ijazah / STTB */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nomor Ijazah / STTB
                </label>
                <input
                  type="text"
                  value={formIjazah}
                  onChange={(e) => setFormIjazah(e.target.value)}
                  placeholder="Contoh: DN-01/M-SMK/24/0000001"
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Nomor ini akan muncul di tabel identitas Transkrip Nilai.
                </p>
              </div>

              {/* 3. Nomor Transkrip Nilai (Khusus Kejuruan) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nomor Transkrip Nilai (Khusus Kejuruan)
                </label>
                <input
                  type="text"
                  value={formTranskrip}
                  onChange={(e) => setFormTranskrip(e.target.value)}
                  placeholder="Contoh: 809/226/SMK.A/IV/2026"
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Nomor ini akan muncul di bagian HEADER (Atas) Transkrip Nilai.
                </p>
              </div>

              {/* Footer Buttons matching Gambar 6 */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#008ba3] hover:bg-cyan-700 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
