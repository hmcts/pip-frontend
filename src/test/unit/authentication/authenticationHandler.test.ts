import {expect} from 'chai';
import sinon from 'sinon';
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
  mediaVerificationHandling,
  processMediaAccountSignIn,
  processAdminAccountSignIn, processCftIdamSignIn,
}
  from '../../../main/authentication/authenticationHandler';

import request from 'supertest';
import {app} from '../../../main/app';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';

const updateMediaAccountVerification = sinon.stub(AccountManagementRequests.prototype, 'updateMediaAccountVerification');
updateMediaAccountVerification.resolves({});

const updateAdminAccountLastSignedInDate = sinon.stub(AccountManagementRequests.prototype, 'updateAccountLastSignedInDate');
updateAdminAccountLastSignedInDate.resolves({});

describe('Test checking user roles', () => {

  it('check that check roles returns true when matched', () => {
    const req = {'user': {'roles': 'SYSTEM_ADMIN'}};
    expect(checkRoles(req, manualUploadRoles)).to.be.true;
  });

  it('check that check roles returns false when matched', () => {
    const req = {'user': {'roles': 'SYSTEM_ADMIN'}};
    expect(checkRoles(req, mediaAccountCreationRoles)).to.be.false;
  });

  it('check that roles returns false when no user', () => {
    expect(checkRoles({}, mediaAccountCreationRoles)).to.be.false;
  });

  it('check that roles returns false when no roles', () => {
    expect(checkRoles({'user': {}}, mediaAccountCreationRoles)).to.be.false;
  });
});

describe('Test Authenticated Admin', () => {

  it('check next is called if roles match', () => {
    const mockNextFunction = jest.fn(() => 4);
    const req = {'user': {'roles': 'SYSTEM_ADMIN'}};
    expect(checkAuthenticatedAdmin(req, {}, mockNextFunction, manualUploadRoles)).to.equal(4);
  });

  it('check redirect to admin dashboard if admin role but not permitted', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);

    const req = {'user': {'roles': 'SYSTEM_ADMIN'}};
    const res = {'redirect': mockRedirectFunction};
    checkAuthenticatedAdmin(req, res, mockRedirectFunction, mediaAccountCreationRoles);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
  });

  it('check redirect to account home if verified role', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);

    const req = {'user': {'roles': 'VERIFIED'}};
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
    const req = {'user': {'roles': 'VERIFIED'}};
    expect(checkAuthenticatedMedia(req, {}, mockNextFunction, verifiedRoles)).to.equal(4);
  });

  it('check redirect to admin dashboard if actually an admin role', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);

    const req = {'user': {'roles': 'SYSTEM_ADMIN'}};
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
    const req = {'user': {'roles': 'VERIFIED'}};

    expect(isPermittedMedia(req, {}, mockRedirectFunction)).to.equal(4);
  });

  it('check redirect to admin-dashboard is called if not matched', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'roles': 'SYSTEM_ADMIN'}};
    const res = {'redirect': mockRedirectFunction};

    isPermittedMedia(req, res, mockRedirectFunction);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
  });

});

describe('Test IsPermittedAdmin', () => {

  it('check returns next function if permitted', () => {
    const mockRedirectFunction = jest.fn(() => 4);
    const req = {'user': {'roles': 'SYSTEM_ADMIN'}};

    expect(isPermittedAdmin(req, {}, mockRedirectFunction)).to.equal(4);
  });

  it('check redirect to admin-dashboard is called if not matched', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'roles': 'VERIFIED'}};
    const res = {'redirect': mockRedirectFunction};

    isPermittedAdmin(req, res, mockRedirectFunction);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
  });

});

describe('Test IsPermittedAccountCreation', () => {

  it('check returns next function if permitted', () => {
    const mockRedirectFunction = jest.fn(() => 4);
    const req = {'user': {'roles': 'INTERNAL_SUPER_ADMIN_CTSC'}};

    expect(isPermittedAccountCreation(req, {}, mockRedirectFunction)).to.equal(4);
  });

  it('check redirect to admin-dashboard is called if not matched', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'roles': 'INTERNAL_ADMIN_LOCAL'}};
    const res = {'redirect': mockRedirectFunction};

    isPermittedAccountCreation(req, res, mockRedirectFunction);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
  });

});

