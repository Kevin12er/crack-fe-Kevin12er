"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import Navbar from "@/app/components/layout/Navbar";

export default function DashboardGuruLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, isLoading } = useAuth();

  // Gunakan fallback jika properti bernama loading atau isLoading
  const isAuthChecking = authLoading || isLoading;

  useEffect(() => {
    if (isAuthChecking) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const userRole = String(user?.role || "").toUpperCase();
    if (userRole !== "INSTRUCTOR" && userRole !== "GURU") {
      router.replace("/dashboard/siswa");
    }
  }, [isAuthenticated, user, isAuthChecking, router]);

  if (isAuthChecking) {
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