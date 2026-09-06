const stats = [
  {
    icon: "📚",
    value: "7",
    unit: "materi",
    label: "Materi Selesai",
    badge: "+2 minggu ini",
  },
  {
    icon: "✏️",
    value: "18",
    unit: "dikerjakan",
    label: "soal latihan",
    badge: "24 soal"
  },
  {
    icon: "🏆",
    value: "85",
    unit: "/100",
    label: "Nilai rata-rata",
    badge: "Naik 5 poin"
  }
];

function StatCard({icon, value, unit, label, badge}) {
  return (
    <div className="bg-surface rounded-xl overflow-hidden">
      <div className="flex items-center justify-between w-full p-4">
        <span className="text-lg md:text-xl">{icon}</span>
        <span className="bg-brand/20 text-brand font-bold px-3 py-0.5 rounded-xl text-xs">
          {badge}
        </span>
      </div>
      <div className="flex flex-col bg-elevated w-full p-4">
        <p className="text-xl md:text-2xl font-bold">
          {value}<span className="text-sm text-dim"> {unit}</span>
        </p>
        <span className="font-bold text-dim text-sm">{label}</span>
      </div>
    </div>
  )
}

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 md:px-8">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  )
}