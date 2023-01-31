import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import { CreateAccountService } from '../../main/service/createAccountService';

const createAccountStub = sinon.stub(CreateAccountService.prototype, 'createAdminAccount');
const mockData = {
    firstName: 'Joe',
    lastName: 'Bloggs',
    emailAddress: 'joe@bloggs.com',
    'user-role': 'admin-ctsc',
    userRoleObject: {
        key: 'admin-ctsc',
        text: 'Internal - Administrator - CTSC',
        mapping: 'INTERNAL_ADMIN_CTSC',
    },
};
const invalidMockData = {
    'user-role': 'super-admin-local',
    userRoleObject: {
        key: 'super-admin-local',
        text: 'Internal - Super Administrator - Local',
        mapping: 'INTERNAL_SUPER_ADMIN_LOCAL',
    },
};
createAccountStub.withArgs(mockData, 'joe@bloggs.com').resolves(true);
createAccountStub.withArgs(invalidMockData, 'joe@bloggs.com').resolves(false);

describe('Create admin account summary page', () => {
    describe('on GET', () => {
        test('should render admin account form', async () => {
            app.request['cookies'] = { createAdminAccount: JSON.stringify(mockData) };
            app.request['user'] = { roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get('/create-admin-account-summary')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should render admin account summary with error message', async () => {
            app.request['cookies'] = {
                createAdminAccount: JSON.stringify(invalidMockData),
            };
            app.request['user'] = { email: 'joe@bloggs.com', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .post('/create-admin-account-summary')
                .send()
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should render admin account summary with success dialog', async () => {
            app.request['cookies'] = { createAdminAccount: JSON.stringify(mockData) };
            app.request['user'] = { email: 'joe@bloggs.com', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .post('/create-admin-account-summary')
                .send()
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
