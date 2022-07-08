import config from 'config';
import process from 'process';

const adminRolesList = ['INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL', 'INTERNAL_ADMIN_CTSC', 'INTERNAL_ADMIN_LOCAL'];
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://pip-frontend.staging.platform.hmcts.net';
const authenticationConfig = require('../authentication/authentication-config.json');

export class AdminAuthentication {
  public isAdminUser(req: any): boolean {
    if(req.user) {
      const userInfo = req.user['_json'];
      if (userInfo?.extension_UserRole) {
        if (adminRolesList.includes(userInfo?.extension_UserRole)) {
          req.user.isAdmin = true;
          return true;
        }
      }
    }
    return false;
  }

  public forgotPasswordRedirect(req, res, next): void {
    const body = JSON.stringify(req.body);
    if (body.includes('AADB2C90118')) {
      const CLIENT_ID = config.get('secrets.pip-ss-kv.CLIENT_ID');
      const B2C_URL = config.get('secrets.pip-ss-kv.B2C_URL');
      const REDIRECT_URL = `${FRONTEND_URL}/password-change-confirmation`;
      const POLICY_URL = `${B2C_URL}/oauth2/v2.0/authorize?p=${authenticationConfig.FORGOT_PASSWORD_POLICY}` +
        `&client_id=${CLIENT_ID}&nonce=defaultNonce&redirect_uri=${REDIRECT_URL}` +
        '&scope=openid&response_type=id_token&prompt=login';
      res.redirect(POLICY_URL);
      return;
    }
    return next();
  }
}
