import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';


describe('subscription URN Search result', () => {
  describe('on GET', () => {
    test('should return subscription Urn Search result page', async () => {
      await request(app)
        .get('/subscription-search-urn-results')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
