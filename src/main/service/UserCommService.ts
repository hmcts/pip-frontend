import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();

export class UserCommService {
    public async getUserComms() {
        const userComms = (await accountManagementRequests.getUserComms()) ?? [];
        const allUsersType = [];
        const userProvenanceType = [];
        const userRoleType = [];
        const venueType = [];

        userComms.forEach(comm => {
            if (comm.commType === 'ALL_USERS') {
                allUsersType.push({
                    message: comm.message,
                });
            }

            if (comm.commType === 'USER_PROVENANCE') {
                userProvenanceType.push({
                    message: comm.message,
                    provenances: comm.userProvenances ?? [],
                });
            }

            if (comm.commType === 'USER_ROLE') {
                userRoleType.push({
                    message: comm.message,
                    roles: comm.userRoles ?? [],
                });
            }

            if (comm.commType === 'VENUE') {
                venueType.push({
                    message: comm.message,
                    venues: comm.locationIds ?? [],
                });
            }
        });

        return {
            allUsersType,
            userProvenanceType,
            userRoleType,
            venueType,
        }
    }
}
