import React, { useState } from 'react';
import { Copy, Check, FileText, Download, Sparkles, BookOpen } from 'lucide-react';

export const TemplateDokumenView: React.FC = () => {
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const tags = [
    {
      tag: '${nama_lengkap}',
      label: 'Nama Lengkap Peserta Didik',
      example: 'Ahmad Hidayat',
      category: 'Identitas Siswa',
    },
    {
      tag: '${nisn}',
      label: 'Nomor Induk Siswa Nasional (10 Digit)',
      example: '0081000017',
      category: 'Identitas Siswa',
    },
    {
      tag: '${nipd}',
      label: 'Nomor Induk Peserta Didik (NIPD/NIS)',
      example: '24SMK0017',
      category: 'Identitas Siswa',
    },
    {
      tag: '${nik}',
      label: 'Nomor Induk Kependudukan (NIK KTP)',
      example: '320101100000017',
      category: 'Identitas Siswa',
    },
    {
      tag: '${tempat_tanggal_lahir}',
      label: 'Tempat dan Tanggal Lahir Siswa',
      example: 'Majalengka, 20 September 2008',
      category: 'Identitas Siswa',
    },
    {
      tag: '${jurusan}',
      label: 'Program / Konsentrasi Keahlian',
      example: 'Teknik Komputer dan Jaringan',
      category: 'Akademik',
    },
    {
      tag: '${kelas}',
      label: 'Rombongan Belajar / Tingkat',
      example: 'XI TKJ 1',
      category: 'Akademik',
    },
    {
      tag: '${rata_rata_nilai}',
      label: 'Rata-rata Akumulasi Nilai Rapor',
      example: '88.50',
      category: 'Akademik',
    },
    {
      tag: '${nama_ayah}',
      label: 'Nama Ayah Kandung',
      example: 'Budi Santoso',
      category: 'Orang Tua',
    },
    {
      tag: '${nama_ibu}',
      label: 'Nama Ibu Kandung',
      example: 'Siti Aminah',
      category: 'Orang Tua',
    },
    {
      tag: '${alamat_siswa}',
      label: 'Alamat Domisili Siswa Lengkap',
      example: 'Jl. Merdeka No. 93, Majalengka',
      category: 'Tempat Tinggal',
    },
    {
      tag: '${nama_sekolah}',
      label: 'Nama Resmi Instansi Sekolah',
      example: 'SMK NEGERI 1 DEMO NUSANTARA',
      category: 'Instansi',
    },
    {
      tag: '${nama_kepsek}',
      label: 'Nama Kepala Sekolah & Gelar',
      example: 'Dr. H. Ahmad Dahlan, M.Pd.',
      category: 'Instansi',
    },
    {
      tag: '${nip_kepsek}',
      label: 'NIP Resmi Kepala Sekolah',
      example: '19750817 200003 1 001',
      category: 'Instansi',
    },
    {
      tag: '${titimangsa_surat}',
      label: 'Titimangsa Kota & Tanggal Pengesahan',
      example: 'Majalengka, 25 Oktober 2026',
      category: 'Format Surat',
    },
  ];

  const handleCopy = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleDownloadSample = () => {
    const sampleText = `SURAT KETERANGAN LULUS (SKL)
Nomor: 421.5/SKL/${'${tahun_ajaran}'}/SMKN1
TENTANG KELULUSAN PESERTA DIDIK TAHUN AJARAN \${tahun_ajaran}

Yang bertanda tangan di bawah ini Kepala \${nama_sekolah}, menerangkan bahwa:

Nama Lengkap          : \${nama_lengkap}
Nomor Induk Siswa     : \${nipd}
NISN                  : \${nisn}
Tempat, Tanggal Lahir : \${tempat_tanggal_lahir}
Program Keahlian      : \${jurusan}
Nama Orang Tua        : \${nama_ayah} / \${nama_ibu}

Dinyatakan telah memenuhi seluruh kriteria kelulusan dan dinyatakan:
                                LULUS
dengan nilai rata-rata akumulasi prestasi: \${rata_rata_nilai}

Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.

\${titimangsa_surat}
Kepala Sekolah,

\${nama_kepsek}
NIP. \${nip_kepsek}
`;

    const blob = new Blob([sampleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Template_Surat_Keterangan_Lulus_Word_Tag.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" /> Format Berkas & Tag Placeholder Word (.docx)
          </h1>
          <p className="text-xs text-slate-500">
            Salin tag dinamis di bawah ini dan tempelkan ke dokumen template Microsoft Word Anda untuk surat otomatis.
          </p>
        </div>
        <button
          onClick={handleDownloadSample}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Unduh Format Template Contoh
        </button>
      </div>

      <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl text-xs text-sky-900 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-sky-950">Cara Penggunaan Tag Dinamis:</div>
          <p className="text-sky-800 text-[11px] mt-0.5 leading-relaxed">
            Klik tombol salin pada tag yang Anda inginkan, lalu buka file <code>.docx</code> Anda (seperti Surat Keterangan Lulus atau Surat Keterangan Pindah Sekolah), dan lakukan <em>Paste</em> tag tersebut. Sistem otomatis menggantikan nilai sesuai biodata buku induk setiap siswa!
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          Daftar Tag Placeholder Otomatis Terdaftar
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tags.map((item) => {
            const isCopied = copiedTag === item.tag;
            return (
              <div
                key={item.tag}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-sky-300 hover:bg-sky-50/30 transition group"
              >
                <div className="overflow-hidden pr-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <code className="bg-slate-200 group-hover:bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono font-bold text-xs">
                      {item.tag}
                    </code>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-800 truncate" title={item.label}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Contoh: {item.example}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(item.tag)}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-sky-600 hover:border-sky-400'
                  }`}
                  title="Salin Tag"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
