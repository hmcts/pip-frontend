import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

describe('Session expired', () => {
  describe('on GET', () => {
    test('should return session expired page', async () => {
      await request(app)
        .get('/session-expired')
        .expect(res => expect(res.status).to.equal(200));
    });
  });
});
