"use client";

import Navbar from "@/app/components/layout/Navbar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import { fetchApi } from "@/lib/api"; // 1. Tambahkan import ini

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isAuthenticated } = useAuth();
  const [role, setRole] = useState("siswa");
  const [errorMessage, setErrorMessage] = useState(""); // 2. State untuk handle error login

  useEffect(() => {
  if (isAuthenticated && user) {
    // Normalisasi role agar bisa membaca "guru" maupun "INSTRUCTOR"
    const userRole = String(user.role).toLowerCase();
    const isGuru = userRole === "guru" || userRole === "instructor";

    router.replace(isGuru ? "/dashboard/guru" : "/dashboard/siswa");
  }
}, [isAuthenticated, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Ubah fungsi onSubmit menjadi async untuk integrasi API
  const onSubmit = async (data) => {
    setErrorMessage("");
    try {
      // Kirim request login ke backend Railway
      const response = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      // Simpan JWT Token ke localStorage
      if (response?.access_token) {
        localStorage.setItem("token", response.access_token);
      }

      // Ambil data user dari respon (jika ada) atau gunakan fallback
      const userData = response?.user || {
        email: data.email,
        role: role === "guru" ? "INSTRUCTOR" : "STUDENT",
        name: data.email.split("@")[0],
      };

      // Simpan ke Auth Context lokal
      login(userData);

      // Redirect berdasarkan role dari backend/pilihan
      const isInstructor =
        userData.role === "INSTRUCTOR" || userData.role === "guru" || role === "guru";

      if (isInstructor) {
        router.push("/dashboard/guru");
      } else {
        router.push("/dashboard/siswa");
      }
    } catch (err) {
      // Tampilkan error dari backend (misal: "Unauthorized" / "Email atau password salah")
      setErrorMessage(err.message || "Gagal masuk. Periksa kembali email dan password Anda.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-base text-primary p-4 font-jakarta">
        <div className="absolute w-150 h-150 rounded-full pointer-events-none -top-37.5 left-1/2 -translate-x-1/2 z-0 bg-[radial-gradient(circle,var(--color-brand-soft)_0%,transparent_70%)]" />
        <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-2xl border border-line relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand">
              Learn<span className="text-primary font-medium">Bridge</span>
            </h2>
            <p className="text-sm text-secondary mt-2">
              Portal Evaluasi Pelajaran SMK
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Pesan Error Login dari Backend */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-av-red/10 border border-av-red/30 text-av-red text-xs font-semibold text-center">
                {errorMessage}
              </div>
            )}

            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                Masuk Sebagai
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-base border border-line rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole("siswa")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    role === "siswa"
                      ? "bg-brand text-primary font-bold shadow-md"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  Siswa
                </button>
                <button
                  type="button"
                  onClick={() => setRole("guru")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    role === "guru"
                      ? "bg-brand text-primary font-bold shadow-md"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  Guru
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="nama@gmail.com"
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format email tidak valid",
                  },
                })}
                className={`w-full rounded-xl border bg-base p-3.5 text-sm text-primary placeholder:text-muted focus:outline-none transition-all ${
                  errors.email
                    ? "border-av-red focus:border-av-red"
                    : "border-line focus:border-brand focus:ring-1 focus:ring-brand"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-av-red mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-brand hover:underline">
                  Lupa password?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password wajib diisi",
                })}
                className={`w-full rounded-xl border bg-base p-3.5 text-sm text-primary placeholder:text-muted focus:outline-none transition-all ${
                  errors.password
                    ? "border-av-red focus:border-av-red"
                    : "border-line focus:border-brand focus:ring-1 focus:ring-brand"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-av-red mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer rounded-xl bg-brand py-3.5 font-semibold text-sm text-primary hover:bg-brand-hover active:scale-[0.98] transition-all shadow-lg mt-2 disabled:opacity-50"
            >
              {isSubmitting ? "Memproses..." : `Masuk ke Kelas (${role === "guru" ? "Guru" : "Siswa"})`}
            </button>

            <p className="text-xs font-bold text-secondary text-center mt-4">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="text-brand hover:underline cursor-pointer inline-block active:scale-95 transition-all"
              >
                Daftar sekarang
              </a>
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-line text-center">
            <p className="text-xs text-muted">
              Hak Cipta © 2026 LearnBridge Team. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}