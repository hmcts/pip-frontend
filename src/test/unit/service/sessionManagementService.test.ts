import sinon from 'sinon';
import { expect } from 'chai';
import { Response } from 'express';
import { SessionManagementService } from '../../../main/service/sessionManagementService';

const sessionManagementService = new SessionManagementService();
const res = {
    redirect: function () {
        return '';
    },
    clearCookie: function () {
        return '';
    },
} as unknown as Response;

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
    const adminLogOutUrl = `${adminLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-logged-out%3Flng%3Den`;
    const adminWelshLogOutUrl = `${adminLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-logged-out%3Flng%3Dcy`;
    const mediaSessionExpiredUrl = `${mediaLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-expired%3Flng%3Den%26reSignInUrl%3DAAD`;
    const adminSessionExpiredUrl = `${adminLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}session-expired%3Flng%3Den%26reSignInUrl%3DADMIN`;
    const cftIdamSessionExpiredUrl = `/session-expired?lng=en&reSignInUrl=CFT`;
    const adminRejectedLoginUrl = `${mediaLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}admin-rejected-login%3Flng%3Den`;
    const mediaRejectedLoginUrl = `${adminLogOutPath}?post_logout_redirect_uri=${encodedAppUrl}media-rejected-login%3Flng%3Den`;

    it('should redirect for media user', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(mediaLogOutUrl);
        responseMock.expects('clearCookie').once().withArgs('session');

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'PI_AAD' },
            lng: 'en',
            session: {},
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session).to.be.null;
        responseMock.verify();
    });

    it('should redirect for media user in Welsh', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(mediaWelshLogOutUrl);

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'PI_AAD' },
            lng: 'cy',
            session: {},
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session).to.be.null;
        responseMock.verify();
    });

    it('should redirect for CFT IDAM User', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(cftIdamLogoutUrl);
        responseMock.expects('clearCookie').once().withArgs('session');

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM' },
            lng: 'en',
            session: {},
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session).to.be.null;
        responseMock.verify();
    });

    it('should redirect for CFT IDAM User in Welsh', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(welshCftIdamLogoutUrl);

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM' },
            lng: 'cy',
            session: {},
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session).to.be.null;
        responseMock.verify();
    });

    it('should redirect for admin user', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(adminLogOutUrl);

        const req = {
            user: { roles: 'SYSTEM_ADMIN', userProvenance: 'PI_AAD' },
            lng: 'en',
            session: {},
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session).to.be.null;
        responseMock.verify();
    });

    it('should redirect for admin user in Welsh', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(adminWelshLogOutUrl);

        const req = {
            user: { roles: 'SYSTEM_ADMIN', userProvenance: 'PI_AAD' },
            lng: 'cy',
            session: {},
        };
        sessionManagementService.logOut(req, res, false, false);
        expect(req.session).to.be.null;
        responseMock.verify();
    });

    it('should redirect for media user when session expired', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(mediaSessionExpiredUrl);

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'PI_AAD' },
            lng: 'en',
            session: {},
        };
        sessionManagementService.logOut(req, res, false, true);
        expect(req.session).to.be.null;
        responseMock.verify();
    });

    it('should redirect for admin user when session expired', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(adminSessionExpiredUrl);

        const req = {
            user: { roles: 'INTERNAL_SUPER_ADMIN_LOCAL', userProvenance: 'PI_AAD' },
            lng: 'en',
            session: {},
        };
        sessionManagementService.logOut(req, res, false, true);
        expect(req.session).to.be.null;
        responseMock.verify();
    });

    it('should redirect for CFT IDAM user when session expired', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(cftIdamSessionExpiredUrl);

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM' },
            lng: 'en',
            session: {},
        };
        sessionManagementService.logOut(req, res, false, true);
        expect(req.session).to.be.null;
        responseMock.verify();
    });

    it('should redirect for admin rejected login', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(adminRejectedLoginUrl);

        const req = {
            user: { roles: 'INTERNAL_SUPER_ADMIN_CTSC', userProvenance: 'PI_AAD' },
            lng: 'en',
            session: {},
        };
        sessionManagementService.logOut(req, res, true, false);
        expect(req.session).to.be.null;
        responseMock.verify();
    });

    it('should redirect for media rejected login', () => {
        const responseMock = sinon.mock(res);
        responseMock.expects('redirect').once().withArgs(mediaRejectedLoginUrl);

        const req = {
            user: { roles: 'VERIFIED', userProvenance: 'PI_AAD' },
            lng: 'en',
            session: {},
        };
        sessionManagementService.logOut(req, res, true, false);
        expect(req.session).to.be.null;
        responseMock.verify();
    });

    describe('Test admin session expiry', () => {
        const now = Date.now();

        it('check returns true when session expired', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').once().withArgs(adminLogOutUrl);

            const req = {
                user: { roles: 'SYSTEM_ADMIN', userProvenance: 'PI_AAD' },
                session: { sessionExpires: new Date(now - 10000) },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
            expect(req.session).to.be.null;
            responseMock.verify();
        });

        it('check returns false when session is not expired', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                user: { roles: 'SYSTEM_ADMIN', userProvenance: 'PI_AAD' },
                session: { sessionExpires: new Date(now + 100000) },
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
                session: {},
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
                session: { sessionExpires: new Date(now - 10000) },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
            expect(req.session).to.be.null;
            responseMock.verify();
        });

        it('check returns false when session is not expired', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                user: { roles: 'VERIFIED', userProvenance: 'PI_AAD' },
                session: { sessionExpires: new Date(now + 100000) },
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
                session: {},
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });

        it('check returns false when no user details', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                session: { sessionExpires: new Date(now - 10000) },
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
                session: { sessionExpires: new Date(now - 10000) },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
            expect(req.session).to.be.null;
            responseMock.verify();
        });

        it('check returns true when session expired in welsh', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').once().withArgs(welshCftIdamLogoutUrl);

            const req = {
                user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM' },
                session: { sessionExpires: new Date(now - 10000) },
                lng: 'cy',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.true;
            expect(req.session).to.be.null;
            responseMock.verify();
        });

        it('check returns false when session is not expired', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();

            const req = {
                user: { roles: 'VERIFIED', userProvenance: 'CFT_IDAM' },
                session: { sessionExpires: new Date(now + 100000) },
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
                session: {},
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });

        it('check returns false when no user details', () => {
            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').never();
            const req = {
                session: { sessionExpires: new Date(now - 10000) },
                lng: 'en',
            };
            expect(sessionManagementService.handleSessionExpiry(req, res)).to.be.false;
            responseMock.verify();
        });
    });
});
