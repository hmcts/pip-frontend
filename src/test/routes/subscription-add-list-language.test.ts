import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { expect } from 'chai';
import { PendingSubscriptionsFromCache } from '../../main/service/PendingSubscriptionsFromCache';

const PAGE_URL = '/subscription-add-list-language';
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
cacheStub.withArgs('1', 'cases').resolves(['cached case subscription']);
cacheStub.withArgs('1', 'courts').resolves([]);

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
                .send({ 'list-language': 'test' })
                .expect(res => expect(res.status).to.equal(302));
        });
    });
});
