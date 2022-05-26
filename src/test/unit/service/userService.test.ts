import sinon from 'sinon';
import {AccountManagementRequests} from '../../../main/resources/requests/accountManagementRequests';
import {UserService} from '../../../main/service/userService';
import {expect} from 'chai';

const azureUserId = '123-456-789';
const pandiUserId = '12345';
const userProvenance = 'PI_AAD';

const returnedUserInfo = {
  userId: pandiUserId,
  userProvenance: 'PI_AAD',
  provenanceUserId: azureUserId,
  email: 'test@test.com',
  roles: 'INTERNAL_ADMIN_CTSC',
};

const userObject = {oid:'123-456-789'};

const getUserInfoStub = sinon.stub(AccountManagementRequests.prototype, 'getUserInfo');

const userService = new UserService;

describe('User service', () => {
  it('should return user information from P&I database', () => {
    getUserInfoStub.withArgs(userProvenance, azureUserId).returns(returnedUserInfo);
    return userService.getUserInfo(userProvenance, azureUserId).then((data) => {
      expect(data['userId']).to.equal('12345');
    });
  });

  it('should return null is user information does not exist in P&I database', () => {
    getUserInfoStub.withArgs(userProvenance, null).returns(null);
    return userService.getUserInfo(userProvenance, null).then((data) => {
      expect(data).to.equal(null);
    });
  });

  it('should return P&I user Id from P&I database', () => {
    getUserInfoStub.withArgs(userProvenance, azureUserId).returns(returnedUserInfo);
    return userService.getPandIUserId(userProvenance, userObject).then((data) => {
      expect(data).to.equal('12345');
    });
  });

  it('should return null is user information does not exist in P&I database', () => {
    getUserInfoStub.withArgs(userProvenance, null).returns(null);
    return userService.getPandIUserId(userProvenance, null).then((data) => {
      expect(data).to.equal(null);
    });
  });
});
