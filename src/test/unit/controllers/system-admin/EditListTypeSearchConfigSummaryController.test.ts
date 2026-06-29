import sinon from 'sinon';
import { cloneDeep } from 'lodash';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import EditListTypeSearchConfigSummaryController from '../../../../main/controllers/system-admin/EditListTypeSearchConfigSummaryController';
import { PublicationService } from '../../../../main/service/PublicationService';
import { UserManagementService } from '../../../../main/service/UserManagementService';

const controller = new EditListTypeSearchConfigSummaryController();

const i18n = {
    'edit-list-type-search-config-summary': {
        title: 'Manage list types - List type search configuration summary',
        header: 'Summary',
        message: 'Check list type search configuration details',
        error: {
            title: 'There is a problem',
            message: 'Failed to create or update list type search configuration',
        },
    },
};

const formDataCreate = {
    listType: 'SJP_PUBLIC_LIST',
    createConfig: 'true',
    caseNumberFieldName: 'caseNumber',
    caseNameFieldName: 'caseName',
};

const formDataUpdate = {
    id: 'config-123',
    listType: 'SJP_PUBLIC_LIST',
    caseNumberFieldName: 'caseNumber',
    caseNameFieldName: 'caseName',
};

const createResponse = () =>
    ({
        render: () => '',
        redirect: () => '',
        clearCookie: () => '',
    }) as unknown as Response;

describe('Edit List Type Search Config Summary Controller', () => {
    let createListSearchConfigStub: sinon.SinonStub;
    let updateListSearchConfigStub: sinon.SinonStub;
    let auditActionStub: sinon.SinonStub;

    beforeEach(() => {
        createListSearchConfigStub = sinon.stub(PublicationService.prototype, 'createListSearchConfig');
        updateListSearchConfigStub = sinon.stub(PublicationService.prototype, 'updateListSearchConfig');
        auditActionStub = sinon.stub(UserManagementService.prototype, 'auditAction');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET request', () => {
        it('should render summary page with form data from cookie', () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request['cookies'] = { listSearchConfigCookie: JSON.stringify(formDataCreate) };
            const responseMock = sinon.mock(response);

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/edit-list-type-search-config-summary', {
                    ...cloneDeep(i18n['edit-list-type-search-config-summary']),
                    formData: formDataCreate,
                    displayError: false,
                });

            controller.get(request, response);
            responseMock.verify();
        });

        it('should render summary page with empty form data when no cookie exists', () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request['cookies'] = {};
            const responseMock = sinon.mock(response);

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/edit-list-type-search-config-summary', {
                    ...cloneDeep(i18n['edit-list-type-search-config-summary']),
                    formData: {},
                    displayError: false,
                });

            controller.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should create config, audit, clear cookie and redirect to success when createConfig is true and create succeeds', async () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request['cookies'] = { listSearchConfigCookie: JSON.stringify(formDataCreate) };
            request.user = { userId: '1' };

            createListSearchConfigStub.withArgs(formDataCreate, '1').resolves(true);
            auditActionStub.resolves();

            const responseMock = sinon.mock(response);
            responseMock.expects('clearCookie').once().withArgs('listSearchConfigCookie');
            responseMock.expects('redirect').once().withArgs('/edit-list-type-search-config-success');

            await controller.post(request, response);

            sinon.assert.calledWith(
                auditActionStub,
                request.user,
                'CREATE_LIST_SEARCH_CONFIG',
                'List search configuration created successfully'
            );
            responseMock.verify();
        });

        it('should update config, audit, clear cookie and redirect to success when update succeeds', async () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request['cookies'] = { listSearchConfigCookie: JSON.stringify(formDataUpdate) };
            request.user = { userId: '1' };

            updateListSearchConfigStub.withArgs(formDataUpdate.id, formDataUpdate, '1').resolves(true);
            auditActionStub.resolves();

            const responseMock = sinon.mock(response);
            responseMock.expects('clearCookie').once().withArgs('listSearchConfigCookie');
            responseMock.expects('redirect').once().withArgs('/edit-list-type-search-config-success');

            await controller.post(request, response);

            sinon.assert.calledWith(
                auditActionStub,
                request.user,
                'UPDATE_LIST_SEARCH_CONFIG',
                'List search configuration updated successfully'
            );
            responseMock.verify();
        });

        it('should render summary with displayError when create fails', async () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request['cookies'] = { listSearchConfigCookie: JSON.stringify(formDataCreate) };
            request.user = { userId: '1' };

            createListSearchConfigStub.resolves(null);

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/edit-list-type-search-config-summary', {
                    ...cloneDeep(i18n['edit-list-type-search-config-summary']),
                    formData: formDataCreate,
                    displayError: true,
                });

            await controller.post(request, response);

            sinon.assert.notCalled(auditActionStub);
            responseMock.verify();
        });

        it('should render summary with displayError when update fails', async () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request['cookies'] = { listSearchConfigCookie: JSON.stringify(formDataUpdate) };
            request.user = { userId: '1' };

            updateListSearchConfigStub.resolves(null);

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/edit-list-type-search-config-summary', {
                    ...cloneDeep(i18n['edit-list-type-search-config-summary']),
                    formData: formDataUpdate,
                    displayError: true,
                });

            await controller.post(request, response);

            sinon.assert.notCalled(auditActionStub);
            responseMock.verify();
        });

        it('should render summary with displayError when no cookie exists', async () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request['cookies'] = {};
            request.user = { userId: '1' };

            updateListSearchConfigStub.resolves(null);

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/edit-list-type-search-config-summary', {
                    ...cloneDeep(i18n['edit-list-type-search-config-summary']),
                    formData: {},
                    displayError: true,
                });

            await controller.post(request, response);
            responseMock.verify();
        });
    });
});
