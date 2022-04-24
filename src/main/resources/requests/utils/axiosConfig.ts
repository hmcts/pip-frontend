import axios from 'axios';
import oauth from 'axios-oauth-client';
import tokenProvider from 'axios-token-interceptor';

export const getDataManagementCredentials = oauth.client(axios.create(), {
  url: process.env.TOKEN_URL,
  GRANT_TYPE: 'client_credentials',
  CLIENT_ID: process.env.CLIENT_ID_NEW,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  SCOPE: process.env.DATA_MANAGEMENT_AZ_API,
});

export const getSubscriptionManagementCredentials = oauth.client(axios.create(), {
  url: process.env.TOKEN_URL,
  GRANT_TYPE: 'client_credentials',
  CLIENT_ID: process.env.CLIENT_ID_NEW,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  SCOPE: process.env.SUBSCRIPTION_MANAGEMENT_AZ_API,
});

export const getAccountManagementCredentials = oauth.client(axios.create(), {
  url: process.env.TOKEN_URL,
  GRANT_TYPE: 'client_credentials',
  CLIENT_ID: process.env.CLIENT_ID_NEW,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  SCOPE: process.env.ACCOUNT_MANAGEMENT_AZ_API,
});

export const dataManagementApi = axios.create({baseURL: (process.env.DATA_MANAGEMENT_URL || 'https://pip-data-management.staging.platform.hmcts.net/'), timeout: 10000});
export const subscriptionManagementApi = axios.create({baseURL: (process.env.SUBSCRIPTION_MANAGEMENT_URL || 'https://pip-subscription-management.staging.platform.hmcts.net/'), timeout: 10000});
export const accountManagementApi = axios.create({baseURL: (process.env.ACCOUNT_MANAGEMENT_URL || 'https://pip-account-management.staging.platform.hmcts.net/'), timeout: 10000});

dataManagementApi.interceptors.request.use(
  oauth.interceptor(tokenProvider, getDataManagementCredentials),
);

subscriptionManagementApi.interceptors.request.use(
  oauth.interceptor(tokenProvider, getSubscriptionManagementCredentials),
);

accountManagementApi.interceptors.request.use(
  oauth.interceptor(tokenProvider, getAccountManagementCredentials),
);

