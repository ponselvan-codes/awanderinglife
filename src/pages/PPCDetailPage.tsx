import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Truck,
  Hash,
  Tag,
  FileText,
  ZoomIn,
  Stamp,
  Info,
} from 'lucide-react';
import { getPPCById, formatDate, getPPCStatus, getImageSrc } from '../lib/utils';
import StatusBadge from '../components/ui/StatusBadge';
import ImageModal from '../components/ui/ImageModal';

export default function PPCDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ppc = id ? getPPCById(id) : undefined;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  if (!ppc) {
    return (
      <div className="container-main py-20 text-center">
        <Stamp className="w-16 h-16 mx-auto mb-4 text-gray-300" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-[var(--color-charcoal)] mb-2">PPC Not Found</h1>
        <p className="text-[var(--color-text-muted)] mb-6">
          The PPC entry "{id}" could not be found.
        </p>
        <Link to="/collection" className="btn btn-primary" id="back-to-collection-btn">
          ← Back to Collection
        </Link>
      </div>
    );
  }

  const status = getPPCStatus(ppc);

  // Build image list
  const images = [
    ppc.primaryImage && {
      src: getImageSrc(ppc.primaryImage),
      alt: `PPC cancellation for ${ppc.title}`,
      caption: 'PPC Cancellation',
    },
    ppc.postcardFrontImage && {
      src: getImageSrc(ppc.postcardFrontImage),
      alt: `Postcard front – ${ppc.title}`,
      caption: 'Postcard Front',
    },
    ppc.postcardBackImage && {
      src: getImageSrc(ppc.postcardBackImage),
      alt: `Postcard back – ${ppc.title}`,
      caption: 'Postcard Back',
    },
  ].filter(Boolean) as { src: string; alt: string; caption: string }[];

  function openModal(index: number) {
    setModalIndex(index);
    setModalOpen(true);
  }

  return (
    <div>
      {/* Back nav */}
      <div className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] py-3">
        <div className="container-main">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-crimson)] transition-fast"
            id="back-btn"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Collection
          </button>
        </div>
      </div>

      <div className="container-main py-8">
        {/* Demo data notice */}
        {(ppc.description?.includes('DEMO DATA') || ppc.notes?.includes('DEMO DATA')) && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-amber-800">
              <strong>Demo Entry:</strong> This is demonstration data. Replace with your actual collection information.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images */}
          <div className="lg:col-span-1 space-y-4">
            {/* Primary image */}
            {ppc.primaryImage ? (
              <div className="relative group">
                <button
                  onClick={() => openModal(0)}
                  className="block w-full rounded-xl overflow-hidden shadow-lg stamp-border cursor-zoom-in"
                  aria-label="Click to enlarge PPC cancellation image"
                  id="primary-image-btn"
                >
                  <img
                    src={getImageSrc(ppc.primaryImage)}
                    alt={`PPC cancellation for ${ppc.title}`}
                    className="w-full object-cover group-hover:scale-102 transition-slow"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-fast flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-fast" aria-hidden="true" />
                  </div>
                </button>
                <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">
                  PPC Cancellation Impression
                </p>
              </div>
            ) : (
              <div className="image-placeholder rounded-xl h-64 stamp-border">
                <Stamp className="w-12 h-12 opacity-30" />
                <span className="text-sm opacity-60 px-6 text-center">No cancellation image available</span>
              </div>
            )}

            {/* Postcard images */}
            {(ppc.postcardFrontImage || ppc.postcardBackImage) && (
              <div className="grid grid-cols-2 gap-3">
                {ppc.postcardFrontImage && (
                  <div className="relative group">
                    <button
                      onClick={() => openModal(images.findIndex(img => img.caption === 'Postcard Front'))}
                      className="block w-full rounded-lg overflow-hidden border-2 border-[var(--color-border)] cursor-zoom-in"
                      aria-label="Click to enlarge postcard front image"
                      id="postcard-front-btn"
                    >
                      <img
                        src={getImageSrc(ppc.postcardFrontImage)}
                        alt={`Postcard front – ${ppc.title}`}
                        className="w-full object-cover aspect-[3/2]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-fast" />
                    </button>
                    <p className="text-center text-xs text-[var(--color-text-muted)] mt-1">Front</p>
                  </div>
                )}
                {ppc.postcardBackImage && (
                  <div className="relative group">
                    <button
                      onClick={() => openModal(images.findIndex(img => img.caption === 'Postcard Back'))}
                      className="block w-full rounded-lg overflow-hidden border-2 border-[var(--color-border)] cursor-zoom-in"
                      aria-label="Click to enlarge postcard back image"
                      id="postcard-back-btn"
                    >
                      <img
                        src={getImageSrc(ppc.postcardBackImage)}
                        alt={`Postcard back – ${ppc.title}`}
                        className="w-full object-cover aspect-[3/2]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-fast" />
                    </button>
                    <p className="text-center text-xs text-[var(--color-text-muted)] mt-1">Back</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title + status */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-sm font-mono text-[var(--color-text-muted)] bg-[var(--color-cream-dark)] px-2 py-0.5 rounded">
                  {ppc.id}
                </span>
                {ppc.theme && (
                  <span className="text-sm text-[var(--color-gold)] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {ppc.theme}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-serif text-[var(--color-charcoal)] mb-3">
                {ppc.title}
              </h1>
              <StatusBadge status={status} size="lg" />
            </div>

            {/* Location grid */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
                Post Office Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Post Office', value: ppc.postOffice, icon: MapPin },
                  { label: 'District', value: ppc.district, icon: MapPin },
                  { label: 'State', value: ppc.state, icon: MapPin },
                  { label: 'PIN Code', value: ppc.pinCode || '—', icon: Hash },
                  { label: 'Subject', value: ppc.subject || '—', icon: Tag },
                  {
                    label: 'Inauguration Date',
                    value: formatDate(ppc.inaugurationDate),
                    icon: Calendar,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-[var(--color-crimson)] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="text-xs text-[var(--color-text-muted)] mb-0.5">{label}</div>
                      <div className="text-sm font-medium text-[var(--color-charcoal)]">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collection status */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
                Collection Status
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] mb-1">Requested</div>
                  <div className="font-medium">
                    {ppc.requested ? (
                      <span className="text-orange-600">✓ Yes</span>
                    ) : (
                      <span className="text-slate-400">No</span>
                    )}
                  </div>
                  {ppc.requestedDate && (
                    <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {formatDate(ppc.requestedDate)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] mb-1">Received</div>
                  <div className="font-medium">
                    {ppc.received ? (
                      <span className="text-green-600">✓ Yes</span>
                    ) : (
                      <span className="text-slate-400">No</span>
                    )}
                  </div>
                  {ppc.receivedDate && (
                    <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {formatDate(ppc.receivedDate)}
                    </div>
                  )}
                </div>
                {ppc.trackingNumber && (
                  <div>
                    <div className="text-xs text-[var(--color-text-muted)] mb-1 flex items-center gap-1">
                      <Truck className="w-3 h-3" aria-hidden="true" />
                      Tracking Number
                    </div>
                    <div className="font-mono text-sm">{ppc.trackingNumber}</div>
                  </div>
                )}
                {ppc.requestMethod && (
                  <div>
                    <div className="text-xs text-[var(--color-text-muted)] mb-1">Request Method</div>
                    <div className="text-sm font-medium">{ppc.requestMethod}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {ppc.description && (
              <div className="card p-5">
                <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  Description
                </h2>
                <p className="text-sm text-[var(--color-charcoal)] leading-relaxed whitespace-pre-line">
                  {ppc.description}
                </p>
              </div>
            )}

            {/* Notes */}
            {ppc.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" aria-hidden="true" />
                  Collection Notes
                </h2>
                <p className="text-sm text-amber-900 leading-relaxed">{ppc.notes}</p>
              </div>
            )}

            {/* Related nav */}
            <div className="flex gap-3">
              <Link
                to={`/collection?state=${encodeURIComponent(ppc.state)}`}
                className="btn btn-secondary text-sm"
                id="view-state-btn"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                More from {ppc.state}
              </Link>
              <Link
                to={`/collection?filter=${status}`}
                className="btn btn-ghost text-sm border border-[var(--color-border)]"
                id="view-status-btn"
              >
                Similar status
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image modal */}
      {modalOpen && images.length > 0 && (
        <ImageModal
          images={images}
          currentIndex={modalIndex}
          onClose={() => setModalOpen(false)}
          onPrev={() => setModalIndex((i) => (i - 1 + images.length) % images.length)}
          onNext={() => setModalIndex((i) => (i + 1) % images.length)}
        />
      )}
    </div>
  );
}
