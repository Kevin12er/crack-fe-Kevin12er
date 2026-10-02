"use client";

import Navbar from "@/app/components/layout/Navbar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import { API_BASE_URL, fetchApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isAuthenticated, isHydrated } = useAuth();
  const [tabRole, setTabRole] = useState("siswa");
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect jika user sudah terautentikasi di session
  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      const userRole = String(user.role || "").toUpperCase();
      const isGuru = userRole === "INSTRUCTOR";

      router.replace(isGuru ? "/dashboard/guru" : "/dashboard/siswa");
    }
  }, [isAuthenticated, isHydrated, user, router]);

  // Pulihkan session setelah Google OAuth selesai.
  // JWT Google disimpan di HttpOnly cookie, jadi frontend mengambil
  // user melalui endpoint profile lalu memasukkannya ke AuthContext.
  useEffect(() => {
    if (!isHydrated || isAuthenticated) return;

    const restoreGoogleSession = async () => {
      try {
        const response = await fetchApi("/auth/profile");
        const userData = response?.user;

        if (userData) {
          login(userData);
        }
      } catch {
        // Belum login: biarkan halaman login tampil normal.
      }
    };

    restoreGoogleSession();
  }, [isHydrated, isAuthenticated, login]);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

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

  const onSubmit = async (data) => {
    setErrorMessage("");

    try {
      const response = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const token = response?.access_token || response?.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      // Ambil objek user dari respon backend
      let userData = response?.user;

      // Jika backend tidak mengembalikan objek user lengkap saat login,
      // panggil GET /auth/profile untuk mengambil profil asli dari DB
      if (!userData || !userData.role) {
        userData = await fetchApi("/auth/profile");
      }

      // Simpan user ke AuthContext
      const loggedInUser = login(userData);

      // Ambil role murni dari database
      const dbRole = String(loggedInUser?.role || "").toUpperCase();
      const isInstructor = dbRole === "INSTRUCTOR";

      // Validasi Kesesuaian Tab Pilihan UI dengan Role Asli Database
      if (tabRole === "guru" && !isInstructor) {
        throw new Error(
          "Akun Anda terdaftar sebagai Siswa. Silakan pilih tab Siswa."
        );
      }

      if (tabRole === "siswa" && isInstructor) {
        // Jika instructor login di tab siswa, tetap arahkan ke dashboard guru
        router.push("/dashboard/guru");
        return;
      }

      // Redirect Sesuai Role
      if (isInstructor) {
        router.push("/dashboard/guru");
      } else {
        router.push("/dashboard/siswa");
      }
    } catch (err) {
      setErrorMessage(
        err.message || "Gagal masuk. Periksa kembali email dan password Anda."
      );
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
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-av-red/10 border border-av-red/30 text-av-red text-xs font-semibold text-center">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                Masuk Sebagai
              </label>

              <div className="grid grid-cols-2 gap-2 p-1 bg-base border border-line rounded-xl">
                <button
                  type="button"
                  onClick={() => setTabRole("siswa")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    tabRole === "siswa"
                      ? "bg-brand text-primary font-bold shadow-md"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  Siswa
                </button>

                <button
                  type="button"
                  onClick={() => setTabRole("guru")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    tabRole === "guru"
                      ? "bg-brand text-primary font-bold shadow-md"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  Guru
                </button>
              </div>
            </div>

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
              {isSubmitting
                ? "Memproses..."
                : `Masuk ke Kelas (${tabRole === "guru" ? "Guru" : "Siswa"})`}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full cursor-pointer rounded-xl border border-line bg-base py-3.5 font-semibold text-sm text-primary hover:bg-surface transition-all flex items-center justify-center gap-3"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.4z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.96c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.75 9.75 0 0 0 12 21.96z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.54 14.05a5.86 5.86 0 0 1 0-3.75V7.78H3.3a9.77 9.77 0 0 0 0 8.79l3.24-2.52z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6.27c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 3.39 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.28l3.24 2.52C7.31 7.99 9.46 6.27 12 6.27a9.75 9.75 0 0 0-8.7 5.28l3.24 2.52C7.31 7.99 9.46 6.27 12 6.27z"
                />
              </svg>

              Masuk dengan Google
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