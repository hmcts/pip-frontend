import axios, { InternalAxiosRequestConfig } from 'axios';
import oauth from 'axios-oauth-client';
import tokenProvider, { TokenCacheOptions } from 'axios-token-interceptor';
import config from 'config';
import { CFT_IDAM_URL, MICROSOFT_GRAPH_API_URL, MICROSOFT_LOGIN_URL } from '../../../helpers/envUrls';
import process from 'process';

const tenantId = process.env.TENANT_ID ? process.env.TENANT_ID : config.get('secrets.pip-ss-kv.TENANT_ID');
const tokenUrl = `${MICROSOFT_LOGIN_URL}/${tenantId}/oauth2/v2.0/token`;

const clientId = process.env.CLIENT_ID_INTERNAL
    ? process.env.CLIENT_ID_INTERNAL
    : config.get('secrets.pip-ss-kv.CLIENT_ID_INTERNAL');

const clientSecret = process.env.CLIENT_SECRET_INTERNAL
    ? process.env.CLIENT_SECRET_INTERNAL
    : config.get('secrets.pip-ss-kv.CLIENT_SECRET_INTERNAL');

const dataManagementUrl = process.env.DATA_MANAGEMENT_AZ_API
    ? process.env.DATA_MANAGEMENT_AZ_API
    : config.get('secrets.pip-ss-kv.DATA_MANAGEMENT_AZ_API');

const accountManagementUrl = process.env.ACCOUNT_MANAGEMENT_AZ_API
    ? process.env.ACCOUNT_MANAGEMENT_AZ_API
    : config.get('secrets.pip-ss-kv.ACCOUNT_MANAGEMENT_AZ_API');

export const accountManagementApiUrl =
    process.env.ACCOUNT_MANAGEMENT_URL || 'https://pip-account-management.staging.platform.hmcts.net';
export const dataManagementApi = axios.create({
    baseURL: process.env.DATA_MANAGEMENT_URL || 'https://pip-data-management.staging.platform.hmcts.net',
    timeout: 10000,
});
export const accountManagementApi = axios.create({
    baseURL: accountManagementApiUrl,
    timeout: 10000,
});
export const cftIdamTokenApi = axios.create({
    baseURL: CFT_IDAM_URL,
    timeout: 10000,
});
export const graphApi = axios.create({
    baseURL: MICROSOFT_GRAPH_API_URL,
    timeout: 10000,
});

function createCredentials(url): (scope: any) => any {
    if (!process.env.INSECURE) {
        return oauth.clientCredentials(axios.create(), tokenUrl, clientId, clientSecret, url + '/.default');
    }
    return (): string => {
        return '';
    };
}

export const getDataManagementCredentials = createCredentials(dataManagementUrl);
export const getAccountManagementCredentials = createCredentials(accountManagementUrl);

const getBearerToken = (tokenCache, config) => {
    const bearer = tokenProvider({
        getToken: tokenCache,
        headerFormatter: (bearerToken: object) => 'Bearer ' + bearerToken['access_token'],
    });
    return bearer(config);
};

// Cache the token for 95% of the expiry time, to ensure uninterrupted service
const getMaxAgeOfCache = {
    getMaxAge: (cacheToken: object) => cacheToken['expires_in'] * 950,
} as TokenCacheOptions;

const dataManagementCacheToken = tokenProvider.tokenCache(getDataManagementCredentials as any, getMaxAgeOfCache);
const accountManagementCacheToken = tokenProvider.tokenCache(getAccountManagementCredentials as any, getMaxAgeOfCache);

if (!process.env.INSECURE) {
    dataManagementApi.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {
        return getBearerToken(dataManagementCacheToken, config) as Promise<InternalAxiosRequestConfig<any>>;
    });

    accountManagementApi.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {
        return getBearerToken(accountManagementCacheToken, config) as Promise<InternalAxiosRequestConfig<any>>;
    });
}
