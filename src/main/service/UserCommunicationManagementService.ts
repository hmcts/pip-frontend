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

    private static getGroupByAudienceType(userCommunication: UserCommunication) {
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
}
