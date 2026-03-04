import { accountManagementApi } from './utils/axiosConfig';
import { LogHelper } from '../logging/logHelper';
import { StatusCodes } from 'http-status-codes';
import { ThirdPartySubscription } from '../../models/ThirdPartySubscription';
const logHelper = new LogHelper();

export class ThirdPartyRequests {
    /**
     * Request to account management that creates a third-party subscriber account.
     * @param payload The payload containing the name of subscriber account to request.
     * @param requester The user ID of the person requesting this.
     */
    public async createThirdPartySubscriber(payload, requester): Promise<boolean> {
        try {
            const response = await accountManagementApi.post('/third-party', payload, {
                headers: { 'x-requester-id': requester },
            });
            return response.status === StatusCodes.CREATED;
        } catch (error) {
            logHelper.logErrorResponse(error, 'third-party subscriber account creation');
        }
        return null;
    }

    public async getThirdPartySubscribers(adminUserId): Promise<any> {
        try {
            const response = await accountManagementApi.get('/third-party', {
                headers: {
                    'x-requester-id': adminUserId,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve third-party subscribers');
        }
        return null;
    }

    public async getThirdPartySubscriberByUserId(userId: string, adminUserId: string): Promise<any> {
        try {
            const response = await accountManagementApi.get(`/third-party/${userId}`, {
                headers: {
                    'x-requester-id': adminUserId,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve third-party subscriber with ID ${userId}`);
        }
        return null;
    }

    public async deleteThirdPartySubscriber(userId: string, adminUserId): Promise<object> {
        try {
            const headers = adminUserId ? { 'x-requester-id': adminUserId } : {};
            const response = await accountManagementApi.delete(`/third-party/${userId}`, {
                headers: headers,
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `delete third-party subscriber with ID ${userId}`);
        }
        return null;
    }

    public async createThirdPartySubscriptions(payload: ThirdPartySubscription[], requester: string): Promise<boolean> {
        try {
            await accountManagementApi.post('/third-party/subscription', payload, {
                headers: { 'x-requester-id': requester },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, 'create third party subscriptions');
        }
        return false;
    }

    public async updateThirdPartySubscriptions(
        payload: ThirdPartySubscription[],
        userId: string,
        requester: string
    ): Promise<boolean> {
        try {
            await accountManagementApi.put(`/third-party/subscription/${userId}`, payload, {
                headers: { 'x-requester-id': requester },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, `update third party subscriptions with user ID ${userId}`);
        }
        return false;
    }

    public async getThirdPartySubscriptionsByUserId(
        userId: string,
        requester: string
    ): Promise<ThirdPartySubscription[]> {
        try {
            const response = await accountManagementApi.get(`/third-party/subscription/${userId}`, {
                headers: {
                    'x-requester-id': requester,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve third party subscriptions with user ID ${userId}`);
        }
        return null;
    }

    /**
     * Request to account management that get third-party subscriber OAuth config.
     * @param userId The third-party subscriber ID
     * @param requester The user ID of the person requesting this.
     */
    public async getThirdPartySubscriberOauthConfigByUserId(userId: string, adminUserId: string): Promise<any> {
        try {
            const response = await accountManagementApi.get(`/third-party/configuration/${userId}`, {
                headers: {
                    'x-requester-id': adminUserId,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve third-party subscriber OAuth config with ID ${userId}`);
        }
        return null;
    }

    /**
     * Request to account management that creates a third-party subscriber OAuth config.
     * @param payload The payload containing the name of subscriber account to request.
     * @param requester The user ID of the person requesting this.
     */
    public async createThirdPartySubscriberOauthConfig(payload, requester): Promise<boolean> {
        try {
            const response = await accountManagementApi.post('/third-party/configuration', payload, {
                headers: { 'x-requester-id': requester },
            });
            return response.status === StatusCodes.CREATED;
        } catch (error) {
            logHelper.logErrorResponse(error, 'create third-party subscriber OAuth config');
        }
        return null;
    }

    /**
     * Request to account management that update a third-party subscriber OAuth config.
     * @param payload The payload containing the name of subscriber account to request.
     * @param requester The user ID of the person requesting this.
     */
    public async updateThirdPartySubscriberOauthConfig(userId: string, payload, requester): Promise<boolean> {
        try {
            const response = await accountManagementApi.put(`/third-party/configuration/${userId}`, payload, {
                headers: { 'x-requester-id': requester },
            });
            return response.status === StatusCodes.OK;
        } catch (error) {
            logHelper.logErrorResponse(error, 'third party subscriber oauth config update');
            logHelper.logErrorResponse(error, 'update third-party subscriber OAuth config');
        }
        return null;
    }

    public async thirdPartyConfigurationHealthCheck(userId: string, requester: string): Promise<boolean | string> {
        try {
            await accountManagementApi.get(`/third-party/configuration/healthcheck/${userId}`, {
                headers: { 'x-requester-id': requester },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, 'third-party configuration health check');
            if (error.response?.status === 500 && error.response?.data?.message) {
                return error.response.data.message;
            }
            return false;
        }
    }

    /**
     * Request to account management to update the status of a third party subscriber.
     * @param userId The ID of the third party subscriber whose status is to be updated.
     * @param status The new status for the subscriber.
     * @param adminUserId The user ID of the admin performing the update.
     */
    public async updateThirdPartySubscriberStatus(
        userId: string,
        status: string,
        adminUserId: string
    ): Promise<boolean> {
        try {
            const response = await accountManagementApi.patch(`/third-party/${userId}/status`, status, {
                headers: { 'x-requester-id': adminUserId, 'Content-Type': 'application/json' },
            });
            logger.info('Third party subscriber status updated.');
            return response.status === 200;
        } catch (error) {
            logHelper.logErrorResponse(error, `update third party subscriber status for user ID ${userId}`);
        }
        return false;
    }
}
