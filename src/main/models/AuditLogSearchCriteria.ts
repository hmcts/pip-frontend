/**
 * Model which handles querying on the Audit Logs page.
 */
export class AuditLogSearchCriteria {
    page: number;
    email: string;
    userId: string;
    actions: string;
    filterDate: string;

    constructor(page, email, userId, actions, filterDate) {
        this.page = parseInt(page) || 1;
        this.email = email || '';
        this.userId = userId || '';
        this.actions = actions || '';
        this.filterDate = filterDate || '';
    }
}
