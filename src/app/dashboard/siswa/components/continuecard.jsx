export default function ContinueCard() {
  return (
    <section className="m-4 rounded-2xl border border-line-card bg-linear-to-br from-surface to-elevated p-5 font-jakarta md:m-8 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 space-y-3">
          <span className="inline-flex rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
            🔢 Lanjutkan Belajar
          </span>

          <div className="space-y-1">
            <h3 className="text-lg font-extrabold leading-tight text-primary md:text-xl">
              Bab 1: Operasi Hitung Bilangan Bulat Positif dan Negatif
            </h3>
            <p className="text-xs text-secondary md:text-sm">
              Kelas X • 6 materi • Terakhir dibuka 2 jam lalu
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-secondary">
              Progress
            </span>
            <span className="text-[16px] font-extrabold text-brand">68%</span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-elevated">
            <div className="h-full w-[70%] rounded-full bg-brand" />
          </div>
        </div>

        <button className="w-full rounded-xl bg-brand px-6 py-3 text-sm font-extrabold text-primary transition-all hover:bg-brand-hover active:scale-95 md:w-auto">
          Lanjut Belajar
        </button>
      </div>
    </section>
  );
}
