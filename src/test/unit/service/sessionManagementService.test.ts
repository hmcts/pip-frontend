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
  const mediaLogOutPath = 'https://sign-in.pip-frontend.staging.platform.hmcts.net/pip-frontend.staging.platform.hmcts.net/B2C_1_SignInUserFlow/oauth2/v2.0/logout'
  const adminLogOutPath = 'https://staff.pip-frontend.staging.platform.hmcts.net/pip-frontend.staging.platform.hmcts.net/B2C_1_SignInAdminUserFlow/oauth2/v2.0/logout'
  const encodedAppUrl = 'https%3A%2F%2Flocalhost%3A8080%2F'

  const mediaLogOutUrl = `${mediaLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-logged-out%3Flng%3Den`;
  const mediaWelshLogOutUrl = `${mediaLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-logged-out%3Flng%3Dcy`;
  const adminLogOutUrl = `${adminLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-logged-out%3Flng%3Den`;
  const adminWelshLogOutUrl = `${adminLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-logged-out%3Flng%3Dcy`;
  const mediaSessionExpiredUrl = `${mediaLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-expired%3Flng%3Den%26reSignInUrl%3Dsign-in`
  const adminSessionExpiredUrl = `${adminLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-expired%3Flng%3Den%26reSignInUrl%3Dadmin-dashboard`;
  const adminRejectedLoginUrl = `${mediaLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}admin-rejected-login%3Flng%3Den`;

  it('should redirect for media user', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').once().withArgs(mediaLogOutUrl);

    const req = {'user': {'_json': {'extension_UserRole': 'VERIFIED'}}, 'lng': 'en', 'session': {}};
    sessionManagementService.logOut(req, res, false, false);
    expect(req.session).to.be.null;
    responseMock.verify();
  });

  it('should redirect for media user in Welsh', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').once().withArgs(mediaWelshLogOutUrl);

    const req = {'user': {'_json': {'extension_UserRole': 'VERIFIED'}}, 'lng': 'cy', 'session': {}};
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

  it('should redirect for admin user in Welsh', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').once().withArgs(adminWelshLogOutUrl);

    const req = {'user': {'_json': {'extension_UserRole': 'SYSTEM_ADMIN'}}, 'lng': 'cy', 'session': {}};
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

    const req = {'user': {'_json': {'extension_UserRole': 'INTERNAL_SUPER_ADMIN_LOCAL'}}, 'lng': 'en', 'session': {}};
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
