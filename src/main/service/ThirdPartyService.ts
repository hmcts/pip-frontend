import { DateTime } from 'luxon';
import { ThirdPartyRequests } from '../resources/requests/ThirdPartyRequests';
import { Logger } from '@hmcts/nodejs-logging';
import { PublicationService } from './PublicationService';
import { ThirdPartySubscription } from '../models/ThirdPartySubscription';

const publicationService = new PublicationService();

const sensitivityLevels = ['Public', 'Private', 'Classified'];
const defaultSensitivityItem = { text: '<Not selected>', value: 'EMPTY' };

interface SensitivityItem {
    text: string;
    value: string;
    selected?: boolean;
}

interface ListTypeValue {
    friendlyName: string;
    sensitivityItems: SensitivityItem[];
}

/**
 * This service class handles support methods for dealing with third parties
 */
export class ThirdPartyService {
    logger = Logger.getLogger('thirdPartyService');
    thirdPartyRequests = new ThirdPartyRequests();

    /**
     * Service which gets third party subscribers from the backend.
     */
    public async getThirdPartySubscribers(adminUserId): Promise<any> {
        const returnedAccounts = await this.thirdPartyRequests.getThirdPartySubscribers(adminUserId);
        for (const account of returnedAccounts) {
            account['createdDate'] = DateTime.fromISO(account['createdDate'], {
                zone: 'Europe/London',
            }).toFormat('dd MMMM yyyy');
        }
        return returnedAccounts;
    }

    /**
     * Method which retrieves a subscriber by its User ID.
     *
     * If the user is not available, then this will return null.
     * It also sets the created date of the user to the right format.
     */
    public async getThirdPartySubscriberById(userId, adminUserId): Promise<any> {
        const account = await this.thirdPartyRequests.getThirdPartySubscriberByUserId(userId, adminUserId);
        if (account) {
            account['createdDate'] = DateTime.fromISO(account['createdDate']).toFormat('dd MMMM yyyy');
            return account;
        }
        return null;
    }

    public validateThirdPartySubscriberFormFields(formData): any | null {
        const fields = {
            userNameError: !formData.thirdPartySubscriberName,
        };
        return fields.userNameError ? fields : null;
    }

    public async createThirdPartySubscriber(formData, requesterId): Promise<boolean> {
        return await this.thirdPartyRequests.createThirdPartySubscriber(
            this.formatThirdPartySubscriberPayload(formData),
            requesterId
        );
    }

    private formatThirdPartySubscriberPayload(formData) {
        return { name: formData.thirdPartySubscriberName };
    }

    public async createThirdPartySubscriptions(
        formData: Map<string, string>,
        userId: string,
        requesterId: string
    ): Promise<boolean> {
        return await this.thirdPartyRequests.createThirdPartySubscriptions(
            this.formatThirdPartySubscriptionsPayload(formData, userId),
            requesterId
        );
    }

    public async updateThirdPartySubscriptions(
        formData: Map<string, string>,
        userId: string,
        requesterId: string
    ): Promise<boolean> {
        return await this.thirdPartyRequests.updateThirdPartySubscriptions(
            this.formatThirdPartySubscriptionsPayload(formData, userId),
            userId,
            requesterId
        );
    }

    public async getThirdPartySubscriptionsByUserId(
        userId: string,
        adminUserId: string
    ): Promise<ThirdPartySubscription[]> {
        const subscriptions = await this.thirdPartyRequests.getThirdPartySubscriptionsByUserId(userId, adminUserId);
        return subscriptions;
    }

    private formatThirdPartySubscriptionsPayload(
        listTypes: Map<string, string>,
        userId: string
    ): ThirdPartySubscription[] {
        const payload = [];
        listTypes.forEach((value, key) =>
            payload.push({
                userId: userId,
                listType: key,
                sensitivity: value.toUpperCase(),
            })
        );
        return payload;
    }

    public constructListTypeSensitivityMappings(subscriptions: ThirdPartySubscription[]): Map<string, ListTypeValue> {
        const listTypeSensitivityMap = new Map<string, ListTypeValue>();

        // Create a map of existing subscribed list types with their sensitivities for easy lookup
        const subscriptionMap: Map<string, string> = subscriptions
            ? new Map(subscriptions.map(obj => [obj.listType, obj.sensitivity]))
            : new Map();

        publicationService.getListTypes().forEach((value, key) => {
            const sensitivityItems = this.populateSensitivityItems(key, subscriptionMap);
            listTypeSensitivityMap.set(key, {
                friendlyName: value.friendlyName,
                sensitivityItems: sensitivityItems,
            });
        });

        // Sort the map by friendly name alphabetically
        return new Map(
            [...listTypeSensitivityMap].sort(([, v], [, v2]) => (v.friendlyName < v2.friendlyName ? -1 : 1))
        );
    }

    private populateSensitivityItems(listType: string, subscriptionMap: Map<string, string>): SensitivityItem[] {
        const sensitivityItems: SensitivityItem[] = [defaultSensitivityItem];

        sensitivityLevels.forEach(level => {
            sensitivityItems.push({
                text: level,
                value: level,
                selected: subscriptionMap.has(listType) && subscriptionMap.get(listType) === level.toUpperCase(),
            });
        });

        return sensitivityItems;
    }
}
