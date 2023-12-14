import { subscriptionManagementApi } from './utils/axiosConfig';
import { UserSubscriptions } from '../../models/UserSubscriptions';
import { LogHelper } from '../logging/logHelper';

const logHelper = new LogHelper();

export class SubscriptionRequests {
    public async getUserSubscriptions(userId: string): Promise<UserSubscriptions> {
        try {
            const response = await subscriptionManagementApi.get(`/subscription/user/${userId}`);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve subscriptions for user with ID ${userId}`);
        }
        return null;
    }

    public async unsubscribe(subscriptionId: string, userId: string): Promise<object> {
        try {
            const response = await subscriptionManagementApi.delete(`/subscription/${subscriptionId}`, {
                headers: { 'x-user-id': userId },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `delete subscription with ID ${subscriptionId}`);
        }
        return null;
    }

    public async subscribe(payload, userId: string): Promise<boolean> {
        try {
            await subscriptionManagementApi.post('/subscription', payload, {
                headers: { 'x-user-id': userId },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, 'create subscription');
        }
        return false;
    }

    public async bulkDeleteSubscriptions(subscriptionIds: string[], userId: string): Promise<object> {
        try {
            const response = await subscriptionManagementApi.delete('/subscription/v2/bulk', {
                headers: { 'x-user-id': userId },
                data: subscriptionIds,
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'bulk delete subscriptions');
        }
        return null;
    }

    public async configureListTypeForLocationSubscriptions(userId, payload): Promise<boolean> {
        try {
            await subscriptionManagementApi.put(`/subscription/configure-list-types/${userId}`, payload);
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, `configure subscription's list type for user with ID ${userId}`);
        }
        return false;
    }

    public async retrieveSubscriptionChannels(): Promise<string[]> {
        try {
            const channelResponse = await subscriptionManagementApi.get('/meta/channels');
            return channelResponse.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve the list of subscription channels');
        }
        return [];
    }

    public async deleteLocationSubscription(locationId: number, adminUserId: string): Promise<object> {
        try {
            const header = { headers: { 'x-provenance-user-id': adminUserId } };

            const response = await subscriptionManagementApi.delete(`/subscription/location/${locationId}`, header);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `delete subscriptions for location with ID ${locationId}`);
        }
        return null;
    }
}
