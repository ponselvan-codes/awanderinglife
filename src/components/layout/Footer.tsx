import { Link } from 'react-router-dom';
import { Stamp, GitFork, ExternalLink, Heart } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {

  return (
    <footer className="bg-[var(--color-charcoal)] text-gray-300 mt-16">
      {/* Top gradient accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent" />

      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-crimson)] to-[var(--color-crimson-dark)] flex items-center justify-center">
                <Stamp className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold font-serif">India PPC Collection</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              A personal philatelic collection documenting Indian Permanent Pictorial 
              Cancellations (PPC) and Philately Passport stamps and seals.
            </p>
            <p className="text-xs text-gray-500 mt-3 italic">
              This is a personal collection website and is not affiliated with or 
              endorsed by India Post or the Department of Posts, Government of India.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Browse Collection
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/collection', label: 'PPC Collection' },
                { to: '/philately-passport', label: 'Philately Passport' },
                { to: '/states', label: 'Browse by State' },
                { to: '/collection-progress', label: 'Collection Progress' },
                { to: '/gallery', label: 'Image Gallery' },
                { to: '/about', label: 'About' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="hover:text-[var(--color-gold-light)] transition-fast"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin & GitHub */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Administration
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              This collection is managed through GitHub. Collection data is stored in 
              the repository and updated via authenticated GitHub workflows.
            </p>
            <a
              href="https://github.com/your-username/india-ppc-collection"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-[var(--color-gold-light)] transition-fast"
              id="github-repo-link"
            >
              <GitFork className="w-4 h-4" aria-hidden="true" />
              View on GitHub
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
            <div className="mt-3">
              <Link
                to="/about#admin"
                className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-fast"
                id="admin-workflow-link"
              >
                Admin workflow documentation ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            &copy; {CURRENT_YEAR} India PPC &amp; Philately Passport Collection. 
            Personal collection website.
          </p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 text-[var(--color-crimson)]" aria-hidden="true" /> for philately
          </p>
        </div>
      </div>
    </footer>
  );
}
