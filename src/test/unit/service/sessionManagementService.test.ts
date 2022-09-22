import sinon from 'sinon';
import {expect} from 'chai';
import {Response} from 'express';
import {SessionManagementService} from '../../../main/service/sessionManagementService';

const sessionManagementService = new SessionManagementService();
const res = {
  redirect: function() {return '';},
  clearCookie: function() {return '';},
} as unknown as Response;

describe('Test admin session expiry', () => {

  const now = Date.now();
  const adminLogoutUrl = 'https://hmctspipnonprod.b2clogin.com/hmctspipnonprod.onmicrosoft.com/B2C_1_SignInAdminUserFlow/oauth2/v2.0/logout?post_logout_redirect_uri=https%3A%2F%2Flocalhost%3A8080%2Fadmin-dashboard%3Flng%3Den';

  it('check returns true when session expired', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').once().withArgs(adminLogoutUrl);

    const req = {'user': {'roles': 'SYSTEM_ADMIN', 'userProvenance': 'PI_AAD'}, 'session': {'sessionExpires': new Date(now - 10000)}, 'lng': 'en'};
    expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
    expect(req.session).to.be.null;
    responseMock.verify();
  });

  it('check returns false when session is not expired', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').never();

    const req = {'user': {'roles': 'SYSTEM_ADMIN', 'userProvenance': 'PI_AAD'}, 'session': {'sessionExpires': new Date(now + 100000)}, 'lng': 'en'};
    expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
    responseMock.verify();
  });

  it('check returns false when the session expires value is missing', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').never();

    const req = {'user': {'roles': 'SYSTEM_ADMIN', 'userProvenance': 'PI_AAD'}, 'session': {}, 'lng': 'en'};
    expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
    responseMock.verify();
  });

});

describe('Test PI AAD media user session expiry', () => {
  const now = Date.now();
  const mediaLogoutUrl = 'https://hmctspipnonprod.b2clogin.com/hmctspipnonprod.onmicrosoft.com/B2C_1_SignInUserFlow/oauth2/v2.0/logout?post_logout_redirect_uri=https%3A%2F%2Flocalhost%3A8080%2Fview-option%3Flng%3Den';

  it('check returns true when session expired', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').once().withArgs(mediaLogoutUrl);

    const req = {'user': {'roles': 'VERIFIED', 'userProvenance': 'PI_AAD'}, 'session': {'sessionExpires': new Date(now - 10000)}, 'lng': 'en'};
    expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
    expect(req.session).to.be.null;
    responseMock.verify();
  });

  it('check returns false when session is not expired', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').never();

    const req = {'user': {'roles': 'VERIFIED', 'userProvenance': 'PI_AAD'}, 'session': {'sessionExpires': new Date(now + 100000)}, 'lng': 'en'};
    expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
    responseMock.verify();
  });

  it('check returns false when the session expires value is missing', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').never();

    const req = {'user': {'roles': 'VERIFIED', 'userProvenance': 'PI_AAD'}, 'session': {}, 'lng': 'en'};
    expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
    responseMock.verify();
  });

  it('check returns false when no user details', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').never();

    const req = {'session': {'sessionExpires': new Date(now - 10000)}, 'lng': 'en'};
    expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
    responseMock.verify();
  });
});

describe('Test CFT IDAM user session expiry', () => {
  const now = Date.now();
  const cftIdamLogoutUrl = '/view-option';

  it('check returns true when session expired', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').once().withArgs(cftIdamLogoutUrl);

    const req = {'user': {'roles': 'VERIFIED', 'userProvenance': 'CFT_IDAM'}, 'session': {'sessionExpires': new Date(now - 10000)}, 'lng': 'en'};
    expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
    expect(req.session).to.be.null;
    responseMock.verify();
  });

  it('check returns false when session is not expired', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').never();

    const req = {'user': {'roles': 'VERIFIED', 'userProvenance': 'CFT_IDAM'}, 'session': {'sessionExpires': new Date(now + 100000)}, 'lng': 'en'};
    expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
    responseMock.verify();
  });

  it('check returns false when the session expires value is missing', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').never();

    const req = {'user': {'roles': 'VERIFIED', 'userProvenance': 'CFT_IDAM'}, 'session': {}, 'lng': 'en'};
    expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
    responseMock.verify();
  });

  it('check returns false when no user details', () => {
    const responseMock = sinon.mock(res);
    responseMock.expects('redirect').never();

    const req = {'session': {'sessionExpires': new Date(now - 10000)}, 'lng': 'en'};
    expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
    responseMock.verify();
  });

});
