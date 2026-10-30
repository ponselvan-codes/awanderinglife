import { Link } from 'react-router-dom';
import { MapPin, CheckCircle2, ArrowRight, Stamp } from 'lucide-react';
import { getStateStats, getAllPPCs } from '../lib/utils';

export default function StatesPage() {
  const stateStats = getStateStats();
  const allPPCs = getAllPPCs();

  const sortedStates = Object.entries(stateStats).sort((a, b) => b[1].total - a[1].total);

  // Group by region (rough grouping)
  const regions: Record<string, string[]> = {
    'South India': ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Puducherry', 'Lakshadweep'],
    'West India': ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa', 'Dadra and Nagar Haveli and Daman and Diu'],
    'North India': ['Delhi', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh'],
    'East India': ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand', 'Andaman and Nicobar Islands'],
    'North East India': ['Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'],
    'Central India': ['Madhya Pradesh', 'Chhattisgarh'],
  };

  function getRegion(state: string): string {
    for (const [region, states] of Object.entries(regions)) {
      if (states.includes(state)) return region;
    }
    return 'Other';
  }

  // Group states by region
  const grouped: Record<string, typeof sortedStates> = {};
  for (const entry of sortedStates) {
    const region = getRegion(entry[0]);
    if (!grouped[region]) grouped[region] = [];
    grouped[region].push(entry);
  }

  const totalStates = sortedStates.length;
  const totalPPCs = allPPCs.length;
  const totalReceived = allPPCs.filter((p) => p.received).length;

  return (
    <div>
      {/* Header */}
      <div className="page-title-band">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8 text-[var(--color-gold-light)]" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold font-serif">State-wise Collection</h1>
          </div>
          <p className="text-gray-300">
            PPCs spanning {totalStates} states and union territories
          </p>
        </div>
      </div>

      <div className="container-main py-10">
        {/* Summary row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'States Covered', value: totalStates, icon: MapPin, color: 'text-[var(--color-crimson)]' },
            { label: 'Total PPC', value: totalPPCs, icon: Stamp, color: 'text-[var(--color-charcoal)]' },
            { label: 'Received', value: totalReceived, icon: CheckCircle2, color: 'text-green-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card text-center">
              <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} aria-hidden="true" />
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-[var(--color-text-muted)]">{label}</div>
            </div>
          ))}
        </div>

        {/* All states grid (sorted by total) */}
        <section aria-labelledby="all-states-heading">
          <h2 id="all-states-heading" className="section-heading">All States &amp; Union Territories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {sortedStates.map(([state, s]) => {
              const receivedPct = s.total > 0 ? Math.round((s.received / s.total) * 100) : 0;
              return (
                <Link
                  key={state}
                  to={`/collection?state=${encodeURIComponent(state)}`}
                  className="card p-5 hover:border-[var(--color-crimson)] transition-fast group block"
                  id={`state-card-${state.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[var(--color-crimson)] shrink-0 mt-0.5 group-hover:scale-110 transition-fast" aria-hidden="true" />
                      <div>
                        <h3 className="font-bold text-[var(--color-charcoal)] group-hover:text-[var(--color-crimson)] transition-fast">
                          {state}
                        </h3>
                        <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                          {s.total} PPC · {receivedPct}% received
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-crimson)] group-hover:translate-x-1 transition-fast" aria-hidden="true" />
                  </div>

                  {/* Progress bar */}
                  <div className="progress-bar-track mb-3">
                    <div
                      className="progress-bar-fill bg-gradient-to-r from-green-500 to-green-400"
                      style={{ width: `${receivedPct}%` }}
                      role="progressbar"
                      aria-valuenow={receivedPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-green-600 font-bold text-sm">{s.received}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">Received</div>
                    </div>
                    <div>
                      <div className="text-orange-500 font-bold text-sm">{s.requestedAwaiting}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">Awaiting</div>
                    </div>
                    <div>
                      <div className="text-slate-500 font-bold text-sm">{s.notRequested}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">Not Req.</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* By region */}
        {Object.entries(grouped).map(([region, entries]) => (
          <section key={region} className="mb-8" aria-labelledby={`region-${region.replace(/\s+/g, '-')}`}>
            <h2 id={`region-${region.replace(/\s+/g, '-')}`} className="section-heading">{region}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {entries.map(([state, s]) => (
                <Link
                  key={state}
                  to={`/collection?state=${encodeURIComponent(state)}`}
                  className="bg-white border border-[var(--color-border)] rounded-lg p-3 hover:border-[var(--color-crimson)] hover:shadow-md transition-fast group"
                  id={`region-state-${state.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="font-semibold text-sm text-[var(--color-charcoal)] group-hover:text-[var(--color-crimson)] transition-fast mb-1">
                    {state}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <span className="text-green-600 font-medium">{s.received} ✓</span>
                    <span>/ {s.total}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