describe('Test IsPermittedManualUpload', () => {

  it('check returns next function if permitted', () => {
    const mockRedirectFunction = jest.fn(() => 4);
    const req = {'user': {'roles': 'INTERNAL_SUPER_ADMIN_CTSC'}};

    expect(isPermittedManualUpload(req, {}, mockRedirectFunction)).to.equal(4);
  });

  it('check redirect to admin-dashboard is called if not matched', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'roles': 'VERIFIED'}};
    const res = {'redirect': mockRedirectFunction};

    isPermittedManualUpload(req, res, mockRedirectFunction);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
  });

});

describe('Test IsPermittedMediaAccount', () => {

  it('check returns next function if permitted', () => {
    const mockRedirectFunction = jest.fn(() => 4);
    const req = {'user': {'roles': 'INTERNAL_ADMIN_CTSC'}};

    expect(isPermittedMediaAccount(req, {}, mockRedirectFunction)).to.equal(4);
  });

  it('check redirect to admin-dashboard is called if not matched', () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'roles': 'INTERNAL_SUPER_ADMIN_LOCAL'}};
    const res = {'redirect': mockRedirectFunction};

    isPermittedMediaAccount(req, res, mockRedirectFunction);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
  });
});

describe('forgot password reset', () => {
  test('should redirect to azure again if password reset error is returned from the B2C with the correct media redirect url', async () => {
    await request(app)
      .post('/login/return')
      .send({'error': 'access_denied', 'error_description': 'AADB2C90118'})
      .expect((res) => expect(res.redirect).to.be.true)
      .expect((res) => expect(res.header.location).to.contain('/password-change-confirmation/false'));
  });

  test('should redirect to azure again if password reset error is returned from the B2C with the correct admin redirect url', async () => {
    await request(app)
      .post('/login/admin/return')
      .send({'error': 'access_denied', 'error_description': 'AADB2C90118'})
      .expect((res) => expect(res.redirect).to.be.true)
      .expect((res) => expect(res.header.location).to.contain('/password-change-confirmation/true'));
  });
});

describe('media verification handling', () => {
  it('should redirect to account home with verified banner', async () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'roles': 'VERIFIED', 'oid': '1234'}};
    const res = {'redirect': mockRedirectFunction};

    await mediaVerificationHandling(req, res);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(updateMediaAccountVerification.calledWith('1234')).to.be.true;
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home?verified=true');
  });

  it('should not redirect to account home if user role is not verified', async () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'roles': 'INTERNAL_SUPER_ADMIN_LOCAL'}};
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

describe('process account sign-in', () => {
  it('should redirect to admin dashboard for an admin user', async () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'roles': 'INTERNAL_SUPER_ADMIN_CTSC', oid: '1234'}};
    const res = {'redirect': mockRedirectFunction};

    await processAdminAccountSignIn(req, res);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(updateAdminAccountLastSignedInDate.calledWith('PI_AAD', '1234')).to.be.true;
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
  });

  it('should redirect to account home for an media user trying to sign in as an admin', async () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'roles': 'VERIFIED', provenanceUserId: '12345'}};
    const res = {'redirect': mockRedirectFunction};

    await processAdminAccountSignIn(req, res);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(updateAdminAccountLastSignedInDate.calledWith('PI_AAD', '12345')).to.be.false;
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
  });

  it('should redirect to account home for a media user', async () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'roles': 'VERIFIED'}};
    const res = {'redirect': mockRedirectFunction};

    await processMediaAccountSignIn(req, res);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
  });
});

describe('process cft sign in', () => {

  it('should redirect to account home when signing in via cft idam', async () => {
    const mockRedirectFunction = jest.fn((argument) => argument);
    const req = {'user': {'roles': 'VERIFIED', userProvenance: 'CFT_IDAM', provenanceUserId: '12345'}};
    const res = {'redirect': mockRedirectFunction};

    await processCftIdamSignIn(req, res);

    expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
  });

});
