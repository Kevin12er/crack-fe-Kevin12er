export default function ContinueCard() {
	return (
		<div className="bg-surface p-4 rounded-xl m-4 md:m-8 space-y-4 text-sm md:text-xl font-jakarta">
			
			<div className="p-2 bg-brand/30 border border-brand-ring w-10 text-center rounded-xl">
				<span className="">🔢</span>
			</div>

			<div>
				<span className="tracking-tight uppercase text-brand font-semibold">Lanjutkan Belajar</span>

				<div className="">
					<h4 className="font-bold text-primary">Aljabar Dasar — Bab 3: Persamaan Linear</h4>
					<p className="text-dim font-bold">Kelas X - 12 materi - Terakhir dibuka 2 jam lalu</p>
				</div>

				<div className="space-x-2">
					<span className="text-dim font-bold">Progress</span>
					<span className="text-primary font-semibold">68%</span>
				</div>
			</div>

			<div className="w-full h-1.5 bg-elevated rounded-full">
  				<div className="h-full w-[70%] bg-brand rounded-full" />
			</div>
			<button className="bg-brand px-4 py-1 font-bold border border-brand-ring rounded-xl hover:bg-brand-hover text-sm text-center transition-colors duration-300 cursor-pointer active:scale-105">Lanjut</button>
		</div>
		)
}