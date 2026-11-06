import { BUSINESS } from '../config/business.js';
import type { BusyBlock, DateString, SlotAvailability, TimeString } from '../types/index.js';

export const toMinutes = (time: TimeString): number => {
  const [h = 0, m = 0] = time.split(':').map(Number);
  return h * 60 + m;
};

export const toTime = (minutes: number): TimeString =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

/** Lógica pura de horarios: sin red ni estado, fácil de probar. */
export const createSchedule = (utcOffset: string) => {
  /** Fecha + hora local del negocio -> ISO con offset. */
  const toIso = (date: DateString, time: TimeString): string => `${date}T${time}:00${utcOffset}`;

  const isWorkDay = (date: DateString): boolean =>
    (BUSINESS.workDays as readonly number[]).includes(new Date(`${date}T12:00:00Z`).getUTCDay());

  const overlapsBusy = (startMs: number, endMs: number, busy: BusyBlock[]): boolean =>
    busy.some((b) => startMs < Date.parse(b.end) && endMs > Date.parse(b.start));

  /** true si [startTime, endTime) cabe en el horario, está en la cuadrícula, es futuro y no choca. */
  const isSlotFree = (
    date: DateString,
    startTime: TimeString,
    endTime: TimeString,
    busy: BusyBlock[],
    now: number = Date.now(),
  ): boolean => {
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);
    const open = toMinutes(BUSINESS.workStart);
    if (end <= start || start < open || end > toMinutes(BUSINESS.workEnd)) return false;
    if (end - start !== BUSINESS.appointmentMinutes) return false;
    if ((start - open) % BUSINESS.slotIntervalMinutes !== 0) return false;
    if (!isWorkDay(date)) return false;

    const startMs = Date.parse(toIso(date, startTime));
    const endMs = Date.parse(toIso(date, endTime));
    return startMs > now && !overlapsBusy(startMs, endMs, busy);
  };

  /**
   * Los bloques fijos del día (09:00, 12:00 y 15:00), cada uno con su disponibilidad.
   * `available` es false si choca con un evento ocupado (cualquier solape descarta el bloque
   * completo) o si ya empezó. En un día no laboral no hay bloques. La duración es la del negocio.
   */
  const daySlots = (
    date: DateString,
    busy: BusyBlock[],
    now: number = Date.now(),
    durationMinutes: number = BUSINESS.appointmentMinutes,
  ): SlotAvailability[] => {
    if (!isWorkDay(date)) return [];
    const slots: SlotAvailability[] = [];
    const last = toMinutes(BUSINESS.workEnd) - durationMinutes;
    for (let m = toMinutes(BUSINESS.workStart); m <= last; m += BUSINESS.slotIntervalMinutes) {
      slots.push({
        time: toTime(m),
        available: isSlotFree(date, toTime(m), toTime(m + durationMinutes), busy, now),
      });
    }
    return slots;
  };

  /** Solo las horas de inicio libres (la reserva y las pruebas usan esta vista). */
  const availableSlots = (
    date: DateString,
    busy: BusyBlock[],
    now: number = Date.now(),
  ): TimeString[] =>
    daySlots(date, busy, now)
      .filter((s) => s.available)
      .map((s) => s.time);

  return { toIso, isWorkDay, isSlotFree, daySlots, availableSlots };
};

export type Schedule = ReturnType<typeof createSchedule>;
