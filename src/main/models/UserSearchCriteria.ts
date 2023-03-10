/**
 * Model which handles querying on the User Management page.
 */
export class UserSearchCriteria {
    page: number;
    email: string;
    userId: string;
    userProvenanceId: string;
    roles: string;
    provenances: string;

    constructor(page, email, userId, userProvenanceId, roles, provenances) {
        this.page = parseInt(page) || 1;
        this.email = email || '';
        this.userId = userId || '';
        this.userProvenanceId = userProvenanceId || '';
        this.roles = roles || '';
        this.provenances = provenances || '';
    }
}
