"use client";

import Navbar from "@/app/components/layout/Navbar";
import { useState } from "react";
import Link from "next/link";

export default function KelolaSoalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("Semua");

  // State untuk menyimpan data modal edit
  const [editingSoal, setEditingSoal] = useState(null);

  const [daftarSoal, setDaftarSoal] = useState([
    {
      id: 1,
      pertanyaan: "Apa fungsi dari protokol HTTP?",
      mapel: "Jaringan Dasar",
      tipe: "Pilihan Ganda",
      kunci: "Hypertext Transfer Protocol untuk komunikasi data web",
    },
    {
      id: 2,
      pertanyaan: "Jelaskan perbedaan antara CSS Flexbox dan Grid!",
      mapel: "Pemrograman Web",
      tipe: "Essay",
      kunci: "Flexbox untuk 1 dimensi, Grid untuk 2 dimensi",
    },
    {
      id: 3,
      pertanyaan: "Sebutkan perintah SQL untuk mengambil semua kolom dari tabel 'users'!",
      mapel: "Basis Data",
      tipe: "Pilihan Ganda",
      kunci: "SELECT * FROM users;",
    },
  ]);

  const handleHapusSoal = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
      setDaftarSoal(daftarSoal.filter((item) => item.id !== id));
    }
  };

  // Handler saat form edit disimpan
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setDaftarSoal(
      daftarSoal.map((soal) =>
        soal.id === editingSoal.id ? editingSoal : soal
      )
    );
    setEditingSoal(null); // Tutup modal setelah simpan
  };

  const soalFiltered = daftarSoal.filter((soal) => {
    const matchSearch = soal.pertanyaan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMapel = selectedMapel === "Semua" || soal.mapel === selectedMapel;
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
                <option value="Jaringan Dasar">Jaringan Dasar</option>
                <option value="Pemrograman Web">Pemrograman Web</option>
                <option value="Basis Data">Basis Data</option>
              </select>
            </div>
          </div>

          {/* Daftar Soal */}
          <div className="space-y-4">
            {soalFiltered.map((item, index) => (
              <div
                key={item.id}
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
                    <strong className="text-primary">Kunci:</strong> {item.kunci}
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
                    onClick={() => handleHapusSoal(item.id)}
                    className="px-3 py-1.5 text-xs font-semibold bg-red-950/40 text-av-red border border-red-900 rounded-lg hover:bg-red-900/40 transition-colors cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}

            {soalFiltered.length === 0 && (
              <div className="bg-surface border border-line rounded-2xl p-8 text-center text-xs text-muted">
                Tidak ada soal yang sesuai dengan pencarian.
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
                  className="px-4 py-2 text-xs font-semibold bg-brand text-base rounded-xl hover:bg-brand-hover"
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