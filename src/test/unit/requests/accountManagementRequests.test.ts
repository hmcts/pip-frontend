import sinon from 'sinon';
import { accountManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';

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

const mockValidMediaBody = {
  fullName: 'Test employee',
  email: 'test.employer@employer.com',
  employer: 'Test employer',
  status: 'PENDING',
  file: {
    body: 'body',
    name: 'filename.png',
  },
};

const azureEndpoint = '/account/add/azure';
const piEndpoint = '/account/add/pi';
const applicationGetEndpoint = '/application/';
const imageGetEndpoint = '/application/image/';
const piAadUserEndpoint = '/account/provenance/PI_AAD/';
const cftIdamUserEndpoint = '/account/provenance/CFT_IDAM/';
const updateAccountEndpoint = '/account/provenance/PI_AAD/';
const getAllAccountsEndpoint = '/account/all';
const getUserByUserIdEndpoint = '/account/';
const deleteUserByUserIdEndpoint = '/account/delete/';
const updateUserByUserIdEndpoint = '/account/update/';

const status = 'APPROVED';
const statusEndpoint = '/' + status;
const postStub = sinon.stub(accountManagementApi, 'post');
let putStub = sinon.stub(accountManagementApi, 'put');
let getStub = sinon.stub(accountManagementApi, 'get');
let deleteStub = sinon.stub(accountManagementApi, 'delete');
const superagent = require('superagent');

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

  describe('Create Media Account', () => {
    beforeEach(() => {
      sinon.restore();
      const axiosConfig = require('../../../main/resources/requests/utils/axiosConfig');
      sinon.stub(axiosConfig, 'getAccountManagementCredentials').returns(() => {return '';});
    });

    it('should return true on success', async () => {
      // chain call for superagent post.set.set.attach.field.field.field.field
      sinon.stub(superagent, 'post').callsFake(() => {
        return {
          set(): any {
            return { set(): any {
              return { attach(): any {
                return {
                  field(): any {
                    return {
                      field(): any {
                        return {
                          field(): any {
                            return { field: sinon.stub().returns(true) };
                          } };
                      } };
                  } };
              } };
            } };
          } };
      });

      expect(await accountManagementRequests.createMediaAccount(mockValidMediaBody)).toBe(true);
    });

    it('should return error response', async () => {
      sinon.stub(superagent, 'post').withArgs(mockValidMediaBody).rejects(errorResponse);
      expect(await accountManagementRequests.createMediaAccount(mockValidMediaBody)).toBe(false);
    });

    it('should return error request', async () => {
      sinon.stub(superagent, 'post').withArgs(mockValidMediaBody).rejects(errorRequest);
      expect(await accountManagementRequests.createMediaAccount(mockValidMediaBody)).toBe(false);
    });

    it('should return error message', async () => {
      sinon.stub(superagent, 'post').withArgs(mockValidMediaBody).rejects(errorMessage);
      expect(await accountManagementRequests.createMediaAccount(mockValidMediaBody)).toBe(false);
    });
  });

  describe('Get media applications', () => {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/mediaApplications.json'), 'utf-8');
    const mediaApplications = JSON.parse(rawData);

    beforeEach(() => {
      sinon.restore();
      getStub = sinon.stub(accountManagementApi, 'get');
    });

    it('should return media applications', async () => {
      getStub.withArgs('/application/status/PENDING').resolves({data: mediaApplications});
      expect(await accountManagementRequests.getPendingMediaApplications()).toEqual(mediaApplications);
    });

    it('should return empty array and an error response if get fails', async () => {
      getStub.withArgs('/application/status/PENDING').rejects(errorResponse);
      expect(await accountManagementRequests.getPendingMediaApplications()).toEqual([]);
    });

    it('should return empty array and an error response if request fails', async () => {
      getStub.withArgs('/application/status/PENDING').rejects(errorRequest);
      expect(await accountManagementRequests.getPendingMediaApplications()).toEqual([]);
    });

    it('should return empty array and an error response if request fails', async () => {
      getStub.withArgs('/application/status/PENDING').rejects(errorMessage);
      expect(await accountManagementRequests.getPendingMediaApplications()).toEqual([]);
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

    beforeEach(() => {
      sinon.restore();
      getStub = sinon.stub(accountManagementApi, 'get');
    });

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

    beforeEach(() => {
      sinon.restore();
      getStub = sinon.stub(accountManagementApi, 'get');
    });

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

    beforeEach(() => {
      sinon.restore();
      getStub = sinon.stub(accountManagementApi, 'get');
      putStub = sinon.stub(accountManagementApi, 'put');
    });

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

  describe('Get PI AAD user by oid', () => {
    const idtoUse = '123';

    beforeEach(() => {
      sinon.restore();
      getStub = sinon.stub(accountManagementApi, 'get');
    });

    it('should return pi user id on success', async () => {
      getStub.withArgs(`${piAadUserEndpoint}${idtoUse}`).resolves({status: 200, data: {userId: '321', userProvenance: 'userProvenance'}});
      const response  = await accountManagementRequests.getPiUserByAzureOid(idtoUse);
      expect(response).toStrictEqual({userId: '321', userProvenance: 'userProvenance'});
    });

    it('should return null on error response', async () => {
      getStub.withArgs(`${piAadUserEndpoint}${idtoUse}`).rejects(errorResponse);
      const response  = await accountManagementRequests.getPiUserByAzureOid(idtoUse);
      expect(response).toBe(null);
    });

    it('should return null on error request', async () => {
      getStub.withArgs(`${piAadUserEndpoint}${idtoUse}`).rejects(errorRequest);
      const response  = await accountManagementRequests.getPiUserByAzureOid(idtoUse);
      expect(response).toBe(null);
    });

    it('should return null on error message', async () => {
      getStub.withArgs(`${piAadUserEndpoint}${idtoUse}`).rejects(errorMessage);
      const response  = await accountManagementRequests.getPiUserByAzureOid(idtoUse);
      expect(response).toBe(null);
    });
  });

  describe('Get CFT IDAM user by uid', () => {
    const idtoUse = '123';

    beforeEach(() => {
      sinon.restore();
      getStub = sinon.stub(accountManagementApi, 'get');
    });

    it('should return pi user id on success', async () => {
      getStub.withArgs(`${cftIdamUserEndpoint}${idtoUse}`).resolves({status: 200, data: {userId: '321', userProvenance: 'userProvenance'}});
      const response  = await accountManagementRequests.getPiUserByCftID(idtoUse);
      expect(response).toStrictEqual({userId: '321', userProvenance: 'userProvenance'});
    });

    it('should return null on error response', async () => {
      getStub.withArgs(`${cftIdamUserEndpoint}${idtoUse}`).rejects(errorResponse);
      const response  = await accountManagementRequests.getPiUserByCftID(idtoUse);
      expect(response).toBe(null);
    });

    it('should return null on error request', async () => {
      getStub.withArgs(`${cftIdamUserEndpoint}${idtoUse}`).rejects(errorRequest);
      const response  = await accountManagementRequests.getPiUserByCftID(idtoUse);
      expect(response).toBe(null);
    });

    it('should return null on error message', async () => {
      getStub.withArgs(`${cftIdamUserEndpoint}${idtoUse}`).rejects(errorMessage);
      const response  = await accountManagementRequests.getPiUserByCftID(idtoUse);
      expect(response).toBe(null);
    });
  });

  describe('Update Media Account Verification', () => {
    beforeEach(() => {
      sinon.restore();
      putStub = sinon.stub(accountManagementApi, 'put');
    });
    const oid = '1234';

    it('should return confirmation string on success', async () => {
      putStub.withArgs(updateAccountEndpoint + oid).resolves({status: 200, data: 'Media Account verified' });
      const response = await accountManagementRequests.updateMediaAccountVerification(oid);
      expect(response).toBe('Media Account verified');
    });

    it('should return null on error request', async () => {
      putStub.withArgs(updateAccountEndpoint + oid).rejects(errorRequest);
      const response = await accountManagementRequests.updateMediaAccountVerification(oid);
      expect(response).toBe(null);
    });

    it('should return false on error response', async () => {
      putStub.withArgs(updateAccountEndpoint + oid).rejects(errorResponse);
      const response = await accountManagementRequests.updateMediaAccountVerification(oid);
      expect(response).toBe(null);
    });

    it('should return false on error message', async () => {
      putStub.withArgs(updateAccountEndpoint + oid).rejects(errorMessage);
      const response = await accountManagementRequests.updateMediaAccountVerification(oid);
      expect(response).toBe(null);
    });
  });

  describe('Update account last signed in date', () => {
    beforeEach(() => {
      sinon.restore();
      putStub = sinon.stub(accountManagementApi, 'put');
    });
    const oid = '1234';

    it('should return confirmation string on success', async () => {
      putStub.withArgs(updateAccountEndpoint + oid).resolves({status: 200, data: 'Account updated' });
      const response = await accountManagementRequests.updateAccountLastSignedInDate('PI_AAD', oid);
      expect(response).toBe('Account updated');
    });

    it('should set the correct time', async () => {
      const putStubForDateChecking = putStub.withArgs(updateAccountEndpoint + '1234-1234');
      putStubForDateChecking.resolves({status: 200, data: 'Account updated' });
      await accountManagementRequests.updateAccountLastSignedInDate('PI_AAD', '1234-1234');

      const args = putStubForDateChecking.getCall(0).args;
      expect(moment.utc(args[1]['lastSignedInDate'])
        .isBetween(moment().utc().subtract(5, 'minutes'), moment().utc().add(5, 'minutes')))
        .toBeTruthy();
    });

    it('should return null on error request', async () => {
      putStub.withArgs(updateAccountEndpoint + oid).rejects(errorRequest);
      const response = await accountManagementRequests.updateAccountLastSignedInDate('PI_AAD', oid);
      expect(response).toBe(null);
    });

    it('should return false on error response', async () => {
      putStub.withArgs(updateAccountEndpoint + oid).rejects(errorResponse);
      const response = await accountManagementRequests.updateAccountLastSignedInDate('PI_AAD', oid);
      expect(response).toBe(null);
    });

    it('should return false on error message', async () => {
      putStub.withArgs(updateAccountEndpoint + oid).rejects(errorMessage);
      const response = await accountManagementRequests.updateAccountLastSignedInDate('PI_AAD', oid);
      expect(response).toBe(null);
    });
  });

  describe('Get all accounts except third party', () => {
    beforeEach(() => {
      sinon.restore();
      getStub = sinon.stub(accountManagementApi, 'get');
    });

    it('should return data on success', async () => {
      getStub.withArgs(getAllAccountsEndpoint, {params: {pageSize: 25}}).resolves(
        {status: 200, data: {userId: '321', userProvenance: 'userProvenance'}});
      const response = await accountManagementRequests.getAllAccountsExceptThirdParty(
        {
          params: {
            pageSize: 25,
          },
        },'1234');
      expect(response).toStrictEqual({userId: '321', userProvenance: 'userProvenance'});
    });

    it('should return empty array on error response', async () => {
      getStub.withArgs(getAllAccountsEndpoint, {params: {pageSize: 25}}).rejects(errorResponse);
      const response = await accountManagementRequests.getAllAccountsExceptThirdParty(
        {
          params: {
            pageSize: 25,
          },
        },'1234');
      expect(response).toStrictEqual([]);
    });

    it('should return empty array on error request', async () => {
      getStub.withArgs(getAllAccountsEndpoint, {params: {pageSize: 25}}).rejects(errorRequest);
      const response = await accountManagementRequests.getAllAccountsExceptThirdParty(
        {
          params: {
            pageSize: 25,
          },
        },'1234');
      expect(response).toStrictEqual([]);
    });

    it('should return empty array on error message', async () => {
      getStub.withArgs({params: {pageSize: 25}}).rejects(errorMessage);
      const response = await accountManagementRequests.getAllAccountsExceptThirdParty(
        {
          params: {
            pageSize: 25,
          },
        },'1234');
      expect(response).toStrictEqual([]);
    });
  });

  describe('Get user by user id', () => {
    const idtoUse = '123';

    beforeEach(() => {
      sinon.restore();
      getStub = sinon.stub(accountManagementApi, 'get');
    });

    it('should return pi user on success', async () => {
      getStub.withArgs(`${getUserByUserIdEndpoint}${idtoUse}`).resolves({status: 200, data: {userId: '321',
        userProvenance: 'userProvenance'}});
      const response  = await accountManagementRequests.getUserByUserId(idtoUse, '1234');
      expect(response).toStrictEqual({userId: '321', userProvenance: 'userProvenance'});
    });

    it('should return null on error response', async () => {
      getStub.withArgs(`${getUserByUserIdEndpoint}${idtoUse}`).rejects(errorResponse);
      const response  = await accountManagementRequests.getUserByUserId(idtoUse, '1234');
      expect(response).toBe(null);
    });

    it('should return null on error request', async () => {
      getStub.withArgs(`${getUserByUserIdEndpoint}${idtoUse}`).rejects(errorRequest);
      const response  = await accountManagementRequests.getUserByUserId(idtoUse, '1234');
      expect(response).toBe(null);
    });

    it('should return null on error message', async () => {
      getStub.withArgs(`${getUserByUserIdEndpoint}${idtoUse}`).rejects(errorMessage);
      const response  = await accountManagementRequests.getUserByUserId(idtoUse, '1234');
      expect(response).toBe(null);
    });
  });

  describe('Delete user by user id', () => {
    const idtoUse = '123';

    beforeEach(() => {
      sinon.restore();
      deleteStub = sinon.stub(accountManagementApi, 'delete');
    });

    it('should return string on deletion success', async () => {
      deleteStub.withArgs(`${deleteUserByUserIdEndpoint}${idtoUse}`).resolves({status: 200, data: 'Deleted'});
      const response  = await accountManagementRequests.deleteUser(idtoUse, '1234');
      expect(response).toStrictEqual('Deleted');
    });

    it('should return null on error response', async () => {
      deleteStub.withArgs(`${deleteUserByUserIdEndpoint}${idtoUse}`).rejects(errorResponse);
      const response  = await accountManagementRequests.deleteUser(idtoUse, '1234');
      expect(response).toBe(null);
    });

    it('should return null on error request', async () => {
      deleteStub.withArgs(`${deleteUserByUserIdEndpoint}${idtoUse}`).rejects(errorRequest);
      const response  = await accountManagementRequests.deleteUser(idtoUse, '1234');
      expect(response).toBe(null);
    });

    it('should return null on error message', async () => {
      deleteStub.withArgs(`${deleteUserByUserIdEndpoint}${idtoUse}`).rejects(errorMessage);
      const response  = await accountManagementRequests.deleteUser(idtoUse, '1234');
      expect(response).toBe(null);
    });
  });

  describe('Update user by user id', () => {
    const idtoUse = '123';
    const role = 'SYSTEM_ADMIN';

    beforeEach(() => {
      sinon.restore();
      putStub = sinon.stub(accountManagementApi, 'put');
    });

    it('should return updated user on success', async () => {
      putStub.withArgs(`${updateUserByUserIdEndpoint}${idtoUse}/${role}`).resolves(
        {status: 200, data: {userId: '321', userProvenance: 'userProvenance'}});
      const response  = await accountManagementRequests.updateUser(idtoUse, role, '1234');
      expect(response).toStrictEqual({userId: '321',
        userProvenance: 'userProvenance'});
    });

    it('should return null on error response', async () => {
      putStub.withArgs(`${updateUserByUserIdEndpoint}${idtoUse}/${role}`).rejects(errorResponse);
      const response  = await accountManagementRequests.updateUser(idtoUse, role, '1234');
      expect(response).toBe(null);
    });

    it('should return null on error request', async () => {
      putStub.withArgs(`${updateUserByUserIdEndpoint}${idtoUse}/${role}`).rejects(errorRequest);
      const response  = await accountManagementRequests.updateUser(idtoUse, role, '1234');
      expect(response).toBe(null);
    });

    it('should return null on error message', async () => {
      putStub.withArgs(`${updateUserByUserIdEndpoint}${idtoUse}/${role}`).rejects(errorMessage);
      const response  = await accountManagementRequests.updateUser(idtoUse, role, '1234');
      expect(response).toBe(null);
    });
  });

  describe('Get third party accounts', () => {

    const adminUserId = '1234-1234';

    beforeEach(() => {
      sinon.restore();
      getStub = sinon.stub(accountManagementApi, 'get');
    });

    it('should return third party accounts', async () => {
      const thirdPartyAccounts = [{userId: '1234-1234'},{userId: '2345-2345'}];

      getStub.withArgs('/account/all/third-party').resolves({status: 200, data: thirdPartyAccounts});

      const response = await accountManagementRequests.getThirdPartyAccounts(adminUserId);
      expect(response).toBe(thirdPartyAccounts);
    });

    it('should return null on error request', async () => {
      getStub.withArgs('/account/all/third-party').rejects(errorRequest);
      const response = await accountManagementRequests.getThirdPartyAccounts(adminUserId);
      expect(response).toBe(null);
    });

    it('should return false on error response', async () => {
      getStub.withArgs('/account/all/third-party').rejects(errorResponse);
      const response = await accountManagementRequests.getThirdPartyAccounts(adminUserId);
      expect(response).toBe(null);
    });

    it('should return false on error message', async () => {
      getStub.withArgs('/account/all/third-party').rejects(errorMessage);
      const response = await accountManagementRequests.getThirdPartyAccounts(adminUserId);
      expect(response).toBe(null);
    });
  });

});
