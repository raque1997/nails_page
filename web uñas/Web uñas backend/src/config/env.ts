import { z } from 'zod';

/** Trata "VAR=" (vacía) como no definida. */
const blankToUndefined = <T extends z.ZodType>(inner: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), inner.optional());

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(3001),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    GOOGLE_CLIENT_EMAIL: z.string().email(),
    GOOGLE_PRIVATE_KEY: z.string().includes('PRIVATE KEY', { message: 'No parece una llave privada' }),
    GOOGLE_CALENDAR_ID: z.string().min(1),
    // Correo (opcional: si falta alguno, la reserva funciona pero no se envían correos)
    GMAIL_USER: blankToUndefined(z.string().email()),
    GMAIL_APP_PASSWORD: blankToUndefined(
      // Google la muestra en bloques separados por espacios; se quitan
      z.string().transform((v) => v.replace(/\s+/g, '')),
    ),
    OWNER_EMAIL: blankToUndefined(z.string().email()),
    BUSINESS_TIMEZONE: z.string().default('America/El_Salvador'),
    BUSINESS_UTC_OFFSET: z
      .string()
      .regex(/^[+-]\d{2}:\d{2}$/, 'Formato esperado: -06:00')
      .default('-06:00'),
  });

export type Env = z.infer<typeof schema>;

/** Valida el entorno al arrancar: si falta algo, el proceso falla de inmediato y con un mensaje claro. */
export const loadEnv = (source: NodeJS.ProcessEnv = process.env): Env => {
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.') || 'env'}: ${i.message}`);
    throw new Error(`Variables de entorno inválidas:\n${issues.join('\n')}`);
  }
  return parsed.data;
};
