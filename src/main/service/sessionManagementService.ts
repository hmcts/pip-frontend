import {allAdminRoles, checkRoles} from '../authentication/authenticationHandler';
import {B2C_ADMIN_URL, B2C_URL, FRONTEND_URL} from '../helpers/envUrls';

const authenticationConfig = require('../authentication/authentication-config.json');

export class SessionManagementService {
  public logOut(req, res, adminWrongFlow, isSessionExpired = false): void {
    // For cookie-session, the request session needs to be destroyed by setting to null upon logout
    req.session = null;
    res.clearCookie('session');
    res.redirect(this.logOutUrl(checkRoles(req, allAdminRoles), adminWrongFlow, isSessionExpired, req.lng));
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
