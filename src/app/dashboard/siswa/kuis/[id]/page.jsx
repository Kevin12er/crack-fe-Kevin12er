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

  const handleSubmitQuiz = async () => {
    try {
      setIsSubmitting(true);

      // Susun format answers sesuai DTO NestJS
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId,
        })
      );

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

      // Pembulatan angka agar nilai desimal seperti 33.33333333 menjadi 33
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

          {!loading && submitted && (
            <div className="rounded-3xl border border-line bg-surface p-8 text-center space-y-4 shadow-sm">
              <h2 className="text-2xl font-extrabold text-primary">Kuis Selesai!</h2>
              <p className="text-xs text-secondary">Nilai Pengerjaan Kamu:</p>
              <div className="text-5xl font-black text-brand">
                {score !== null ? Math.round(Number(score)) : 0}
              </div>
              <p className="text-xs text-secondary">
                Jawaban dan nilai kamu telah resmi tersimpan ke sistem database.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/dashboard/siswa/nilai"
                  className="rounded-xl bg-brand px-6 py-2.5 text-xs font-bold text-primary hover:bg-brand-hover transition-all"
                >
                  Lihat Halaman Nilai Saya
                </Link>
                <Link
                  href="/dashboard/siswa/latihan-soal"
                  className="rounded-xl border border-line bg-base px-6 py-2.5 text-xs font-bold text-secondary hover:text-primary transition-all"
                >
                  Kembali ke Daftar Soal
                </Link>
              </div>
            </div>
          )}

          {!loading && !submitted && (
            <div className="space-y-6">
              {questions.length > 0 ? (
                questions.map((q, qIndex) => (
                  <div
                    key={q.id || qIndex}
                    className="rounded-2xl border border-line bg-surface p-5 space-y-4"
                  >
                    <h3 className="text-sm font-bold text-primary">
                      {qIndex + 1}. {q.question}
                    </h3>

                    <div className="space-y-2">
                      {q.options && q.options.length > 0 ? (
                        q.options.map((opt) => (
                          <label
                            key={opt.id}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`flex items-center gap-3 rounded-xl border p-3 text-xs cursor-pointer transition-all ${
                              answers[q.id] === opt.id
                                ? "border-brand bg-brand/10 font-bold text-brand"
                                : "border-line bg-base text-primary hover:border-brand/50"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              checked={answers[q.id] === opt.id}
                              onChange={() => {}}
                              className="accent-brand"
                            />
                            <span>{opt.optionText}</span>
                          </label>
                        ))
                      ) : (
                        <textarea
                          rows={2}
                          placeholder="Tuliskan jawaban essay kamu..."
                          onChange={(e) =>
                            setAnswers((prev) => ({
                              ...prev,
                              [q.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-line bg-base p-3 text-xs text-primary focus:outline-none focus:border-brand"
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-secondary rounded-2xl border border-dashed border-line">
                  Belum ada soal pada kuis ini.
                </div>
              )}

              {questions.length > 0 && (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-brand py-3.5 text-xs font-bold text-primary shadow-lg hover:bg-brand-hover disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting ? "Mengirim Hasil..." : "Kirim Jawaban Kuis"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}