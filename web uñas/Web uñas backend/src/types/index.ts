/** YYYY-MM-DD, día calendario del negocio. */
export type DateString = string;
/** HH:mm (24h), hora local del negocio. */
export type TimeString = string;

/** Intervalo ocupado devuelto por freebusy (ISO 8601). */
export interface BusyBlock {
  start: string;
  end: string;
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  service?: string | undefined;
  notes?: string | undefined;
}

export interface BookingInput {
  date: DateString;
  startTime: TimeString;
  endTime: TimeString;
  customer: CustomerData;
}

export interface SlotAvailability {
  time: TimeString;
  available: boolean;
}

export interface AvailabilityResponse {
  date: DateString;
  timezone: string;
  durationMinutes: number;
  slots: SlotAvailability[];
}

export interface BookingResponse {
  eventId: string;
  htmlLink?: string | undefined;
  date: DateString;
  startTime: TimeString;
  endTime: TimeString;
}

export interface ApiErrorBody {
  error: string;
  details?: unknown;
}
