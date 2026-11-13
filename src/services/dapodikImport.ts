import type { Student } from '../types';

/**
 * Impor "Daftar Peserta Didik" hasil ekspor Dapodik (.xlsx).
 * Kolom dicari berdasarkan nama header, bukan posisi, sehingga tahan terhadap pergeseran kolom.
 * Modul ini murni (tanpa React dan tanpa jaringan) agar mudah diuji.
 */

export interface ImportResult {
  students: Student[];
  fileCount: number;
  added: number;
  updated: number;
  kept: number; // siswa lama yang tidak ada di file (dipertahankan)
  removed: number; // siswa lama yang dibuang (mode ganti semua)
  warnings: string[];
}

type Row = unknown[];

const cell = (v: unknown): string => {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return isoDate(v);
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(v);
  return String(v).replace(/\s+/g, ' ').trim();
};

const isoDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const normDate = (v: unknown): string => {
  const s = cell(v);
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return s;
};

const intText = (v: unknown): string => {
  const s = cell(v);
  if (!s) return '';
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? s : String(n);
};

const phone = (v: unknown): string => {
  const s = cell(v).replace(/[^\d+]/g, '');
  if (!s) return '';
  if (s.startsWith('0') || s.startsWith('+') || s.startsWith('62')) return s;
  return '0' + s;
};

const ROMBEL = /^(XII|XI|X)\s+([A-Za-z]+)/;

