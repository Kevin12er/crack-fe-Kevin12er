"use client";

import Navbar from "@/app/components/layout/Navbar";
import FormTambahSoal from "./components/FormTambahSoal";
import TabelHasilSiswa from "./components/TabelHasilSiswa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";

export default function DashboardGuruPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [daftarSoal, setDaftarSoal] = useState([
    {
      id: 1,
      pertanyaan: "Hitung hasil dari -12 + 7 - (-5).",
      tipe: "Pilihan Ganda",
      mapel: "Operasi Bilangan Bulat",
    },
  ]);

  const [dataHasil] = useState([
    {
      id: 1,
      nama: "Budi Santoso",
      kelas: "XII RPL 1",
      mapel: "Operasi Bilangan Bulat",
      nilai: 85,
    },
    {
      id: 2,
      nama: "Siti Aminah",
      kelas: "XII RPL 1",
      mapel: "Operasi Pecahan",
      nilai: 60,
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "guru") {
      router.replace("/dashboard/siswa");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "guru") {
    return null;
  }

  const handleTambahSoal = (soalBaru) => {
    setDaftarSoal((prev) => [soalBaru, ...prev]);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base text-primary font-jakarta p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Dashboard Guru */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
                Dashboard <span className="text-brand">Guru</span>
              </h1>
              <p className="text-sm text-secondary mt-1">
                Kelola evaluasi, bank soal, dan pantau hasil ujian siswa SMK.
              </p>
            </div>
            <div>
              <span className="text-xs bg-brand-soft text-brand border border-brand-ring px-3 py-1.5 rounded-lg font-semibold">
                Status: Pengajar
              </span>
            </div>
          </div>

          {/* Ringkasan Statistik Guru */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface border border-line rounded-2xl p-5">
              <p className="text-xs text-secondary font-semibold uppercase tracking-wider">
                Total Soal Buatan
              </p>
              <h3 className="text-2xl font-bold text-brand mt-1">
                {daftarSoal.length} Soal
              </h3>
            </div>
            <div className="bg-surface border border-line rounded-2xl p-5">
              <p className="text-xs text-secondary font-semibold uppercase tracking-wider">
                Siswa Mengerjakan
              </p>
              <h3 className="text-2xl font-bold text-primary mt-1">
                {dataHasil.length} Siswa
              </h3>
            </div>
            <div className="bg-surface border border-line rounded-2xl p-5">
              <p className="text-xs text-secondary font-semibold uppercase tracking-wider">
                Rata-rata Nilai
              </p>
              <h3 className="text-2xl font-bold text-av-amber mt-1">
                {dataHasil.length > 0
                  ? Math.round(
                      dataHasil.reduce((acc, curr) => acc + curr.nilai, 0) /
                        dataHasil.length,
                    )
                  : 0}
              </h3>
            </div>
          </div>

          {/* Section Utama: Form Tambah Soal (Kiri) & Tabel Rekap Nilai (Kanan) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <FormTambahSoal onTambahSoal={handleTambahSoal} />
            </div>

            <div className="lg:col-span-7 space-y-6">
              {/* Tabel Hasil Pengerjaan Siswa */}
              <TabelHasilSiswa dataHasil={dataHasil} />

              {/* Ringkasan Bank Soal Singkat */}
              <div className="bg-surface border border-line rounded-2xl p-6">
                <h3 className="text-md font-bold text-primary mb-3">
                  Bank Soal Terakhir Ditambahkan
                </h3>
                <div className="space-y-2">
                  {daftarSoal.slice(0, 3).map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 bg-base border border-line rounded-xl text-xs flex justify-between items-center"
                    >
                      <span className="font-medium truncate max-w-62.5">
                        {idx + 1}. {item.pertanyaan}
                      </span>
                      <span className="text-brand font-semibold px-2 py-0.5 bg-brand-soft border border-brand-ring rounded">
                        {item.mapel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
