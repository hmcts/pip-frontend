import axios from 'axios';

export const dataManagementApi = axios.create({baseURL: (process.env.DATA_MANAGEMENT_URL || 'http://localhost:8090'), timeout: 10000});
export const subscriptionManagementApi = axios.create({baseURL: (process.env.SUBSCRIPTION_MANAGEMENT_URL || 'https://pip-subscription-management.staging.platform.hmcts.net/'), timeout: 10000});
