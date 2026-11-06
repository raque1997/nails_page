import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import type { ApiErrorBody } from '../types/index.js';

/** Error esperado, con código HTTP y mensaje seguro para el cliente. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' } satisfies ApiErrorBody);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Datos inválidos.', details: err.issues } satisfies ApiErrorBody);
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message } satisfies ApiErrorBody);
    return;
  }
  // Los detalles internos solo van al log, nunca al cliente.
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' } satisfies ApiErrorBody);
};
