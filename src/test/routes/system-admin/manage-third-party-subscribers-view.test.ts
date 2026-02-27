import { app } from '../../../main/app';
import request from 'supertest';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { ThirdPartyService } from '../../../main/service/ThirdPartyService';
import sinon from 'sinon';

describe('Manage third party subscribers view', () => {
    describe('on GET', () => {
        const userId = '1234-1234';

        const mockUser = { userId: userId, status: 'Active' };

        expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

        const getThirdPartyByUserIdStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriberById');
        getThirdPartyByUserIdStub.withArgs(userId).resolves(mockUser);

        test('should return manage third party subscribers view page', async () => {
            await request(app)
                .get('/manage-third-party-subscribers/view?userId=1234-1234')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
