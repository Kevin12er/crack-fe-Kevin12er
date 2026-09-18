"use client";

import Navbar from "@/app/components/layout/Navbar";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";

const nilaiDummy = [
  {
    id: 1,
    topik: "Operasi Bilangan Bulat",
    judul: "Kuis Bilangan Bulat - Dasar",
    nilai: 84,
    tanggal: "2026-09-09",
  },
  {
    id: 2,
    topik: "Operasi Bilangan Bulat",
    judul: "Latihan Campuran Bilangan Bulat",
    nilai: 72,
    tanggal: "2026-09-12",
  },
  {
    id: 3,
    topik: "Operasi Pecahan",
    judul: "Kuis Pecahan Senilai",
    nilai: 0,
    tanggal: "-",
  },
];

export default function NilaiSayaPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [selectedTopik, setSelectedTopik] = useState("Semua");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "STUDENT") {
      router.replace("/dashboard/guru");
    }
  }, [isAuthenticated, user, router]);

  const hasilFiltered = useMemo(() => {
    if (selectedTopik === "Semua") return nilaiDummy;
    return nilaiDummy.filter((item) => item.topik === selectedTopik);
  }, [selectedTopik]);

  const totalDikerjakan = nilaiDummy.filter((item) => item.nilai > 0).length;
  const totalLulus = nilaiDummy.filter((item) => item.nilai >= 75).length;
  const rataRata =
    totalDikerjakan > 0
      ? Math.round(
          nilaiDummy
            .filter((item) => item.nilai > 0)
            .reduce((acc, item) => acc + item.nilai, 0) / totalDikerjakan,
        )
      : 0;

  if (!isAuthenticated || user?.role !== "STUDENT") {
    return null;
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-base p-4 text-primary md:p-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-3 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold md:text-3xl">
                Nilai <span className="text-brand">Saya</span>
              </h1>
              <p className="mt-1 text-sm text-secondary">
                Pantau nilai latihan untuk 2 topik Matematika yang aktif.
              </p>
            </div>

            <Link
              href="/dashboard/siswa"
              className="w-fit rounded-xl border border-brand-ring bg-brand-soft px-4 py-2 text-xs font-bold text-brand transition-colors hover:bg-brand/20"
            >
              Kembali ke Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Rata-rata Nilai
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-brand">
                {rataRata}
              </h3>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Latihan Dikerjakan
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-primary">
                {totalDikerjakan}
              </h3>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Lulus (&gt;= 75)
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-av-blue">
                {totalLulus}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
            <label className="text-xs font-semibold text-secondary">
              Topik:
            </label>
            <select
              value={selectedTopik}
              onChange={(event) => setSelectedTopik(event.target.value)}
              className="rounded-xl border border-line bg-base px-3 py-2 text-xs text-primary focus:border-brand focus:outline-none"
            >
              <option value="Semua">Semua Topik</option>
              <option value="Operasi Bilangan Bulat">
                Operasi Bilangan Bulat
              </option>
              <option value="Operasi Pecahan">Operasi Pecahan</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-base text-xs uppercase tracking-wider text-secondary">
                <tr>
                  <th className="p-4">Topik</th>
                  <th className="p-4">Latihan</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Nilai</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {hasilFiltered.map((item) => {
                  const status =
                    item.nilai === 0
                      ? "Belum Dikerjakan"
                      : item.nilai >= 75
                        ? "Lulus"
                        : "Remedial";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-base/40 transition-colors"
                    >
                      <td className="p-4 text-secondary">{item.topik}</td>
                      <td className="p-4 font-semibold text-primary">
                        {item.judul}
                      </td>
                      <td className="p-4 text-xs text-dim">{item.tanggal}</td>
                      <td className="p-4 font-extrabold text-brand">
                        {item.nilai === 0 ? "-" : item.nilai}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            status === "Lulus"
                              ? "border border-brand-ring bg-brand-soft text-brand"
                              : status === "Remedial"
                                ? "border border-av-red/40 bg-red-950/40 text-av-red"
                                : "border border-line bg-base text-secondary"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {hasilFiltered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-xs text-muted"
                    >
                      Belum ada data nilai untuk topik yang dipilih.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
