import { Link } from 'react-router-dom';
import {
  Stamp,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  BookOpen,
  ArrowRight,
  MapPin,
  Calendar,
  Star,
} from 'lucide-react';
import {
  getCollectionStats,
  getRecentlyReceived,
  getRecentlyAdded,
  getAllPPCs,
  getStateStats,
} from '../lib/utils';
import PPCCard from '../components/ppc/PPCCard';

export default function HomePage() {
  const stats = getCollectionStats();
  const recentReceived = getRecentlyReceived(4);
  const recentAdded = getRecentlyAdded(4);
  const allPPCs = getAllPPCs();
  const stateStats = getStateStats();
  const topStates = Object.entries(stateStats)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 8);

  // Featured PPCs (received with images)
  const featured = allPPCs
    .filter((p) => p.received && p.primaryImage)
    .slice(0, 3);

  const receivePercent = stats.total > 0 ? Math.round((stats.received / stats.total) * 100) : 0;

  return (
    <div>
      {/* ─── Hero ───────────────────────────────────── */}
      <section className="hero-gradient text-white py-20 md:py-28 relative overflow-hidden" aria-label="Hero section">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-crimson)]/10 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-gold)]/10 rounded-full translate-y-1/2 -translate-x-1/2" aria-hidden="true" />

        <div className="container-main relative">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Stamp className="w-4 h-4 text-[var(--color-gold-light)]" aria-hidden="true" />
              <span>Personal Philatelic Collection</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight mb-6">
              India PPC &amp;{' '}
              <span className="text-[var(--color-gold-light)]">Philately Passport</span>
              <br />Collection
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              Documenting a personal collection of Indian <strong className="text-white">
              Permanent Pictorial Cancellations</strong> (PPC) and Philately Passport 
              stamps and seals — celebrating India's rich postal heritage.
            </p>

            {/* Hero stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Total PPC', value: stats.total, color: 'text-white', icon: Stamp },
                { label: 'Received', value: stats.received, color: 'text-green-400', icon: CheckCircle2 },
                { label: 'Awaiting', value: stats.requestedAwaiting, color: 'text-orange-400', icon: Clock },
                { label: 'Passport Seals', value: stats.passportSeals, color: 'text-[var(--color-gold-light)]', icon: BookOpen },
              ].map(({ label, value, color, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-white/10 border border-white/15 rounded-xl p-4 text-center"
                >
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} aria-hidden="true" />
                  <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/collection" className="btn btn-primary" id="hero-browse-btn">
                Browse Collection
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link to="/collection-progress" className="btn btn-secondary border-white/30 text-white hover:bg-white hover:text-[var(--color-charcoal)]" id="hero-progress-btn">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                View Progress
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Overall Progress Bar ───────────────────── */}
      <section className="bg-white border-b border-[var(--color-border)] py-6" aria-label="Collection overview">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="font-semibold text-[var(--color-charcoal)]">
                  Collection Progress
                </span>
                <span className="text-[var(--color-crimson)] font-bold">
                  {receivePercent}% received
                </span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill bg-gradient-to-r from-[var(--color-crimson)] to-green-500"
                  style={{ width: `${receivePercent}%` }}
                  role="progressbar"
                  aria-valuenow={receivePercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${receivePercent}% of collection received`}
                />
              </div>
            </div>
            <Link
              to="/collection-progress"
              className="text-sm text-[var(--color-crimson)] font-semibold hover:underline shrink-0"
            >
              Full report →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats Cards ────────────────────────────── */}
      <section className="py-12" aria-labelledby="stats-heading">
        <div className="container-main">
          <h2 id="stats-heading" className="section-heading">Collection Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                label: 'Total PPC',
                value: stats.total,
                icon: Stamp,
                color: 'from-[var(--color-crimson)] to-[var(--color-crimson-dark)]',
                textColor: 'text-[var(--color-crimson)]',
              },
              {
                label: 'Received',
                value: stats.received,
                icon: CheckCircle2,
                color: 'from-green-500 to-green-600',
                textColor: 'text-green-600',
              },
              {
                label: 'Requested',
                value: stats.requestedAwaiting,
                icon: Clock,
                color: 'from-orange-500 to-orange-600',
                textColor: 'text-orange-600',
              },
              {
                label: 'Not Requested',
                value: stats.notRequested,
                icon: XCircle,
                color: 'from-slate-400 to-slate-500',
                textColor: 'text-slate-500',
              },
              {
                label: 'Passport Seals',
                value: stats.passportSeals,
                icon: BookOpen,
                color: 'from-[var(--color-gold)] to-[var(--color-gold-light)]',
                textColor: 'text-[var(--color-gold)]',
              },
            ].map(({ label, value, icon: Icon, color, textColor }) => (
              <div key={label} className="stat-card text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}
                  aria-hidden="true"
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-bold ${textColor} mb-1`}>{value}</div>
                <div className="text-xs text-[var(--color-text-muted)] font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured PPC ───────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-12 bg-[var(--color-surface-alt)]" aria-labelledby="featured-heading">
          <div className="container-main">
            <div className="flex items-center justify-between mb-6">
              <h2 id="featured-heading" className="section-heading mb-0">
                <span className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-[var(--color-gold)]" aria-hidden="true" />
                  Featured Collection
                </span>
              </h2>
              <Link to="/collection" className="text-sm text-[var(--color-crimson)] font-semibold hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((ppc) => (
                <PPCCard key={ppc.id} ppc={ppc} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Recently Received ──────────────────────── */}
      {recentReceived.length > 0 && (
        <section className="py-12" aria-labelledby="recent-received-heading">
          <div className="container-main">
            <div className="flex items-center justify-between mb-6">
              <h2 id="recent-received-heading" className="section-heading mb-0">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" aria-hidden="true" />
                  Recently Received
                </span>
              </h2>
              <Link
                to="/collection?filter=received"
                className="text-sm text-[var(--color-crimson)] font-semibold hover:underline"
              >
                View all received →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentReceived.map((ppc) => (
                <PPCCard key={ppc.id} ppc={ppc} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Browse by State ────────────────────────── */}
      <section className="py-12 bg-[var(--color-surface-alt)]" aria-labelledby="states-heading">
        <div className="container-main">
          <div className="flex items-center justify-between mb-6">
            <h2 id="states-heading" className="section-heading mb-0">Browse by State</h2>
            <Link to="/states" className="text-sm text-[var(--color-crimson)] font-semibold hover:underline">
              View all states →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {topStates.map(([state, s]) => (
              <Link
                key={state}
                to={`/collection?state=${encodeURIComponent(state)}`}
                className="card p-4 hover:border-[var(--color-crimson)] transition-fast group block"
                id={`state-link-${state.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[var(--color-crimson)] shrink-0 mt-0.5 group-hover:scale-110 transition-fast" aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-sm text-[var(--color-charcoal)] group-hover:text-[var(--color-crimson)] transition-fast">
                      {state}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {s.total} PPC
                      {s.received > 0 && (
                        <span className="text-green-600 ml-1">· {s.received} received</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recently Added ─────────────────────────── */}
      {recentAdded.length > 0 && (
        <section className="py-12" aria-labelledby="recent-added-heading">
          <div className="container-main">
            <div className="flex items-center justify-between mb-6">
              <h2 id="recent-added-heading" className="section-heading mb-0">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--color-gold)]" aria-hidden="true" />
                  Recently Inaugurated
                </span>
              </h2>
              <Link to="/collection" className="text-sm text-[var(--color-crimson)] font-semibold hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentAdded.map((ppc) => (
                <PPCCard key={ppc.id} ppc={ppc} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA: Philately Passport ─────────────────── */}
      <section className="py-16 bg-gradient-to-br from-[var(--color-charcoal)] to-[#3d1a25]" aria-labelledby="passport-cta-heading">
        <div className="container-main text-center text-white">
          <BookOpen className="w-14 h-14 mx-auto mb-4 text-[var(--color-gold-light)]" aria-hidden="true" />
          <h2 id="passport-cta-heading" className="text-3xl font-bold font-serif mb-4">
            Philately Passport Collection
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-8">
            Explore a collection of {stats.passportSeals} philatelic passport stamps and seals 
            gathered from exhibitions, special events, and postal bureaus across India.
          </p>
          <Link to="/philately-passport" className="btn btn-gold" id="passport-cta-btn">
            View Passport Seals
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
