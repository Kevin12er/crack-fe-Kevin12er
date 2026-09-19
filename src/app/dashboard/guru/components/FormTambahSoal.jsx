"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

export default function FormTambahSoal({ onTambahSoal }) {
  const [tipeSoal, setTipeSoal] = useState("pg");
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
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

  // Fetch daftar Course dari backend /courses
  const fetchCoursesAndQuizzes = async () => {
    try {
      const data = await fetchApi("/courses");
      const list = Array.isArray(data) ? data : [];
      setCourses(list);

      if (list.length > 0) {
        setSelectedCourseId(list[0].id);
      }
    } catch (err) {
      console.warn("Gagal memuat daftar course:", err);
    }
  };

  useEffect(() => {
    fetchCoursesAndQuizzes();
  }, []);

  // Handler Submit Form ke Backend NestJS
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      let targetQuizId = null;

      // 1. Ambil kuis yang sudah ada untuk mencari kuis dengan courseId terpilih
      try {
        const existingQuizzes = await fetchApi("/quizzes");
        const quizList = Array.isArray(existingQuizzes) ? existingQuizzes : [];

        const matchedQuiz = quizList.find(
          (q) => String(q.courseId) === String(selectedCourseId) || String(q.course?.id) === String(selectedCourseId)
        );

        if (matchedQuiz?.id) {
          targetQuizId = matchedQuiz.id;
        }
      } catch (qErr) {
        console.warn("Gagal fetch quizzes:", qErr);
      }

      // 2. Jika kuis untuk Course ini belum ada, buatkan Quiz baru secara otomatis
      if (!targetQuizId) {
        const selectedCourseObj = courses.find((c) => String(c.id) === String(selectedCourseId));
        const courseName = selectedCourseObj?.name || selectedCourseObj?.title || "Matematika SMK";

        const newQuiz = await fetchApi("/quizzes", {
          method: "POST",
          body: JSON.stringify({
            title: `Bank Soal Evaluasi - ${courseName}`,
            description: `Kuis evaluasi modul ${courseName}`,
            courseId: selectedCourseId,
          }),
        });

        if (newQuiz?.id) {
          targetQuizId = newQuiz.id;
        }
      }

      if (!targetQuizId) {
        throw new Error("Gagal menghubungkan soal ke kuis.");
      }

      // 3. Simpan Pertanyaan ke POST /quiz-questions
      const questionPayload = {
        quizId: targetQuizId,
        question: data.pertanyaan,
        type: tipeSoal === "pg" ? "MULTIPLE_CHOICE" : "ESSAY",
      };

      const newQuestion = await fetchApi("/quiz-questions", {
        method: "POST",
        body: JSON.stringify(questionPayload),
      });

      // 4. Jika Pilihan Ganda, Simpan Opsi Jawaban ke POST /quiz-options
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

      if (onTambahSoal) {
        onTambahSoal({
          id: newQuestion?.id || Date.now(),
          pertanyaan: data.pertanyaan,
          tipe: tipeSoal === "pg" ? "Pilihan Ganda" : "Essay",
        });
      }

      reset();
      await fetchCoursesAndQuizzes();
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
        {/* Pilih Course / Modul Terkait */}
        <div>
          <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
            Pilih Course / Modul
          </label>
          {courses.length > 0 ? (
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full rounded-xl border border-line bg-base p-3 text-xs text-primary focus:border-brand focus:outline-none"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.title || "Modul Matematika"}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-xl border border-line bg-base p-3 text-xs text-secondary">
              Belum ada Course. Buat Course baru di menu Materi terlebih dahulu.
            </div>
          )}
        </div>

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
          disabled={isSubmitting || courses.length === 0}
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