import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { createCalendarClient } from './lib/google-calendar.js';
import { GoogleCalendarService } from './services/calendar.service.js';
import { createNotifier } from './services/email.service.js';
import { createSchedule } from './services/schedule.service.js';

const env = loadEnv();
const schedule = createSchedule(env.BUSINESS_UTC_OFFSET);
const googleCalendar = createCalendarClient({
  clientEmail: env.GOOGLE_CLIENT_EMAIL,
  privateKey: env.GOOGLE_PRIVATE_KEY,
});
const app = createApp({
  env,
  schedule,
  calendar: new GoogleCalendarService(googleCalendar, env, schedule),
  notifier: createNotifier(env),
});

const server = app.listen(env.PORT, () => {
  console.log(`booking-api escuchando en http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} recibido, cerrando...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
