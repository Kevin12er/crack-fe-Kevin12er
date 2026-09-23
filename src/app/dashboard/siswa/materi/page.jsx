// src/app/dashboard/siswa/materi/page.jsx
"use client";

import { useEffect, useState } from "react";
import MateriCard from "./components/MateriCards";
import { fetchApi } from "@/lib/api";

function MateriPage() {
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMaterials = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buat query string jika ada pencarian
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const data = await fetchApi(`/materials${query}`);

        setMaterials(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal mengambil data materi:", err);
        setError("Gagal memuat materi pembelajaran. Pastikan koneksi ke server aman.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce 300ms agar fetch API tidak dieksekusi di setiap ketikan keyboard
    const timeoutId = setTimeout(() => {
      getMaterials();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 font-jakarta">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Banner Section */}
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

            {/* Input Filter Search */}
            <div className="mx-auto mt-2 w-full max-w-md">
              <input
                type="text"
                placeholder="Cari materi pembelajaran..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-line-card bg-surface/80 px-4 py-2.5 text-sm font-medium text-primary placeholder-secondary/60 outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>
        </section>

        {/* State Loading */}
        {loading && (
          <div className="py-12 text-center text-sm font-semibold text-secondary">
            Memuat daftar materi...
          </div>
        )}

        {/* State Error */}
        {error && (
          <div className="rounded-2xl border border-av-red/30 bg-av-red/10 p-4 text-center text-xs font-semibold text-av-red">
            {error}
          </div>
        )}

        {/* Display Data Materi */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {materials.length > 0 ? (
              materials.map((item, index) => (
                <MateriCard
                  key={item.id || index}
                  id={item.id}
                  icon={item.icon || "📚"}
                  nama={item.title || item.nama || "Materi Pembelajaran"}
                  kelas={item.course?.title || item.kelas || "Umum"}
                  materi={item.order ?? (index + 1)}
                  jam={item.duration || 1}
                  progress={item.progress || 0}
                  status={item.status || "start"}
                />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-line-card py-12 text-center text-sm font-medium text-secondary">
                {search
                  ? `Tidak ada materi yang cocok dengan "${search}"`
                  : "Belum ada materi pembelajaran yang tersedia saat ini."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MateriPage;