"use client";

import { useAuth } from "@/app/context/authcontext";

export default function Greetings() {
  const { user } = useAuth();
  const nama = user?.name || user?.username || "Siswa";

  return (
    <div className="font-jakarta m-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-primary md:text-xl">
            Selamat datang, <span className="text-brand">{nama}</span> 👋
          </h1>
          <span className="text-xs text-secondary md:text-sm">
            Semangat belajar hari ini! Pantau terus progres materi dan kuis kamu.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-xl border border-brand-ring bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand">
            Siswa Aktif
          </span>
          <span className="rounded-xl border border-line bg-base p-2 text-sm md:text-base">
            🔔
          </span>
        </div>
      </div>
    </div>
  );
}