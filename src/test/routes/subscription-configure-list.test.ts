import { SubscriptionService } from '../../main/service/subscriptionService';
import { FilterService } from '../../main/service/filterService';
import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'VERIFIED' };

const listOptions = {
    S: {
        SJP_PUBLIC_LIST: {
            listFriendlyName: 'SJP Public List',
            checked: false,
        },
    },
};

const filterOptions = {
    Jurisdiction: {
        Civil: {
            value: 'Civil',
            text: 'Civil',
            checked: true,
        },
    },
};

describe('Subscriptions Configure List', () => {
    describe('on GET', () => {
        test('should return subscription configure list page', async () => {
            sinon
                .stub(SubscriptionService.prototype, 'generateListTypesForCourts')
                .resolves({ listTypes: listOptions, filterOptions: filterOptions });

            await request(app)
                .get('/subscription-configure-list')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to the subscription configure page', async () => {
            sinon
                .stub(FilterService.prototype, 'generateFilterKeyValues')
                .withArgs({ Jurisdiction: 'Civil' })
                .resolves('FilterOption');

            await request(app)
                .post('/subscription-configure-list')
                .send({ Jurisdiction: 'Civil' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.text).to.contain('Redirecting to subscription-configure-list');
                });
        });

        //TODO: To be expanded on once submissions screens implemented
        test('should submit the selections to the submission', async () => {
            await request(app)
                .post('/subscription-configure-list')
                .send({ 'list-selections[]': 'CIVIL_DAILY_CAUSE_LIST' });
        });
    });
});
