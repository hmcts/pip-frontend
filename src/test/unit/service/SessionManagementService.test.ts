import sinon from 'sinon';
import { expect } from 'chai';
import { Response } from 'express';
import { SessionManagementService } from '../../../main/service/SessionManagementService';

const sessionManagementService = new SessionManagementService();
const res = {
    redirect: function () {
        return '';
    },
    clearCookie: function () {
        return '';
    },
    render: function () {
        return '';
    },
} as unknown as Response;

const mockSession = {
    save: callback => callback(),
    regenerate: callback => callback(),
};

describe('Test logout', () => {
    const mediaLogOutPath =
        'https://hmctspipnonprod.b2clogin.com/hmctspipnonprod.onmicrosoft.com/B2C_1_SignInUserFlow/oauth2/v2.0/logout';
    const adminLogOutPath =
        'https://hmctspipnonprod.b2clogin.com/hmctspipnonprod.onmicrosoft.com/B2C_1_SignInAdminUserFlow/oauth2/v2.0/logout';
    const encodedAppUrl = 'https%3A%2F%2Flocalhost%3A8080%2F';

    const mediaLogOutUrl = `${mediaLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-logged-out%3Flng%3Den`;
    const mediaWelshLogOutUrl = `${mediaLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-logged-out%3Flng%3Dcy`;
    const cftIdamLogoutUrl = '/session-logged-out?lng=en';
    const welshCftIdamLogoutUrl = '/session-logged-out?lng=cy';
    const ssoLogoutUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${encodedAppUrl}session-logged-out%3Flng%3Den`;
    const ssoWelshLogoutUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${encodedAppUrl}session-logged-out%3Flng%3Dcy`;
    const adminLogOutUrl = `${adminLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-logged-out%3Flng%3Den`;
    const adminWelshLogOutUrl = `${adminLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-logged-out%3Flng%3Dcy`;
    const mediaSessionExpiredUrl = `${mediaLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-expired%3Flng%3Den%26reSignInUrl%3DAAD`;
    const adminSessionExpiredUrl = `${adminLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-expired%3Flng%3Den%26reSignInUrl%3DADMIN`;
    const cftIdamSessionExpiredUrl = '/session-expired?lng=en&reSignInUrl=CFT';
    const ssoSessionExpiredUrl = '/session-expired?lng=en&reSignInUrl=SSO';
    const adminRejectedLoginUrl = `${mediaLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}admin-rejected-login%3Flng%3Den`;
    const mediaRejectedLoginUrl = `${adminLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}media-rejected-login%3Flng%3Den`;

    it('should call save session', () => {
        const mockFunction = jest.fn();

        const req = {
            session: { save: () => mockFunction() },
            user: { userProvenance: 'PI_AAD' },
        };
        sessionManagementService.logOut(req, res, false, false);

        expect(mockFunction.mock.calls).to.have.length(1);
    });

    it('should call regenerate session', () => {
        const mockFunction = jest.fn();

        const req = {
            session: {
                save: callback => callback(),
                regenerate: () => mockFunction(),
            },
            user: { userProvenance: 'PI_AAD' },
        };
        sessionManagementService.logOut(req, res, false, false);

        expect(mockFunction.mock.calls).to.have.length(1);
    });

    it('should redirect to session expired if session is expired and no user set', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs('/session-expired?lng=en&reSignInUrl=AAD');

        const req = { session: {}, lng: 'en', query: { redirectType: 'AAD' } };
        sessionManagementService.logOut(req, res, false, true);

        responseMock.verify();
    });

    it('should redirect to session expired if session is expired and unknown redirect type is set', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('render').once().withArgs('error');

        const req = {
            session: {},
            lng: 'en',
            query: { redirectType: 'UNKNOWN_TYPE' },
            i18n: {
                getDataByLanguage: lng => {
                    return { error: lng };
                },
            },
        };
        sessionManagementService.logOut(req, res, false, true);

        responseMock.verify();
    });

    it('should redirect to session logged out if session is expired, no user set, and no query', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(cftIdamLogoutUrl);

        const req = { session: {}, lng: 'en' };
        sessionManagementService.logOut(req, res, false, true);

        responseMock.verify();
    });

    it('should redirect to session logged out if session is expired, no user set, and no query redirect type', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(cftIdamLogoutUrl);

        const req = { session: {}, lng: 'en', query: {} };
        sessionManagementService.logOut(req, res, false, true);

        responseMock.verify();
    });

    it('should redirect to session logged out if not session expired', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(cftIdamLogoutUrl);

        const req = { session: {}, lng: 'en', query: { redirectType: 'AAD' } };
        sessionManagementService.logOut(req, res, false, false);

        responseMock.verify();
    });

    it('should redirect for media user', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(mediaLogOutUrl);
        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'PI_AAD' },
            lng: 'en',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for media user in Welsh', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(mediaWelshLogOutUrl);

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'PI_AAD' },
            lng: 'cy',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for CFT IDAM User', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(cftIdamLogoutUrl);

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM' },
            lng: 'en',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for CFT IDAM User in Welsh', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(welshCftIdamLogoutUrl);

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM' },
            lng: 'cy',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for SSO User', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(ssoLogoutUrl);

        const req = {
            user: { roles: 'INTERNAL_ADMIN_CTSC', userProvenance: 'SSO' },
            lng: 'en',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for SSO User in Welsh', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(ssoWelshLogoutUrl);

        const req = {
            user: { roles: 'INTERNAL_ADMIN_CTSC', userProvenance: 'SSO' },
            lng: 'cy',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for admin user', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(adminLogOutUrl);

        const req = {
            user: { roles: 'SYSTEM_ADMIN', userProvenance: 'PI_AAD' },
            lng: 'en',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for admin user in Welsh', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(adminWelshLogOutUrl);

        const req = {
            user: { roles: 'SYSTEM_ADMIN', userProvenance: 'PI_AAD' },
            lng: 'cy',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for media user when session expired', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(mediaSessionExpiredUrl);

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'PI_AAD' },
            lng: 'en',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, false, true);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for admin user when session expired', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(adminSessionExpiredUrl);

        const req = {
            user: { roles: 'INTERNAL_SUPER_ADMIN_LOCAL', userProvenance: 'PI_AAD' },
            lng: 'en',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, false, true);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for CFT IDAM user when session expired', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(cftIdamSessionExpiredUrl);

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM' },
            lng: 'en',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, false, true);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for SSO user when session expired', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(ssoSessionExpiredUrl);

        const req = {
            user: { roles: 'INTERNAL_ADMIN_CTSC', userProvenance: 'SSO' },
            lng: 'en',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, false, true);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for admin rejected login', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(adminRejectedLoginUrl);

        const req = {
            user: { roles: 'INTERNAL_SUPER_ADMIN_CTSC', userProvenance: 'PI_AAD' },
            lng: 'en',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, true, false);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    it('should redirect for media rejected login', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(mediaRejectedLoginUrl);

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'PI_AAD' },
            lng: 'en',
            session: { ...mockSession },
        };
        sessionManagementService.logOut(req, res, true, false);
        expect(req.session['user']).to.be.null;
        responseMock.verify();
    });

    describe('Test admin session expiry', () => {
        const now = Date.now();

        it('check returns true when session expired', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').once().withArgs(adminLogOutUrl);

            const req = {
                user: { roles: 'SYSTEM_ADMIN', userProvenance: 'PI_AAD' },
                session: { ...{ sessionExpires: new Date(now - 10000) }, ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
            expect(req.session['user']).to.be.null;
            responseMock.verify();
        });

        it('check returns false when session is not expired', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                user: { roles: 'SYSTEM_ADMIN', userProvenance: 'PI_AAD' },
                session: { ...{ sessionExpires: new Date(now + 100000) }, ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });

        it('check returns false when the session expires value is missing', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                user: { roles: 'SYSTEM_ADMIN', userProvenance: 'PI_AAD' },
                session: { ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });
    });

    describe('Test media user session expiry', () => {
        const now = Date.now();

        it('check returns true when session expired', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').once().withArgs(mediaLogOutUrl);

            const req = {
                user: { roles: 'VERIFIED', userProvenance: 'PI_AAD' },
                session: { ...{ sessionExpires: new Date(now - 10000) }, ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
            expect(req.session['user']).to.be.null;
            responseMock.verify();
        });

        it('check returns false when session is not expired', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                user: { roles: 'VERIFIED', userProvenance: 'PI_AAD' },
                session: { ...{ sessionExpires: new Date(now + 100000) }, ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });

        it('check returns false when the session expires value is missing', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                user: { roles: 'VERIFIED', userProvenance: 'PI_AAD' },
                session: { ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });

        it('check returns false when no user details', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                session: { ...{ sessionExpires: new Date(now - 10000) }, ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });
    });

    describe('Test CFT IDAM user session expiry', () => {
        const now = Date.now();

        it('check returns true when session expired', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').once().withArgs(cftIdamLogoutUrl);

            const req = {
                user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM' },
                session: { ...{ sessionExpires: new Date(now - 10000) }, ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
            expect(req.session['user']).to.be.null;
            responseMock.verify();
        });

        it('check returns true when session expired in welsh', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').once().withArgs(welshCftIdamLogoutUrl);

            const req = {
                user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM' },
                session: { ...{ sessionExpires: new Date(now - 10000) }, ...mockSession },
                lng: 'cy',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
            expect(req.session['user']).to.be.null;
            responseMock.verify();
        });

        it('check returns false when session is not expired', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM' },
                session: { ...{ sessionExpires: new Date(now + 100000) }, ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });

        it('check returns false when the session expires value is missing', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM' },
                session: { ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });

        it('check returns false when no user details', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();
            const req = {
                session: { ...{ sessionExpires: new Date(now - 10000) }, ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });
    });

    describe('Test SSO user session expiry', () => {
        const now = Date.now();

        it('check returns true when session expired', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').once().withArgs(ssoLogoutUrl);

            const req = {
                user: { roles: 'SYSTEM_ADMIN', userProvenance: 'SSO' },
                session: { ...{ sessionExpires: new Date(now - 10000) }, ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
            expect(req.session['user']).to.be.null;
            responseMock.verify();
        });

        it('check returns true when session expired in welsh', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').once().withArgs(ssoWelshLogoutUrl);

            const req = {
                user: { roles: 'SYSTEM_ADMIN', userProvenance: 'SSO' },
                session: { ...{ sessionExpires: new Date(now - 10000) }, ...mockSession },
                lng: 'cy',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
            expect(req.session['user']).to.be.null;
            responseMock.verify();
        });

        it('check returns false when session is not expired', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                user: { roles: 'SYSTEM_ADMIN', userProvenance: 'SSO' },
                session: { ...{ sessionExpires: new Date(now + 100000) }, ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });

        it('check returns false when the session expires value is missing', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                user: { roles: 'SYSTEM_ADMIN', userProvenance: 'SSO' },
                session: { ...mockSession },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });
    });
});
