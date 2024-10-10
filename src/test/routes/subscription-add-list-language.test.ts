import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { expect } from 'chai';
import { SubscriptionService } from '../../main/service/SubscriptionService';
import { PendingSubscriptionsFromCache } from '../../main/service/PendingSubscriptionsFromCache';

const PAGE_URL = '/subscription-add-list-language';
const subscribeStub = sinon.stub(SubscriptionService.prototype, 'subscribe');
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
cacheStub.withArgs('1', 'cases').resolves(['cached case subscription']);
cacheStub.withArgs('1', 'courts').resolves([]);
cacheStub.withArgs('2', 'cases').resolves([]);
cacheStub.withArgs('2', 'courts').resolves([]);
subscribeStub.withArgs('1').resolves(true);
subscribeStub.withArgs('2').resolves(false);

describe('Subscriptions Add List Language', () => {
    describe('on GET', () => {
        test('should return subscription add list language page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .get('/subscription-add-list-language')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should return subscription confirmation page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            await request(app)
                .post(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to pending subscriptions page', async () => {
            app.request['user'] = { userId: '2', roles: 'VERIFIED' };
            await request(app)
                .post(PAGE_URL)
                .send({ 'list-language': 'test' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('pending-subscriptions?no-subscriptions=true');
                });
        });
    });
});
