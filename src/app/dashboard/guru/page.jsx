"use client";

import Navbar from "@/app/components/layout/Navbar";
import FormTambahSoal from "./components/FormTambahSoal";
import TabelHasilSiswa from "./components/TabelHasilSiswa";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import { fetchApi } from "@/lib/api";

export default function DashboardGuruPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [daftarSoal, setDaftarSoal] = useState([]);
  const [loadingSoal, setLoadingSoal] = useState(true);

  // State dynamic untuk rekap hasil pengerjaan siswa
  const [dataHasil, setDataHasil] = useState([]);
  const [loadingHasil, setLoadingHasil] = useState(true);

  // Normalisasi role
  const userRole = String(user?.role || "").toUpperCase();
  const isGuru = userRole === "INSTRUCTOR" || userRole === "GURU";

  // 1. Fungsi mengambil daftar soal dari backend
  const loadQuestions = useCallback(async () => {
    try {
      setLoadingSoal(true);

      const quizzes = await fetchApi("/quizzes");
      const quizList = Array.isArray(quizzes) ? quizzes : [];

      let allQuestions = [];

      for (const quiz of quizList) {
        if (quiz?.id) {
          try {
            const qData = await fetchApi(`/quiz-questions/quiz/${quiz.id}`);
            const questions = Array.isArray(qData) ? qData : [];

            const formattedQuestions = questions.map((q) => ({
              ...q,
              quizTitle: quiz.title || quiz.course?.title || "Bank Soal",
            }));

            allQuestions = [...allQuestions, ...formattedQuestions];
          } catch (qErr) {
            console.warn(`Gagal fetch soal untuk quiz ${quiz.id}:`, qErr);
          }
        }
      }

      setDaftarSoal(allQuestions);
    } catch (err) {
      console.warn("Gagal mengambil kuis:", err);
    } finally {
      setLoadingSoal(false);
    }
  }, []);

  // Fungsi mengambil rekap hasil ujian siswa
  const loadResults = useCallback(async () => {
    try {
      setLoadingHasil(true);

      const [results, attempts] = await Promise.all([
        fetchApi("/results").catch(() => []),
        fetchApi("/quiz-attempts").catch(() => []),
      ]);

      const resultsList = Array.isArray(results) ? results : [];
      const attemptsList = Array.isArray(attempts) ? attempts : [];

      // 1. Definisikan rawAllData terlebih dahulu
      const rawAllData = [...resultsList, ...attemptsList];

      // 2. Format data menggunakan rawAllData yang sudah didefinisikan
      const formattedResults = rawAllData.map((res, idx) => {
        const studentObj = res.student || res.user;
        const namaSiswa = studentObj?.name || res.studentName || res.userName || "Siswa";

        // Mata Pelajaran / Course (Contoh: "Matematika SMK")
        const namaMapel =
          res.course?.name ||
          res.quiz?.course?.name ||
          "Matematika SMK";

        // Nama Kuis / Evaluasi (Contoh: "Bank Soal Evaluasi - Aljabar Dasar")
        const judulKuis =
          res.quiz?.title ||
          res.quizTitle ||
          res.title ||
          "Bank Soal Evaluasi";

        const rawScore = res.score ?? res.nilai ?? res.scoreObtained ?? 0;

        return {
          id: res.id || idx + 1,
          nama: namaSiswa,
          mapel: namaMapel,
          judulKuis: judulKuis,
          nilai: typeof rawScore === "number" ? Math.round(rawScore) : 0,
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
                {loadingHasil
                  ? "..."
                  : dataHasil.length > 0
                  ? Math.round(
                      dataHasil.reduce((acc, curr) => acc + curr.nilai, 0) /
                        dataHasil.length
                    )
                  : 0}
              </h3>
            </div>
          </div>

          {/* Section Utama: Form & Rekap Bank Soal */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <FormTambahSoal onTambahSoal={handleTambahSoal} />
            </div>

            <div className="space-y-6 lg:col-span-7">
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