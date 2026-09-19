"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/dashboard/sidebar";
import { useAuth } from "@/app/context/authcontext";

export default function SiswaLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    // 1. TAHAN REDIRECT SELAMA STORAGE BELUM SELESAI DIBACA (F5/REFRESH)
    if (!isHydrated) return;

    // 2. Jika storage sudah selesai dibaca dan user memang belum login, baru lempar ke /login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "STUDENT") {
      router.replace("/dashboard/guru");
    }
  }, [isHydrated, isAuthenticated, user, router]);

  // Tampilkan layar loading ramah UI selama AuthContext sedang membaca storage saat F5/Refresh
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base font-jakarta text-xs font-semibold text-secondary">
        Memverifikasi Sesi LearnBridge...
      </div>
    );
  }

  // Jika belum authenticated atau role tidak sesuai setelah hydrated, tahan render
  if (!isAuthenticated || user?.role !== "STUDENT") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-base text-primary">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-16 md:pt-0">{children}</main>
    </div>
  );
}