'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const navItems: NavItem[] = [
  { label: 'Panel Principal', href: '/', icon: '📊' },
  { label: 'Actividades', href: '/activities', icon: '🚴' },
  { label: 'Análisis', href: '/analytics', icon: '📈' },
  { label: 'Entrenador', href: '/coach', icon: '🤖' },
  { label: 'Configuración', href: '/settings', icon: '⚙️' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-gray-800 bg-dark-secondary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-100">
            <span className="text-strava">⚡</span>
            SmartWatts
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 rounded bg-strava text-white text-sm font-medium hover:bg-strava/90 transition-colors">
            Iniciar Sesión

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-dark-card rounded"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-400 hover:text-gray-100 hover:bg-dark-card rounded transition-colors"
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
