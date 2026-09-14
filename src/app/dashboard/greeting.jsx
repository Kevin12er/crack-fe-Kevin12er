"use client";

import { useAuth } from "@/app/context/authcontext";

export default function Greetings() {
  const { user } = useAuth();
  const nama = user?.name || "Siswa";

  return (
    <div className="mt-12 px-4 font-jakarta md:mt-4 md:px-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface/70 p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-sm font-bold text-primary md:text-xl">
            Selamat datang, {nama} 👋
          </h1>
          <span className="text-sm font-bold text-dim md:text-base">
            Semangat belajar hari ini - kamu sudah 14 hari berturut-turut!
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-3xl border border-brand-hover bg-brand/20 px-4 py-2 text-center text-sm font-bold text-brand">
            14 hari streak
          </span>
          <span className="rounded-xl border border-dim/50 bg-base p-2 text-sm md:text-xl">
            🔔
          </span>
        </div>
      </div>
    </div>
  );
}
