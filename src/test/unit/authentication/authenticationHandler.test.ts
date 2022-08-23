import {expect} from 'chai';
import {
  checkRoles,
  manualUploadRoles,
  mediaAccountCreationRoles,
  verifiedRoles,
  checkAuthenticatedMedia,
  checkAuthenticatedAdmin,
  isPermittedMedia,
  isPermittedAdmin,
  isPermittedAccountCreation,
  isPermittedManualUpload,
  isPermittedMediaAccount, 
  isAdminSessionExpire,
  mediaVerificationHandling,
}
  from '../../../main/authentication/authenticationHandler';

import request from 'supertest';
import {app} from '../../../main/app';

describe('Test checking user roles', () => {

  it('check that check roles returns true when matched', () => {
    const req = {'user': {'_json': {'extension_UserRole': 'SYSTEM_ADMIN'}}};
    expect(checkRoles(req, manualUploadRoles)).to.be.true;
  });

  it('check that check roles returns false when matched', () => {
    const req = {'user': {'_json': {'extension_UserRole': 'SYSTEM_ADMIN'}}};
    expect(checkRoles(req, mediaAccountCreationRoles)).to.be.false;
  });

  it('check that roles returns false when no user', () => {
    expect(checkRoles({}, mediaAccountCreationRoles)).to.be.false;
  });

  it('check that roles returns false when no json', () => {
    expect(checkRoles({'user': {}}, mediaAccountCreationRoles)).to.be.false;
  });
});

describe('Test Authenticated Admin', () => {

  it('check next is called if roles match', () => {
    const mockNextFunction = jest.fn(() => 4);
    const req = {'user': {'_json': {'extension_UserRole': 'SYSTEM_ADMIN'}}};
    expect(checkAuthenticatedAdmin(req, {}, mockNextFunction, manualUploadRoles)).to.equal(4);
  });

  it('check redirect to admin dashboard if admin role but not permitted', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);

    const req = {'user': {'_json': {'extension_UserRole': 'SYSTEM_ADMIN'}}};
    const res = {'redirect': mockRedirectFunction};
    checkAuthenticatedAdmin(req, res, mockRedirectFunction, mediaAccountCreationRoles);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
  });

  it('check redirect to account home if verified role', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);

    const req = {'user': {'_json': {'extension_UserRole': 'VERIFIED'}}};
    const res = {'redirect': mockRedirectFunction};
    checkAuthenticatedAdmin(req, res, mockRedirectFunction, mediaAccountCreationRoles);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
  });

  it('check redirect to login if not authenticated', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);

    const req = {};
    const res = {'redirect': mockRedirectFunction};
    checkAuthenticatedAdmin(req, res, mockRedirectFunction, mediaAccountCreationRoles);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.contains('/admin-login?p=');
  });

});

describe('Test Authenticated Media', () => {

  it('check next is called if roles match', () => {
    const mockNextFunction = jest.fn(() => 4);
    const req = {'user': {'_json': {'extension_UserRole': 'VERIFIED'}}};
    expect(checkAuthenticatedMedia(req, {}, mockNextFunction, verifiedRoles)).to.equal(4);
  });

  it('check redirect to admin dashboard if actually an admin role', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);

    const req = {'user': {'_json': {'extension_UserRole': 'SYSTEM_ADMIN'}}};
    const res = {'redirect': mockRedirectFunction};
    checkAuthenticatedMedia(req, res, mockRedirectFunction, verifiedRoles);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
  });

  it('check redirect to login if not authenticated', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);

    const req = {};
    const res = {'redirect': mockRedirectFunction};
    checkAuthenticatedMedia(req, res, mockRedirectFunction, verifiedRoles);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.contains('/login?p=');
  });

});

describe('Test IsPermittedMedia', () => {

  it('check returns next function if permitted', () => {
    const mockRedirectFunction = jest.fn(() => 4);
    const req = {'user': {'_json': {'extension_UserRole': 'VERIFIED'}}};

    expect(isPermittedMedia(req, {}, mockRedirectFunction)).to.equal(4);
  });

  it('check redirect to admin-dashboard is called if not matched', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'_json': {'extension_UserRole': 'SYSTEM_ADMIN'}}};
    const res = {'redirect': mockRedirectFunction};

    isPermittedMedia(req, res, mockRedirectFunction);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
  });

});

describe('Test IsPermittedAdmin', () => {

  it('check returns next function if permitted', () => {
    const mockRedirectFunction = jest.fn(() => 4);
    const req = {'user': {'_json': {'extension_UserRole': 'SYSTEM_ADMIN'}}};

    expect(isPermittedAdmin(req, {}, mockRedirectFunction)).to.equal(4);
  });

  it('check redirect to admin-dashboard is called if not matched', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'_json': {'extension_UserRole': 'VERIFIED'}}};
    const res = {'redirect': mockRedirectFunction};

    isPermittedAdmin(req, res, mockRedirectFunction);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
  });

});

