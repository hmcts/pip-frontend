import { expect } from 'chai';
import { app } from '../../main/app';
import sinon from 'sinon';
import request from 'supertest';
import { SubscriptionService } from '../../main/service/SubscriptionService';
import { PendingSubscriptionsFromCache } from '../../main/service/PendingSubscriptionsFromCache';

const handleSubStub = sinon.stub(SubscriptionService.prototype, 'handleNewSubscription');
const subscriptionStub = sinon.stub(SubscriptionService.prototype, 'getPendingSubscriptions');
const subscribeStub = sinon.stub(SubscriptionService.prototype, 'subscribe');
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
const friendlyNameStub = sinon.stub(SubscriptionService.prototype, 'findListTypeFriendlyName');

const mockListTypeValue = 'listType1';
const postData = { 'hearing-selections[]': 'T485913' };

cacheStub.withArgs('1', 'cases').resolves([]);
cacheStub.withArgs('1', 'courts').resolves([]);
cacheStub.withArgs('1', 'listTypes').resolves([mockListTypeValue]);
cacheStub.withArgs('1', 'listLanguage').resolves(['ENGLISH']);

subscriptionStub.withArgs('1', 'cases').resolves([]);
subscriptionStub.withArgs('1', 'courts').resolves([]);
subscriptionStub.withArgs('1', 'listTypes').resolves([mockListTypeValue]);
subscriptionStub.withArgs('1', 'listLanguage').resolves(['ENGLISH']);

subscribeStub.withArgs('1').resolves(true);
handleSubStub.withArgs(postData, '1').resolves(true);

subscribeStub.withArgs('2').resolves(false);

friendlyNameStub.withArgs(mockListTypeValue).resolves('List Type1');

describe('subscription Configure Preview', () => {
    describe('on GET', () => {
        test('should return subscription configure Preview page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .get('/subscription-configure-list-preview')
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return subscriptions configure preview page with error query param', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .get('/subscription-configure-list-preview?no-list-configure=true')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to subscription configure preview page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .post('/subscription-configure-list-preview')
                .expect(res => expect(res.status).to.equal(302));
        });

        test('should show error page in case of failed subscription', async () => {
            app.request['user'] = { userId: '2', roles: 'VERIFIED' };
            await request(app)
                .post('/subscription-configure-list-preview')
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });

        test('should render the sign in page due to being unauthorised to post to confirmation page', async () => {
            app.request['user'] = {};
            await request(app)
                .post('/subscription-configure-list-preview')
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.headers['location']).to.equal('/sign-in');
                });
        });
    });
});
