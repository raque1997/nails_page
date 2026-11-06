import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import type { BookingInput } from '../types/index.js';
import { GmailNotifier, type MailTransport } from './email.service.js';
import { clientEmail, escapeHtml, ownerEmail } from './email.templates.js';

const booking: BookingInput = {
  date: '2030-01-05',
  startTime: '09:00',
  endTime: '11:00',
  customer: { name: 'Ana <script>alert(1)</script>', email: 'ana@x.com', phone: '7777', service: 'Polygel' },
};

describe('plantillas', () => {
  it('escapan el HTML del cliente', () => {
    assert.equal(escapeHtml(`<b>"x"&'</b>`), '&lt;b&gt;&quot;x&quot;&amp;&#39;&lt;/b&gt;');
    assert.ok(!clientEmail(booking).html.includes('<script>'));
    assert.ok(!ownerEmail(booking).html.includes('<script>'));
  });
  it('incluyen fecha en español, hora y servicio', () => {
    const { html, subject } = clientEmail(booking);
    assert.match(html, /sábado, 5 de enero de 2030/);
    assert.match(html, /09:00 a 11:00/);
    assert.match(html, /Polygel/);
    assert.match(subject, /confirmada/);
  });
});

describe('GmailNotifier', () => {
  it('envía al cliente y al dueño', async () => {
    const sendMail = mock.fn<MailTransport['sendMail']>(async () => ({}));
    await new GmailNotifier({ sendMail }, 'yo@gmail.com', 'dueno@x.com').notifyBooking(booking);
    const to = sendMail.mock.calls.map((c) => c.arguments[0].to);
    assert.deepEqual(to, ['ana@x.com', 'dueno@x.com']);
  });
  it('si falla un correo, el otro sale y no lanza', async () => {
    const original = console.error;
    console.error = () => {};
    const sent: string[] = [];
    const transport: MailTransport = {
      sendMail: async (m) => {
        if (m.to === 'ana@x.com') throw new Error('SMTP caído');
        sent.push(m.to);
      },
    };
    await assert.doesNotReject(new GmailNotifier(transport, 'yo@gmail.com', 'dueno@x.com').notifyBooking(booking));
    console.error = original;
    assert.deepEqual(sent, ['dueno@x.com']);
  });
});
