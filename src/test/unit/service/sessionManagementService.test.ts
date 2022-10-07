import sinon from 'sinon';
import {expect} from 'chai';
import {Response} from 'express';
import {SessionManagementService} from '../../../main/service/sessionManagementService';

const sessionManagementService = new SessionManagementService();
const res = {
  redirect: function() {return '';},
  clearCookie: function() {return '';},
} as unknown as Response;

describe('Test logout', () => {
  const mediaLogOutUrl = 'https://hmctspipnonprod.b2clogin.com/hmctspipnonprod.onmicrosoft.com/B2C_1_SignInUserFlow/oauth2/v2.0/logout?post_logout_redirect_uri=https%3A%2F%2Flocalhost%3A8080%2Fsession-logged-out%3Flng%3Den';
  const adminLogOutUrl = 'https://hmctspipnonprod.b2clogin.com/hmctspipnonprod.onmicrosoft.com/B2C_1_SignInAdminUserFlow/oauth2/v2.0/logout?post_logout_redirect_uri=https%3A%2F%2Flocalhost%3A8080%2Fsession-logged-out%3Flng%3Den';
  const mediaSessionExpiredUrl = 'https://hmctspipnonprod.b2clogin.com/hmctspipnonprod.onmicrosoft.com/B2C_1_SignInUserFlow/oauth2/v2.0/logout?post_logout_redirect_uri=https%3A%2F%2Flocalhost%3A8080%2Fsession-expired%3Flng%3Den%26admin%3Dfalse'
  const adminSessionExpiredUrl = 'https://hmctspipnonprod.b2clogin.com/hmctspipnonprod.onmicrosoft.com/B2C_1_SignInAdminUserFlow/oauth2/v2.0/logout?post_logout_redirect_uri=https%3A%2F%2Flocalhost%3A8080%2Fsession-expired%3Flng%3Dcy%26admin%3Dtrue';
  const adminRejectedLoginUrl = 'https://hmctspipnonprod.b2clogin.com/hmctspipnonprod.onmicrosoft.com/B2C_1_SignInUserFlow/oauth2/v2.0/logout?post_logout_redirect_uri=https%3A%2F%2Flocalhost%3A8080%2Fadmin-rejected-login%3Flng%3Den';

  it('should redirect for media user', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').once().withArgs(mediaLogOutUrl);

    const req = {'user': {'_json': {'extension_UserRole': 'VERIFIED'}}, 'lng': 'en', 'session': {}};
    sessionManagementService.logOut(req, res, false, false);
    expect(req.session).to.be.null;
    responseMock.verify();
  });

  it('should redirect for admin user', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').once().withArgs(adminLogOutUrl);

    const req = {'user': {'_json': {'extension_UserRole': 'SYSTEM_ADMIN'}}, 'lng': 'en', 'session': {}};
    sessionManagementService.logOut(req, res, false, false);
    expect(req.session).to.be.null;
    responseMock.verify();
  });

  it('should redirect for media user when session expired', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').once().withArgs(mediaSessionExpiredUrl);

    const req = {'user': {'_json': {'extension_UserRole': 'VERIFIED'}}, 'lng': 'en', 'session': {}};
    sessionManagementService.logOut(req, res, false, true);
    expect(req.session).to.be.null;
    responseMock.verify();
  });

  it('should redirect for admin user when session expired', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').once().withArgs(adminSessionExpiredUrl);

    const req = {'user': {'_json': {'extension_UserRole': 'INTERNAL_SUPER_ADMIN_LOCAL'}}, 'lng': 'cy', 'session': {}};
    sessionManagementService.logOut(req, res, false, true);
    expect(req.session).to.be.null;
    responseMock.verify();
  });

  it('should redirect for admin rejected login', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').once().withArgs(adminRejectedLoginUrl);

    const req = {'user': {'_json': {'extension_UserRole': 'INTERNAL_SUPER_ADMIN_CTSC'}}, 'lng': 'en', 'session': {}};
    sessionManagementService.logOut(req, res, true, false);
    expect(req.session).to.be.null;
    responseMock.verify();
  });
});
