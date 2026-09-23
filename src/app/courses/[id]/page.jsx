"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/layout/Navbar";
import { useAuth } from "@/app/context/authcontext";
import { fetchApi } from "@/lib/api";

export default function CourseDetailPage({ params }) {
  // Unwrap params untuk Next.js App Router
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  // Fetch data detail kursus berdasarkan ID
  useEffect(() => {
    async function loadCourseDetail() {
      try {
        setLoading(true);
        const data = await fetchApi(`/courses/${courseId}`);
        setCourse(data);
      } catch (err) {
        setError(err.message || "Gagal memuat detail kursus.");
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      loadCourseDetail();
    }
  }, [courseId]);

  // Handler Tombol "Ikuti Kelas"
  const handleEnroll = async () => {
    // 1. Jika Belum Login -> Arahkan ke Login
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // 2. Jika Login Sebagai Guru -> Tampilkan Peringatan
    const isInstructor = String(user?.role || "").toUpperCase() === "INSTRUCTOR";
    if (isInstructor) {
      alert("Akun Instructor/Guru tidak perlu mendaftar ke kelas.");
      return;
    }

    // 3. Eksekusi Enroll untuk Student
    setEnrolling(true);
    try {
      await fetchApi("/enrollments", {
        method: "POST",
        body: JSON.stringify({ courseId }),
      });
      setEnrollSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/siswa");
      }, 1500);
    } catch (err) {
      alert(err.message || "Gagal mendaftar kelas. Kamu mungkin sudah terdaftar.");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-base text-primary p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {loading ? (
            <div className="text-center py-20 text-secondary font-medium">
              Memuat detail kelas...
            </div>
          ) : error ? (
            <div className="p-4 bg-av-red/10 border border-av-red/30 text-av-red text-center rounded-xl font-semibold">
              {error}
            </div>
          ) : course ? (
            <div className="bg-surface border border-line rounded-3xl p-8 shadow-xl space-y-6">
              
              {/* Badge Kategori & Harga */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand bg-brand/10 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                  {course.category || "Umum"}
                </span>
                <span className="text-xl font-extrabold text-primary">
                  {course.price === 0 ? "Gratis" : `Rp ${course.price?.toLocaleString("id-ID")}`}
                </span>
              </div>

              {/* Judul & Deskripsi */}
              <div>
                <h1 className="text-3xl font-extrabold text-primary">{course.title}</h1>
                <p className="text-secondary mt-3 text-sm leading-relaxed">
                  {course.description || "Tidak ada deskripsi rinci untuk kursus ini."}
                </p>
              </div>

              {/* Info Pengajar */}
              {course.instructor && (
                <div className="pt-4 border-t border-line flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center font-bold text-brand text-sm">
                    {course.instructor.name?.[0] || "G"}
                  </div>
                  <div>
                    <p className="text-xs text-muted">Pengajar</p>
                    <p className="text-sm font-semibold text-primary">{course.instructor.name}</p>
                  </div>
                </div>
              )}

              {/* Feedback Notifikasi Pendaftaran */}
              {enrollSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-500 text-sm font-semibold text-center rounded-xl">
                   Berhasil mendaftar kelas! Mengalihkan ke Dashboard Siswa...
                </div>
              )}

              {/* Tombol Akses / Enroll */}
              <div className="pt-6 border-t border-line flex justify-end">
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || enrollSuccess}
                  className="bg-brand text-primary px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-brand-hover active:scale-95 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {enrolling
                    ? "Memproses..."
                    : !isAuthenticated
                    ? "Login untuk Ikuti Kelas"
                    : "Ikuti Kelas Sekarang"}
                </button>
              </div>

            </div>
          ) : null}

        </div>
      </main>
    </>
  );
}