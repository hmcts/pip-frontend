import { expect } from 'chai';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { AccountManagementRequests } from '../../main/resources/requests/accountManagementRequests';

expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

sinon
    .stub(AccountManagementRequests.prototype, 'getAdminUserByEmailAndProvenance')
    .withArgs('123456789', 'PI_AAD', '1234')
    .resolves({
        userId: '123456789',
    });

describe('Admin Management', () => {
    describe('on GET', () => {
        test('should return Admin management page', async () => {
            await request(app)
                .get('/admin-management')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to manage user page', async () => {
            await request(app)
                .post('/user-management')
                .send({ 'search-input': '123456789' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                });
        });
    });
});
