"use client";

import Navbar from "@/app/components/layout/Navbar";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";

const daftarBab = [
  {
    id: "bab-1",
    icon: "1",
    title: "Operasi Hitung Bilangan Bulat Positif dan Negatif",
    deskripsi:
      "Pengenalan konsep bilangan bulat, aturan tanda, dan latihan operasi campuran.",
    totalMateri: 6,
    estimasiJam: 2.5,
    status: "aktif",
  },
  {
    id: "bab-2",
    icon: "2",
    title: "Operasi Hitung dalam Bentuk Pecahan",
    deskripsi:
      "Penjumlahan, pengurangan, perkalian, pembagian pecahan, dan soal cerita bertahap.",
    totalMateri: 5,
    estimasiJam: 2,
    status: "draft",
  },
];

export default function MateriGuruPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "INSTRUCTOR") {
      router.replace("/dashboard/siswa/materi");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "INSTRUCTOR") {
    return null;
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-base p-4 text-primary md:p-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold md:text-3xl">
                Materi <span className="text-brand">Guru</span>
              </h1>
              <p className="mt-1 text-sm text-secondary">
                Tinjau struktur pembelajaran Matematika untuk siswa dan kelola
                kesiapan tiap bab.
              </p>
            </div>

            <Link
              href="/dashboard/guru"
              className="w-fit rounded-xl border border-brand-ring bg-brand-soft px-4 py-2 text-xs font-bold text-brand transition-colors hover:bg-brand/20"
            >
              Kembali ke Dashboard Guru
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {daftarBab.map((bab) => (
              <article
                key={bab.id}
                className="flex h-full flex-col gap-4 rounded-2xl border border-line-card bg-surface p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft font-extrabold text-brand">
                    {bab.icon}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      bab.status === "aktif"
                        ? "border border-brand-ring bg-brand-soft text-brand"
                        : "border border-line bg-base text-secondary"
                    }`}
                  >
                    {bab.status === "aktif" ? "Siap Dipelajari" : "Masih Draft"}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold leading-snug text-primary">
                    {bab.title}
                  </h2>
                  <p className="mt-2 text-sm text-secondary">{bab.deskripsi}</p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-xs text-secondary">
                  <span>{bab.totalMateri} materi</span>
                  <span>Estimasi {bab.estimasiJam} jam</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
