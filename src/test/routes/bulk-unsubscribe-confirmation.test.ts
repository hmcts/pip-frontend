import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import sinon from 'sinon';
import { SubscriptionService } from '../../main/service/subscriptionService';

const PAGE_URL = '/bulk-unsubscribe-confirmation';
expressRequest['user'] = { roles: 'VERIFIED' };

describe('Bulk unsubscribe confirmation', () => {
    describe('on GET', () => {
        test('should render bulk unsubscribe confirmation page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test("should redirect to bulk unsubscribe confirmed page if 'yes' is selected", async () => {
            sinon
                .stub(SubscriptionService.prototype, 'bulkDeleteSubscriptions')
                .withArgs(['123', '456'])
                .resolves('success');

            await request(app)
                .post(PAGE_URL)
                .send({ 'bulk-unsubscribe-choice': 'yes', subscriptions: '123,456' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('bulk-unsubscribe-confirmed');
                });
        });

        test("should redirect to subscription management page if 'no' is selected", async () => {
            await request(app)
                .post(PAGE_URL)
                .send({ 'bulk-unsubscribe-choice': 'no' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('subscription-management');
                });
        });

        test('should render bulk unsubscribe confirmation page if no option is selected', async () => {
            await request(app)
                .post(PAGE_URL)
                .send({})
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
