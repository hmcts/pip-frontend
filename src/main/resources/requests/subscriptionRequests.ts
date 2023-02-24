import { subscriptionManagementApi } from './utils/axiosConfig';
import { UserSubscriptions } from '../../models/UserSubscriptions';

export class SubscriptionRequests {
    public async getUserSubscriptions(userId: string): Promise<UserSubscriptions> {
        try {
            const response = await subscriptionManagementApi.get(`/subscription/user/${userId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log(`ERROR: ${error.message}`);
            }
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
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log(`ERROR: ${error.message}`);
            }
            return null;
        }
    }

    public async subscribe(payload, userId: string): Promise<boolean> {
        try {
            await subscriptionManagementApi.post('/subscription', payload, {
                headers: { 'x-user-id': userId },
            });
            return true;
        } catch (error) {
            if (error.response) {
                console.log('Failed to create subscription');
            } else {
                console.log('Unknown error while creating a subscription');
            }
        }
        return false;
    }

    public async bulkDeleteSubscriptions(subscriptionIds: string[]): Promise<object> {
        try {
            const response = await subscriptionManagementApi.delete('/subscription/bulk', { data: subscriptionIds });
            return response.data;
        } catch (error) {
            if (error.response) {
                console.log('Failed to bulk delete subscriptions');
            } else {
                console.log(`ERROR: ${error.message}`);
            }
            return null;
        }
    }

    public async configureListTypeForLocationSubscriptions(userId, payload): Promise<boolean> {
        try {
            await subscriptionManagementApi.put(`/subscription/configure-list-types/${userId}`, payload);
            return true;
        } catch (error) {
            if (error.response) {
                console.log('Failed to configure list type for location subscription');
            } else {
                console.log('Unknown error while configuring list type for location subscription');
            }
        }
        return false;
    }

    public async retrieveSubscriptionChannels(): Promise<string[]> {
        try {
            const channelResponse = await subscriptionManagementApi.get('/meta/channels');
            return channelResponse.data;
        } catch (error) {
            if (error.response) {
                console.log('Failed to retrieve the list of channels');
            } else {
                console.log('Unknown error while attempting to retrieve the list of channels');
            }
        }
        return [];
    }

    public async deleteLocationSubscription(locationId: number, adminUserId: string): Promise<object> {
        try {
            const header = { headers: { 'x-provenance-user-id': adminUserId } };

            const response = await subscriptionManagementApi.delete(`/subscription/location/${locationId}`, header);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
            } else if (error.request) {
                console.log(`Request failed. ${error.request}`);
            } else {
                console.log(`ERROR: ${error.message}`);
            }
            return null;
        }
    }
}
