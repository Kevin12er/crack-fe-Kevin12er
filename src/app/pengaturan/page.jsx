"use client";

import Navbar from "@/app/components/layout/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";

export default function PengaturanPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const [nama, setNama] = useState("");
  const [notifikasiBelajar, setNotifikasiBelajar] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.name) {
      setNama(user.name);
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return null;
  }

  const dashboardHref =
    user?.role === "guru" ? "/dashboard/guru" : "/dashboard/siswa";

  const handleSaveProfile = (event) => {
    event.preventDefault();
    updateProfile({ name: nama });
    alert("Profil berhasil diperbarui.");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-base p-4 text-primary md:p-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-3 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold md:text-3xl">
                Pengaturan <span className="text-brand">Akun</span>
              </h1>
              <p className="mt-1 text-sm text-secondary">
                Kelola profil dan preferensi penggunaan LearnBridge.
              </p>
            </div>

            <Link
              href={dashboardHref}
              className="w-fit rounded-xl border border-brand-ring bg-brand-soft px-4 py-2 text-xs font-bold text-brand transition-colors hover:bg-brand/20"
            >
              Kembali ke Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <form
              onSubmit={handleSaveProfile}
              className="space-y-4 rounded-2xl border border-line bg-surface p-5 lg:col-span-7"
            >
              <h2 className="text-lg font-bold text-primary">Profil</h2>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-secondary">
                  Nama Lengkap
                </label>
                <input
                  value={nama}
                  onChange={(event) => setNama(event.target.value)}
                  type="text"
                  className="w-full rounded-xl border border-line bg-base p-3 text-sm text-primary placeholder:text-muted focus:border-brand focus:outline-none"
                  placeholder="Masukkan nama kamu"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-secondary">
                  Email
                </label>
                <input
                  value={user?.email || "-"}
                  type="email"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-line bg-base p-3 text-sm text-secondary"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-secondary">
                  Role
                </label>
                <input
                  value={user?.role === "guru" ? "Guru" : "Siswa"}
                  type="text"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-line bg-base p-3 text-sm text-secondary"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-brand-hover"
              >
                Simpan Perubahan
              </button>
            </form>

            <div className="space-y-4 lg:col-span-5">
              <div className="space-y-4 rounded-2xl border border-line bg-surface p-5">
                <h2 className="text-lg font-bold text-primary">Preferensi</h2>

                <label className="flex items-center justify-between gap-3 rounded-xl border border-line bg-base p-3">
                  <span className="text-sm text-primary">
                    Notifikasi pengingat belajar
                  </span>
                  <input
                    type="checkbox"
                    checked={notifikasiBelajar}
                    onChange={(event) =>
                      setNotifikasiBelajar(event.target.checked)
                    }
                    className="h-4 w-4 accent-brand"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 rounded-xl border border-line bg-base p-3">
                  <span className="text-sm text-primary">
                    Mode dashboard ringkas
                  </span>
                  <input
                    type="checkbox"
                    checked={compactMode}
                    onChange={(event) => setCompactMode(event.target.checked)}
                    className="h-4 w-4 accent-brand"
                  />
                </label>

                <p className="text-xs text-dim">
                  Preferensi ini masih disimpan lokal. Nanti bisa disambungkan
                  ke backend saat API siap.
                </p>
              </div>

              <div className="space-y-3 rounded-2xl border border-line bg-surface p-5">
                <h2 className="text-lg font-bold text-primary">Keamanan</h2>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Fitur ganti password akan dihubungkan ke endpoint backend.",
                    )
                  }
                  className="w-full rounded-xl border border-line-strong bg-base px-4 py-2.5 text-left text-sm font-semibold text-secondary transition-colors hover:text-primary"
                >
                  Ganti Password
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-left text-sm font-semibold text-red-400 transition-colors hover:bg-red-500 hover:text-white"
                >
                  Keluar dari Akun
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
