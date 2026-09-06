export default function DashboardGuruLayout({ children }) {
  return (
    <div className="min-h-screen bg-base text-primary font-jakarta">
      {/* Jika ada sidebar atau layout khusus guru, letakkan di sini */}
      <main>{children}</main>
    </div>
  );
}