"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/dashboard/sidebar";
import { useAuth } from "@/app/context/authcontext";

export default function SiswaLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "siswa") {
      router.replace("/dashboard/guru");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "siswa") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-base text-primary">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-16 md:pt-0">{children}</main>
    </div>
  );
}
