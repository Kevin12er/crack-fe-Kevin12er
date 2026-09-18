"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

export default function ProgressCard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);
        const data = await fetchApi("/courses");
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn("Gagal fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  return (
    <div className="rounded-3xl border border-line bg-surface m-8 p-6 space-y-4 font-jakarta">
      <h3 className="text-md font-bold text-primary">
        Mata Pelajaran & Modul Aktif
      </h3>

      <div className="space-y-3">
        {loading ? (
          <div className="py-4 text-center text-xs text-secondary font-medium">
            Memuat data mata pelajaran...
          </div>
        ) : courses.length > 0 ? (
          courses.map((c, idx) => {
            // Bergantian antara rute Materi dan Latihan Soal agar bervariasi
            const isMateriRoute = idx % 2 === 0;
            const targetHref = isMateriRoute
              ? "/dashboard/siswa/materi"
              : "/dashboard/siswa/latihan-soal";
            const buttonLabel = isMateriRoute ? "Baca Materi" : "Ikuti Kuis";

            return (
              <div
                key={c.id || idx}
                className="flex items-center justify-between rounded-2xl border border-line bg-base p-4"
              >
                <div>
                  <h4 className="text-xs font-bold text-primary">{c.title}</h4>
                  <p className="text-[11px] text-secondary mt-0.5 line-clamp-1">
                    {c.description || "Modul Pembelajaran Aktif"}
                  </p>
                </div>

                <Link
                  href={targetHref}
                  className="rounded-lg border border-brand/30 bg-brand/10 px-3 py-1.5 text-[11px] font-bold text-brand hover:bg-brand/20 transition-all cursor-pointer"
                >
                  {buttonLabel}
                </Link>
              </div>
            );
          })
        ) : (
          <div className="py-4 text-center text-xs text-secondary">
            Belum ada mata pelajaran yang terdaftar.
          </div>
        )}
      </div>
    </div>
  );
}