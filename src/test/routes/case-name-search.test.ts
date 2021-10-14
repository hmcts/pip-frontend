import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Case name search', () => {
  describe('on GET', () => {
    test('should return case name search page', () => {
      request(app)
        .get('/case-name-search')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
