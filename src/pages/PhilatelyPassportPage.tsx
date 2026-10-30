import { useState, useMemo } from 'react';
import { BookOpen, Search, MapPin, Calendar, ZoomIn } from 'lucide-react';
import { getAllPassports, getImageSrc } from '../lib/utils';
import { formatDate } from '../lib/utils';
import ImageModal from '../components/ui/ImageModal';
import type { PassportRecord } from '../types';

export default function PhilatelyPassportPage() {
  const allPassports = getAllPassports();
  const [query, setQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSealType, setSelectedSealType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const states = [...new Set(allPassports.map((p) => p.state))].sort();
  const sealTypes = [...new Set(allPassports.map((p) => p.sealType))].sort();
  const events = [...new Set(allPassports.map((p) => p.event))].sort();
  const years = [...new Set(allPassports.filter(p => p.date).map((p) => p.date.substring(0, 4)))].sort((a, b) => b.localeCompare(a));

  const filtered = useMemo(() => {
    let list = [...allPassports];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.event.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.venue.toLowerCase().includes(q)
      );
    }
    if (selectedState) list = list.filter((p) => p.state === selectedState);
    if (selectedYear) list = list.filter((p) => p.date.startsWith(selectedYear));
    if (selectedSealType) list = list.filter((p) => p.sealType === selectedSealType);
    if (selectedEvent) list = list.filter((p) => p.event === selectedEvent);
    return list;
  }, [allPassports, query, selectedState, selectedYear, selectedSealType, selectedEvent]);

  // Build image list for modal
  const modalImages = filtered
    .filter((p) => p.image)
    .map((p) => ({
      src: getImageSrc(p.image),
      alt: `${p.title} – ${p.event}`,
      caption: `${p.event}, ${p.city} (${formatDate(p.date)})`,
    }));

  function openModal(passport: PassportRecord) {
    const idx = modalImages.findIndex(
      (img) => img.caption.includes(passport.event)
    );
    setModalIndex(idx >= 0 ? idx : 0);
    setModalOpen(true);
  }

  function clearFilters() {
    setQuery('');
    setSelectedState('');
    setSelectedYear('');
    setSelectedSealType('');
    setSelectedEvent('');
  }

  return (
    <div>
      {/* Header */}
      <div className="page-title-band">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-[var(--color-gold-light)]" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold font-serif">
              Philately Passport
            </h1>
          </div>
          <p className="text-gray-300">
            {allPassports.length} stamps and seals from philatelic exhibitions and events across India
          </p>
        </div>
      </div>

      <div className="container-main py-8">
        {/* Search + Filters */}
        <div className="filter-panel mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" aria-hidden="true" />
              <input
                type="search"
                id="passport-search"
                className="input pl-9"
                placeholder="Search by event, city, state…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search philately passport collection"
              />
            </div>
            <button onClick={clearFilters} className="btn btn-ghost border border-[var(--color-border)] text-sm" id="passport-clear-btn">
              Clear
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor="passport-filter-state" className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1 block">State</label>
              <select id="passport-filter-state" className="input select text-sm" value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                <option value="">All States</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="passport-filter-year" className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1 block">Year</label>
              <select id="passport-filter-year" className="input select text-sm" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="passport-filter-seal" className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1 block">Seal Type</label>
              <select id="passport-filter-seal" className="input select text-sm" value={selectedSealType} onChange={e => setSelectedSealType(e.target.value)}>
                <option value="">All Seal Types</option>
                {sealTypes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="passport-filter-event" className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1 block">Event</label>
              <select id="passport-filter-event" className="input select text-sm" value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}>
                <option value="">All Events</option>
                {events.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          Showing <strong className="text-[var(--color-charcoal)]">{filtered.length}</strong> of {allPassports.length} entries
        </p>

        {/* Gallery grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((passport) => (
              <article key={passport.id} className="card group overflow-hidden">
                {/* Image */}
                {passport.image ? (
                  <button
                    className="block w-full relative overflow-hidden cursor-zoom-in"
                    onClick={() => openModal(passport)}
                    aria-label={`View enlarged seal image for ${passport.title}`}
                    id={`passport-image-${passport.id}`}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={getImageSrc(passport.image)}
                        alt={`${passport.sealType} from ${passport.event}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-slow"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-fast flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-fast" aria-hidden="true" />
                    </div>
                  </button>
                ) : (
                  <div className="image-placeholder aspect-[4/3]">
                    <BookOpen className="w-10 h-10 opacity-30" />
                    <span className="text-xs opacity-60">No image</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-4 space-y-2">
                  {/* Seal type badge */}
                  <span className="text-xs font-semibold text-[var(--color-gold)] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    {passport.sealType}
                  </span>

                  <h2 className="font-bold text-[var(--color-charcoal)] text-sm leading-snug">
                    {passport.title}
                  </h2>

                  <div className="text-xs text-[var(--color-text-muted)] italic">
                    {passport.event}
                  </div>

                  <div className="text-xs text-[var(--color-text-muted)] space-y-1 pt-1 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[var(--color-crimson)]" aria-hidden="true" />
                      <span>{passport.venue}, {passport.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[var(--color-gold)]" aria-hidden="true" />
                      <span>{passport.state}</span>
                    </div>
                    {passport.date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" aria-hidden="true" />
                        <span>{formatDate(passport.date)}</span>
                      </div>
                    )}
                    {passport.passportPage && (
                      <div className="text-gray-400">Page: {passport.passportPage}</div>
                    )}
                  </div>

                  {passport.description && !passport.description.includes('DEMO DATA') && (
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
                      {passport.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" aria-hidden="true" />
            <p className="text-lg font-medium mb-2">No passport entries found</p>
            <button onClick={clearFilters} className="btn btn-primary" id="passport-no-results-btn">Clear filters</button>
          </div>
        )}
      </div>

      {/* Image modal */}
      {modalOpen && modalImages.length > 0 && (
        <ImageModal
          images={modalImages}
          currentIndex={modalIndex}
          onClose={() => setModalOpen(false)}
          onPrev={() => setModalIndex((i) => (i - 1 + modalImages.length) % modalImages.length)}
          onNext={() => setModalIndex((i) => (i + 1) % modalImages.length)}
        />
      )}
    </div>
  );
}
