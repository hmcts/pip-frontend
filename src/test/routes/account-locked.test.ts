import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Account locked page', () => {
  describe('on GET', () => {
    test('should return account locked page', async () => {
      await request(app)
        .get('/account-locked')
        .expect((res) => expect(res.status).to.equal(200));
    });

  });
});
