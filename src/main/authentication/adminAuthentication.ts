const adminRolesList = ['INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL', 'INTERNAL_ADMIN_CTSC', 'INTERNAL_ADMIN_LOCAL'];

export class AdminAuthentication {
  public isAdminUser(req: any): boolean {
    if(req.user) {
      const userInfo = req.user['_json'];
      if (userInfo?.extension_UserRole) {
        if (adminRolesList.includes(userInfo?.extension_UserRole)) {
          return true;
        }
      }
    }
    return false;
  }
}
