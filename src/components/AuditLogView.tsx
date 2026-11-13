import React, { useState } from 'react';
import { AuditLogItem } from '../types';
import { Clock, Trash2, ArrowLeft, Search, User } from 'lucide-react';

interface AuditLogViewProps {
  logs: AuditLogItem[];
  onClearLogs: () => void;
  onBackToSettings: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  logs,
  onClearLogs,
  onBackToSettings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.ipAddress.includes(searchQuery)
  );

  return (
    <section className="space-y-6">
      {/* Title & Actions as in PDF Page 1 & 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Audit Log Sistem</h1>
          <p className="text-xs text-sky-700 font-semibold flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3.5 h-3.5" /> Audit Log System & Rekam Jejak Aktivitas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Bersihkan seluruh catatan riwayat audit log?')) {
                onClearLogs();
              }
            }}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" /> Bersihkan Audit Log
          </button>
          <button
            onClick={onBackToSettings}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Pengaturan
          </button>
        </div>
      </div>

      {/* Search Bar as in PDF */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Cari Log:</span>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik kata kunci log..."
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Table matching PDF Page 1 & 2 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3 w-10 text-center">NO</th>
                <th className="p-3 w-40">WAKTU</th>
                <th className="p-3 w-44">PENGGUNA</th>
                <th className="p-3 w-48 text-center">AKSI / EVENT</th>
                <th className="p-3">DESKRIPSI RINCIAN</th>
                <th className="p-3 w-32 text-right">IP ADDRESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                    Tidak ada catatan riwayat audit log.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 text-center text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="p-3 text-slate-600">{log.timestamp}</td>
                    <td className="p-3 font-sans">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{log.user}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{log.role}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-bold text-[10px] uppercase shadow-2xs tracking-wider inline-block">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-sans text-slate-700 font-medium">
                      {log.target}
                    </td>
                    <td className="p-3 text-right text-rose-500 font-bold">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan 1 sampai {filteredLogs.length} dari {filteredLogs.length} log</span>
          <div className="flex items-center gap-1">
            <span className="px-2.5 py-1 bg-sky-600 text-white font-bold rounded text-xs">1</span>
          </div>
        </div>
      </div>
    </section>
  );
};
