"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

export default function HasilUjianGuruPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("Semua");
  const [dataHasil, setDataHasil] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal Detail Jawaban Essay / Pilihan Ganda
  const [selectedAttemptId, setSelectedAttemptId] = useState(null);
  const [detailAnswers, setDetailAnswers] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadDataHasil = useCallback(async () => {
    try {
      setLoading(true);

      const [results, attempts] = await Promise.all([
        fetchApi("/results").catch(() => []),
        fetchApi("/quiz-attempts").catch(() => []),
      ]);

      const resultsList = Array.isArray(results) ? results : [];
      const attemptsList = Array.isArray(attempts) ? attempts : [];

      const rawAllData = [...resultsList, ...attemptsList];

      const formatted = rawAllData.map((res, idx) => {
        const studentObj = res.student || res.user;
        const namaSiswa = studentObj?.name || res.studentName || res.userName || "Siswa";

        const namaMapel =
          res.course?.name ||
          res.quiz?.course?.name ||
          "Matematika SMK";

        const judulKuis =
          res.quiz?.title ||
          res.quizTitle ||
          res.title ||
          "Bank Soal Evaluasi";

        const rawScore = res.score ?? res.nilai ?? res.scoreObtained;
        const rawDate = res.createdAt || res.updatedAt;
        const tanggal = rawDate
          ? new Date(rawDate).toISOString().split("T")[0]
          : "2026-09-19";

        const validAttemptId = res.quizAttemptId || res.attemptId || res.id;
        const numericScore = typeof rawScore === "number" ? Math.round(rawScore) : 0;

        return {
          id: res.id || idx + 1,
          attemptId: validAttemptId,
          nama: namaSiswa,
          mapel: namaMapel,
          judulKuis: judulKuis,
          tanggal: tanggal,
          nilai: numericScore,
          // Logika: Skor 0 mengindikasikan butuh evaluasi (Essay / Remedial Total)
          needsEvaluation: numericScore === 0,
        };
      });

      setDataHasil(formatted);
    } catch (err) {
      console.error("Gagal mengambil rekap hasil:", err);
      setDataHasil([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDataHasil();
  }, [loadDataHasil]);

  const handleOpenDetail = async (attemptId) => {
    if (!attemptId) {
      alert("ID Attempt tidak ditemukan pada baris data ini.");
      return;
    }

    setSelectedAttemptId(attemptId);
    setLoadingDetail(true);
    setDetailAnswers(null);

    try {
      const res = await fetchApi(`/quiz-answers/attempt/${attemptId}`);
      setDetailAnswers(res);
    } catch (err) {
      console.error("[ERROR DETAIL JAWABAN]:", err);
      alert(`Gagal memuat detail jawaban: ${err.message || "Endpoint tidak merespon"}`);
    } finally {
      setLoadingDetail(false);
    }
  };

  const hasilFiltered = dataHasil.filter((item) => {
    const matchNama = item.nama
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchMapel =
      selectedMapel === "Semua" || item.mapel === selectedMapel;
    return matchNama && matchMapel;
  });

  const jumlahSiswaUnik = new Set(dataHasil.map((item) => item.nama)).size;
  const lulus = dataHasil.filter((s) => s.nilai >= 75).length;
  const perluEvaluasi = dataHasil.filter((s) => s.needsEvaluation).length;

  const daftarOptionMapel = [
    "Semua",
    ...Array.from(new Set(dataHasil.map((item) => item.mapel))),
  ];

  return (
    <div className="p-4 md:p-8 font-jakarta">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigasi Kembali */}
        <div>
          <Link
            href="/dashboard/guru"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline bg-brand-soft border border-brand-ring px-3 py-1.5 rounded-lg transition-colors"
          >
            &larr; Kembali ke Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
              Rekap <span className="text-brand">Hasil Ujian</span>
            </h1>
            <p className="text-sm text-secondary mt-1">
              Laporan lengkap performa dan nilai evaluasi siswa.
            </p>
          </div>
          <button
            onClick={() =>
              alert("Fitur unduh laporan PDF/Excel siap diintegrasikan!")
            }
            className="w-fit cursor-pointer rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-primary shadow-md transition-colors hover:bg-brand-hover"
          >
            Export Laporan
          </button>
        </div>

        {/* Stat Cards Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-line p-4 rounded-2xl">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              Total Mengerjakan
            </span>
            <h3 className="text-2xl font-bold text-primary mt-1">
              {loading ? "..." : `${jumlahSiswaUnik} Siswa`}
            </h3>
          </div>
          <div className="bg-surface border border-line p-4 rounded-2xl">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              Siswa Lulus (≥75)
            </span>
            <h3 className="text-2xl font-bold text-brand mt-1">
              {loading ? "..." : `${lulus} Evaluasi`}
            </h3>
          </div>
          <div className="bg-surface border border-line p-4 rounded-2xl">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              Perlu Evaluasi Guru
            </span>
            <h3 className="text-2xl font-bold text-amber-500 mt-1">
              {loading ? "..." : `${perluEvaluasi} Evaluasi`}
            </h3>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between bg-surface p-4 rounded-2xl border border-line">
          <input
            type="text"
            placeholder="Cari nama siswa..."
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
              {daftarOptionMapel.map((m, idx) => (
                <option key={idx} value={m}>
                  {m === "Semua" ? "Semua Mata Pelajaran" : m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabel Detail */}
        <div className="bg-surface border border-line rounded-2xl overflow-hidden">
          <div className="overflow-x-auto max-h-112.5 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-base border-b border-line text-xs font-semibold text-secondary uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-4">Siswa</th>
                  <th className="p-4">Mata Pelajaran</th>
                  <th className="p-4">Nama Kuis</th>
                  <th className="p-4">Tanggal Ujian</th>
                  <th className="p-4">Nilai</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-xs text-secondary">
                      Memuat data rekap hasil...
                    </td>
                  </tr>
                ) : hasilFiltered.length > 0 ? (
                  hasilFiltered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-base/50 transition-colors"
                    >
                      <td className="p-4 font-semibold text-primary">
                        {item.nama}
                      </td>
                      <td className="p-4 text-secondary">{item.mapel}</td>
                      <td className="p-4 text-secondary">{item.judulKuis}</td>
                      <td className="p-4 text-xs text-muted">{item.tanggal}</td>
                      
                      {/* Kolom Nilai */}
                      <td className="p-4 font-bold text-brand">
                        {item.needsEvaluation ? (
                          <span className="text-xs text-amber-500 font-semibold">
                            Pending
                          </span>
                        ) : (
                          item.nilai
                        )}
                      </td>

                      {/* Kolom Status */}
                      <td className="p-4">
                        {item.needsEvaluation ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-md border bg-amber-500/10 text-amber-500 border-amber-500/30">
                            PERLU EVALUASI
                          </span>
                        ) : item.nilai >= 75 ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-md border bg-brand-soft text-brand border-brand-ring">
                            LULUS
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-md border bg-red-950/40 text-av-red border-red-900">
                            REMEDIAL
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleOpenDetail(item.attemptId)}
                          className="rounded-lg bg-base border border-line px-3 py-1.5 text-xs font-semibold text-brand hover:border-brand transition-all cursor-pointer"
                        >
                          👁️ Periksa Jawaban
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center p-8 text-xs text-muted"
                    >
                      Tidak ada data hasil siswa yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Popup Detail Jawaban Essay / Pilihan Ganda */}
      {selectedAttemptId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-line bg-surface p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="font-bold text-primary">
                Evaluasi Jawaban Siswa
              </h2>
              <button
                onClick={() => setSelectedAttemptId(null)}
                className="rounded-lg bg-base px-2.5 py-1 text-xs font-bold text-secondary hover:text-primary cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-12 text-center text-xs text-secondary">
                Memuat jawaban dari database NestJS...
              </div>
            ) : detailAnswers && detailAnswers.answers ? (
              <div className="space-y-4">
                <div className="text-xs text-secondary">
                  Kuis: <strong className="text-primary">{detailAnswers.quiz?.title}</strong>
                </div>

                {detailAnswers.answers.map((ans, idx) => (
                  <div
                    key={ans.id || idx}
                    className="rounded-2xl border border-line bg-base p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-primary">
                        Soal {idx + 1}: {ans.question?.question}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface text-brand border border-line uppercase">
                        {ans.question?.type}
                      </span>
                    </div>

                    {ans.question?.type === "ESSAY" ? (
                      <div className="rounded-xl bg-surface p-3 border border-line space-y-1">
                        <p className="text-[10px] font-bold text-secondary uppercase">
                          Jawaban Essay Teks Siswa:
                        </p>
                        <p className="text-xs font-medium text-primary whitespace-pre-wrap">
                          {ans.answerText || "(Siswa tidak menginputkan jawaban teks)"}
                        </p>
                      </div>
                    ) : (
                      <div className="text-xs text-primary">
                        Pilihan Jawaban:{" "}
                        <span className="font-bold text-brand">
                          {ans.selectedOption?.optionText || "Tidak dijawab"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-secondary">
                Data jawaban tidak ditemukan untuk attempt ini.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}