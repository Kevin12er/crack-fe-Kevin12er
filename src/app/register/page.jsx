"use client";

import Navbar from "@/app/components/layout/Navbar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("siswa");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Memantau nilai password untuk validasi konfirmasi password
  const password = watch("password");

  const onSubmit = (data) => {
    console.log("Data Register:", { ...data, role });
    if (role === "guru") {
      router.push("/dashboard/guru");
    } else {
      router.push("/dashboard/siswa");
    }
  };

  return (
    <>
      <Navbar />
      <section className="flex min-h-screen items-center justify-center bg-base p-4 text-primary font-jakarta">
        <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none top-[-150px] left-1/2 -translate-x-1/2 z-0 bg-[radial-gradient(circle,var(--color-brand-soft)_0%,transparent_70%)]" />
        <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-2xl border border-line relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-brand text-lg md:text-xl font-bold">
              Learn<span className="font-bold text-primary">Bridge</span>
            </h1>
            <h2 className="text-sm font-bold text-brand">Daftar Akun</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">  
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                Daftar Sebagai
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-base border border-line rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole("siswa")}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    role === "siswa"
                      ? "bg-brand text-base font-bold shadow-md"
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
                      ? "bg-brand text-base font-bold shadow-md"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  Guru
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="daftar-email"
                className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="nama@gmail.com"
                id="daftar-email"
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
                <p className="text-xs text-av-red mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password-input"
                className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="masukkan password kamu"
                id="password-input"
                {...register("password", {
                  required: "Password wajib diisi",
                  minLength: {
                    value: 6,
                    message: "Password minimal 6 karakter",
                  },
                })}
                className={`w-full rounded-xl border bg-base p-3.5 text-sm text-primary placeholder:text-muted focus:outline-none transition-all ${
                  errors.password
                    ? "border-av-red focus:border-av-red"
                    : "border-line focus:border-brand focus:ring-1 focus:ring-brand"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-av-red mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="password-repeat"
                className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2"
              >
                Konfirmasi Password
              </label>
              <input
                type="password"
                placeholder="ketik ulang password kamu"
                id="password-repeat"
                {...register("confirmPassword", {
                  required: "Konfirmasi password wajib diisi",
                  validate: (value) =>
                    value === password || "Password tidak cocok",
                })}
                className={`w-full rounded-xl border bg-base p-3.5 text-sm text-primary placeholder:text-muted focus:outline-none transition-all ${
                  errors.confirmPassword
                    ? "border-av-red focus:border-av-red"
                    : "border-line focus:border-brand focus:ring-1 focus:ring-brand"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-av-red mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer rounded-xl bg-brand py-3.5 font-semibold text-sm text-base hover:bg-brand-hover active:scale-[0.98] transition-all shadow-lg mt-4 disabled:opacity-50"
            >
              Daftar Sebagai {role === "guru" ? "Guru" : "Siswa"}
            </button>
          </form>

          <div className="text-center mt-6 text-xs text-secondary">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-brand hover:underline font-semibold"
            >
              Masuk di sini
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-line text-center">
            <p className="text-xs text-muted">
              Hak Cipta © 2026 LearnBridge Team. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}