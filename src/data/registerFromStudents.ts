import type { Student } from '../types';
import type { NomorUrutRecord } from './nomorUrutTypes';

/**
 * Daftar register dibentuk dari data siswa yang tersimpan (hasil impor Dapodik atau sinkronisasi Drive),
 * dipakai bila berkas register resmi lokal tidak tersedia (misalnya di situs GitHub Pages).
 * Urutan: nomor NIPD (angka sebelum garis miring), siswa tanpa NIPD di bagian akhir.
 */
const nipdKey = (s: Student): number => {
  const n = parseInt((s.nipd || '').split('/')[0], 10);
  return Number.isNaN(n) ? Number.MAX_SAFE_INTEGER : n;
};

export function deriveRegister(students: Student[]): NomorUrutRecord[] {
  return [...students]
    .sort((a, b) => nipdKey(a) - nipdKey(b) || a.fullName.localeCompare(b.fullName, 'id'))
    .map((s, i) => ({
      reg: s.registrationNumber && students.length === new Set(students.map((x) => x.registrationNumber)).size ? s.registrationNumber : i + 1,
      nipd: s.nipd,
      nisn: s.nisn,
      fullName: s.fullName,
      gender: s.gender,
      currentClass: s.currentClass,
    })) as NomorUrutRecord[];
}
