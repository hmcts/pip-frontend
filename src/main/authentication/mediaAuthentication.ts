const authenticationConfig = require('../authentication/authentication-config.json');
import {allAdminRoles} from '../authentication/adminAuthentication';

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
  return checkAuthenticated(req, res, next, verifiedRoles);
}

export function checkAuthenticated(req: any, res, next, roles: string[]): boolean {
  if (checkRoles(req, roles)) {
    return next();
  } else if (checkRoles(req, allAdminRoles)) {
    res.redirect('/admin-dashboard');
  } else {
    res.redirect('/login?p=' + authenticationConfig.POLICY);
  }
}
