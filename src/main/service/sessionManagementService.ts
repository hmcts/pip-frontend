import { DateTime } from 'luxon';
import { allAdminRoles, checkRoles } from '../authentication/authenticationHelper';
import { B2C_ADMIN_URL, B2C_URL, FRONTEND_URL } from '../helpers/envUrls';
import { reSignInUrls } from '../models/consts';

const authenticationConfig = require('../authentication/authentication-config.json');
const defaultSessionExpiry = 60 * 60 * 1000;
const reSignInUrlKeys = Object.keys(reSignInUrls);

export class SessionManagementService {
    public logOut(req, res, isWrongFlow, isSessionExpired = false): void {
        req.session.user = null;

        //If the request doesn't have a user, it must have already been logged out on another tab. Therefore
        //redirect the user to the most appropriate page
        if (!req.user) {
            if (isSessionExpired && req.query && req.query.redirectType) {
                const redirectTypeIndex = reSignInUrlKeys.indexOf(req.query.redirectType);
                if (redirectTypeIndex != -1) {
                    res.redirect('/session-expired?lng=' + req.lng + '&reSignInUrl=' +
                        reSignInUrlKeys[redirectTypeIndex]);
                } else {
                    res.render('error', req.i18n.getDataByLanguage(req.lng).error);
                }
            } else {
                res.redirect('/session-logged-out?lng=' + req.lng);
            }
        } else {
            req.session.save(() => {
                req.session.regenerate(() => {
                    if (req.user['userProvenance'] == 'PI_AAD') {
                        res.redirect(
                            this.aadLogOutUrl(checkRoles(req, allAdminRoles), isWrongFlow, isSessionExpired, req.lng)
                        );
                    } else {
                        res.redirect(this.cftLogOutUrl(isSessionExpired, req.lng));
                    }
                });
            });
        }
    }

    public handleSessionExpiry(req, res): boolean {
        if (this.isSessionExpired(req)) {
            this.logOut(req, res, false);
            return true;
        }
        return false;
    }

    private isSessionExpired(req): boolean {
        if (req.user === undefined) {
            return false;
        }

        if (req.session.sessionExpires) {
            const sessionExpiryDateTime = DateTime.fromJSDate(req.session.sessionExpires, { zone: 'utc' });
            const currentDateTime = DateTime.fromISO(DateTime.now(), { zone: 'utc' });
            const durationAsSeconds = sessionExpiryDateTime.diff(currentDateTime, ['seconds']).as('seconds');
            if (durationAsSeconds <= 0) {
                return true;
            }
        }

        const sessionExpiry = checkRoles(req, allAdminRoles) ? 4 * defaultSessionExpiry : defaultSessionExpiry;
        req.session.sessionExpires = new Date(Date.now() + sessionExpiry);
        return false;
    }

    public aadLogOutUrl(isAdmin: boolean, isWrongFlow: boolean, isSessionExpired: boolean, language: string): string {
        let b2cUrl;
        let b2cPolicy;

        if (isWrongFlow) {
            b2cUrl = isAdmin ? B2C_URL : B2C_ADMIN_URL;
            b2cPolicy = isAdmin ? authenticationConfig.POLICY : authenticationConfig.ADMIN_POLICY;
        } else {
            b2cUrl = isAdmin ? B2C_ADMIN_URL : B2C_URL;
            b2cPolicy = isAdmin ? authenticationConfig.ADMIN_POLICY : authenticationConfig.POLICY;
        }

        const encodedSignOutRedirect = encodeURIComponent(
            this.logOutRedirectUrl(isAdmin, isWrongFlow, isSessionExpired, language)
        );
        return `${b2cUrl}/${b2cPolicy}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodedSignOutRedirect}`;
    }

    private cftLogOutUrl(isSessionExpired: boolean, language: string): string {
        if (isSessionExpired) {
            return '/session-expired?lng=' + language + '&reSignInUrl=CFT';
        } else {
            return '/session-logged-out?lng=' + language;
        }
    }

    private logOutRedirectUrl(
        isAdmin: boolean,
        isWrongFlow: boolean,
        isSessionExpired: boolean,
        language: string
    ): string {
        const url = new URL(`${FRONTEND_URL}/${this.getRedirectionPath(isWrongFlow, isSessionExpired, isAdmin)}`);
        url.searchParams.append('lng', language);

        if (isSessionExpired) {
            url.searchParams.append('reSignInUrl', isAdmin ? 'ADMIN' : 'AAD');
        }
        return url.toString();
    }

    private getRedirectionPath(isWrongFlow: boolean, isSessionExpired: boolean, isAdmin: boolean): string {
        if (isWrongFlow) {
            return isAdmin ? 'admin-rejected-login' : 'media-rejected-login';
        } else if (isSessionExpired) {
            return 'session-expired';
        } else {
            return 'session-logged-out';
        }
    }
}
