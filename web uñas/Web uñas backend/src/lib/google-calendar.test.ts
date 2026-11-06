import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { describe, it } from 'node:test';
import { createCalendarClient, normalizePrivateKey } from './google-calendar.js';

const pem = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
}).privateKey;

describe('normalizePrivateKey', () => {
  it('convierte \n literales y quita comillas', () => {
    const fromEnv = `"${pem.replace(/\n/g, '\n')}"`;
    assert.equal(normalizePrivateKey(fromEnv), pem);
  });
  it('no altera una llave que ya tiene saltos reales', () => {
    assert.equal(normalizePrivateKey(pem), pem.trim());
  });
});

describe('createCalendarClient', () => {
  it('crea el cliente con credenciales válidas', () => {
    const client = createCalendarClient({ clientEmail: 'bot@p.iam.gserviceaccount.com', privateKey: pem });
    assert.equal(typeof client.freebusy.query, 'function');
  });
  it('falla si faltan credenciales', () => {
    assert.throws(() => createCalendarClient({ clientEmail: '', privateKey: '' }), /GOOGLE_CLIENT_EMAIL/);
  });
});
