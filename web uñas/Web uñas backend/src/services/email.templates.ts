import { BUSINESS } from '../config/business.js';
import type { BookingInput } from '../types/index.js';

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

/** Los datos del cliente son texto libre: se escapan antes de entrar al HTML. */
export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** "2026-11-14" -> "sábado, 14 de noviembre de 2026" */
export const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('es-SV', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));

const layout = (title: string, intro: string, rows: Array<[string, string]>, footer: string): string => `
<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#faf7fc;font-family:Arial,Helvetica,sans-serif;color:#3d2347;">
    <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #eddff2;border-radius:12px;">
      <tr><td style="padding:28px 28px 8px;">
        <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#d4af37;">${escapeHtml(BUSINESS.name)}</p>
        <h1 style="margin:8px 0 12px;font-size:22px;color:#4a2d55;">${escapeHtml(title)}</h1>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.5;">${intro}</p>
      </td></tr>
      <tr><td style="padding:0 28px 20px;">
        <table role="presentation" width="100%" style="border-top:1px solid #eddff2;font-size:14px;">
          ${rows
            .map(
              ([label, value]) =>
                `<tr><td style="padding:10px 0;color:#8b5a9c;width:120px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:10px 0;font-weight:bold;">${value}</td></tr>`,
            )
            .join('')}
        </table>
      </td></tr>
      <tr><td style="padding:0 28px 28px;font-size:13px;color:#7a4a8a;line-height:1.5;">${footer}</td></tr>
    </table>
  </body>
</html>`;

const when = ({ date, startTime, endTime }: BookingInput): string =>
  `${formatDate(date)}, de ${startTime} a ${endTime}`;

/** Confirmación para la clienta. */
export const clientEmail = (booking: BookingInput): EmailContent => {
  const { customer } = booking;
  const rows: Array<[string, string]> = [
    ['Fecha y hora', escapeHtml(when(booking))],
    ...(customer.service ? [['Servicio', escapeHtml(customer.service)] as [string, string]] : []),
  ];
  return {
    subject: `Tu cita en ${BUSINESS.name} está confirmada`,
    html: layout(
      '¡Cita confirmada!',
      `Hola ${escapeHtml(customer.name)}, tu cita quedó registrada.`,
      rows,
      'Si necesitas cambiar o cancelar tu cita, responde a este correo o escríbenos por WhatsApp.',
    ),
    text: [
      `Hola ${customer.name}, tu cita en ${BUSINESS.name} está confirmada.`,
      `Fecha y hora: ${when(booking)}`,
      customer.service ? `Servicio: ${customer.service}` : '',
      'Si necesitas cambiar o cancelar tu cita, responde a este correo.',
    ]
      .filter(Boolean)
      .join('\n'),
  };
};

/** Aviso de nueva reserva para el dueño. */
export const ownerEmail = (booking: BookingInput, eventLink?: string): EmailContent => {
  const { customer } = booking;
  const rows: Array<[string, string]> = [
    ['Fecha y hora', escapeHtml(when(booking))],
    ['Cliente', escapeHtml(customer.name)],
    ['Correo', escapeHtml(customer.email)],
    ['Teléfono', escapeHtml(customer.phone)],
    ...(customer.service ? [['Servicio', escapeHtml(customer.service)] as [string, string]] : []),
    ...(customer.notes ? [['Notas', escapeHtml(customer.notes)] as [string, string]] : []),
  ];
  const link = eventLink
    ? `<a href="${escapeHtml(eventLink)}" style="color:#7a4a8a;">Ver en Google Calendar</a>`
    : 'La cita ya está en tu Google Calendar.';
  return {
    subject: `Nueva cita: ${customer.name} - ${formatDate(booking.date)} ${booking.startTime}`,
    html: layout('Nueva cita reservada', 'Se registró una nueva reserva desde la web.', rows, link),
    text: [
      'Nueva cita reservada desde la web.',
      `Fecha y hora: ${when(booking)}`,
      `Cliente: ${customer.name}`,
      `Correo: ${customer.email}`,
      `Teléfono: ${customer.phone}`,
      customer.service ? `Servicio: ${customer.service}` : '',
      customer.notes ? `Notas: ${customer.notes}` : '',
      eventLink ? `Calendario: ${eventLink}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  };
};
