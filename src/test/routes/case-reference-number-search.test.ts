import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Case reference number search', () => {
  describe('on GET', () => {
    test('should return Case reference number search page', async () => {
      await request(app)
        .get('/case-reference-number-search')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should return Case reference number search page', async () => {
      await request(app)
        .post('/case-reference-number-search')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
