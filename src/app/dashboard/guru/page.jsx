"use client";

import Navbar from "@/app/components/layout/Navbar";
import FormTambahSoal from "./components/FormTambahSoal";
import TabelHasilSiswa from "./components/TabelHasilSiswa";
import SummaryStatsHasil from "./components/SummaryStatsHasil";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import { fetchApi } from "@/lib/api";

export default function DashboardGuruPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [daftarSoal, setDaftarSoal] = useState([]);
  const [loadingSoal, setLoadingSoal] = useState(true);

  const [quizzes, setQuizzes] = useState([]);

  // State dynamic untuk rekap hasil pengerjaan siswa
  const [dataHasil, setDataHasil] = useState([]);
  const [loadingHasil, setLoadingHasil] = useState(true);

  // Normalisasi role
  const userRole = String(user?.role || "").toUpperCase();
  const isGuru = userRole === "INSTRUCTOR" || userRole === "GURU";

  const hasLoadedDashboard = useRef(false);

  // 1. Fungsi mengambil daftar soal dari backend
  const loadQuestions = useCallback(async () => {
    try {
      setLoadingSoal(true);

      // quiz-questions sekarang sudah membawa data quiz.title
      // sehingga tidak perlu request /quizzes lagi.
      const questionsData = await fetchApi("/quiz-questions");

      const questions = Array.isArray(questionsData) ? questionsData : [];

      const allQuestions = questions.map((q) => ({
        ...q,
        quizTitle: q.quiz?.title || "Bank Soal",
      }));

      setDaftarSoal(allQuestions);
    } catch (err) {
      console.warn("Gagal mengambil data bank soal:", err);
      setDaftarSoal([]);
    } finally {
      setLoadingSoal(false);
    }
  }, []);

  const loadQuizzes = useCallback(async () => {
    try {
      const quizData = await fetchApi("/quizzes");
      setQuizzes(Array.isArray(quizData) ? quizData : []);
    } catch (err) {
      console.warn("Gagal mengambil daftar kuis:", err);
      setQuizzes([]);
    }
  }, []);

  // 2. Fungsi mengambil rekap hasil ujian siswa + stats
  const loadResults = useCallback(async () => {
    try {
      setLoadingHasil(true);

      // Fetch recent 10 results untuk dashboard (opsional sort by pending first)
      const results = await fetchApi("/results?limit=10&sort=recent").catch(
        () => ({ data: [], total: 0, passed: 0, pending: 0 }),
      );

      const rawAllData = Array.isArray(results) ? results : results?.data || [];

      const formattedResults = rawAllData.map((res, idx) => {
        const studentObj = res.student || res.user;

        const namaSiswa =
          studentObj?.name || res.studentName || res.userName || "Siswa";

        // Course / Mata Pelajaran
        const namaMapel =
          res.quiz?.course?.title ||
          res.quiz?.course?.name ||
          res.course?.title ||
          res.course?.name ||
          "Matematika SMK";

        // Judul Kuis
        const judulKuis =
          res.quiz?.title || res.quizTitle || res.title || "Bank Soal Evaluasi";

        // Ambil score asli: null jangan di-fallback ke 0
        const rawScore =
          res.score ??
          res.nilai ??
          res.scoreObtained ??
          res.attempt?.score ??
          null;

        // Cek status pengerjaan dari attempt
        const statusAttempt =
          res.status || res.attempt?.status || res.statusAttempt;

        // Pemicu presisi status PERLU EVALUASI
        const needsEvaluation =
          statusAttempt === "SUBMITTED" ||
          res.attempt?.status === "SUBMITTED" ||
          rawScore === null ||
          rawScore === undefined;

        const validAttemptId =
          res.attemptId || res.quizAttemptId || res.attempt?.id;

        return {
          id: res.id || idx + 1,
          attemptId: validAttemptId,
          nama: namaSiswa,
          mapel: namaMapel,
          judulKuis: judulKuis,
          tanggal: res.createdAt
            ? new Date(res.createdAt).toISOString().split("T")[0]
            : "-",

          // Jika butuh evaluasi, nilai wajib null.
          // Jika sudah dinilai, baru di-round.
          nilai: needsEvaluation
            ? null
            : typeof rawScore === "number"
              ? Math.round(rawScore)
              : null,

          statusAttempt: statusAttempt,
          needsEvaluation: needsEvaluation,
        };
      });

      setDataHasil(formattedResults);
    } catch (err) {
      console.warn("Gagal mengambil hasil ujian siswa:", err);
      setDataHasil([]);
    } finally {
      setLoadingHasil(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isGuru) {
      router.replace("/dashboard/siswa");
      return;
    }

    if (hasLoadedDashboard.current) {
      return;
    }

    hasLoadedDashboard.current = true;

    loadQuizzes();
    loadQuestions();
    loadResults();
  }, [isAuthenticated, isGuru, router, loadQuestions, loadResults]);

  if (!isAuthenticated || !isGuru) {
    return null;
  }

  // Dipanggil saat FormTambahSoal selesai menyimpan soal baru
  const handleTambahSoal = () => {
    loadQuestions();
  };

  // Hitung jumlah siswa UNIK untuk kartu statistik
  const jumlahSiswaUnik = new Set(dataHasil.map((item) => item.nama)).size;

  // Rata-rata nilai
  // HANYA menghitung siswa yang SUDAH dinilai / bukan null
  const dataSudahDinilai = dataHasil.filter(
    (item) => !item.needsEvaluation && typeof item.nilai === "number",
  );

  const rataRataNilai =
    dataSudahDinilai.length > 0
      ? Math.round(
          dataSudahDinilai.reduce((acc, curr) => acc + curr.nilai, 0) /
            dataSudahDinilai.length,
        )
      : 0;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-base p-4 text-primary font-jakarta md:p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header Dashboard Guru */}
          <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-primary md:text-3xl">
                Dashboard <span className="text-brand">Guru</span>
              </h1>

              <p className="mt-1 text-sm text-secondary">
                Kelola evaluasi, bank soal, dan pantau hasil ujian siswa SMK.
              </p>
            </div>

            <div>
              <span className="rounded-lg border border-brand-ring bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand">
                Status: Pengajar
              </span>
            </div>
          </div>

          {/* Ringkasan Statistik Guru */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Total Soal Buatan
              </p>

              <h3 className="mt-1 text-2xl font-bold text-brand">
                {daftarSoal.length} Soal
              </h3>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Siswa Mengerjakan
              </p>

              <h3 className="mt-1 text-2xl font-bold text-primary">
                {loadingHasil ? "..." : `${jumlahSiswaUnik} Siswa`}
              </h3>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Rata-rata Nilai
              </p>

              <h3 className="mt-1 text-2xl font-bold text-av-amber">
                {loadingHasil ? "..." : rataRataNilai}
              </h3>
            </div>
          </div>

          {/* Section Utama: Form & Rekap Bank Soal */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <FormTambahSoal
                onTambahSoal={handleTambahSoal}
                quizzes={quizzes}
              />
            </div>

            <div className="space-y-6 lg:col-span-7">
              {/* Summary Stats & Pending Section */}
              <SummaryStatsHasil dataHasil={dataHasil} loading={loadingHasil} />

              {/* Tabel Hasil Pengerjaan Siswa */}
              <TabelHasilSiswa dataHasil={dataHasil} loading={loadingHasil} />

              {/* Ringkasan Bank Soal Terakhir */}
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="text-md mb-3 font-bold text-primary">
                  Bank Soal Terakhir Ditambahkan
                </h3>

                <div className="space-y-2">
                  {loadingSoal ? (
                    <div className="py-4 text-center text-xs font-medium text-secondary">
                      Memuat bank soal...
                    </div>
                  ) : daftarSoal.length > 0 ? (
                    daftarSoal
                      .slice(-5)
                      .reverse()
                      .map((item, idx) => {
                        const teksPertanyaan =
                          item.questionText ||
                          item.question ||
                          item.pertanyaan ||
                          "Soal Tanpa Judul";

                        const namaPelajarannya =
                          item.quizTitle || item.mapel || "Bank Soal Umum";

                        return (
                          <div
                            key={item.id || idx}
                            className="flex items-center justify-between gap-2 rounded-xl border border-line bg-base p-3 text-xs"
                          >
                            <span className="max-w-62.5 truncate font-medium md:max-w-[320px]">
                              {idx + 1}. {teksPertanyaan}
                            </span>

                            <span className="shrink-0 rounded border border-brand-ring bg-brand-soft px-2 py-0.5 font-semibold text-brand">
                              {namaPelajarannya}
                            </span>
                          </div>
                        );
                      })
                  ) : (
                    <div className="py-4 text-center text-xs text-secondary">
                      Belum ada soal di bank soal.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
