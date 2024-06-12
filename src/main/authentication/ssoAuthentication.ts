import process from 'process';
import { getSsoUserGroups } from '../helpers/graphApiHelper';
import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';
import { FRONTEND_URL } from '../helpers/envUrls';
import config = require('config');
const authenticationConfig = require('./authentication-config.json');

const ssoClientId = process.env.SSO_CLIENT_ID
    ? process.env.SSO_CLIENT_ID
    : config.get('secrets.pip-ss-kv.SSO_CLIENT_ID');
const ssoClientSecret = process.env.SSO_CLIENT_SECRET
    ? process.env.SSO_CLIENT_SECRET
    : config.get('secrets.pip-ss-kv.SSO_CLIENT_SECRET');
const ssoMetadata = process.env.SSO_CONFIG_ENDPOINT
    ? process.env.SSO_CONFIG_ENDPOINT
    : config.get('secrets.pip-ss-kv.SSO_CONFIG_ENDPOINT');

export const ssoOidcConfig = {
    identityMetadata: ssoMetadata,
    clientID: ssoClientId,
    responseType: authenticationConfig.RESPONSE_TYPE,
    responseMode: authenticationConfig.RESPONSE_MODE,
    redirectUrl: FRONTEND_URL + '/sso',
    allowHttpForRedirectUrl: true,
    clientSecret: ssoClientSecret,
    scope: 'openid profile email',
};

const accountManagementRequests = new AccountManagementRequests();

export class SsoAuthentication {


    public async determineUserRole(oid: string, accessToken: string): Promise<string> {
        const userGroupsObject = await getSsoUserGroups(oid, accessToken);
        const securityGroupMap = new Map<string, string>([
            [process.env.SSO_SG_SYSTEM_ADMIN, 'SYSTEM_ADMIN'],
            [process.env.SSO_SG_SUPER_ADMIN_CTSC, 'INTERNAL_SUPER_ADMIN_CTSC'],
            [process.env.SSO_SG_SUPER_ADMIN_LOCAL, 'INTERNAL_SUPER_ADMIN_LOCAL'],
            [process.env.SSO_SG_ADMIN_CTSC, 'INTERNAL_ADMIN_CTSC'],
            [process.env.SSO_SG_ADMIN_LOCAL, 'INTERNAL_ADMIN_LOCAL'],
        ]);
        let userRole;

        if (userGroupsObject?.value.length > 0) {
            const userGroups = userGroupsObject.value;
            securityGroupMap.forEach((value: string, key: string) => {
                if (userGroups.includes(key)) {
                    userRole = value;
                    return;
                }
            });
        }
        return userRole;
    }

    public async handleSsoUser(foundUser): Promise<object> {
        const user = await accountManagementRequests.getPiUserByAzureOid(foundUser.oid, 'SSO');
        if (!user) {
            return await this.createSsoUser(foundUser);
        }
        return user
    }

    private async createSsoUser(foundUser): Promise<object> {
        if (foundUser['roles'] == 'SYSTEM_ADMIN') {
            const piAccount = {
                email: foundUser['email'],
                provenanceUserId: foundUser['oid'],
            }
            return await accountManagementRequests.createSystemAdminUser(piAccount);
        }  else {
            const piAccount = [
                {
                    userProvenance: 'SSO',
                    email: foundUser['email'],
                    roles: foundUser['roles'],
                    provenanceUserId: foundUser['oid'],
                },
            ];
            return await accountManagementRequests.createPIAccount(piAccount, '');
        }
    }
}
