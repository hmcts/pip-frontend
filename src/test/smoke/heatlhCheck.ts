import request from 'supertest';

describe('GET /health', () => {
  test('should return 200 and UP status', async () => {
    await request('https://localhost:8080')
      .get('/health')
      .expect((res) => expect(res.status).toBe(200))
      .expect((res) => expect(res.body.status).toBe('UP'));
  });
});
