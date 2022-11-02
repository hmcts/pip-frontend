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
  userRoleObject:{'mapping':'SYSTEM_ADMIN'},
};
const invalidMockData = {
  'user-role': 'super-admin-local',
  userRoleObject:{
    mapping: 'SYSTEM_ADMIN',
  },
};
createAccountStub.withArgs(mockData, 'joe@bloggs.com').resolves(true);
createAccountStub.withArgs(invalidMockData, 'joe@bloggs.com').resolves(false);

describe('Create system admin account summary page', () => {
  describe('on GET', () => {
    test('should render system admin account form', async () => {
      app.request['cookies'] = {'createAdminAccount': JSON.stringify(mockData)};
      app.request['user'] = { '_json': {
        'extension_UserRole': 'SYSTEM_ADMIN',
      }};
      await request(app).get('/create-system-admin-account-summary').expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should render system admin account summary with error message', async () => {
      app.request['cookies'] = {'createAdminAccount': JSON.stringify(invalidMockData)};
      app.request['user'] = {emails: ['joe@bloggs.com'], '_json': {
        'extension_UserRole': 'SYSTEM_ADMIN',
      }};
      await request(app).post('/create-system-admin-account-summary').send().expect((res) => expect(res.status).to.equal(200));
    });

    test('should render system admin account summary with success dialog', async () => {
      app.request['cookies'] = {'createAdminAccount': JSON.stringify(mockData)};
      app.request['user'] = {emails: ['joe@bloggs.com'], '_json': {
        'extension_UserRole': 'SYSTEM_ADMIN',
      }};
      await request(app).post('/create-system-admin-account-summary').send().expect((res) => expect(res.status).to.equal(200));
    });
  });
});
