import sinon from 'sinon';
import { accountManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();
const errorResponse = {
  response: {
    data: 'test error',
  },
};
const errorRequest = {
  request: 'test error',
};
const errorMessage = {
  message: 'test',
};
const mockHeaders = {headers: {'x-issuer-email': 'joe@bloggs.com'}};
const mockValidBody = {
  email: 'joe@bloggs.com',
  firstName: 'Joe',
  surname: 'Bloggs',
  role: 'INTERNAL_ADMIN_LOCAL',
};
const endpoint = '/account/add/azure';
const postStub = sinon.stub(accountManagementApi, 'post');

describe('Account Management Requests', () => {
  describe('Create Admin Account', () => {
    it('should return true on success', async () => {
      postStub.withArgs(endpoint, mockValidBody, mockHeaders).resolves(true);
      const response = await accountManagementRequests.createAdminAccount(mockValidBody, mockHeaders);
      expect(response).toBe(true);
    });

    it('should return false on error request', async () => {
      postStub.withArgs(endpoint).resolves(Promise.reject(errorRequest));
      const response = await accountManagementRequests.createAdminAccount({}, mockHeaders);
      expect(response).toBe(false);
    });

    it('should return false on error response', async () => {
      postStub.withArgs(endpoint).resolves(Promise.reject(errorResponse));
      const response = await accountManagementRequests.createAdminAccount({foo: 'blah'}, mockHeaders);
      expect(response).toBe(false);
    });

    it('should return false on error message', async () => {
      postStub.withArgs(endpoint).resolves(Promise.reject(errorMessage));
      const response = await accountManagementRequests.createAdminAccount({bar: 'baz'}, mockHeaders);
      expect(response).toBe(false);
    });
  });
});
