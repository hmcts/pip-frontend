import { app } from '../../../main/app';
import request from 'supertest';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { ThirdPartyService } from '../../../main/service/ThirdPartyService';
import sinon from 'sinon';

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

const userId = '1234-1234';
const mockUser = { userId: userId };

sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriberById').resolves(mockUser);
sinon.stub(ThirdPartyService.prototype, 'thirdPartyConfigurationHealthCheck').resolves(true);

describe('Manage third party subscribers view', () => {
    describe('on GET', () => {
        test('should return manage third party subscribers view page', async () => {
            await request(app)
                .get(`/manage-third-party-subscribers/view?userId=${userId}`)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should return manage third party subscribers view page for health check', async () => {
            await request(app)
                .post(`/manage-third-party-subscribers/view?userId=${userId}`)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
