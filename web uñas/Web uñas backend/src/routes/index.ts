import { Router } from 'express';
import type { createBookingController } from '../controllers/booking.controller.js';

export const createRouter = (c: ReturnType<typeof createBookingController>) => {
  const router = Router();
  router.get('/availability', c.availability);
  router.post('/book', c.book);
  return router;
};
