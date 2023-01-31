import { app } from '../../main/app';
import request from 'supertest';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { ThirdPartyService } from '../../main/service/thirdPartyService';
import sinon from 'sinon';
import { SubscriptionService } from '../../main/service/subscriptionService';
import { PublicationService } from '../../main/service/publicationService';

describe('Manage third party users subscription', () => {
    const userId = '1234-1234';

    expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

    const getThirdPartyUserByIdStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartyUserById');
    const getListTypesStub = sinon.stub(PublicationService.prototype, 'getListTypes');
    const getSubscriptionsByUserStub = sinon.stub(SubscriptionService.prototype, 'getSubscriptionsByUser');
    const getChannelsListStub = sinon.stub(SubscriptionService.prototype, 'retrieveChannels');
    const generateListTypesStub = sinon.stub(ThirdPartyService.prototype, 'generateListTypes');
    const generateAvailableChannelsStub = sinon.stub(ThirdPartyService.prototype, 'generateAvailableChannels');

    getThirdPartyUserByIdStub.withArgs(userId).resolves({ userId: userId });
    getListTypesStub.resolves(['LIST_A', 'LIST_B']);
    getSubscriptionsByUserStub.withArgs(userId).resolves({ listTypeSubscriptions: [] });
    getChannelsListStub.resolves(['CHANNEL_A', 'EMAIL']);
    generateListTypesStub.withArgs(['LIST_A', 'LIST_B'], { listTypeSubscriptions: [] }).returns({});
    generateAvailableChannelsStub.withArgs(['CHANNEL_A'], { listTypeSubscriptions: [] }).returns({});

    describe('on GET', () => {
        test('should return manage third party users subscription page', async () => {
            await request(app)
                .get('/manage-third-party-users/subscriptions?userId=1234-1234')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        const updateThirdPartySubsStub = sinon.stub(ThirdPartyService.prototype, 'handleThirdPartySubscriptionUpdate');
        updateThirdPartySubsStub.withArgs(userId, 'CHANNEL_A', ['LIST_SELECTION']).resolves();
        getThirdPartyUserByIdStub.withArgs(userId).resolves({ userId: userId });

        test('should return manage third party users confirmation page', async () => {
            await request(app)
                .post('/manage-third-party-users/subscriptions')
                .send({
                    userId: userId,
                    channel: 'CHANNEL_A',
                    'list-selections[]': ['LIST_SELECTION'],
                })
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
