"use client";

import { useAuth } from "@/app/context/authcontext";

export default function Greetings() {
  const { user } = useAuth();
  const nama = user?.name || "Siswa";

  return (
    <div className="flex justify-between items-center p-8 m-2 font-jakarta mt-12 md:mt-4 relative">
      <div className="flex flex-col gap-2">
        <h1 className="text-primary font-bold text-sm md:text-xl">
          Selamat datang, {nama} 👋
        </h1>
        <span className="text-dim font-bold">
          Semangat belajar hari ini - kamu sudah 14 hari berturut-turut!
        </span>
      </div>

      <div className="flex items-center gap-4 absolute right-2 top-5 md:right-8 md:top-15">
        <span className="border border-brand-hover bg-brand/20 backdrop-blur-md px-4 py-2 rounded-3xl text-center font-bold w-40 text-brand">
          14 hari streak
        </span>
        <span className="text-sm md:text-xl border border-dim/50 bg-surface p-2 rounded-xl">
          🔔
        </span>
      </div>
    </div>
  );
}
