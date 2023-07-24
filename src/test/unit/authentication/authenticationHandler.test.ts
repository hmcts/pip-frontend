import { expect } from 'chai';
import sinon from 'sinon';
import {
    checkAuthenticatedMedia,
    checkAuthenticatedAdmin,
    isPermittedMedia,
    isPermittedAdmin,
    isPermittedAccountCreation,
    isPermittedManualUpload,
    isPermittedMediaAccount,
    mediaVerificationHandling,
    processMediaAccountSignIn,
    processAdminAccountSignIn,
    processCftIdamSignIn,
    isPermittedSystemAdmin,
    checkPasswordReset,
    mapAzureLanguage,
    isPermittedAnyRole,
    forgotPasswordRedirect,
} from '../../../main/authentication/authenticationHandler';

import {
    manualUploadRoles,
    mediaAccountCreationRoles,
    verifiedRoles,
} from '../../../main/authentication/authenticationHelper';

import request from 'supertest';
import { app } from '../../../main/app';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import { SessionManagementService } from '../../../main/service/sessionManagementService';

const updateMediaAccountVerification = sinon.stub(
    AccountManagementRequests.prototype,
    'updateMediaAccountVerification'
);
updateMediaAccountVerification.resolves({});

const updateAccountLastSignedInDate = sinon.stub(AccountManagementRequests.prototype, 'updateAccountLastSignedInDate');
updateAccountLastSignedInDate.resolves({});

describe('Test Authenticated Admin', () => {
    it('check next is called if roles match', () => {
        const mockNextFunction = jest.fn(() => 4);
        const req = { user: { roles: 'SYSTEM_ADMIN' } };
        expect(checkAuthenticatedAdmin(req, {}, mockNextFunction, manualUploadRoles)).to.equal(4);
    });

    it('check redirect to admin dashboard if admin role but not permitted', () => {
        const mockRedirectFunction = jest.fn(argument => argument);

        const req = { user: { roles: 'SYSTEM_ADMIN' } };
        const res = { redirect: mockRedirectFunction };
        checkAuthenticatedAdmin(req, res, mockRedirectFunction, mediaAccountCreationRoles);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
    });

    it('check redirect to account home if verified role', () => {
        const mockRedirectFunction = jest.fn(argument => argument);

        const req = { user: { roles: 'VERIFIED' } };
        const res = { redirect: mockRedirectFunction };
        checkAuthenticatedAdmin(req, res, mockRedirectFunction, mediaAccountCreationRoles);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
    });

    it('check redirect to login if not authenticated', () => {
        const mockRedirectFunction = jest.fn(argument => argument);

        const req = {};
        const res = { redirect: mockRedirectFunction };
        checkAuthenticatedAdmin(req, res, mockRedirectFunction, mediaAccountCreationRoles);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.contains('/admin-login?p=');
    });
});

describe('Test Authenticated Media', () => {
    it('check next is called if roles match', () => {
        const mockNextFunction = jest.fn(() => 4);
        const req = { user: { roles: 'VERIFIED' } };
        expect(checkAuthenticatedMedia(req, {}, mockNextFunction, verifiedRoles)).to.equal(4);
    });

    it('check redirect to admin dashboard if actually an admin role', () => {
        const mockRedirectFunction = jest.fn(argument => argument);

        const req = { user: { roles: 'SYSTEM_ADMIN' } };
        const res = { redirect: mockRedirectFunction };
        checkAuthenticatedMedia(req, res, mockRedirectFunction, verifiedRoles);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
    });

    it('check redirect to login if not authenticated', () => {
        const mockRedirectFunction = jest.fn(argument => argument);

        const req = {};
        const res = { redirect: mockRedirectFunction };
        checkAuthenticatedMedia(req, res, mockRedirectFunction, verifiedRoles);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.contains('/sign-in');
    });
});

