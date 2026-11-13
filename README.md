# SIDUK: Buku Induk Digital (GitHub + Google Drive)

Aplikasi web (React + Vite) yang kodenya di GitHub, di-deploy otomatis ke GitHub Pages,
dan datanya disimpan di Google Drive.

## Cara kerja

| Bagian | Tempatnya |
|---|---|
| Kode aplikasi | GitHub (repo publik atau privat) |
| Halaman web | GitHub Pages, dibangun otomatis tiap `git push` ke cabang `main` |
| Data (siswa, nilai, kelulusan, dll.) | Google Drive, folder **SIDUK Buku Induk** |
| Cadangan | Drive, sub-folder **Cadangan**, satu berkas per hari (30 hari terakhir) |
| Data siswa asli | **Tidak pernah masuk GitHub.** Hanya ada di Drive dan di komputer Anda |

Aplikasi tetap bekerja seperti semula dengan localStorage. Lapisan sinkronisasi mengamati
perubahan, mengirimnya ke Drive 20 detik kemudian, dan mengambilnya di perangkat lain.
Status terlihat di tombol awan pada header.

## 1. Konfigurasi Firebase dan Google (sekali saja)

1. Firebase Console > proyek Anda > **Authentication** > **Sign-in method** > aktifkan **Google**.
2. **Authentication > Settings > Authorized domains** > tambahkan `USERNAME.github.io`
   (ganti USERNAME dengan nama akun GitHub Anda). Tanpa ini, login Google di situs akan ditolak.
3. Google Cloud Console (proyek yang sama) > **APIs & Services > Library** > aktifkan **Google Drive API**.
4. **OAuth consent screen**: tambahkan akun Google yang akan dipakai sebagai pengguna uji bila status aplikasi "Testing".
   Scope yang dipakai hanya `drive.file`, jadi aplikasi hanya bisa melihat berkas yang ia buat sendiri.
5. Salin `.env.example` menjadi `.env.local` dan isi nilainya (Project settings > Your apps > Web app).

## 2. Jalankan di komputer

```bash
npm install
npm run dev        # buka http://localhost:3000
```

Pertama kali: klik tombol awan di header > **Hubungkan Google Drive**, lalu isi data lewat Import Dapodik (lihat di bawah). Bila perangkat lain sudah menyimpan data,
Anda diminta memilih data mana yang dipakai.

## 3. Pasang ke GitHub dan deploy

```bash
git init
git add .
git status          # pastikan TIDAK ada src/data/private, public/assets/aistudio, dan .env.local
git commit -m "SIDUK pertama"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

Lalu di GitHub:

1. **Settings > Pages > Build and deployment > Source: GitHub Actions**.
2. **Settings > Secrets and variables > Actions > tab Variables**, tambahkan enam variabel
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
   `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`
   (isinya sama dengan `.env.local`).
3. Tab **Actions** > jalankan ulang workflow bila perlu. Alamat situs:
   `https://USERNAME.github.io/NAMA-REPO/`.

Setiap perubahan kode cukup `git add . && git commit -m "..." && git push`.

## Mengisi data siswa (Import Dapodik)

1. Unduh **Daftar Peserta Didik** dari Dapodik (Export Excel), jangan diubah isinya.
2. Di aplikasi: **Manajemen Peserta Didik > Import Dapodik**, pilih file `.xlsx`, klik **Proses Import Sekarang**.
3. Aplikasi menampilkan ringkasan (jumlah siswa baru, diperbarui, catatan) dan meminta konfirmasi.
4. Pilih mode:
   - **Gabung** (bawaan): siswa dicocokkan berdasarkan NISN. Foto, nilai, dan dokumen yang sudah diisi dipertahankan.
   - **Ganti seluruh data siswa** (centang kotaknya): data siswa lama dihapus, diganti isi file. Cocok untuk impor pertama.
5. Data tersimpan dan ikut dikirim ke Google Drive.

## Data siswa dan keamanan

- Kode di GitHub **tidak berisi data siswa**. Data hanya ada di Google Drive Anda dan di peramban yang dipakai.
- Folder `public/assets/aistudio/` (PDF pratinjau register) dan `.env.local` diabaikan git. Jangan diunggah lewat
  tombol "Upload files" di web GitHub karena cara itu tidak menghormati `.gitignore`.
- Pratinjau PDF di menu Register dan Buku Klapper hanya tampil di komputer yang memiliki berkas PDF itu.
  Di situs online, tabelnya tetap terisi dari data siswa.
- Layar login aplikasi **bukan** pembatas keamanan: ia menerima isian apa saja. Perlindungan data yang sebenarnya
  ada pada akun Google pemilik folder Drive. Orang lain yang membuka situs dan masuk dengan akun Googlenya
  sendiri hanya melihat Drive miliknya, yaitu kosong.
- Karena scope `drive.file`, setiap pengguna hanya melihat folder yang dibuat oleh akunnya sendiri.
  Bila 3 sampai 5 petugas memakai aplikasi, pakai satu akun Google sekolah bersama.
- Fitur yang masih berupa tampilan contoh (belum memproses apa pun): **Upload Foto Massal (zip)**.

## Batasan yang perlu diketahui

- Token Google berlaku sekitar 1 jam dan tidak disimpan di peramban. Setelah menutup tab atau memuat ulang,
  klik **Hubungkan Google Drive** sekali lagi.
- Data masih berjalan lewat localStorage peramban (batas sekitar 5 MB). Foto siswa yang tersimpan sebagai
  data base64 cepat memakan ruang itu. Kompres foto (sekitar 30 KB per foto) atau, untuk ratusan foto,
  pindahkan foto ke berkas terpisah di Drive pada tahap berikutnya.
- Dua orang yang mengedit bersamaan di perangkat berbeda: yang terakhir menyimpan menang,
  dengan pilihan manual saat terjadi konflik. Cadangan harian ada di folder Cadangan.
