import { useState, useMemo } from 'react';
import { Image as ImageIcon, Search, ZoomIn, Stamp, BookOpen } from 'lucide-react';
import { getAllPPCs, getAllPassports, getImageSrc } from '../lib/utils';
import ImageModal from '../components/ui/ImageModal';
import { cn } from '../lib/utils';

type ImageType = 'all' | 'ppc' | 'postcard' | 'passport';

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  type: 'ppc' | 'postcard' | 'passport';
  state: string;
  year: string;
  id: string;
  label: string;
}

export default function GalleryPage() {
  const allPPCs = getAllPPCs();
  const allPassports = getAllPassports();

  const [typeFilter, setTypeFilter] = useState<ImageType>('all');
  const [selectedState, setSelectedState] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // Build gallery images
  const allImages: GalleryImage[] = useMemo(() => {
    const imgs: GalleryImage[] = [];

    for (const ppc of allPPCs) {
      if (ppc.primaryImage) {
        imgs.push({
          src: getImageSrc(ppc.primaryImage),
          alt: `PPC – ${ppc.title}`,
          caption: ppc.title,
          type: 'ppc',
          state: ppc.state,
          year: ppc.inaugurationDate ? ppc.inaugurationDate.substring(0, 4) : '',
          id: `${ppc.id}-ppc`,
          label: ppc.postOffice,
        });
      }
      if (ppc.postcardFrontImage) {
        imgs.push({
          src: getImageSrc(ppc.postcardFrontImage),
          alt: `Postcard front – ${ppc.title}`,
          caption: `${ppc.title} – Postcard Front`,
          type: 'postcard',
          state: ppc.state,
          year: ppc.receivedDate ? ppc.receivedDate.substring(0, 4) : '',
          id: `${ppc.id}-front`,
          label: ppc.postOffice,
        });
      }
      if (ppc.postcardBackImage) {
        imgs.push({
          src: getImageSrc(ppc.postcardBackImage),
          alt: `Postcard back – ${ppc.title}`,
          caption: `${ppc.title} – Postcard Back`,
          type: 'postcard',
          state: ppc.state,
          year: ppc.receivedDate ? ppc.receivedDate.substring(0, 4) : '',
          id: `${ppc.id}-back`,
          label: ppc.postOffice,
        });
      }
    }

    for (const passport of allPassports) {
      if (passport.image) {
        imgs.push({
          src: getImageSrc(passport.image),
          alt: `${passport.sealType} – ${passport.event}`,
          caption: `${passport.event}, ${passport.city}`,
          type: 'passport',
          state: passport.state,
          year: passport.date ? passport.date.substring(0, 4) : '',
          id: passport.id,
          label: passport.venue,
        });
      }
    }

    return imgs;
  }, [allPPCs, allPassports]);

  const states = [...new Set(allImages.map((i) => i.state).filter(Boolean))].sort();
  const years = [...new Set(allImages.map((i) => i.year).filter(Boolean))].sort((a, b) => b.localeCompare(a));

  const filtered = useMemo(() => {
    let list = [...allImages];
    if (typeFilter !== 'all') list = list.filter((i) => i.type === typeFilter);
    if (selectedState) list = list.filter((i) => i.state === selectedState);
    if (selectedYear) list = list.filter((i) => i.year === selectedYear);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.caption.toLowerCase().includes(q) ||
          i.state.toLowerCase().includes(q) ||
          i.label.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allImages, typeFilter, selectedState, selectedYear, query]);

  const modalImages = filtered.map((i) => ({ src: i.src, alt: i.alt, caption: i.caption }));

  function openModal(index: number) {
    setModalIndex(index);
    setModalOpen(true);
  }

  function clearFilters() {
    setTypeFilter('all');
    setSelectedState('');
    setSelectedYear('');
    setQuery('');
  }

  const typeLabels: Record<string, string> = {
    ppc: 'PPC Cancellations',
    postcard: 'Postcards',
    passport: 'Passport Seals',
  };

  return (
    <div>
      {/* Header */}
      <div className="page-title-band">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon className="w-8 h-8 text-[var(--color-gold-light)]" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold font-serif">Image Gallery</h1>
          </div>
          <p className="text-gray-300">
            {allImages.length} images from the collection
          </p>
        </div>
      </div>

      <div className="container-main py-8">
        {/* Filters */}
        <div className="filter-panel mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" aria-hidden="true" />
              <input
                type="search"
                id="gallery-search"
                className="input pl-9"
                placeholder="Search by title, state, post office…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search gallery"
              />
            </div>

            {/* State */}
            <select
              id="gallery-state"
              className="input select min-w-[160px]"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              aria-label="Filter by state"
            >
              <option value="">All States</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Year */}
            <select
              id="gallery-year"
              className="input select min-w-[120px]"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              aria-label="Filter by year"
            >
              <option value="">All Years</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Type filter */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'ppc', 'postcard', 'passport'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-fast border',
                  typeFilter === type
                    ? 'bg-[var(--color-crimson)] text-white border-[var(--color-crimson)]'
                    : 'bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-crimson)]'
                )}
                id={`gallery-type-${type}`}
              >
                {type === 'all' && <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />}
                {type === 'ppc' && <Stamp className="w-3.5 h-3.5" aria-hidden="true" />}
                {type === 'passport' && <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />}
                {type === 'all' ? 'All Images' : typeLabels[type]}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          Showing <strong className="text-[var(--color-charcoal)]">{filtered.length}</strong> of {allImages.length} images
        </p>

        {/* Gallery grid */}
        {filtered.length > 0 ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((img, index) => (
              <button
                key={img.id}
                onClick={() => openModal(index)}
                className="break-inside-avoid block w-full group relative overflow-hidden rounded-xl shadow-md cursor-zoom-in transition-fast hover:shadow-xl hover:scale-[1.02]"
                aria-label={`View enlarged: ${img.alt}`}
                id={`gallery-img-${img.id}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full object-cover block"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-fast">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-medium line-clamp-2">{img.caption}</p>
                    <p className="text-gray-300 text-xs">{img.state}</p>
                  </div>
                  <ZoomIn className="absolute top-2 right-2 w-5 h-5 text-white" aria-hidden="true" />
                </div>
                {/* Type label */}
                <div className="absolute top-2 left-2">
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded font-medium',
                    img.type === 'ppc' ? 'bg-[var(--color-crimson)] text-white' :
                    img.type === 'postcard' ? 'bg-[var(--color-gold)] text-white' :
                    'bg-[var(--color-charcoal)] text-white'
                  )}>
                    {img.type === 'ppc' ? 'PPC' : img.type === 'postcard' ? 'Postcard' : 'Passport'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" aria-hidden="true" />
            <p className="text-lg font-medium mb-2">No images found</p>
            <p className="text-sm mb-4">Try adjusting your filters. Images appear here when uploaded to the repository.</p>
            <button onClick={clearFilters} className="btn btn-primary" id="gallery-clear-btn">Clear filters</button>
          </div>
        )}
      </div>

      {/* Modal */}
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
