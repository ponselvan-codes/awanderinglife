import { getCollectionStats, getAllPPCs } from '../lib/utils';
import { BarChart3, CheckCircle2, Clock, XCircle, Stamp, TrendingUp } from 'lucide-react';

interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  colorClass: string;
  bgClass: string;
}

function ProgressBar({ label, value, total, colorClass, bgClass }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-[var(--color-charcoal)]">{label}</span>
        <span className="flex items-center gap-2">
          <strong className={colorClass}>{value}</strong>
          <span className="text-[var(--color-text-muted)]">({percent}%)</span>
        </span>
      </div>
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill ${bgClass}`}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${value} of ${total} (${percent}%)`}
        />
      </div>
    </div>
  );
}

export default function CollectionProgressPage() {
  const stats = getCollectionStats();
  const allPPCs = getAllPPCs();

  // By theme
  const themeStats: Record<string, { total: number; received: number }> = {};
  for (const ppc of allPPCs) {
    if (!themeStats[ppc.theme]) themeStats[ppc.theme] = { total: 0, received: 0 };
    themeStats[ppc.theme].total++;
    if (ppc.received) themeStats[ppc.theme].received++;
  }
  const sortedThemes = Object.entries(themeStats).sort((a, b) => b[1].total - a[1].total);

  // Year-wise
  const yearStats: Record<string, { total: number; received: number }> = {};
  for (const ppc of allPPCs) {
    if (!ppc.inaugurationDate) continue;
    const year = ppc.inaugurationDate.substring(0, 4);
    if (!yearStats[year]) yearStats[year] = { total: 0, received: 0 };
    yearStats[year].total++;
    if (ppc.received) yearStats[year].received++;
  }
  const sortedYears = Object.entries(yearStats).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div>
      {/* Header */}
      <div className="page-title-band">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-[var(--color-gold-light)]" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold font-serif">Collection Progress</h1>
          </div>
          <p className="text-gray-300">
            Dynamic progress tracking — calculated live from collection data
          </p>
        </div>
      </div>

      <div className="container-main py-10 space-y-10">
        {/* Summary cards */}
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="section-heading">Overall Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {[
              {
                label: 'Total PPC',
                value: stats.total,
                icon: Stamp,
                colorClass: 'text-[var(--color-crimson)]',
                bgClass: 'bg-gradient-to-br from-[var(--color-crimson)] to-[var(--color-crimson-dark)]',
              },
              {
                label: 'Received',
                value: stats.received,
                icon: CheckCircle2,
                colorClass: 'text-green-600',
                bgClass: 'bg-gradient-to-br from-green-500 to-green-600',
              },
              {
                label: 'Awaiting Receipt',
                value: stats.requestedAwaiting,
                icon: Clock,
                colorClass: 'text-orange-600',
                bgClass: 'bg-gradient-to-br from-orange-500 to-orange-600',
              },
              {
                label: 'Not Requested',
                value: stats.notRequested,
                icon: XCircle,
                colorClass: 'text-slate-500',
                bgClass: 'bg-gradient-to-br from-slate-400 to-slate-500',
              },
              {
                label: 'With Images',
                value: stats.withImages,
                icon: TrendingUp,
                colorClass: 'text-[var(--color-gold)]',
                bgClass: 'bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)]',
              },
            ].map(({ label, value, icon: Icon, colorClass, bgClass }) => (
              <div key={label} className="stat-card text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-xl ${bgClass} flex items-center justify-center shadow-md`}
                  aria-hidden="true"
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-bold ${colorClass} mb-1`}>{value}</div>
                <div className="text-xs text-[var(--color-text-muted)] font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Main progress bars */}
          <div className="card p-6 space-y-6">
            <h3 className="font-semibold text-[var(--color-charcoal)] text-lg">Collection Breakdown</h3>
            <ProgressBar
              label="Received"
              value={stats.received}
              total={stats.total}
              colorClass="text-green-600"
              bgClass="bg-gradient-to-r from-green-500 to-green-400"
            />
            <ProgressBar
              label="Requested – Awaiting Receipt"
              value={stats.requestedAwaiting}
              total={stats.total}
              colorClass="text-orange-600"
              bgClass="bg-gradient-to-r from-orange-500 to-orange-400"
            />
            <ProgressBar
              label="Not Yet Requested"
              value={stats.notRequested}
              total={stats.total}
              colorClass="text-slate-500"
              bgClass="bg-gradient-to-r from-slate-400 to-slate-300"
            />
            <ProgressBar
              label="Entries with Images"
              value={stats.withImages}
              total={stats.total}
              colorClass="text-[var(--color-gold)]"
              bgClass="bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)]"
            />

            {/* Visual breakdown bar */}
            <div>
              <div className="text-sm font-medium text-[var(--color-charcoal)] mb-2">Visual Breakdown</div>
              <div className="w-full h-8 rounded-xl overflow-hidden flex" role="img" aria-label="Visual collection breakdown">
                {stats.received > 0 && (
                  <div
                    className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(stats.received / stats.total) * 100}%` }}
                    title={`Received: ${stats.received}`}
                  >
                    {stats.received > 1 ? stats.received : ''}
                  </div>
                )}
                {stats.requestedAwaiting > 0 && (
                  <div
                    className="bg-orange-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(stats.requestedAwaiting / stats.total) * 100}%` }}
                    title={`Awaiting: ${stats.requestedAwaiting}`}
                  >
                    {stats.requestedAwaiting > 1 ? stats.requestedAwaiting : ''}
                  </div>
                )}
                {stats.notRequested > 0 && (
                  <div
                    className="bg-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold"
                    style={{ width: `${(stats.notRequested / stats.total) * 100}%` }}
                    title={`Not Requested: ${stats.notRequested}`}
                  >
                    {stats.notRequested > 1 ? stats.notRequested : ''}
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-2 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-sm inline-block" />Received</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded-sm inline-block" />Awaiting</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-300 rounded-sm inline-block" />Not Requested</span>
              </div>
            </div>
          </div>
        </section>

        {/* By Theme */}
        {sortedThemes.length > 0 && (
          <section aria-labelledby="theme-heading">
            <h2 id="theme-heading" className="section-heading">Progress by Theme</h2>
            <div className="card p-6 space-y-5">
              {sortedThemes.map(([theme, s]) => (
                <div key={theme}>
                  <div className="flex justify-between items-center mb-1.5 text-sm">
                    <span className="font-medium text-[var(--color-charcoal)]">{theme}</span>
                    <span className="text-[var(--color-text-muted)]">
                      {s.received}/{s.total} received
                    </span>
                  </div>
                  <div className="w-full h-6 bg-[var(--color-cream-dark)] rounded-lg overflow-hidden flex">
                    <div
                      className="bg-green-500 transition-all"
                      style={{ width: s.total > 0 ? `${(s.received / s.total) * 100}%` : '0%' }}
                    />
                    <div
                      className="bg-slate-300"
                      style={{ width: s.total > 0 ? `${((s.total - s.received) / s.total) * 100}%` : '100%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* By Year */}
        {sortedYears.length > 0 && (
          <section aria-labelledby="year-heading">
            <h2 id="year-heading" className="section-heading">Progress by Inauguration Year</h2>
            <div className="card p-6 space-y-5">
              {sortedYears.map(([year, s]) => (
                <ProgressBar
                  key={year}
                  label={year}
                  value={s.received}
                  total={s.total}
                  colorClass="text-green-600"
                  bgClass="bg-gradient-to-r from-green-500 to-green-400"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
