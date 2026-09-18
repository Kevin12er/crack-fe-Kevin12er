"use client";

import Link from "next/link";

export default function ContinueCard() {
  return (
    <div className="rounded-3xl m-8 border border-line bg-surface p-6 space-y-4 font-jakarta">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase text-brand">
          Lanjutkan Aktivitas
        </span>
      </div>

      <div>
        <h2 className="text-lg font-bold text-primary">
          Siap untuk Evaluasi dan Latihan Soal Hari Ini?
        </h2>
        <p className="mt-1 text-xs text-secondary">
          Uji pemahaman kamu tentang materi SMK terbaru dengan mengerjakan kuis interaktif yang disediakan pengajar.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/dashboard/siswa/latihan-soal"
          className="rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-primary hover:bg-brand-hover transition-all cursor-pointer"
        >
          Mulai Latihan Soal &rarr;
        </Link>
        <Link
          href="/dashboard/siswa/materi"
          className="rounded-xl border border-line bg-base px-5 py-2.5 text-xs font-bold text-secondary hover:text-primary hover:bg-surface transition-all cursor-pointer"
        >
          Lihat Semua Materi
        </Link>
      </div>
    </div>
  );
}