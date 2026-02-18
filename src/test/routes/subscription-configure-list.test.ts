import { SubscriptionService } from '../../main/service/SubscriptionService';
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

describe('Subscriptions Configure List', () => {
    describe('on GET', () => {
        test('should return subscription configure list page', async () => {
            sinon.stub(SubscriptionService.prototype, 'generateListTypesForCourts').resolves(listOptions);

            await request(app)
                .get('/subscription-configure-list')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Select List Types');
                });
        });
    });

    describe('on POST', () => {
        test('should show error on subscription config list page', async () => {
            await request(app)
                .post('/subscription-configure-list')
                .send({ 'list-selections[]': '' })
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Select List Types');
                });
        });

        test('should redirect to the subscription list language page', async () => {
            await request(app)
                .post('/subscription-configure-list')
                .send({ 'list-selections[]': 'test' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.headers['location']).to.equal('subscription-configure-list-language');
                });
        });
    });
});

