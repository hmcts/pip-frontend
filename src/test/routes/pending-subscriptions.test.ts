import { expect } from 'chai';
import { app } from '../../main/app';
import sinon from 'sinon';
import request from 'supertest';
import {SubscriptionService} from "../../main/service/SubscriptionService";
import {PendingSubscriptionsFromCache} from "../../main/service/PendingSubscriptionsFromCache";

const subscriptionStub = sinon.stub(SubscriptionService.prototype, 'getPendingSubscriptions');
const subscribeStub = sinon.stub(SubscriptionService.prototype, 'subscribe');
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
cacheStub.withArgs('1', 'cases').resolves(['cached case subscription']);
subscribeStub.withArgs('1').resolves(true);
subscriptionStub.withArgs('1', 'cases').resolves(['test case']);
subscriptionStub.withArgs('1', 'courts').resolves(['test location']);

describe('subscription Confirmation', () => {
    describe('on GET', () => {
        test('should return subscription confirmation page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .get('/pending-subscriptions')
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return pending subscriptions page with no-subscriptions query param', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .get('/pending-subscriptions?no-subscription=true')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to subscription confirmation page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .post('/pending-subscriptions')
                .expect(res => expect(res.status).to.equal(302));
        });
    });
});
