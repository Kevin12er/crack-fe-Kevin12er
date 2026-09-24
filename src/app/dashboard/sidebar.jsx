"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";

const navItems = [
  {
    href: "/dashboard/siswa",
    label: "Beranda",
    icon: "🏠",
  },
  {
    href: "/dashboard/siswa/materi",
    label: "Materi",
    icon: "📚",
  },
  {
    href: "/dashboard/siswa/latihan-soal",
    label: "Latihan Soal",
    icon: "✏️",
  },
  {
    href: "/dashboard/siswa/kuis",
    label: "Kuis",
    icon: "⏰",
  },
  {
    href: "/dashboard/siswa/nilai",
    label: "Nilai Saya",
    icon: "📊",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Tutup sidebar" : "Buka sidebar"}
      >
        <div className="flex flex-col gap-1.5">
          <span
            className={`block h-0.5 w-5 bg-white transition-all duration-300 ${isOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transition-all duration-300 ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-40 flex min-h-screen w-70 flex-col border-r border-line
          bg-surface/95 p-6 font-jakarta font-bold shadow-xl shadow-brand/15 backdrop-blur
          transition-transform duration-300 md:static md:translate-x-0 md:rounded-none md:p-8
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-brand">
            Learn<span className="text-primary">Bridge</span>
          </h1>
          <p className="w-fit rounded-full border border-brand-ring bg-brand-soft px-3 py-1 text-[10px] uppercase tracking-wider text-brand">
            Dashboard Siswa
          </p>
        </div>

        <nav className="py-8">
          <h2 className="mb-3 text-xs uppercase tracking-widest text-dim">
            Menu Utama
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard/siswa" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 ${
                      isActive
                        ? "border-brand-ring bg-brand-soft text-brand"
                        : "border-transparent hover:border-brand-ring hover:bg-brand-soft hover:text-brand"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <div className="rounded-xl border border-line-strong bg-linear-to-br from-base to-elevated p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-av-blue text-xs font-bold text-white">
                {user?.name?.slice(0, 2).toUpperCase() || "ST"}
              </div>
              <div>
                <div className="text-sm font-bold text-primary">
                  {user?.name || "Pengguna"}
                </div>
                <div className="text-xs text-secondary">
                  {user?.role === "INSTRUCTOR" || user?.role === "guru" ? "Guru" : "Siswa"}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/pengaturan"
            onClick={() => setIsOpen(false)}
            className="rounded-xl border border-line bg-ghost/40 py-2 text-center text-sm transition-colors duration-200 hover:border-brand-ring hover:text-brand"
          >
            ⚙️ Pengaturan
          </Link>

          <button
            onClick={handleLogout}
            className="w-full cursor-pointer rounded-xl border border-red-500/20 bg-red-500/10 py-2 font-bold text-red-400 transition-all hover:bg-red-500 hover:text-white active:scale-95"
          >
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
