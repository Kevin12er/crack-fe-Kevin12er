"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import { fetchApi } from "@/lib/api";

export default function KerjakanKuisPage({ params }) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0); // Index soal yang sedang aktif
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const getQuizQuestions = async () => {
      try {
        setLoading(true);
        // Fetch daftar soal kuis
        const data = await fetchApi(`/quiz-questions/quiz/${quizId}`);
        const qList = Array.isArray(data) ? data : [];

        // Ambil opsi jawaban untuk tiap soal
        const fullQuestions = await Promise.all(
          qList.map(async (q) => {
            try {
              const opts = await fetchApi(`/quiz-options/question/${q.id}`);
              return { ...q, options: Array.isArray(opts) ? opts : [] };
            } catch {
              return { ...q, options: [] };
            }
          })
        );

        setQuestions(fullQuestions);
      } catch (err) {
        console.error("Gagal mengambil soal kuis:", err);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) getQuizQuestions();
  }, [quizId]);

  const handleSelectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleEssayChange = (questionId, textValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: textValue }));
  };

  // Navigasi Pindah Soal
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Kirim Semua Jawaban ke NestJS
  const handleSubmitQuiz = async () => {
    try {
      setIsSubmitting(true);

      // Susun format answers DENGAN MEMBEDAKAN MULTIPLE_CHOICE DAN ESSAY
      const formattedAnswers = questions.map((q) => {
        const isEssay = q.type === "ESSAY" || !q.options || q.options.length === 0;
        const userAnswer = answers[q.id] || "";

        if (isEssay) {
          return {
            questionId: q.id,
            answerText: userAnswer, // Kirim teks ke field answerText untuk Essay
          };
        } else {
          return {
            questionId: q.id,
            selectedOptionId: userAnswer, // Kirim ID Opsi ke selectedOptionId
          };
        }
      });

      const payload = {
        quizId: quizId,
        answers: formattedAnswers,
      };

      console.log("[SUBMIT] Payload dikirim ke NestJS:", payload);

      const res = await fetchApi("/quiz-attempts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("[SUBMIT] Response dari NestJS:", res);

      const rawScore = res?.score ?? 0;
      const finalScore = Math.round(Number(rawScore));

      setScore(finalScore);
      setSubmitted(true);
    } catch (err) {
      console.error("Gagal menyimpan kuis:", err);
      alert("Terjadi kesalahan saat mengirim jawaban: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const hasEssay = questions.some(
    (q) => q.type === "ESSAY" || !q.options || q.options.length === 0
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base p-4 text-primary font-jakarta md:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <Link
            href="/dashboard/siswa/latihan-soal"
            className="inline-block text-xs font-bold text-secondary hover:text-primary mb-2"
          >
            ← Kembali ke Latihan Soal
          </Link>

          {loading && (
            <div className="py-12 text-center text-xs font-semibold text-secondary">
              Memuat soal-soal kuis...
            </div>
          )}

          {/* TAMPILAN SETELAH KUIS DI-SUBMIT */}
          {!loading && submitted && (
            <div className="rounded-3xl border border-line bg-surface p-8 text-center space-y-4 shadow-sm">
              <h2 className="text-2xl font-extrabold text-primary">
                Kuis Selesai Dikirim!
              </h2>

              {/* Pengecekan: Jika ada soal essay, jangan tampilkan skor 0 */}
              {hasEssay ? (
                <div className="space-y-3 py-4">
                  <div className="inline-block rounded-full bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 text-xs font-bold text-amber-500">
                    ⏳ Jawaban Essay Berhasil Disimpan
                  </div>
                  <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
                    Jawaban essay kamu telah tersimpan ke database PostgreSQL dan sedang menunggu proses evaluasi & penilaian dari Guru.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <p className="text-xs text-secondary">Nilai Pengerjaan Kamu:</p>
                  <div className="text-5xl font-black text-brand">
                    {score !== null ? Math.round(Number(score)) : 0}
                  </div>
                  <p className="text-xs text-secondary">
                    Jawaban dan nilai kamu telah resmi tersimpan ke sistem database.
                  </p>
                </div>
              )}

              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/dashboard/siswa/latihan-soal"
                  className="rounded-xl bg-brand px-6 py-2.5 text-xs font-bold text-primary hover:bg-brand-hover transition-all"
                >
                  Kembali ke Daftar Soal
                </Link>
              </div>
            </div>
          )}

          {/* TAMPILAN SOAL AKTIF (PINDAH SATU PER SATU) */}
          {!loading && !submitted && (
            <div className="space-y-6">
              {questions.length > 0 && currentQuestion ? (
                <div className="rounded-3xl border border-line bg-surface p-6 md:p-8 space-y-6 shadow-sm">
                  {/* Indicator Soal (Contoh: Soal 1 dari 5) */}
                  <div className="flex justify-between items-center border-b border-line pb-4">
                    <span className="text-xs font-bold text-brand uppercase tracking-wider">
                      Soal {currentIndex + 1} dari {questions.length}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-base border border-line text-secondary uppercase">
                      Tipe: {currentQuestion.type || "Pilihan Ganda"}
                    </span>
                  </div>

                  {/* Pertanyaan */}
                  <h3 className="font-bold text-primary leading-relaxed">
                    {currentQuestion.question}
                  </h3>

                  {/* Opsi / Form Essay */}
                  <div className="space-y-3 pt-2">
                    {currentQuestion.options && currentQuestion.options.length > 0 ? (
                      currentQuestion.options.map((opt) => (
                        <label
                          key={opt.id}
                          onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                          className={`flex items-center gap-3 rounded-2xl border p-4 text-xs cursor-pointer transition-all ${
                            answers[currentQuestion.id] === opt.id
                              ? "border-brand bg-brand/10 font-bold text-brand shadow-sm"
                              : "border-line bg-base text-primary hover:border-brand/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            checked={answers[currentQuestion.id] === opt.id}
                            onChange={() => {}}
                            className="accent-brand"
                          />
                          <span>{opt.optionText}</span>
                        </label>
                      ))
                    ) : (
                      <textarea
                        rows={5}
                        value={answers[currentQuestion.id] || ""}
                        placeholder="Tuliskan jawaban essay kamu secara lengkap di sini..."
                        onChange={(e) =>
                          handleEssayChange(currentQuestion.id, e.target.value)
                        }
                        className="w-full rounded-2xl border border-line bg-base p-4 text-xs text-primary focus:outline-none focus:border-brand transition-all"
                      />
                    )}
                  </div>

                  {/* Tombol Navigasi Pindah Soal */}
                  <div className="flex justify-between items-center pt-4 border-t border-line">
                    <button
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className="rounded-xl border border-line bg-base px-4 py-2 text-xs font-bold text-secondary hover:text-primary disabled:opacity-30 cursor-pointer"
                    >
                      ← Sebelumnya
                    </button>

                    {currentIndex < questions.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="rounded-xl bg-brand px-6 py-2.5 text-xs font-bold text-primary hover:bg-brand-hover shadow-md cursor-pointer transition-all"
                      >
                        Soal Selanjutnya →
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={isSubmitting}
                        className="rounded-xl bg-brand px-6 py-2.5 text-xs font-bold text-primary hover:bg-brand-hover shadow-md disabled:opacity-50 cursor-pointer transition-all"
                      >
                        {isSubmitting ? "Mengirim Hasil..." : "✓ Kirim Jawaban Kuis"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-secondary rounded-2xl border border-dashed border-line">
                  Belum ada soal pada kuis ini.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}