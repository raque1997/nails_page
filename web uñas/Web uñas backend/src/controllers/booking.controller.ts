import type { Request, Response } from 'express';
import { availabilityQuery, bookingBody } from '../schemas/index.js';
import { BUSINESS } from '../config/business.js';
import { HttpError } from '../middleware/errors.js';
import type { CalendarGateway } from '../services/calendar.service.js';
import type { BookingNotifier } from '../services/email.service.js';
import type { Schedule } from '../services/schedule.service.js';
import type { AvailabilityResponse, BookingResponse } from '../types/index.js';

export const createBookingController = (
  calendar: CalendarGateway,
  schedule: Schedule,
  notifier: BookingNotifier,
  timezone: string,
) => ({
  async availability(req: Request, res: Response<AvailabilityResponse>) {
    // La duración es fija (regla de negocio): cualquier `duration` del cliente se ignora.
    const { date } = availabilityQuery.parse(req.query);
    const busy = await calendar.getBusyBlocks(date);
    res.json({
      date,
      timezone,
      durationMinutes: BUSINESS.appointmentMinutes,
      slots: schedule.daySlots(date, busy),
    });
  },

  async book(req: Request, res: Response<BookingResponse>) {
    const input = bookingBody.parse(req.body);
    // Se reconsulta justo antes de insertar para evitar dobles reservas.
    const busy = await calendar.getBusyBlocks(input.date);
    if (!schedule.isSlotFree(input.date, input.startTime, input.endTime, busy)) {
      throw new HttpError(409, 'Ese horario ya no está disponible.');
    }
    const event = await calendar.createEvent(input);
    // La cita ya existe en Google: los correos no deben tumbar la respuesta (el notifier no lanza).
    await notifier.notifyBooking(input, event.htmlLink);
    res.status(201).json({
      eventId: event.id,
      htmlLink: event.htmlLink,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
    });
  },
});
