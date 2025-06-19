import { config } from 'dotenv';
import request from 'supertest';
import { describe, it, expect, afterAll } from 'vitest';
import app from '../index.js';
import pool from '../db.js';

config({ path: './backend/.env' }); 

describe('🛡️ Auth API', () => {
  it('🧪 Vérifie que la variable JWT_SECRET est définie', () => {
    expect(process.env.JWT_SECRET).toBeDefined();
  });

  it('POST /api/auth/register - enregistre un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Testeur',
        email: 'testeur@example.com',
        password: 'MotdePasseFort123!'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/auth/login - connecte un utilisateur', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testeur@example.com',
        password: 'MotdePasseFort123!'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", ['testeur@example.com']);
    await pool.end();
  });
});
