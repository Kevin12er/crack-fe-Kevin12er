"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import { fetchApi } from "@/lib/api";

export default function NilaiSiswaDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();

  const [riwayatNilai, setRiwayatNilai] = useState([]);
  const [daftarTopik, setDaftarTopik] = useState([]);
  const [selectedTopik, setSelectedTopik] = useState("Semua");
  const [loading, setLoading] = useState(true);

  const loadNilaiSiswa = useCallback(async () => {
    try {
      setLoading(true);

      // Ambil data hasil kuis dan daftar kuis dari backend NestJS
      const [resultsData, attemptsData, quizzesData] = await Promise.all([
        fetchApi("/results").catch(() => []),
        fetchApi("/quiz-attempts").catch(() => []),
        fetchApi("/quizzes").catch(() => []),
      ]);

      const rawResults = Array.isArray(resultsData) ? resultsData : [];
      const rawAttempts = Array.isArray(attemptsData) ? attemptsData : [];
      const quizList = Array.isArray(quizzesData) ? quizzesData : [];

      // Gabungkan riwayat dari /results dan /quiz-attempts
      const allHistory = [...rawResults, ...rawAttempts];

      const formattedData = quizList.map((quiz) => {
        // Cari riwayat pengerjaan yang cocok dengan ID Kuis
        const userResult = allHistory.find((r) => {
          const rQuizId = r.quizId || r.quiz?.id;
          return String(rQuizId) === String(quiz.id);
        });

        const topikName =
          quiz.course?.name || quiz.course?.title || "Matematika Dasar SMK";

        const isDone = Boolean(userResult);
        
        // Pembulatan angka agar 33.33333333333333 menjadi 33
        const rawScore = userResult?.score ?? userResult?.nilai ?? userResult?.scoreObtained ?? 0;
        const score = isDone ? Math.round(Number(rawScore)) : 0;

        const rawDate = userResult?.createdAt || userResult?.updatedAt;
        const formattedDate = rawDate
          ? new Date(rawDate).toISOString().split("T")[0]
          : "-";

        return {
          id: quiz.id,
          topik: topikName,
          judul: quiz.title || "Kuis Evaluasi",
          nilai: score,
          dikerjakan: isDone,
          tanggal: formattedDate,
        };
      });

      setRiwayatNilai(formattedData);

      const topiks = Array.from(
        new Set(formattedData.map((item) => item.topik))
      );
      setDaftarTopik(topiks);
    } catch (err) {
      console.error("Gagal memuat riwayat nilai:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "STUDENT") {
      router.replace("/dashboard/guru");
      return;
    }

    loadNilaiSiswa();
  }, [isHydrated, isAuthenticated, user, router, loadNilaiSiswa]);

  const hasilFiltered = useMemo(() => {
    if (selectedTopik === "Semua") return riwayatNilai;
    return riwayatNilai.filter((item) => item.topik === selectedTopik);
  }, [selectedTopik, riwayatNilai]);

  const itemDikerjakan = useMemo(
    () => riwayatNilai.filter((item) => item.dikerjakan),
    [riwayatNilai]
  );

  const totalDikerjakan = itemDikerjakan.length;
  const totalLulus = useMemo(
    () => itemDikerjakan.filter((item) => item.nilai >= 75).length,
    [itemDikerjakan]
  );

  const rataRata = useMemo(() => {
    if (totalDikerjakan === 0) return 0;
    const sum = itemDikerjakan.reduce((acc, item) => acc + item.nilai, 0);
    return Math.round(sum / totalDikerjakan);
  }, [totalDikerjakan, itemDikerjakan]);

  if (!isHydrated || !isAuthenticated || user?.role !== "STUDENT") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base font-jakarta text-xs font-semibold text-secondary">
        Memverifikasi Sesi LearnBridge...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-base p-4 text-primary font-jakarta md:p-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold md:text-3xl">
              Nilai <span className="text-brand">Saya</span>
            </h1>
            <p className="mt-1 text-sm text-secondary">
              Pantau nilai kuis dan evaluasi pembelajaran Matematika Anda secara terstruktur.
            </p>
          </div>

          <Link
            href="/dashboard/siswa"
            className="w-fit rounded-xl border border-brand-ring bg-brand-soft px-4 py-2 text-xs font-bold text-brand transition-colors hover:bg-brand/20"
          >
            &larr; Kembali ke Dashboard
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Rata-rata Nilai
            </p>
            <h3 className="mt-2 text-3xl font-extrabold text-brand">
              {rataRata}
            </h3>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Latihan Dikerjakan
            </p>
            <h3 className="mt-2 text-3xl font-extrabold text-primary">
              {totalDikerjakan}
            </h3>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Lulus (&gt;= 75)
            </p>
            <h3 className="mt-2 text-3xl font-extrabold text-av-blue">
              {totalLulus}
            </h3>
          </div>
        </div>

        {/* Filter Topik */}
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
          <label className="text-xs font-semibold text-secondary">
            Topik:
          </label>
          <select
            value={selectedTopik}
            onChange={(event) => setSelectedTopik(event.target.value)}
            className="rounded-xl border border-line bg-base px-3 py-2 text-xs text-primary focus:border-brand focus:outline-none"
          >
            <option value="Semua">Semua Topik</option>
            {daftarTopik.map((topik, idx) => (
              <option key={idx} value={topik}>
                {topik}
              </option>
            ))}
          </select>
        </div>

        {/* Tabel Nilai */}
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          {loading ? (
            <div className="p-8 text-center text-xs font-semibold text-secondary">
              Memuat data nilai dari server...
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-base text-xs uppercase tracking-wider text-secondary">
                <tr>
                  <th className="p-4">Topik</th>
                  <th className="p-4">Latihan / Kuis</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Nilai</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {hasilFiltered.map((item) => {
                  const status = !item.dikerjakan
                    ? "Belum Dikerjakan"
                    : item.nilai >= 75
                      ? "Lulus"
                      : "Remedial";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-base/40 transition-colors"
                    >
                      <td className="p-4 text-secondary">{item.topik}</td>
                      <td className="p-4 font-semibold text-primary">
                        {item.judul}
                      </td>
                      <td className="p-4 text-xs text-secondary">
                        {item.tanggal}
                      </td>
                      <td className="p-4 font-extrabold text-brand">
                        {!item.dikerjakan ? "-" : item.nilai}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            status === "Lulus"
                              ? "border border-brand-ring bg-brand-soft text-brand"
                              : status === "Remedial"
                                ? "border border-av-red/40 bg-red-950/40 text-av-red"
                                : "border border-line bg-base text-secondary"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {hasilFiltered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-xs text-muted"
                    >
                      Belum ada data nilai untuk topik yang dipilih.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}