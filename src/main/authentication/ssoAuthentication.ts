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
    redirectUrl: FRONTEND_URL + '/sso/return',
    allowHttpForRedirectUrl: true,
    clientSecret: ssoClientSecret,
    scope: 'openid profile email',
};

const accountManagementRequests = new AccountManagementRequests();

export class SsoAuthentication {
    public async determineUserRole(oid: string, userGroups: string[], accessToken: string): Promise<string> {
        const securityGroupMap = new Map<string, string>([
            [process.env.SSO_SG_SYSTEM_ADMIN, 'SYSTEM_ADMIN'],
            [process.env.SSO_SG_SUPER_ADMIN_CTSC, 'INTERNAL_SUPER_ADMIN_CTSC'],
            [process.env.SSO_SG_SUPER_ADMIN_LOCAL, 'INTERNAL_SUPER_ADMIN_LOCAL'],
            [process.env.SSO_SG_ADMIN_CTSC, 'INTERNAL_ADMIN_CTSC'],
            [process.env.SSO_SG_ADMIN_LOCAL, 'INTERNAL_ADMIN_LOCAL'],
        ]);

        if (!userGroups?.length) {
            // If user groups not present in JWT, retrieve them using Microsoft Graph API
            const userGroupsObject = await getSsoUserGroups(oid, accessToken);
            userGroups = userGroupsObject?.value;
        }

        if (userGroups?.length) {
            const matchedSecurityGroup = Array.from(securityGroupMap.keys()).find(key =>
                userGroups.includes(key)
            );

            if (matchedSecurityGroup) {
                return securityGroupMap.get(matchedSecurityGroup);
            }
        }
        return null;
    }

    public async handleSsoUser(foundUser): Promise<object | string> {
        const user = await accountManagementRequests.getPiUserByAzureOid(foundUser.oid, 'SSO');
        if (user) {
            if (user.roles !== foundUser.roles) {
                return await this.updateSsoUser(foundUser, user['userId']);
            }
            return user;
        }
        return await this.createSsoUser(foundUser);
    }

    private async updateSsoUser(ssoUser, userId): Promise<object | string> {
        if (ssoUser['roles'] === 'SYSTEM_ADMIN') {
            const deleteUserResponse = await accountManagementRequests.deleteUser(userId, null);
            return deleteUserResponse ? this.createSsoUser(ssoUser) : null;
        } else {
            return await accountManagementRequests.updateUser(userId, ssoUser['roles'], null);
        }
    }

    private async createSsoUser(ssoUser): Promise<object> {
        if (ssoUser['roles'] === 'SYSTEM_ADMIN') {
            const piAccount = {
                email: ssoUser['email'],
                provenanceUserId: ssoUser['oid'],
            };
            return await accountManagementRequests.createSystemAdminUser(piAccount);
        } else {
            const piAccount = [
                {
                    userProvenance: 'SSO',
                    email: ssoUser['email'],
                    roles: ssoUser['roles'],
                    provenanceUserId: ssoUser['oid'],
                },
            ];
            return await accountManagementRequests.createPIAccount(piAccount, '');
        }
    }
}
