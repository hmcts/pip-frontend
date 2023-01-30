import {expect} from 'chai';
import {AuditLogService} from '../../../main/service/auditLogService';
import {AccountManagementRequests} from '../../../main/resources/requests/accountManagementRequests';
import sinon from 'sinon';

const auditLogService = new AuditLogService();

const testApiResponseData = {
  content: [
    {
      timestamp: '2023-01-2609:33:34.560132',
      userId: '158f4249-a763-4a4a-866c-8e0dd5b3bdaf',
      userEmail: 'test@justice.gov.uk',
      action: 'USER_MANAGEMENT',
      details: 'details test text here',
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

describe('Audit log service', () => {
  it('should return the correct table headers', () => {
    const response = auditLogService.getTableHeaders();

    expect(response[0].text).to.equal('Timestamp');
    expect(response[0].classes).to.equal('govuk-!-padding-top-0');
    expect(response[1].text).to.equal('Email/User ID');
    expect(response[1].classes).to.equal('govuk-!-padding-top-0');
    expect(response[2].text).to.equal('Action');
    expect(response[2].classes).to.equal('govuk-!-padding-top-0');
    expect(response[3].text).to.equal('Details');
    expect(response[3].classes).to.equal('govuk-!-padding-top-0');
  });

  it('should return formatted data from the getFormattedAuditData function', async () => {
    const response = await auditLogService.getFormattedAuditData(1, '1234');

    // Pagination data
    expect(response['paginationData']['previous'].labelText).to.equal('1 of 10');
    expect(response['paginationData']['previous'].href).to.equal('?page=1');
    expect(response['paginationData']['next'].labelText).to.equal('3 of 10');
    expect(response['paginationData']['next'].href).to.equal('?page=3');

    // Audit log formatted table data

    expect(response['auditLogData'][0][1].text).to.contain('test@justice.gov.uk');
    expect(response['auditLogData'][0][1].text).to.contain('158f4249-a763-4a4a-866c-8e0dd5b3bdaf');
    expect(response['auditLogData'][0][2].text).to.equal('USER_MANAGEMENT');
    expect(response['auditLogData'][0][3].text).to.equal('details test text here');
  });
});
