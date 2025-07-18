import { accountManagementApi } from './utils/axiosConfig';
import { UserSubscriptions } from '../../models/UserSubscriptions';
import { LogHelper } from '../logging/logHelper';

const logHelper = new LogHelper();

export class SubscriptionRequests {
    public async getUserSubscriptions(userId: string): Promise<UserSubscriptions> {
        try {
            const response = await accountManagementApi.get(`/subscription/user/${userId}`);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve subscriptions for user with ID ${userId}`);
        }
        return null;
    }

    public async unsubscribe(subscriptionId: string, userId: string): Promise<object> {
        try {
            const response = await accountManagementApi.delete(`/subscription/${subscriptionId}`, {
                headers: { 'x-requester-id': userId },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `delete subscription with ID ${subscriptionId}`);
        }
        return null;
    }

    public async subscribe(payload, userId: string): Promise<boolean> {
        try {
            await accountManagementApi.post('/subscription', payload, {
                headers: { 'x-requester-id': userId },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, 'create subscription');
        }
        return false;
    }

    public async bulkDeleteSubscriptions(subscriptionIds: string[], userId: string): Promise<object> {
        try {
            const response = await accountManagementApi.delete('/subscription/bulk', {
                headers: { 'x-requester-id': userId },
                data: subscriptionIds,
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'bulk delete subscriptions');
        }
        return null;
    }

    public async addListTypeForLocationSubscriptions(userId, payload): Promise<boolean> {
        try {
            await accountManagementApi.post(`/subscription/add-list-types/${userId}`, payload, {
                headers: { 'x-requester-id': userId },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, `add subscription's list type for user with ID ${userId}`);
        }
        return false;
    }

    public async configureListTypeForLocationSubscriptions(userId, payload): Promise<boolean> {
        try {
            await accountManagementApi.put(`/subscription/configure-list-types/${userId}`, payload, {
                headers: { 'x-requester-id': userId },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, `configure subscription's list type for user with ID ${userId}`);
        }
        return false;
    }

    public async retrieveSubscriptionChannels(userId, adminUserId): Promise<string[]> {
        try {
            const channelResponse = await accountManagementApi.get('/subscription/channel?userId=' + userId, {
                headers: { 'x-requester-id': adminUserId },
            });
            return channelResponse.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve the list of subscription channels');
        }
        return [];
    }

    public async deleteLocationSubscription(locationId: number, userId: string): Promise<object> {
        try {
            const header = { headers: { 'x-requester-id': userId } };
            const response = await accountManagementApi.delete(`/subscription/location/${locationId}`, header);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `delete subscriptions for location with ID ${locationId}`);
        }
        return null;
    }

    public async fulfillSubscriptions(artefact): Promise<string> {
        try {
            const response = await accountManagementApi.post('/subscription/artefact-recipients', artefact);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `fulfill subscriptions for artefact with ID ${artefact.arterfactId}`);
        }
        return null;
    }
}
