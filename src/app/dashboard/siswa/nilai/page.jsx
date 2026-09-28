// src/app/dashboard/siswa/nilai/page.jsx
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

      // 1. Ambil data attempt siswa dan daftar kuis dari backend NestJS
      const [attemptsData, quizzesData] = await Promise.all([
        fetchApi("/quiz-attempts/my-attempts").catch(() =>
          fetchApi("/quiz-attempts").catch(() => [])
        ),
        fetchApi("/quizzes").catch(() => []),
      ]);

      const rawAttempts = Array.isArray(attemptsData) ? attemptsData : [];
      const quizList = Array.isArray(quizzesData) ? quizzesData : [];

      // 2. Map dari riwayat pengerjaan (Attempt)
      const formattedData = rawAttempts.map((attempt) => {
        const relatedQuiz = quizList.find(
          (q) => String(q.id) === String(attempt.quizId || attempt.quiz?.id)
        );

        const quizTitle =
          attempt.quiz?.title || relatedQuiz?.title || "Kuis Evaluasi";
        const topikName =
          attempt.quiz?.course?.title ||
          attempt.quiz?.course?.name ||
          relatedQuiz?.course?.title ||
          relatedQuiz?.course?.name ||
          "Matematika SMK";

        // ✅ PERBAIKAN CEK STATUS & SCORE NULL:
        const rawScore = attempt.score ?? attempt.result?.score;
        const currentStatus =
          attempt.status || attempt.result?.status || (rawScore === null ? "SUBMITTED" : "GRADED");

        // Dianggap submitted/perlu evaluasi jika statusnya SUBMITTED atau nilainya masih NULL/undefined
        const isSubmitted =
          currentStatus === "SUBMITTED" || rawScore === null || rawScore === undefined;

        const score =
          typeof rawScore === "number" ? Math.round(rawScore) : 0;

        const rawDate = attempt.submittedAt || attempt.createdAt;
        const formattedDate = rawDate
          ? new Date(rawDate).toISOString().split("T")[0]
          : "-";

        return {
          id: attempt.id,
          quizId: attempt.quizId || attempt.quiz?.id,
          topik: topikName,
          judul: quizTitle,
          nilai: score,
          statusAttempt: currentStatus,
          isSubmitted: isSubmitted,
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

  // Statistik hanya menghitung yang sudah GRADED
  const itemGraded = useMemo(
    () => riwayatNilai.filter((item) => !item.isSubmitted),
    [riwayatNilai]
  );

  const totalDikerjakan = riwayatNilai.length;

  const totalLulus = useMemo(
    () => itemGraded.filter((item) => item.nilai >= 75).length,
    [itemGraded]
  );

  const rataRata = useMemo(() => {
    if (itemGraded.length === 0) return 0;
    const sum = itemGraded.reduce((acc, item) => acc + item.nilai, 0);
    return Math.round(sum / itemGraded.length);
  }, [itemGraded]);

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
        {/* Header Section */}
        <div className="flex flex-col gap-3 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold md:text-3xl">
              Nilai <span className="text-brand">Saya</span>
            </h1>
            <p className="mt-1 text-sm text-secondary">
              Pantau nilai kuis dan evaluasi pembelajaran Anda secara terstruktur.
            </p>
          </div>

          <Link
            href="/dashboard/siswa"
            className="w-fit rounded-xl border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-bold text-brand transition-colors hover:bg-brand/20"
          >
            &larr; Kembali ke Dashboard
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Rata-rata Nilai
            </p>
            <h3 className="mt-2 text-3xl font-extrabold text-brand">
              {rataRata}
            </h3>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Kuis Dikerjakan
            </p>
            <h3 className="mt-2 text-3xl font-extrabold text-primary">
              {totalDikerjakan}
            </h3>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Lulus (&gt;= 75)
            </p>
            <h3 className="mt-2 text-3xl font-extrabold text-brand">
              {totalLulus}
            </h3>
          </div>
        </div>

        {/* Baris Filter & Informasi Ringkas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-secondary">
              Filter Topik:
            </label>
            <select
              value={selectedTopik}
              onChange={(event) => setSelectedTopik(event.target.value)}
              className="rounded-xl border border-line bg-base px-3 py-1.5 text-xs font-medium text-primary focus:border-brand focus:outline-none transition-colors"
            >
              <option value="Semua">Semua Topik ({riwayatNilai.length})</option>
              {daftarTopik.map((topik, idx) => (
                <option key={idx} value={topik}>
                  {topik}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-secondary font-medium">
            Menampilkan <span className="font-bold text-primary">{hasilFiltered.length}</span> dari <span className="font-bold text-primary">{riwayatNilai.length}</span> kuis
          </div>
        </div>

        {/* Card Tabel Nilai dengan Scrollable Wrapper */}
        <div className="rounded-2xl border border-line bg-surface shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs font-semibold text-secondary">
              Memuat data nilai dari server...
            </div>
          ) : (
            /* Pembatas tinggi maksimal agar tabel tidak terlalu panjang ke bawah */
            <div className="max-h-105 overflow-y-auto overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-line bg-base text-xs uppercase tracking-wider text-secondary font-bold shadow-xs">
                  <tr>
                    <th className="px-5 py-3.5">Topik</th>
                    <th className="px-5 py-3.5">Kuis</th>
                    <th className="px-5 py-3.5">Tanggal</th>
                    <th className="px-5 py-3.5">Nilai</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {hasilFiltered.map((item) => {
                    let statusBadge = "Lulus";
                    let badgeStyle = "border border-brand/30 bg-brand/10 text-brand";

                    if (item.isSubmitted) {
                      statusBadge = "⏳ Menunggu Evaluasi Guru";
                      badgeStyle = "border border-amber-500/30 bg-amber-500/10 text-amber-500";
                    } else if (item.nilai < 75) {
                      statusBadge = "Remedial";
                      badgeStyle = "border border-av-red/30 bg-av-red/10 text-av-red";
                    }

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-base/40 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-medium text-secondary text-xs">
                          {item.topik}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-primary">
                          {item.judul}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-secondary font-mono">
                          {item.tanggal}
                        </td>
                        <td className="px-5 py-3.5 font-extrabold text-brand">
                          {item.isSubmitted ? "-" : item.nilai}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${badgeStyle}`}
                          >
                            {statusBadge}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {hasilFiltered.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-12 text-center text-xs text-secondary font-medium"
                      >
                        Belum ada data nilai kuis yang dikerjakan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}