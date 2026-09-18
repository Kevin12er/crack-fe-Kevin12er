"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

export default function StatCards() {
  const [stats, setStats] = useState({
    totalMateri: 0,
    totalAttempt: 0,
    avgScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);
        const materials = await fetchApi("/materials").catch(() => []);
        let attempts = await fetchApi("/quiz-attempts").catch(() => []);
        if (!Array.isArray(attempts)) {
          attempts = await fetchApi("/results").catch(() => []);
        }

        const matList = Array.isArray(materials) ? materials : [];
        const attList = Array.isArray(attempts) ? attempts : [];

        const avg =
          attList.length > 0
            ? Math.round(
                attList.reduce((acc, curr) => acc + (curr.score || 0), 0) /
                  attList.length
              )
            : 0;

        setStats({
          totalMateri: matList.length,
          totalAttempt: attList.length,
          avgScore: avg,
        });
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 m-8 sm:grid-cols-3 font-jakarta">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-secondary">
            Materi Tersedia
          </span>
          <span className="text-base">📚</span>
        </div>
        <h3 className="mt-2 text-2xl font-black text-primary">
          {loading ? "..." : `${stats.totalMateri} Modul`}
        </h3>
        <p className="mt-1 text-[11px] text-secondary">Siap dipelajari</p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-secondary">
            Soal Dikerjakan
          </span>
          <span className="text-base">✏️</span>
        </div>
        <h3 className="mt-2 text-2xl font-black text-brand">
          {loading ? "..." : `${stats.totalAttempt} Kuis`}
        </h3>
        <p className="mt-1 text-[11px] text-secondary">Selesai dievaluasi</p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-secondary">
            Rata-rata Nilai
          </span>
          <span className="text-base">🏆</span>
        </div>
        <h3 className="mt-2 text-2xl font-black text-av-amber">
          {loading ? "..." : `${stats.avgScore} / 100`}
        </h3>
        <p className="mt-1 text-[11px] text-secondary">Akumulasi hasil ujian</p>
      </div>
    </div>
  );
}