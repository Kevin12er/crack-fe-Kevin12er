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
  const [loading, setLoading] = useState(true);

  // State untuk menyimpan data modal edit
  const [editingSoal, setEditingSoal] = useState(null);

  // Load Quizzes dan Soal secara Dynamic dari API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Fetch semua kuis
      const quizzes = await fetchApi("/quizzes");
      const quizList = Array.isArray(quizzes) ? quizzes : [];
      setDaftarQuizzes(quizList);

      let allQuestions = [];

      // 2. Fetch soal untuk setiap kuis
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

  // Handler Simpan Edit Soal secara lokal / UI
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