import config from 'config';
import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import {B2C_URL, FRONTEND_URL, B2C_ADMIN_URL} from '../helpers/envUrls';
import {SessionManagementService} from '../service/sessionManagementService';

const authenticationConfig = require('../authentication/authentication-config.json');

export const adminAccountCreationRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL'];
export const manualUploadRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL', 'INTERNAL_ADMIN_CTSC', 'INTERNAL_ADMIN_LOCAL'];
export const mediaAccountCreationRoles = ['INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_ADMIN_CTSC'];
export const systemAdminRoles = ['SYSTEM_ADMIN'];
export const allAdminRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL', 'INTERNAL_ADMIN_CTSC', 'INTERNAL_ADMIN_LOCAL'];
export const verifiedRoles = ['VERIFIED'];

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

export function isPermittedSystemAdmin(req: any, res ,next) {
  return checkAuthenticatedAdmin(req, res, next, systemAdminRoles);
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
    let redirectUrl = `${FRONTEND_URL}/password-change-confirmation`;
    let b2cUrl = '';

    if(req.originalUrl === '/login/admin/return') {
      redirectUrl += '/true';
      b2cUrl = B2C_ADMIN_URL;
    } else {
      redirectUrl += '/false';
      b2cUrl = B2C_URL;
    }
    const POLICY_URL = `${b2cUrl}/oauth2/v2.0/authorize?p=${authenticationConfig.FORGOT_PASSWORD_POLICY}` +
      `&client_id=${CLIENT_ID}&nonce=defaultNonce&redirect_uri=${redirectUrl}` +
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

export async function processAdminAccountSignIn(req, res): Promise<any> {
  if(checkRoles(req, allAdminRoles)) {
    const userInfo = req.user['_json'];
    await AccountManagementRequests.prototype.updateAccountLastSignedInDate(userInfo.oid);

    if (checkRoles(req, systemAdminRoles)) {
      res.redirect('/system-admin-dashboard');
    } else {
      res.redirect('/admin-dashboard');
    }

  } else {
    res.redirect('/account-home');
  }
}

export async function processMediaAccountSignIn(req, res): Promise<any> {
  const sessionManagement = new SessionManagementService();
  if(checkRoles(req, allAdminRoles)) {
    sessionManagement.logOut(req, res, true);
  } else {
    res.redirect('/account-home');
  }
}
