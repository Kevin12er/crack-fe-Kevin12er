import MateriCard from './components/MateriCards'


export default function MateriPage() {
  return (
    <div>
      
      <h1 className="text-2xl mt-4 md:mt-8 md:text-4xl font-jakarta font-bold text-brand text-center">Materi Belajar</h1>


      <div className="grid grid-cols-1 md:grid-cols-2  p-4">

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
  )
}