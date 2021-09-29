import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('subscription URN Search', () => {
  describe('on GET', () => {
    test('should return subscription Urn Search page', async () => {
      await request(app)
        .get('/subscription-urn-search')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
