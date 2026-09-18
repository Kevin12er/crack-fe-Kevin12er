"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

export default function FormTambahSoal({ onTambahSoal }) {
  const [tipeSoal, setTipeSoal] = useState("pg");
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pertanyaan: "",
      opsiA: "",
      opsiB: "",
      opsiC: "",
      opsiD: "",
      kunciJawaban: "A",
    },
  });

  // Fetch daftar Quiz dari backend /quizzes
  const fetchQuizzes = async () => {
    try {
      const data = await fetchApi("/quizzes");
      const list = Array.isArray(data) ? data : [];
      setQuizzes(list);

      if (list.length > 0) {
        setSelectedQuizId(list[0].id);
      }
    } catch (err) {
      console.warn("Gagal memuat kuis:", err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Handler Submit Form ke Backend NestJS
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      let quizIdToUse = selectedQuizId;

      // 1. Jika belum ada Quiz di DB, buat 1 Quiz default lebih dulu
      if (!quizIdToUse) {
        // Cari course valid dari DB
        let courseId = "course-1";
        try {
          const courses = await fetchApi("/courses");
          if (Array.isArray(courses) && courses.length > 0) {
            courseId = courses[0].id;
          }
        } catch (cErr) {
          console.warn("Gagal fetch course:", cErr);
        }

        const newQuiz = await fetchApi("/quizzes", {
          method: "POST",
          body: JSON.stringify({
            title: "Bank Soal Evaluasi",
            description: "Kuis evaluasi umum pembelajaran.",
            courseId: courseId,
          }),
        });

        if (newQuiz?.id) {
          quizIdToUse = newQuiz.id;
          setSelectedQuizId(newQuiz.id);
        }
      }

      // 2. Simpan Pertanyaan ke POST /quiz-questions
      const newQuestion = await fetchApi("/quiz-questions", {
        method: "POST",
        body: JSON.stringify({
          quizId: quizIdToUse,
          questionText: data.pertanyaan,
        }),
      });

      // 3. Jika Pilihan Ganda, Simpan Opsi Jawaban ke POST /quiz-options
      if (tipeSoal === "pg" && newQuestion?.id) {
        const optionsPayload = [
          { text: data.opsiA, isCorrect: data.kunciJawaban === "A" },
          { text: data.opsiB, isCorrect: data.kunciJawaban === "B" },
          { text: data.opsiC, isCorrect: data.kunciJawaban === "C" },
          { text: data.opsiD, isCorrect: data.kunciJawaban === "D" },
        ];

        for (const opt of optionsPayload) {
          if (opt.text) {
            await fetchApi("/quiz-options", {
              method: "POST",
              body: JSON.stringify({
                questionId: newQuestion.id,
                optionText: opt.text,
                isCorrect: opt.isCorrect,
              }),
            });
          }
        }
      }

      alert("Soal berhasil disimpan ke database!");

      // Jalankan callback opsional jika ada
      if (onTambahSoal) {
        onTambahSoal({
          id: newQuestion?.id || Date.now(),
          pertanyaan: data.pertanyaan,
          tipe: tipeSoal === "pg" ? "Pilihan Ganda" : "Essay",
        });
      }

      reset();
      await fetchQuizzes();
    } catch (err) {
      alert("Gagal menyimpan soal: " + (err.message || "Terjadi kesalahan server."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface border border-line rounded-2xl p-6 font-jakarta">
      <h2 className="text-lg font-bold text-primary mb-4">Buat Soal Baru</h2>

      {/* Switcher Tipe Soal */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
          Tipe Soal
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-base border border-line rounded-xl">
          <button
            type="button"
            onClick={() => setTipeSoal("pg")}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tipeSoal === "pg"
                ? "bg-brand text-primary font-bold shadow-md"
                : "text-secondary hover:text-primary"
            }`}
          >
            Pilihan Ganda
          </button>
          <button
            type="button"
            onClick={() => setTipeSoal("essay")}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tipeSoal === "essay"
                ? "bg-brand text-primary font-bold shadow-md"
                : "text-secondary hover:text-primary"
            }`}
          >
            Essay / Isian
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Pilih Kuis Terkait */}
        {quizzes.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
              Pilih Kuis / Modul
            </label>
            <select
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              className="w-full rounded-xl border border-line bg-base p-3 text-xs text-primary focus:border-brand focus:outline-none"
            >
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title} ({q.course?.title || "Umum"})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
            Pertanyaan / Soal
          </label>
          <textarea
            rows={3}
            placeholder="Tuliskan pertanyaan di sini..."
            {...register("pertanyaan", { required: "Pertanyaan wajib diisi" })}
            className="w-full rounded-xl border border-line bg-base p-3 text-sm text-primary placeholder:text-muted focus:border-brand focus:outline-none resize-none"
          />
          {errors.pertanyaan && (
            <p className="text-xs text-av-red mt-1">
              {errors.pertanyaan.message}
            </p>
          )}
        </div>

        {tipeSoal === "pg" && (
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider">
              Opsi Jawaban
            </label>
            {["A", "B", "C", "D"].map((opsi) => (
              <input
                key={opsi}
                type="text"
                placeholder={`Opsi ${opsi}`}
                {...register(`opsi${opsi}`, {
                  required: `Opsi ${opsi} wajib diisi`,
                })}
                className="w-full rounded-xl border border-line bg-base p-2.5 text-xs text-primary placeholder:text-muted focus:border-brand focus:outline-none"
              />
            ))}

            <div className="pt-2">
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                Kunci Jawaban
              </label>
              <select
                {...register("kunciJawaban")}
                className="w-full rounded-xl border border-line bg-base p-3 text-xs text-primary focus:border-brand focus:outline-none"
              >
                <option value="A">Opsi A</option>
                <option value="B">Opsi B</option>
                <option value="C">Opsi C</option>
                <option value="D">Opsi D</option>
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full cursor-pointer rounded-xl bg-brand py-3.5 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-brand-hover disabled:opacity-50"
        >
          {isSubmitting ? "Menyimpan Soal..." : "Simpan Soal"}
        </button>
      </form>

      {/* Link ke Kelola Soal */}
      <Link
        href="/dashboard/guru/kelola-soal"
        className="text-xs mt-4 font-semibold w-fit font-jakarta text-brand hover:underline flex items-center gap-1 bg-brand-soft border border-brand-ring px-3 py-1.5 rounded-lg transition-colors"
      >
        Lihat Semua Soal &rarr;
      </Link>
    </div>
  );
}