import * as client from 'openid-client';
import { AUTH_RETURN_URL, MEDIA_VERIFICATION_RETURN_URL } from '../helpers/envUrls';
import process from 'process';
import config from 'config';
import { jwtDecode } from 'jwt-decode';
import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();

const clientSecret = process.env.CLIENT_SECRET
    ? (process.env.CLIENT_SECRET as string)
    : (config.get('secrets.pip-ss-kv.CLIENT_SECRET') as string);
const clientId = process.env.CLIENT_ID
    ? (process.env.CLIENT_ID as string)
    : (config.get('secrets.pip-ss-kv.CLIENT_ID') as string);
const b2cConfigEndpoint = process.env.CONFIG_ENDPOINT
    ? new URL(process.env.CONFIG_ENDPOINT)
    : new URL(config.get('secrets.pip-ss-kv.CONFIG_ENDPOINT'));
const b2cMediaVerificationConfigEndpoint = process.env.MEDIA_VERIFICATION_CONFIG_ENDPOINT
    ? new URL(process.env.MEDIA_VERIFICATION_CONFIG_ENDPOINT)
    : new URL(config.get('secrets.pip-ss-kv.MEDIA_VERIFICATION_CONFIG_ENDPOINT'));

export async function getB2cConfig() {
    const b2cClient = await client.discovery(b2cConfigEndpoint, clientId, clientSecret);

    return {
        config: b2cClient,
        callbackURL: AUTH_RETURN_URL,
        scope: 'openid ' + clientId,
    };
}

export async function getB2cMediaVerificationConfig() {
    const b2cVerificationClient = await client.discovery(b2cMediaVerificationConfigEndpoint, clientId, clientSecret);

    return {
        config: b2cVerificationClient,
        callbackURL: MEDIA_VERIFICATION_RETURN_URL,
        scope: 'openid ' + clientId,
    };
}

export async function piAadVerifyFunction(tokens, done): Promise<any> {
    const profile = jwtDecode(tokens['id_token']);
    const returnedUser = await accountManagementRequests.getPiUserByAzureOid(profile['oid']);

    if (returnedUser) {
        profile['roles'] = returnedUser['roles'];
        profile['userProvenance'] = returnedUser['userProvenance'];
        return done(null, profile);
    } else {
        return done(null, null);
    }
}
