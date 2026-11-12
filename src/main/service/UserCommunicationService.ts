import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();

export class UserCommunicationService {
    public async groupCommunicationMessages(lng = 'en'): Promise<any> {
        const userCommunications = (await accountManagementRequests.getUserCommunications()) ?? [];
        const allUsersType = [];
        const userProvenanceType = [];
        const userRoleType = [];
        const venueType = [];
        const jurisdictionType = [];

        userCommunications.forEach(comm => {
            if (comm.audienceType === 'ALL_USERS') {
                allUsersType.push({
                    message: this.getMessageByLanguage(comm, lng),
                });
            } else if (comm.audienceType === 'USER_PROVENANCE') {
                userProvenanceType.push({
                    message: this.getMessageByLanguage(comm, lng),
                    provenances: comm.userProvenances ?? [],
                });
            } else if (comm.audienceType === 'USER_ROLE') {
                userRoleType.push({
                    message: this.getMessageByLanguage(comm, lng),
                    roles: comm.userRoles ?? [],
                });
            } else if (comm.audienceType === 'VENUE') {
                venueType.push({
                    message: this.getMessageByLanguage(comm, lng),
                    venues: comm.venues ?? [],
                });
            } else if (comm.audienceType === 'JURISDICTION') {
                jurisdictionType.push({
                    message: this.getMessageByLanguage(comm, lng),
                    subJurisdictions: comm.subJurisdictions ?? [],
                });
            }
        });

        return {
            allUsersType,
            userProvenanceType,
            userRoleType,
            venueType,
            jurisdictionType,
        };
    }

    private getMessageByLanguage(data, lng) {
        if (lng === 'cy' && data.welshMessage) {
            return data.welshMessage;
        }
        return data.message;
    }
}
