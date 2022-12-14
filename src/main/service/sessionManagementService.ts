import {DateTime} from 'luxon';
import {allAdminRoles, checkRoles} from '../authentication/authenticationHandler';
import {B2C_ADMIN_URL, B2C_URL, FRONTEND_URL} from '../helpers/envUrls';

const authenticationConfig = require('../authentication/authentication-config.json');
const defaultSessionExpiry = 60 * 60 * 1000;

export class SessionManagementService {

  public logOut(req, res, adminWrongFlow, isSessionExpired = false): void {
    // For cookie-session, the request session needs to be destroyed by setting to null upon logout
    req.session = null;

    if (req.user['userProvenance'] == 'PI_AAD') {
      res.clearCookie('session');
      res.redirect(this.logOutUrl(checkRoles(req, allAdminRoles), adminWrongFlow, isSessionExpired, req.lng));
    } else {
      res.clearCookie('session');
      res.redirect('/view-option');
    }

  }

  public handleSessionExpiry(req, res): boolean {
    if(this.isSessionExpired(req)) {
      this.logOut(req, res, false);
      return true;
    }
    return false;
  }

  private isSessionExpired(req): boolean {
    if (req.user === undefined) {
      return false;
    }

    if(req.session.sessionExpires) {
      const sessionExpiryDateTime = DateTime.fromJSDate(req.session.sessionExpires, {zone: 'utc'});
      const currentDateTime = DateTime.fromISO(DateTime.now(), {zone: 'utc'});
      const durationAsSeconds = sessionExpiryDateTime.diff(currentDateTime, ["seconds"]).as('seconds')
      if(durationAsSeconds <= 0) {
        return true;
      }
    }

    const sessionExpiry = checkRoles(req, allAdminRoles) ? 4 * defaultSessionExpiry : defaultSessionExpiry;
    req.session.sessionExpires = new Date(Date.now() + sessionExpiry);
    return false;
  }

  private logOutUrl(isAdmin: boolean, adminWrongFlow: boolean, isSessionExpired: boolean, language: string): string {
    let b2cUrl;
    let b2cPolicy;

    if (adminWrongFlow) {
      b2cUrl = B2C_URL;
      b2cPolicy = authenticationConfig.POLICY;
    } else {
      b2cUrl = isAdmin ? B2C_ADMIN_URL : B2C_URL;
      b2cPolicy = isAdmin ? authenticationConfig.ADMIN_POLICY : authenticationConfig.POLICY;
    }

    const encodedSignOutRedirect = encodeURIComponent(this.logOutRedirectUrl(isAdmin, adminWrongFlow, isSessionExpired, language));
    return `${b2cUrl}/${b2cPolicy}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodedSignOutRedirect}`;
  }

  private logOutRedirectUrl(isAdmin: boolean, adminWrongFlow: boolean, isSessionExpired: boolean, language: string): string {
    const url = new URL(`${FRONTEND_URL}/${this.getRedirectionPath(adminWrongFlow, isSessionExpired)}`);
    url.searchParams.append('lng', language);

    if (isSessionExpired) {
      url.searchParams.append('reSignInUrl', isAdmin ? 'admin-dashboard' : 'sign-in');
    }
    return url.toString();
  }

  private getRedirectionPath(adminWrongFlow: boolean, isSessionExpired: boolean): string {
    if (adminWrongFlow) {
      return 'admin-rejected-login';
    } else if (isSessionExpired) {
      return 'session-expired';
    } else {
      return 'session-logged-out';
    }
  }
}
