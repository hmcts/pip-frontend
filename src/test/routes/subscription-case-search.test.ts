import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('subscription case reference Search', () => {
  describe('on GET', () => {
    test('should return subscription case reference Search page', async () => {
      await request(app)
        .get('/subscription-case-search')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should return subscription case reference Search page', async () => {
      await request(app)
        .post('/subscription-case-search')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
