"use client";

import { use, useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import { fetchApi } from "@/lib/api";

export default function KerjakanKuisPage({ params }) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;

  // State Data Kuis & Soal
  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0); // Index soal aktif

  // State Status Pengerjaan (Lobby / Interaktif)
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // State untuk Timer
  const [timeLeft, setTimeLeft] = useState(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  // Function Submit Kuis
  const handleSubmitQuiz = useCallback(async () => {
    try {
      setIsSubmitting(true);

      const formattedAnswers = questions.map((q) => {
        const qTypeUpper = String(q.type || "").toUpperCase();
        const hasNoOptions = !q.options || q.options.length === 0;
        
        // Cek secara presisi apakah soal ini ESSAY
        const isEssay = qTypeUpper === "ESSAY" || hasNoOptions;
        const userAnswer = answersRef.current[q.id] || "";

        if (isEssay) {
          return {
            questionId: q.id,
            answerText: typeof userAnswer === "string" ? userAnswer : String(userAnswer),
            selectedOptionId: null,
          };
        } else {
          return {
            questionId: q.id,
            selectedOptionId: typeof userAnswer === "string" ? userAnswer : null,
            answerText: null,
          };
        }
      });

      const payload = {
        quizId: quizId,
        answers: formattedAnswers,
      };

      // Send payload ke NestJS API
      const res = await fetchApi("/quiz-attempts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // FIX: Jika status dari backend SUBMITTED atau score-nya null, set score ke null (jangan di-fallback ke 0 / angka)
      const rawScore = res?.score;
      const isSubmittedStatus = res?.status === "SUBMITTED" || rawScore === null || rawScore === undefined;
      
      const finalScore = isSubmittedStatus ? null : Math.round(Number(rawScore));

      setScore(finalScore);
      setSubmitted(true);
    } catch (err) {
      console.error("Gagal menyimpan kuis:", err);
      alert("Terjadi kesalahan saat mengirim jawaban: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [quizId, questions]);

  // Load Detail Quiz & Soal
  useEffect(() => {
    const getQuizAndQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Ambil detail kuis dari backend
        const quizDetail = await fetchApi(`/quizzes/${quizId}`);
        setQuizInfo(quizDetail);

        // Validasi data timeLimit secara ketat dari backend
        if (!quizDetail || !quizDetail.timeLimit || Number(quizDetail.timeLimit) <= 0) {
          setError("Kuis ini belum memiliki konfigurasi batas waktu (timeLimit) yang valid dari Instruktur.");
          setLoading(false);
          return;
        }

        // Set detik resmi berdasarkan durasi dari database
        setTimeLeft(Number(quizDetail.timeLimit) * 60);

        // 2. Fetch daftar soal kuis
        const data = await fetchApi(`/quiz-questions/quiz/${quizId}`);
        const qList = Array.isArray(data) ? data : [];

        // 3. Ambil opsi jawaban untuk tiap soal
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
        console.error("Gagal mengambil data kuis:", err);
        setError("Gagal memuat kuis dan soal dari server.");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) getQuizAndQuestions();
  }, [quizId]);

  // Engine Timer Mundur Dynamic
  useEffect(() => {
    if (!isStarted || timeLeft === null || submitted || loading || error) return;

    if (timeLeft <= 0) {
      alert("⏱️ Waktu pengerjaan kuis telah habis! Jawaban Anda akan otomatis dikirim.");
      handleSubmitQuiz();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isStarted, timeLeft, submitted, loading, error, handleSubmitQuiz]);

  // Format detik menjadi MM:SS
  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleEssayChange = (questionId, textValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: textValue }));
  };

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

  const currentQuestion = questions[currentIndex];
  const hasEssay = questions.some(
    (q) => q.type === "ESSAY" || !q.options || q.options.length === 0
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base p-4 text-primary font-jakarta md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <Link
            href="/dashboard/siswa/kuis"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition-colors bg-surface border border-line px-3.5 py-2 rounded-xl"
          >
            ← Kembali ke Daftar Kuis
          </Link>

          {/* Loading State */}
          {loading && (
            <div className="rounded-3xl border border-line bg-surface p-12 text-center shadow-sm">
              <p className="text-xs font-bold text-secondary animate-pulse">
                Memuat soal-soal kuis...
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center space-y-4">
              <div className="text-3xl">⚠️</div>
              <p className="text-xs font-semibold text-red-400 max-w-md mx-auto leading-relaxed">
                {error}
              </p>
              <div>
                <Link
                  href="/dashboard/siswa/kuis"
                  className="inline-block rounded-xl bg-brand px-5 py-2.5 text-xs font-extrabold text-white hover:bg-brand-hover transition-all"
                >
                  Kembali ke Daftar Kuis
                </Link>
              </div>
            </div>
          )}

          {/* TAMPILAN SETELAH KUIS DI-SUBMIT */}
          {!loading && !error && submitted && (
            <div className="rounded-3xl border border-line bg-surface p-8 md:p-12 text-center space-y-6 shadow-sm">
              <div className="space-y-2">
                <div className="inline-block p-4 rounded-full bg-brand/10 border border-brand/20 text-4xl mb-2">
                  {hasEssay ? "⏳" : "🎉"}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-primary">
                  Kuis Selesai Dikirim!
                </h2>
              </div>

              {hasEssay ? (
                <div className="space-y-3 py-2">
                  <div className="inline-block rounded-full bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 text-xs font-bold text-amber-500">
                    Jawaban Essay Berhasil Disimpan
                  </div>
                  <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
                    Jawaban essay kamu telah tersimpan ke database dan sedang menunggu proses evaluasi & penilaian dari Guru.
                  </p>
                </div>
              ) : (
                <div className="bg-base border border-line rounded-2xl p-6 space-y-2 max-w-xs mx-auto">
                  <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Nilai Pengerjaan Kamu
                  </p>
                  <div className="text-5xl font-black text-brand">
                    {score !== null ? Math.round(Number(score)) : 0}
                    <span className="text-xs text-secondary font-medium"> / 100</span>
                  </div>
                  <p className="text-[10px] text-secondary">
                    Jawaban dan nilai kamu telah resmi tersimpan di sistem.
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-center">
                <Link
                  href="/dashboard/siswa/kuis"
                  className="rounded-xl bg-brand px-6 py-3 text-xs font-extrabold text-white hover:bg-brand-hover transition-all shadow-md active:scale-95"
                >
                  Kembali ke Daftar Kuis
                </Link>
              </div>
            </div>
          )}

          {/* LOBBY / PETUNJUK SEBELUM PENGERJAAN KUIS */}
          {!loading && !error && !submitted && !isStarted && (
            <div className="bg-surface border border-line rounded-3xl p-6 md:p-10 space-y-6 shadow-sm text-center">
              <div className="space-y-2">
                <span className="text-xs font-bold text-brand bg-brand/10 border border-brand/20 px-3.5 py-1.5 rounded-full uppercase">
                  ⏱️ Durasi: {quizInfo?.timeLimit || 15} Menit
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
                  {quizInfo?.title || "Evaluasi Kuis"}
                </h1>
                <p className="text-xs md:text-sm text-secondary max-w-xl mx-auto leading-relaxed">
                  {quizInfo?.description || "Bacalah setiap pertanyaan dengan teliti sebelum menjawab. Selamat mengerjakan!"}
                </p>
              </div>

              {/* CARD NOTE PETUNJUK */}
              <div className="bg-base border border-line rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2.5 text-secondary">
                <p className="font-bold text-primary flex items-center gap-1.5 text-xs">
                  📋 Petunjuk Pengerjaan:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
                  <li>Timer berjalan otomatis setelah Anda mengklik tombol di bawah.</li>
                  <li>Pastikan Anda menjawab semua pertanyaan sebelum waktu habis.</li>
                  <li>Jawaban Anda tersimpan otomatis di sistem saat dikirimkan.</li>
                </ul>
              </div>

              <button
                onClick={() => setIsStarted(true)}
                className="px-8 py-3.5 bg-brand hover:bg-brand-hover text-white font-extrabold text-xs md:text-sm rounded-2xl transition-all cursor-pointer shadow-lg shadow-brand/20 active:scale-95"
              >
                🚀 Mulai Kuis Sekarang
              </button>
            </div>
          )}

          {/* TAMPILAN SOAL AKTIF & TIMER (SAAT KUIS DIMULAI) */}
          {!loading && !error && !submitted && isStarted && (
            <div className="space-y-6">
              {questions.length > 0 && currentQuestion ? (
                <div className="rounded-3xl border border-line bg-surface p-6 md:p-8 space-y-6 shadow-sm">
                  {/* Indicator Soal & Timer Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                    <span className="text-xs font-extrabold text-brand uppercase tracking-wider bg-brand/10 border border-brand/20 px-3 py-1 rounded-full">
                      Soal {currentIndex + 1} dari {questions.length}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Widget Timer */}
                      {timeLeft !== null && (
                        <span
                          className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-full border transition-all ${
                            timeLeft <= 300
                              ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse"
                              : "bg-base border-line text-primary"
                          }`}
                        >
                          ⏱️ {formatTime(timeLeft)}
                        </span>
                      )}

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-base border border-line text-secondary uppercase">
                        {currentQuestion.type || "Pilihan Ganda"}
                      </span>
                    </div>
                  </div>

                  {/* Pertanyaan */}
                  <h3 className="text-sm font-bold text-primary leading-relaxed">
                    {currentQuestion.question}
                  </h3>

                  {/* Opsi / Form Essay */}
                  <div className="space-y-3 pt-2">
                    {currentQuestion.options && currentQuestion.options.length > 0 ? (
                      currentQuestion.options.map((opt, idx) => {
                        const isSelected = answers[currentQuestion.id] === opt.id;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                            className={`flex items-center gap-3.5 rounded-2xl border p-4 text-xs cursor-pointer transition-all ${
                              isSelected
                                ? "border-brand bg-brand/10 font-bold text-primary shadow-xs"
                                : "border-line bg-base text-secondary hover:border-line-strong hover:text-primary"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${currentQuestion.id}`}
                              checked={isSelected}
                              onChange={() => {}}
                              className="accent-brand h-4 w-4 cursor-pointer"
                            />
                            <span className="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-lg bg-surface border border-line text-primary">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-sm flex-1">{opt.optionText}</span>
                          </label>
                        );
                      })
                    ) : (
                      <textarea
                        rows={5}
                        value={answers[currentQuestion.id] || ""}
                        placeholder="Tuliskan jawaban essay kamu secara lengkap di sini..."
                        onChange={(e) =>
                          handleEssayChange(currentQuestion.id, e.target.value)
                        }
                        className="w-full rounded-2xl border border-line bg-base p-4 text-xs text-primary focus:outline-none focus:border-brand transition-all resize-none"
                      />
                    )}
                  </div>

                  {/* Tombol Navigasi Pindah Soal */}
                  <div className="flex justify-between items-center pt-4 border-t border-line">
                    <button
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className="rounded-xl border border-line bg-base px-4 py-2.5 text-xs font-bold text-secondary hover:text-primary disabled:opacity-30 cursor-pointer transition-all"
                    >
                      ← Sebelumnya
                    </button>

                    {currentIndex < questions.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="rounded-xl bg-brand px-6 py-2.5 text-xs font-extrabold text-white hover:bg-brand-hover shadow-md cursor-pointer transition-all"
                      >
                        Soal Selanjutnya →
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={isSubmitting}
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-md disabled:opacity-50 cursor-pointer transition-all"
                      >
                        {isSubmitting ? "Mengirim Hasil..." : "✓ Kirim Jawaban Kuis"}
                      </button>
                    )}
                  </div>

                  {/* Grid Navigasi Nomor Soal */}
                  <div className="pt-2 border-t border-line space-y-2">
                    <p className="text-[10px] font-bold text-secondary uppercase">Navigasi Soal:</p>
                    <div className="flex flex-wrap gap-2">
                      {questions.map((q, idx) => {
                        const isAnswered = !!answers[q.id];
                        const isCurrent = currentIndex === idx;

                        return (
                          <button
                            key={q.id || idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-8 h-8 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                              isCurrent
                                ? "bg-brand text-white border-brand ring-2 ring-brand/30"
                                : isAnswered
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                : "bg-base text-secondary border-line hover:border-brand"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
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