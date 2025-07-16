const request = require('supertest');
const app = require('../src/server');

describe('API Health Check', () => {
  test('GET /api/health should return status 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('GET /api/docs should return API documentation', async () => {
    const response = await request(app).get('/api/docs');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('TaxBridge API Documentation');
  });
});

describe('Tax Info Endpoints', () => {
  test('GET /api/tax/info should return supported countries and methods', async () => {
    const response = await request(app).get('/api/tax/info');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.supportedCountries).toEqual(['US', 'UK', 'CA', 'AU']);
    expect(response.body.data.supportedMethods).toEqual(['FIFO', 'LIFO', 'AVERAGE_COST']);
  });

  test('GET /api/tax/rules/US should return US tax rules', async () => {
    const response = await request(app).get('/api/tax/rules/US');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.country).toBe('US');
  });
});
