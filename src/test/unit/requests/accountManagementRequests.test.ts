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
const azureEndpoint = '/account/add/azure';
const piEndpoint = '/account/add/pi';
const applicationGetEndpoint = '/application/';
const imageGetEndpoint = '/application/image/';

const status = 'APPROVED';
const statusEndpoint = '/' + status;
const postStub = sinon.stub(accountManagementApi, 'post');
const getStub = sinon.stub(accountManagementApi, 'get');
const putStub = sinon.stub(accountManagementApi, 'put');

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

  describe('Get Media Application By ID', () => {

    const applicationID = '1234';

    const dummyApplication = {
      'id': '1234',
      'fullName': 'Test Name',
      'email': 'a@b.com',
      'employer': 'Employer',
      'image': '12345',
      'imageName': 'ImageName',
      'requestDate': '2022-05-09T00:00:01',
      'status': 'PENDING',
      'statusDate': '2022-05-09T00:00:01',
    };

    it('should return dummy application on success', async () => {
      getStub.withArgs(applicationGetEndpoint + applicationID).resolves({status: 201, data: dummyApplication });
      const response = await accountManagementRequests.getMediaApplicationById(applicationID);
      expect(response).toBe(dummyApplication);
    });

    it('should return null on error request', async () => {
      getStub.withArgs(applicationGetEndpoint + applicationID).rejects(errorRequest);
      const response = await accountManagementRequests.getMediaApplicationById(applicationID);
      expect(response).toBe(null);
    });

    it('should return false on error response', async () => {
      getStub.withArgs(applicationGetEndpoint + applicationID).rejects(errorResponse);
      const response = await accountManagementRequests.getMediaApplicationById(applicationID);
      expect(response).toBe(null);
    });

    it('should return false on error message', async () => {
      getStub.withArgs(applicationGetEndpoint + applicationID).rejects(errorMessage);
      const response = await accountManagementRequests.getMediaApplicationById(applicationID);
      expect(response).toBe(null);
    });
  });

  describe('Get Media Application Image By ID', () => {

    const imageID = '1234';
    const dummyImage = new Blob(['testJPEG']);

    it('should return dummy application on success', async () => {
      getStub.withArgs(imageGetEndpoint + imageID).resolves({status: 201, data: dummyImage });
      const response = await accountManagementRequests.getMediaApplicationImageById(imageID);
      expect(response).toBe(dummyImage);
    });

    it('should return null on error request', async () => {
      getStub.withArgs(imageGetEndpoint + imageID).rejects(errorRequest);
      const response = await accountManagementRequests.getMediaApplicationImageById(imageID);
      expect(response).toBe(null);
    });

    it('should return false on error response', async () => {
      getStub.withArgs(imageGetEndpoint + imageID).rejects(errorResponse);
      const response = await accountManagementRequests.getMediaApplicationImageById(imageID);
      expect(response).toBe(null);
    });

    it('should return false on error message', async () => {
      getStub.withArgs(imageGetEndpoint + imageID).rejects(errorMessage);
      const response = await accountManagementRequests.getMediaApplicationImageById(imageID);
      expect(response).toBe(null);
    });
  });

  describe('Update Media Application Status by ID', () => {

    const applicationID = '1234';

    const dummyApplication = {
      'id': '1234',
      'fullName': 'Test Name',
      'email': 'a@b.com',
      'employer': 'Employer',
      'image': '12345',
      'imageName': 'ImageName',
      'requestDate': '2022-05-09T00:00:01',
      'status': 'APPROVED',
      'statusDate': '2022-05-09T00:00:01',
    };

    it('should return dummy application on success', async () => {
      putStub.withArgs(applicationGetEndpoint + applicationID + statusEndpoint).resolves({status: 201, data: dummyApplication });
      const response = await accountManagementRequests.updateMediaApplicationStatus(applicationID, status);
      expect(response).toBe(dummyApplication);
    });

    it('should return null on error request', async () => {
      putStub.withArgs(applicationGetEndpoint + applicationID + statusEndpoint).rejects(errorRequest);
      const response = await accountManagementRequests.updateMediaApplicationStatus(applicationID, status);
      expect(response).toBe(null);
    });

    it('should return false on error response', async () => {
      putStub.withArgs(applicationGetEndpoint + applicationID + statusEndpoint).rejects(errorResponse);
      const response = await accountManagementRequests.updateMediaApplicationStatus(applicationID, status);
      expect(response).toBe(null);
    });

    it('should return false on error message', async () => {
      putStub.withArgs(applicationGetEndpoint + applicationID + statusEndpoint).rejects(errorMessage);
      const response = await accountManagementRequests.updateMediaApplicationStatus(applicationID, status);
      expect(response).toBe(null);
    });
  });

});
