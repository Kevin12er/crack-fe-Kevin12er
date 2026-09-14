"use client";

import Navbar from "@/app/components/layout/Navbar";
import { useState } from "react";
import Link from "next/link";

export default function HasilUjianGuruPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("Semua");

  const [dataHasil] = useState([
    {
      id: 1,
      nama: "Budi Santoso",
      kelas: "XII RPL 1",
      mapel: "Pemrograman Web",
      nilai: 85,
      tanggal: "2026-09-01",
    },
    {
      id: 2,
      nama: "Siti Aminah",
      kelas: "XII RPL 1",
      mapel: "Pemrograman Web",
      nilai: 60,
      tanggal: "2026-09-01",
    },
    {
      id: 3,
      nama: "Rian Pratama",
      kelas: "XII RPL 2",
      mapel: "Jaringan Dasar",
      nilai: 92,
      tanggal: "2026-09-02",
    },
    {
      id: 4,
      nama: "Dewi Lestari",
      kelas: "XII RPL 2",
      mapel: "Basis Data",
      nilai: 70,
      tanggal: "2026-09-03",
    },
  ]);

  const hasilFiltered = dataHasil.filter((item) => {
    const matchNama = item.nama
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchMapel =
      selectedMapel === "Semua" || item.mapel === selectedMapel;
    return matchNama && matchMapel;
  });

  const totalSiswa = dataHasil.length;
  const lulus = dataHasil.filter((s) => s.nilai >= 75).length;
  const remedial = totalSiswa - lulus;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base text-primary font-jakarta p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
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
                {totalSiswa} Siswa
              </h3>
            </div>
            <div className="bg-surface border border-line p-4 rounded-2xl">
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                Siswa Lulus (≥75)
              </span>
              <h3 className="text-2xl font-bold text-brand mt-1">
                {lulus} Siswa
              </h3>
            </div>
            <div className="bg-surface border border-line p-4 rounded-2xl">
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                Perlu Remedial
              </span>
              <h3 className="text-2xl font-bold text-av-red mt-1">
                {remedial} Siswa
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
                <option value="Semua">Semua Mata Pelajaran</option>
                <option value="Pemrograman Web">Pemrograman Web</option>
                <option value="Jaringan Dasar">Jaringan Dasar</option>
                <option value="Basis Data">Basis Data</option>
              </select>
            </div>
          </div>

          {/* Tabel Detail */}
          <div className="bg-surface border border-line rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-base border-b border-line text-xs font-semibold text-secondary uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Siswa</th>
                    <th className="p-4">Kelas</th>
                    <th className="p-4">Mata Pelajaran</th>
                    <th className="p-4">Tanggal Ujian</th>
                    <th className="p-4">Nilai</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {hasilFiltered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-base/50 transition-colors"
                    >
                      <td className="p-4 font-semibold text-primary">
                        {item.nama}
                      </td>
                      <td className="p-4 text-secondary">{item.kelas}</td>
                      <td className="p-4 text-secondary">{item.mapel}</td>
                      <td className="p-4 text-xs text-muted">{item.tanggal}</td>
                      <td className="p-4 font-bold text-brand">{item.nilai}</td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                            item.nilai >= 75
                              ? "bg-brand-soft text-brand border-brand-ring"
                              : "bg-red-950/40 text-av-red border-red-900"
                          }`}
                        >
                          {item.nilai >= 75 ? "LULUS" : "REMEDIAL"}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {hasilFiltered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
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
      </div>
    </>
  );
}
