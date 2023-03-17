import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { AuditLogService } from '../../../main/service/auditLogService';
import sinon from 'sinon';
import AuditLogDetailsController from '../../../main/controllers/AuditLogDetailsController';

const auditLogDetailsController = new AuditLogDetailsController();

const i18n = {
    'audit-log-details': {},
};

const response = {
    render: () => {
        return '';
    },
} as unknown as Response;

const testData = { row: 'test' };

sinon.stub(AuditLogService.prototype, 'buildAuditLogDetailsSummaryList').returns(testData);

describe('Audit log details controller', () => {
    const request = mockRequest(i18n);
    request.path = '/audit-log-details';

    it('should render the audit log details page', async () => {
        request.query = { id: '123', timestamp: '31/01/2023 10:00:00' };
        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['audit-log-details'],
            timestamp: request.query.timestamp,
            formattedData: testData,
        };

        responseMock.expects('render').once().withArgs('audit-log-details', expectedData);

        await auditLogDetailsController.get(request, response);
        return responseMock.verify();
    });
});
