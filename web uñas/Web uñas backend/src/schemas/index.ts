import { z } from 'zod';

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => {
    const ms = Date.parse(`${v}T12:00:00Z`);
    return !Number.isNaN(ms) && new Date(ms).toISOString().startsWith(v);
  }, 'Fecha inexistente');

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:mm');

// `duration` ya no se usa (la duración es fija): zod lo descarta, así clientes antiguos
// que aún lo envíen no reciben un 400.
export const availabilityQuery = z.object({ date });

export const bookingBody = z.object({
  date,
  startTime: time,
  endTime: time,
  customer: z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(150),
    phone: z.string().trim().min(5).max(30),
    service: z.string().trim().max(100).optional(),
    notes: z.string().trim().max(500).optional(),
  }),
});
