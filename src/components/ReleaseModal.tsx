import React from 'react';
import { Sparkles, Shield, GraduationCap, Printer, X, Check } from 'lucide-react';

interface ReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReleaseModal: React.FC<ReleaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto text-xl mb-2.5 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Apa yang Baru di Versi 1.2.0?</h3>
          <p className="text-xs text-slate-500">Pembaruan sistem buku induk digital sekolah resmi</p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-600" /> Role-Based Access Control (RBAC)
            </div>
            <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
              Implementasi matriks izin menu yang ketat untuk administrator, operator Dapodik, dan wali kelas.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-600" /> Integrasi Kurikulum Merdeka
            </div>
            <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
              Penambahan deskripsi capaian pembelajaran Fase E dan Fase F serta rekapitulasi penilaian projek P5.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Printer className="w-4 h-4 text-emerald-600" /> Format Cetak A4 Kemendikbudristek
            </div>
            <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
              Sampul Jilid Luar Buffalo, Cover Dalam Identitas Sekolah, Lembar Biodata Standar, dan Buku Klapper Alfabetis A-Z.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/30 transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" /> SIAP, LANJUTKAN BEKERJA!
        </button>
      </div>
    </div>
  );
};
