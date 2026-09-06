"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <header className="flex justify-between items-center px-8 py-5 bg-base border-b border-line">
      
      <h1 className="text-2xl font-jakarta font-extrabold tracking-tight text-emerald-400">
        Learn<span className="text-white font-medium">Bridge</span>
      </h1>

      <nav>
        <ul className="hidden md:flex items-center gap-8 text-sm font-jakarta text-muted">
          <li><Link href="/" className="hover:text-white transition-colors duration-200">Beranda</Link></li>
          <li><Link href="/materi" className="hover:text-white transition-colors duration-200">Materi</Link></li>
          <li><Link href="/tentang" className="hover:text-white transition-colors duration-200">Tentang kami</Link></li>
        </ul>
      </nav>

      <button className="md:hidden flex flex-col gap-2 p-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-40 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-40 -translate-y-2' : ''}`} />
      </button>

      <div className="flex items-center gap-3 hidden md:flex">
        <Link 
          href="/login" 
          className="font-jakarta font-bold text-sm px-4 py-2 rounded-xl border border-line-strong text-muted hover:text-white hover:border-white transition-all duration-200">
          Masuk
        </Link>
        <Link 
          href="/register" 
          className="font-jakarta font-bold text-sm px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover transition-all duration-200 text-white active:scale-95">
          Daftar
        </Link>
      </div>

    </header>


    {isOpen && (

        <div className="md:hidden bg-surface shadow-lg border-b border-ghost/30 px-8 py-6 flex flex-col gap-4">
            <Link href="/" className="font-jakarta text-sm font-bold text-muted hover:text-white transition-colors duration-200">
              Beranda
            </Link>
            <Link href="/tentang" className="font-jakarta text-sm font-bold text-muted hover:text-white transition-colors duration-200">
              Tentang Kami
            </Link>
            <Link href="/materi" className="font-jakarta text-sm font-bold text-muted hover:text-white transition-colors duration-200">
              Materi
            </Link>

            <hr className="border-line" />

            <Link href="/login" className="font-jakarta text-sm font-bold text-muted hover:text-white transition-colors duration-200">Masuk</Link>
            <Link href="/register" className="font-jakarta text-sm font-bold text-muted hover:text-white transition-colors duration-200">Daftar</Link>

        </div>
      )}
    </>
  )
}