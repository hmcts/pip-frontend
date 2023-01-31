import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { UserManagementService } from '../../main/service/userManagementService';
import { AccountManagementRequests } from '../../main/resources/requests/accountManagementRequests';

const PAGE_URL = '/update-user?id=1234';

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves({
    email: 'test@email.com',
    roles: 'SYSTEM_ADMIN',
});

sinon.stub(UserManagementService.prototype, 'buildUserUpdateSelectBox').returns('test');

describe('Update User', () => {
    describe('on GET', () => {
        test('should return update user page', async () => {
            app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
