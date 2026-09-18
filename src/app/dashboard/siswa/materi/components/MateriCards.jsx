import Link from "next/link";

export default function MateriCard({
  id,
  icon,
  nama,
  kelas,
  materi,
  jam,
  progress,
  status,
}) {
  // Tentukan URL tujuan berdasarkan id materi
  const detailHref = id ? `/dashboard/siswa/materi/${id}` : "#";

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-line-card bg-surface p-5">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <span className="text-xs font-bold text-brand bg-brand/10 px-3 py-1 rounded-full">
          {kelas}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-primary font-jakarta text-[16px] font-bold">
          {nama}
        </h3>
        <p className="text-dim text-sm">
          {materi} materi · {jam} jam
        </p>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-dim text-xs">Progress</span>
          <span
            className={`text-xs font-bold ${status === "locked" ? "text-dim" : "text-brand"}`}
          >
            {status === "locked" ? "Terkunci" : `${progress}%`}
          </span>
        </div>
        <div className="w-full h-1.5 bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tombol dengan Navigasi Link */}
      {status === "progress" && (
        <Link
          href={detailHref}
          className="block text-center w-full py-3 bg-brand cursor-pointer hover:bg-brand-hover text-white font-jakarta font-bold text-sm rounded-xl transition-all active:scale-95"
        >
          Lanjut Belajar
        </Link>
      )}
      {status === "done" && (
        <Link
          href={detailHref}
          className="block text-center w-full py-3 bg-transparent border border-brand text-brand hover:bg-brand/10 font-jakarta font-bold text-sm rounded-xl transition-all"
        >
          ✓ Selesai (Baca Ulang)
        </Link>
      )}
      {status === "start" && (
        <Link
          href={detailHref}
          className="block text-center w-full py-3 cursor-pointer bg-brand hover:bg-brand-hover text-white font-jakarta font-bold text-sm rounded-xl transition-all active:scale-95"
        >
          Mulai Belajar
        </Link>
      )}
      {status === "locked" && (
        <button
          disabled
          className="w-full py-3 bg-elevated text-dim font-jakarta font-bold text-sm rounded-xl cursor-not-allowed"
        >
          🔒 Selesaikan prasyarat dulu
        </button>
      )}
    </div>
  );
}