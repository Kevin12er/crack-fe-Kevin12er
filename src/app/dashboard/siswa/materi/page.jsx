"use client";

import { useEffect, useState } from "react";
import MateriCard from "./components/MateriCards";
import { fetchApi } from "@/lib/api";

function MateriPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMaterials = async () => {
      try {
        setLoading(true);
        // Panggil endpoint GET /materials
        const data = await fetchApi("/materials");
        setMaterials(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal mengambil data materi:", err);
        setError("Gagal memuat materi pembelajaran. Pastikan koneksi ke server aman.");
      } finally {
        setLoading(false);
      }
    };

    getMaterials();
  }, []);

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 font-jakarta">
      <div className="mx-auto w-full max-w-6xl">
        <section className="relative overflow-hidden rounded-3xl border border-line-card bg-surface px-6 py-7 md:px-10 md:py-9">
          <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-brand-soft blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-44 w-44 rounded-full bg-brand-soft blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 text-center">
            <span className="mx-auto inline-flex w-fit rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-brand">
              Ruang Belajar
            </span>

            <h1 className="text-3xl font-extrabold leading-tight text-primary md:text-5xl">
              Materi Belajar Matematika
            </h1>

            <p className="mx-auto max-w-2xl text-sm text-secondary md:text-[15px] md:text-primary/85">
              Pelajari topik sesuai kelasmu dengan jalur materi yang
              terstruktur, ringkas, dan mudah diikuti dari dasar sampai mahir.
            </p>
          </div>
        </section>

        {/* State Loading */}
        {loading && (
          <div className="mt-8 text-center text-sm font-semibold text-secondary py-12">
            Memuat daftar materi...
          </div>
        )}

        {/* State Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-av-red/30 bg-av-red/10 p-4 text-center text-xs font-semibold text-av-red">
            {error}
          </div>
        )}

        {/* Display Data Materi */}
        {!loading && !error && (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {materials.length > 0 ? (
              materials.map((item, index) => (
                <MateriCard
                  key={item.id || index}
                  id={item.id}
                  icon={item.icon || "📚"}
                  nama={item.title || item.nama || "Materi Pembelajaran"}
                  kelas={item.kelas || item.course?.title || "Umum"}
                  materi={item.materiCount || item.lessonsCount || 1}
                  jam={item.duration || 1}
                  progress={item.progress || 0}
                  status={item.status || "start"}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-sm text-secondary rounded-2xl border border-dashed border-line">
                Belum ada materi pembelajaran yang tersedia saat ini.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Pastikan export default ada di baris paling bawah secara eksplisit
export default MateriPage;