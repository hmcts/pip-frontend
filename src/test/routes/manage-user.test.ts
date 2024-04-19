import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { UserManagementService } from '../../main/service/UserManagementService';
import { AccountManagementRequests } from '../../main/resources/requests/AccountManagementRequests';

const PAGE_URL = '/manage-user?id=1234';

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves({
    userId: '1234',
    email: 'test@email.com',
    roles: 'SYSTEM_ADMIN',
});

sinon.stub(UserManagementService.prototype, 'buildManageUserSummaryList').returns('test');

describe('Manage User', () => {
    describe('on GET', () => {
        test('should return manage user page', async () => {
            app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
