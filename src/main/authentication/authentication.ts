import process from 'process';
import config = require('config');
import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';
import passportCustom from 'passport-custom';
import { AUTH_RETURN_URL, MEDIA_VERIFICATION_RETURN_URL, ADMIN_AUTH_RETURN_URL } from '../helpers/envUrls';
import { cftIdamAuthentication } from './cftIdamAuthentication';
import {ssoAuthentication} from "./ssoAuthentication";

const AzureOIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const passport = require('passport');
const authenticationConfig = require('./authentication-config.json');
const CustomStrategy = passportCustom.Strategy;
const accountManagementRequests = new AccountManagementRequests();

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

async function serializeUser(foundUser, done) {
    if (foundUser.flow === 'CFT') {
        const user = await accountManagementRequests.getPiUserByCftID(foundUser.uid);
        if (!user) {
            await createCftUser(foundUser);
        }
        done(null, { uid: foundUser.uid, flow: 'CFT' });
    } else if (foundUser.flow === 'SSO') {
        const user = await accountManagementRequests.getPiUserByAzureOid(foundUser.oid, 'SSO');
        if (!user) {
            await createSsoUser(foundUser);
        }
        done(null, { oid: foundUser.oid, flow: 'SSO' });
    } else {
        done(null, { oid: foundUser.oid, flow: 'AAD' });
    }
}

async function deserializeUser(userDetails, done) {
    let user;
    if (userDetails['flow'] === 'CFT') {
        user = await accountManagementRequests.getPiUserByCftID(userDetails['uid']);
    } else if (userDetails['flow'] === 'SSO') {
        user = await accountManagementRequests.getPiUserByAzureOid(userDetails['oid'], 'SSO');
    } else {
        user = await accountManagementRequests.getPiUserByAzureOid(userDetails['oid']);
    }
    return done(null, user);
}

async function createCftUser(foundUser) {
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

async function createSsoUser(foundUser) {
    const piAccount = [
        {
            userProvenance: 'SSO',
            email: foundUser['preferred_username'],
            roles: foundUser['roles'],
            provenanceUserId: foundUser['oid'],
        },
    ];

    await accountManagementRequests.createPIAccount(piAccount, '');
}

/**
 * This sets up the OIDC version of authentication, integrating with Azure.
 */
function oidcSetup(): void {
    let clientSecret;
    let clientId;
    let identityMetadata;
    let adminIdentityMetadata;
    let mediaVerificationIdentityMetadata;

    if (process.env.CLIENT_SECRET) {
        clientSecret = process.env.CLIENT_SECRET;
    } else {
        clientSecret = config.get('secrets.pip-ss-kv.CLIENT_SECRET');
    }

    if (process.env.CLIENT_ID) {
        clientId = process.env.CLIENT_ID;
    } else {
        clientId = config.get('secrets.pip-ss-kv.CLIENT_ID');
    }

    if (process.env.CONFIG_ENDPOINT) {
        identityMetadata = process.env.CONFIG_ENDPOINT;
    } else {
        identityMetadata = config.get('secrets.pip-ss-kv.CONFIG_ENDPOINT');
    }

    if (process.env.CONFIG_ADMIN_ENDPOINT) {
        adminIdentityMetadata = process.env.CONFIG_ADMIN_ENDPOINT;
    } else {
        adminIdentityMetadata = config.get('secrets.pip-ss-kv.CONFIG_ADMIN_ENDPOINT');
    }

    if (process.env.MEDIA_VERIFICATION_CONFIG_ENDPOINT) {
        mediaVerificationIdentityMetadata = process.env.MEDIA_VERIFICATION_CONFIG_ENDPOINT;
    } else {
        mediaVerificationIdentityMetadata = config.get('secrets.pip-ss-kv.MEDIA_VERIFICATION_CONFIG_ENDPOINT');
    }

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

    passport.use('cft-idam', new CustomStrategy(cftIdamAuthentication));

    passport.use('sso', new CustomStrategy(ssoAuthentication));
}

/**
 * This function sets up the authentication service
 * Values are read from config, and from the environment passed in
 */
export default function (): void {
    oidcSetup();
}
