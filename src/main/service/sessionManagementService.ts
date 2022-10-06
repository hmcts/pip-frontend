import {allAdminRoles, checkRoles} from '../authentication/authenticationHandler';
import {logOutUrl} from '../helpers/envUrls';

export class SessionManagementService {
  public logOut(req, res, adminWrongFlow, isSessionExpired = false): void {
    // For cookie-session, the request session needs to be destroyed by setting to null upon logout
    req.session = null;
    res.clearCookie('session');
    res.redirect(logOutUrl(checkRoles(req, allAdminRoles), adminWrongFlow, isSessionExpired, req.lng));
  }
}
