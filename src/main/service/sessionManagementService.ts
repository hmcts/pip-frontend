import config from 'config';
import {Logger} from '@hmcts/nodejs-logging';
import process from 'process';
import moment from 'moment';
import {checkRoles, verifiedRoles} from '../authentication/authenticationHandler';

const logger = Logger.getLogger('session-management');
const authenticationConfig = require('../authentication/authentication-config.json');
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://pip-frontend.staging.platform.hmcts.net';
const defaultSessionExpiry = 60 * 60 * 1000; // default to 1 hour

export class SessionManagementService {
  public logOut(_req, res, redirectUrl): void{
    res.clearCookie('session');
    logger.info('logout FE URL', FRONTEND_URL);

    const B2C_URL = config.get('secrets.pip-ss-kv.B2C_URL');
    const encodedSignOutRedirect = encodeURIComponent(redirectUrl);
    logger.info('B2C_URL', B2C_URL);
    logger.info('encodedSignOutRedirect', encodedSignOutRedirect);
    res.redirect(`${B2C_URL}/${authenticationConfig.POLICY}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodedSignOutRedirect}`);
  }

  public handleSessionExpiry(req, res): boolean {
    if(this.isSessionExpired(req)) {
      this.logOut(req, res, this.getLogOutRedirectUrl(req));
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

    const sessionExpiry = checkRoles(req, verifiedRoles) ? defaultSessionExpiry : 4 * defaultSessionExpiry;
    req.session.sessionExpires = new Date(Date.now() + sessionExpiry);
    return false;
  }

  private getLogOutRedirectUrl(req): string {
    const policy = checkRoles(req, verifiedRoles) ? authenticationConfig.POLICY : authenticationConfig.ADMIN_POLICY;
    return `${FRONTEND_URL}/login?p=` + policy;
  }
}
