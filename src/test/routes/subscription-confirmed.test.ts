import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import { SubscriptionService } from '../../main/service/subscriptionService';
import { PendingSubscriptionsFromCache } from '../../main/resources/requests/utils/pendingSubscriptionsFromCache';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);
const subscribeStub = sinon.stub(SubscriptionService.prototype, 'subscribe');
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
cacheStub.withArgs('1', 'cases').resolves(['cached case subscription']);
cacheStub.withArgs('1', 'courts').resolves([]);
cacheStub.withArgs('2', 'cases').resolves([]);
cacheStub.withArgs('2', 'courts').resolves([]);
subscribeStub.withArgs('1').resolves(true);
subscribeStub.withArgs('2').resolves(false);

describe('Subscriptions Confirmed', () => {
  describe('on POST', () => {
    test('should return subscription confirmation page', async () => {
      app.request['user'] = {piUserId: '1'};
      await request(app)
        .post('/subscription-confirmed')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should redirect to pending subscriptions page', async () => {
      app.request['user'] = {piUserId: '2'};
      await request(app)
        .post('/subscription-confirmed')
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('pending-subscriptions?no-subscriptions=true');
        });
    });
  });
});
