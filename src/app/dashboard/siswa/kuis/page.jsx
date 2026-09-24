"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import { fetchApi } from "@/lib/api";

export default function DaftarKuisSiswaPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);

        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const data = await fetchApi(`/quizzes${query}`);
        setQuizzes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal mengambil kuis:", err);
        setError("Gagal memuat daftar kuis dari server.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      getQuizzes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base p-4 text-primary font-jakarta md:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-line pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-primary md:text-3xl">
                Kuis & Evaluasi <span className="text-brand">Siswa</span>
              </h1>
              <p className="mt-1 text-xs text-secondary">
                Pilih kuis yang tersedia untuk menguji pemahaman materimu.
              </p>
            </div>

            {/* Input Pencarian */}
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Cari kuis..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-2 text-xs font-medium text-primary placeholder-secondary/60 outline-none transition-all focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-12 text-center text-xs font-semibold text-secondary">
              Memuat daftar kuis...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-xl border border-av-red/30 bg-av-red/10 p-4 text-center text-xs font-semibold text-av-red">
              {error}
            </div>
          )}

          {/* List Data Kuis */}
          {!loading && !error && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {quizzes.length > 0 ? (
                quizzes.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-surface p-5 transition-all hover:border-brand/40"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold text-brand uppercase">
                          {item.course?.title || "Umum"}
                        </span>
                        {item.timeLimit && (
                          <span className="text-[11px] font-medium text-secondary">
                            ⏱️ {item.timeLimit} Menit
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-primary">
                        {item.title}
                      </h3>
                      <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                        {item.description || "Kuis evaluasi pembelajaran."}
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/siswa/kuis/${item.id}`}
                      className="block text-center w-full rounded-xl bg-brand py-2.5 text-xs font-bold text-white hover:bg-brand-hover active:scale-95 transition-all"
                    >
                      Kerjakan Kuis
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-xs text-secondary rounded-2xl border border-dashed border-line">
                  {search
                    ? `Tidak ada kuis yang cocok dengan "${search}"`
                    : "Belum ada kuis yang tersedia saat ini."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}