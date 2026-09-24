"use client";

import Navbar from "@/app/components/layout/Navbar";
import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

export default function HasilKuisPage({ params }) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;

  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const [quiz, setQuiz] = useState(null);
  const [attemptData, setAttemptData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        setLoading(true);

        // Fetch Detail Quiz
        const quizRes = await fetchApi(`/quizzes/${quizId}`).catch(() => null);
        setQuiz(quizRes);

        // Fetch Detail Attempt
        if (attemptId) {
          const attemptRes = await fetchApi(`/quiz-attempts/${attemptId}`).catch(async () => {
            return await fetchApi(`/quiz-answers/attempt/${attemptId}`).catch(() => null);
          });
          setAttemptData(attemptRes);
        }
      } catch (err) {
        console.error("Gagal mengambil hasil kuis:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [quizId, attemptId]);

  // Extract Status & Score dari berbagai kemungkinan bungkus payload
  const status =
    attemptData?.status ||
    attemptData?.attempt?.status;

  const rawScore =
    attemptData?.score ??
    attemptData?.result?.score ??
    attemptData?.attempt?.score;

  // LOGIKA UTAMA:
  // Kuis dianggap Menunggu Evaluasi Guru HANYA JIKA statusnya SUBMITTED
  // atau skornya benar-benar null/undefined (bukan angka 0).
  const isPendingEssay =
    status === "SUBMITTED" ||
    (status !== "GRADED" && (rawScore === null || rawScore === undefined));

  // Ambil angka skor secara presisi (termasuk nilai 0)
  const numericScore =
    typeof rawScore === "number"
      ? rawScore
      : typeof rawScore === "string" && !isNaN(Number(rawScore))
      ? Number(rawScore)
      : 0;

  // Lulus jika bukan essay pending dan nilai >= 75
  const isPassed = !isPendingEssay && numericScore >= 75;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base text-primary font-jakarta p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-xl w-full space-y-6">
          <div className="bg-surface border border-line rounded-3xl p-6 md:p-10 space-y-6 text-center shadow-xl">
            {/* Status Icon Badge */}
            <div className="flex justify-center">
              <span
                className={`text-5xl p-4 rounded-full border transition-all ${
                  isPendingEssay
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : isPassed
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {loading ? "⌛" : isPendingEssay ? "📝" : isPassed ? "🎉" : "💪"}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-primary">
                {loading
                  ? "Memuat Hasil..."
                  : isPendingEssay
                  ? "Jawaban Berhasil Terkirim!"
                  : isPassed
                  ? "Selamat, Anda Lulus!"
                  : "Coba Lagi, Tetap Semangat!"}
              </h1>
              <p className="text-xs text-secondary">
                Evaluasi Kuis:{" "}
                <strong className="text-primary">
                  {quiz?.title || "Kuis Evaluasi"}
                </strong>
              </p>
            </div>

            {/* Score Display Box */}
            <div className="bg-base border border-line rounded-2xl p-6 space-y-2 max-w-xs mx-auto">
              <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                {isPendingEssay ? "Status Penilaian" : "Skor Akhir"}
              </p>

              {loading ? (
                <p className="text-sm font-bold text-secondary animate-pulse">
                  Menghitung nilai...
                </p>
              ) : isPendingEssay ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-amber-400">
                    Menunggu Evaluasi Guru
                  </p>
                  <p className="text-[10px] text-secondary">
                    Kuis ini mengandung soal essay yang perlu diperiksa manual oleh pengajar.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p
                    className={`text-5xl font-black ${
                      isPassed ? "text-emerald-400" : "text-brand"
                    }`}
                  >
                    {numericScore}
                    <span className="text-xs text-secondary font-medium">
                      {" "}
                      / 100
                    </span>
                  </p>
                  <p className="text-[10px] text-secondary font-medium">
                    {isPassed
                      ? "Bagus sekali! Kamu melampaui batas kelulusan (75)."
                      : "Nilai kamu belum mencapai batas minimal kelulusan (75)."}
                  </p>
                </div>
              )}
            </div>

            {/* Back Button */}
            <div className="pt-2 flex justify-center">
              <Link
                href="/dashboard/siswa"
                className="px-6 py-3 bg-brand hover:bg-brand-hover text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}