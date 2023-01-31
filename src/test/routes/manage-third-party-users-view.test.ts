import { app } from '../../main/app';
import request from 'supertest';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { ThirdPartyService } from '../../main/service/thirdPartyService';
import sinon from 'sinon';
import { SubscriptionService } from '../../main/service/subscriptionService';

describe('Manage third party users view', () => {
    describe('on GET', () => {
        const userId = '1234-1234';

        const mockUser = { userId: userId };
        const mockSubscriptions = { listTypeSubscriptions: [] };

        expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

        const getThirdPartyByUserIdStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartyUserById');
        const getSubscriptionsByUserStub = sinon.stub(SubscriptionService.prototype, 'getSubscriptionsByUser');
        getThirdPartyByUserIdStub.withArgs(userId).resolves(mockUser);
        getSubscriptionsByUserStub.withArgs(userId).resolves(mockSubscriptions);

        test('should return manage third party users view page', async () => {
            await request(app)
                .get('/manage-third-party-users/view?userId=1234-1234')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
