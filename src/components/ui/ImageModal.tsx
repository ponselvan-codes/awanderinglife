import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  images: { src: string; alt: string; caption?: string }[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ImageModal({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: ImageModalProps) {
  const current = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  if (!current) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-[var(--color-gold-light)] transition-fast p-2"
          aria-label="Close image viewer"
          id="modal-close-btn"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image */}
        <img
          src={current.src}
          alt={current.alt}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />

        {/* Caption */}
        {current.caption && (
          <p className="mt-3 text-center text-white/80 text-sm">{current.caption}</p>
        )}

        {/* Navigation */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
            <button
              onClick={onPrev}
              className="pointer-events-auto bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-fast"
              aria-label="Previous image"
              id="modal-prev-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNext}
              className="pointer-events-auto bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-fast"
              aria-label="Next image"
              id="modal-next-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
