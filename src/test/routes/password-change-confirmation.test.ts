import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Password Change Confirmation Page', () => {
  describe('on GET', () => {
    test('should return password-change-confirmation page', async () => {
      await request(app)
        .get('/password-change-confirmation')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
