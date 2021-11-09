import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import {CourtService} from '../../main/service/courtService';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);
sinon.stub(CourtService.prototype, 'generateAlphabetisedCourtList').returns([]);
sinon.stub(CourtService.prototype, 'generateFilteredAlphabetisedCourtList').returns([]);
sinon.stub(CourtService.prototype, 'fetchAllCourts').returns([]);


describe('Court Name Search', () => {
  describe('on GET', () => {
    test('should return court name search page', async () => {
      await request(app)
        .get('/court-name-search')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should return court name search page with unchecked checkboxes', async () => {
      await request(app)
        .get('/court-name-search?clear=all')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should return court name search page with unchecked filter', async () => {
      await request(app)
        .get('/court-name-search?clear=Crown%20Court')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should return court name search page applied filter', async () => {
      await request(app)
        .post('/court-name-search')
        .send({jurisdiction: 'crown'})
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
