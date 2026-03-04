import { app } from '../../../main/app';
import request from 'supertest';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { ThirdPartyService } from '../../../main/service/ThirdPartyService';
import sinon from 'sinon';

describe('Manage third-party subscribers', () => {
    describe('on GET', () => {
        expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

        sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscribers').resolves([
            {
                userId: '1234-1234',
                name: 'ThisIsAName',
                createdDate: '18th November 2022',
            },
            {
                userId: '2345-2345',
                name: 'ThisIsAnotherName',
                createdDate: '20th November 2022',
            },
        ]);

        test('should return manage third-party subscribers page', async () => {
            await request(app)
                .get('/manage-third-party-subscribers')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
