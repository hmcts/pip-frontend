import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();

export class UserCommunicationService {
    public async getUserCommunications() {
        const userCommunications = (await accountManagementRequests.getUserCommunications()) ?? [];
        const allUsersType = [];
        const userProvenanceType = [];
        const userRoleType = [];
        const venueType = [];
        const jurisdictionType = [];

        userCommunications.forEach(comm => {
            if (comm.audienceType === 'ALL_USERS') {
                allUsersType.push({
                    message: comm.message,
                    welshMessage: comm.welshMessage,
                });
            }

            if (comm.audienceType === 'USER_PROVENANCE') {
                userProvenanceType.push({
                    message: comm.message,
                    welshMessage: comm.welshMessage,
                    provenances: comm.userProvenances ?? [],
                });
            }

            if (comm.audienceType === 'USER_ROLE') {
                userRoleType.push({
                    message: comm.message,
                    welshMessage: comm.welshMessage,
                    roles: comm.userRoles ?? [],
                });
            }

            if (comm.audienceType === 'VENUE') {
                venueType.push({
                    message: comm.message,
                    welshMessage: comm.welshMessage,
                    venues: comm.venues ?? [],
                });
            }

            if (comm.audienceType === 'JURISDICTION') {
                jurisdictionType.push({
                    message: comm.message,
                    welshMessage: comm.welshMessage,
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
}
