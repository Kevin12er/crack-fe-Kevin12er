import MateriCard from "./components/MateriCards";

export default function MateriPage() {
  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-center font-jakarta text-2xl font-bold text-brand md:text-4xl">
          Materi Belajar
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <MateriCard
            icon="🔢"
            nama="Aljabar Dasar"
            kelas="Kelas X"
            materi={12}
            jam={4}
            progress={0}
            status="start"
          />

          <MateriCard
            icon="📐"
            nama="Geometri Dasar"
            kelas="Kelas X"
            materi={8}
            jam={3}
            progress={0}
            status="locked"
          />

          <MateriCard
            icon="📊"
            nama="Statistika Dasar"
            kelas="Kelas X"
            materi={10}
            jam={3.5}
            progress={0}
            status="locked"
          />

          <MateriCard
            icon="🔺"
            nama="Trigonometri"
            kelas="Kelas X"
            materi={10}
            jam={3.5}
            progress={0}
            status="locked"
          />

          <MateriCard
            icon="📈"
            nama="Program Linear"
            kelas="Kelas X"
            materi={10}
            jam={3.5}
            progress={0}
            status="locked"
          />

          <MateriCard
            icon="∫"
            nama="Integral"
            kelas="Kelas XII"
            materi={18}
            jam={7}
            progress={0}
            status="locked"
          />
        </div>
      </div>
    </div>
  );
}
