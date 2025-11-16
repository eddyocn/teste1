import request from 'supertest';
import app from '../index.js';
import fs from 'node:fs';
import path from 'node:path';

const DATA_FILE = path.resolve('./data/count.json');

beforeEach(() => {
  try { fs.unlinkSync(DATA_FILE); } catch {}
});

test('GET /api/count starts at 0', async () => {
  const res = await request(app).get('/api/count');
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('count', 0);
});

test('POST /api/increment increases count', async () => {
  await request(app).post('/api/increment').send({ delta: 1 });
  const res = await request(app).get('/api/count');
  expect(res.body.count).toBe(1);
});

test('POST /api/reset sets to 0', async () => {
  await request(app).post('/api/increment').send({ delta: 3 });
  await request(app).post('/api/reset');
  const res = await request(app).get('/api/count');
  expect(res.body.count).toBe(0);
});
