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
const mockValidPIBody = {
  email: 'joe@bloggs.com',
  roles: 'INTERNAL_ADMIN_LOCAL',
  provenanceUserId: 'uuid',
  userProvenance: 'PI_ADD',
};
const mockUserInfo = {
  userId: '2fb3967b-4699-47a5-9daf-f0fa9f0b8427',
  userProvenance: 'PI_AAD',
  provenanceUserId: '4e2d0498-69ec-4f62-be5c-89701f492280',
  email: 'test@test.com',
  roles: 'INTERNAL_ADMIN_CTSC',
};
const azureEndpoint = '/account/add/azure';
const piEndpoint = '/account/add/pi';
const authorisedListEndpointWithUserId = '/account/isAuthorised/123/CIVIL_DAILY_CAUSE_LIST';
const authorisedListEndpointWithoutUserId = '/account/isAuthorised/CIVIL_DAILY_CAUSE_LIST';
const userInfoEndpoint = '/account/provenance/PI_AAD/testAzureId';
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

  describe('Is user authorised to view the list', () => {
    it('should return true on success when User Id is provided', async () => {
      getStub.withArgs(authorisedListEndpointWithUserId).resolves({data: true});
      const response = await accountManagementRequests.isAuthorisedToViewList('123', 'CIVIL_DAILY_CAUSE_LIST');
      expect(response).toBe(true);
    });

    it('should return true on success when User Id is not provided', async () => {
      getStub.withArgs(authorisedListEndpointWithoutUserId).resolves({data: true});
      const response = await accountManagementRequests.isAuthorisedToViewList(null, 'CIVIL_DAILY_CAUSE_LIST');
      expect(response).toBe(true);
    });

    it('should return false on success when unverified user try to access private list', async () => {
      getStub.withArgs(authorisedListEndpointWithoutUserId).resolves({data: false});
      const response = await accountManagementRequests.isAuthorisedToViewList(null, 'SJP_PRESS_LIST');
      expect(response).toBe(false);
    });

    it('should return false on error request', async () => {
      getStub.withArgs(authorisedListEndpointWithUserId).resolves(Promise.reject(errorRequest));
      const response = await accountManagementRequests.isAuthorisedToViewList('123', null);
      expect(response).toBe(false);
    });

    it('should return false on error request', async () => {
      getStub.withArgs(authorisedListEndpointWithoutUserId).resolves(Promise.reject(errorRequest));
      const response = await accountManagementRequests.isAuthorisedToViewList(null, null);
      expect(response).toBe(false);
    });

    it('should return false on error response', async () => {
      getStub.withArgs(authorisedListEndpointWithUserId).resolves(Promise.reject(errorResponse));
      const response = await accountManagementRequests.isAuthorisedToViewList('123', null);
      expect(response).toBe(false);
    });

    it('should return false on error message', async () => {
      getStub.withArgs(authorisedListEndpointWithUserId).resolves(Promise.reject(errorMessage));
      const response = await accountManagementRequests.isAuthorisedToViewList('123', null);
      expect(response).toBe(false);
    });
  });

  describe('Get User information from P&I database', () => {
    it('should return user information on success', async () => {
      getStub.withArgs(userInfoEndpoint).resolves({data: {mockUserInfo}});
      const response = await accountManagementRequests.getUserInfo('PI_AAD', 'testAzureId');
      expect(response['mockUserInfo']).toEqual(mockUserInfo);
    });

    it('should return null on error request', async () => {
      getStub.withArgs(userInfoEndpoint).resolves(Promise.reject(errorRequest));
      const response = await accountManagementRequests.getUserInfo(null, 'testAzureId');
      expect(response).toBe(null);
    });

    it('should return null on error response', async () => {
      getStub.withArgs(userInfoEndpoint).resolves(Promise.reject(errorResponse));
      const response = await accountManagementRequests.createAzureAccount('test', 'testAzureId');
      expect(response).toBe(null);
    });

    it('should return null on error message', async () => {
      getStub.withArgs(userInfoEndpoint).resolves(Promise.reject(errorMessage));
      const response = await accountManagementRequests.createAzureAccount('test1', 'test2');
      expect(response).toBe(null);
    });
  });
});
