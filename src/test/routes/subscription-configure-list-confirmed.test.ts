import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { SubscriptionService } from '../../main/service/SubscriptionService';
import {PendingSubscriptionsFromCache} from "../../main/service/PendingSubscriptionsFromCache";

const PAGE_URL = '/subscription-configure-list-confirmed';
const subscribeStub = sinon.stub(SubscriptionService.prototype, 'configureListTypeForLocationSubscriptions');
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
cacheStub.withArgs('1', 'listTypes').resolves(['list type']);

subscribeStub.withArgs('1', 'listTypes', 'ENGLISH').resolves(true);

describe('Subscription Configure list confirmation result', () => {
    describe('on POST', () => {
        test('should show subscription list type confirmation page', async () => {
            app.request['user'] = { userId: '1', roles: 'VERIFIED' };
            app.request['body'] = { 'list-language': 'ENGLISH' };

            await request(app)
                .post(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });
    });
});

describe('Subscription Configure list confirmation should redirect when no user', () => {
    describe('on GET', () => {
        test('should render the sign in page due to being unauthorised to get to confirmation page', async () => {
            app.request['user'] = {};
            await request(app)
                .get(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.headers['location']).to.equal('/sign-in');
                });
        });
    });

    describe('on POST', () => {
        test('should render the sign in page due to being unauthorised to post to confirmation page', async () => {
            app.request['user'] = {};
            await request(app)
                .post(PAGE_URL)
                .send({ 'list-language[]': 'ENGLISH' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.headers['location']).to.equal('/sign-in');
                });
        });
    });
});
