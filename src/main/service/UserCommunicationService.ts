import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();

export class UserCommunicationService {
    public async groupCommunicationMessages(): Promise<any> {
        const userCommunications = (await accountManagementRequests.getUserCommunications()) ?? [];
        const allUsersType = [];
        const userProvenanceType = [];
        const userRoleType = [];
        const venueType = [];
        const jurisdictionType = [];

        userCommunications.forEach(comm => {
            if (comm.audienceType === 'ALL_USERS') {
                allUsersType.push({
                    ...this.buildMessages(comm),
                });
            } else if (comm.audienceType === 'USER_PROVENANCE') {
                userProvenanceType.push({
                    ...this.buildMessages(comm),
                    provenances: comm.userProvenances ?? [],
                });
            } else if (comm.audienceType === 'USER_ROLE') {
                userRoleType.push({
                    ...this.buildMessages(comm),
                    roles: comm.userRoles ?? [],
                });
            } else if (comm.audienceType === 'VENUE') {
                venueType.push({
                    ...this.buildMessages(comm),
                    venues: comm.venues ?? [],
                });
            } else if (comm.audienceType === 'JURISDICTION') {
                jurisdictionType.push({
                    ...this.buildMessages(comm),
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

    private buildMessages(data) {
        const welshMessage = data.welshMessage ? data.welshMessage : data.message;
        return {
            message: data.message,
            welshMessage: welshMessage,
        };
    }
}
