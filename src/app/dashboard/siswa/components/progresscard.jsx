export default function ProgressCard() {

	return (

		<div className="m-4 md:m-8 p-4 rounded-xl bg-surface font-jakarta">

			{/*Aljabar dasar start*/}
			<div className="flex justify-between items-center"> 
				<h5 className="font-bold">Progress</h5>
				<span className="text-sm text-brand">Lihat semua</span>
			</div>

			<div className="flex justify-between mt-4">
				<div className="flex gap-4 text-brand font-bold">
					<span>🔢</span>
					<span>Aljabar Dasar</span>
				</div>
					
					<p className="text-brand font-bold">68%</p>
			</div>
			
				<div className="rounded-2xl bg-elevated w-full h-2 mt-2">
					<div className="w-[70%] bg-brand rounded-2xl h-2"></div>
				</div>
			{/*Aljabar dasar end*/}


			{/*Geometri Dasar start*/}
			<div className="flex justify-between mt-4">
				<div className="flex gap-4 text-brand font-bold">
					<span>📐</span>
					<span>Geometri Dasar</span>
				</div>
					
					<p className="text-brand font-bold">100%</p>
			</div>
			<div className="rounded-2xl bg-brand w-full h-2 mt-2">
				<div className="w-[70%] bg-brand rounded-2xl h-2"></div>
			</div>
			{/*Geometri dasar end*/}

			{/*Statistika dasar start*/}
			<div className="flex justify-between mt-4">
				<div className="flex gap-4 text-brand font-bold">
					<span>📊</span>
					<span>Statistika dasar</span>
				</div>
					
					<p className="text-av-blue font-bold">40%</p>
			</div>
			<div className="rounded-2xl bg-elevated w-full h-2 mt-2">
				<div className="w-[40%] bg-av-blue rounded-2xl h-2"></div>
			</div>
			{/*statistika dasar end*/}

			{/*Trigonometri start*/}
			<div className="flex justify-between mt-4">
				<div className="flex gap-4 text-brand font-bold">
					<span>🔺</span>
					<span>Trigonometri</span>
				</div>
					
					<p className="text-av-amber font-bold">15%</p>
			</div>
			<div className="rounded-2xl bg-elevated w-full h-2 mt-2">
				<div className="w-[10%] bg-av-amber rounded-2xl h-2"></div>
			</div>
			{/*Trigonometri end*/}

			{/*Program Linear start*/}
			<div className="flex justify-between mt-4">
				<div className="flex gap-4 text-brand font-bold">
					<span>📈</span>
					<span>Program Linear</span>
				</div>
					
					<p className="text-av-amber font-bold">5%</p>
			</div>
			<div className="rounded-2xl bg-elevated w-full h-2 mt-2">
				<div className="w-[3%] bg-av-amber rounded-2xl h-2"></div>
			</div>


		</div>
	



		)
}