"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/authcontext";
import { fetchApi } from "@/lib/api";

function MateriGuruPage() {
  const { user } = useAuth();

  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    courseId: "",
  });

  const [courseFormData, setCourseFormData] = useState({
    title: "Matematika Dasar SMK",
    description: "Mata pelajaran Matematika untuk fondasi kejuruan.",
  });

  // Load Data Materials & Courses
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Materials
      const materialsData = await fetchApi("/materials");
      setMaterials(Array.isArray(materialsData) ? materialsData : []);

      // 2. Fetch Courses
      const coursesData = await fetchApi("/courses");
      const courseList = Array.isArray(coursesData) ? coursesData : [];
      setCourses(courseList);

      if (courseList.length > 0) {
        setFormData((prev) => ({ ...prev, courseId: courseList[0].id }));
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
      setError("Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handler Buat Course Baru (POST /courses) - Bebas dari Error Price Validasi NestJS
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // Sisipkan price: 0 & name secara otomatis di background
      const coursePayload = {
        title: courseFormData.title,
        description: courseFormData.description,
        price: 0, // Mandatory validation NestJS DTO
      };

      const newCourse = await fetchApi("/courses", {
        method: "POST",
        body: JSON.stringify(coursePayload),
      });

      alert("Mata Pelajaran berhasil dibuat!");
      setIsCourseModalOpen(false);
      await loadInitialData();
      
      if (newCourse?.id) {
        setFormData((prev) => ({ ...prev, courseId: newCourse.id }));
      }
    } catch (err) {
      alert("Gagal membuat course: " + (err.message || "Terjadi kesalahan."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Submit Materi (POST /materials)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.courseId) {
      alert("Judul, Konten, dan Course wajib diisi!");
      return;
    }

    try {
      setIsSubmitting(true);
      await fetchApi("/materials", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          courseId: formData.courseId,
        }),
      });

      setFormData({
        title: "",
        content: "",
        courseId: courses.length > 0 ? courses[0].id : "",
      });
      setIsModalOpen(false);
      await loadInitialData();
    } catch (err) {
      alert("Gagal menambahkan materi: " + (err.message || "Terjadi kesalahan."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-base p-4 text-primary md:p-8 font-jakarta">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold md:text-3xl">
              Materi <span className="text-brand">Guru</span>
            </h1>
            <p className="mt-1 text-sm text-secondary">
              Kelola materi pembelajaran Matematika yang akan diakses oleh siswa.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-brand px-4 py-2 text-xs font-bold text-primary shadow-md hover:bg-brand-hover cursor-pointer transition-all"
            >
              + Tambah Materi Baru
            </button>
            <Link
              href="/dashboard/guru"
              className="w-fit rounded-xl border border-brand-ring bg-brand-soft px-4 py-2 text-xs font-bold text-brand transition-colors hover:bg-brand/20"
            >
              Kembali
            </Link>
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center text-sm font-semibold text-secondary">
            Memuat data materi...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-av-red/30 bg-av-red/10 p-4 text-center text-xs font-semibold text-av-red">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {materials.length > 0 ? (
              materials.map((materi, index) => (
                <article
                  key={materi.id || index}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft font-extrabold text-brand">
                      {index + 1}
                    </div>
                    <span className="rounded-full border border-brand-ring bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
                      Aktif
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold leading-snug text-primary">
                      {materi.title}
                    </h2>
                    <p className="mt-2 text-sm text-secondary line-clamp-3">
                      {materi.content}
                    </p>
                  </div>

                  <div className="mt-auto border-t border-line pt-4 text-xs text-secondary flex justify-between items-center">
                    <span>Materi Terpublikasi</span>
                    <span className="font-semibold text-brand">LMS LearnBridge</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-sm text-secondary rounded-2xl border border-dashed border-line">
                Belum ada materi yang dibuat. Klik tombol <strong>"+ Tambah Materi Baru"</strong> di atas untuk membuat materi pertama.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Tambah Materi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-primary mb-4">Tambah Materi Baru</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-secondary uppercase">
                    Pilih Course / Mata Pelajaran
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCourseModalOpen(true)}
                    className="text-xs font-bold text-brand hover:underline cursor-pointer"
                  >
                    + Buat Course Baru
                  </button>
                </div>

                {courses.length > 0 ? (
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full rounded-xl border border-line bg-base p-3 text-sm text-primary focus:outline-none focus:border-brand"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name || c.title || c.id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                    Belum ada Course. Klik <strong>"+ Buat Course Baru"</strong> di atas terlebih dahulu.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                  Judul Materi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Operasi Hitung Bilangan Bulat Positif dan Negatif"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-line bg-base p-3 text-sm text-primary focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                  Isi / Konten Materi
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Pengenalan konsep bilangan bulat, aturan tanda, dan latihan operasi campuran."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full rounded-xl border border-line bg-base p-3 text-sm text-primary focus:outline-none focus:border-brand"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-secondary hover:bg-base cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || courses.length === 0}
                  className="rounded-xl bg-brand px-4 py-2 text-xs font-bold text-primary hover:bg-brand-hover disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Materi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Course (Mata Pelajaran) */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-primary mb-3">Buat Course Baru</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                  Nama Course / Pelajaran
                </label>
                <input
                  type="text"
                  required
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  className="w-full rounded-xl border border-line bg-base p-3 text-sm text-primary focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows="2"
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  className="w-full rounded-xl border border-line bg-base p-3 text-sm text-primary focus:outline-none focus:border-brand"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="rounded-xl border border-line px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-base cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand px-3 py-1.5 text-xs font-bold text-primary hover:bg-brand-hover cursor-pointer"
                >
                  {isSubmitting ? "Membuat..." : "Buat Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default MateriGuruPage;