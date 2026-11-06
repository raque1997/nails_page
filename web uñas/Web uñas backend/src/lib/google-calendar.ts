import { google, type calendar_v3 } from 'googleapis';

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';

export interface GoogleCredentials {
  clientEmail: string;
  privateKey: string;
}

/**
 * Los .env guardan la llave en una línea con "\n" literales (y a veces entre comillas).
 * Los restauramos a saltos de línea reales o OpenSSL rechaza la llave.
 */
export const normalizePrivateKey = (key: string): string =>
  key.trim().replace(/^"|"$/g, '').replace(/\\n/g, '\n');

/** Crea el cliente de Google Calendar autenticado con una Service Account, sin leer archivos. */
export const createCalendarClient = ({
  clientEmail,
  privateKey,
}: GoogleCredentials): calendar_v3.Calendar => {
  if (!clientEmail || !privateKey) {
    throw new Error('Faltan GOOGLE_CLIENT_EMAIL o GOOGLE_PRIVATE_KEY.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: normalizePrivateKey(privateKey),
    },
    scopes: [CALENDAR_SCOPE],
  });

  return google.calendar({ version: 'v3', auth });
};
