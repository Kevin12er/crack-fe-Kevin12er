const topics = [
  "Bilangan Real", "Persamaan Linear", "Pertidaksamaan",
  "Fungsi", "Statistika Dasar", "Peluang",
  "Matriks", "Transformasi Geometri", "Barisan dan Deret",
  "Program Linear", "Trigonometri", "Vektor",
  "Limit Fungsi", "Turunan", "Integral",
  "Statistika Lanjut", "Kombinatorik",
]

const doubled = [...topics, ...topics]

export default function Marquee() {
  return (
    <div className="overflow-hidden relative border-y border-line py-4 mt-8">
      <div className="flex gap-8 animate-marquee w-max">
        {doubled.map((topic, i) => (
          <div key={i} className="flex items-center gap-3 whitespace-nowrap">
            <div className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-muted text-sm font-medium">{topic}</span>
          </div>
        ))}
      </div>
    </div>
  )
}