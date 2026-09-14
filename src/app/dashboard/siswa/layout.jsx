import Sidebar from "@/app/dashboard/sidebar";

export default function SiswaLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-base text-primary">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-16 md:pt-0">{children}</main>
    </div>
  );
}
