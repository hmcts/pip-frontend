import { expect } from 'chai';
import { app } from '../../main/app';
import sinon from 'sinon';
import request from 'supertest';
import { SubscriptionService } from '../../main/service/SubscriptionService';
import { PendingSubscriptionsFromCache } from '../../main/service/PendingSubscriptionsFromCache';

const subscriptionStub = sinon.stub(SubscriptionService.prototype, 'getPendingSubscriptions');
const subscribeStub = sinon.stub(SubscriptionService.prototype, 'subscribe');
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
const friendlyNameStub = sinon.stub(SubscriptionService.prototype, 'findListTypeFriendlyName');

const mockListTypeValue = 'listType1';

cacheStub.withArgs('1', 'cases').resolves(['cached case subscription']);
cacheStub.withArgs('2', 'cases').resolves([]);
cacheStub.withArgs('2', 'courts').resolves([]);
subscribeStub.withArgs('1').resolves(true);

subscriptionStub.withArgs('1', 'cases').resolves(['test case']);
subscriptionStub.withArgs('1', 'courts').resolves(['test location']);
subscriptionStub.withArgs('1', 'listTypes').resolves([mockListTypeValue]);
subscriptionStub.withArgs('1', 'listLanguage').resolves(['ENGLISH']);

subscribeStub.withArgs('2').resolves(false);

friendlyNameStub.withArgs(mockListTypeValue).resolves('List Type1');

describe('subscription Confirmation Preview', () => {
    describe('on GET', () => {
        test('should return subscription confirmation preview page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .get('/subscription-confirmation-preview')
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return subscriptions confirmation preview page with error query param', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .get('/subscription-confirmation-preview?error=true')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to subscription confirmation preview page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .post('/subscription-confirmation-preview')
                .expect(res => expect(res.status).to.equal(302));
        });

        test('should render the sign in page due to being unauthorised to post to confirmation page', async () => {
            app.request['user'] = {};
            await request(app)
                .post('/subscription-confirmation-preview')
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.headers['location']).to.equal('/sign-in');
                });
        });
    });
});
