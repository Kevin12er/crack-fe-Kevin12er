"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";

export default function DashboardGuruLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "INSTRUCTOR") {
      router.replace("/dashboard/siswa");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "INSTRUCTOR") {
    return null;
  }

  return (
    <div className="min-h-screen bg-base text-primary font-jakarta">
      <main>{children}</main>
    </div>
  );
}
