import { expect } from 'chai';
import sinon from 'sinon';
import { AuditLogService } from '../../../main/service/AuditLogService';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';
import { AuditLogSearchCriteria } from '../../../main/models/AuditLogSearchCriteria';

const auditLogService = new AuditLogService();

const testReqBody = {
    email: 'test',
    userId: '',
    actions: ['USER_MANAGEMENT_VIEW'],
    filterDate: '2024-10-21',
};

const testApiResponseData = {
    content: [
        {
            id: '158f4249-a763-4a4a-866c-8e0dd5b3bdaf',
            userEmail: 'test1@email.com',
            action: 'USER_MANAGEMENT_VIEW',
            timestamp: '2022-01-31T14:23:35.056402',
        },
        {
            id: '309b7fbe-65be-45d3-8aee-5e3b59f2da6g',
            userEmail: 'test2@email.com',
            action: 'REFERENCE_DATA_UPLOAD',
            timestamp: '2022-10-13T12:47:05.866678',
        },
        {
            id: '240cd401-5829-4383-95e9-912feb0a3cf0',
            userEmail: 'test3@email.com',
            action: 'VIEW_THIRD_PARTY_USERS',
            timestamp: '2022-10-13T12:47:05.866678',
        },
        {
            id: '66a37f65-9813-49d9-be88-301f0b7b6840',
            userEmail: 'test4@email.com',
            action: 'USER_MANAGEMENT_VIEW',
            timestamp: '2022-02-15T09:47:42.784288',
        },
        {
            id: '4dd14e00-0531-43e2-a443-7f25a85fcdd6',
            userEmail: 'test5@email.com',
            action: 'USER_MANAGEMENT_VIEW',
            timestamp: '2022-09-03T09:27:25.289474',
        },
    ],
    pageable: {
        sort: { empty: true, unsorted: true, sorted: false },
        offset: 5,
        pageNumber: 1,
        pageSize: 5,
        unpaged: false,
        paged: true,
    },
    last: false,
    totalPages: 10,
    totalElements: 50,
    first: false,
    number: 1,
    size: 5,
    sort: { empty: true, unsorted: true, sorted: false },
    numberOfElements: 5,
    empty: false,
};

sinon.stub(AccountManagementRequests.prototype, 'getAllAuditLogs').resolves(testApiResponseData);

describe('Audit Log Service', () => {
    it('should return the correct table headers', () => {
        const response = auditLogService.getTableHeaders();

        expect(response[0].text).to.equal('Timestamp');
        expect(response[0].classes).to.equal('govuk-!-padding-top-0');
        expect(response[1].text).to.equal('Email');
        expect(response[1].classes).to.equal('govuk-!-padding-top-0');
        expect(response[2].text).to.equal('Action');
        expect(response[2].classes).to.equal('govuk-!-padding-top-0');
        expect(response[3].text).to.equal('');
        expect(response[3].classes).to.equal('govuk-!-padding-top-0');
    });

    it('should generate the filter key values', () => {
        // Have to parse JSON in this way to fully replicate req.body
        const response = auditLogService.generateFilterKeyValues(JSON.parse(JSON.stringify(testReqBody)));

        expect(response).to.contain('email=test');
        expect(response).to.contain('&actions=USER_MANAGEMENT_VIEW');
        expect(response).to.contain('&filterDate=2024-10-21');
    });

    it('should handle filter clearing of audit action', () => {
        const testClear = {
            actions: 'USER_MANAGEMENT_VIEW,REFERENCE_DATA_UPLOAD',
            clear: 'actions=View User Management',
        };

        const testClearResponse = {
            actions: ['REFERENCE_DATA_UPLOAD'],
        };

        const response = auditLogService.handleFilterClearing(testClear);
        expect(response).to.eql(testClearResponse);
    });

    it('should handle filter clearing of email', () => {
        const testClear = {
            email: 'test@email.com',
            clear: 'email=test@email.com',
        };
        const testClearResponse = {};

        const response = auditLogService.handleFilterClearing(testClear);
        expect(response).to.eql(testClearResponse);
    });

    it('should handle filter clearing of user id', () => {
        const testClear = {
            userId: '1234',
            clear: 'userId=1234',
        };
        const testClearResponse = {};

        const response = auditLogService.handleFilterClearing(testClear);
        expect(response).to.eql(testClearResponse);
    });

    it('should handle filter clearing of filter date', () => {
        const testClear = {
            clear: 'filterDate=2024-10-21',
        };
        const testClearResponse = {};

        const response = auditLogService.handleFilterClearing(testClear);
        expect(response).to.eql(testClearResponse);
    });

    it('should handle filter clearing all', () => {
        const response = auditLogService.handleFilterClearing({
            clear: 'all',
        });
        expect(response).to.be.empty;
    });

    it('should return formatted data from the getFormattedAuditData function', async () => {
        const auditSearchCriteria = new AuditLogSearchCriteria(1, 'test', '', '', '');

        const response = await auditLogService.getFormattedAuditData(auditSearchCriteria, '?page=2', '1234');

        // Pagination data
        expect(response['paginationData']['previous'].labelText).to.equal('1 of 10');
        expect(response['paginationData']['previous'].href).to.equal('?page=1');
        expect(response['paginationData']['next'].labelText).to.equal('3 of 10');
        expect(response['paginationData']['next'].href).to.equal('?page=3');

        // Audit data
        expect(response['auditLogData'][0]['id']).to.equal('158f4249-a763-4a4a-866c-8e0dd5b3bdaf');
        expect(response['auditLogData'][0]['email']).to.equal('test1@email.com');
        expect(response['auditLogData'][0]['action'].name).to.equal('View User Management');
        expect(response['auditLogData'][0]['timestamp']).to.equal('31/01/2022 14:23:35');

        // Check field data exists
        expect(response['emailFieldData']).to.exist;
        expect(response['userIdFieldData']).to.exist;
        expect(response['actionsFieldData']).to.exist;
        expect(response['filterDateFieldData']).to.exist;
        expect(response['categories']).to.exist;
    });

    it('should validate filter date', () => {
        const testDate = {
            'filterDate-day': '01',
            'filterDate-month': '01',
            'filterDate-year': '2021',
        };

        const response = auditLogService.validateDate(testDate, 'filterDate');
        expect(response).to.eql('2021-01-01');
    });

    it('should return null if date is invalid', () => {
        const testDate = {
            'filterDate-day': '01',
            'filterDate-month': '',
            'filterDate-year': '2021',
        };

        const response = auditLogService.validateDate(testDate, 'filterDate');
        expect(response).is.null;
    });

    it('should return empty if nothing is provided', () => {
        const testDate = {};

        const response = auditLogService.validateDate(testDate, 'filterDate');
        expect(response).is.empty;
    });
});