describe('Test IsPermittedMedia', () => {
    it('check returns next function if permitted', () => {
        const mockRedirectFunction = jest.fn(() => 4);
        const req = { user: { roles: 'VERIFIED' } };

        expect(isPermittedMedia(req, {}, mockRedirectFunction)).to.equal(4);
    });

    it('check redirect to admin-dashboard is called if not matched', () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = { user: { roles: 'SYSTEM_ADMIN' } };
        const res = { redirect: mockRedirectFunction };

        isPermittedMedia(req, res, mockRedirectFunction);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
    });
});

describe('Test Is Permitted Any Role', () => {
    it('check next is called if user has a role', () => {
        const mockNextFunction = jest.fn(() => 4);
        const req = { user: { roles: 'VERIFIED' } };
        expect(isPermittedAnyRole(req, {}, mockNextFunction)).to.equal(4);
    });

    it('check next is called if no role exists', () => {
        const mockRenderFunction = jest.fn((argument, argument2) => argument + argument2);

        const req = {
            user: {},
            lng: 'en',
            i18n: {
                getDataByLanguage: lng => {
                    return { error: lng };
                },
            },
        };
        const res = { render: mockRenderFunction };

        isPermittedAnyRole(req, res, () => 4);

        expect(mockRenderFunction.mock.calls.length).to.equal(1);
        expect(mockRenderFunction.mock.calls[0][0]).to.equal('error');
        expect(mockRenderFunction.mock.calls[0][1]).to.equal('en');
    });

    it('check next is called if no user exists', () => {
        const mockRenderFunction = jest.fn((argument, argument2) => argument + argument2);
        const req = {
            lng: 'en',
            i18n: {
                getDataByLanguage: lng => {
                    return { error: lng };
                },
            },
        };
        const res = { render: mockRenderFunction };

        isPermittedAnyRole(req, res, () => 4);

        expect(mockRenderFunction.mock.calls.length).to.equal(1);
        expect(mockRenderFunction.mock.calls[0][0]).to.equal('error');
        expect(mockRenderFunction.mock.calls[0][1]).to.equal('en');
    });
});

describe('Test IsPermittedAdmin', () => {
    it('check returns next function if permitted', () => {
        const mockRedirectFunction = jest.fn(() => 4);
        const req = { user: { roles: 'SYSTEM_ADMIN' } };

        expect(isPermittedAdmin(req, {}, mockRedirectFunction)).to.equal(4);
    });

    it('check redirect to admin-dashboard is called if not matched', () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = { user: { roles: 'VERIFIED' } };
        const res = { redirect: mockRedirectFunction };

        isPermittedAdmin(req, res, mockRedirectFunction);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
    });
});

describe('Test IsPermittedAccountCreation', () => {
    it('check returns next function if permitted', () => {
        const mockRedirectFunction = jest.fn(() => 4);
        const req = { user: { roles: 'INTERNAL_SUPER_ADMIN_CTSC' } };

        expect(isPermittedAccountCreation(req, {}, mockRedirectFunction)).to.equal(4);
    });

    it('check redirect to admin-dashboard is called if not matched', () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = { user: { roles: 'INTERNAL_ADMIN_LOCAL' } };
        const res = { redirect: mockRedirectFunction };

        isPermittedAccountCreation(req, res, mockRedirectFunction);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
    });
});

describe('Test IsPermittedManualUpload', () => {
    it('check returns next function if permitted', () => {
        const mockRedirectFunction = jest.fn(() => 4);
        const req = { user: { roles: 'INTERNAL_SUPER_ADMIN_CTSC' } };

        expect(isPermittedManualUpload(req, {}, mockRedirectFunction)).to.equal(4);
    });

    it('check redirect to admin-dashboard is called if not matched', () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = { user: { roles: 'VERIFIED' } };
        const res = { redirect: mockRedirectFunction };

        isPermittedManualUpload(req, res, mockRedirectFunction);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
    });
});

describe('Test IsPermittedMediaAccount', () => {
    it('check returns next function if permitted', () => {
        const mockRedirectFunction = jest.fn(() => 4);
        const req = { user: { roles: 'INTERNAL_ADMIN_CTSC' } };

        expect(isPermittedMediaAccount(req, {}, mockRedirectFunction)).to.equal(4);
    });

    it('check redirect to admin-dashboard is called if not matched', () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = { user: { roles: 'INTERNAL_SUPER_ADMIN_LOCAL' } };
        const res = { redirect: mockRedirectFunction };

        isPermittedMediaAccount(req, res, mockRedirectFunction);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
    });
});

