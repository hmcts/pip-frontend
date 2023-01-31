import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { AccountManagementRequests } from '../../main/resources/requests/accountManagementRequests';

const PAGE_URL = '/delete-user?id=1234';

const userData = {
    email: 'test@email.com',
    roles: 'SYSTEM_ADMIN',
};

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves(userData);

describe('Delete User', () => {
    describe('on GET', () => {
        test('should return delete user page', async () => {
            app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
