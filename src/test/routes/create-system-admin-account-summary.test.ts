import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import { CreateAccountService } from '../../main/service/createAccountService';

const createAccountStub = sinon.stub(CreateAccountService.prototype, 'createSystemAdminAccount');
const mockData = {
    firstName: 'Test',
    lastName: 'Name',
    emailAddress: 'Email',
    userRoleObject: { mapping: 'SYSTEM_ADMIN' },
};

const invalidMockDataError = {
    'user-role': 'ERROR',
    userRoleObject: {
        mapping: 'SYSTEM_ADMIN',
    },
};

const invalidMockDataUnknownError = {
    'user-role': 'UNKNOWN_ERROR',
    userRoleObject: {
        mapping: 'SYSTEM_ADMIN',
    },
};

const successResponse = {
    userId: '1234-1234',
};

const errorResponse = {
    userId: '1234-1234',
    duplicate: true,
};

const unknownErrorResponse = {
    userId: '1234-1234',
    error: 'Error',
};

const adminId = '1234-1234';

createAccountStub.withArgs(mockData, adminId).resolves(successResponse);
createAccountStub.withArgs(invalidMockDataError, adminId).resolves(errorResponse);
createAccountStub.withArgs(invalidMockDataUnknownError, adminId).resolves(unknownErrorResponse);

describe('Create system admin account summary page', () => {
    describe('on GET', () => {
        test('should render system admin account form', async () => {
            app.request['cookies'] = { createAdminAccount: JSON.stringify(mockData) };
            app.request['user'] = { userId: adminId, roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get('/create-system-admin-account-summary')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should render system admin account summary with error message', async () => {
            app.request['cookies'] = {
                createAdminAccount: JSON.stringify(invalidMockDataError),
            };
            app.request['user'] = { userId: adminId, roles: 'SYSTEM_ADMIN' };
            await request(app)
                .post('/create-system-admin-account-summary')
                .send()
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should render system admin account summary with unknown error message', async () => {
            app.request['cookies'] = {
                createAdminAccount: JSON.stringify(invalidMockDataUnknownError),
            };
            app.request['user'] = { userId: adminId, roles: 'SYSTEM_ADMIN' };
            await request(app)
                .post('/create-system-admin-account-summary')
                .send()
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should render system admin account summary with success dialog', async () => {
            app.request['cookies'] = { createAdminAccount: JSON.stringify(mockData) };
            app.request['user'] = { userId: adminId, roles: 'SYSTEM_ADMIN' };
            await request(app)
                .post('/create-system-admin-account-summary')
                .send()
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
