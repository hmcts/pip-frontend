import { expect } from 'chai';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);
app.request['user'] = {id: '1'};

describe('subscription Confirmation', () => {
  describe('on GET', () => {
    test('should return subscription confirmation page', async () => {
      await request(app)
        .get('/pending-subscriptions')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should return pending subscriptions page with no-subscriptions query param', async () => {
      await request(app)
        .get('/pending-subscriptions?no-subscription=true')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should return subscription confirmation page', async () => {
      await request(app)
        .post('/pending-subscriptions')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
