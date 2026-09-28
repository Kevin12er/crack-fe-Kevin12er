"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

export default function FormTambahSoal({ onTambahSoal }) {
  const [tipeSoal, setTipeSoal] = useState("pg");
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
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

  // Ambil course & quiz sekali saat mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseData, quizData] = await Promise.all([
          fetchApi("/courses").catch(() => []),
          fetchApi("/quizzes").catch(() => []),
        ]);

        const courseList = Array.isArray(courseData) ? courseData : [];
        const quizList = Array.isArray(quizData) ? quizData : [];

        setCourses(courseList);
        setQuizzes(quizList);

        if (courseList.length > 0) {
          setSelectedCourseId(courseList[0].id);
        }
      } catch (err) {
        console.warn("Gagal memuat data course/kuis:", err);
      }
    };

    loadData();
  }, []);

  // Quiz yang tampil hanya milik course terpilih
  const filteredQuizzes = useMemo(
    () =>
      quizzes.filter(
        (q) =>
          String(q.courseId) === String(selectedCourseId) ||
          String(q.course?.id) === String(selectedCourseId)
      ),
    [quizzes, selectedCourseId]
  );

  // Saat course berubah, otomatis pilih quiz pertama milik course itu
  // (kalau hanya ada satu quiz, guru tidak perlu memilih manual)
  useEffect(() => {
    setSelectedQuizId(filteredQuizzes[0]?.id || "");
  }, [filteredQuizzes]);

  const onSubmit = async (data) => {
    if (!selectedQuizId) {
      alert("Pilih kuis terlebih dahulu. Buat kuis di menu Kelola Soal jika belum ada.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Simpan pertanyaan ke quiz yang dipilih secara eksplisit
      const newQuestion = await fetchApi("/quiz-questions", {
        method: "POST",
        body: JSON.stringify({
          quizId: selectedQuizId,
          question: data.pertanyaan,
          type: tipeSoal === "pg" ? "MULTIPLE_CHOICE" : "ESSAY",
        }),
      });

      // 2. Jika pilihan ganda, simpan opsi jawaban
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

      // Reset hanya isi form; pilihan course & kuis dipertahankan
      reset();
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
        {/* Pilih Course */}
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
                  {c.title || c.name || "Modul Matematika"}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-xl border border-line bg-base p-3 text-xs text-secondary">
              Belum ada Course. Buat Course baru di menu Materi terlebih dahulu.
            </div>
          )}
        </div>

        {/* Pilih Kuis (eksplisit) */}
        <div>
          <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
            Pilih Kuis
          </label>
          {filteredQuizzes.length > 0 ? (
            <select
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              className="w-full rounded-xl border border-line bg-base p-3 text-xs text-primary focus:border-brand focus:outline-none"
            >
              {filteredQuizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-xl border border-line bg-base p-3 text-xs text-secondary">
              Belum ada kuis untuk course ini. Buat kuis terlebih dahulu di menu Kelola Soal.
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
          disabled={isSubmitting || courses.length === 0 || !selectedQuizId}
          className="mt-4 w-full cursor-pointer rounded-xl bg-brand py-3.5 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-brand-hover disabled:opacity-50"
        >
          {isSubmitting ? "Menyimpan Soal..." : "Simpan Soal"}
        </button>
      </form>

      <Link
        href="/dashboard/guru/kelola-soal"
        className="text-xs mt-4 font-semibold w-fit font-jakarta text-brand hover:underline flex items-center gap-1 bg-brand-soft border border-brand-ring px-3 py-1.5 rounded-lg transition-colors"
      >
        Lihat Semua Soal &rarr;
      </Link>
    </div>
  );
}