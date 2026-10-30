import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  Stamp,
  Home,
  BookOpen,
  MapPin,
  BarChart3,
  Image,
  Milestone,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navLinks = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/collection', label: 'PPC Collection', icon: Stamp },
  { to: '/philately-passport', label: 'Philately Passport', icon: BookOpen },
  { to: '/states', label: 'States', icon: MapPin },
  { to: '/collection-progress', label: 'Progress', icon: BarChart3 },
  { to: '/gallery', label: 'Gallery', icon: Image },
  { to: '/about', label: 'About', icon: Milestone },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-charcoal)] shadow-lg">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[var(--color-crimson)] via-[var(--color-gold)] to-[var(--color-crimson)]" />

      <nav className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            aria-label="India PPC & Philately Passport Collection — Home"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-crimson)] to-[var(--color-crimson-dark)] flex items-center justify-center shadow-md group-hover:scale-110 transition-fast">
              <Stamp className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-tight font-serif">
                India PPC Collection
              </div>
              <div className="text-[var(--color-gold-light)] text-xs">
                &amp; Philately Passport
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {navLinks.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-fast',
                      isActive
                        ? 'bg-[var(--color-crimson)] text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    )
                  }
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-fast"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-3 border-t border-white/10 mt-1" role="dialog" aria-label="Mobile navigation">
            <ul className="mt-2 space-y-1" role="list">
              {navLinks.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-fast',
                        isActive
                          ? 'bg-[var(--color-crimson)] text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      )
                    }
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Current page indicator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent" />
    </header>
  );
}
