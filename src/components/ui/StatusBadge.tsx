import type { PPCStatus } from '../../types';
import { getStatusLabel } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: PPCStatus;
  size?: 'sm' | 'md' | 'lg';
}

const badgeClass = {
  'received': 'badge-received',
  'requested-awaiting': 'badge-awaiting',
  'not-requested': 'badge-not-requested',
} as const;

const dotClass = {
  'received': 'bg-green-500',
  'requested-awaiting': 'bg-orange-500',
  'not-requested': 'bg-slate-400',
} as const;

const sizeClass = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
} as const;

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={cn('badge', badgeClass[status], sizeClass[size])}
      role="status"
      aria-label={`Collection status: ${getStatusLabel(status)}`}
    >
      <span
        className={cn('w-2 h-2 rounded-full inline-block flex-shrink-0', dotClass[status])}
        aria-hidden="true"
      />
      {getStatusLabel(status)}
    </span>
  );
}
