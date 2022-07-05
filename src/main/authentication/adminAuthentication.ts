export const adminAccountCreationRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL'];
export const manualUploadRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL', 'INTERNAL_ADMIN_CTSC', 'INTERNAL_ADMIN_LOCAL'];
export const mediaAccountCreationRoles = ['INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_ADMIN_CTSC'];
export const allAdminRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL', 'INTERNAL_ADMIN_CTSC', 'INTERNAL_ADMIN_LOCAL'];

export function checkRoles(req, roles): boolean {
  if(req.user) {
    const userInfo = req.user['_json'];
    if (userInfo?.extension_UserRole) {
      if (roles.includes(userInfo?.extension_UserRole)) {
        return true;
      }
    }
  }
  return false;
}

export function isPermittedAdmin(req: any, res, next) {
  return checkAuthenticated(req, res, next, allAdminRoles);
}

export function isPermittedAccountCreation(req: any, res, next){
  return checkAuthenticated(req, res, next, adminAccountCreationRoles);
}

export function isPermittedManualUpload(req: any, res, next) {
  return checkAuthenticated(req, res, next, manualUploadRoles);
}

export function isPermittedMediaAccount(req: any, res ,next) {
  return checkAuthenticated(req, res, next, mediaAccountCreationRoles);
}

export function checkAuthenticated(req: any, res, next, roles: string[]): boolean {
  if (checkRoles(req, roles)) {
    req.user.isAdmin = true;
    return next();
  } else {
    res.redirect('/admin-dashboard');
  }
}
