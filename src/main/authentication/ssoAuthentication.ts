import process from 'process';
import { getSsoUserGroups } from '../helpers/graphApiHelper';
import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';
import { FRONTEND_URL } from '../helpers/envUrls';
import config from 'config';
import * as client from 'openid-client';
import { jwtDecode } from 'jwt-decode';
import { ssoNotAuthorised } from '../helpers/consts';

const ssoClientId = process.env.SSO_CLIENT_ID
    ? (process.env.SSO_CLIENT_ID as string)
    : (config.get('secrets.pip-ss-kv.SSO_CLIENT_ID') as string);
const ssoClientSecret = process.env.SSO_CLIENT_SECRET
    ? (process.env.SSO_CLIENT_SECRET as string)
    : (config.get('secrets.pip-ss-kv.SSO_CLIENT_SECRET') as string);
const ssoSgSystemAdmin = process.env.SSO_SG_SYSTEM_ADMIN
    ? process.env.SSO_SG_SYSTEM_ADMIN
    : (config.get('secrets.pip-ss-kv.SSO_SG_SYSTEM_ADMIN') as string);
const ssoSgAdminCtsc = process.env.SSO_SG_ADMIN_CTSC
    ? process.env.SSO_SG_ADMIN_CTSC
    : (config.get('secrets.pip-ss-kv.SSO_SG_ADMIN_CTSC') as string);
const ssoSgAdminLocal = process.env.SSO_SG_ADMIN_LOCAL
    ? process.env.SSO_SG_ADMIN_LOCAL
    : (config.get('secrets.pip-ss-kv.SSO_SG_ADMIN_LOCAL') as string);
const ssoIssuerUrl = process.env.SSO_ISSUER_URL
    ? new URL(process.env.SSO_ISSUER_URL)
    : new URL(config.get('secrets.pip-ss-kv.SSO_ISSUER_URL'));

export async function getSsoConfig() {
    const ssoOidcClient = await client.discovery(ssoIssuerUrl, ssoClientId, ssoClientSecret);

    return {
        config: ssoOidcClient,
        callbackURL: FRONTEND_URL + '/sso/return',
        scope: 'openid profile email',
    };
}

export async function ssoVerifyFunction(tokens, done): Promise<any> {
    const profile = jwtDecode(tokens['id_token']);
    const userGroups = profile['groups'] ?? [];
    const userRole = await new SsoAuthentication().determineUserRole(
        profile['oid'],
        userGroups,
        tokens['access_token']
    );

    if (userRole) {
        profile['roles'] = userRole;
        profile['email'] = profile['preferred_username'];
        profile['flow'] = 'SSO';
        const response = await new SsoAuthentication().handleSsoUser(profile);
        profile['created'] = response && !response['error'];
        return done(null, profile);
    } else {
        return done(null, null, { message: ssoNotAuthorised });
    }
}

const accountManagementRequests = new AccountManagementRequests();

export class SsoAuthentication {
    public async determineUserRole(oid: string, userGroups: string[], accessToken: string): Promise<string> {
        const securityGroupMap = new Map<string, string>([
            [ssoSgSystemAdmin, 'SYSTEM_ADMIN'],
            [ssoSgAdminCtsc, 'INTERNAL_ADMIN_CTSC'],
            [ssoSgAdminLocal, 'INTERNAL_ADMIN_LOCAL'],
        ]);

        if (!userGroups?.length) {
            // If user groups not present in JWT, retrieve them using Microsoft Graph API
            const userGroupsObject = await getSsoUserGroups(oid, accessToken);
            userGroups = userGroupsObject?.value;
        }

        if (userGroups?.length) {
            const matchedSecurityGroup = Array.from(securityGroupMap.keys()).find(key => userGroups.includes(key));

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
            const deleteUserResponse = await accountManagementRequests.deleteUser(userId, userId);
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
