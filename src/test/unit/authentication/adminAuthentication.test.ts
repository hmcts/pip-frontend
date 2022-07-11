import {expect} from 'chai';
import {AdminAuthentication} from '../../../main/authentication/adminAuthentication';
import request from 'supertest';
import {app} from '../../../main/app';

const adminAuthentication = new AdminAuthentication;

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

describe('forgot password reset', () => {
  test('should redirect to azure again if password reset error is returned from the B2C', async () => {
    await request(app)
      .post('/login/return')
      .send({'error': 'access_denied', 'error_description': 'AADB2C90118'})
      .expect((res) => expect(res.redirect).to.be.true);
  });
});

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
