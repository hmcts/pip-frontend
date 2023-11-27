import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { SubscriptionService } from '../../main/service/subscriptionService';

const PAGE_URL = '/subscription-configure-list-confirmed';


describe('Subscription Configure list confirmation result', () => {
    describe('on GET', () => {
        test('should render subscription list type confirmation page', async () => {
            app.request['user'] = { roles: 'VERIFIED' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });
    });

    describe('on POST', () => {
        test('should show subscription list type confirmation page', async () => {
            app.request['user'] = { roles: 'VERIFIED' };
            sinon
                .stub(SubscriptionService.prototype, 'configureListTypeForLocationSubscriptions')
                .withArgs('1', 'CIVIL_DAILY_CAUSE_LIST')
                .resolves(true);

            await request(app)
                .post(PAGE_URL)
                .send({ 'list-selections[]': 'CIVIL_DAILY_CAUSE_LIST' })
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
                .send({ 'list-selections[]': 'CIVIL_DAILY_CAUSE_LIST' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.headers['location']).to.equal('/sign-in');
                });
        });
    });
});
