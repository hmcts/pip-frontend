import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import {request as expressRequest} from 'express';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('subscription URN Search', () => {
  describe('on GET', () => {
    test('should return subscription Urn Search page', async () => {
      await request(app)
        .get('/subscription-urn-search')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should return subscription urn result page', async () => {
      await request(app)
        .post('/subscription-urn-search')
        .send({'search-input': '123456789'})
        .expect((res) => {
          expect(res.status).to.equal(200);
        });
    });
  });
});
