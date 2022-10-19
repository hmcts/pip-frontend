import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

describe('Session expiring', () => {
  describe('on GET', () => {
    test('should return session expiring page', async () => {
      await request(app)
        .get('/session-expiring')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
