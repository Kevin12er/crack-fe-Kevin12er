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
    <div>
      <Greetings />
      <StatCards />
      <ContinueCard />
      <ProgressCard />
    </div>
  );
}
