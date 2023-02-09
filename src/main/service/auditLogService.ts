import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();
import { DateTime } from 'luxon';
export class AuditLogService {
    /**
     * Returns the headers for the audit log table.
     */
    public getTableHeaders() {
        return [
            { text: 'Timestamp', classes: 'govuk-!-padding-top-0' },
            { text: 'Email/User ID', classes: 'govuk-!-padding-top-0' },
            { text: 'Action', classes: 'govuk-!-padding-top-0' },
            { text: 'Details', classes: 'govuk-!-padding-top-0' },
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
                const auditLogArray = [];
                auditLogArray.push({ text: this.formatDate(auditLog.timestamp) });
                auditLogArray.push({ text: auditLog.userEmail + '\n' + auditLog.userId });
                auditLogArray.push({ text: auditLog.action });
                auditLogArray.push({ text: auditLog.details });
                auditLogData.push(auditLogArray);
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
