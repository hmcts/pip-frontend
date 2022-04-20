import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { CreateAccountService } from '../../../main/service/createAccountService';
import CreateAdminAccountSummaryController from '../../../main/controllers/CreateAdminAccountSummaryController';
import sinon from 'sinon';

const validMockEmail = 'joe.bloggs@mail.com';
const mockData = {
  firstName: 'joe',
  lastName: 'bloggs',
  emailAddress:'joe.bloggs@mail.com',
  'user-role': 'admin-ctsc',
  userRoleObject: {
    key: 'admin-ctsc',
    text: 'Internal - Administrator - CTSC',
    mapping: 'INTERNAL_ADMIN_CTSC',
  },
};
const invalidMockData = {
  'user-role': 'admin-ctsc',
  userRoleObject: {
    key: 'admin-ctsc',
    text: 'Internal - Administrator - CTSC',
    mapping: 'INTERNAL_ADMIN_CTSC',
  },
};
const createAdminAccountSummaryController = new CreateAdminAccountSummaryController();
const createAccountStub = sinon.stub(CreateAccountService.prototype, 'createAdminAccount');
createAccountStub.withArgs(invalidMockData, validMockEmail).resolves(false);
createAccountStub.withArgs(mockData, validMockEmail).resolves(true);

describe('Create Admin Account Summary Controller', () => {
  const i18n = {'create-admin-account-summary': {}};
  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);
  request['cookies'] = {'createAdminAccount': JSON.stringify(mockData)};

  describe('on get', () => {
    it('should render create admin account summary page', async () => {
      const responseMock = sinon.mock(response);
      const expectedOptions = {
        formData: mockData,
        accountCreated: false,
        displayError: false,
        ...i18n['create-admin-account-summary'],
      };

      responseMock.expects('render').once().withArgs('create-admin-account-summary', expectedOptions);
      await createAdminAccountSummaryController.get(request, response);
      await responseMock.verify();
    });
  });

  describe('on post', () => {
    it('should render create admin account summary page with success message', async () => {
      request.user = {emails: [validMockEmail]};
      const responseMock = sinon.mock(response);
      const expectedOptions = {
        formData: mockData,
        accountCreated: true,
        displayError: false,
        ...i18n['create-admin-account-summary'],
      };

      responseMock.expects('render').once().withArgs('create-admin-account-summary', expectedOptions);
      await createAdminAccountSummaryController.post(request, response);
      await responseMock.verify();
    });

    it('should render create admin account summary page with errors', async () => {
      request['cookies'] = {'createAdminAccount': JSON.stringify(invalidMockData)};
      request.user = {emails: [validMockEmail]};
      const responseMock = sinon.mock(response);
      const expectedOptions = {
        formData: invalidMockData,
        accountCreated: false,
        displayError: true,
        ...i18n['create-admin-account-summary'],
      };

      responseMock.expects('render').once().withArgs('create-admin-account-summary', expectedOptions);
      await createAdminAccountSummaryController.post(request, response);
      await responseMock.verify();
    });
  });
});
