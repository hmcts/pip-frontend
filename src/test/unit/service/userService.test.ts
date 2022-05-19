import sinon from 'sinon';
import {AccountManagementRequests} from '../../../main/resources/requests/accountManagementRequests';
import {UserService} from '../../../main/service/userService';
import {expect} from 'chai';
import fs from 'fs';
import path from 'path';

const azureUserId = '123-456-789';
const pandiUserId = '12345';
const userProvenance = 'PI_AAD';
const publicListType = 'SJP_PUBLIC_LIST';
const privateListType = 'CROWN_WARNED_LIST';

const returnedUserInfo = {
  userId: pandiUserId,
  userProvenance: 'PI_AAD',
  provenanceUserId: azureUserId,
  email: 'test@test.com',
  roles: 'INTERNAL_ADMIN_CTSC',
};

const userObject = {oid:'123-456-789'};

const rawArtefactsData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const artefactsData = JSON.parse(rawArtefactsData);

const getUserInfoStub = sinon.stub(AccountManagementRequests.prototype, 'getUserInfo');
const isAuthorisedToViewListStub = sinon.stub(AccountManagementRequests.prototype, 'isAuthorisedToViewList');

const userService = new UserService;

describe('User service', () => {
  it('should return user information from P&I database', () => {
    getUserInfoStub.withArgs(userProvenance, azureUserId).returns(returnedUserInfo);
    return userService.getUserInfo(userProvenance, azureUserId).then((data) => {
      expect(data['userId']).to.equal('12345');
    });
  });

  it('should return true when user is authorised to view the list', () => {
    isAuthorisedToViewListStub.withArgs(pandiUserId, publicListType).returns(true);
    return userService.isAuthorisedToViewList(pandiUserId, publicListType).then((data) => {
      expect(data).to.equal(true);
    });
  });

  it('should return false when unverified user trying to view private list', () => {
    isAuthorisedToViewListStub.withArgs(null, privateListType).returns(false);
    return userService.isAuthorisedToViewList(null, privateListType).then((data) => {
      expect(data).to.equal(false);
    });
  });

  it('should return true when user is authorised to view the list using Azure User object information', () => {
    getUserInfoStub.withArgs(userProvenance, azureUserId).returns(returnedUserInfo);
    return userService.isAuthorisedToViewListByAzureUserId(userObject, publicListType).then((data) => {
      expect(data).to.equal(true);
    });
  });

  it('should return true when unverified user is trying to view the public list', () => {
    isAuthorisedToViewListStub.withArgs(null, publicListType).returns(true);
    return userService.isAuthorisedToViewListByAzureUserId(null, publicListType).then((data) => {
      expect(data).to.equal(true);
    });
  });

  it('should return true when unverified user is trying to view the private list', () => {
    isAuthorisedToViewListStub.withArgs(null, privateListType).returns(false);
    return userService.isAuthorisedToViewListByAzureUserId(null, privateListType).then((data) => {
      expect(data).to.equal(false);
    });
  });

  it('should return private list to verified user', () => {
    getUserInfoStub.withArgs(userProvenance, azureUserId).returns(returnedUserInfo);
    isAuthorisedToViewListStub.withArgs(pandiUserId, privateListType).returns(true);
    return userService.getAuthorisedPublications(artefactsData, userObject).then((data) => {
      expect(data.length).to.equal(2);
    });
  });

  it('should not return private list to unverified user', () => {
    isAuthorisedToViewListStub.withArgs(null, publicListType).returns(true);
    isAuthorisedToViewListStub.withArgs(null, privateListType).returns(false);
    return userService.getAuthorisedPublications(artefactsData, null).then((data) => {
      expect(data.length).to.equal(1);
    });
  });

  it('should return public list to unverified user', () => {
    isAuthorisedToViewListStub.withArgs(null, publicListType).returns(true);
    return userService.getAuthorisedPublications(artefactsData, null).then((data) => {
      expect(data.length).to.equal(1);
    });
  });

  it('should return both public and private lists to verified user', () => {
    getUserInfoStub.withArgs(userProvenance, azureUserId).returns(returnedUserInfo);
    isAuthorisedToViewListStub.withArgs(pandiUserId, publicListType).returns(true);
    isAuthorisedToViewListStub.withArgs(pandiUserId, privateListType).returns(true);
    return userService.getAuthorisedPublications(artefactsData, userObject).then((data) => {
      expect(data.length).to.equal(2);
    });
  });
});
