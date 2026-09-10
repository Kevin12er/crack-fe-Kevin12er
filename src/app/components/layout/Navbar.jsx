"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const previousActiveElement = useRef(null);

  function getFocusableElements(container) {
    if (!container) return [];
    return Array.from(
      container.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("disabled"));
  }

  useEffect(() => {
    if (!isOpen) return;
    previousActiveElement.current = document.activeElement;
    const focusable = getFocusableElements(menuRef.current);
    focusable[0]?.focus();

    function onKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key === "Tab") {
        const focusableEls = getFocusableElements(menuRef.current);
        if (focusableEls.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <header className="flex justify-between items-center px-8 py-5 bg-base border-b border-line">
        <h1 className="text-2xl font-jakarta font-extrabold tracking-tight text-emerald-400">
          Learn<span className="text-white font-medium">Bridge</span>
        </h1>

        <nav>
          <ul className="hidden md:flex items-center gap-8 text-sm font-jakarta text-muted">
            <li>
              <Link
                href="/"
                className="hover:text-white transition-colors duration-200"
              >
                Beranda
              </Link>
            </li>
            <li>
              <Link
                href="/materi"
                className="hover:text-white transition-colors duration-200"
              >
                Materi
              </Link>
            </li>
            <li>
              <Link
                href="/tentang"
                className="hover:text-white transition-colors duration-200"
              >
                Tentang kami
              </Link>
            </li>
          </ul>
        </nav>

        <button
          ref={toggleButtonRef}
          className="md:hidden flex flex-col gap-2 p-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-40 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-40 -translate-y-2" : ""}`}
          />
        </button>

        <div className="flex items-center gap-3 hidden md:flex">
          <Link
            href="/login"
            className="font-jakarta font-bold text-sm px-4 py-2 rounded-xl border border-line-strong text-muted hover:text-white hover:border-white transition-all duration-200"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="font-jakarta font-bold text-sm px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover transition-all duration-200 text-white active:scale-95"
          >
            Daftar
          </Link>
        </div>
      </header>

      {isOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden bg-surface shadow-lg border-b border-ghost/30 px-8 py-6 flex flex-col gap-4"
          role="menu"
          aria-label="Mobile menu"
          tabIndex={-1}
        >
          <Link
            href="/"
            role="menuitem"
            className="font-jakarta text-sm font-bold text-muted hover:text-white transition-colors duration-200"
          >
            Beranda
          </Link>
          <Link
            href="/tentang"
            role="menuitem"
            className="font-jakarta text-sm font-bold text-muted hover:text-white transition-colors duration-200"
          >
            Tentang Kami
          </Link>
          <Link
            href="/materi"
            role="menuitem"
            className="font-jakarta text-sm font-bold text-muted hover:text-white transition-colors duration-200"
          >
            Materi
          </Link>

          <hr className="border-line" />

          <Link
            href="/login"
            role="menuitem"
            className="font-jakarta text-sm font-bold text-muted hover:text-white transition-colors duration-200"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            role="menuitem"
            className="font-jakarta text-sm font-bold text-muted hover:text-white transition-colors duration-200"
          >
            Daftar
          </Link>
        </div>
      )}
    </>
  );
}
