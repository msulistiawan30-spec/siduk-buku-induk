import React, { useState, useEffect } from 'react';
import { SchoolSettings } from '../types';
import {
  Printer,
  Plus,
  X,
  Search,
  Calendar,
  Clock,
  MessageCircle,
  Trash2,
} from 'lucide-react';

interface BukuPemeriksaanViewProps {
  schoolSettings: SchoolSettings;
  onNavigate?: (menuKey: string) => void;
}

interface InspectionItem {
  id: string;
  date: string;
  inspectorName: string;
  inspectorNip: string;
  position: string;
  notes: string;
}

export const BukuPemeriksaanView: React.FC<BukuPemeriksaanViewProps> = ({
  schoolSettings,
  onNavigate,
}) => {
  // Live Clock State
  const [currentTime, setCurrentTime] = useState<string>('10:12:52');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now
          .toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
          .replace(/\./g, ':')
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inspections list stored in LocalStorage (initialized empty matching image_d4f00aa3.png)
  const [inspections, setInspections] = useState<InspectionItem[]>(() => {
    const saved = localStorage.getItem('siduk_inspections');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDate, setFormDate] = useState('03/11/2026');
  const [formName, setFormName] = useState('');
  const [formNip, setFormNip] = useState('');
  const [formPosition, setFormPosition] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const handleSaveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() && !formNotes.trim()) {
      setIsModalOpen(false);
      return;
    }

    const newItem: InspectionItem = {
      id: `insp-${Date.now()}`,
      date: formDate,
      inspectorName: formName.trim(),
      inspectorNip: formNip.trim(),
      position: formPosition.trim() || 'Pengawas Pembina',
      notes: formNotes.trim(),
    };

    const updated = [...inspections, newItem];
    setInspections(updated);
    localStorage.setItem('siduk_inspections', JSON.stringify(updated));

    // Reset and close modal
    setFormName('');
    setFormNip('');
    setFormPosition('');
    setFormNotes('');
    setIsModalOpen(false);
  };

  const handleDeleteInspection = (id: string) => {
    const updated = inspections.filter((item) => item.id !== id);
    setInspections(updated);
    localStorage.setItem('siduk_inspections', JSON.stringify(updated));
  };

  const handlePrint = () => {
    window.print();
  };

  // Build exactly 15 rows matching the official register sheet and PDF
  const rows = Array.from({ length: 15 }, (_, i) => {
    const item = inspections[i];
    return {
      no: i + 1,
      id: item?.id || null,
      date: item?.date || '',
      nameAndNip: item
        ? item.inspectorNip
          ? `${item.inspectorName}\nNIP. ${item.inspectorNip}`
          : item.inspectorName
        : '',
      position: item?.position || '',
      notes: item?.notes || '',
    };
  });

  const principalName = schoolSettings.principalName || 'Dr. Molyono.,M.MPd';
  const principalNip = schoolSettings.principalNip
    ? `NIP. ${schoolSettings.principalNip}`
    : 'NIP. -';

  const ktuName =
    schoolSettings.administrationHead || 'M. EKO HARIS SULISTIAWAN.,S.SOS';
  const ktuNip = schoolSettings.administrationNip
    ? `NIP. ${schoolSettings.administrationNip}`
    : 'NIP. -';

  const district = schoolSettings.district || 'Bojonegoro';

  return (
    <div className="space-y-4">
      {/* 1. Header with Title, Date, Live Clock & Trial Reminder Banner */}
      <div className="no-print space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pemeriksaan Register Buku Induk
          </h1>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-md text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-300" />
              03 Nov 2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-md text-xs font-mono font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-300" />
              {currentTime}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Card Container (Exact match to image_d4f00aa3.png) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Card Action Header */}
        <div className="px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-sky-600" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-800">
              Pemeriksaan Buku Induk Register
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#008ba3] hover:bg-[#007991] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Catatan Pemeriksaan
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#2e7d32] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak Laporan
            </button>
          </div>
        </div>

        {/* Register Sheet (Exact match to image_d4f00aa3.png and PDF Pemeriksaan_Register_Buku_Induk___Buku_Induk_075d4758.pdf) */}
        <div id="print-area" className="p-6 md:p-10 bg-white text-slate-900 font-serif">
          {/* Document Centered Title */}
          <div className="text-center mb-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-950">
              I. PEMERIKSAAN BUKU INDUK REGISTER
            </h2>
          </div>

          {/* 15-Row Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-[11px] leading-tight">
              <thead>
                <tr className="bg-white text-black font-bold text-center">
                  <th className="border border-black px-2 py-2 w-12 text-center font-bold">
                    No.
                    <br />
                    Urut
                  </th>
                  <th className="border border-black px-3 py-2 w-36 text-center font-bold">
                    Hari, Tanggal
                  </th>
                  <th className="border border-black px-4 py-2 text-center font-bold">
                    Nama & NIP Pemeriksa
                  </th>
                  <th className="border border-black px-3 py-2 w-44 text-center font-bold">
                    Jabatan
                  </th>
                  <th className="border border-black px-3 py-2 w-52 text-center font-bold">
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.no} className="h-9 hover:bg-slate-50/60 transition group">
                    <td className="border border-black px-2 py-1 text-center font-sans font-medium text-[11px]">
                      {r.no}
                    </td>
                    <td className="border border-black px-2 py-1 text-center font-sans text-[11px]">
                      {r.date}
                    </td>
                    <td className="border border-black px-3 py-1 font-sans text-[11px] whitespace-pre-line">
                      <div className="flex items-center justify-between">
                        <span>{r.nameAndNip}</span>
                        {r.id && (
                          <button
                            onClick={() => handleDeleteInspection(r.id!)}
                            className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 p-1 no-print transition"
                            title="Hapus catatan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="border border-black px-2 py-1 font-sans text-[11px]">
                      {r.position}
                    </td>
                    <td className="border border-black px-2 py-1 font-sans text-[11px] leading-snug">
                      {r.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures Area (Exact match to image_d4f00aa3.png & PDF) */}
          <div className="mt-14 flex justify-between items-start text-xs font-serif leading-normal px-2">
            {/* Left: Kepala Sekolah */}
            <div className="text-center w-64">
              <p className="text-[11px]">Mengetahui,</p>
              <p className="text-[11px] mb-16">Kepala Sekolah,</p>
              <p className="font-bold underline uppercase text-slate-950 text-[11px]">
                {principalName}
              </p>
              <p className="text-[10px] text-slate-900 mt-0.5">{principalNip}</p>
            </div>

            {/* Right: KTU */}
            <div className="text-center w-72">
              <p className="text-[11px]">
                {district}, 03 November 2026
              </p>
              <p className="text-[11px] mb-16 mt-2">Kepala Urusan Tata Usaha,</p>
              <p className="font-bold underline uppercase text-slate-950 text-[11px]">
                {ktuName}
              </p>
              <p className="text-[10px] text-slate-900 mt-0.5">{ktuNip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Modal: Tambah Catatan Pemeriksaan (Exact match to image_f00f489d.png) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header (Cyan solid background) */}
            <div className="bg-[#008ba3] px-5 py-3.5 flex items-center justify-between text-white">
              <h3 className="text-sm font-bold tracking-tight">
                Tambah Catatan Pemeriksaan
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-cyan-100 transition cursor-pointer p-0.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveInspection} className="p-5 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tanggal Pemeriksaan
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#008ba3] focus:border-[#008ba3]"
                    placeholder="03/11/2026"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Pemeriksa
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#008ba3] focus:border-[#008ba3]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  NIP Pemeriksa
                </label>
                <input
                  type="text"
                  value={formNip}
                  onChange={(e) => setFormNip(e.target.value)}
                  placeholder="Nomor Induk Pegawai"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#008ba3] focus:border-[#008ba3]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Jabatan
                </label>
                <input
                  type="text"
                  value={formPosition}
                  onChange={(e) => setFormPosition(e.target.value)}
                  placeholder="Kepala Sekolah / Pengawas"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#008ba3] focus:border-[#008ba3]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Catatan Pemeriksaan
                </label>
                <textarea
                  rows={4}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Tulis hasil pemeriksaan atau saran..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#008ba3] focus:border-[#008ba3]"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#6b7280] hover:bg-slate-600 text-white font-semibold rounded-md text-xs transition cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#008ba3] hover:bg-[#007991] text-white font-bold rounded-md text-xs shadow-xs transition cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
