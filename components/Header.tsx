'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold font-league-spartan text-brand-burgundy">
            Boviteam
          </div>
          <span className="text-xs font-semibold text-brand-green hidden sm:inline">
            Registro Visite
          </span>
        </Link>
        <nav className="flex gap-2">
          <Link href="/clienti" className="px-3 py-2 text-sm font-medium text-brand-green hover:text-brand-burgundy">
            Clienti
          </Link>
          <Link href="/visite" className="px-3 py-2 text-sm font-medium text-brand-green hover:text-brand-burgundy">
            Visite
          </Link>
        </nav>
      </div>
    </header>
  );
}
