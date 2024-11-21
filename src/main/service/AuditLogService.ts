import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();
import { DateTime } from 'luxon';
import { formattedProvenances, formattedRoles } from '../helpers/consts';
import { AuditLogSearchCriteria } from '../models/AuditLogSearchCriteria';
import auditActions from '../resources/auditActions.json';

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

    public async getFormattedAuditData(query: AuditLogSearchCriteria, queryUrl: string, adminUserId: string) {
        const rawData = await accountManagementRequests.getAllAuditLogs(this.buildRequestParams(query), adminUserId);

        return {
            paginationData: this.formatPaginationData(
                rawData?.number,
                rawData?.totalPages,
                rawData?.first,
                rawData?.last
            ),
            auditLogData: this.formatPageData(rawData?.content),
            emailFieldData: this.buildInputFieldObject('email', 'Email', query.email, true),
            userIdFieldData: this.buildInputFieldObject('userId', 'User ID', query.userId, true),
            actionsFieldData: this.buildCheckboxesFieldObject(
                'actions',
                'Actions',
                [...new Set(rawData?.content.map(item => item.action))],
                query.actions
            ),
            filterDateFieldData: this.buildDateInputFieldObject('filterDate', 'Filter Date', query.filterDate, true),
            categories: this.getCategories(query, queryUrl),
        };
    }

    /**
     * Builds the checkbox fields object for the filter.
     */
    private buildCheckboxesFieldObject(
        fieldId: string,
        fieldText: string,
        constItems: any,
        itemValues: string
    ): object {
        const checkboxesFieldObject = {
            idPrefix: fieldId,
            name: fieldId,
            classes: 'govuk-checkboxes--small',
            fieldset: {
                legend: {
                    text: fieldText,
                    classes: 'govuk-label--m',
                },
            },
        };

        const sortedAuditLogs = new Map(
            [...this.getAuditLogs()].sort((a, b) => a[1]['name'].localeCompare(b[1]['name']))
        );

        // KV pair of the value used in the api and a formatted value for the UI.
        const itemsArray = [];
        for (const auditLogs of sortedAuditLogs) {
            itemsArray.push({
                value: auditLogs[1].key,
                text: auditLogs[1].name,
                checked: itemValues.includes(auditLogs[1].key),
            });
        }

        checkboxesFieldObject['items'] = itemsArray;
        return checkboxesFieldObject;
    }

    public getAuditLogs(): Map<string, any> {
        return new Map(Object.entries(auditActions));
    }

    /**
     * Builds the input fields object for the filter.
     */
    private buildInputFieldObject(fieldId: string, fieldText: string, fieldValue: string, hint: boolean): object {
        const inputFieldObject = {
            id: fieldId,
            name: fieldId,
            label: {
                text: fieldText,
                classes: 'govuk-label--m',
            },
            value: fieldValue,
        };

        if (hint) {
            inputFieldObject['hint'] = {
                text: 'Must be an exact match',
            };
        }
        return inputFieldObject;
    }

    /**
     * Builds the input fields object for the filter.
     */
    private buildDateInputFieldObject(fieldId: string, fieldText: string, fieldDate: string, hint: boolean): object {
        const date = fieldDate.split('-');
        const inputFieldObject = {
            id: fieldId,
            namePrefix: fieldId,
            fieldset: {
                legend: {
                    text: fieldText,
                    classes: 'govuk-fieldset__legend--m',
                },
            },
            items: [
                {
                    name: 'day',
                    classes: 'govuk-input--width-2',
                    value: date?.length === 3 ? date[2] : '',
                },
                {
                    name: 'month',
                    classes: 'govuk-input--width-2',
                    value: date?.length === 3 ? date[1] : '',
                },
                {
                    name: 'year',
                    classes: 'govuk-input--width-2',
                    value: date?.length === 3 ? date[0] : '',
                },
            ],
        };

        if (hint) {
            inputFieldObject['hint'] = {
                text: 'For example, 27 3 2007',
            };
        }
        return inputFieldObject;
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

    /**
     * Builds the request with the supplied filters to filter the API results.
     */
    private buildRequestParams(query: AuditLogSearchCriteria): object {
        return {
            params: {
                pageSize: 25,
                pageNumber: query.page - 1,
                email: query.email,
                userId: query.userId,
                actions: query.actions,
                filterDate: query.filterDate,
            },
        };
    }

    /**
     * Builds the category array with category objects.
     */
    private getCategories(query: AuditLogSearchCriteria, queryUrl: string) {
        const categoriesArray = [];

        categoriesArray.push(this.buildCategoryObject('Email', query.email, queryUrl, 'email=', false));
        categoriesArray.push(this.buildCategoryObject('User ID', query.userId, queryUrl, 'userId=', false));
        categoriesArray.push(this.buildCategoryObject('Actions', query.actions, queryUrl, 'actions=', true));
        categoriesArray.push(this.buildCategoryObject('Filter Date', query.filterDate, queryUrl, 'filterDate=', false));

        return categoriesArray;
    }

    /**
     * Builds a category object used to show what is selected in the filter.
     */
    private buildCategoryObject(
        heading: string,
        itemValues: string,
        queryUrl: string,
        urlParam: string,
        checkboxes: boolean
    ) {
        let categoryObject = {};
        if (itemValues.length) {
            categoryObject = {
                heading: {
                    text: heading,
                },
            };

            const itemsArray = [];
            if (checkboxes) {
                const itemValuesArray = itemValues.split(',');
                itemValuesArray.forEach(item => {
                    itemsArray.push({
                        href: queryUrl + '&clear=' + urlParam + item,
                        text: item,
                    });
                });
            } else {
                itemsArray.push({
                    href: queryUrl + '&clear=' + urlParam + itemValues,
                    text: itemValues,
                });
            }
            categoryObject['items'] = itemsArray;
        }
        return categoryObject;
    }

    /**
     * Generates the filter KV for the query param url.
     */
    public generateFilterKeyValues(body: string): string {
        const filterValues = [];
        Object.keys(body).forEach(key => {
            if (body[key].length > 0) {
                let separator = '&';
                if (filterValues.length === 0) {
                    separator = '';
                }
                filterValues.push(separator + key + '=' + body[key]);
            }
        });
        return filterValues.join('');
    }

    public validateDate(query: object, fieldsetPrefix: string): string {
        if (
            query[`${fieldsetPrefix}-day`] === undefined &&
            query[`${fieldsetPrefix}-month`] === undefined &&
            query[`${fieldsetPrefix}-year`] === undefined
        ) {
            return '';
        }

        const date = this.buildDate(query, fieldsetPrefix);
        if (date != null) {
            const dateformat = DateTime.fromFormat(date, 'yyyy-MM-dd');
            if (dateformat.isValid) {
                return date;
            }
        }
        return null;
    }

    private buildDate(body: object, fieldsetPrefix: string): string {
        return body[`${fieldsetPrefix}-year`]?.concat(
            '-',
            body[`${fieldsetPrefix}-month`]?.length === 1
                ? '0' + body[`${fieldsetPrefix}-month`]
                : body[`${fieldsetPrefix}-month`],
            '-',
            body[`${fieldsetPrefix}-day`]?.length === 1
                ? '0' + body[`${fieldsetPrefix}-day`]
                : body[`${fieldsetPrefix}-day`]
        );
    }

    /**
     * Handles removing filters based off what is in the clear object.
     */
    public handleFilterClearing(body: any) {
        if (body.clear === 'all') {
            body = {};
        } else {
            const clearBody = body.clear.split('=');
            switch (clearBody[0]) {
                case 'email':
                    delete body.email;
                    break;
                case 'userId':
                    delete body.userId;
                    break;
                case 'actions':
                    body.actions = body.actions.split(',').filter(f => f !== clearBody[1]);
                    break;
                case 'filterDate':
                    delete body[`filterDate-day`];
                    delete body[`filterDate-month`];
                    delete body[`filterDate-year`];
                    break;
            }
            delete body.clear;
            delete body.page;
        }
        return body;
    }
}
