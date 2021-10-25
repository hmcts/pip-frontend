import axios from 'axios';

export const dataManagementApi = axios.create({baseURL: (process.env.DATA_MANAGEMENT_URL || 'https://pip-data-management.staging.platform.hmcts.net/'), timeout: 10000});
