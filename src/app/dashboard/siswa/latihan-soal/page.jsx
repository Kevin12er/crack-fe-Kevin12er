"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

export default function LatihanSoalPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        setLoading(true);
        const data = await fetchApi("/quizzes");
        setQuizzes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal mengambil kuis:", err);
        setError("Gagal memuat daftar kuis dari server.");
      } finally {
        setLoading(false);
      }
    };

    getQuizzes();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-base p-4 text-primary font-jakarta md:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="border-b border-line pb-4">
            <h1 className="text-2xl font-extrabold text-primary md:text-3xl">
              Latihan Soal & Evaluasi <span className="text-brand">Siswa</span>
            </h1>
            <p className="mt-1 text-xs text-secondary">
              Pilih paket soal yang tersedia untuk menguji pemahaman materimu.
            </p>
          </div>

          {loading && (
            <div className="py-12 text-center text-xs font-semibold text-secondary">
              Memuat daftar latihan soal...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-av-red/30 bg-av-red/10 p-4 text-center text-xs font-semibold text-av-red">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {quizzes.length > 0 ? (
                quizzes.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-surface p-5"
                  >
                    <div>
                      <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold text-brand uppercase">
                        {item.course?.title || "Umum"}
                      </span>
                      <h3 className="mt-2 font-bold text-primary">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-secondary line-clamp-2">
                        {item.description || "Kuis evaluasi pembelajaran."}
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/siswa/kuis/${item.id}`}
                      className="block text-center w-full rounded-xl bg-brand py-2.5 text-xs font-bold text-primary hover:bg-brand-hover transition-all cursor-pointer"
                    >
                      Mulai Kerjakan
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-xs text-secondary rounded-2xl border border-dashed border-line">
                  Belum ada latihan soal yang tersedia saat ini.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}