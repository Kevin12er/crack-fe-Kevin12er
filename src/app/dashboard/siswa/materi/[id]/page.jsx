// src/app/dashboard/siswa/materi/[id]/page.js
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import { fetchApi } from "@/lib/api";

export default function DetailMateriPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const materialId = resolvedParams.id;

  const { user, loading: authLoading } = useAuth(); // Import auth state

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Tahan eksekusi jika auth masih dalam proses verifikasi token (misal saat F5 / Refresh)
    if (authLoading) return;

    // 2. Jika auth selesai dan user ternyata tidak ada, baru ke dashboard
    if (!user) {
      router.push("/dashboard");
      return;
    }

    // 3. Ambil data materi dari backend API
    const getMaterialDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Coba ambil langsung dari endpoint detail jika ada, atau fallback ke list
        let found = null;
        try {
          found = await fetchApi(`/materials/${materialId}`);
        } catch {
          const data = await fetchApi("/materials");
          const materialsList = Array.isArray(data) ? data : [];
          found = materialsList.find(
            (m) => String(m.id) === String(materialId)
          );
        }

        if (found && found.id) {
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
  }, [materialId, user, authLoading, router]);

  // Tampilkan layar loading ramah UI jika Auth sedang memverifikasi token saat Refresh
  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-jakarta text-xs text-secondary">
        Memverifikasi sesi pengguna...
      </div>
    );
  }

  return (
    <div className="px-4 py-6 font-jakarta md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {/* Tombol Kembali */}
        <div>
          <Link
            href="/dashboard/siswa/materi"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold text-brand transition-colors hover:bg-base"
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
                {material.course?.title || material.course?.name || "Materi Matematika"}
              </span>
              <h1 className="text-2xl font-extrabold leading-tight text-brand md:text-4xl">
                {material.title}
              </h1>
            </header>

            <div className="whitespace-pre-wrap text-sm leading-relaxed text-primary">
              {material.content}
            </div>

            <footer className="flex items-center justify-between border-t border-line pt-6">
              <span className="text-xs font-medium text-secondary">
                LearnBridge LMS Learning Module
              </span>
              <Link
                href="/dashboard/siswa/materi"
                className="cursor-pointer rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-brand-hover active:scale-95"
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