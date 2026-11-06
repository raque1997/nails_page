import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import type { Env } from './config/env.js';
import { createBookingController } from './controllers/booking.controller.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { createRouter } from './routes/index.js';
import type { CalendarGateway } from './services/calendar.service.js';
import type { BookingNotifier } from './services/email.service.js';
import type { Schedule } from './services/schedule.service.js';

interface AppDeps {
  env: Env;
  calendar: CalendarGateway;
  schedule: Schedule;
  notifier: BookingNotifier;
}

export const createApp = ({ env, calendar, schedule, notifier }: AppDeps) => {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // detrás de un proxy/hosting; necesario para que el rate limit use la IP real

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()), methods: ['GET', 'POST'] }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(
    '/api',
    rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false }),
    createRouter(createBookingController(calendar, schedule, notifier, env.BUSINESS_TIMEZONE)),
  );

  app.use(notFound);
  app.use(errorHandler);
  return app;
};
