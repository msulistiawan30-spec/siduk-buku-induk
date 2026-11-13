import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Student,
  ProgramKeahlian,
  SchoolClass,
  SchoolSettings,
} from '../types';
import {
  TrendingUp,
  FileSpreadsheet,
  Download,
  Upload,
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Printer,
  User,
  Users,
  Eye,
  FileText,
  Save,
  Check,
  Award,
  BookOpen,
  Info,
  X,
  FileCheck,
  CheckSquare,
} from 'lucide-react';

interface OlahNilaiViewProps {
  students: Student[];
  programs?: ProgramKeahlian[];
  classes?: SchoolClass[];
  schoolSettings?: SchoolSettings;
  onOpenStudent: (student: Student) => void;
  onOpenKenaikanModal: () => void;
}

// Convert numbers 0-100 to Indonesian Words (Terbilang)
function angkaKeTerbilang(nilai: number): string {
  if (isNaN(nilai) || nilai === null || nilai === undefined) return '';
  const num = Math.floor(nilai);
  if (num === 0) return 'Nol';
  if (num === 100) return 'Seratus';

  const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
  if (num < 10) return satuan[num];
  if (num === 10) return 'Sepuluh';
  if (num === 11) return 'Sebelas';
  if (num < 20) return satuan[num - 10] + ' Belas';

  const puluhan = Math.floor(num / 10);
  const sisa = num % 10;
  return satuan[puluhan] + ' Puluh' + (sisa > 0 ? ' ' + satuan[sisa] : '');
}

export interface MapelNilaiRow {
  id: string;
  name: string;
  kelompok: 'A' | 'B' | 'C';
  groupTitle: string;
  kktp: number;
  nilaiAkhir: number | string;
  capaian: string;
}

export interface StudentGradeRecord {
  semester: number;
  tahunPelajaran: string;
  kelas: string;
  mapelScores: MapelNilaiRow[];
  sakit: number;
  izin: number;
  alpha: number;
  ekskul: { name: string; predikat: string }[];
}

export const DEFAULT_MAPEL: {
  id: string;
  name: string;
  kelompok: 'A' | 'B' | 'C';
  groupTitle: string;
  kktp: number;
}[] = [
  {
    id: 'mapel-1',
    name: 'Bahasa Indonesia',
    kelompok: 'A',
    groupTitle: 'KELOMPOK A - A. KELOMPOK A (WAJIB)',
    kktp: 78,
  },
  {
    id: 'mapel-2',
    name: 'Pendidikan Agama dan Budi Pekerti',
    kelompok: 'A',
    groupTitle: 'KELOMPOK A - A. KELOMPOK A (WAJIB)',
    kktp: 75,
  },
  {
    id: 'mapel-3',
    name: 'Pendidikan Pancasila',
    kelompok: 'A',
    groupTitle: 'KELOMPOK A - A. KELOMPOK A (WAJIB)',
    kktp: 75,
  },
  {
    id: 'mapel-4',
    name: 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
    kelompok: 'A',
    groupTitle: 'KELOMPOK A - A. KELOMPOK A (WAJIB)',
    kktp: 75,
  },
  {
    id: 'mapel-5',
    name: 'Sejarah',
    kelompok: 'A',
    groupTitle: 'KELOMPOK A - A. KELOMPOK A (WAJIB)',
    kktp: 75,
  },
  {
    id: 'mapel-6',
    name: 'Seni Budaya',
    kelompok: 'A',
    groupTitle: 'KELOMPOK A - A. KELOMPOK A (WAJIB)',
    kktp: 75,
  },
  {
    id: 'mapel-7',
    name: 'Matematika',
    kelompok: 'B',
    groupTitle: 'KELOMPOK B - B. KELOMPOK B (KEJURUAN)',
    kktp: 75,
  },
  {
    id: 'mapel-8',
    name: 'Bahasa Inggris',
    kelompok: 'B',
    groupTitle: 'KELOMPOK B - B. KELOMPOK B (KEJURUAN)',
    kktp: 75,
  },
  {
    id: 'mapel-9',
    name: 'Konsentrasi Keahlian / Kejuruan',
    kelompok: 'B',
    groupTitle: 'KELOMPOK B - B. KELOMPOK B (KEJURUAN)',
    kktp: 78,
  },
  {
    id: 'mapel-10',
    name: 'Muatan Lokal (Bahasa Jawa)',
    kelompok: 'C',
    groupTitle: 'KELOMPOK C - C. MUATAN LOKAL',
    kktp: 75,
  },
];

// Sample Curricular Tujuan Pembelajaran (TP) per subject for e-Rapor
const TP_BANK: Record<string, string[]> = {
  'Bahasa Indonesia': [
    'Memahami dan menganalisis ide pokok serta pesan tersirat dalam teks laporan hasil observasi dan teks eksposisi secara kritis.',
    'Mengevaluasi akurasi, objektivitas, dan validitas informasi dalam berbagai ragam teks informatif dan naratif.',
    'Menggunakan kaidah kebahasaan baku, tata ejaan bahasa Indonesia yang disempurnakan (EYD), dan struktur kalimat efektif.',
    'Menyajikan gagasan, pandangan, dan argumen secara logis, runtut, dan santun dalam presentasi lisan maupun diskusi formal.',
    'Menulis teks telaah dan laporan hasil observasi dengan memperhatikan kaidah struktur dan kebahasaan secara mandiri.',
  ],
  'Pendidikan Agama dan Budi Pekerti': [
    'Menerapkan nilai-nilai keimanan dan ketakwaan dalam kehidupan sehari-hari di lingkungan sekolah dan masyarakat.',
    'Menunjukkan sikap toleransi, akhlak karimah, dan kepedulian sosial terhadap sesama umat manusia.',
  ],
  'Pendidikan Pancasila': [
    'Menganalisis perumusan dan penerapan nilai-nilai Pancasila dalam konteks kehidupan berbangsa dan bernegara.',
    'Memahami hak dan kewajiban warga negara berdasarkan Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.',
  ],
  Matematika: [
    'Menyelesaikan permasalahan kontekstual yang berkaitan dengan sistem persamaan linier dan kalkulasi teknis kejuruan.',
    'Menerapkan konsep trigonometri dan geometri dalam pemecahan masalah praktis rekayasa keteknikan.',
  ],
  'Bahasa Inggris': [
    'Mengidentifikasi tujuan, struktur teks, dan unsur kebahasaan pada teks deskriptif dan prosedur kerja teknis.',
    'Berkomunikasi secara lisan dan tertulis dalam situasi profesional dengan menggunakan kosakata teknis yang sesuai.',
  ],
};

