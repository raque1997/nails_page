import nodemailer from 'nodemailer';
import { BUSINESS } from '../config/business.js';
import type { Env } from '../config/env.js';
import type { BookingInput } from '../types/index.js';
import { clientEmail, ownerEmail } from './email.templates.js';

/** Contrato que usa el controlador. Implementaciones: Gmail, o ninguna (correo desactivado). */
export interface BookingNotifier {
  /** Nunca lanza: un fallo de correo no debe invalidar una cita ya creada. */
  notifyBooking(booking: BookingInput, eventLink?: string): Promise<void>;
}

/** Subconjunto de nodemailer que necesitamos (facilita las pruebas). */
export interface MailTransport {
  sendMail(message: {
    from: string;
    to: string;
    replyTo?: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<unknown>;
}

export class GmailNotifier implements BookingNotifier {
  constructor(
    private readonly transport: MailTransport,
    private readonly from: string,
    private readonly ownerAddress: string,
  ) {}

  async notifyBooking(booking: BookingInput, eventLink?: string): Promise<void> {
    const sender = `"${BUSINESS.name}" <${this.from}>`;
    const client = clientEmail(booking);
    const owner = ownerEmail(booking, eventLink);

    // Se envían por separado: si falla uno, el otro igual sale.
    const results = await Promise.allSettled([
      this.transport.sendMail({ from: sender, to: booking.customer.email, replyTo: this.ownerAddress, ...client }),
      this.transport.sendMail({ from: sender, to: this.ownerAddress, replyTo: booking.customer.email, ...owner }),
    ]);

    const labels = ['cliente', 'dueño'];
    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`No se pudo enviar el correo al ${labels[i]}:`, r.reason);
    });
  }
}

/** Se usa cuando faltan las variables de correo: la reserva sigue funcionando. */
export class DisabledNotifier implements BookingNotifier {
  async notifyBooking(): Promise<void> {}
}

export const createNotifier = (env: Env): BookingNotifier => {
  const { GMAIL_USER, GMAIL_APP_PASSWORD, OWNER_EMAIL } = env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !OWNER_EMAIL) {
    console.warn('Correo desactivado: define GMAIL_USER, GMAIL_APP_PASSWORD y OWNER_EMAIL.');
    return new DisabledNotifier();
  }
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
  return new GmailNotifier(transport, GMAIL_USER, OWNER_EMAIL);
};
