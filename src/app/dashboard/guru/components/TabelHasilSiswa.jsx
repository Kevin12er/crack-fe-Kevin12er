"use client";
import Link from "next/link";

export default function TabelHasilSiswa({ dataHasil = [] }) {
  return (
    <div className="bg-surface border border-line rounded-2xl overflow-hidden font-jakarta">

        <Link
          href="/dashboard/guru/hasil"
          className="text-xs  mt-4 ml-4 font-semibold w-fit font-jakarta text-brand hover:underline flex items-center gap-1 bg-brand-soft border border-brand-ring px-3 py-1.5 rounded-lg transition-colors"
        >
          Lihat Semua siswa &rarr;
        </Link>

      <div className="p-5 border-b border-line flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-brand">Rekap Hasil Ujian Siswa</h2>
          <p className="text-xs text-secondary mt-0.5">
            Daftar siswa yang telah menyelesaikan evaluasi
          </p>
        </div>
        <span className="text-xs font-semibold bg-brand-soft text-brand border border-brand-ring px-3 py-1 rounded-full">
          Total: {dataHasil.length} Siswa
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-base border-b border-line text-xs font-semibold text-secondary uppercase tracking-wider">
            <tr>
              <th className="p-4">Nama Siswa</th>
              <th className="p-4">Kelas</th>
              <th className="p-4">Mata Pelajaran</th>
              <th className="p-4">Nilai</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {dataHasil.map((item) => (
              <tr key={item.id} className="hover:bg-base/50 transition-colors">
                <td className="p-4 font-semibold text-primary">{item.nama}</td>
                <td className="p-4 text-secondary">{item.kelas}</td>
                <td className="p-4 text-secondary">{item.mapel}</td>
                <td className="p-4 font-bold text-brand">{item.nilai}</td>
                <td className="p-4">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                      item.nilai >= 75
                        ? "bg-brand-soft text-brand border-brand-ring"
                        : "bg-red-950/40 text-av-red border-red-900"
                    }`}
                  >
                    {item.nilai >= 75 ? "LULUS" : "REMEDIAL"}
                  </span>
                </td>
              </tr>
            ))}

            {dataHasil.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-8 text-xs text-muted">
                  Belum ada siswa yang mengerjakan ujian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}