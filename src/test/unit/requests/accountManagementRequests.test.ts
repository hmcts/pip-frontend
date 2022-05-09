import sinon from 'sinon';
import { accountManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import fs from 'fs';
import path from 'path';

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
const mockValidPIBody = {
  email: 'joe@bloggs.com',
  roles: 'INTERNAL_ADMIN_LOCAL',
  provenanceUserId: 'uuid',
  userProvenance: 'PI_ADD',
};
const azureEndpoint = '/account/add/azure';
const piEndpoint = '/account/add/pi';
const postStub = sinon.stub(accountManagementApi, 'post');
const getStub = sinon.stub(accountManagementApi, 'get');

describe('Account Management Requests', () => {
  describe('Create Azure Account', () => {
    it('should return true on success', async () => {
      postStub.withArgs(azureEndpoint).resolves({data: {status: 'success'}});
      const response = await accountManagementRequests.createAzureAccount(mockValidBody, mockHeaders);
      expect(response).toStrictEqual({status: 'success'});
    });

    it('should return null on error request', async () => {
      postStub.withArgs(azureEndpoint).resolves(Promise.reject(errorRequest));
      const response = await accountManagementRequests.createAzureAccount({}, mockHeaders);
      expect(response).toBe(null);
    });

    it('should return null on error response', async () => {
      postStub.withArgs(azureEndpoint).resolves(Promise.reject(errorResponse));
      const response = await accountManagementRequests.createAzureAccount({foo: 'blah'}, mockHeaders);
      expect(response).toBe(null);
    });

    it('should return null on error message', async () => {
      postStub.withArgs(azureEndpoint).resolves(Promise.reject(errorMessage));
      const response = await accountManagementRequests.createAzureAccount({bar: 'baz'}, mockHeaders);
      expect(response).toBe(null);
    });
  });

  describe('Create P&I Account', () => {
    it('should return true on success', async () => {
      postStub.withArgs(piEndpoint).resolves({status: 201});
      const response = await accountManagementRequests.createPIAccount(mockValidPIBody, mockHeaders);
      expect(response).toBe(true);
    });

    it('should return false on error request', async () => {
      postStub.withArgs(piEndpoint).resolves(Promise.reject(errorRequest));
      const response = await accountManagementRequests.createPIAccount({}, mockHeaders);
      expect(response).toBe(false);
    });

    it('should return false on error response', async () => {
      postStub.withArgs(piEndpoint).resolves(Promise.reject(errorResponse));
      const response = await accountManagementRequests.createPIAccount({foo: 'blah'}, mockHeaders);
      expect(response).toBe(false);
    });

    it('should return false on error message', async () => {
      postStub.withArgs(piEndpoint).resolves(Promise.reject(errorMessage));
      const response = await accountManagementRequests.createPIAccount({bar: 'baz'}, mockHeaders);
      expect(response).toBe(false);
    });
  });

  describe('Get media applications', () => {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/mediaApplications.json'), 'utf-8');
    const mediaApplications = JSON.parse(rawData);

    it('should return media applications', async () => {
      getStub.withArgs('/application/status/PENDING').resolves(mediaApplications);
      expect(await accountManagementRequests.getPendingMediaApplications()).toEqual(mediaApplications);
    });
  });
});
