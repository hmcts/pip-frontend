import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import {request as expressRequest} from 'express';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('subscription Confirmed', () => {
  describe('on GET', () => {
    test('should return subscription confirmation page', async () => {
      await request(app)
        .get('/subscription-confirmed')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
