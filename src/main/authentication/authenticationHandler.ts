import config from 'config';
import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import { B2C_URL, FRONTEND_URL, B2C_ADMIN_URL } from '../helpers/envUrls';
import { SessionManagementService } from '../service/sessionManagementService';
import {
    verifiedRoles,
    systemAdminRoles,
    allAdminRoles,
    adminAccountCreationRoles,
    manualUploadRoles,
    mediaAccountCreationRoles,
    checkRoles,
} from '../authentication/authenticationHelper';

const authenticationConfig = require('../authentication/authentication-config.json');

const CLIENT_ID = config.get('secrets.pip-ss-kv.CLIENT_ID');

const sessionManagement = new SessionManagementService();

export function isPermittedMedia(req: any, res, next) {
    return checkAuthenticatedMedia(req, res, next, verifiedRoles);
}

export function isPermittedSystemAdmin(req: any, res, next) {
    return checkAuthenticatedAdmin(req, res, next, systemAdminRoles);
}

export function isPermittedAnyRole(req: any, res, next) {
    if (req.user && req.user['roles']) {
        return next();
    } else {
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
}

export function isPermittedAdmin(req: any, res, next) {
    return checkAuthenticatedAdmin(req, res, next, allAdminRoles);
}

export function isPermittedAccountCreation(req: any, res, next) {
    return checkAuthenticatedAdmin(req, res, next, adminAccountCreationRoles);
}

export function isPermittedManualUpload(req: any, res, next) {
    return checkAuthenticatedAdmin(req, res, next, manualUploadRoles);
}

export function isPermittedMediaAccount(req: any, res, next) {
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
        res.redirect('/sign-in');
    }
}

export function forgotPasswordRedirect(req, res, next): void {
    const body = JSON.stringify(req.body);
    if (body.includes('AADB2C90118')) {
        let redirectUrl = `${FRONTEND_URL}/password-change-confirmation`;
        let b2cUrl = '';

        if (req.originalUrl === '/login/admin/return') {
            redirectUrl += '/true';
            b2cUrl = B2C_ADMIN_URL;
        } else {
            redirectUrl += '/false';
            b2cUrl = B2C_URL;
        }
        const POLICY_URL =
            `${b2cUrl}/oauth2/v2.0/authorize?p=${authenticationConfig.FORGOT_PASSWORD_POLICY}` +
            `&client_id=${CLIENT_ID}&nonce=defaultNonce&redirect_uri=${redirectUrl}` +
            '&scope=openid&response_type=code&prompt=login&response_mode=form_post&ui_locales=' +
            mapAzureLanguage(req.lng);

        res.redirect(POLICY_URL);
        return;
    }
    return next();
}

export function mapAzureLanguage(lng) {
    return lng === 'en' ? 'en' : 'cy-GB';
}

export async function mediaVerificationHandling(req, res): Promise<any> {
    if (req.user && verifiedRoles.includes(req.user.roles)) {
        await AccountManagementRequests.prototype.updateMediaAccountVerification(req.user['oid']);
        res.redirect('/account-home?verified=true');
    }
}

export async function processAdminAccountSignIn(req, res): Promise<any> {
    if (checkRoles(req, allAdminRoles)) {
        await AccountManagementRequests.prototype.updateAccountLastSignedInDate('PI_AAD', req.user['oid']);
        if (checkRoles(req, systemAdminRoles)) {
            res.redirect('/system-admin-dashboard');
        } else {
            res.redirect('/admin-dashboard');
        }
    } else {
        sessionManagement.logOut(req, res, true);
    }
}

export async function processMediaAccountSignIn(req, res): Promise<any> {
    if (checkRoles(req, allAdminRoles)) {
        sessionManagement.logOut(req, res, true);
    } else {
        await AccountManagementRequests.prototype.updateAccountLastSignedInDate('PI_AAD', req.user['oid']);
        res.redirect('/account-home');
    }
}

export async function processCftIdamSignIn(req, res): Promise<any> {
    await AccountManagementRequests.prototype.updateAccountLastSignedInDate('CFT_IDAM', req.user['uid']);
    res.redirect('/account-home');
}

/**
 * This function checks the state of a password reset. If the error indicates a cancelled action, the user is re-directed
 * to the appropriate page.
 * @param req The request to check.
 * @param res The response to redirect.
 * @param next The next function
 */
export function checkPasswordReset(req, res, next) {
    if (req.body['error_description']?.includes('AADB2C90091')) {
        res.redirect('/cancelled-password-reset/' + req.params['isAdmin']);
    } else {
        next();
    }
}
