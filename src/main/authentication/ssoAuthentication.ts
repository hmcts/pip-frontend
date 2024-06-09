import { FRONTEND_URL } from '../helpers/envUrls';
import { jwtDecode } from 'jwt-decode';
import process from 'process';
import {ssoTokenApi} from '../resources/requests/utils/axiosConfig';
import {getSsoUserGroups} from "../helpers/graphApiHelper";

const querystring = require('querystring');

const ssoSystemAdminSecurityGroup = process.env.SSO_SG_SYSTEM_ADMIN;
const ssoSuperAdminCtscSecurityGroup = process.env.SSO_SG_SUPER_ADMIN_CTSC;
const ssoSuperAdminLocalSecurityGroup = '014a3cc6-99f1-450d-92e4-877a10f7710c';
const ssoAdminCtscSecurityGroup = process.env.SSO_SG_ADMIN_CTSC;
const ssoAdminLocalSecurityGroup = process.env.SSO_SG_ADMIN_LOCAL;

/**
 * This function authenticates with SSO, and returns the user in a decoded JWT token, that can then be parsed
 * by passport serialise / deserialise methods
 *
 * @param req The inbound request from Microsoft.
 * @param callback The passport callback to call once the function is complete
 */
export function ssoAuthentication(req, callback) {
    const params = {
        client_id: process.env.SSO_CLIENT_ID,
        client_secret: process.env.SSO_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: FRONTEND_URL + '/sso',
        code: req.query.code as string,
    };

    ssoTokenApi
        .post('/oauth2/v2.0/token', querystring.stringify(params), {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(async response => {
            const data = response.data;
            const jwtToken = jwtDecode(data.id_token);
            jwtToken['flow'] = 'SSO';

            const userRole = await determineUserRole(jwtToken['oid'], data.access_token);
            if (userRole) {
                jwtToken['roles'] = userRole;
                callback(null, jwtToken);
            } else {
                callback(null, null);
            }
        })
        .catch(() => {
            callback(null, null);
        });
}

async function determineUserRole(oid: string, accessToken: string): Promise<string> {
    const userGroupsObject = await getSsoUserGroups(oid, accessToken);
    if (userGroupsObject?.value.length > 0) {
        const userGroups = userGroupsObject.value;
        if (userGroups.includes(ssoSystemAdminSecurityGroup)) {
            return 'SYSTEM_ADMIN';
        } else if (userGroups.includes(ssoSuperAdminCtscSecurityGroup)) {
            return 'INTERNAL_SUPER_ADMIN_CTSC';
        } else if (userGroups.includes(ssoSuperAdminLocalSecurityGroup)) {
            return 'INTERNAL_SUPER_ADMIN_LOCAL';
        } else if (userGroups.includes(ssoAdminCtscSecurityGroup)) {
            return 'INTERNAL_ADMIN_CTSC';
        } else if (userGroups.includes(ssoAdminLocalSecurityGroup)) {
            return 'INTERNAL_ADMIN_LOCAL';
        }
    }
    return null;
}
