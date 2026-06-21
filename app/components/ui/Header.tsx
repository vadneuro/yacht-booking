'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-sm' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--azure)] to-[var(--teal)] flex items-center justify-center shadow-lg shadow-[var(--azure)]/20 group-hover:shadow-[var(--azure)]/40 transition-shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
                <path d="M12 2v8"/>
              </svg>
            </div>
            <span className={`font-bold text-lg tracking-tight transition-colors duration-500 ${
              scrolled ? 'text-[var(--navy)]' : 'text-white'
            }`}>
              Glissa
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/catalog', label: 'Яхты' },
              { href: '#destinations', label: 'Направления' },
              { href: '#how-it-works', label: 'Как это работает' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:opacity-100 ${
                  scrolled ? 'text-[var(--muted)] hover:text-[var(--navy)]' : 'text-white/75 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/catalog"
              className="px-5 py-2.5 rounded-full bg-[var(--azure)] text-white text-sm font-semibold
                         shadow-lg shadow-[var(--azure)]/25 hover:shadow-[var(--azure)]/40
                         hover:bg-[var(--azure)]/90 transition-all active:scale-[0.97]"
            >
              Забронировать
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
              scrolled ? 'text-[var(--navy)]' : 'text-white'
            }`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M4 8h16" />
                  <path d="M4 16h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-black/5 animate-fade-in">
          <div className="px-5 py-4 space-y-3">
            {[
              { href: '/catalog', label: 'Яхты' },
              { href: '#destinations', label: 'Направления' },
              { href: '#how-it-works', label: 'Как это работает' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-[var(--navy)] font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/catalog"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-5 py-3 rounded-xl bg-[var(--azure)] text-white font-semibold mt-2"
            >
              Забронировать
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
