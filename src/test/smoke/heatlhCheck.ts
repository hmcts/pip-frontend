import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';

describe('GET /health', () => {
  test('should return 200 and UP status', async () => {
    await request(app)
      .get('/health')
      .expect((res) => expect(res.status).to.equal(200))
      .expect((res) => expect(res.body.status).to.equal('UP'));
  });
});
