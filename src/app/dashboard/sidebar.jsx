"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/context/authcontext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="md:hidden fixed top-3 left-3 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Tutup sidebar" : "Buka sidebar"}
      >
        <div className="flex flex-col gap-1.5">
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed md:static top-0 left-0 z-40
        flex w-70 min-h-screen flex-col border-r border-line bg-surface p-6 font-jakarta font-bold shadow-lg shadow-brand md:p-8 md:rounded-none rounded-r-2xl
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <h1 className="text-2xl font-bold font-jakarta text-brand">
          Learn<span className="text-primary">Bridge</span>
        </h1>

        <nav className="py-10">
          <h2 className="text-dim text-xs uppercase tracking-widest mb-3">
            Menu Utama
          </h2>
          <ul className="flex flex-col gap-3">
            <Link
              href="/dashboard/siswa"
              onClick={() => setIsOpen(false)}
              className="transition-colors duration-300 hover:text-brand"
            >
              🏠 Beranda
            </Link>
            <Link
              href="/dashboard/siswa/materi"
              onClick={() => setIsOpen(false)}
              className="transition-colors duration-300 hover:text-brand"
            >
              📚 Materi
            </Link>
            <Link
              href="/dashboard/siswa/latihan-soal"
              onClick={() => setIsOpen(false)}
              className="transition-colors duration-300 hover:text-brand"
            >
              ✏️ Latihan Soal
            </Link>
            <Link
              href="/nilai"
              onClick={() => setIsOpen(false)}
              className="transition-colors duration-300 hover:text-brand"
            >
              📊 Nilai Saya
            </Link>
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center gap-2 p-3 bg-base rounded-xl border border-line">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-av-blue text-xs font-bold">
              {user?.name?.slice(0, 2).toUpperCase() || "ST"}
            </div>
            <div>
              <div className="text-sm font-bold text-primary">
                {user?.name || "Siswa"}
              </div>
              <div className="text-xs text-dim">
                {user?.role === "guru" ? "Guru" : "XII IPA"}
              </div>
            </div>
          </div>

          <Link
            href="/pengaturan"
            onClick={() => setIsOpen(false)}
            className="transition-colors duration-300 bg-ghost/50 hover:bg-ghost rounded-xl py-2 text-center hover:text-brand"
          >
            ⚙️ Pengaturan
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-500/10 text-red-400 font-bold cursor-pointer border border-red-500/20 rounded-xl transition-all hover:bg-red-500 hover:text-white active:scale-95"
          >
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
