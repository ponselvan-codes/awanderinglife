import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';
import type { PPCRecord, PassportRecord, CollectionStats, PPCStatus } from '../types';
import ppcData from '../data/ppc.json';
import passportData from '../data/passport.json';

type ImportedPPCRecord = (typeof ppcData)[number];

function normalizePPCRecord(record: ImportedPPCRecord): PPCRecord {
  return {
    id: typeof record.id === 'number'
      ? `PPC-${String(record.id).padStart(4, '0')}`
      : record.id,
    title: record.title ?? '',
    postOffice: record.postOffice ?? '',
    district: record.district ?? '',
    state: record.state ?? '',
    pinCode: record.pinCode ?? '',
    subject: record.subject ?? '',
    theme: record.theme ?? '',
    inaugurationDate: record.inaugurationDate ?? '',
    requested: record.requested ?? false,
    requestedDate: record.requestedDate ?? '',
    received: record.received ?? false,
    receivedDate: record.receivedDate ?? '',
    trackingNumber: record.trackingNumber ?? '',
    requestMethod: record.requestMethod ?? '',
    primaryImage: record.primaryImage ?? '',
    postcardFrontImage: record.postcardFrontImage ?? '',
    postcardBackImage: record.postcardBackImage ?? '',
    description: record.description ?? '',
    notes: record.notes ?? '',
  };
}

const ppcRecords = ppcData.map(normalizePPCRecord);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const parsed = parseISO(dateStr);
    if (!isValid(parsed)) return '—';
    return format(parsed, 'dd MMM yyyy');
  } catch {
    return '—';
  }
}

export function getPPCStatus(ppc: PPCRecord): PPCStatus {
  if (ppc.received) return 'received';
  if (ppc.requested) return 'requested-awaiting';
  return 'not-requested';
}

export function getStatusLabel(status: PPCStatus): string {
  switch (status) {
    case 'received':
      return 'Received';
    case 'requested-awaiting':
      return 'Requested – Awaiting Receipt';
    case 'not-requested':
      return 'Not Requested';
  }
}

export function getAllPPCs(): PPCRecord[] {
  return ppcRecords;
}

export function getPPCById(id: string): PPCRecord | undefined {
  return ppcRecords.find((p) => p.id === id);
}

export function getAllPassports(): PassportRecord[] {
  return passportData as PassportRecord[];
}

export function getCollectionStats(): CollectionStats {
  const ppcs = getAllPPCs();
  const passports = getAllPassports();
  return {
    total: ppcs.length,
    received: ppcs.filter((p) => p.received).length,
    requestedAwaiting: ppcs.filter((p) => p.requested && !p.received).length,
    notRequested: ppcs.filter((p) => !p.requested && !p.received).length,
    withImages: ppcs.filter((p) => !!p.primaryImage).length,
    passportSeals: passports.length,
  };
}

export function getUniqueStates(): string[] {
  const ppcs = getAllPPCs();
  return [...new Set(ppcs.map((p) => p.state))].sort();
}

export function getUniqueThemes(): string[] {
  const ppcs = getAllPPCs();
  return [...new Set(ppcs.map((p) => p.theme))].sort();
}

export function getUniqueYears(): string[] {
  const ppcs = getAllPPCs();
  return [
    ...new Set(
      ppcs
        .filter((p) => p.inaugurationDate)
        .map((p) => p.inaugurationDate.substring(0, 4))
    ),
  ].sort((a, b) => b.localeCompare(a));
}

export function getRecentlyReceived(limit = 5): PPCRecord[] {
  return getAllPPCs()
    .filter((p) => p.received && p.receivedDate)
    .sort((a, b) => b.receivedDate.localeCompare(a.receivedDate))
    .slice(0, limit);
}

export function getRecentlyAdded(limit = 5): PPCRecord[] {
  return getAllPPCs()
    .filter((p) => p.inaugurationDate)
    .sort((a, b) => b.inaugurationDate.localeCompare(a.inaugurationDate))
    .slice(0, limit);
}

export function getStateStats(): Record<
  string,
  { total: number; received: number; requestedAwaiting: number; notRequested: number }
> {
  const ppcs = getAllPPCs();
  const stats: Record<
    string,
    { total: number; received: number; requestedAwaiting: number; notRequested: number }
  > = {};
  for (const ppc of ppcs) {
    if (!stats[ppc.state]) {
      stats[ppc.state] = { total: 0, received: 0, requestedAwaiting: 0, notRequested: 0 };
    }
    stats[ppc.state].total++;
    const status = getPPCStatus(ppc);
    if (status === 'received') stats[ppc.state].received++;
    else if (status === 'requested-awaiting') stats[ppc.state].requestedAwaiting++;
    else stats[ppc.state].notRequested++;
  }
  return stats;
}

export function hasImage(ppc: PPCRecord): boolean {
  return !!(ppc.primaryImage || ppc.postcardFrontImage || ppc.postcardBackImage);
}

export function getImageSrc(path: string): string {
  if (!path) return '';
  // Resolve relative to base – works for both dev and GH Pages
  return path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;
}
