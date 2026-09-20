"use client";

import Greetings from "@/app/dashboard/greeting";
import StatCards from "@/app/dashboard/siswa/components/statcards";
import ContinueCard from "@/app/dashboard/siswa/components/continuecard";
import ProgressCard from "@/app/dashboard/siswa/components/progresscard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import { fetchApi } from "@/lib/api";

export default function SiswaDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Normalisasi role supaya menerima STUDENT atau SISWA dari backend
  const userRole = String(user?.role || "").toUpperCase();
  const isSiswa = userRole === "STUDENT" || userRole === "SISWA";

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isSiswa) {
      router.replace("/dashboard/guru");
      return;
    }

    // Auto-Enrollment otomatis saat siswa masuk ke Dashboard
    const ensureAutoEnrollment = async () => {
      try {
        // 1. Ambil daftar course yang sudah di-enroll oleh siswa
        const myCourses = await fetchApi("/enrollments/my-courses").catch(() => []);
        const myCourseList = Array.isArray(myCourses) ? myCourses : [];

        // 2. Ambil seluruh course yang tersedia di backend NestJS
        const allCourses = await fetchApi("/courses").catch(() => []);
        const allCourseList = Array.isArray(allCourses) ? allCourses : [];

        // 3. Jika ada course yang belum di-enroll, daftarkan otomatis secara aman
        if (allCourseList.length > 0 && myCourseList.length < allCourseList.length) {
          await Promise.all(
            allCourseList.map((course) =>
              fetchApi("/enrollments", {
                method: "POST",
                body: JSON.stringify({ courseId: course.id }),
              }).catch(() => null) // Mengabaikan jika sudah terdaftar
            )
          );
        }
      } catch (err) {
        console.warn("Auto-enrollment background process failed:", err);
      }
    };

    ensureAutoEnrollment();
  }, [isAuthenticated, isSiswa, router]);

  if (!isAuthenticated || !isSiswa) {
    return null;
  }

  return (
    <div className="space-y-4 pb-6 md:space-y-6 md:pb-8">
      <Greetings />
      <StatCards />
      <ContinueCard />
      <ProgressCard />
    </div>
  );
}