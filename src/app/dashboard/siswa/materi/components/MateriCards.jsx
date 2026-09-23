// src/app/dashboard/siswa/materi/components/MateriCards.jsx
import Link from "next/link";

export default function MateriCard({
  id,
  icon = "📚",
  nama,
  kelas,
  materi,
  jam = 1,
}) {
  // Tentukan URL tujuan berdasarkan id materi
  const detailHref = id ? `/dashboard/siswa/materi/${id}` : "#";

  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-line-card bg-surface p-5 transition-all hover:border-brand/40">
      <div className="flex flex-col gap-4">
        {/* Top Header Card */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-2xl">
            {icon}
          </div>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand line-clamp-1">
            {kelas}
          </span>
        </div>

        {/* Info Detail */}
        <div className="flex flex-col gap-1">
          <h3 className="font-jakarta text-[16px] font-bold text-primary line-clamp-2">
            {nama}
          </h3>
          <p className="text-sm text-dim">
            {materi > 0 ? `Modul #${materi}` : "Modul Pembelajaran"} · est. {jam} Jam
          </p>
        </div>
      </div>

      {/* Single Direct Action Button */}
      <div className="mt-2">
        <Link
          href={detailHref}
          className="block w-full cursor-pointer rounded-xl bg-brand py-3 text-center font-jakarta text-sm font-bold text-white transition-all hover:bg-brand-hover active:scale-95"
        >
          Mulai Belajar
        </Link>
      </div>
    </div>
  );
}