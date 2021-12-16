import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';


describe('Case reference number search result', () => {
  describe('on GET', () => {
    test('should return Case reference number search result', () => {
      request(app)
        .get('/case-reference-number-search-results')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
