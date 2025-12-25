export enum EventType {
  BIRTHDAY = 'BIRTHDAY',
  ANNIVERSARY = 'ANNIVERSARY',
  OTHER = 'OTHER'
}

export interface EventItem {
  id: string;
  name: string;
  date: string; // Format: YYYY-MM-DD
  type: EventType;
  notes?: string;
  isLunar?: boolean; // Future proofing, though strictly implementation is Solar for now
}

export interface SortOption {
  field: 'daysUntil' | 'name' | 'date';
  direction: 'asc' | 'desc';
}

export type ExportFormat = 'CSV' | 'TXT';