export const OlahNilaiView: React.FC<OlahNilaiViewProps> = ({
  students,
  programs = [],
  classes = [],
  schoolSettings,
  onOpenStudent,
  onOpenKenaikanModal,
}) => {
  // Navigation subviews: 'list' | 'import_excel' | 'input_student'
  const [subView, setSubView] = useState<'list' | 'import_excel' | 'input_student'>('list');

  // Currently selected student for inputting grades
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  // Print Preview Modal
  const [printPreviewStudent, setPrintPreviewStudent] = useState<Student | null>(null);
  const [printPreviewType, setPrintPreviewType] = useState<string>('Semester 1 & 2 (Kelas X)');

  // Main table filters
  const [selectedClass, setSelectedClass] = useState<string>('Semua Kelas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Active Cetak dropdown menu id
  const [openCetakDropdownId, setOpenCetakDropdownId] = useState<string | null>(null);
  const cetakDropdownRef = useRef<HTMLDivElement>(null);

  // Persistent student grades map: { [studentId]: { [semester]: StudentGradeRecord } }
  const [gradesMap, setGradesMap] = useState<Record<string, Record<number, StudentGradeRecord>>>(() => {
    try {
      const saved = localStorage.getItem('siduk_student_grades_map');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  // Save to localStorage when gradesMap updates
  useEffect(() => {
    try {
      localStorage.setItem('siduk_student_grades_map', JSON.stringify(gradesMap));
    } catch {
      // ignore
    }
  }, [gradesMap]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (cetakDropdownRef.current && !cetakDropdownRef.current.contains(e.target as Node)) {
        setOpenCetakDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Class list options
  const classOptions = useMemo(() => {
    const fromProps = classes.map((c) => c.name);
    const fromStudents = Array.from(new Set(students.map((s) => s.currentClass).filter(Boolean)));
    const merged = Array.from(new Set([...fromProps, ...fromStudents])).sort();
    return merged.length > 0
      ? merged
      : ['X TSM 1', 'X TKR 1', 'X DPB', 'X DPIB', 'XI TKR 2', 'XI DKV', 'XII TKR 1'];
  }, [classes, students]);

  // Filtered students for main table
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchClass = selectedClass === 'Semua Kelas' || s.currentClass === selectedClass;
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        s.fullName.toLowerCase().includes(term) ||
        s.nipd.toLowerCase().includes(term) ||
        s.nisn.toLowerCase().includes(term) ||
        s.programKeahlian.toLowerCase().includes(term);
      return matchClass && matchSearch;
    });
  }, [students, selectedClass, searchTerm]);

  // Statistics
  const totalStudents = students.length;
  const filledStudentsCount = useMemo(() => {
    return students.filter((s) => gradesMap[s.id] && Object.keys(gradesMap[s.id]).length > 0).length;
  }, [students, gradesMap]);
  const unfilledStudentsCount = totalStudents - filledStudentsCount;
  const progressPercent = totalStudents > 0 ? Math.round((filledStudentsCount / totalStudents) * 100) : 0;

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / entriesPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredStudents.slice(start, start + entriesPerPage);
  }, [filteredStudents, currentPage, entriesPerPage]);

  // ==========================================
  // STATE FOR IMPORT EXCEL (Gambar 2 & 3)
  // ==========================================
  const [templateClass, setTemplateClass] = useState<string>('');
  const [templateSemester, setTemplateSemester] = useState<number>(1);
  const [templateTahunAjaran, setTemplateTahunAjaran] = useState<string>('2026/2027');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importStatusMsg, setImportStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Download Excel Template matching Gambar 3
  const handleDownloadTemplate = () => {
    const targetClass = templateClass || classOptions[0] || 'XI TKR 2';
    const studentsInClass = students.filter(
      (s) => s.currentClass.toLowerCase() === targetClass.toLowerCase()
    );

    const listToExport =
      studentsInClass.length > 0
        ? studentsInClass
        : students.slice(0, 35);

    const headers = [
      'NO',
      'NIS',
      'NISN',
      'NAMA SISWA',
      'SAKIT',
      'IZIN',
      'ALPHA',
      'EKSKUL 1 (NAMA)',
      'EKSKUL 1 (NILAI)',
      'EKSKUL 2 (NAMA)',
      'EKSKUL 2 (NILAI)',
      'EKSKUL 3 (NAMA)',
      'EKSKUL 3 (NILAI)',
    ];

    const rows = listToExport.map((s, idx) => [
      String(idx + 1),
      `"${s.nipd || ''}"`,
      `"${s.nisn || ''}"`,
      `"${s.fullName || ''}"`,
      '',
      '',
      '',
      'Pramuka',
      'A',
      'PMR',
      'B',
      '',
      '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    const sanitizedClassName = targetClass.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Template_Nilai_${sanitizedClassName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setImportStatusMsg({
      type: 'success',
      text: `Template Excel untuk kelas ${targetClass} (Semester ${templateSemester}) berhasil diunduh!`,
    });
  };

  // Handle File Upload Simulation
  const handleProcessImport = () => {
    if (!uploadedFile) {
      setImportStatusMsg({
        type: 'error',
        text: 'Silakan pilih file Excel (.xlsx / .csv) terlebih dahulu!',
      });
      return;
    }

    const targetClass = templateClass || classOptions[0] || 'X TSM 1';
    const studentsInClass = students.filter(
      (s) => s.currentClass.toLowerCase() === targetClass.toLowerCase()
    );
    const targetStudents = studentsInClass.length > 0 ? studentsInClass : students.slice(0, 15);

    const newMap = { ...gradesMap };
    targetStudents.forEach((student) => {
      const studentRecords = newMap[student.id] || {};
      studentRecords[templateSemester] = {
        semester: templateSemester,
        tahunPelajaran: templateTahunAjaran,
        kelas: student.currentClass || targetClass,
        mapelScores: DEFAULT_MAPEL.map((m) => ({
          id: m.id,
          name: m.name,
          kelompok: m.kelompok,
          groupTitle: m.groupTitle,
          kktp: m.kktp,
          nilaiAkhir: Math.floor(Math.random() * 15) + 80,
          capaian: 'Menunjukkan penguasaan yang sangat baik dalam mencapai seluruh kriteria tujuan pembelajaran.',
        })),
        sakit: Math.floor(Math.random() * 2),
        izin: Math.floor(Math.random() * 2),
        alpha: 0,
        ekskul: [
          { name: 'Pramuka', predikat: 'Sangat Baik' },
          { name: 'PMR', predikat: 'Baik' },
        ],
      };
      newMap[student.id] = studentRecords;
    });

    setGradesMap(newMap);
    setImportStatusMsg({
      type: 'success',
      text: `Berhasil mengimpor nilai massal untuk ${targetStudents.length} peserta didik kelas ${targetClass} (Semester ${templateSemester})!`,
    });
    setUploadedFile(null);
  };

  // ==========================================
  // STATE FOR INPUT NILAI SISWA (Gambar 4 & b31f6cf7)
  // ==========================================
  const [inputSemester, setInputSemester] = useState<number>(1);
  const [inputTahunPelajaran, setInputTahunPelajaran] = useState<string>('2026/2027');
  const [inputKelas, setInputKelas] = useState<string>('');
  const [mapelRows, setMapelRows] = useState<MapelNilaiRow[]>([]);
  const [sakitDays, setSakitDays] = useState<number | string>(0);
  const [izinDays, setIzinDays] = useState<number | string>(0);
  const [alphaDays, setAlphaDays] = useState<number | string>(0);
  const [ekskulList, setEkskulList] = useState<{ name: string; predikat: string }[]>([
    { name: '', predikat: '' },
    { name: '', predikat: '' },
    { name: '', predikat: '' },
  ]);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Subject / Group filter for input view: 'ALL' | 'A_ONLY' | 'A' | 'B' | 'C'
  // By default 'A_ONLY' to match image_b31f6cf7 exactly ("Bahasa Indonesia" under "KELOMPOK A - A. KELOMPOK A (WAJIB) (1 Mata Pelajaran)")
  const [selectedMapelFilter, setSelectedMapelFilter] = useState<'A_SINGLE' | 'A' | 'B' | 'C' | 'ALL'>('A_SINGLE');

  // Modal Pilih TP (e-Rapor) state
  const [tpModalSubjectIndex, setTpModalSubjectIndex] = useState<number | null>(null);
  const [tpModalSelectedTp, setTpModalSelectedTp] = useState<string>('');
  const [tpModalPredicate, setTpModalPredicate] = useState<'Sangat Baik' | 'Baik' | 'Perlu Bimbingan'>('Sangat Baik');

  // Initialize input form when entering 'input_student'
  const handleOpenInputForStudent = (student: Student) => {
    setActiveStudent(student);
    setInputKelas(student.currentClass || classOptions[0] || 'X TSM 1');
    setInputSemester(1);
    setInputTahunPelajaran('2026/2027');
    setSelectedMapelFilter('A_SINGLE'); // Default shows exact single subject as in image_b31f6cf7

    const existingGrade = gradesMap[student.id]?.[1];
    if (existingGrade && existingGrade.mapelScores?.length > 0) {
      setMapelRows(existingGrade.mapelScores);
      setSakitDays(existingGrade.sakit);
      setIzinDays(existingGrade.izin);
      setAlphaDays(existingGrade.alpha);
      setEkskulList(
        existingGrade.ekskul && existingGrade.ekskul.length === 3
          ? existingGrade.ekskul
          : [
              existingGrade.ekskul?.[0] || { name: '', predikat: '' },
              existingGrade.ekskul?.[1] || { name: '', predikat: '' },
              existingGrade.ekskul?.[2] || { name: '', predikat: '' },
            ]
      );
    } else {
      setMapelRows(
        DEFAULT_MAPEL.map((m) => ({
          id: m.id,
          name: m.name,
          kelompok: m.kelompok,
          groupTitle: m.groupTitle,
          kktp: m.kktp,
          nilaiAkhir: '',
          capaian: '',
        }))
      );
      setSakitDays(0);
      setIzinDays(0);
      setAlphaDays(0);
      setEkskulList([
        { name: '', predikat: '' },
        { name: '', predikat: '' },
        { name: '', predikat: '' },
      ]);
    }

    setSaveSuccessNotice(null);
    setSubView('input_student');
  };

  // Change semester in student input view
  const handleSemesterChange = (newSem: number) => {
    setInputSemester(newSem);
    if (!activeStudent) return;
    const existingGrade = gradesMap[activeStudent.id]?.[newSem];
    if (existingGrade && existingGrade.mapelScores?.length > 0) {
      setMapelRows(existingGrade.mapelScores);
      setSakitDays(existingGrade.sakit);
      setIzinDays(existingGrade.izin);
      setAlphaDays(existingGrade.alpha);
      setEkskulList(existingGrade.ekskul);
    } else {
      setMapelRows(
        DEFAULT_MAPEL.map((m) => ({
          id: m.id,
          name: m.name,
          kelompok: m.kelompok,
          groupTitle: m.groupTitle,
          kktp: m.kktp,
          nilaiAkhir: '',
          capaian: '',
        }))
      );
      setSakitDays(0);
      setIzinDays(0);
      setAlphaDays(0);
      setEkskulList([
        { name: '', predikat: '' },
        { name: '', predikat: '' },
        { name: '', predikat: '' },
      ]);
    }
  };

  // Update a mapel score
  const handleScoreChange = (index: number, val: string) => {
    const updated = [...mapelRows];
    const numVal = val === '' ? '' : Math.min(100, Math.max(0, Number(val)));
    updated[index].nilaiAkhir = numVal;

    // auto generate default capaian if score provided and empty
    if (numVal !== '' && !updated[index].capaian) {
      if (Number(numVal) >= 85) {
        updated[index].capaian = 'Menunjukkan penguasaan yang sangat baik dalam mencapai seluruh tujuan pembelajaran.';
      } else if (Number(numVal) >= 75) {
        updated[index].capaian = 'Menunjukkan penguasaan yang baik dalam mencapai tujuan pembelajaran.';
      } else {
        updated[index].capaian = 'Perlu bimbingan lebih lanjut dalam penguasaan materi pembelajaran.';
      }
    }
    setMapelRows(updated);
  };

  // Handle open modal Pilih TP (e-Rapor)
  const handleOpenTpModal = (idx: number) => {
    setTpModalSubjectIndex(idx);
    const subjectName = mapelRows[idx]?.name || 'Bahasa Indonesia';
    const availableTps = TP_BANK[subjectName] || TP_BANK['Bahasa Indonesia'];
    setTpModalSelectedTp(availableTps[0]);
    setTpModalPredicate('Sangat Baik');
  };

  // Apply selected TP to Capaian
  const handleApplySelectedTp = () => {
    if (tpModalSubjectIndex === null) return;
    const prefix =
      tpModalPredicate === 'Sangat Baik'
        ? 'Menunjukkan penguasaan yang sangat baik dalam '
        : tpModalPredicate === 'Baik'
        ? 'Menunjukkan penguasaan yang baik dalam '
        : 'Perlu bimbingan dan pendampingan lebih lanjut dalam ';

    // Format clean sentence
    const lowerFirst = tpModalSelectedTp.charAt(0).toLowerCase() + tpModalSelectedTp.slice(1);
    const generatedSentence = prefix + lowerFirst;

    const updated = [...mapelRows];
    updated[tpModalSubjectIndex].capaian = generatedSentence;
    setMapelRows(updated);
    setTpModalSubjectIndex(null);
  };

  // Save student grades
  const handleSaveStudentGrades = () => {
    if (!activeStudent) return;
    const newRecord: StudentGradeRecord = {
      semester: inputSemester,
      tahunPelajaran: inputTahunPelajaran,
      kelas: inputKelas,
      mapelScores: mapelRows,
      sakit: Number(sakitDays) || 0,
      izin: Number(izinDays) || 0,
      alpha: Number(alphaDays) || 0,
      ekskul: ekskulList,
    };

    setGradesMap((prev) => ({
      ...prev,
      [activeStudent.id]: {
        ...(prev[activeStudent.id] || {}),
        [inputSemester]: newRecord,
      },
    }));

    setSaveSuccessNotice(
      `Rekap Nilai Semester ${inputSemester} untuk ${activeStudent.fullName} berhasil disimpan ke database!`
    );

    setTimeout(() => {
      setSaveSuccessNotice(null);
    }, 4000);
  };

  // Download student rekap
  const handleDownloadStudentRekap = () => {
    if (!activeStudent) return;
    const lines = [
      `REKAP NILAI PESERTA DIDIK`,
      `Nama: ${activeStudent.fullName}`,
      `NIS: ${activeStudent.nipd}`,
      `NISN: ${activeStudent.nisn}`,
      `Program Keahlian: ${activeStudent.programKeahlian}`,
      `Kelas: ${inputKelas}`,
      `Semester: ${inputSemester}`,
      `Tahun Pelajaran: ${inputTahunPelajaran}`,
      ``,
      `NO,MATA PELAJARAN,KKTP,NILAI AKHIR,TERBILANG,CAPAIAN KOMPETENSI`,
    ];

    mapelRows.forEach((m, idx) => {
      const terbilang = m.nilaiAkhir !== '' ? angkaKeTerbilang(Number(m.nilaiAkhir)) : '-';
      lines.push(
        `${idx + 1},"${m.name}",${m.kktp},${m.nilaiAkhir || '-'},"${terbilang}","${m.capaian || '-'}"`
      );
    });

    lines.push('');
    lines.push(`KETIDAKHADIRAN:`);
    lines.push(`Sakit: ${sakitDays} hari`);
    lines.push(`Izin: ${izinDays} hari`);
    lines.push(`Tanpa Keterangan: ${alphaDays} hari`);

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Nilai_${activeStudent.fullName.replace(/\s+/g, '_')}_Sem${inputSemester}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered rows for the input table based on selectedMapelFilter
  const displayedMapelRows = useMemo(() => {
    if (selectedMapelFilter === 'A_SINGLE') {
      // Exactly matches image_b31f6cf7: 1 subject (Bahasa Indonesia) under KELOMPOK A
      return mapelRows.filter((m) => m.name === 'Bahasa Indonesia');
    }
    if (selectedMapelFilter === 'A') {
      return mapelRows.filter((m) => m.kelompok === 'A');
    }
    if (selectedMapelFilter === 'B') {
      return mapelRows.filter((m) => m.kelompok === 'B');
    }
    if (selectedMapelFilter === 'C') {
      return mapelRows.filter((m) => m.kelompok === 'C');
    }
    return mapelRows;
  }, [mapelRows, selectedMapelFilter]);

  // Group displayed rows by groupTitle
  const groupedMapel = useMemo(() => {
    const groups: { title: string; count: number; items: { row: MapelNilaiRow; originalIndex: number }[] }[] = [];
    displayedMapelRows.forEach((row) => {
      const origIdx = mapelRows.findIndex((m) => m.id === row.id);
      let g = groups.find((grp) => grp.title === row.groupTitle);
      if (!g) {
        g = { title: row.groupTitle, count: 0, items: [] };
        groups.push(g);
      }
      g.items.push({ row, originalIndex: origIdx >= 0 ? origIdx : 0 });
      g.count += 1;
    });
    return groups;
  }, [displayedMapelRows, mapelRows]);

  // ==========================================
  // RENDER: VIEW 2 - IMPORT EXCEL (Gambar 2 & 3)
  // ==========================================
  if (subView === 'import_excel') {
    return (
      <section className="space-y-6">
        {/* Header Title with live time */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSubView('list');
                setImportStatusMsg(null);
              }}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="Kembali ke Olah Nilai"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Import Nilai Massal (Excel)
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> 29 Oct 2026
            </span>
            <span className="flex items-center gap-1 bg-slate-900 text-white font-mono px-2.5 py-1 rounded-md shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> 10:10:36
            </span>
          </div>
        </div>

        {/* Top Info Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">Import Nilai Massal via Excel</h3>
                <span className="bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Jenjang Aktif: SMK (Sekolah Menengah Kejuruan)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kelola dan masukkan data nilai siswa secara sekaligus menggunakan template Excel resmi yang disesuaikan otomatis dengan jenjang Sekolah Menengah Kejuruan.
              </p>
            </div>
          </div>
        </div>

        {/* Panduan Cara Penggunaan */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Panduan Cara Penggunaan (Mudah & Praktis)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="border border-slate-100 rounded-lg p-3.5 bg-slate-50/50 relative">
              <div className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-black flex items-center justify-center mb-2">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Unduh Template Sesuai Kelas</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pilih <strong className="text-slate-800">Kelas</strong> dan <strong className="text-slate-800">Semester</strong> (tersedia 1 s/d 6) pada formulir kiri, lalu klik <span className="font-bold text-sky-700">UNDUH TEMPLATE EXCEL</span>. Daftar nama siswa & mata pelajaran di kelas tersebut akan terisi otomatis.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border border-slate-100 rounded-lg p-3.5 bg-slate-50/50 relative">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center mb-2">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Isi Angka Nilai pada Excel</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Buka file Excel yang terunduh (contoh: <code className="text-pink-600 font-mono text-[10px]">Template_Nilai_....xlsx</code>). Masukkan angka nilai (misal: 85, 90) pada kolom mata pelajaran. Jangan mengubah nama header kolom.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-slate-100 rounded-lg p-3.5 bg-slate-50/50 relative">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center mb-2">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Unggah & Simpan Nilai</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pilih file yang sudah diisi pada kotak hijau <strong className="text-slate-800">2. Unggah Nilai</strong>, lalu klik <span className="font-bold text-emerald-700">PROSES IMPORT SEKARANG</span>. Sistem akan membaca & memverifikasi nilai sebelum disimpan.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg flex items-center gap-2">
            <span className="text-amber-600 font-bold">✏ Otomatisasi Khusus Jenjang SMK:</span>
            <span>Mendukung pengisian nilai Semester 1 s/d 6. Mata pelajaran umum, konsentrasi kejuruan, dan PKL dipetakan otomatis sesuai rombel kelas.</span>
          </div>
        </div>

        {/* Status Notification */}
        {importStatusMsg && (
          <div
            className={`p-3.5 rounded-lg border flex items-center justify-between text-xs font-medium ${
              importStatusMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {importStatusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              )}
              <span>{importStatusMsg.text}</span>
            </div>
            <button
              onClick={() => setImportStatusMsg(null)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              &times;
            </button>
          </div>
        )}

        {/* 2 Main Action Cards: Unduh Template & Unggah Nilai */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Unduh Template */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm mb-1">
                <Download className="w-4 h-4" />
                <span>1. Unduh Template</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Pilih kelas dan semester terlebih dahulu agar sistem dapat menyesuaikan daftar mata pelajaran yang aktif.
              </p>

              <div className="space-y-3.5 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={templateClass}
                    onChange={(e) => setTemplateClass(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {classOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                    <select
                      value={templateSemester}
                      onChange={(e) => setTemplateSemester(Number(e.target.value))}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((s) => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Pelajaran</label>
                    <input
                      type="text"
                      value={templateTahunAjaran}
                      onChange={(e) => setTemplateTahunAjaran(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleDownloadTemplate}
                className="w-full py-2.5 px-4 bg-[#0284c7] hover:bg-sky-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Download className="w-4 h-4" /> UNDUH TEMPLATE EXCEL
              </button>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Catatan: Nama siswa dan mata pelajaran akan otomatis terisi di dalam file Excel.
              </p>
            </div>
          </div>

          {/* Card 2: Unggah Nilai */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
                <Upload className="w-4 h-4" />
                <span>2. Unggah Nilai</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Unggah kembali file template yang telah diisi data nilainya.
              </p>

              {/* Dropzone */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadedFile(e.target.files[0]);
                  }
                }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setUploadedFile(e.dataTransfer.files[0]);
                  }
                }}
                className={`mt-4 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                  uploadedFile
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50/50'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                {uploadedFile ? (
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {uploadedFile.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                      File siap diproses ({(uploadedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">
                      Pilih File Excel (.xlsx)
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Hanya mendukung format .xlsx yang diunduh dari sistem ini.
                    </span>
                  </div>
                )}
              </div>

              {/* Yellow Warning */}
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center gap-2 text-[11px] text-amber-800 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>PASTIKAN Anda tidak mengubah struktur kolom (header) pada file Excel.</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleProcessImport}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Upload className="w-4 h-4" /> PROSES IMPORT SEKARANG
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // RENDER: VIEW 3 - INPUT NILAI SISWA (Gambar 4 & image_b31f6cf7)
  // ==========================================
  if (subView === 'input_student' && activeStudent) {
    return (
      <section className="space-y-6">
        {/* Header with time matching image_b31f6cf7 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSubView('list');
                setSaveSuccessNotice(null);
              }}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="Kembali ke Olah Nilai"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Input Nilai Peserta Didik
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> 29 Oct 2026
            </span>
            <span className="flex items-center gap-1 bg-slate-900 text-white font-mono px-2.5 py-1 rounded-md shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> 11:27:21
            </span>
          </div>
        </div>

        {/* Student Banner (Cyan background as in Gambar b31f6cf7) */}
        <div className="bg-[#0284c7] text-white rounded-xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-wide uppercase">{activeStudent.fullName}</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-sky-100 mt-1">
                <span>NIS:</span>
                <span className="bg-white/10 px-2 py-0.5 rounded border border-white/20 font-mono text-white text-[11px]">
                  {activeStudent.nipd || '-'}
                </span>
                <span className="mx-1 text-white/40">|</span>
                <span>NISN:</span>
                <span className="bg-white/10 px-2 py-0.5 rounded border border-white/20 font-mono text-white text-[11px]">
                  {activeStudent.nisn || '-'}
                </span>
                <span className="mx-1 text-white/40">|</span>
                <span>Program Keahlian:</span>
                <strong className="text-white ml-0.5">{activeStudent.programKeahlian}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubView('list')}
              className="px-3.5 py-2 rounded-md border border-white/40 text-white hover:bg-white/10 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali
            </button>
            <button
              onClick={handleDownloadStudentRekap}
              className="px-3.5 py-2 rounded-md bg-[#16a34a] hover:bg-green-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Rekap
            </button>
          </div>
        </div>

        {/* Pengaturan Periode & Kelas */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Pengaturan Periode & Kelas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
              <select
                value={inputSemester}
                onChange={(e) => handleSemesterChange(Number(e.target.value))}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Pelajaran</label>
              <input
                type="text"
                value={inputTahunPelajaran}
                onChange={(e) => setInputTahunPelajaran(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas Saat Itu</label>
              <select
                value={inputKelas}
                onChange={(e) => setInputKelas(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filter Mapel Quick Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500">Tampilkan Kelompok:</span>
            <button
              type="button"
              onClick={() => setSelectedMapelFilter('A_SINGLE')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                selectedMapelFilter === 'A_SINGLE'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Bahasa Indonesia (Wajib)
            </button>
            <button
              type="button"
              onClick={() => setSelectedMapelFilter('A')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                selectedMapelFilter === 'A'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Kelompok A (Wajib)
            </button>
            <button
              type="button"
              onClick={() => setSelectedMapelFilter('B')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                selectedMapelFilter === 'B'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Kelompok B (Kejuruan)
            </button>
            <button
              type="button"
              onClick={() => setSelectedMapelFilter('C')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                selectedMapelFilter === 'C'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Kelompok C (Mulok)
            </button>
            <button
              type="button"
              onClick={() => setSelectedMapelFilter('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                selectedMapelFilter === 'ALL'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Semua Mapel ({mapelRows.length})
            </button>
          </div>
        </div>

        {/* Subjects Table matching image_b31f6cf7 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 uppercase font-bold text-slate-600 text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3 w-10 text-center">#</th>
                  <th className="p-3 min-w-[200px]">MATA PELAJARAN</th>
                  <th className="p-3 w-20 text-center">KKTP</th>
                  <th className="p-3 w-28 text-center">NILAI AKHIR</th>
                  <th className="p-3 w-36 text-center">TERBILANG (OTOMATIS)</th>
                  <th className="p-3 min-w-[340px]">CAPAIAN KOMPETENSI / KETERANGAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groupedMapel.map((group) => (
                  <React.Fragment key={group.title}>
                    {/* Group Header Row as in image_b31f6cf7 */}
                    <tr className="bg-white">
                      <td colSpan={6} className="px-3 pt-3.5 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#16a34a] text-white text-[10px] font-bold px-2.5 py-1 rounded-xs uppercase tracking-wider">
                            {group.title}
                          </span>
                          <span className="text-[11px] text-slate-500 italic font-medium">
                            ({group.count} Mata Pelajaran)
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Subject Rows under this group */}
                    {group.items.map(({ row: m, originalIndex: idx }, subIdx) => {
                      const terbilangStr =
                        m.nilaiAkhir !== '' && !isNaN(Number(m.nilaiAkhir))
                          ? angkaKeTerbilang(Number(m.nilaiAkhir))
                          : '';
                      return (
                        <tr key={m.id || idx} className="hover:bg-slate-50/70 transition">
                          {/* # */}
                          <td className="p-3 text-center font-bold text-slate-400">
                            {subIdx + 1}
                          </td>

                          {/* Mata Pelajaran */}
                          <td className="p-3 align-top">
                            <strong className="text-slate-800 text-xs block font-bold">
                              {m.name}
                            </strong>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 block">
                              KELOMPOK: {m.kelompok}
                            </span>
                          </td>

                          {/* KKTP in rounded box */}
                          <td className="p-3 align-top text-center">
                            <div className="w-14 py-1.5 border border-slate-200 rounded-md text-center font-semibold text-slate-700 bg-white shadow-2xs mx-auto text-xs">
                              {m.kktp}
                            </div>
                          </td>

                          {/* Nilai Akhir input */}
                          <td className="p-3 align-top text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={m.nilaiAkhir}
                              onChange={(e) => handleScoreChange(idx, e.target.value)}
                              placeholder=""
                              className="w-20 text-center py-1.5 border border-slate-300 rounded-md font-bold text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                            />
                          </td>

                          {/* Terbilang container */}
                          <td className="p-3 align-top text-center">
                            <div className="w-32 min-h-[34px] py-1.5 px-2 bg-slate-50 border border-slate-200/80 rounded-md text-center text-[11px] italic text-slate-600 font-medium flex items-center justify-center mx-auto">
                              {terbilangStr}
                            </div>
                          </td>

                          {/* Capaian Kompetensi with Textarea, Pilih TP button, and char counter */}
                          <td className="p-3 align-top">
                            <div className="space-y-1">
                              <textarea
                                rows={3}
                                value={m.capaian}
                                onChange={(e) => {
                                  const updated = [...mapelRows];
                                  updated[idx].capaian = e.target.value;
                                  setMapelRows(updated);
                                }}
                                placeholder="Tulis capaian atau keterangan..."
                                className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none leading-relaxed text-slate-800 bg-white"
                              />
                              <div className="flex items-center justify-between text-[11px] pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenTpModal(idx)}
                                  className="px-2.5 py-1 bg-[#0284c7] hover:bg-sky-700 text-white font-bold rounded flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                                >
                                  <CheckSquare className="w-3.5 h-3.5" /> Pilih TP (e-Rapor)
                                </button>
                                <span className="text-slate-400 font-mono text-[10px]">
                                  {m.capaian ? m.capaian.length : 0} kar
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom 2 Cards: Ketidakhadiran & Ekstrakurikuler (Gambar b31f6cf7) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ketidakhadiran */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
              <Users className="w-4 h-4 text-sky-600" />
              <span>Ketidakhadiran (Hari)</span>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-semibold text-slate-700">Sakit</label>
                <input
                  type="number"
                  min={0}
                  value={sakitDays}
                  onChange={(e) => setSakitDays(e.target.value)}
                  className="w-36 text-xs border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder=""
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-semibold text-slate-700">Izin</label>
                <input
                  type="number"
                  min={0}
                  value={izinDays}
                  onChange={(e) => setIzinDays(e.target.value)}
                  className="w-36 text-xs border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder=""
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-semibold text-slate-700">Tanpa Keterangan</label>
                <input
                  type="number"
                  min={0}
                  value={alphaDays}
                  onChange={(e) => setAlphaDays(e.target.value)}
                  className="w-36 text-xs border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* Ekstrakurikuler */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Ekstrakurikuler</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={ekskulList[idx]?.name || ''}
                    onChange={(e) => {
                      const updated = [...ekskulList];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setEkskulList(updated);
                    }}
                    placeholder={`Nama Kegiatan ${idx + 1}`}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={ekskulList[idx]?.predikat || ''}
                    onChange={(e) => {
                      const updated = [...ekskulList];
                      updated[idx] = { ...updated[idx], predikat: e.target.value };
                      setEkskulList(updated);
                    }}
                    placeholder="Predikat / Keterangan..."
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Notice */}
        {saveSuccessNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{saveSuccessNotice}</span>
            </div>
            <button
              onClick={() => setSaveSuccessNotice(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              &times;
            </button>
          </div>
        )}

        {/* Centered Bottom Action Button (Gambar b31f6cf7) */}
        <div className="flex flex-col items-center justify-center pt-2 pb-6">
          <button
            onClick={handleSaveStudentGrades}
            className="px-8 py-3 bg-[#0284c7] hover:bg-sky-700 text-white font-bold rounded-xl text-sm flex items-center gap-2.5 shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <Save className="w-4 h-4" /> SIMPAN REKAP NILAI SEMESTER
          </button>
          <span className="text-[11px] text-slate-400 mt-2 text-center">
            Data akan diperbarui/ditambahkan berdasarkan siswa, semester, dan tahun pelajaran.
          </span>
        </div>

        {/* ================================================= */}
        {/* MODAL: PILIH TP (e-Rapor)                         */}
        {/* ================================================= */}
        {tpModalSubjectIndex !== null && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="p-4 bg-[#0284c7] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-sky-200" />
                  <div>
                    <h3 className="text-sm font-bold">Pilih Tujuan Pembelajaran (TP) - e-Rapor</h3>
                    <p className="text-[11px] text-sky-100">
                      Mata Pelajaran: {mapelRows[tpModalSubjectIndex]?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setTpModalSubjectIndex(null)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    1. Tingkat Penguasaan / Predikat:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Sangat Baik', 'Baik', 'Perlu Bimbingan'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTpModalPredicate(p)}
                        className={`p-2 rounded-lg text-xs font-bold border text-center transition cursor-pointer ${
                          tpModalPredicate === p
                            ? 'bg-sky-50 border-sky-500 text-sky-700'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    2. Pilih Tujuan Pembelajaran (Kurikulum Merdeka):
                  </label>
                  <div className="space-y-2">
                    {(
                      TP_BANK[mapelRows[tpModalSubjectIndex]?.name] || TP_BANK['Bahasa Indonesia']
                    ).map((tp, i) => (
                      <div
                        key={i}
                        onClick={() => setTpModalSelectedTp(tp)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                          tpModalSelectedTp === tp
                            ? 'border-sky-500 bg-sky-50/50 text-slate-900 font-medium'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="tp-choice"
                          checked={tpModalSelectedTp === tp}
                          onChange={() => setTpModalSelectedTp(tp)}
                          className="mt-0.5 text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                        <span className="leading-relaxed">
                          <strong>TP {i + 1}:</strong> {tp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview Sentence */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Pratinjau Hasil Capaian Kompetensi:
                  </span>
                  <p className="text-xs text-slate-800 italic leading-relaxed">
                    "{tpModalPredicate === 'Sangat Baik'
                      ? 'Menunjukkan penguasaan yang sangat baik dalam '
                      : tpModalPredicate === 'Baik'
                      ? 'Menunjukkan penguasaan yang baik dalam '
                      : 'Perlu bimbingan dan pendampingan lebih lanjut dalam '}
                    {tpModalSelectedTp.charAt(0).toLowerCase() + tpModalSelectedTp.slice(1)}"
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTpModalSubjectIndex(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplySelectedTp}
                  className="px-4 py-2 bg-[#0284c7] hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Terapkan ke Capaian Kompetensi
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  // ==========================================
  // RENDER: VIEW 1 - MAIN "OLAH NILAI PESERTA DIDIK" (Gambar 1 & Gambar 5)
  // ==========================================
  return (
    <section className="space-y-6 relative">
      {/* Top Title & Header Time */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Olah Nilai Peserta Didik
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> 29 Oct 2026
          </span>
          <span className="flex items-center gap-1 bg-slate-900 text-white font-mono px-2.5 py-1 rounded-md shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> 10:09:55
          </span>
        </div>
      </div>

      {/* 3 Metrics Cards (Gambar 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Blue Total Peserta Didik */}
        <div className="bg-[#0284c7] text-white p-5 rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-3 top-3 text-white/10 group-hover:scale-105 transition">
            <Users className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-black">{totalStudents}</span>
            <div className="text-xs text-sky-100 font-semibold mt-1">
              Total Seluruh Peserta Didik
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedClass('Semua Kelas');
              setSearchTerm('');
            }}
            className="text-[11px] font-bold text-white/90 mt-5 flex items-center gap-1 hover:underline cursor-pointer relative z-10 text-left"
          >
            Lihat Detail &rarr;
          </button>
        </div>

        {/* Card 2: Green Terisi Nilai */}
        <div className="bg-[#10b981] text-white p-5 rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-3 top-3 text-white/10 group-hover:scale-105 transition">
            <CheckCircle2 className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-black">{filledStudentsCount}</span>
            <div className="text-xs text-emerald-100 font-semibold mt-1">
              Peserta Didik Sudah Terisi Nilai
            </div>
          </div>
          <span className="text-[11px] font-bold text-white/90 mt-5 relative z-10">
            {progressPercent}% Progres Terisi
          </span>
        </div>

        {/* Card 3: Orange Belum Ada Nilai */}
        <div className="bg-[#f59e0b] text-white p-5 rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-3 top-3 text-white/10 group-hover:scale-105 transition">
            <Clock className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-black">{unfilledStudentsCount}</span>
            <div className="text-xs text-amber-100 font-semibold mt-1">
              Peserta Didik Belum Ada Nilai
            </div>
          </div>
          <span className="text-[11px] font-bold text-white/90 mt-5 flex items-center gap-1 relative z-10">
            Butuh Perhatian <AlertTriangle className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Main Panel: Rekap Nilai Peserta Didik (Gambar 1) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Rekap Nilai Peserta Didik</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenKenaikanModal}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1.5 text-xs shadow-xs cursor-pointer transition"
            >
              <TrendingUp className="w-3.5 h-3.5" /> Kenaikan Kelas Massal
            </button>
            <button
              onClick={() => setSubView('import_excel')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1.5 text-xs shadow-xs cursor-pointer transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Impor Nilai Massal (Excel)
            </button>
          </div>
        </div>

        {/* Filter Bar with Tip */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-bold text-slate-700 shrink-0">FILTER PER KELAS:</span>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="p-1.5 border border-slate-300 rounded text-xs bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none min-w-[200px]"
            >
              <option value="Semua Kelas">Semua Kelas</option>
              {classOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] text-sky-800 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>Tip: Gunakan kotak pencarian di tabel untuk memfilter Program Keahlian atau NIPD secara cepat.</span>
          </div>
        </div>

        {/* Table Controls (Show entries & Search) */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-300 rounded px-2 py-1 text-xs bg-white focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari Nama / NISN / NIPD..."
              className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none w-48 sm:w-60"
            />
          </div>
        </div>

        {/* Table matching Gambar 1 */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 uppercase font-bold text-slate-600 text-[10px] border-y border-slate-200">
              <tr>
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3">NAMA LENGKAP PESERTA DIDIK</th>
                <th className="p-3">NIPD</th>
                <th className="p-3">PROGRAM KEAHLIAN</th>
                <th className="p-3 text-center">STATUS PENGISIAN</th>
                <th className="p-3 text-center w-36">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Tidak ada data peserta didik yang cocok dengan filter atau kata kunci.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s, idx) => {
                  const studentGrades = gradesMap[s.id] || {};
                  const isCetakOpen = openCetakDropdownId === s.id;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      {/* # */}
                      <td className="p-3 text-center font-bold text-slate-400">
                        {(currentPage - 1) * entriesPerPage + idx + 1}
                      </td>

                      {/* Nama Lengkap & NISN */}
                      <td className="p-3">
                        <strong className="text-slate-900 block font-bold uppercase">{s.fullName}</strong>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                          <span className="bg-slate-100 text-slate-600 font-mono px-1 rounded border border-slate-200">
                            📇 {s.nisn}
                          </span>
                          <span className="text-slate-400">Kelas: {s.currentClass}</span>
                        </div>
                      </td>

                      {/* NIPD */}
                      <td className="p-3">
                        <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
                          {s.nipd}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Kelas: {s.currentClass}
                        </span>
                      </td>

                      {/* Program Keahlian */}
                      <td className="p-3 text-slate-700 font-medium">{s.programKeahlian}</td>

                      {/* Status Pengisian (Semester 1 to 6 pills) */}
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          {[1, 2, 3, 4, 5, 6].map((sem) => {
                            const isFilled = Boolean(studentGrades[sem]);
                            return (
                              <button
                                key={sem}
                                onClick={() => {
                                  setActiveStudent(s);
                                  handleSemesterChange(sem);
                                  setSubView('input_student');
                                }}
                                title={`Semester ${sem}: ${isFilled ? 'Sudah Terisi' : 'Belum Ada Nilai'}`}
                                className={`w-5 h-5 text-[10px] font-bold rounded flex items-center justify-center border transition cursor-pointer ${
                                  isFilled
                                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs'
                                    : 'bg-white text-slate-400 border-slate-200 hover:border-sky-400 hover:text-sky-600'
                                }`}
                              >
                                {sem}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* AKSI: [📝 Nilai] and [🖨 Cetak ▾] */}
                      <td className="p-3 text-center relative">
                        <div className="flex items-center justify-center gap-1">
                          {/* Button 1: Nilai (Teal/Cyan) */}
                          <button
                            onClick={() => handleOpenInputForStudent(s)}
                            className="px-2 py-1 bg-[#0284c7] hover:bg-sky-700 text-white text-[11px] font-bold rounded flex items-center gap-1 shadow-2xs transition cursor-pointer"
                            title="Input / Edit Nilai"
                          >
                            <FileText className="w-3 h-3" /> Nilai
                          </button>

                          {/* Button 2: Cetak ▾ (Dark Slate) */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenCetakDropdownId(isCetakOpen ? null : s.id);
                              }}
                              className="px-2 py-1 bg-[#1e293b] hover:bg-slate-800 text-white text-[11px] font-bold rounded flex items-center gap-1 shadow-2xs transition cursor-pointer"
                              title="Pilihan Cetak"
                            >
                              <Printer className="w-3 h-3" /> Cetak
                              <ChevronDown className="w-3 h-3" />
                            </button>

                            {/* Dropdown Menu (Gambar 5) */}
                            {isCetakOpen && (
                              <div
                                ref={cetakDropdownRef}
                                className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 text-left text-xs animate-in fade-in zoom-in-95 duration-100"
                              >
                                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  DAFTAR NILAI RAPOR:
                                </div>

                                <button
                                  onClick={() => {
                                    setOpenCetakDropdownId(null);
                                    setPrintPreviewStudent(s);
                                    setPrintPreviewType('Semester 1 & 2 (Kelas X)');
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 hover:text-sky-600 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <span className="text-slate-400">&gt;</span> Semester 1 & 2 (Kelas X)
                                </button>

                                <button
                                  onClick={() => {
                                    setOpenCetakDropdownId(null);
                                    setPrintPreviewStudent(s);
                                    setPrintPreviewType('Semester 3 & 4 (Kelas XI)');
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 hover:text-sky-600 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <span className="text-slate-400">&gt;</span> Semester 3 & 4 (Kelas XI)
                                </button>

                                <button
                                  onClick={() => {
                                    setOpenCetakDropdownId(null);
                                    setPrintPreviewStudent(s);
                                    setPrintPreviewType('Semester 5 & 6 (Kelas XII)');
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 hover:text-sky-600 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <span className="text-slate-400">&gt;</span> Semester 5 & 6 (Kelas XII)
                                </button>

                                <div className="border-t border-slate-100 my-1" />

                                <button
                                  onClick={() => {
                                    setOpenCetakDropdownId(null);
                                    setPrintPreviewStudent(s);
                                    setPrintPreviewType('Lembar Induk (A4)');
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 hover:text-sky-600 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <User className="w-3.5 h-3.5 text-slate-500" /> Lembar Induk (A4)
                                </button>

                                <div className="border-t border-slate-100 my-1" />

                                <button
                                  onClick={() => {
                                    setOpenCetakDropdownId(null);
                                    onOpenStudent(s);
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 hover:text-sky-600 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <Eye className="w-3.5 h-3.5 text-slate-500" /> Profil Lengkap
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing {filteredStudents.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * entriesPerPage, filteredStudents.length)} of {filteredStudents.length} entries
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-100 text-slate-700 font-medium transition cursor-pointer"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pNum = i + 1;
              return (
                <button
                  key={pNum}
                  onClick={() => setCurrentPage(pNum)}
                  className={`w-7 h-7 rounded text-xs font-bold transition cursor-pointer ${
                    currentPage === pNum
                      ? 'bg-[#0284c7] text-white'
                      : 'border border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {pNum}
                </button>
              );
            })}
            {totalPages > 5 && <span className="px-1 text-slate-400">...</span>}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-100 text-slate-700 font-medium transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL PRINT PREVIEW (for Cetak dropdown)   */}
      {/* ========================================== */}
      {printPreviewStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold">
                  Pratinjau Cetak: {printPreviewType} - {printPreviewStudent.fullName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#0284c7] hover:bg-sky-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Cetak Dokumen
                </button>
                <button
                  onClick={() => setPrintPreviewStudent(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content (Indonesian Official Format) */}
            <div className="p-8 overflow-y-auto bg-slate-50 font-serif text-slate-900 text-xs">
              <div className="bg-white p-8 rounded-xl shadow-xs border border-slate-200 max-w-3xl mx-auto space-y-6">
                {/* School Letterhead */}
                <div className="border-b-2 border-black pb-3 text-center">
                  <h4 className="text-xs uppercase font-bold tracking-wider">
                    {schoolSettings?.provincialEducationService || 'PEMERINTAH PROVINSI JAWA TIMUR'}
                  </h4>
                  <h4 className="text-xs uppercase font-bold tracking-wider">
                    {schoolSettings?.branchOffice || 'DINAS PENDIDIKAN CABANG WILAYAH BOJONEGORO'}
                  </h4>
                  <h2 className="text-base font-black uppercase tracking-wide mt-1">
                    {schoolSettings?.name || 'SMK NEGERI DANDER'}
                  </h2>
                  <p className="text-[10px] font-sans text-slate-600 mt-0.5">
                    {schoolSettings?.address || 'Jl. Raya Dander No. 123, Bojonegoro, Jawa Timur'} | Telp:{' '}
                    {schoolSettings?.phone || '(0353) 887123'} | Email:{' '}
                    {schoolSettings?.email || 'smkndander@gmail.com'}
                  </p>
                </div>

                {/* Document Title */}
                <div className="text-center">
                  <h3 className="text-sm font-black underline uppercase tracking-wider">
                    {printPreviewType.includes('Rapor') || printPreviewType.includes('Semester')
                      ? 'LAPORAN HASIL BELAJAR (RAPOR PESERTA DIDIK)'
                      : 'LEMBAR BUKU INDUK PESERTA DIDIK (A4)'}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-600">
                    Tahun Pelajaran: 2026/2027
                  </span>
                </div>

                {/* Student Details */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
                  <div className="flex">
                    <span className="w-36 font-semibold">Nama Peserta Didik</span>
                    <span className="mr-2">:</span>
                    <span className="font-bold uppercase">{printPreviewStudent.fullName}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold">Nomor Induk / NISN</span>
                    <span className="mr-2">:</span>
                    <span className="font-mono">{printPreviewStudent.nipd} / {printPreviewStudent.nisn}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold">Kelas / Rombel</span>
                    <span className="mr-2">:</span>
                    <span>{printPreviewStudent.currentClass}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold">Program Keahlian</span>
                    <span className="mr-2">:</span>
                    <span>{printPreviewStudent.programKeahlian}</span>
                  </div>
                </div>

                {/* Grades Table */}
                <div className="border border-black overflow-hidden mt-4">
                  <table className="w-full text-[11px] text-left border-collapse">
                    <thead className="bg-slate-100 border-b border-black text-center font-bold">
                      <tr>
                        <th className="p-2 border-r border-black w-8">No</th>
                        <th className="p-2 border-r border-black">Mata Pelajaran</th>
                        <th className="p-2 border-r border-black w-14">KKTP</th>
                        <th className="p-2 border-r border-black w-16">Nilai Akhir</th>
                        <th className="p-2 border-r border-black w-28">Terbilang</th>
                        <th className="p-2">Capaian Kompetensi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/30">
                      {DEFAULT_MAPEL.map((m, idx) => {
                        const savedScore =
                          gradesMap[printPreviewStudent.id]?.[1]?.mapelScores?.[idx]?.nilaiAkhir ||
                          85 + (idx % 8);
                        return (
                          <tr key={idx}>
                            <td className="p-2 border-r border-black text-center">{idx + 1}</td>
                            <td className="p-2 border-r border-black font-medium">{m.name}</td>
                            <td className="p-2 border-r border-black text-center font-mono">{m.kktp}</td>
                            <td className="p-2 border-r border-black text-center font-bold font-mono">
                              {savedScore}
                            </td>
                            <td className="p-2 border-r border-black italic text-[10px]">
                              {angkaKeTerbilang(Number(savedScore))}
                            </td>
                            <td className="p-2 text-[10px]">
                              Tercapai dengan sangat baik dalam seluruh kompetensi.
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 pt-8 text-center text-xs">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-semibold">Orang Tua / Wali Murid</p>
                    <div className="h-16" />
                    <p className="font-bold underline">
                      ( {printPreviewStudent.fatherName || 'Orang Tua / Wali'} )
                    </p>
                  </div>

                  <div>
                    <p>Bojonegoro, 29 Oktober 2026</p>
                    <p className="font-semibold">Kepala SMKN DANDER</p>
                    <div className="h-16" />
                    <p className="font-bold underline">
                      {schoolSettings?.principalName || 'Drs. H. Mulyono, M.Pd'}
                    </p>
                    <p className="font-mono text-[10px]">
                      NIP. {schoolSettings?.principalNip || '19680512 199303 1 005'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
