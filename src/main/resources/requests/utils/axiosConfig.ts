import axios, { InternalAxiosRequestConfig } from 'axios';
import oauth from 'axios-oauth-client';
import tokenProvider from 'axios-token-interceptor';
import config from 'config';
import { CFT_IDAM_URL } from '../../../helpers/envUrls';

const tenantId = process.env.TENANT_ID ? process.env.TENANT_ID : config.get('secrets.pip-ss-kv.TENANT_ID');
const tokenUrl = 'https://login.microsoftonline.com/' + tenantId + '/oauth2/v2.0/token';

const clientId = process.env.CLIENT_ID_INTERNAL
    ? process.env.CLIENT_ID_INTERNAL
    : config.get('secrets.pip-ss-kv.CLIENT_ID_INTERNAL');

const clientSecret = process.env.CLIENT_SECRET_INTERNAL
    ? process.env.CLIENT_SECRET_INTERNAL
    : config.get('secrets.pip-ss-kv.CLIENT_SECRET_INTERNAL');

const dataManagementUrl = process.env.DATA_MANAGEMENT_AZ_API
    ? process.env.DATA_MANAGEMENT_AZ_API
    : config.get('secrets.pip-ss-kv.DATA_MANAGEMENT_AZ_API');

const subscriptionManagementUrl = process.env.SUBSCRIPTION_MANAGEMENT_AZ_API
    ? process.env.SUBSCRIPTION_MANAGEMENT_AZ_API
    : config.get('secrets.pip-ss-kv.SUBSCRIPTION_MANAGEMENT_AZ_API');

const accountManagementUrl = process.env.ACCOUNT_MANAGEMENT_AZ_API
    ? process.env.ACCOUNT_MANAGEMENT_AZ_API
    : config.get('secrets.pip-ss-kv.ACCOUNT_MANAGEMENT_AZ_API');

const channelManagementUrl = process.env.CHANNEL_MANAGEMENT_AZ_API
    ? process.env.CHANNEL_MANAGEMENT_AZ_API
    : config.get('secrets.pip-ss-kv.CHANNEL_MANAGEMENT_AZ_API');

export const accountManagementApiUrl =
    process.env.ACCOUNT_MANAGEMENT_URL || 'https://pip-account-management.staging.platform.hmcts.net';
export const dataManagementApi = axios.create({
    baseURL: process.env.DATA_MANAGEMENT_URL || 'https://pip-data-management.staging.platform.hmcts.net',
    timeout: 10000,
});
export const subscriptionManagementApi = axios.create({
    baseURL:
        process.env.SUBSCRIPTION_MANAGEMENT_URL || 'https://pip-subscription-management.staging.platform.hmcts.net',
    timeout: 10000,
});
export const accountManagementApi = axios.create({
    baseURL: accountManagementApiUrl,
    timeout: 10000,
});
export const channelManagementApi = axios.create({
    baseURL: process.env.CHANNEL_MANAGEMENT_URL || 'https://pip-channel-management.staging.platform.hmcts.net',
    timeout: 10000,
});
export const cftIdamTokenApi = axios.create({
    baseURL: CFT_IDAM_URL,
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
export const getSubscriptionManagementCredentials = createCredentials(subscriptionManagementUrl);
export const getAccountManagementCredentials = createCredentials(accountManagementUrl);
export const getChannelManagementCredentials = createCredentials(channelManagementUrl);

const temp = (tokenCache, config) => {
    const temp1 = tokenProvider({
        getToken: tokenCache,
        headerFormatter: (token: object) => 'Bearer ' + token['access_token'],
    });
    return temp1(config);
};

const options = {
    getMaxAge: (house: object) => house['expires_in'] * 1000,
};

if (!process.env.INSECURE) {
    dataManagementApi.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {
        const house = tokenProvider.tokenCache(getDataManagementCredentials as any,
            options
        );

        return temp(house, config) as Promise<InternalAxiosRequestConfig<any>>;
    });

    subscriptionManagementApi.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {
        const house = tokenProvider.tokenCache(getSubscriptionManagementCredentials as any,
            options
        );

        return temp(house, config) as Promise<InternalAxiosRequestConfig<any>>;
    });

    accountManagementApi.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {
        const house = tokenProvider.tokenCache(getAccountManagementCredentials as any,
            options
        );

        return temp(house, config) as Promise<InternalAxiosRequestConfig<any>>;
    });

    channelManagementApi.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {
        const house = tokenProvider.tokenCache(getChannelManagementCredentials as any,
            options
        );

        return temp(house, config) as Promise<InternalAxiosRequestConfig<any>>;
    });
}
