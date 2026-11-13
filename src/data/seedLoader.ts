/**
 * Data awal siswa yang asli (nama, NISN, NIPD, dst.) TIDAK disimpan di kode yang masuk GitHub.
 * Berkas-berkasnya diletakkan di src/data/private/ (diabaikan git). Bila folder itu tidak ada,
 * aplikasi mulai kosong dan seluruh data diambil dari Google Drive setelah login Google.
 */
import type { NomorUrutRecord } from './nomorUrutTypes';

export interface RawStudent {
  reg: number;
  nipd: string;
  nisn: string;
  name: string;
  gender: string;
  cls: string;
  fase: string;
  jurusan: string;
  place: string;
  birth: string;
}

const mods = import.meta.glob('./private/*.ts', { eager: true }) as Record<string, any>;
const pick = (file: string) => mods[`./private/${file}.ts`] ?? {};

export const privateSeedAvailable = Object.keys(mods).length > 0;
export const officialRegister1144: NomorUrutRecord[] = pick('nomorUrutRegisterData').officialRegister1144 ?? [];
export const rawStudents: RawStudent[] = pick('studentSeed').rawStudentList ?? [];
export const firstStudentOverride: Record<string, string> = pick('studentSeed').firstStudentOverride ?? {};
