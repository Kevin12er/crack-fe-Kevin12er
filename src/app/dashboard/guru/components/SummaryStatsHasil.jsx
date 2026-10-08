"use client";
import Link from "next/link";

export default function SummaryStatsHasil({ dataHasil = [], loading = true }) {
  // Calculate stats
  const jumlahSiswaUnik = new Set(
    dataHasil.map((item) => item.nama).filter(Boolean),
  ).size;

  const lulusCount = dataHasil.filter(
    (s) => !s.needsEvaluation && s.nilai >= 75,
  ).length;

  const perluEvaluasiCount = dataHasil.filter((s) => s.needsEvaluation).length;

  // Extract pending results (yang perlu evaluasi)
  const pendingResults = dataHasil
    .filter((item) => item.needsEvaluation)
    .slice(0, 3); // Limit to 3 most recent

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-line p-5 rounded-2xl">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Total Siswa
          </span>
          <h3 className="text-3xl font-bold text-primary mt-2">
            {loading ? "..." : jumlahSiswaUnik}
          </h3>
          <p className="text-xs text-secondary mt-1">
            yang telah mengerjakan ujian
          </p>
        </div>

        <div className="bg-surface border border-line p-5 rounded-2xl">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Siswa Lulus
          </span>
          <h3 className="text-3xl font-bold text-brand mt-2">
            {loading ? "..." : lulusCount}
          </h3>
          <p className="text-xs text-secondary mt-1">dengan nilai ≥ 75</p>
        </div>

        <div className="bg-surface border border-line p-5 rounded-2xl">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Perlu Evaluasi
          </span>
          <h3 className="text-3xl font-bold text-amber-500 mt-2">
            {loading ? "..." : perluEvaluasiCount}
          </h3>
          <p className="text-xs text-secondary mt-1">menunggu penilaian guru</p>
        </div>
      </div>

      {/* Pending Section */}
      {perluEvaluasiCount > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-primary flex items-center gap-2">
              🔔 Perlu Evaluasi Segera ({perluEvaluasiCount})
            </h3>
            <Link
              href="/dashboard/guru/hasil"
              className="text-xs font-semibold text-amber-600 hover:underline"
            >
              Lihat Semua →
            </Link>
          </div>

          {loading ? (
            <div className="text-xs text-secondary">Memuat data...</div>
          ) : pendingResults.length > 0 ? (
            <ul className="space-y-2">
              {pendingResults.map((item, idx) => (
                <li
                  key={item.id || idx}
                  className="text-sm text-primary pl-3 border-l-2 border-amber-500"
                >
                  <span className="font-semibold">{item.nama}</span>
                  <span className="text-secondary"> - {item.judulKuis}</span>
                  <span className="text-amber-600 text-xs ml-2">
                    ⏳ Pending
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
}
