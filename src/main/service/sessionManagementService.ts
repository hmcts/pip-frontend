import config from 'config';
import process from 'process';
import moment from 'moment';
import {allAdminRoles, checkRoles} from '../authentication/authenticationHandler';

const authenticationConfig = require('../authentication/authentication-config.json');
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://pip-frontend.staging.platform.hmcts.net';
const B2C_ADMIN_URL = process.env.B2C_ADMIN_URL || 'https://hmctspipnonprod.b2clogin.com/hmctspipnonprod.onmicrosoft.com';
const defaultSessionExpiry = 60 * 60 * 1000; // default to 1 hour

export class SessionManagementService {
  public logOut(req, res): void {
    // For cookie-session, the request session needs to be destroyed by setting to null upon logout
    req.session = null;
    res.clearCookie('session');

    const b2cUrl = checkRoles(req, allAdminRoles) ? B2C_ADMIN_URL : config.get('secrets.pip-ss-kv.B2C_URL');
    const b2cPolicy = checkRoles(req, allAdminRoles) ? authenticationConfig.ADMIN_POLICY : authenticationConfig.POLICY;
    const encodedSignOutRedirect = encodeURIComponent(this.getLogOutRedirectUrl(req));
    res.redirect(`${b2cUrl}/${b2cPolicy}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodedSignOutRedirect}`);
  }

  public handleSessionExpiry(req, res): boolean {
    if(this.isSessionExpired(req)) {
      this.logOut(req, res);
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

  private getLogOutRedirectUrl(req): string {
    const path = checkRoles(req, allAdminRoles) ? 'admin-dashboard' : 'view-option';
    return `${FRONTEND_URL}/${path}`;
  }
}
