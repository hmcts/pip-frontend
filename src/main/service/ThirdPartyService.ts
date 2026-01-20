import { DateTime } from 'luxon';
import { ThirdPartyRequests } from '../resources/requests/ThirdPartyRequests';
import { Logger } from '@hmcts/nodejs-logging';

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
            userNameError: !formData?.thirdPartySubscriberName,
        };
        return fields.userNameError ? fields : null;
    }

    public async createThirdPartySubscriber(formData, requesterId): Promise<boolean> {
        return await this.thirdPartyRequests.createThirdPartySubscriber(
            this.formatThirdPartySubscriberPayload(formData),
            requesterId
        );
    }

    public async createThirdPartySubscriberOauthConfig(formData, requesterId): Promise<boolean> {
        return await this.thirdPartyRequests.createThirdPartySubscriberOauthConfig(
            this.formatThirdPartySubscriberOauthConfigPayload(formData),
            requesterId
        );
    }

    public async updateThirdPartySubscriberOauthConfig(formData, requesterId): Promise<boolean> {
        return await this.thirdPartyRequests.updateThirdPartySubscriberOauthConfig(
            formData.user,
            this.formatThirdPartySubscriberOauthConfigPayload(formData),
            requesterId
        );
    }

    private formatThirdPartySubscriberPayload(formData) {
        return { name: formData.thirdPartySubscriberName };
    }

    private formatThirdPartySubscriberOauthConfigPayload(formData) {
        return {
            userId: formData.user,
            destinationUrl: formData.destinationUrl,
            tokenUrl: formData.tokenUrl,
            clientIdKey: formData.clientIdKey,
            clientSecretKey: formData.clientSecretKey,
            scopeKey: formData.scopeKey,
        };
    }

    public validateThirdPartySubscriberOauthConfigFormFields(formData): any | null {
        const fields = {
            destinationUrlError: !formData.destinationUrl,
            tokenUrlError: !formData.tokenUrl,
            scopeKeyError: !formData.scopeKey,
            scopeValueError: !formData.scopeValue,
            clientIdKeyError: !formData.clientIdKey,
            clientIdError: !formData.clientId,
            clientSecretKeyError: !formData.clientSecretKey,
            clientSecretError: !formData.clientSecret,
        };

        return Object.values(fields).some(error => error) ? fields : null;
    }
}