describe('Test IsPermittedAccountCreation', () => {

  it('check returns next function if permitted', () => {
    const mockRedirectFunction = jest.fn(() => 4);
    const req = {'user': {'_json': {'extension_UserRole': 'INTERNAL_SUPER_ADMIN_CTSC'}}};

    expect(isPermittedAccountCreation(req, {}, mockRedirectFunction)).to.equal(4);
  });

  it('check redirect to admin-dashboard is called if not matched', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'_json': {'extension_UserRole': 'INTERNAL_ADMIN_LOCAL'}}};
    const res = {'redirect': mockRedirectFunction};

    isPermittedAccountCreation(req, res, mockRedirectFunction);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
  });

});

describe('Test IsPermittedManualUpload', () => {

  it('check returns next function if permitted', () => {
    const mockRedirectFunction = jest.fn(() => 4);
    const req = {'user': {'_json': {'extension_UserRole': 'INTERNAL_SUPER_ADMIN_CTSC'}}};

    expect(isPermittedManualUpload(req, {}, mockRedirectFunction)).to.equal(4);
  });

  it('check redirect to admin-dashboard is called if not matched', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'_json': {'extension_UserRole': 'VERIFIED'}}};
    const res = {'redirect': mockRedirectFunction};

    isPermittedManualUpload(req, res, mockRedirectFunction);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
  });

});

describe('Test IsPermittedMediaAccount', () => {

  it('check returns next function if permitted', () => {
    const mockRedirectFunction = jest.fn(() => 4);
    const req = {'user': {'_json': {'extension_UserRole': 'INTERNAL_ADMIN_CTSC'}}};

    expect(isPermittedMediaAccount(req, {}, mockRedirectFunction)).to.equal(4);
  });

  it('check redirect to admin-dashboard is called if not matched', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'_json': {'extension_UserRole': 'INTERNAL_SUPER_ADMIN_LOCAL'}}};
    const res = {'redirect': mockRedirectFunction};

    isPermittedMediaAccount(req, res, mockRedirectFunction);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
  });
});

describe('forgot password reset', () => {
  test('should redirect to azure again if password reset error is returned from the B2C', async () => {
    await request(app)
      .post('/login/return')
      .send({'error': 'access_denied', 'error_description': 'AADB2C90118'})
      .expect((res) => expect(res.redirect).to.be.true);
  });

  describe('media verification handling', () => {
    it('should redirect to account home with verified banner', async () => {
      const mockRedirectFunction = jest.fn((argument) => argument);
      const req = {'user': {'_json': {'extension_UserRole': 'VERIFIED'}}};
      const res = {'redirect': mockRedirectFunction};

      await mediaVerificationHandling(req, res);

      expect(mockRedirectFunction.mock.calls.length).to.equal(1);
      expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home?verified=true');
    });

    it('should not redirect to account home if user role is not verified', async () => {
      const mockRedirectFunction = jest.fn((argument) => argument);
      const req = {'user': {'_json': {'extension_UserRole': 'INTERNAL_SUPER_ADMIN_LOCAL'}}};
      const res = {'redirect': mockRedirectFunction};

      await mediaVerificationHandling(req, res);

      expect(mockRedirectFunction.mock.calls.length).to.equal(0);
    });

    it('should not redirect to account home if no user was provided', async () => {
      const mockRedirectFunction = jest.fn((argument) => argument);
      const req = {};
      const res = {'redirect': mockRedirectFunction};

      await mediaVerificationHandling(req, res);

      expect(mockRedirectFunction.mock.calls.length).to.equal(0);
    });
  });
});

describe('Test admin session', () => {

  it('check returns true when session expired', () => {
    const req = {'user': {'_json': {'extension_UserRole': 'SYSTEM_ADMIN'}}, 'session': {'sessionExpiry': new Date(Date.now() - 10000)}};
    expect(isAdminSessionExpire(req)).to.be.true;
  });

  it('check returns false when session is not expired', () => {
    const req = {'user': {'_json': {'extension_UserRole': 'SYSTEM_ADMIN'}}, 'session': {'sessionExpiry': new Date(Date.now() + 100000)}};
    expect(isAdminSessionExpire(req)).to.be.false;
  });

  it('check returns false when user is not admin', () => {
    const req = {'user': {'_json': {'extension_UserRole': 'VERIFIED'}}, 'session': {'sessionExpiry': new Date(Date.now())}};
    expect(isAdminSessionExpire(req)).to.be.false;
  });

  it('check returns false when fake session is not there', () => {
    const req = {'user': {'_json': {'extension_UserRole': 'VERIFIED'}}};
    expect(isAdminSessionExpire(req)).to.be.false;
  });

});

