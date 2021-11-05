import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Case Name Search', () => {
  describe('on GET', () => {
    test('should return case name search page', async () => {
      request(app)
        .get('/court-name-search')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should return case name search page with unchecked checkboxes', async () => {
      request(app)
        .get('/court-name-search?clear=all')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should return case name search page with unchecked filter', async () => {
      request(app)
        .get('/court-name-search?clear=Crown%20Court')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should return case name search page applied filter', async () => {
      request(app)
        .post('/court-name-search')
        .send({jurisdiction: 'crown'})
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
