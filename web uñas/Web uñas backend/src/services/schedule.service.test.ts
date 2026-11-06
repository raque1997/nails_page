import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createSchedule } from './schedule.service.js';

const s = createSchedule('-06:00');
const SAT = '2030-01-05'; // sábado
const busyAt = (from: string, to: string) => [
  { start: `${SAT}T${from}:00-06:00`, end: `${SAT}T${to}:00-06:00` },
];

describe('availableSlots', () => {
  it('sin eventos solo ofrece 09:00, 12:00 y 15:00', () => {
    assert.deepEqual(s.availableSlots(SAT, [], 0), ['09:00', '12:00', '15:00']);
  });
  it('un evento que solapa 10 minutos descarta el bloque completo', () => {
    assert.deepEqual(s.availableSlots(SAT, busyAt('14:50', '15:10'), 0), ['09:00']);
    assert.deepEqual(s.availableSlots(SAT, busyAt('11:50', '12:10'), 0), ['15:00']);
  });
  it('un evento que termina justo cuando empieza el bloque no lo descarta', () => {
    assert.deepEqual(s.availableSlots(SAT, busyAt('11:00', '12:00'), 0), ['12:00', '15:00']);
  });
  it('no ofrece horarios en día no laboral (lunes)', () => {
    assert.deepEqual(s.availableSlots('2030-01-07', [], 0), []);
  });
  it('no ofrece bloques que ya empezaron', () => {
    const now = Date.parse(`${SAT}T10:00:00-06:00`);
    assert.deepEqual(s.availableSlots(SAT, [], now), ['12:00', '15:00']);
  });
});

describe('daySlots', () => {
  it('devuelve siempre los 3 bloques y marca los ocupados', () => {
    assert.deepEqual(s.daySlots(SAT, busyAt('12:30', '12:40'), 0), [
      { time: '09:00', available: true },
      { time: '12:00', available: false },
      { time: '15:00', available: true },
    ]);
  });
  it('sin eventos todos están disponibles', () => {
    assert.ok(s.daySlots(SAT, [], 0).every((x) => x.available));
  });
  it('un bloque que ya empezó aparece no disponible', () => {
    const now = Date.parse(`${SAT}T10:00:00-06:00`);
    assert.deepEqual(
      s.daySlots(SAT, [], now).map((x) => x.available),
      [false, true, true],
    );
  });
  it('día no laboral: sin bloques', () => {
    assert.deepEqual(s.daySlots('2030-01-07', [], 0), []);
  });
});

describe('isSlotFree', () => {
  it('acepta los tres bloques de 3 horas', () => {
    assert.equal(s.isSlotFree(SAT, '09:00', '12:00', [], 0), true);
    assert.equal(s.isSlotFree(SAT, '12:00', '15:00', [], 0), true);
    assert.equal(s.isSlotFree(SAT, '15:00', '18:00', [], 0), true);
  });
  it('rechaza choques, fuera de cuadrícula y duración distinta de 3 h', () => {
    assert.equal(s.isSlotFree(SAT, '12:00', '15:00', busyAt('13:00', '13:10'), 0), false);
    assert.equal(s.isSlotFree(SAT, '10:30', '13:30', [], 0), false);
    assert.equal(s.isSlotFree(SAT, '09:00', '11:00', [], 0), false);
    assert.equal(s.isSlotFree(SAT, '16:00', '19:00', [], 0), false);
  });
});
