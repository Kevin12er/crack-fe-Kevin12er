"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

export default function DetailMateriPage({ params }) {
  const resolvedParams = use(params);
  const materialId = resolvedParams.id;

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMaterialDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch seluruh daftar materi
        const data = await fetchApi("/materials");
        const materialsList = Array.isArray(data) ? data : [];

        // Cari materi berdasarkan ID di rute
        const found = materialsList.find(
          (m) => String(m.id) === String(materialId)
        );

        if (found) {
          setMaterial(found);
        } else {
          setError("Materi pembelajaran tidak ditemukan.");
        }
      } catch (err) {
        console.error("Gagal mengambil detail materi:", err);
        setError("Gagal memuat materi pembelajaran dari server.");
      } finally {
        setLoading(false);
      }
    };

    if (materialId) {
      getMaterialDetail();
    }
  }, [materialId]);

  return (
    <div className="px-4 py-6 font-jakarta md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Tombol Kembali */}
        <div>
          <Link
            href="/dashboard/siswa/materi"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-base"
          >
            ← Kembali ke Daftar Materi
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center text-sm font-semibold text-secondary">
            Memuat isi materi pembelajaran...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-av-red/30 bg-av-red/10 p-6 text-center text-xs font-semibold text-av-red">
            {error}
          </div>
        )}

        {/* Detail Materi */}
        {!loading && !error && material && (
          <article className="flex flex-col gap-6 rounded-3xl border border-line bg-surface p-6 shadow-sm md:p-10">
            <header className="border-b border-line pb-5">
              <span className="mb-3 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                {material.course?.title || "Materi Matematika"}
              </span>
              <h1 className="text-2xl font-extrabold leading-tight text-primary md:text-4xl">
                {material.title}
              </h1>
            </header>

            <div className="whitespace-pre-wrap text-sm leading-relaxed text-secondary md:text-base">
              {material.content}
            </div>

            <footer className="flex items-center justify-between border-t border-line pt-6">
              <span className="text-xs font-medium text-secondary">
                LearnBridge LMS Learning Module
              </span>
              <Link
                href="/dashboard/siswa/materi"
                className="cursor-pointer rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-primary transition-all hover:bg-brand-hover"
              >
                Selesai Membaca
              </Link>
            </footer>
          </article>
        )}
      </div>
    </div>
  );
}