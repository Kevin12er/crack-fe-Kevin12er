"use client";

import { useState } from "react";

export default function LatihanSoalSiswaPage() {
  const [activeQuiz, setActiveQuiz] = useState(null); // State jika siswa sedang mengerjakan kuis
  const [jawabanSiswa, setJawabanSiswa] = useState({});

  const [daftarLatihan] = useState([
    {
      id: 1,
      judul: "Kuis Dasar Pemrograman Web",
      mapel: "Pemrograman Web",
      durasi: "15 Menit",
      jumlahSoal: 2,
      status: "Belum Dikerjakan",
      soal: [
        {
          id: 101,
          pertanyaan: "Apa fungsi utama dari tag <a> dalam HTML?",
          opsi: [
            "Membuat teks tebal",
            "Membuat hyperlink / tautan",
            "Menambahkan gambar",
            "Membuat tabel",
          ],
        },
        {
          id: 102,
          pertanyaan:
            "Properti CSS mana yang digunakan untuk mengubah warna teks?",
          opsi: ["text-style", "font-color", "color", "background-color"],
        },
      ],
    },
    {
      id: 2,
      judul: "Evaluasi Topologi Jaringan",
      mapel: "Jaringan Dasar",
      durasi: "20 Menit",
      jumlahSoal: 5,
      status: "Selesai",
      nilai: 85,
    },
  ]);

  const handlePilihJawaban = (soalId, opsiIndex) => {
    setJawabanSiswa({ ...jawabanSiswa, [soalId]: opsiIndex });
  };

  const handleSelesaiUjian = () => {
    alert("Jawaban berhasil dikirim! Nilai kamu sedang diproses.");
    setActiveQuiz(null);
    setJawabanSiswa({});
  };

  return (
    <div className="bg-base p-4 font-jakarta text-primary md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Mode 1: Tampilan Daftar Latihan Soal */}
        {!activeQuiz && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
                  Latihan <span className="text-brand">Soal & Kuis</span>
                </h1>
                <p className="text-sm text-secondary mt-1">
                  Uji pemahaman materi kamu sebelum menghadapi ujian akhir.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {daftarLatihan.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface border border-line rounded-2xl p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold bg-brand-soft text-brand border border-brand-ring px-2.5 py-1 rounded-lg">
                        {item.mapel}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          item.status === "Selesai"
                            ? "bg-brand-soft text-brand border-brand-ring"
                            : "bg-base text-secondary border-line"
                        }`}
                      >
                        {item.status === "Selesai"
                          ? `Nilai: ${item.nilai}`
                          : item.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-primary">
                      {item.judul}
                    </h3>
                    <p className="text-xs text-secondary">
                      ⏱️ {item.durasi} • 📝 {item.jumlahSoal} Soal
                    </p>
                  </div>

                  <button
                    onClick={() => item.soal && setActiveQuiz(item)}
                    disabled={item.status === "Selesai"}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      item.status === "Selesai"
                        ? "bg-base text-muted border border-line cursor-not-allowed"
                        : "bg-brand text-base hover:bg-brand-hover"
                    }`}
                  >
                    {item.status === "Selesai"
                      ? "Sudah Dikerjakan"
                      : "Mulai Kerjakan"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Mode 2: Tampilan Saat Mengerjakan Kuis */}
        {activeQuiz && (
          <div className="bg-surface border border-line rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-line pb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">
                  {activeQuiz.judul}
                </h2>
                <p className="text-xs text-secondary mt-1">
                  {activeQuiz.mapel}
                </p>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="text-xs text-secondary hover:underline"
              >
                &larr; Batal / Keluar
              </button>
            </div>

            {/* Lembar Soal */}
            <div className="space-y-6">
              {activeQuiz.soal.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-base border border-line p-5 rounded-2xl space-y-3"
                >
                  <h4 className="text-sm font-semibold text-primary">
                    {idx + 1}. {q.pertanyaan}
                  </h4>
                  <div className="space-y-2">
                    {q.opsi.map((opsi, oIdx) => (
                      <label
                        key={oIdx}
                        onClick={() => handlePilihJawaban(q.id, oIdx)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          jawabanSiswa[q.id] === oIdx
                            ? "bg-brand-soft border-brand text-brand font-semibold"
                            : "bg-surface border-line text-secondary hover:border-brand/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`soal-${q.id}`}
                          checked={jawabanSiswa[q.id] === oIdx}
                          onChange={() => {}}
                          className="accent-brand"
                        />
                        {opsi}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-line pt-4">
              <button
                onClick={handleSelesaiUjian}
                className="px-6 py-2.5 text-xs font-semibold bg-brand text-base rounded-xl hover:bg-brand-hover transition-colors cursor-pointer"
              >
                Kirim Jawaban
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
