"use client";
import Link from "next/link";
import Marquee from "./components/ui/Marquee";
import Card from "./components/ui/Card";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";

export default function HeroPage() {
  return (
    <main className="bg-base overflow-x-clip">
      <Navbar />
      <section className="relative bg-base px-4 py-12 text-white md:px-8 lg:px-12">
        {/* Green middle gradient */}
        <div className="pointer-events-none absolute left-1/2 -top-45 z-0 h-105 w-105 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_70%)] md:h-150 md:w-150" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-center gap-8 py-10 md:min-h-[70vh]">
          <span className="inline-flex w-fit rounded-2xl border border-brand bg-brand/20 px-6 py-2 text-center font-jakarta text-sm font-bold text-brand backdrop-blur-md md:text-[16px]">
            Platform belajar generasi baru
          </span>

          <div className="flex flex-col gap-3">
            <span className="inline-block font-jakarta text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Kuasai Matematika.
            </span>
            <span className="inline-block font-jakarta text-3xl font-bold leading-tight text-brand sm:text-4xl md:text-5xl">
              Bertahap dan menyenangkan.
            </span>
            <span className="inline-block font-jakarta text-3xl font-bold italic leading-tight text-ghost sm:text-4xl md:text-5xl">
              Selesaikan tantangannya
            </span>
            <p className="mt-2 max-w-2xl font-jakarta text-sm text-muted sm:text-[16px] md:text-lg">
              Platform belajar Matematika yang didesign untuk mempermudah guru
              dalam mentracking perkembangan muridnya, ambil kendali atas
              progress siswa secara real time.
            </p>
            <Link
              className="mt-5 w-full rounded-2xl bg-brand px-6 py-3 text-center font-jakarta font-bold text-primary transition active:scale-95 hover:bg-brand-hover sm:w-fit"
              href="/login"
            >
              Mulai gratis
            </Link>
          </div>
        </div>
      </section>

      {/*Marquee*/}
      <Marquee />
      {/*Marquee*/}
      <section className="px-4 py-16 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <p className="mb-2 font-jakarta text-sm font-bold uppercase tracking-widest text-brand">
            Kenapa LearnBridge
          </p>
          <h2 className="mb-8 font-jakarta text-2xl font-bold text-primary md:text-3xl">
            Semua yang kamu butuhkan.
          </h2>
          <Card />
        </div>
      </section>

      <Footer />
    </main>
  );
}
