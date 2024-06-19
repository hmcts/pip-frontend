import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { UserManagementService } from '../../main/service/UserManagementService';
import { AccountManagementRequests } from '../../main/resources/requests/AccountManagementRequests';
import { v4 as uuidv4 } from 'uuid';

const userId = uuidv4();
const userId2 = uuidv4();
const userId3 = uuidv4();

const PAGE_URL = `/update-user?id=${userId}`;

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves({
    email: 'test@email.com',
    roles: 'SYSTEM_ADMIN',
});

sinon.stub(UserManagementService.prototype, 'buildUserUpdateSelectBox').returns('test');
sinon.stub(UserManagementService.prototype, 'auditAction');

const stub = sinon.stub(AccountManagementRequests.prototype, 'updateUser');

const validBody = { userId: userId, updatedRole: 'SYSTEM_ADMIN' };
const invalidBody = { userId: userId2, updatedRole: 'WRONG_ROLE' };
const forbiddenBody = { userId: userId3, updatedRole: 'FORBIDDEN' };

const adminId = '1234';

describe('Update User', () => {
    describe('on GET', () => {
        test('should return update user page', async () => {
            app.request['user'] = { userId: adminId, roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        beforeEach(() => {
            stub.withArgs(userId, 'SYSTEM_ADMIN', adminId).resolves(true);
            stub.withArgs(userId2, 'WRONG_ROLE', adminId).resolves(null);
            stub.withArgs(userId3, 'FORBIDDEN', adminId).resolves('FORBIDDEN');
            app.request['user'] = { userId: adminId, roles: 'SYSTEM_ADMIN' };
        });

        test('should render the page if body is valid', async () => {
            await request(app)
                .post(PAGE_URL)
                .send(validBody)
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });

        test('should render error page if invalid body data', async () => {
            await request(app)
                .post(PAGE_URL)
                .send(invalidBody)
                .expect(res => {
                    expect(res.status).to.equal(200);
                });
        });

        test('should render error page if user is forbidden', async () => {
            await request(app)
                .post(PAGE_URL)
                .send(forbiddenBody)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.redirect).to.be.true;
                });
        });
    });
});
