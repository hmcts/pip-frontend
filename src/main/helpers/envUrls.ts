import process from 'process';
const authenticationConfig = require('../authentication/authentication-config.json');

export const FRONTEND_URL = process.env.FRONTEND_URL || 'https://pip-frontend.staging.platform.hmcts.net';
export const B2C_URL = process.env.B2C_URL || 'https://sign-in.pip-frontend.staging.platform.hmcts.net/pip-frontend.staging.platform.hmcts.net';
export const B2C_ADMIN_URL = process.env.B2C_ADMIN_URL || 'https://staff.pip-frontend.staging.platform.hmcts.net/pip-frontend.staging.platform.hmcts.net';
export const AUTH_RETURN_URL = process.env.AUTH_RETURN_URL || 'https://pip-frontend.staging.platform.hmcts.net/login/return';
export const ADMIN_AUTH_RETURN_URL = process.env.ADMIN_AUTH_RETURN_URL || 'https://pip-frontend.staging.platform.hmcts.net/login/admin/return';
export const MEDIA_VERIFICATION_RETURN_URL = process.env.MEDIA_VERIFICATION_RETURN_URL || 'https://pip-frontend.staging.platform.hmcts.net/media-verification/return';

export const logOutUrl = (isAdmin: boolean, adminWrongFlow: boolean, isSessionExpired: boolean, language: string): string => {
  let b2cUrl;
  let b2cPolicy;
  if (adminWrongFlow) {
    b2cUrl = B2C_URL;
    b2cPolicy = authenticationConfig.POLICY;
  } else {
    b2cUrl = isAdmin ? B2C_ADMIN_URL : B2C_URL;
    b2cPolicy = isAdmin ? authenticationConfig.ADMIN_POLICY : authenticationConfig.POLICY;
  }

  const encodedSignOutRedirect = encodeURIComponent(logOutRedirectUrl(isAdmin, adminWrongFlow, isSessionExpired, language));
  return `${b2cUrl}/${b2cPolicy}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodedSignOutRedirect}`;
};

function logOutRedirectUrl(isAdmin: boolean, adminWrongFlow: boolean, isSessionExpired: boolean, language: string): string {
  const url = new URL(`${FRONTEND_URL}/${getRedirectionPath(adminWrongFlow, isSessionExpired)}`);
  url.searchParams.append('lng', language);

  if (isSessionExpired) {
    url.searchParams.append('reSignInUrl', isAdmin ? 'admin-dashboard' : 'sign-in');
  }
  return url.toString();
}

function getRedirectionPath(adminWrongFlow: boolean, isSessionExpired: boolean): string {
  if (adminWrongFlow) {
    return 'admin-rejected-login';
  } else if (isSessionExpired) {
    return 'session-expired';
  } else {
    return 'session-logged-out';
  }
}
