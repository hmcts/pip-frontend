import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { FilterService } from '../../main/service/FilterService';
import { SubscriptionService } from '../../main/service/SubscriptionService';
import { request as expressRequest } from 'express';

const options = {
    alphabetisedList: {},
    filterOptions: {},
};

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Alphabetical search', () => {
    describe('on GET', () => {
        test('should return search option page', async () => {
            sinon.stub(FilterService.prototype, 'handleFilterInitialisation').resolves(options);

            await request(app)
                .get('/alphabetical-search')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Find a court or tribunal');
                });
        });
    });

    describe('on POST', () => {
        test('should return search option page', async () => {
            await request(app)
                .post('/alphabetical-search')
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.contain('filterValues=');
                });
        });
    });

    describe('on POST locationSubscriptionsConfirmation', () => {
        const handleSubStub = sinon.stub(SubscriptionService.prototype, 'handleNewSubscription');
        handleSubStub.resolves(true);

        test('should return search option page', async () => {
            await request(app)
                .post('/location-subscriptions-confirmation')
                .send({})
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.contain('pending-subscriptions');
                });
        });

        test('should return error page when no body provided', async () => {
            await request(app)
                .post('/location-subscriptions-confirmation')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Sorry, there is a problem');
                });
        });
    });
});
