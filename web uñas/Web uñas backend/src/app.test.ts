import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { createSchedule } from './services/schedule.service.js';
import type { CalendarGateway } from './services/calendar.service.js';
import type { BookingNotifier } from './services/email.service.js';

const env = loadEnv({
  GOOGLE_CLIENT_EMAIL: 'bot@proyecto.iam.gserviceaccount.com',
  GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n',
  GOOGLE_CALENDAR_ID: 'test@x.com',
});
const schedule = createSchedule(env.BUSINESS_UTC_OFFSET);
const calendar: CalendarGateway = {
  getBusyBlocks: async () => [{ start: '2030-01-05T11:00:00-06:00', end: '2030-01-05T12:00:00-06:00' }],
  createEvent: async () => ({ id: 'evt1', htmlLink: 'https://calendar.test/evt1' }),
};
const notified: Array<{ email: string; link?: string | undefined }> = [];
const notifier: BookingNotifier = {
  notifyBooking: async (b, link) => {
    notified.push({ email: b.customer.email, link });
  },
};

let base = '';
let close = () => {};
before(() => {
  const server = createApp({ env, calendar, schedule, notifier }).listen(0);
  base = `http://localhost:${(server.address() as AddressInfo).port}`;
  close = () => server.close();
});
after(() => close());

const customer = { name: 'Ana', email: 'ana@x.com', phone: '12345678' };
const post = (body: unknown) =>
  fetch(`${base}/api/book`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

describe('API', () => {
  it('GET /api/availability devuelve horarios', async () => {
    const res = await fetch(`${base}/api/availability?date=2030-01-05&duration=60`);
    assert.equal(res.status, 200);
    // 11:00-12:00 ocupado: 09:00 se devuelve pero marcado como no disponible.
    assert.deepEqual(((await res.json()) as { slots: unknown[] }).slots, [
      { time: '09:00', available: false },
      { time: '12:00', available: true },
      { time: '15:00', available: true },
    ]);
  });
  it('rechaza fecha inválida con 400', async () => {
    assert.equal((await fetch(`${base}/api/availability?date=hoy`)).status, 400);
  });
  it('POST /api/book crea la cita (201) y detecta choques (409)', async () => {
    assert.equal((await post({ date: '2030-01-05', startTime: '12:00', endTime: '15:00', customer })).status, 201);
    // 09:00-12:00 solapa con el evento ocupado de 11:00 a 12:00.
    assert.equal((await post({ date: '2030-01-05', startTime: '09:00', endTime: '12:00', customer })).status, 409);
  });
  it('envía correos solo cuando la cita se crea', () => {
    assert.deepEqual(notified, [{ email: 'ana@x.com', link: 'https://calendar.test/evt1' }]);
  });
  it('POST /api/book valida el cliente', async () => {
    assert.equal((await post({ date: '2030-01-05', startTime: '09:00', endTime: '10:00', customer: { name: '' } })).status, 400);
  });
  it('ruta desconocida -> 404', async () => {
    assert.equal((await fetch(`${base}/nada`)).status, 404);
  });
});
