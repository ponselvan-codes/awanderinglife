export interface PPCRecord {
  id: string;
  title: string;
  postOffice: string;
  district: string;
  state: string;
  pinCode: string;
  subject: string;
  theme: string;
  inaugurationDate: string;

  requested: boolean;
  requestedDate: string;
  received: boolean;
  receivedDate: string;

  trackingNumber: string;
  requestMethod: string;

  primaryImage: string;
  postcardFrontImage: string;
  postcardBackImage: string;

  description: string;
  notes: string;
}

export interface PassportRecord {
  id: string;
  title: string;
  event: string;
  venue: string;
  city: string;
  state: string;
  date: string;
  sealType: string;
  passportPage: string;
  image: string;
  description: string;
  notes: string;
}

export type PPCStatus = 'not-requested' | 'requested-awaiting' | 'received';

export function getPPCStatus(ppc: PPCRecord): PPCStatus {
  if (ppc.received) return 'received';
  if (ppc.requested) return 'requested-awaiting';
  return 'not-requested';
}

export interface CollectionStats {
  total: number;
  received: number;
  requestedAwaiting: number;
  notRequested: number;
  withImages: number;
  passportSeals: number;
}
