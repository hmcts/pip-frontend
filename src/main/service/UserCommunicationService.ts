import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();

export class UserCommunicationService {
    public async getUserCommunications(lng = 'en'): Promise<any> {
        const userCommunications = (await accountManagementRequests.getUserCommunications()) ?? [];
        const allUsersType = [];
        const userProvenanceType = [];
        const userRoleType = [];
        const venueType = [];
        const jurisdictionType = [];

        userCommunications.forEach(comm => {
            if (comm.audienceType === 'ALL_USERS') {
                allUsersType.push({
                    message: this.getMessage(comm, lng),
                });
            } else if (comm.audienceType === 'USER_PROVENANCE') {
                userProvenanceType.push({
                    message: this.getMessage(comm, lng),
                    provenances: comm.userProvenances ?? [],
                });
            } else if (comm.audienceType === 'USER_ROLE') {
                userRoleType.push({
                    message: this.getMessage(comm, lng),
                    roles: comm.userRoles ?? [],
                });
            } else if (comm.audienceType === 'VENUE') {
                venueType.push({
                    message: this.getMessage(comm, lng),
                    venues: comm.venues ?? [],
                });
            } else if (comm.audienceType === 'JURISDICTION') {
                jurisdictionType.push({
                    message: this.getMessage(comm, lng),
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

    private getMessage(data, lng) {
        if (lng === 'cy' && data.welshMessage) {
            return data.welshMessage;
        }
        return data.message
    }
}
