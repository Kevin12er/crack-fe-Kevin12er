"use client";

import Greetings from "@/app/dashboard/greeting";
import StatCards from "@/app/dashboard/siswa/components/statcards";
import ContinueCard from "@/app/dashboard/siswa/components/continuecard";
import ProgressCard from "@/app/dashboard/siswa/components/progresscard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";

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
    }
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