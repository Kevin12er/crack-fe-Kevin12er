import Sidebar from '@/app/dashboard/sidebar';

export default function SiswaLayout({ children }) {

	return (

			<div className="flex min-h-screen bg-base">

				<Sidebar />
				<main className="flex-1">{children}</main>

			</div>

		)

}