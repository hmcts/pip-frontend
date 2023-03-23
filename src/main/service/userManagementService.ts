import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import { formattedProvenances, formattedRoles } from '../models/consts';
import { DateTime } from 'luxon';
import { UserSearchCriteria } from '../models/UserSearchCriteria';

const accountManagementRequests = new AccountManagementRequests();
export class UserManagementService {
    /**
     * Returns the headers for the user management table.
     */
    public getTableHeaders() {
        return [
            { text: 'Email', classes: 'govuk-!-padding-top-0' },
            { text: 'Role', classes: 'govuk-!-padding-top-0' },
            { text: 'Provenance', classes: 'govuk-!-padding-top-0' },
            { text: '', classes: 'govuk-!-padding-top-0' },
        ];
    }

    /**
     * Returns all the formatted data the user management screen requires. Treat this like a parent method
     * for the entire service.
     */
    public async getFormattedData(query: UserSearchCriteria, queryUrl: string, adminUser: any) {
        const rawData = await accountManagementRequests.getAllAccountsExceptThirdParty(
            this.buildRequestParams(query),
            adminUser.userId
        );

        await this.auditAction(adminUser, 'USER_MANAGEMENT_VIEW', 'All user data requested by this admin');

        return {
            paginationData: this.formatPaginationData(
                rawData?.number,
                rawData?.totalPages,
                rawData?.first,
                rawData?.last,
                queryUrl
            ),
            userData: this.formatPageData(rawData?.content),
            emailFieldData: this.buildInputFieldObject('email', 'Email', query.email, false),
            userIdFieldData: this.buildInputFieldObject('userId', 'User ID', query.userId, true),
            userProvenanceIdFieldData: this.buildInputFieldObject(
                'userProvenanceId',
                'User Provenance ID',
                query.userProvenanceId,
                true
            ),
            rolesFieldData: this.buildCheckboxesFieldObject('roles', 'Role', formattedRoles, query.roles),
            provenancesFieldData: this.buildCheckboxesFieldObject(
                'provenances',
                'Provenance',
                formattedProvenances,
                query.provenances
            ),
            categories: this.getCategories(query, queryUrl),
        };
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

    /**
     * Builds the request with the supplied filters to filter the API results.
     */
    private buildRequestParams(query: UserSearchCriteria): object {
        return {
            params: {
                pageSize: 25,
                pageNumber: query.page - 1,
                email: query.email,
                userProvenanceId: query.userProvenanceId,
                provenances: query.provenances,
                roles: query.roles,
                userId: query.userId,
            },
        };
    }

    /**
     * Formats the returned user data into the correct format for the frontend table.
     */
    private formatPageData(rawData: any) {
        const allUserArray = [];
        if (rawData.length > 0) {
            rawData.forEach(user => {
                const userArray = [];
                userArray.push({ text: user.email });
                userArray.push({ text: formattedRoles[user.roles] });
                userArray.push({ text: formattedProvenances[user.userProvenance] });
                userArray.push({
                    html: `<a class="govuk-link" id="manage-link" href="manage-user?id=${user.userId}">Manage</a>`,
                });
                allUserArray.push(userArray);
            });
        }
        return allUserArray;
    }

    /**
     * Formats the object required for the pagination component in the frontend.
     */
    private formatPaginationData(
        currentPage: number,
        finalPage: number,
        first: boolean,
        last: boolean,
        queryUrl: string
    ) {
        const queryParams = new URLSearchParams(queryUrl);
        const paginationObject = {
            previous: null,
            next: null,
        };
        if (!first) {
            queryParams.set('page', String(currentPage));
            paginationObject.previous = {
                labelText: currentPage + ' of ' + finalPage,
                href: '?' + queryParams.toString(),
            };
        }

        if (!last) {
            queryParams.set('page', String(currentPage + 2));
            paginationObject.next = {
                labelText: currentPage + 2 + ' of ' + finalPage,
                href: '?' + queryParams.toString(),
            };
        }
        return paginationObject;
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

        const itemsArray = [];
        // KV pair of the value used in the api and a formatted value for the UI.
        for (const [apiValue, formattedValue] of Object.entries(constItems)) {
            itemsArray.push({
                value: apiValue,
                text: formattedValue,
                checked: itemValues.includes(apiValue),
            });
        }
        checkboxesFieldObject['items'] = itemsArray;
        return checkboxesFieldObject;
    }

    /**
     * Builds the category array with category objects.
     */
    private getCategories(query: UserSearchCriteria, queryUrl: string) {
        const categoriesArray = [];

        categoriesArray.push(this.buildCategoryObject('Email', query.email, queryUrl, 'email=', false));
        categoriesArray.push(this.buildCategoryObject('User ID', query.userId, queryUrl, 'userId=', false));
        categoriesArray.push(
            this.buildCategoryObject('User Provenance ID', query.userProvenanceId, queryUrl, 'userProvenanceId=', false)
        );
        categoriesArray.push(this.buildCategoryObject('Role', query.roles, queryUrl, 'roles=', true, formattedRoles));
        categoriesArray.push(
            this.buildCategoryObject(
                'Provenance',
                query.provenances,
                queryUrl,
                'provenances=',
                true,
                formattedProvenances
            )
        );

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
        checkboxes: boolean,
        constValue: any = ''
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
                        text: constValue[item],
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
                case 'userProvenanceId':
                    delete body.userProvenanceId;
                    break;
                case 'roles':
                    body.roles = body.roles.split(',').filter(f => f !== clearBody[1]);
                    break;
                case 'provenances':
                    body.provenances = body.provenances.split(',').filter(f => f !== clearBody[1]);
                    break;
            }
            delete body.clear;
            delete body.page;
        }
        return body;
    }

    /**
     * Build the summary list for the manage user screen.
     */
    public buildManageUserSummaryList(rawData: any): object {
        const rows = [];
        rows.push(this.buildRowItem('User ID', rawData.userId));
        rows.push(this.buildRowItem('Email', rawData.email));
        rows.push(this.buildRowItem('Role', formattedRoles[rawData.roles], '/update-user?id=' + rawData.userId));
        rows.push(this.buildRowItem('Provenance', formattedProvenances[rawData.userProvenance]));
        rows.push(this.buildRowItem('Provenance ID', rawData.provenanceUserId));
        rows.push(this.buildRowItem('Creation Date', this.formatDate(rawData.createdDate)));

        if (rawData.roles != 'VERIFIED') {
            rows.push(this.buildRowItem('Last Sign In', this.formatDate(rawData.lastSignedInDate)));
        } else {
            rows.push(this.buildRowItem('Last Verified', this.formatDate(rawData.lastVerifiedDate)));
        }

        return { rows };
    }

    /**
     * Build the row item for the manage user summary list.
     */
    private buildRowItem(headingText: string, rowValue: string, actions: any = false) {
        const rowObject = {
            key: {
                text: headingText,
            },
            value: {
                text: rowValue,
            },
        };

        if (actions && rowValue != 'Media') {
            const items = [];
            items.push({
                href: actions,
                text: 'Change',
            });
            rowObject['actions'] = { items };
        }
        return rowObject;
    }

    /**
     * Format and return the date with the correct format.
     */
    private formatDate(rawDate: any) {
        return DateTime.fromISO(rawDate, { zone: 'europe/london' }).toFormat('dd/MM/yyyy HH:mm:ss');
    }

    /**
     * Builds the user update role select box.
     */
    public buildUserUpdateSelectBox(currentRole: string) {
        const items = [];

        for (const [apiValue, formattedValue] of Object.entries(formattedRoles)) {
            if (apiValue !== 'VERIFIED' && apiValue !== 'SYSTEM_ADMIN') {
                items.push({
                    value: apiValue,
                    text: formattedValue,
                    selected: currentRole.includes(apiValue),
                });
            }
        }

        return items;
    }

    /**
     * Process a users action to be sent and stored.
     */
    public async auditAction(user: any, action: string, details: string): Promise<void> {
        await accountManagementRequests.storeAuditAction({
            userId: user.userId,
            userEmail: user.email,
            roles: user.roles,
            userProvenance: user.userProvenance,
            action: action,
            details: details,
        });
    }
}
