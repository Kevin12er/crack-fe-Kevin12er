"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";

export default function InstructorCourseManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch Kursus
  const loadCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchApi("/courses");
      const data = Array.isArray(res) ? res : res?.data || [];
      setCourses(data);
    } catch (err) {
      setError(err.message || "Gagal memuat data kelas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Open Modal
  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourseId(course.id);
      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price || 0,
      });
    } else {
      setEditingCourseId(null);
      setFormData({
        title: "",
        description: "",
        price: 0,
      });
    }
    setIsModalOpen(true);
  };

  // Submit Handler (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
      };

      if (editingCourseId) {
        await fetchApi(`/courses/${editingCourseId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi("/courses", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      loadCourses();
    } catch (err) {
      alert(err.message || "Gagal menyimpan kelas.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (courseId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kelas ini?")) return;

    try {
      await fetchApi(`/courses/${courseId}`, { method: "DELETE" });
      loadCourses();
    } catch (err) {
      alert(err.message || "Gagal menghapus kelas.");
    }
  };

  return (
    <>
    <Navbar />
    <div className="space-y-6 max-w-7xl mt-4 mx-auto px-4 md:px-0 pb-12">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/guru"
          className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-brand transition-colors group"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-linear-to-r from-surface via-surface to-brand/5 p-6 md:p-8 rounded-3xl border border-line/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
            <span className="text-xs font-bold tracking-wider text-brand uppercase">Management Console</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Kelola Kelas & Materi</h1>
          <p className="text-sm text-secondary max-w-xl">
            Buat kelas baru, perbarui kurikulum, dan pantau materi pembelajaran yang dipublikasikan.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 bg-brand text-primary px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-brand-hover active:scale-[0.98] transition-all shadow-lg shadow-brand/20 cursor-pointer self-start md:self-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Buat Kelas Baru</span>
        </button>
      </div>

      {/* Grid List Kelas */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-secondary font-medium">Memuat daftar kelas...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-av-red/10 border border-av-red/20 text-av-red text-center rounded-2xl text-sm font-semibold">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 px-4 bg-surface/50 border border-dashed border-line rounded-3xl space-y-3">
          <div className="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
            📚
          </div>
          <h3 className="font-bold text-primary">Belum ada kelas yang dibuat</h3>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            Mulai bagikan ilmu kamu dengan menekan tombol "Buat Kelas Baru" di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-surface border border-line/80 hover:border-brand/50 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-brand/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-brand bg-brand/10 px-3 py-1 rounded-full tracking-wide">
                    ACTIVE CLASS
                  </span>
                  <span className="font-black text-primary">
                    {course.price === 0 ? (
                      <span className="text-emerald-500">Gratis</span>
                    ) : (
                      `Rp ${course.price?.toLocaleString("id-ID")}`
                    )}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-primary group-hover:text-brand transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-secondary mt-2 line-clamp-3 leading-relaxed">
                    {course.description || "Tidak ada deskripsi singkat."}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
                <div className="flex gap-2">   
                {/* Button kelola soal yang mengarah ke materi/id */}
                <Link
                  href={`/dashboard/guru/materi/${course.id}`}
                  className="px-3.5 py-2 bg-brand/10 text-brand rounded-xl text-xs font-bold hover:bg-brand hover:text-primary transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Kelola Isi Modul
                </Link>  
                <button
                  onClick={() => handleOpenModal(course)}
                  className="px-4 py-2 bg-base border border-line text-primary rounded-xl text-xs font-semibold hover:border-brand/40 hover:bg-surface transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                </div>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="px-4 py-2 bg-av-red/10 text-av-red rounded-xl text-xs font-semibold hover:bg-av-red hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-line rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line/60 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-primary">
                  {editingCourseId ? "Edit Detail Kelas" : "Buat Kelas Baru"}
                </h2>
                <p className="text-xs text-secondary mt-0.5">Isi informasi dasar kelas pembelajaranmu.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-base text-secondary hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider">
                  Judul Kelas
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Pemrograman Next.js App Router"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-base border border-line/80 rounded-xl p-3 text-sm text-primary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider">
                  Harga Kursus (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="0 untuk gratis"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-base border border-line/80 rounded-xl p-3 text-sm text-primary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider">
                  Deskripsi Kelas
                </label>
                <textarea
                  rows="4"
                  placeholder="Tuliskan rangkuman materi dan tujuan pembelajaran..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-base border border-line/80 rounded-xl p-3 text-sm text-primary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none"
                ></textarea>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-line/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-secondary hover:bg-line/50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand text-primary px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-hover active:scale-95 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Menyimpan..." : "Simpan Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}