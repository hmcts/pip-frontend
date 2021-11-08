import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Case name search', () => {
  describe('on GET', () => {
    test('should return case name search page', () => {
      request(app)
        .get('/case-name-search')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on GET', () => {
    test('should return case name search page with errors', async () => {
      await request(app)
        .get('/case-name-search?error=true')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
