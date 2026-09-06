"use client";
import Link from 'next/link';
import Marquee from './components/ui/Marquee';
import Card from './components/ui/Card';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';

export default function HeroPage() {
  return (

    <main className="bg-base overflow-hidden">

    <Navbar />
    <section className="min-h-screen bg-base text-white p-12 flex flex-col md:flex-row relative ">
      
      {/*Green Middle Gradient*/}
      <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none top-[-150px] left-1/2 -translate-x-1/2 z-0 bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_70%)]"/>

      <div className="z-10 mt-6">
                <span className="inline-block w-100 mt-12 md:mt-16  text-center font-jakarta border text-[#10b981] font-bold border-[#10b981] bg-[#10b981]/20 backdrop-blur-md rounded-2xl py-2 px-8 z-10">
                    Platform belajar generasi baru
                </span>
        <div className="flex flex-col mt-4">
                <span className="inline-block text-7xl font-jakarta font-bold">Kuasai Matematika.</span>
                <span className="inline-block text-5xl font-jakarta font-bold text-brand">Bertahap dan menyenangkan.</span>
                <span className="inline-block text-5xl font-jakarta italic font-bold text-ghost">Selesaikan tantangannya</span>
                <p className="w-150 mt-4 hidden md:block text-sm md:text-xl font-jakarta text-muted">Platform belajar Matematika yang didesign untuk mempermudah guru dalam mentracking perkembangan muridnya, ambil kendali atas progress siswa secara real time.</p>
                <Link className="bg-brand font-jakarta py-4 px-6 mt-6 rounded-2xl w-40 text-center font-bold transition translate active:scale-95 hover:scale-105" href="/login">Mulai gratis</Link>
        </div>
        </div>
      </section>

        {/*Marquee*/}
        <Marquee />
        {/*Marquee*/} 



        <section className="px-12 py-16">
          <p className="text-brand font-jakarta font-bold text-sm uppercase tracking-widest mb-2">Kenapa LearnBridge</p>
          <h2 className="text-primary font-jakarta font-bold text-3xl mb-8">Semua yang kamu butuhkan.</h2>
          <Card />
        </section>
        
      
    
        <Footer />
    </main>
  );
}
