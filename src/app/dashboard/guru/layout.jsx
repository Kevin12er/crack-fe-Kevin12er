"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import Navbar from "@/app/components/layout/Navbar";

export default function DashboardGuruLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // 1. Tunggu hingga proses pembacaan localStorage di AuthContext selesai
    if (isLoading) return;

    // 2. Jika tidak terautentikasi, baru lempar ke /login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // 3. Cek role dengan toleransi huruf besar/kecil
    const userRole = String(user?.role || "").toUpperCase();
    if (userRole !== "INSTRUCTOR" && userRole !== "GURU") {
      router.replace("/dashboard/siswa");
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Tampilkan loading sebentar saat memeriksa session
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base text-secondary text-sm font-semibold">
        Memeriksa sesi pengguna...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const userRole = String(user?.role || "").toUpperCase();
  if (userRole !== "INSTRUCTOR" && userRole !== "GURU") return null;

  return (
    <div className="min-h-screen bg-base text-primary font-jakarta">
      <main>{children}</main>
    </div>
  );
}