export function buildImport(
  rows: Row[],
  existing: Student[],
  knownClassNames: string[] = [],
  replaceAll = false
): ImportResult {
  // 1. Cari baris header
  const headerIdx = rows.findIndex(
    (r, i) => i < 20 && cell(r[1]).toLowerCase() === 'nama' && cell(r[2]).toUpperCase() === 'NIPD'
  );
  if (headerIdx < 0) {
    throw new Error('Format file tidak dikenali. Pastikan ini file asli "Daftar Peserta Didik" hasil Export Dapodik.');
  }
  const header = rows[headerIdx].map(cell);
  const col = (name: string) => header.findIndex((h) => h.toLowerCase().replace(/\s+/g, ' ') === name.toLowerCase());
  const c = {
    nama: col('Nama'),
    nipd: col('NIPD'),
    jk: col('JK'),
    nisn: col('NISN'),
    tempat: col('Tempat Lahir'),
    tgl: col('Tanggal Lahir'),
    nik: col('NIK'),
    agama: col('Agama'),
    alamat: col('Alamat'),
    rt: col('RT'),
    rw: col('RW'),
    dusun: col('Dusun'),
    kel: col('Kelurahan'),
    kec: col('Kecamatan'),
    tinggal: col('Jenis Tinggal'),
    telp: col('Telepon'),
    hp: col('HP'),
    ayah: col('Data Ayah'),
    ibu: col('Data Ibu'),
    rombel: col('Rombel Saat Ini'),
    asal: col('Sekolah Asal'),
    kk: col('No KK'),
  };
  const missing = (['nama', 'nipd', 'jk', 'nisn', 'rombel'] as const).filter((k) => c[k] < 0);
  if (missing.length) {
    throw new Error(`Kolom wajib tidak ditemukan di file: ${missing.join(', ')}.`);
  }
  const at = (r: Row, i: number) => (i >= 0 ? r[i] : undefined);

  const warnings: string[] = [];
  const parsed: Student[] = [];
  const seenNisn = new Set<string>();
  const unknownClasses = new Set<string>();
  let skippedDup = 0;
  let noNipd = 0;

  // 2. Baca baris siswa (lewati sub-header "Nama/Pekerjaan/NIK" tepat setelah header)
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const name = cell(r[c.nama]);
    if (!name || name.toLowerCase() === 'nama') continue;
    const nisn = cell(r[c.nisn]);
    if (!nisn) {
      warnings.push(`Baris ${i + 1} dilewati karena NISN kosong.`);
      continue;
    }
    if (seenNisn.has(nisn)) {
      skippedDup++;
      continue;
    }
    seenNisn.add(nisn);

    const rombel = cell(r[c.rombel]);
    const m = rombel.match(ROMBEL);
    const grade = m ? m[1] : '';
    const kode = m ? m[2].toUpperCase() : '';
    const fase: 'E' | 'F' = grade === 'X' ? 'E' : 'F';
    if (rombel && knownClassNames.length && !knownClassNames.includes(rombel)) unknownClasses.add(rombel);

    const nipd = cell(r[c.nipd]);
    if (!nipd) noNipd++;

    const rt = intText(at(r, c.rt));
    const rw = intText(at(r, c.rw));
    const address = [
      [cell(at(r, c.alamat)), rt && `RT ${rt}`, rw && `RW ${rw}`].filter(Boolean).join(' '),
      cell(at(r, c.dusun)) && `Dsn. ${cell(at(r, c.dusun))}`,
      cell(at(r, c.kel)),
      cell(at(r, c.kec)),
    ]
      .filter(Boolean)
      .join(', ');

    const fatherName = c.ayah >= 0 ? cell(r[c.ayah]) : '';
    const fatherJob = c.ayah >= 0 ? cell(r[c.ayah + 1]) : '';
    const motherName = c.ibu >= 0 ? cell(r[c.ibu]) : '';
    const motherJob = c.ibu >= 0 ? cell(r[c.ibu + 1]) : '';
    const kk = cell(at(r, c.kk));
    const hp = phone(at(r, c.hp)) || phone(at(r, c.telp));

    parsed.push({
      id: `std-${nisn}`,
      nipd,
      nisn,
      nik: cell(at(r, c.nik)),
      noKk: kk.length === 16 ? kk : '',
      fullName: name,
      gender: cell(r[c.jk]).toUpperCase().startsWith('P') ? 'P' : 'L',
      birthPlace: cell(at(r, c.tempat)),
      birthDate: normDate(at(r, c.tgl)),
      religion: cell(at(r, c.agama)) || 'Islam',
      citizenship: 'WNI',
      address,
      phone: hp,
      livingWith: cell(at(r, c.tinggal)),
      admissionDate: '',
      admissionClass: 'X',
      currentClass: rombel,
      programKeahlian: kode,
      fatherName,
      motherName,
      parentJob: fatherJob || motherJob,
      parentPhone: '',
      parentAddress: address,
      prevSchool: cell(at(r, c.asal)),
      status: 'Aktif',
      photoUrl: '',
      avgScore: 0,
      documents: { akta: false, kk: false, ijazahSmp: false, pasFoto: false },
      fase,
    } as Student);
  }

  if (parsed.length === 0) throw new Error('Tidak ada baris siswa yang bisa dibaca dari file ini.');
  if (skippedDup) warnings.push(`${skippedDup} baris dilewati karena NISN ganda.`);
  if (noNipd) warnings.push(`${noNipd} siswa belum memiliki NIPD di Dapodik.`);
  if (unknownClasses.size) {
    warnings.push(`Rombel belum ada di menu Manajemen Kelas: ${[...unknownClasses].sort().join(', ')}.`);
  }

  // 3. Gabungkan dengan data yang sudah ada
  const placeholderPhoto = (g: string) =>
    g === 'L'
      ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80';

  const keepIfEmpty = <T,>(next: T, prev: T): T => ((next as unknown as string) === '' ? prev : next);
  const byNisn = new Map<string, Student>();
  existing.forEach((s) => s.nisn && byNisn.set(s.nisn.trim(), s));

  let added = 0;
  let updated = 0;
  const seenIds = new Set<string>();
  const merged: Student[] = parsed.map((p, idx) => {
    const old = replaceAll ? undefined : byNisn.get(p.nisn);
    let out: Student;
    if (old) {
      updated++;
      out = {
        ...old,
        nipd: keepIfEmpty(p.nipd, old.nipd),
        nik: keepIfEmpty(p.nik, old.nik),
        noKk: keepIfEmpty(p.noKk, old.noKk),
        fullName: p.fullName,
        gender: p.gender,
        birthPlace: keepIfEmpty(p.birthPlace, old.birthPlace),
        birthDate: keepIfEmpty(p.birthDate, old.birthDate),
        religion: p.religion,
        address: keepIfEmpty(p.address, old.address),
        phone: keepIfEmpty(p.phone, old.phone),
        livingWith: keepIfEmpty(p.livingWith, old.livingWith),
        currentClass: p.currentClass,
        programKeahlian: keepIfEmpty(p.programKeahlian, old.programKeahlian),
        fase: p.fase,
        fatherName: keepIfEmpty(p.fatherName, old.fatherName),
        motherName: keepIfEmpty(p.motherName, old.motherName),
        parentJob: keepIfEmpty(p.parentJob, old.parentJob),
        parentAddress: keepIfEmpty(p.parentAddress, old.parentAddress),
        prevSchool: keepIfEmpty(p.prevSchool, old.prevSchool),
        status: old.status === 'Mutasi Keluar' || old.status === 'Dikeluarkan' ? old.status : 'Aktif',
      };
    } else {
      added++;
      out = { ...p, photoUrl: placeholderPhoto(p.gender) };
    }
    if (out.registrationNumber === undefined) out.registrationNumber = idx + 1;
    let id = out.id;
    while (seenIds.has(id)) id = `${id}-${idx}`;
    seenIds.add(id);
    return { ...out, id };
  });

  const importedNisn = new Set(parsed.map((p) => p.nisn));
  const leftovers = existing.filter((s) => !importedNisn.has((s.nisn || '').trim()));
  const kept = replaceAll ? 0 : leftovers.length;
  const removed = replaceAll ? existing.length : 0;

  return {
    students: replaceAll ? merged : [...merged, ...leftovers],
    fileCount: parsed.length,
    added,
    updated,
    kept,
    removed,
    warnings,
  };
}