describe('Test IsPermittedSystemAdmin', () => {
    it('check returns next function if permitted', () => {
        const mockRedirectFunction = jest.fn(() => 4);
        const req = { user: { roles: 'SYSTEM_ADMIN' } };

        expect(isPermittedSystemAdmin(req, {}, mockRedirectFunction)).to.equal(4);
    });

    it('check redirect to admin-dashboard is called if not matched', () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = { user: { roles: 'INTERNAL_SUPER_ADMIN_LOCAL' } };
        const res = { redirect: mockRedirectFunction };

        isPermittedSystemAdmin(req, res, mockRedirectFunction);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
    });
});

describe('forgot password reset', () => {
    test('should redirect to azure again if password reset error is returned from the B2C with the correct media redirect url', async () => {
        await request(app)
            .post('/login/return')
            .send({ error: 'access_denied', error_description: 'AADB2C90118' })
            .expect(res => expect(res.redirect).to.be.true)
            .expect(res => expect(res.header.location).to.contain('response_type=code'))
            .expect(res => expect(res.header.location).to.contain('response_mode=form_post'))
            .expect(res => expect(res.header.location).to.contain('/password-change-confirmation/false'));
    });

    test('should redirect to azure again if password reset error is returned from the B2C with the correct admin redirect url', async () => {
        await request(app)
            .post('/login/admin/return')
            .send({ error: 'access_denied', error_description: 'AADB2C90118' })
            .expect(res => expect(res.redirect).to.be.true)
            .expect(res => expect(res.header.location).to.contain('/password-change-confirmation/true'));
    });
});

describe('media verification handling', () => {
    it('should redirect to account home with verified banner', async () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = { user: { roles: 'VERIFIED', oid: '1234' } };
        const res = { redirect: mockRedirectFunction };

        await mediaVerificationHandling(req, res);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(updateMediaAccountVerification.calledWith('1234')).to.be.true;
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home?verified=true');
    });

    it('should not redirect to account home if user role is not verified', async () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = { user: { roles: 'INTERNAL_SUPER_ADMIN_LOCAL' } };
        const res = { redirect: mockRedirectFunction };

        await mediaVerificationHandling(req, res);

        expect(mockRedirectFunction.mock.calls.length).to.equal(0);
    });

    it('should not redirect to account home if no user was provided', async () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = {};
        const res = { redirect: mockRedirectFunction };

        await mediaVerificationHandling(req, res);

        expect(mockRedirectFunction.mock.calls.length).to.equal(0);
    });
});

describe('process account sign-in', () => {
    const sessionManagementServiceStub = sinon.stub(SessionManagementService.prototype, 'logOut');

    it('should redirect to admin dashboard for an admin user', async () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = { user: { roles: 'INTERNAL_SUPER_ADMIN_CTSC', oid: '1234' } };
        const res = { redirect: mockRedirectFunction };

        await processAdminAccountSignIn(req, res);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(updateAccountLastSignedInDate.calledWith('PI_AAD', '1234')).to.be.true;
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/admin-dashboard');
    });

    it('should redirect to system dashboard for a system admin user', async () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = { user: { roles: 'SYSTEM_ADMIN', oid: '1235' } };
        const res = { redirect: mockRedirectFunction };

        await processAdminAccountSignIn(req, res);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(updateAccountLastSignedInDate.calledWith('PI_AAD', '1235')).to.be.true;
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/system-admin-dashboard');
    });

    it('should redirect to admin account reject screen for a non admin user trying to login via admin flow', async () => {
        const req = { user: { roles: 'SYSTEM_ADMIN', oid: '1236' } };
        const res = {};

        await processMediaAccountSignIn(req, res);

        expect(sessionManagementServiceStub.calledWith(req, res, true)).to.be.true;
    });

    it('should redirect to media account reject screen for a non admin user trying to login via admin flow', async () => {
        const req = { user: { roles: 'VERIFIED', oid: '1236' } };
        const res = {};

        await processAdminAccountSignIn(req, res);

        expect(sessionManagementServiceStub.calledWith(req, res, true)).to.be.true;
    });

    it('should redirect to account home for a media user', async () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = { user: { roles: 'VERIFIED', oid: '1236' } };
        const res = { redirect: mockRedirectFunction };

        await processMediaAccountSignIn(req, res);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(updateAccountLastSignedInDate.calledWith('PI_AAD', '1236')).to.be.true;
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
    });
});

