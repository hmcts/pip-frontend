import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import AuditLogViewerController from '../../../main/controllers/AuditLogViewerController';
import { AuditLogService } from '../../../main/service/auditLogService';

const auditLogViewerController = new AuditLogViewerController();

const i18n = {
    'audit-log-viewer': {},
};

sinon.stub(AuditLogService.prototype, 'getFormattedAuditData').returns({
    auditLogData: 'test',
    paginationData: 'test2',
});

sinon.stub(AuditLogService.prototype, 'getTableHeaders').returns('testHeader');

describe('Audit log viewer controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/audit-log-viewer';

    it('should render the audit log viewer page', async () => {
        request.query = { page: '1' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['audit-log-viewer'],
            header: 'testHeader',
            auditLogData: 'test',
            paginationData: 'test2',
        };

        responseMock.expects('render').once().withArgs('audit-log-viewer', expectedData);

        await auditLogViewerController.get(request, response);
        return responseMock.verify();
    });
});
