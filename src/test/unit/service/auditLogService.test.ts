import { expect } from 'chai';
import { AuditLogService } from '../../../main/service/auditLogService';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import sinon from 'sinon';

const auditLogService = new AuditLogService();

const testAuditLogId = '5c2c7849-f30f-40e1-b61b-8aea393fd9fe';
const testUserId = '158f4249-a763-4a4a-866c-8e0dd5b3bdaf';
const testUserEmail = 'test@justice.gov.uk';

const testAuditLogContent = {
    id: testAuditLogId,
    timestamp: '2023-01-26T09:33:34.560132',
    userId: testUserId,
    userEmail: testUserEmail,
    roles: 'INTERNAL_SUPER_ADMIN_CTSC',
    userProvenance: 'PI_AAD',
    action: 'USER_MANAGEMENT',
    details: 'details test text here',
};

const testApiResponseData = {
    content: [testAuditLogContent],
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
sinon.stub(AccountManagementRequests.prototype, 'getAuditLogById').resolves(testAuditLogContent);

describe('Audit log service', () => {
    it('should return the correct table headers', () => {
        const response = auditLogService.getTableHeaders();

        expect(response[0].text).to.equal('Timestamp');
        expect(response[0].classes).to.equal('govuk-!-padding-top-0');
        expect(response[1].text).to.equal('Email');
        expect(response[1].classes).to.equal('govuk-!-padding-top-0');
        expect(response[2].text).to.equal('Action');
        expect(response[2].classes).to.equal('govuk-!-padding-top-0');
        expect(response[3].text).to.be.empty;
    });

    it('should return formatted data from the getFormattedAuditData function', async () => {
        const response = await auditLogService.getFormattedAuditData(1, '1234');

        // Pagination data
        expect(response['paginationData']['previous'].labelText).to.equal('1 of 10');
        expect(response['paginationData']['previous'].href).to.equal('?page=1');
        expect(response['paginationData']['next'].labelText).to.equal('3 of 10');
        expect(response['paginationData']['next'].href).to.equal('?page=3');

        // Audit log formatted table data
        const auditLogData = response['auditLogData'][0];
        expect(auditLogData.id).to.equal('5c2c7849-f30f-40e1-b61b-8aea393fd9fe');
        expect(auditLogData.email).to.equal(testUserEmail);
        expect(auditLogData.action).to.equal('USER_MANAGEMENT');
        expect(auditLogData.timestamp).to.equal('26/01/2023 09:33:34');
    });

    it('should build audit log details summary list', async () => {
        const response = await auditLogService.buildAuditLogDetailsSummaryList(testAuditLogId);
        const rows = response['rows'];

        expect(rows[0].key.text).to.equal('User ID');
        expect(rows[0].value.text).to.equal(testUserId);
        expect(rows[1].key.text).to.equal('Email');
        expect(rows[1].value.text).to.equal(testUserEmail);
        expect(rows[2].key.text).to.equal('Role');
        expect(rows[2].value.text).to.equal('CTSC Super Admin');
        expect(rows[3].key.text).to.equal('Provenance');
        expect(rows[3].value.text).to.equal('B2C');
        expect(rows[4].key.text).to.equal('Action');
        expect(rows[4].value.text).to.equal('USER_MANAGEMENT');
        expect(rows[5].key.text).to.equal('Details');
        expect(rows[5].value.text).to.equal('details test text here');
    });
});
