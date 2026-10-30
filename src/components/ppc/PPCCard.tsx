import type { PPCRecord } from '../../types';
import { getPPCStatus, getStatusLabel, formatDate, getImageSrc } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Stamp, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PPCCardProps {
  ppc: PPCRecord;
}

const statusBadgeClass = {
  'received': 'badge-received',
  'requested-awaiting': 'badge-awaiting',
  'not-requested': 'badge-not-requested',
} as const;

const statusDot = {
  'received': 'bg-green-500',
  'requested-awaiting': 'bg-orange-500',
  'not-requested': 'bg-slate-400',
} as const;

export default function PPCCard({ ppc }: PPCCardProps) {
  const status = getPPCStatus(ppc);
  const imageSrc = ppc.primaryImage ? getImageSrc(ppc.primaryImage) : '';

  return (
    <article className="card group flex flex-col h-full">
      {/* Image section */}
      <Link
        to={`/ppc/${ppc.id}`}
        className="block relative overflow-hidden"
        aria-label={`View details for ${ppc.title}`}
        tabIndex={0}
      >
        <div className="aspect-[4/3] overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={`PPC cancellation for ${ppc.title}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-slow"
              loading="lazy"
            />
          ) : (
            <div className="image-placeholder w-full h-full">
              <Stamp className="w-10 h-10 opacity-30" />
              <span className="text-xs px-4 text-center opacity-60">No image available</span>
            </div>
          )}
        </div>

        {/* Image count badge */}
        {(ppc.postcardFrontImage || ppc.postcardBackImage) && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <ImageIcon className="w-3 h-3" aria-hidden="true" />
            {[ppc.primaryImage, ppc.postcardFrontImage, ppc.postcardBackImage].filter(Boolean).length}
          </div>
        )}

        {/* Theme badge */}
        {ppc.theme && (
          <div className="absolute top-2 left-2 bg-[var(--color-charcoal)]/80 text-white text-xs px-2 py-0.5 rounded-full">
            {ppc.theme}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Status badge */}
        <div>
          <span className={cn('badge', statusBadgeClass[status])}>
            <span
              className={cn('w-1.5 h-1.5 rounded-full inline-block', statusDot[status])}
              aria-hidden="true"
            />
            {getStatusLabel(status)}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/ppc/${ppc.id}`}
          className="hover:text-[var(--color-crimson)] transition-fast"
        >
          <h2 className="font-bold text-[var(--color-charcoal)] text-sm leading-snug line-clamp-2">
            {ppc.title}
          </h2>
        </Link>

        {/* ID */}
        <p className="text-xs text-[var(--color-text-muted)] font-mono">{ppc.id}</p>

        {/* Meta */}
        <div className="space-y-1 text-xs text-[var(--color-text-muted)] mt-auto pt-2 border-t border-[var(--color-border)]">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--color-crimson)]" aria-hidden="true" />
            <span className="line-clamp-1">
              {ppc.postOffice}, {ppc.district}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--color-gold)]" aria-hidden="true" />
            <span>
              {ppc.state}
              {ppc.pinCode && (
                <span className="ml-1 text-gray-400">– {ppc.pinCode}</span>
              )}
            </span>
          </div>
          {ppc.inaugurationDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Inaugurated: {formatDate(ppc.inaugurationDate)}</span>
            </div>
          )}
          {status === 'received' && ppc.receivedDate && (
            <div className="flex items-center gap-1.5 text-green-700">
              <span>✓ Received: {formatDate(ppc.receivedDate)}</span>
            </div>
          )}
          {status === 'requested-awaiting' && ppc.requestedDate && (
            <div className="flex items-center gap-1.5 text-orange-700">
              <span>⏳ Requested: {formatDate(ppc.requestedDate)}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
