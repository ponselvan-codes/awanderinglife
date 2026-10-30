import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import {
  getAllPPCs,
  getUniqueStates,
  getUniqueThemes,
  getUniqueYears,
  getPPCStatus,
} from '../lib/utils';
import PPCCard from '../components/ppc/PPCCard';
import { cn } from '../lib/utils';

type SortOption =
  | 'newest'
  | 'oldest'
  | 'recently-received'
  | 'title-az'
  | 'state'
  | 'post-office';

type StatusFilter = 'all' | 'received' | 'requested-awaiting' | 'not-requested';

export default function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    (searchParams.get('filter') as StatusFilter) || 'all'
  );
  const [imageOnly, setImageOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allPPCs = getAllPPCs();
  const states = getUniqueStates();
  const themes = getUniqueThemes();
  const years = getUniqueYears();
  const districts = useMemo(
    () => [...new Set(allPPCs.map((p) => p.district))].sort(),
    [allPPCs]
  );

  // Sync URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (selectedState) params.state = selectedState;
    if (statusFilter !== 'all') params.filter = statusFilter;
    setSearchParams(params, { replace: true });
  }, [query, selectedState, statusFilter, setSearchParams]);

  const filtered = useMemo(() => {
    let list = [...allPPCs];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.postOffice.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.theme.toLowerCase().includes(q) ||
          p.subject.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    // State filter
    if (selectedState) {
      list = list.filter((p) => p.state === selectedState);
    }

    // District filter
    if (selectedDistrict) {
      list = list.filter((p) => p.district === selectedDistrict);
    }

    // Theme filter
    if (selectedTheme) {
      list = list.filter((p) => p.theme === selectedTheme);
    }

    // Year filter
    if (selectedYear) {
      list = list.filter((p) => p.inaugurationDate.startsWith(selectedYear));
    }

    // Status filter
    if (statusFilter !== 'all') {
      list = list.filter((p) => getPPCStatus(p) === statusFilter);
    }

    // Image only
    if (imageOnly) {
      list = list.filter((p) => p.primaryImage || p.postcardFrontImage);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => b.inaugurationDate.localeCompare(a.inaugurationDate));
        break;
      case 'oldest':
        list.sort((a, b) => a.inaugurationDate.localeCompare(b.inaugurationDate));
        break;
      case 'recently-received':
        list.sort((a, b) => (b.receivedDate || '').localeCompare(a.receivedDate || ''));
        break;
      case 'title-az':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'state':
        list.sort((a, b) => a.state.localeCompare(b.state));
        break;
      case 'post-office':
        list.sort((a, b) => a.postOffice.localeCompare(b.postOffice));
        break;
    }

    return list;
  }, [allPPCs, query, selectedState, selectedDistrict, selectedTheme, selectedYear, statusFilter, imageOnly, sortBy]);

  function clearFilters() {
    setQuery('');
    setSelectedState('');
    setSelectedTheme('');
    setSelectedYear('');
    setSelectedDistrict('');
    setStatusFilter('all');
    setImageOnly(false);
    setSortBy('newest');
  }

  const activeFilterCount = [
    selectedState,
    selectedTheme,
    selectedYear,
    selectedDistrict,
    statusFilter !== 'all' ? statusFilter : '',
    imageOnly ? 'image' : '',
  ].filter(Boolean).length;

  return (
    <div>
      {/* Page header */}
      <div className="page-title-band">
        <div className="container-main">
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">
            PPC Collection
          </h1>
          <p className="text-gray-300">
            {allPPCs.length} Indian Permanent Pictorial Cancellations documented
          </p>
        </div>
      </div>

      <div className="container-main py-8">
        {/* Search + sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" aria-hidden="true" />
            <input
              type="search"
              id="ppc-search"
              className="input pl-9"
              placeholder="Search by title, post office, state, theme…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search PPC collection"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              id="ppc-sort"
              className="input select pr-8 min-w-[200px]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort PPC collection"
            >
              <option value="newest">Newest PPC</option>
              <option value="oldest">Oldest PPC</option>
              <option value="recently-received">Recently Received</option>
              <option value="title-az">Title A–Z</option>
              <option value="state">By State</option>
              <option value="post-office">By Post Office</option>
            </select>
          </div>

          {/* Filter toggle button */}
          <button
            className={cn(
              'btn flex items-center gap-2',
              filtersOpen || activeFilterCount > 0
                ? 'btn-primary'
                : 'btn-secondary'
            )}
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-expanded={filtersOpen}
            aria-controls="filter-panel"
            id="toggle-filters-btn"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-[var(--color-crimson)] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div id="filter-panel" className="filter-panel mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--color-charcoal)] flex items-center gap-2">
                <Filter className="w-4 h-4" aria-hidden="true" />
                Filter Collection
              </h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[var(--color-crimson)] hover:underline flex items-center gap-1"
                  id="clear-filters-btn"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* State */}
              <div>
                <label htmlFor="filter-state" className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1 block">
                  State
                </label>
                <select
                  id="filter-state"
                  className="input select"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">All States</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label htmlFor="filter-district" className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1 block">
                  District
                </label>
                <select
                  id="filter-district"
                  className="input select"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  <option value="">All Districts</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Theme */}
              <div>
                <label htmlFor="filter-theme" className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1 block">
                  Theme
                </label>
                <select
                  id="filter-theme"
                  className="input select"
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                >
                  <option value="">All Themes</option>
                  {themes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label htmlFor="filter-year" className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1 block">
                  Inauguration Year
                </label>
                <select
                  id="filter-year"
                  className="input select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">All Years</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status filter */}
            <div className="mt-4">
              <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                Collection Status
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: 'all', label: 'All' },
                    { value: 'received', label: '✓ Received' },
                    { value: 'requested-awaiting', label: '⏳ Awaiting Receipt' },
                    { value: 'not-requested', label: '○ Not Requested' },
                  ] as const
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setStatusFilter(value)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-fast border',
                      statusFilter === value
                        ? 'bg-[var(--color-crimson)] text-white border-[var(--color-crimson)]'
                        : 'bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-crimson)]'
                    )}
                    id={`status-filter-${value}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image filter */}
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="filter-image-only"
                  checked={imageOnly}
                  onChange={(e) => setImageOnly(e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-crimson)]"
                />
                <span className="text-sm text-[var(--color-charcoal)]">
                  Only show entries with images
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[var(--color-text-muted)]">
            Showing <strong className="text-[var(--color-charcoal)]">{filtered.length}</strong> of{' '}
            {allPPCs.length} PPC entries
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-[var(--color-crimson)] hover:underline"
              id="clear-filters-inline-btn"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((ppc) => (
              <PPCCard key={ppc.id} ppc={ppc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" aria-hidden="true" />
            <p className="text-lg font-medium mb-2">No PPC entries found</p>
            <p className="text-sm mb-4">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn btn-primary" id="no-results-clear-btn">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
