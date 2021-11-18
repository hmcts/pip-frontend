import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';


describe('subscription case reference Search result', () => {
  describe('on GET', () => {
    test('should return subscription case reference Search result page', async () => {
      await request(app)
        .get('/case-reference-number-search-results')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