describe('process account password change confirmation', () => {
    it('should continue to next middleware when no error returned', async () => {
        const mockFunction = jest.fn(argument => argument);
        const req = { body: {} };
        const res = {};
        const next = mockFunction;

        checkPasswordReset(req, res, next);

        expect(mockFunction.mock.calls.length).to.equal(1);
    });

    it('should redirect to cancelled password reset when error is confirmed', async () => {
        const isAdmin = true;
        const mockFunction = jest.fn(argument => argument);
        const req = { body: { error_description: 'AADB2C90091' }, params: { isAdmin: isAdmin } };
        const res = { redirect: mockFunction };
        const next = null;

        checkPasswordReset(req, res, next);

        expect(mockFunction.mock.calls.length).to.equal(1);
        expect(mockFunction.mock.calls[0][0]).to.equal('/cancelled-password-reset/' + isAdmin);
    });
});

describe('process cft sign in', () => {
    it('should redirect to account home when signing in via cft idam', async () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const req = { user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM', provenanceUserId: '12345' } };
        const res = { redirect: mockRedirectFunction };

        await processCftIdamSignIn(req, res);

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.equal('/account-home');
    });
});

describe('test map azure language', () => {
    it('should map azure language to english', () => {
        const returnedLanguage = mapAzureLanguage('en');
        expect(returnedLanguage).to.equal('en');
    });

    it('should map azure language to welsh', () => {
        const returnedLanguage = mapAzureLanguage('cy');
        expect(returnedLanguage).to.equal('cy-GB');
    });
});

describe('test forgotten password redirect', () => {
    it('test next is called if not a forgotten password reset', () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const res = {};
        const req = { body: {} };

        forgotPasswordRedirect(req, res, mockRedirectFunction);
        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
    });

    it('test redirect is called with login return', () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const res = { redirect: mockRedirectFunction };
        const next = () => {
            return 0;
        };
        const req = { body: { test: 'AADB2C90118' }, originalUrl: '/login' };

        forgotPasswordRedirect(req, res, next());

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.contain('/password-change-confirmation/false');
    });

    it('test redirect is called with admin return', () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const res = { redirect: mockRedirectFunction };
        const next = () => {
            return 0;
        };
        const req = { body: { test: 'AADB2C90118' }, originalUrl: '/login/admin/return' };

        forgotPasswordRedirect(req, res, next());

        expect(mockRedirectFunction.mock.calls.length).to.equal(1);
        expect(mockRedirectFunction.mock.calls[0][0]).to.contain('/password-change-confirmation/true');
    });

    it('test redirect is called with english language', () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const res = { redirect: mockRedirectFunction };
        const next = () => {
            return 0;
        };
        const req = { body: { test: 'AADB2C90118' }, originalUrl: '/login', lng: 'en' };

        forgotPasswordRedirect(req, res, next());

        expect(mockRedirectFunction.mock.calls[0][0]).to.contain('ui_locales=en');
    });

    it('test redirect is called with welsh language', () => {
        const mockRedirectFunction = jest.fn(argument => argument);
        const res = { redirect: mockRedirectFunction };
        const next = () => {
            return 0;
        };
        const req = { body: { test: 'AADB2C90118' }, originalUrl: '/login', lng: 'cy' };

        forgotPasswordRedirect(req, res, next());

        expect(mockRedirectFunction.mock.calls[0][0]).to.contain('ui_locales=cy-GB');
    });
});
