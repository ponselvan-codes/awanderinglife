import { Link } from 'react-router-dom';
import { Stamp, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="relative mb-6">
        <Stamp className="w-20 h-20 text-[var(--color-border)]" aria-hidden="true" />
        <div className="absolute -top-2 -right-2 bg-[var(--color-crimson)] text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
          404
        </div>
      </div>
      <h1 className="text-3xl font-bold font-serif text-[var(--color-charcoal)] mb-3">
        Page Not Found
      </h1>
      <p className="text-[var(--color-text-muted)] mb-8 max-w-md">
        This page has gone missing like a stamp lost in transit. Let's get you back on track.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn btn-primary" id="not-found-home-btn">
          <Home className="w-4 h-4" aria-hidden="true" />
          Go Home
        </Link>
        <Link to="/collection" className="btn btn-secondary" id="not-found-collection-btn">
          View Collection
        </Link>
      </div>
    </div>
  );
}
