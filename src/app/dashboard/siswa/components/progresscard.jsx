export default function ProgressCard() {
  const progressItems = [
    {
      id: "bab-1",
      icon: "🔢",
      title: "Operasi Bilangan Bulat",
      progress: 68,
      accent: "bg-brand",
      labelStyle: "text-brand",
      badge: "Sedang Berjalan",
      badgeStyle: "border border-brand-ring bg-brand-soft text-brand",
    },
    {
      id: "bab-2",
      icon: "➗",
      title: "Operasi Pecahan",
      progress: 0,
      accent: "bg-av-blue",
      labelStyle: "text-secondary",
      badge: "Belum Dimulai",
      badgeStyle: "border border-line bg-base text-secondary",
    },
  ];

  const rataRata = Math.round(
    progressItems.reduce((total, item) => total + item.progress, 0) /
      progressItems.length,
  );

  return (
    <section className="m-4 rounded-2xl border border-line-card bg-surface p-4 font-jakarta md:m-8 md:p-6">
      <div className="flex flex-col gap-2 border-b border-line pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h5 className="text-lg font-extrabold text-primary md:text-xl">
            Progress Belajarmu
          </h5>
          <p className="text-xs text-secondary md:text-sm">
            Pantau progres pada 2 topik Matematika yang sedang aktif.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-ring bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
          <span>Rata-rata</span>
          <span>{rataRata}%</span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {progressItems.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-line bg-base/60 p-4"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-elevated text-lg">
                  {item.icon}
                </span>
                <div>
                  <p className={`text-sm font-bold ${item.labelStyle}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-dim">
                    Target: kuasai konsep dasar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.badgeStyle}`}
                >
                  {item.badge}
                </span>
                <span className="text-sm font-extrabold text-primary">
                  {item.progress}%
                </span>
              </div>
            </div>

            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-elevated">
              <div
                className={`h-full rounded-full ${item.accent}`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
