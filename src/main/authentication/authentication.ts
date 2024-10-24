import process from 'process';
import config from 'config';
import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';
import passportCustom from 'passport-custom';
import { AUTH_RETURN_URL, MEDIA_VERIFICATION_RETURN_URL, ADMIN_AUTH_RETURN_URL } from '../helpers/envUrls';
import { cftIdamAuthentication } from './cftIdamAuthentication';
import { SsoAuthentication, ssoOidcConfig } from './ssoAuthentication';
import { OIDCStrategy as AzureOIDCStrategy } from 'passport-azure-ad';
import passport from 'passport';

import authenticationConfig from './authentication-config.json';
const CustomStrategy = passportCustom.Strategy;
const accountManagementRequests = new AccountManagementRequests();
const ssoAuthentication = new SsoAuthentication();

async function piAadVerifyFunction(iss, sub, profile, accessToken, refreshToken, done): Promise<any> {
    const returnedUser = await accountManagementRequests.getPiUserByAzureOid(profile['oid']);

    if (returnedUser) {
        profile['roles'] = returnedUser['roles'];
        profile['userProvenance'] = returnedUser['userProvenance'];
        return done(null, profile);
    } else {
        return done(null, null);
    }
}

async function ssoVerifyFunction(iss, sub, profile, accessToken, refreshToken, done): Promise<any> {
    const userGroups = profile._json['groups'] ?? [];
    const userRole = await ssoAuthentication.determineUserRole(profile.oid, userGroups, accessToken);

    if (userRole) {
        profile['roles'] = userRole;
        profile['email'] = profile._json['preferred_username'];
        profile['flow'] = 'SSO';
        const response = await ssoAuthentication.handleSsoUser(profile);
        profile['created'] = response && !response['error'];
        return done(null, profile);
    } else {
        return done(null, null);
    }
}

async function serializeUser(foundUser, done) {
    if (foundUser.flow === 'CFT') {
        const user = await accountManagementRequests.getPiUserByCftID(foundUser.uid);
        if (!user) {
            const piAccount = [
                {
                    userProvenance: 'CFT_IDAM',
                    email: foundUser['sub'],
                    roles: 'VERIFIED',
                    provenanceUserId: foundUser['uid'],
                    forenames: foundUser['given_name'],
                    surname: foundUser['family_name'],
                },
            ];

            await accountManagementRequests.createPIAccount(piAccount, '');
        }
        done(null, { uid: foundUser.uid, flow: 'CFT' });
    } else {
        done(null, { oid: foundUser.oid, flow: foundUser.flow === 'SSO' ? 'SSO' : 'AAD' });
    }
}

async function deserializeUser(userDetails, done) {
    let user;
    if (userDetails['flow'] === 'CFT') {
        user = await accountManagementRequests.getPiUserByCftID(userDetails['uid']);
    } else {
        user =
            userDetails['flow'] === 'SSO'
                ? await accountManagementRequests.getPiUserByAzureOid(userDetails['oid'], 'SSO')
                : await accountManagementRequests.getPiUserByAzureOid(userDetails['oid']);
    }
    return done(null, user);
}

/**
 * This sets up the OIDC version of authentication, integrating with Azure.
 */
function oidcSetup(): void {
    const clientSecret = process.env.CLIENT_SECRET
        ? process.env.CLIENT_SECRET
        : config.get('secrets.pip-ss-kv.CLIENT_SECRET');
    const clientId = process.env.CLIENT_ID ? process.env.CLIENT_ID : config.get('secrets.pip-ss-kv.CLIENT_ID');
    const identityMetadata = process.env.CONFIG_ENDPOINT
        ? process.env.CONFIG_ENDPOINT
        : config.get('secrets.pip-ss-kv.CONFIG_ENDPOINT');
    const adminIdentityMetadata = process.env.CONFIG_ADMIN_ENDPOINT
        ? process.env.CONFIG_ADMIN_ENDPOINT
        : config.get('secrets.pip-ss-kv.CONFIG_ADMIN_ENDPOINT');
    const mediaVerificationIdentityMetadata = process.env.MEDIA_VERIFICATION_CONFIG_ENDPOINT
        ? process.env.MEDIA_VERIFICATION_CONFIG_ENDPOINT
        : config.get('secrets.pip-ss-kv.MEDIA_VERIFICATION_CONFIG_ENDPOINT');

    passport.serializeUser(serializeUser);

    passport.deserializeUser(deserializeUser);

    passport.use(
        'login',
        new AzureOIDCStrategy(
            {
                identityMetadata: identityMetadata,
                clientID: clientId,
                responseType: authenticationConfig.RESPONSE_TYPE,
                responseMode: authenticationConfig.RESPONSE_MODE,
                redirectUrl: AUTH_RETURN_URL,
                allowHttpForRedirectUrl: true,
                clientSecret: clientSecret,
                isB2C: true,
            },
            piAadVerifyFunction
        )
    );

    passport.use(
        'admin-login',
        new AzureOIDCStrategy(
            {
                identityMetadata: adminIdentityMetadata,
                clientID: clientId,
                responseType: authenticationConfig.RESPONSE_TYPE,
                responseMode: authenticationConfig.RESPONSE_MODE,
                redirectUrl: ADMIN_AUTH_RETURN_URL,
                allowHttpForRedirectUrl: true,
                clientSecret: clientSecret,
                isB2C: true,
            },
            piAadVerifyFunction
        )
    );

    passport.use(
        'media-verification',
        new AzureOIDCStrategy(
            {
                identityMetadata: mediaVerificationIdentityMetadata,
                clientID: clientId,
                responseType: authenticationConfig.RESPONSE_TYPE,
                responseMode: authenticationConfig.RESPONSE_MODE,
                redirectUrl: MEDIA_VERIFICATION_RETURN_URL,
                allowHttpForRedirectUrl: true,
                clientSecret: clientSecret,
                isB2C: true,
            },
            piAadVerifyFunction
        )
    );

    passport.use('sso', new AzureOIDCStrategy(ssoOidcConfig, ssoVerifyFunction));

    passport.use('cft-idam', new CustomStrategy(cftIdamAuthentication));
}

/**
 * This function sets up the authentication service
 * Values are read from config, and from the environment passed in
 */
export default function (): void {
    oidcSetup();
}
