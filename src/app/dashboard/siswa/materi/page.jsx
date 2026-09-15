import MateriCard from "./components/MateriCards";

export default function MateriPage() {
  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <section className="relative overflow-hidden rounded-3xl border border-line-card bg-linear-to-br from-surface to-elevated px-6 py-7 md:px-10 md:py-9">
          <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-brand-soft blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-44 w-44 rounded-full bg-brand-soft blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 text-center">
            <span className="mx-auto inline-flex w-fit rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-brand">
              Ruang Belajar
            </span>

            <h1 className="font-jakarta text-3xl font-extrabold leading-tight text-primary md:text-5xl">
              Materi Belajar Matematika
            </h1>

            <p className="mx-auto max-w-2xl text-sm text-secondary md:text-[15px] md:text-primary/85">
              Pelajari topik sesuai kelasmu dengan jalur materi yang
              terstruktur, ringkas, dan mudah diikuti dari dasar sampai mahir.
            </p>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <MateriCard
            icon="🔢"
            nama="Operasi Hitung Bilangan Bulat Positif dan Negatif"
            kelas="Kelas X"
            materi={6}
            jam={2.5}
            progress={20}
            status="start"
          />

          <MateriCard
            icon="➗"
            nama="Operasi Hitung dalam Bentuk Pecahan"
            kelas="Kelas X"
            materi={5}
            jam={2}
            progress={0}
            status="locked"
          />
        </div>
      </div>
    </div>
  );
}
