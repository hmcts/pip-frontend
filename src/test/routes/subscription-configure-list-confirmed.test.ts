import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import { SubscriptionService } from '../../main/service/subscriptionService';

const PAGE_URL = '/subscription-configure-list-confirmed';
expressRequest['user'] = { roles: 'VERIFIED' };

describe('Subscription Configure list confirmation result', () => {
    describe('on GET', () => {
        test('should render subscription list type confirmation page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });
    });

    describe('on POST', () => {
        test('should show subscription list type confirmation page', async () => {
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
