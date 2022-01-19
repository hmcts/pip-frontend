import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import { SubscriptionService } from '../../main/service/subscriptionService';

sinon.stub(SubscriptionService.prototype, 'subscribe').withArgs('1').resolves(true);
sinon.stub(expressRequest, 'isAuthenticated').returns(true);
app.request['user'] = {id: '1'};

describe('Subscriptions Confirmed', () => {
  describe('on POST', () => {
    test('should return subscription confirmation page', async () => {
      await request(app)
        .post('/subscription-confirmed')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
