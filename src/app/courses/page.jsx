"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/layout/Navbar";
import { getCourses } from "@/lib/api";
import Link from "next/link";

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const loadCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCourses({ search, category, minPrice, maxPrice });
      const courseData = Array.isArray(res) ? res : res?.data || [];
      setCourses(courseData);
    } catch (err) {
      setError(err.message || "Gagal memuat daftar kursus.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search saat user mengetik
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCourses();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, category, minPrice, maxPrice]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-base text-primary p-6 md:p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-brand">Katalog Kursus</h1>
            <p className="text-sm text-secondary mt-1">
              Jelajahi materi pembelajaran SMK terbaik untuk tingkatkan keahlianmu.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-surface border border-line p-4 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase mb-1">Cari Kelas</label>
              <input
                type="text"
                placeholder="Judul kursus..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-base border border-line rounded-xl p-2.5 text-sm text-primary focus:outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary uppercase mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-base border border-line rounded-xl p-2.5 text-sm text-primary focus:outline-none focus:border-brand"
              >
                <option value="">Semua Kategori</option>
                <option value="TKJ">Teknik Komputer & Jaringan</option>
                <option value="RPL">Rekayasa Perangkat Lunak</option>
                <option value="MM">Multimedia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary uppercase mb-1">Harga Min (Rp)</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-base border border-line rounded-xl p-2.5 text-sm text-primary focus:outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary uppercase mb-1">Harga Maks (Rp)</label>
              <input
                type="number"
                placeholder="500000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-base border border-line rounded-xl p-2.5 text-sm text-primary focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Grid List Kursus */}
          {loading ? (
            <div className="text-center py-12 text-secondary font-medium">Memuat katalog...</div>
          ) : error ? (
            <div className="p-4 bg-av-red/10 border border-av-red/30 text-av-red text-center rounded-xl font-semibold">
              {error}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 text-muted">Tidak ada kursus yang ditemukan.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-surface border border-line rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-brand transition-all"
                >
                  <div>
                    <span className="text-xs font-bold text-brand bg-brand/10 px-2.5 py-1 rounded-md">
                      {course.category || "Umum"}
                    </span>
                    <h3 className="text-lg font-bold text-primary mt-3 line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-secondary mt-2 line-clamp-2">
                      {course.description || "Tidak ada deskripsi."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted block">Harga</span>
                      <span className="text-sm font-extrabold text-primary">
                        {course.price === 0 ? "Gratis" : `Rp ${course.price?.toLocaleString("id-ID")}`}
                      </span>
                    </div>

                    <Link
                      href={`/courses/${course.id}`}
                      className="bg-brand text-primary px-4 py-2 rounded-xl text-xs font-semibold hover:bg-brand-hover transition-all"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}