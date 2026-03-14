import request from 'supertest';
import express from 'express';
import helmet from 'helmet';
import healthRoutes from '../routes/healthRoutes';

const app = express();
app.use(helmet());
app.use(express.json());
app.use('/api/health', healthRoutes);

describe('Health Check API', () => {
  it('should return 200 OK and status message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message', 'API is running');
  });

  it('should include security headers from helmet', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers).toHaveProperty('x-xss-protection');
    expect(res.headers).toHaveProperty('x-dns-prefetch-control');
    expect(res.headers).toHaveProperty('content-security-policy');
  });
});
