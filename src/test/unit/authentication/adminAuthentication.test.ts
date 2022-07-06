import {expect} from 'chai';

const returnedAminUserRequest = {
  user: {
    _json: {
      'extension_UserRole': 'INTERNAL_SUPER_ADMIN_CTSC',
    },
  },
};

const returnedNonAminUserRequest = {
  user: {
    _json: {},
  },
};

const returnedUnverfiedUserRequest = {};

describe('admin Authentication', () => {
  it('should return true for admin user', async () => {
    expect(adminAuthentication.isAdminUser(returnedAminUserRequest)).to.equal(true);
  });

  it('should return false for non admin', async () => {
    expect(adminAuthentication.isAdminUser(returnedNonAminUserRequest)).to.equal(false);
  });

  it('should return false for not verified user', async () => {
    expect(adminAuthentication.isAdminUser(returnedUnverfiedUserRequest)).to.equal(false);
  });
});
