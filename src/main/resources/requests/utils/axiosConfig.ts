import axios from 'axios';
import oauth from 'axios-oauth-client';
import tokenProvider from 'axios-token-interceptor';
import config from 'config';

const tokenUrl = process.env.TOKEN_URL ? process.env.TOKEN_URL : config.get('secrets.pip-ss-kv.TOKEN_URL');

const clientId =
  process.env.CLIENT_ID_INTERNAL ? process.env.CLIENT_ID_INTERNAL : config.get('secrets.pip-ss-kv.CLIENT_ID_INTERNAL');

const clientSecret =
  process.env.CLIENT_SECRET_INTERNAL ?
    process.env.CLIENT_SECRET_INTERNAL : config.get('secrets.pip-ss-kv.CLIENT_SECRET_INTERNAL');

const dataManagementUrl =
  process.env.DATA_MANAGEMENT_AZ_API
    ? process.env.DATA_MANAGEMENT_AZ_API : config.get('secrets.pip-ss-kv.DATA_MANAGEMENT_AZ_API');

const subscriptionManagementUrl =
  process.env.SUBSCRIPTION_MANAGEMENT_AZ_API ?
    process.env.SUBSCRIPTION_MANAGEMENT_AZ_API : config.get('secrets.pip-ss-kv.SUBSCRIPTION_MANAGEMENT_AZ_API');

const accountManagementUrl = process.env.ACCOUNT_MANAGEMENT_AZ_API ?
  process.env.ACCOUNT_MANAGEMENT_AZ_API : config.get('secrets.pip-ss-kv.ACCOUNT_MANAGEMENT_AZ_API');

export const dataManagementApi = axios.create({baseURL: (process.env.DATA_MANAGEMENT_URL || 'https://pip-data-management.staging.platform.hmcts.net/'), timeout: 10000});
export const subscriptionManagementApi = axios.create({baseURL: (process.env.SUBSCRIPTION_MANAGEMENT_URL || 'https://pip-subscription-management.staging.platform.hmcts.net/'), timeout: 10000});
export const accountManagementApi = axios.create({baseURL: (process.env.ACCOUNT_MANAGEMENT_URL || 'https://pip-account-management.staging.platform.hmcts.net/'), timeout: 10000});

function createCredentials (url): Function {

  if (!process.env.INSECURE) {
    return oauth.client(axios.create(), {
      url: tokenUrl,
      GRANT_TYPE: 'client_credentials',
      CLIENT_ID: clientId,
      CLIENT_SECRET: clientSecret,
      SCOPE: url,
    });
  }
  return (): string => {return '';};
}

export const getDataManagementCredentials = createCredentials(dataManagementUrl);
export const getSubscriptionManagementCredentials = createCredentials(subscriptionManagementUrl);
export const getAccountManagementCredentials = createCredentials(accountManagementUrl);

if (!process.env.INSECURE) {
  dataManagementApi.interceptors.request.use(
    oauth.interceptor(tokenProvider, getDataManagementCredentials),
  );

  subscriptionManagementApi.interceptors.request.use(
    oauth.interceptor(tokenProvider, getSubscriptionManagementCredentials),
  );

  accountManagementApi.interceptors.request.use(
    oauth.interceptor(tokenProvider, getAccountManagementCredentials),
  );
}
