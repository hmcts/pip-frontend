const authenticationConfig = require('../authentication/authentication-config.json');
import config from 'config';

export const adminAccountCreationRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL'];
export const manualUploadRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL', 'INTERNAL_ADMIN_CTSC', 'INTERNAL_ADMIN_LOCAL'];
export const mediaAccountCreationRoles = ['INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_ADMIN_CTSC'];
export const allAdminRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL', 'INTERNAL_ADMIN_CTSC', 'INTERNAL_ADMIN_LOCAL'];
export const verifiedRoles = ['VERIFIED'];
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://pip-frontend.staging.platform.hmcts.net';

export function checkRoles(req, roles): boolean {
  if(req.user) {
    const userInfo = req.user['_json'];
    if (userInfo?.extension_UserRole) {
      req.user.role = userInfo?.extension_UserRole;
      if (roles.includes(userInfo?.extension_UserRole)) {
        return true;
      }
    }
  }
  return false;
}

export function isPermittedMedia(req: any, res, next) {
  return checkAuthenticatedMedia(req, res, next, verifiedRoles);
}

export function isPermittedAdmin(req: any, res, next) {
  return checkAuthenticatedAdmin(req, res, next, allAdminRoles);
}

export function isPermittedAccountCreation(req: any, res, next){
  return checkAuthenticatedAdmin(req, res, next, adminAccountCreationRoles);
}

export function isPermittedManualUpload(req: any, res, next) {
  return checkAuthenticatedAdmin(req, res, next, manualUploadRoles);
}

export function isPermittedMediaAccount(req: any, res ,next) {
  return checkAuthenticatedAdmin(req, res, next, mediaAccountCreationRoles);
}

export function checkAuthenticatedAdmin(req: any, res, next, roles: string[]): boolean {
  if (checkRoles(req, roles)) {
    req.user.isAdmin = true;
    return next();
  } else if (checkRoles(req, allAdminRoles)) {
    res.redirect('/admin-dashboard');
  } else if (checkRoles(req, verifiedRoles)) {
    req.user.isAdmin = false;
    res.redirect('/account-home');
  } else {
    res.redirect('/login?p=' + authenticationConfig.ADMIN_POLICY);
  }
}

export function checkAuthenticatedMedia(req: any, res, next, roles: string[]): boolean {
  if (checkRoles(req, roles)) {
    return next();
  } else if (checkRoles(req, allAdminRoles)) {
    res.redirect('/admin-dashboard');
  } else {
    res.redirect('/login?p=' + authenticationConfig.POLICY);
  }
}

export function forgotPasswordRedirect(req, res, next): void {
  const body = JSON.stringify(req.body);
  if (body.includes('AADB2C90118')) {
    const CLIENT_ID = config.get('secrets.pip-ss-kv.CLIENT_ID');
    const B2C_URL = config.get('secrets.pip-ss-kv.B2C_URL');
    const REDIRECT_URL = `${FRONTEND_URL}/password-change-confirmation`;
    const POLICY_URL = `${B2C_URL}oauth2/v2.0/authorize?p=${authenticationConfig.FORGOT_PASSWORD_POLICY}` +
    `&client_id=${CLIENT_ID}&nonce=defaultNonce&redirect_uri=${REDIRECT_URL}` +
    '&scope=openid&response_type=id_token&prompt=login';
    res.redirect(POLICY_URL);
    return;
  }
  return next();
}
