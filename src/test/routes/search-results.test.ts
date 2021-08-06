import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';


describe('Search results', () => {
  describe('on GET', () => {
    test('should return search results page', async () => {
      await request(app)
        .get('/search-results')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
