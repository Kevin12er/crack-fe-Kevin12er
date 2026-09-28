// src/app/dashboard/guru/components/TabelHasilSiswa.jsx
"use client";
import Link from "next/link";

export default function TabelHasilSiswa({ dataHasil = [] }) {
  // Hitung jumlah unik siswa dengan perlindungan nama undefined/null
  const jumlahSiswaUnik = new Set(
    dataHasil
      .map((item) => item.nama || item.studentName || item.userName)
      .filter(Boolean)
  ).size;

  return (
    <div className="rounded-2xl border border-line bg-surface font-jakarta overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-line">
        <div>
          <h2 className="text-lg font-bold text-brand">
            Rekap Hasil Ujian Siswa
          </h2>
          <p className="mt-0.5 text-xs text-secondary">
            Daftar siswa yang telah menyelesaikan evaluasi
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-brand-ring bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            Total: {jumlahSiswaUnik} Siswa
          </span>
          <Link
            href="/dashboard/guru/hasil"
            className="flex items-center gap-1 rounded-lg border border-brand-ring bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:underline"
          >
            Lihat Semua siswa &rarr;
          </Link>
        </div>
      </div>

      <div className="max-h-87.5 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-line bg-base text-xs font-semibold uppercase tracking-wider text-secondary">
            <tr>
              <th className="p-4">Nama Siswa</th>
              <th className="p-4">Mata Pelajaran</th>
              <th className="p-4">Nama Kuis</th>
              <th className="p-4">Nilai</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {dataHasil.map((item, idx) => {
              // Ambil raw score dari berbagai kemungkinan field
              const rawScore =
                item.nilai ?? item.score ?? item.rawScore ?? null;

              // Logika presisi pemicu PERLU EVALUASI
              const needsEval =
                item.needsEvaluation === true ||
                item.status === "SUBMITTED" ||
                item.statusAttempt === "SUBMITTED" ||
                item.attemptStatus === "SUBMITTED" ||
                item.attempt?.status === "SUBMITTED" ||
                rawScore === null ||
                rawScore === undefined;

              const numericScore =
                typeof rawScore === "number" ? Math.round(rawScore) : null;
              const isPassed = numericScore !== null && numericScore >= 75;

              return (
                <tr
                  key={item.id || item.attemptId || idx}
                  className="transition-colors hover:bg-base/50"
                >
                  <td className="p-4 font-semibold text-primary">
                    {item.nama || "Siswa"}
                  </td>
                  <td className="p-4 text-secondary">
                    {item.mapel || "Mata Pelajaran"}
                  </td>
                  <td className="p-4 text-secondary">
                    {item.judulKuis || "Kuis"}
                  </td>

                  {/* Kolom Nilai */}
                  <td className="p-4 font-bold text-brand">
                    {needsEval ? (
                      <span className="text-xs font-semibold text-amber-500">
                        Pending
                      </span>
                    ) : (
                      numericScore ?? "-"
                    )}
                  </td>

                  {/* Kolom Status */}
                  <td className="p-4">
                    {needsEval ? (
                      <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-500">
                        PERLU EVALUASI
                      </span>
                    ) : (
                      <span
                        className={`rounded-md border px-2.5 py-1 text-[10px] font-bold ${
                          isPassed
                            ? "border-brand-ring bg-brand-soft text-brand"
                            : "border-red-900 bg-red-950/40 text-av-red"
                        }`}
                      >
                        {isPassed ? "LULUS" : "REMEDIAL"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

            {dataHasil.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xs text-muted">
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