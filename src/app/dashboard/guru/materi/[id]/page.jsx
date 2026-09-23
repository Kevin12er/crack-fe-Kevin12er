"use client";

import { useState, useEffect, use } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function DetailMateriGuruPage({ params }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State (Tambah / Edit Modul)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  // Load Data Kelas & Modul secara paralel (Murni sesuai Controller)
  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [courseRes, materialsRes] = await Promise.all([
        fetchApi(`/courses/${courseId}`),
        fetchApi(`/materials?courseId=${courseId}`),
      ]);

      setCourse(courseRes);

      const materialsList = Array.isArray(materialsRes)
        ? materialsRes
        : materialsRes?.data || [];
      setMaterials(materialsList);
    } catch (err) {
      setError(err.message || "Gagal memuat data modul.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) loadData();
  }, [courseId]);

  // Modal Handler
  const handleOpenModal = (material = null) => {
    if (material) {
      setEditingMaterialId(material.id);
      setFormData({
        title: material.title || "",
        content: material.content || "",
      });
    } else {
      setEditingMaterialId(null);
      setFormData({ title: "", content: "" });
    }
    setIsModalOpen(true);
  };

  // Submit Handler: POST /materials & PATCH /materials/:id
  const handleSubmitMaterial = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingMaterialId) {
        // PATCH /materials/:id
        await fetchApi(`/materials/${editingMaterialId}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
          }),
        });
      } else {
        // POST /materials
        await fetchApi("/materials", {
          method: "POST",
          body: JSON.stringify({
            courseId,
            title: formData.title,
            content: formData.content,
          }),
        });
      }

      setIsModalOpen(false);
      setFormData({ title: "", content: "" });
      loadData();
    } catch (err) {
      alert(err.message || "Gagal menyimpan modul.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler: DELETE /materials/:id
  const handleDeleteMaterial = async (materialId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus modul ini?")) return;

    try {
      await fetchApi(`/materials/${materialId}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert(err.message || "Gagal menghapus modul.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mt-4 mx-auto px-4 md:px-0 pb-12">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/guru/materi"
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
          <span>Kembali ke Kelola Kelas</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-secondary font-medium">Memuat data modul...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-av-red/10 border border-av-red/20 text-av-red text-center rounded-2xl text-sm font-semibold">
          {error}
        </div>
      ) : (
        <>
          {/* Banner Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-linear-to-r from-surface via-surface to-brand/5 p-6 md:p-8 rounded-3xl border border-line/80 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
                <span className="text-xs font-bold tracking-wider text-brand uppercase">
                  MANAJEMEN MODUL & BAB
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                {course?.title}
              </h1>
              <p className="text-sm text-secondary max-w-xl">
                {course?.description || "Kelola bacaan, instruksi, dan materi pembelajaran untuk kelas ini."}
              </p>
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center justify-center gap-2 bg-brand text-primary px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-brand-hover active:scale-[0.98] transition-all shadow-lg shadow-brand/20 cursor-pointer self-start md:self-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Tambah Modul Baru</span>
            </button>
          </div>

          {/* List Modul / Bab Model Card Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-primary">
              Daftar Modul Pembelajaran ({materials.length})
            </h2>

            {materials.length === 0 ? (
              <div className="text-center py-16 px-4 bg-surface/50 border border-dashed border-line rounded-3xl space-y-3">
                <div className="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
                  📚
                </div>
                <h3 className="font-bold text-primary">Belum ada modul di kelas ini</h3>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  Mulai isi materi bacaan dengan menekan tombol "+ Tambah Modul Baru" di atas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((item, idx) => (
                  <div
                    key={item.id}
                    className="group bg-surface border border-line/80 hover:border-brand/50 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-brand/5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-8">
                      <span className="text-[8px] font-bold text-brand bg-brand/10 px-3 py-1 rounded-full tracking-wide">
                        MODUL {idx + 1}
                      </span>

                      <div>
                        <h3 className="font-bold text-primary group-hover:text-brand transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-secondary mt-2 line-clamp-4 leading-relaxed whitespace-pre-line">
                          {item.content || "Tidak ada rincian isi materi."}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="px-4 py-2 bg-base border border-line text-primary rounded-xl text-xs font-semibold hover:border-brand/40 hover:bg-surface transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(item.id)}
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
          </div>
        </>
      )}

      {/* Modal Form Tambah / Edit Modul */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-line rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-line/60 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-primary">
                  {editingMaterialId ? "Edit Modul Pembelajaran" : "Tambah Modul Baru"}
                </h2>
                <p className="text-xs text-secondary mt-0.5">Tuliskan konten bacaan modul untuk siswa.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-base text-secondary hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitMaterial} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider">
                  Judul Modul / Bab
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bab 1 - Pengenalan Sintaks"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-base border border-line/80 rounded-xl p-3 text-sm text-primary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider">
                  Isi Materi Teks
                </label>
                <textarea
                  rows="6"
                  required
                  placeholder="Tuliskan penjelasan materi lengkap di sini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-base border border-line/80 rounded-xl p-3 text-sm text-primary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none"
                ></textarea>
              </div>

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
                  {submitting ? "Menyimpan..." : "Simpan Modul"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}