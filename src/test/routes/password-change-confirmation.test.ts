import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Password Change Confirmation Page', () => {
  describe('on GET', () => {
    test('should return password-change-confirmation page for media', async () => {
      await request(app)
        .get('/password-change-confirmation/false')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should return password-change-confirmation page for admin', async () => {
      await request(app)
        .get('/password-change-confirmation/true')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
