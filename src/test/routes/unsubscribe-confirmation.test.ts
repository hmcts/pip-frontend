import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { expect } from 'chai';
import { SubscriptionService } from '../../main/service/subscriptionService';

const stub = sinon.stub(SubscriptionService.prototype, 'unsubscribe');
const PAGE_URL = '/unsubscribe-confirmation';
const validBody = {
    'unsubscribe-confirm': 'yes',
    subscription: 'valid subscription',
};
const invalidBody = { 'unsubscribe-confirm': 'yes', subscription: 'foo' };

describe('Unsubscribe Confirmation', () => {
    beforeEach(() => {
        stub.withArgs({ ...validBody, userId: '1' }).resolves(true);
        stub.withArgs({ ...invalidBody, userId: '1' }).resolves(undefined);
        app.request['user'] = { roles: 'VERIFIED' };
    });

    describe('on POST', () => {
        test('should redirect to subscription management if there is no body data', async () => {
            await request(app)
                .post(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/subscription-management');
                });
        });

        test('should redirect to subscription management if unsubscribe-confirm value is no', async () => {
            await request(app)
                .post(PAGE_URL)
                .send({ 'unsubscribe-confirm': 'no' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/subscription-management');
                });
        });

        test('should render error page if invalid body data', async () => {
            await request(app)
                .post(PAGE_URL)
                .send(invalidBody)
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });

        test('should render the page if body is valid', async () => {
            await request(app)
                .post(PAGE_URL)
                .send(validBody)
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });
    });

    describe('on GET', () => {
        test('should render unsubscribe confirmation page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });
    });
});
