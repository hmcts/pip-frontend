import { mockRequest } from '../../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import { AuditLogService } from '../../../../main/service/AuditLogService';
import AuditLogViewerController from '../../../../main/controllers/system-admin/AuditLogViewerController';
import { AuditLogSearchCriteria } from '../../../../main/models/AuditLogSearchCriteria';

const auditLogViewerController = new AuditLogViewerController();

const i18n = {
    'audit-log-viewer': {},
};

const userId = '1234';
const email = 'TestAdminEmail';
const testPage = '2';
const testEmail = 'TestEmail';
const testUserId = 'TestUserId';
const testActions = 'TestActions';
const testFilterDate = 'TestFilterDate';
const testPath = '';

const formattedDataStub = sinon.stub(AuditLogService.prototype, 'getFormattedAuditData');

formattedDataStub
    .withArgs(new AuditLogSearchCriteria(testPage, testEmail, testUserId, testActions, testFilterDate), testPath, {
        userId: userId,
        email: email,
    })
    .returns({
        auditLogData: 'otherData',
        paginationData: 'test2',
        emailFieldData: 'test3',
        userIdFieldData: 'test4',
        actionsFieldData: 'test5',
        filterDateFieldData: 'test6',
        categories: 'test7',
    });

formattedDataStub.returns({
    auditLogData: 'test',
    paginationData: 'test2',
    emailFieldData: 'test3',
    userIdFieldData: 'test4',
    actionsFieldData: 'test5',
    filterDateFieldData: 'test6',
    categories: 'test7',
});

sinon.stub(AuditLogService.prototype, 'getTableHeaders').returns('testHeader');
sinon.stub(AuditLogService.prototype, 'generateFilterKeyValues').returns('ThisIsAFilter=Filter');
sinon.stub(AuditLogService.prototype, 'validateDate').returns('testDate');

describe('Audit log view controller', () => {
    const response = {
        render: () => {
            return '';
        },
        redirect: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/audit-log-viewer';

    it('should render the audit log viewer page', async () => {
        request.url = '/audit-log-viewer';

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['audit-log-viewer'],
            header: 'testHeader',
            auditLogData: 'test',
            paginationData: 'test2',
            emailFieldData: 'test3',
            userIdFieldData: 'test4',
            actionsFieldData: 'test5',
            filterDateFieldData: 'test6',
            categories: 'test7',
            displayError: false,
        };

        responseMock.expects('render').once().withArgs('system-admin/audit-log-viewer', expectedData);

        await auditLogViewerController.get(request, response);
        return responseMock.verify();
    });

    it('should render the audit log viewer page when query is provided', async () => {
        request.query = {
            clear: undefined,
            page: testPage,
            email: testEmail,
            userId: testUserId,
            actions: testActions,
            filterDate: testFilterDate,
        };
        request.url = '/audit-log-viewer';
        request.user = { userId: userId, email: email };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['audit-log-viewer'],
            header: 'testHeader',
            auditLogData: 'test',
            paginationData: 'test2',
            emailFieldData: 'test3',
            userIdFieldData: 'test4',
            actionsFieldData: 'test5',
            filterDateFieldData: 'test6',
            categories: 'test7',
            displayError: false,
        };

        responseMock.expects('render').once().withArgs('system-admin/audit-log-viewer', expectedData);

        await auditLogViewerController.get(request, response);
        return responseMock.verify();
    });

    it('should redirect to the audit log viewer page on clear', async () => {
        const mockFilter = 'ThisIsAFilter=Filter';

        sinon.stub(AuditLogService.prototype, 'handleFilterClearing').returns('success');

        request.query = { clear: 'all' };
        request.url = '/audit-log-viewer';

        const responseMock = sinon.mock(response);
        responseMock
            .expects('redirect')
            .once()
            .withArgs('audit-log-viewer?' + mockFilter);

        await auditLogViewerController.get(request, response);
        return responseMock.verify();
    });

    it('should redirect to the audit log viewer page on post', async () => {
        const mockFilter = 'ThisIsAFilter=Filter';

        request.url = '/audit-log-viewer';
        request.body = 'FilterValues';

        const responseMock = sinon.mock(response);
        responseMock
            .expects('redirect')
            .once()
            .withArgs('audit-log-viewer?' + mockFilter);

        await auditLogViewerController.post(request, response);
        return responseMock.verify();
    });
});
