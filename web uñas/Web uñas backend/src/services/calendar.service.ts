import type { calendar_v3 } from 'googleapis';
import type { Env } from '../config/env.js';
import { HttpError } from '../middleware/errors.js';

interface GoogleApiError {
  response?: { data?: unknown };
}
import type { BookingInput, BusyBlock, DateString } from '../types/index.js';
import type { Schedule } from './schedule.service.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Contrato que usan los controladores; permite sustituirlo por un doble en pruebas. */
export interface CalendarGateway {
  getBusyBlocks(date: DateString): Promise<BusyBlock[]>;
  createEvent(input: BookingInput): Promise<{ id: string; htmlLink?: string | undefined }>;
}

export class GoogleCalendarService implements CalendarGateway {
  constructor(
    private readonly calendar: calendar_v3.Calendar,
    private readonly env: Env,
    private readonly schedule: Schedule,
  ) {}

  async getBusyBlocks(date: DateString): Promise<BusyBlock[]> {
    const dayStart = this.schedule.toIso(date, '00:00');
    const { data } = await this.calendar.freebusy.query({
      requestBody: {
        timeMin: dayStart,
        timeMax: new Date(Date.parse(dayStart) + DAY_MS).toISOString(),
        timeZone: this.env.BUSINESS_TIMEZONE,
        items: [{ id: this.env.GOOGLE_CALENDAR_ID }],
      },
    });
    const entry = data.calendars?.[this.env.GOOGLE_CALENDAR_ID];
    if (entry?.errors?.length) {
      throw new Error(`Google Calendar freebusy: ${entry.errors[0]?.reason ?? 'sin acceso'}`);
    }
    return (entry?.busy ?? []).flatMap((b) => (b.start && b.end ? [{ start: b.start, end: b.end }] : []));
  }

  async createEvent({ date, startTime, endTime, customer }: BookingInput) {
    const description = [
      `Cliente: ${customer.name}`,
      `Correo: ${customer.email}`,
      `Teléfono: ${customer.phone}`,
      customer.service && `Servicio: ${customer.service}`,
      customer.notes && `Notas: ${customer.notes}`,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const { data } = await this.calendar.events.insert({
        calendarId: this.env.GOOGLE_CALENDAR_ID,
        requestBody: {
          summary: `Cita - ${customer.name}${customer.service ? ` (${customer.service})` : ''}`,
          description,
          // RFC3339 con offset (p. ej. 2026-11-07T14:00:00-06:00) y zona horaria explícita
          start: { dateTime: this.schedule.toIso(date, startTime), timeZone: this.env.BUSINESS_TIMEZONE },
          end: { dateTime: this.schedule.toIso(date, endTime), timeZone: this.env.BUSINESS_TIMEZONE },
          // Respaldo: Google avisa al dueño del calendario antes de la cita
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'email', minutes: 60 },
              { method: 'popup', minutes: 30 },
            ],
          },
        },
      });
      return { id: data.id ?? '', htmlLink: data.htmlLink ?? undefined };
    } catch (error) {
      // Solo el motivo de Google va al log; el cliente recibe un mensaje genérico.
      console.error('events.insert falló:', (error as GoogleApiError).response?.data ?? error);
      throw new HttpError(500, 'No se pudo registrar la cita en Google Calendar.');
    }
  }
}
