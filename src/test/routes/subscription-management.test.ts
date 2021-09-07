import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';


describe('Subscription Management', () => {
  describe('on GET', () => {
    test('should return subscription-management page', async () => {
      await request(app)
        .get('/subscription-management')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

});
