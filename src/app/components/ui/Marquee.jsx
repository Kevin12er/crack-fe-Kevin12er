const topics = [
  "Bilangan Positif dan Negatif",
  "Penjumlahan Bilangan Bulat",
  "Pengurangan Bilangan Bulat",
  "Perkalian Bilangan Bulat",
  "Pembagian Bilangan Bulat",
  "Operasi Campuran Bilangan Bulat",
  "Pecahan Senilai",
  "Menyederhanakan Pecahan",
  "Penjumlahan Pecahan",
  "Pengurangan Pecahan",
  "Perkalian Pecahan",
  "Pembagian Pecahan",
  "Soal Cerita Pecahan",
];

const doubled = [...topics, ...topics];

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
  );
}
