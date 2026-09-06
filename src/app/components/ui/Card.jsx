const features = [
		{
			icon: "🧭",
			title: "Belajar Tersturktur",
			description: "Materi didesain secara tersturktur mulai dari fundamental"
		},

		{
			icon: "📊",
			title: "Pantau Perkembangan",
			description: "Guru dapat memantau perkembangan muridnya secara real time"
		},

		{
			icon: "🏆",
			title: "Latihan Soal Interaktif",
			description: "Latihan setiap bab langsung dengan feedback instan"
		},

		{
			icon: "🎯",
			title: "Sesuai Kurikulum SMK",
			description: "Materi mengikuti kurikulum Merdeka Belajar"
		},

		{
			icon: "⚡",
			title: "Belajar dengan fleksibilitas",
			description: "Akses materi dari HP atau laptop, kapan saja"
		},

		{
			icon: "👩‍🏫",
			title: "Guru dan Siswa",
			description: "Satu platform untuk mengajar dan belajar sekaligus"
		},
	];


	function FeatureCard({ icon, title, description }) {
  		return (
    		<div className="bg-surface border border-line-card rounded-2xl p-6 flex flex-col gap-4 transition translate hover:border-brand-hover">
      			<div className="w-12 h-12 rounded-xl bg-[var(--color-brand-soft)] flex items-center justify-center text-2xl">
        			{icon}
      			</div>
      		<div className="flex flex-col gap-2">
        		<h3 className="text-primary font-jakarta font-bold text-base">{title}</h3>
        		<p className="text-muted font-jakarta text-sm leading-relaxed">{description}</p>
      		</div>
    		</div>
  			)
		}


	export default function Card() {
  		return (
    		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    			{features.map((feature, i) => (
    				<FeatureCard 
    					key={i}
    					icon={feature.icon}
    					title={feature.title}
    					description={feature.description}
    					/>
    				))}
    		</div>
  		)
	}