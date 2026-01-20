import { accountManagementApi } from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';
import { LogHelper } from '../logging/logHelper';
import { StatusCodes } from 'http-status-codes';
const logger = Logger.getLogger('requests');
const logHelper = new LogHelper();

export class ThirdPartyRequests {
    /**
     * Request to account management that creates a third party subscriber account.
     * @param payload The payload containing the name of subscriber account to request.
     * @param requester The user ID of the person requesting this.
     */
    public async createThirdPartySubscriber(payload, requester): Promise<boolean> {
        try {
            const response = await accountManagementApi.post('/third-party', payload, {
                headers: { 'x-requester-id': requester },
            });
            logger.info('Third party subscriber created');
            return response.status === StatusCodes.CREATED;
        } catch (error) {
            logHelper.logErrorResponse(error, 'third party subscriber account creation');
        }
        return null;
    }

    public async getThirdPartySubscribers(adminUserId): Promise<any> {
        try {
            logger.info('Third party subscribers data requested by Admin with ID: ' + adminUserId);
            const response = await accountManagementApi.get('/third-party', {
                headers: {
                    'x-requester-id': adminUserId,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve third party subscribers');
        }
        return null;
    }

    public async getThirdPartySubscriberByUserId(userId: string, adminUserId: string): Promise<any> {
        try {
            logger.info(`Third party subscriber with ID: ${userId} data requested by Admin with ID: ${adminUserId}`);
            const response = await accountManagementApi.get(`/third-party/${userId}`, {
                headers: {
                    'x-requester-id': adminUserId,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve third party subscriber with ID ${userId}`);
        }
        return null;
    }

    public async deleteThirdPartySubscriber(userId: string, adminUserId): Promise<object> {
        try {
            logger.info('Subscriber with ID: ' + userId + ' deleted by Admin with ID: ' + adminUserId);
            const headers = adminUserId ? { 'x-requester-id': adminUserId } : {};
            const response = await accountManagementApi.delete(`/third-party/${userId}`, {
                headers: headers,
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `delete third party subscriber with ID ${userId}`);
        }
        return null;
    }

    public async getThirdPartySubscriberOauthConfigByUserId(userId: string, adminUserId: string): Promise<any> {
        try {
            logger.info(`Third party subscriber with ID: ${userId} data requested by Admin with ID: ${adminUserId}`);
            const response = await accountManagementApi.get(`/third-party/configuration/${userId}`, {
                headers: {
                    'x-requester-id': adminUserId,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve third party subscriber oauth config with ID ${userId}`);
        }
        return null;
    }

    /**
     * Request to account management that creates a third party subscriber oauth config.
     * @param payload The payload containing the name of subscriber account to request.
     * @param requester The user ID of the person requesting this.
     */
    public async createThirdPartySubscriberOauthConfig(payload, requester): Promise<boolean> {
        try {
            const response = await accountManagementApi.post('/third-party/configuration', payload, {
                headers: { 'x-requester-id': requester },
            });
            logger.info('Third party subscriber oauth config created');
            return response.status === StatusCodes.CREATED;
        } catch (error) {
            logHelper.logErrorResponse(error, 'third party subscriber oauth config creation');
        }
        return null;
    }

    /**
     * Request to account management that update a third party subscriber oauth config.
     * @param payload The payload containing the name of subscriber account to request.
     * @param requester The user ID of the person requesting this.
     */
    public async updateThirdPartySubscriberOauthConfig(userId: string, payload, requester): Promise<boolean> {
        try {
            const response = await accountManagementApi.put(`/third-party/configuration/${userId}`, payload, {
                headers: { 'x-requester-id': requester },
            });
            logger.info('Third party subscriber oauth config updated');
            return response.status === StatusCodes.OK;
        } catch (error) {
            logHelper.logErrorResponse(error, 'third party subscriber oauth config updation');
        }
        return null;
    }
}
