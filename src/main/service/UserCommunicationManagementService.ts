import { UserCommunication } from 'models/UserCommunication';
import { UserCommunicationRequests } from '../resources/requests/UserCommunicationRequests';

const userCommunicationRequest = new UserCommunicationRequests();

export class UserCommunicationManagementService {
    /**
     * Returns the headers for the user communication management table.
     */
    public getTableHeaders() {
        return [
            { text: 'Message', classes: 'govuk-!-padding-top-0' },
            { text: 'Type of communication', classes: 'govuk-!-padding-top-0' },
            { text: 'Group', classes: 'govuk-!-padding-top-0' },
            { text: 'Actions', classes: 'govuk-!-padding-top-0' },
        ];
    }

    public async fetchAllUserCommunication(language: string): Promise<Array<any>> {
        return this.initialiseUserCommunicationWithLanguage(
            await userCommunicationRequest.getAllUserCommunications(),
            language
        );
    }

    public fetchUserCommunicationFormErrors(formData): any | null {
        const errors = {
            bannerMessageError: !formData?.bannerMessage,
            bannerMessageWelshError: !formData?.bannerMessageWelsh,
            typeOfCommunicationError: !formData?.typeOfCommunication,
        };
        return errors.bannerMessageError || errors.bannerMessageWelshError || errors.typeOfCommunicationError
            ? errors
            : null;
    }

    public async createUserCommunication(formData, userId): Promise<any> {
        return await userCommunicationRequest.createUserCommunication(
            this.formatUserCommunicationPayload(formData),
            userId
        );
    }

    public fetchUserCommunicationSummary(formData, language: string): any[] {
        const errors = this.fetchUserCommunicationFormErrors(formData);
        if (!errors) {
            const formattedUserCommunication = this.formatUserCommunicationPayload(formData);
            const group = UserCommunicationManagementService.getGroupByAudienceType(formattedUserCommunication);
            const editLink = formData.userCommunicationId
                ? `/edit-user-communication?id=${formData.userCommunicationId}`
                : '/create-user-communication';

            return [
                [
                    {
                        text:
                            language === 'cy' && formData.bannerMessageWelsh
                                ? formData.bannerMessageWelsh
                                : formData.bannerMessage,
                    },
                    {
                        text: formData.typeOfCommunication,
                    },
                    {
                        text: group.join(', '),
                    },
                    {
                        html: `<a class="govuk-link" href="${editLink}">Edit</a>`,
                    },
                ],
            ];
        }
        return [[]];
    }

    public async getFormDataById(userCommunicationId: string, requester: string): Promise<any> {
        const userCommunication = await userCommunicationRequest.getUserCommunicationById(userCommunicationId, requester);
        return userCommunication
            ? {
                  userCommunicationId: userCommunication.id,
                  bannerMessage: userCommunication.message,
                  bannerMessageWelsh: userCommunication.welshMessage,
                  typeOfCommunication: userCommunication.audienceType,
                  userProvenances: userCommunication.userProvenances,
                  userRoles: userCommunication.userRoles,
                  venues: userCommunication.venues,
                  subJurisdictions: userCommunication.subJurisdictions,
              }
            : {};
    }

    public async updateUserCommunication(formData: any, userCommunicationId: string, requester: string): Promise<any> {
        return await userCommunicationRequest.updateUserCommunication(
            this.formatUserCommunicationPayload(formData),
            userCommunicationId,
            requester
        );
    }

    public async deleteUserCommunication(userCommunicationId: string, requester: string): Promise<boolean> {
        return await userCommunicationRequest.deleteUserCommunication(userCommunicationId, requester);
    }

    private initialiseUserCommunicationWithLanguage(
        userCommunications: Array<UserCommunication>,
        language: string
    ): any[] {
        const userCommunicationsBasedOnLanguage = [];
        userCommunications.forEach(value => {
            const group = UserCommunicationManagementService.getGroupByAudienceType(value);

            const userCommunicationRow = [
                {
                    text: language === 'cy' && value['welshMessage'] ? value.welshMessage : value.message,
                },
                {
                    text: value.audienceType,
                },
                {
                    text: group.join(', '),
                },
                {
                    html: `<a class="govuk-link" href="/edit-user-communication?id=${value.id}">Edit</a>
                        <a class="govuk-link" href="/delete-user-communication?id=${value.id}">Delete</a>`,
                },
            ];

            userCommunicationsBasedOnLanguage.push(userCommunicationRow);
        });

        return userCommunicationsBasedOnLanguage;
    }

    private static getGroupByAudienceType(userCommunication: any) {
        let group: Array<string>;
        switch (userCommunication.audienceType) {
            case 'USER_PROVENANCE':
                group = userCommunication.userProvenances;
                break;
            case 'USER_ROLE':
                group = userCommunication.userRoles;
                break;
            case 'VENUE':
                group = userCommunication.venues;
                break;
            case 'JURISDICTION':
                group = userCommunication.subJurisdictions;
                break;
            default:
                group = [];
        }
        return group;
    }

    private formatUserCommunicationPayload(formData) {
        return {
            id: formData.userCommunicationId,
            message: formData.bannerMessage,
            welshMessage: formData.bannerMessageWelsh,
            audienceType: formData.typeOfCommunication,
            userProvenances: formData.userProvenances || [],
            userRoles: formData.userRoles || [],
            venues: formData.venues || [],
            subJurisdictions: formData.subJurisdictions || [],
        };
    }
}
