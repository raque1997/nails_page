/** Reglas del negocio (no son secretos, por eso viven en código). */
export const BUSINESS = {
  name: 'Pretty Nails',
  workStart: '09:00',
  workEnd: '18:00',
  /** Duración estricta de cada cita (3 h). Es también el paso de la cuadrícula: inicios 09:00, 12:00, 15:00. */
  appointmentMinutes: 180,
  slotIntervalMinutes: 180,
  /** 0 = domingo ... 6 = sábado. Solo sábados y domingos. */
  workDays: [0, 6],
  maxDurationMinutes: 8 * 60,
} as const;
