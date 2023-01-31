import { app } from '../../main/app';
import request from 'supertest';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { ThirdPartyService } from '../../main/service/thirdPartyService';
import sinon from 'sinon';

describe('Manage third party users', () => {
    describe('on GET', () => {
        expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

        sinon.stub(ThirdPartyService.prototype, 'getThirdPartyAccounts').resolves([
            {
                userId: '1234-1234',
                provenanceUserId: 'ThisIsAName',
                roles: 'GENERAL_THIRD_PARTY',
                createdDate: '18th November 2022',
            },
            {
                userId: '2345-2345',
                provenanceUserId: 'ThisIsAnotherName',
                roles: 'GENERAL_THIRD_PARTY',
                createdDate: '20th November 2022',
            },
        ]);

        test('should return manage third party users page', async () => {
            await request(app)
                .get('/manage-third-party-users')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
