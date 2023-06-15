import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();
import { DateTime } from 'luxon';
import { formattedProvenances, formattedRoles } from '../models/consts';

export class AuditLogService {
    /**
     * Returns the headers for the audit log table.
     */
    public getTableHeaders() {
        return [
            { text: 'Timestamp', classes: 'govuk-!-padding-top-0' },
            { text: 'Email', classes: 'govuk-!-padding-top-0' },
            { text: 'Action', classes: 'govuk-!-padding-top-0' },
            { text: '', classes: 'govuk-!-padding-top-0' },
        ];
    }


    public async getFormattedAuditData(pageNumber: number, adminUserId: string) {
        const rawData = await accountManagementRequests.getAllAuditLogs(
            { params: { pageNumber: pageNumber - 1, pageSize: 10 } },
            adminUserId
        );

        return {
            paginationData: this.formatPaginationData(
                rawData?.number,
                rawData?.totalPages,
                rawData?.first,
                rawData?.last
            ),
            auditLogData: this.formatPageData(rawData?.content),
        };
    }

    public async buildAuditLogDetailsSummaryList(id: string): Promise<object> {
        const auditLog = await accountManagementRequests.getAuditLogById(id);
        const rows = [];

        if (auditLog) {
            rows.push(this.buildSummaryListItem('User ID', auditLog.userId));
            rows.push(this.buildSummaryListItem('Email', auditLog.userEmail));
            rows.push(this.buildSummaryListItem('Role', formattedRoles[auditLog.roles]));
            rows.push(this.buildSummaryListItem('Provenance', formattedProvenances[auditLog.userProvenance]));
            rows.push(this.buildSummaryListItem('Action', auditLog.action));
            rows.push(this.buildSummaryListItem('Details', auditLog.details));
        }

        return { rows };
    }

    private buildSummaryListItem(headingText: string, rowValue: string): object {
        return {
            key: { text: headingText },
            value: { text: rowValue },
        };
    }

    /**
     * Formats the object required for the pagination component in the frontend.
     */
    private formatPaginationData(currentPage: number, finalPage: number, first: boolean, last: boolean) {
        const paginationObject = {
            previous: null,
            next: null,
        };
        if (!first) {
            paginationObject.previous = {
                labelText: currentPage + ' of ' + finalPage,
                href: '?page=' + currentPage,
            };
        }

        if (!last) {
            paginationObject.next = {
                labelText: currentPage + 2 + ' of ' + finalPage,
                href: '?page=' + (currentPage + 2),
            };
        }
        return paginationObject;
    }

    /**
     * Formats the returned audit log data into the correct format for the frontend table.
     */
    private formatPageData(rawData: any) {
        const auditLogData = [];
        if (rawData.length > 0) {
            rawData.forEach(auditLog => {
                auditLogData.push({
                    id: auditLog.id,
                    email: auditLog.userEmail,
                    action: auditLog.action,
                    timestamp: this.formatDate(auditLog.timestamp),
                });
            });
        }
        return auditLogData;
    }

    /**
     * Format and return the date with the correct format.
     */
    private formatDate(rawDate: any) {
        return DateTime.fromISO(rawDate, { zone: 'europe/london' }).toFormat('dd/MM/yyyy HH:mm:ss');
    }
}
