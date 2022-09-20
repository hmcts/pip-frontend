import moment from 'moment';
import {allAdminRoles, checkRoles} from '../authentication/authenticationHandler';
import {B2C_ADMIN_URL, B2C_URL, FRONTEND_URL} from '../helpers/envUrls';

const authenticationConfig = require('../authentication/authentication-config.json');
const defaultSessionExpiry = 60 * 60 * 1000; // default to 1 hour

export class SessionManagementService {
  public logOut(req, res, adminWrongFlow): void {
    // For cookie-session, the request session needs to be destroyed by setting to null upon logout
    req.session = null;
    res.clearCookie('session');
    let b2cUrl;
    let b2cPolicy;
    if (adminWrongFlow) {
      b2cUrl = B2C_URL;
      b2cPolicy = authenticationConfig.POLICY;
    } else {
      b2cUrl = checkRoles(req, allAdminRoles) ? B2C_ADMIN_URL : B2C_URL;
      b2cPolicy = checkRoles(req, allAdminRoles) ? authenticationConfig.ADMIN_POLICY : authenticationConfig.POLICY;
    }

    const encodedSignOutRedirect = encodeURIComponent(this.getLogOutRedirectUrl(req, adminWrongFlow));
    res.redirect(`${b2cUrl}/${b2cPolicy}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodedSignOutRedirect}`);
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
      const sessionExpiryDateTime = moment.utc(req.session.sessionExpires);
      const currentDateTime = moment.utc(new Date(Date.now()));
      const durationAsSeconds = moment.duration(sessionExpiryDateTime.startOf('seconds').diff(currentDateTime.startOf('seconds'))).asSeconds();
      if(durationAsSeconds <= 0) {
        return true;
      }
    }

    const sessionExpiry = checkRoles(req, allAdminRoles) ? 4 * defaultSessionExpiry : defaultSessionExpiry;
    req.session.sessionExpires = new Date(Date.now() + sessionExpiry);
    return false;
  }

  private getLogOutRedirectUrl(req, adminWrongFlow): string {
    let path = '';
    if(adminWrongFlow) {
      path = 'admin-rejected-login';
    } else {
      path = checkRoles(req, allAdminRoles) ? 'admin-dashboard' : 'view-option';
    }
    return `${FRONTEND_URL}/${path}` + '?lng=' + req['lng'];
  }
}
