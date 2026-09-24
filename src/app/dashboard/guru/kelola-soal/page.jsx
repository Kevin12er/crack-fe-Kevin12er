"use client";

import Navbar from "@/app/components/layout/Navbar";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

export default function KelolaSoalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("Semua");

  const [daftarSoal, setDaftarSoal] = useState([]);
  const [daftarQuizzes, setDaftarQuizzes] = useState([]);
  const [daftarCourses, setDaftarCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form Buat Kuis Baru
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(15);

  // State Modal Tambah Soal
  const [activeQuizForQuestion, setActiveQuizForQuestion] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("MULTIPLE_CHOICE");
  const [options, setOptions] = useState([
    { optionText: "", isCorrect: true },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
  ]);

  // State untuk menyimpan data modal edit
  const [editingSoal, setEditingSoal] = useState(null);

  // Load Quizzes, Courses, dan Soal secara Dynamic dari API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Fetch courses & quizzes
      const [coursesData, quizzesData] = await Promise.all([
        fetchApi("/courses").catch(() => []),
        fetchApi("/quizzes").catch(() => []),
      ]);

      const courseList = Array.isArray(coursesData) ? coursesData : [];
      const quizList = Array.isArray(quizzesData) ? quizzesData : [];

      setDaftarCourses(courseList);
      setDaftarQuizzes(quizList);

      let allQuestions = [];

      // 2. Fetch soal untuk setiap kuis (pola aman sesuai commit kamu)
      for (const quiz of quizList) {
        if (quiz?.id) {
          try {
            const qData = await fetchApi(`/quiz-questions/quiz/${quiz.id}`);
            const questions = Array.isArray(qData) ? qData : [];

            const formatted = questions.map((q) => ({
              id: q.id,
              pertanyaan: q.questionText || q.question || "Pertanyaan tanpa judul",
              mapel: quiz.title || quiz.course?.name || "Kuis Evaluasi",
              tipe: q.type || "Pilihan Ganda",
              kunci: q.correctAnswer || q.kunci || "Tersimpan di Opsi",
              raw: q,
            }));

            allQuestions = [...allQuestions, ...formatted];
          } catch (qErr) {
            console.warn(`Gagal fetch soal untuk quiz ${quiz.id}:`, qErr);
          }
        }
      }

      setDaftarSoal(allQuestions);
    } catch (err) {
      console.error("Gagal mengambil data bank soal:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler Buat Kuis Baru (POST /quizzes)
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!selectedCourseId || !quizTitle || !timeLimit) {
      alert("Mohon isi Course, Judul Kuis, dan Batas Waktu!");
      return;
    }

    try {
      setIsSubmitting(true);
      await fetchApi("/quizzes", {
        method: "POST",
        body: JSON.stringify({
          courseId: selectedCourseId,
          title: quizTitle,
          description: quizDescription,
          timeLimit: Number(timeLimit),
        }),
      });

      alert("🎉 Kuis berhasil dibuat!");
      setQuizTitle("");
      setQuizDescription("");
      setTimeLimit(15);
      loadData();
    } catch (err) {
      alert("Gagal membuat kuis: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Tambah Soal ke Kuis (POST /quiz-questions & POST /quiz-options)
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) {
      alert("Isi teks pertanyaan terlebih dahulu!");
      return;
    }

    try {
      setIsSubmitting(true);

      const createdQuestion = await fetchApi("/quiz-questions", {
        method: "POST",
        body: JSON.stringify({
          quizId: activeQuizForQuestion.id,
          question: questionText,
          type: questionType,
        }),
      });

      if (questionType === "MULTIPLE_CHOICE" && createdQuestion?.id) {
        for (const opt of options) {
          if (opt.optionText.trim()) {
            await fetchApi("/quiz-options", {
              method: "POST",
              body: JSON.stringify({
                questionId: createdQuestion.id,
                optionText: opt.optionText,
                isCorrect: opt.isCorrect,
              }),
            });
          }
        }
      }

      alert("✅ Soal berhasil ditambahkan!");
      setActiveQuizForQuestion(null);
      setQuestionText("");
      setOptions([
        { optionText: "", isCorrect: true },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
      ]);
      loadData();
    } catch (err) {
      alert("Gagal menambahkan soal: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Hapus Soal (DELETE /quiz-questions/:id)
  const handleDeleteQuestion = async (questionId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus soal ini?")) return;

    try {
      await fetchApi(`/quiz-questions/${questionId}`, {
        method: "DELETE",
      });

      alert("✅ Soal berhasil dihapus!");
      loadData();
    } catch (err) {
      console.error("Detail error hapus soal:", err);
      alert("Gagal menghapus soal: " + err.message);
    }
  };

  // Handler Simpan Edit Soal secara UI
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setDaftarSoal((prev) =>
      prev.map((soal) => (soal.id === editingSoal.id ? editingSoal : soal))
    );
    setEditingSoal(null);
  };

  const soalFiltered = daftarSoal.filter((soal) => {
    const matchSearch = String(soal.pertanyaan || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchMapel =
      selectedMapel === "Semua" || soal.mapel === selectedMapel;
    return matchSearch && matchMapel;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base text-primary font-jakarta p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Link
            href="/dashboard/guru"
            className="text-xs mt-4 font-semibold w-fit font-jakarta text-brand hover:underline flex items-center gap-1 bg-brand-soft border border-brand-ring px-3 py-1.5 rounded-lg transition-colors"
          >
            &larr; Kembali ke dashboard
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
                Kelola <span className="text-brand">Bank Soal</span>
              </h1>
              <p className="text-sm text-secondary mt-1">
                Daftar seluruh soal evaluasi yang telah dibuat oleh pengajar.
              </p>
            </div>
            <span className="text-xs bg-brand-soft text-brand border border-brand-ring px-3 py-1.5 rounded-lg font-semibold w-fit">
              Total Soal: {daftarSoal.length}
            </span>
          </div>

          {/* FORM BUAT KUIS BARU */}
          <div className="bg-surface border border-line rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-primary">➕ Buat Kuis Baru</h2>
            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary mb-1">
                    Pilih Kelas / Course *
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full bg-base border border-line rounded-xl p-3 text-xs text-primary focus:border-brand outline-none"
                    required
                  >
                    <option value="">-- Pilih Course --</option>
                    {daftarCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title || c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-secondary mb-1">
                    Batas Waktu Timer (Menit) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    className="w-full bg-base border border-line rounded-xl p-3 text-xs text-primary focus:border-brand outline-none"
                    placeholder="15"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary mb-1">
                  Judul Kuis *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kuis Evaluasi Bab 1"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full bg-base border border-line rounded-xl p-3 text-xs text-primary focus:border-brand outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary mb-1">
                  Deskripsi Kuis
                </label>
                <textarea
                  rows={2}
                  placeholder="Petunjuk pengerjaan..."
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  className="w-full bg-base border border-line rounded-xl p-3 text-xs text-primary focus:border-brand outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-hover transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Kuis Baru"}
              </button>
            </form>
          </div>

          {/* DAFTAR KUIS & TOMBOL TAMBAH SOAL */}
          <div className="space-y-3">
            <h2 className="font-bold text-primary">Pilih Kuis Untuk Tambah Soal</h2>
            {daftarQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {daftarQuizzes.map((q) => (
                  <div
                    key={q.id}
                    className="bg-surface border border-line rounded-2xl p-4 flex justify-between items-center gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-brand bg-brand-soft px-2 py-0.5 rounded uppercase">
                        ⏱️ {q.timeLimit || 0} Menit
                      </span>
                      <h3 className="text-sm font-bold text-primary">{q.title}</h3>
                      <p className="text-xs text-secondary line-clamp-1">
                        {q.description || "Tidak ada deskripsi."}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveQuizForQuestion(q)}
                      className="px-3 py-2 text-xs font-bold bg-brand/10 border border-brand/30 text-brand hover:bg-brand hover:text-white rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    >
                      + Tambah Soal
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface border border-dashed border-line rounded-2xl p-6 text-center text-xs text-secondary">
                Belum ada kuis. Buat kuis di atas terlebih dahulu.
              </div>
            )}
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between bg-surface p-4 rounded-2xl border border-line">
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 bg-base border border-line rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary font-medium">Mapel:</span>
              <select
                value={selectedMapel}
                onChange={(e) => setSelectedMapel(e.target.value)}
                className="bg-base border border-line rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand"
              >
                <option value="Semua">Semua Mata Pelajaran</option>
                {daftarQuizzes.map((q) => (
                  <option key={q.id} value={q.title || q.course?.name}>
                    {q.title || q.course?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Daftar Soal */}
          <div className="space-y-4">
            {loading ? (
              <div className="bg-surface border border-line rounded-2xl p-8 text-center text-xs text-secondary">
                Memuat bank soal dari database...
              </div>
            ) : (
              soalFiltered.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-surface border border-line rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold bg-brand-soft text-brand border border-brand-ring px-2.5 py-0.5 rounded">
                        {item.mapel}
                      </span>
                      <span className="text-xs text-secondary bg-base border border-line px-2.5 py-0.5 rounded">
                        {item.tipe}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-primary">
                      {index + 1}. {item.pertanyaan}
                    </h3>
                    <p className="text-xs text-secondary">
                      <strong className="text-primary">Kunci:</strong>{" "}
                      {item.kunci}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => setEditingSoal(item)}
                      className="px-3 py-1.5 text-xs font-semibold bg-base border border-line hover:border-brand rounded-lg transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(item.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}

            {!loading && soalFiltered.length === 0 && (
              <div className="bg-surface border border-line rounded-2xl p-8 text-center text-xs text-muted">
                Belum ada soal yang tersimpan di bank soal.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Popup Tambah Soal */}
      {activeQuizForQuestion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-line p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div>
                <h3 className="font-bold text-primary">Tambah Soal Baru</h3>
                <p className="text-xs text-brand font-bold">
                  {activeQuizForQuestion.title}
                </p>
              </div>
              <button
                onClick={() => setActiveQuizForQuestion(null)}
                className="text-xs text-secondary hover:text-primary cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-secondary">
                  Tipe Soal
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full bg-base border border-line rounded-xl p-3 text-xs text-primary outline-none"
                >
                  <option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
                  <option value="ESSAY">Essay</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-secondary">
                  Pertanyaan *
                </label>
                <textarea
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Tuliskan pertanyaan di sini..."
                  className="w-full bg-base border border-line rounded-xl p-3 text-xs text-primary focus:border-brand outline-none resize-none"
                  required
                />
              </div>

              {questionType === "MULTIPLE_CHOICE" && (
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-secondary">
                    Pilihan Jawaban & Kunci Benar (Tandai Radio) *
                  </label>

                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={opt.isCorrect}
                        onChange={() =>
                          setOptions(
                            options.map((o, i) => ({ ...o, isCorrect: i === idx }))
                          )
                        }
                        className="accent-brand h-4 w-4 cursor-pointer"
                      />
                      <input
                        type="text"
                        placeholder={`Pilihan ${String.fromCharCode(65 + idx)}`}
                        value={opt.optionText}
                        onChange={(e) => {
                          const newOpts = [...options];
                          newOpts[idx].optionText = e.target.value;
                          setOptions(newOpts);
                        }}
                        className="flex-1 bg-base border border-line rounded-xl p-2.5 text-xs text-primary outline-none focus:border-brand"
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setActiveQuizForQuestion(null)}
                  className="px-4 py-2 text-xs font-semibold bg-base border border-line rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-primary hover:bg-brand-hover cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Soal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Popup Edit Soal */}
      {editingSoal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-line p-6 rounded-2xl max-w-lg w-full space-y-4">
            <h2 className="text-lg font-bold text-primary">Edit Soal</h2>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={editingSoal.mapel}
                  onChange={(e) =>
                    setEditingSoal({ ...editingSoal, mapel: e.target.value })
                  }
                  className="w-full bg-base border border-line rounded-xl p-2.5 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                  Pertanyaan
                </label>
                <textarea
                  rows={3}
                  value={editingSoal.pertanyaan}
                  onChange={(e) =>
                    setEditingSoal({
                      ...editingSoal,
                      pertanyaan: e.target.value,
                    })
                  }
                  className="w-full bg-base border border-line rounded-xl p-2.5 text-sm resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                  Kunci / Jawaban
                </label>
                <input
                  type="text"
                  value={editingSoal.kunci}
                  onChange={(e) =>
                    setEditingSoal({ ...editingSoal, kunci: e.target.value })
                  }
                  className="w-full bg-base border border-line rounded-xl p-2.5 text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSoal(null)}
                  className="px-4 py-2 text-xs font-semibold bg-base border border-line rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-primary hover:bg-brand-hover"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}