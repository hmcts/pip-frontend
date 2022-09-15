import config from 'config';
import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import {B2C_URL, FRONTEND_URL} from '../helpers/envUrls';

const authenticationConfig = require('../authentication/authentication-config.json');

export const adminAccountCreationRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL'];
export const manualUploadRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL', 'INTERNAL_ADMIN_CTSC', 'INTERNAL_ADMIN_LOCAL'];
export const mediaAccountCreationRoles = ['INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_ADMIN_CTSC'];
export const allAdminRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL', 'INTERNAL_ADMIN_CTSC', 'INTERNAL_ADMIN_LOCAL'];
export const verifiedRoles = ['VERIFIED'];

export function checkRoles(req, roles): boolean {
  if(req.user) {
    const userInfo = req.user['_json'];

    //For P&I IDAM
    if (userInfo?.extension_UserRole) {
      req.user.role = userInfo?.extension_UserRole;
      if (roles.includes(userInfo?.extension_UserRole)) {
        return true;
      }
    }

    //For CFT IDAM
    if (req.user.azp === 'app-pip-frontend') {
      req.user.role = 'VERIFIED'
      return true;
    }
  }

  return false;
}

export function setUser(req) {
  if (!req.user && req.session.user) {
    req.user = req.session.user;
  }
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
    res.redirect('/admin-login?p=' + authenticationConfig.ADMIN_POLICY);
  }
}

export function checkAuthenticatedMedia(req: any, res, next, roles: string[]): boolean {
  setUser(req);
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
    const REDIRECT_URL = `${FRONTEND_URL}/password-change-confirmation`;
    const POLICY_URL = `${B2C_URL}/oauth2/v2.0/authorize?p=${authenticationConfig.FORGOT_PASSWORD_POLICY}` +
    `&client_id=${CLIENT_ID}&nonce=defaultNonce&redirect_uri=${REDIRECT_URL}` +
    '&scope=openid&response_type=id_token&prompt=login';
    res.redirect(POLICY_URL);
    return;
  }
  return next();
}

export async function mediaVerificationHandling(req, res): Promise<any> {
  if(req.user) {
    const userInfo = req.user['_json'];
    if(verifiedRoles.includes(userInfo?.extension_UserRole)) {
      const response = await AccountManagementRequests.prototype.updateMediaAccountVerification(userInfo?.oid);
      console.log(response);
      res.redirect('/account-home?verified=true');
    }
  }
}

export async function processAccountSignIn(req, res): Promise<any> {
  if(checkRoles(req, allAdminRoles)) {
    const userInfo = req.user['_json'];
    const response = await AccountManagementRequests.prototype.updateAccountLastSignedInDate(userInfo.oid);
    console.log(response);
    res.redirect('/admin-dashboard');
  } else {
    res.redirect('/account-home');
  }
}
