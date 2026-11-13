export type Gender = 'L' | 'P';

export type StudentStatus = 'Aktif' | 'Lulus' | 'Mutasi Keluar' | 'Dikeluarkan';

export interface StudentDocuments {
  akta: boolean;
  kk: boolean;
  ijazahSmp: boolean;
  pasFoto: boolean;
  kipOrPkh?: boolean;
}

export interface Student {
  id: string;
  nipd: string;
  nisn: string;
  nik: string;
  noKk: string;
  fullName: string;
  gender: Gender;
  birthPlace: string;
  birthDate: string; // YYYY-MM-DD
  religion: string;
  citizenship: string;
  address: string;
  phone: string;
  livingWith: string;
  admissionDate: string;
  admissionClass: string;
  currentClass: string;
  programKeahlian: string;
  fatherName: string;
  motherName: string;
  parentJob: string;
  parentPhone: string;
  parentAddress: string;
  prevSchool: string;
  status: StudentStatus;
  photoUrl: string;
  photoUrlTamat?: string;
  avgScore: number;
  documents: StudentDocuments;
  fase: 'E' | 'F';
  catatanKhusus?: string;
  registrationNumber?: number;
}

export interface ProgramKeahlian {
  code: string;
  name: string;
  konsentrasi?: string;
  headOfProgram?: string;
  totalStudents?: number;
  description?: string;
  category?: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  gradeLevel: 'X' | 'XI' | 'XII';
  programKeahlian: string;
  fase: 'E' | 'F';
  homeroomTeacher: string;
  homeroomNip: string;
  studentCount: number;
  room: string;
}

export interface SubjectScore {
  id: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  category: 'Umum' | 'Kejuruan' | 'P5' | 'Muatan Lokal';
  semester: number;
  tpCode: string;
  tpDescription: string;
  formativeScore: number;
  summativeScore: number;
  finalScore: number;
  predicate: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan';
}

export interface PKLRecord {
  id: string;
  studentId: string;
  studentName: string;
  classGrade: string;
  programKeahlian: string;
  companyName: string;
  companyAddress: string;
  companyField: string;
  mentorName: string;
  supervisorTeacher: string;
  period: string; // e.g. "1 Juli 2026 - 31 Des 2026"
  score: number;
  predicate: string;
  status: 'Sedang Berjalan' | 'Selesai' | 'Dibatalkan';
}

export interface UKKRecord {
  id: string;
  studentId: string;
  studentName: string;
  programKeahlian: string;
  clusterScheme: string;
  assessorInternal: string;
  assessorExternal: string;
  externalCompany: string;
  practicalScore: number;
  theoryScore: number;
  finalScore: number;
  status: 'Kompeten' | 'Sangat Kompeten' | 'Belum Kompeten';
  certificateNumber: string;
}

export interface MutationRecord {
  id: string;
  studentId: string;
  studentName: string;
  nipd: string;
  nisn: string;
  type: 'Mutasi Masuk' | 'Mutasi Keluar';
  date: string;
  schoolTargetOrOrigin: string;
  letterNumber: string;
  reason: string;
  status: 'Disetujui' | 'Proses Verifikasi' | 'Ditolak';
}

export interface AlumniTracer {
  id: string;
  studentId: string;
  studentName: string;
  nisn: string;
  graduationYear: string;
  programKeahlian: string;
  category: 'Bekerja' | 'Kuliah' | 'Wirausaha' | 'Mencari Kerja';
  institutionName: string;
  fieldOrMajor: string;
  monthlyIncome?: string;
  contactNumber: string;
}

export interface SchoolSettings {
  name: string;
  npsn: string;
  nss: string;
  principalName: string;
  principalNip: string;
  showPrincipalNipText?: boolean;
  signaturePrefix?: string;
  signatureRole?: string;
  administrationHead: string;
  administrationNip: string;
  showAdminNipText?: boolean;
  administrationRole?: string;
  address: string;
  kelurahan?: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  schoolStatus?: 'Negeri' | 'Swasta';
  accreditation?: string;
  foundationName?: string;
  phone: string;
  email: string;
  website: string;
  reportProgramList?: string;
  provincialEducationService?: string;
  branchOffice?: string;
  activeAcademicYear: string;
  activeSemester: '1 (Ganjil)' | '2 (Genap)';
  activeJenjang: 'SMK' | 'SMA' | 'MA' | 'SMP' | 'MTs' | 'SD';
  curriculum: string;
  logoUrl?: string;
  stampUrl?: string;
  signatureUrl?: string;
  photoDisplayMode?: string;
  photoBoxSize?: string;
  photoCaptionText?: string;
  graduationMeetingDate?: string;
  certificateDate?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  target: string;
  ipAddress: string;
}
