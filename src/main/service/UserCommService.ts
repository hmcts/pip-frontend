import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();

export class UserCommService {
    public async getUserComms() {
        const userComms = (await accountManagementRequests.getUserComms()) ?? [];
        const allUsersType = [];
        const userProvenanceType = [];
        const userRoleType = [];
        const venueType = [];
        const jurisdictionType = [];

        userComms.forEach(comm => {
            if (comm.commType === 'ALL_USERS') {
                allUsersType.push({
                    message: comm.message,
                    welshMessage: comm.welshMessage,
                });
            }

            if (comm.commType === 'USER_PROVENANCE') {
                userProvenanceType.push({
                    message: comm.message,
                    welshMessage: comm.welshMessage,
                    provenances: comm.userProvenances ?? [],
                });
            }

            if (comm.commType === 'USER_ROLE') {
                userRoleType.push({
                    message: comm.message,
                    welshMessage: comm.welshMessage,
                    roles: comm.userRoles ?? [],
                });
            }

            if (comm.commType === 'VENUE') {
                venueType.push({
                    message: comm.message,
                    welshMessage: comm.welshMessage,
                    venues: comm.locationIds ?? [],
                });
            }

            if (comm.commType === 'JURISDICTION') {
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
