import sinon from 'sinon';
import { cloneDeep } from 'lodash';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import EditListTypeSearchConfigController from '../../../../main/controllers/system-admin/EditListTypeSearchConfigController';
import { PublicationService } from '../../../../main/service/PublicationService';

const editListTypeSearchConfigController = new EditListTypeSearchConfigController();

const i18n = {
    'edit-list-type-search-config': {
        header: 'Configure list type search fields for',
        error: { title: 'There is a problem', emptyConfigMessage: 'Enter at least one field name before continue' },
    },
    error: {},
};

const listTypeWithConfig = 'SJP_PUBLIC_LIST';
const listTypeWithoutConfig = 'CIVIL_DAILY_CAUSE_LIST';
const existingFormData = { caseNumberFieldName: 'caseNumber', caseNameFieldName: 'caseName' };

sinon.stub(PublicationService.prototype, 'getListTypes').returns(
    new Map([
        [listTypeWithConfig, { friendlyName: 'SJP Public List', isHidden: false }],
        [listTypeWithoutConfig, { friendlyName: 'Civil Daily Cause List', isHidden: false }],
    ]) as any
);

const getListSearchConfigStub = sinon.stub(PublicationService.prototype, 'getListSearchConfigByListType');
getListSearchConfigStub.withArgs(listTypeWithConfig, '1').resolves(existingFormData);
getListSearchConfigStub.withArgs(listTypeWithoutConfig, '1').resolves(null);

const createResponse = () =>
    ({
        render: () => '',
        redirect: () => '',
        cookie: () => '',
    }) as unknown as Response;

describe('Edit List Type Search Config Controller', () => {
    describe('GET request', () => {
        it('should render edit page with existing config when config exists for list type', async () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request.user = { userId: '1' };
            request['query'] = { listType: listTypeWithConfig };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('system-admin/edit-list-type-search-config', {
                ...cloneDeep(i18n['edit-list-type-search-config']),
                listType: listTypeWithConfig,
                listTypeName: 'SJP Public List',
                formData: existingFormData,
                emptyConfigError: false,
            });

            await editListTypeSearchConfigController.get(request, response);
            responseMock.verify();
        });

        it('should render edit page with createConfig flag when no existing config for list type', async () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request.user = { userId: '1' };
            request['query'] = { listType: listTypeWithoutConfig };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('system-admin/edit-list-type-search-config', {
                ...cloneDeep(i18n['edit-list-type-search-config']),
                listType: listTypeWithoutConfig,
                listTypeName: 'Civil Daily Cause List',
                formData: { createConfig: 'true' },
                emptyConfigError: false,
            });

            await editListTypeSearchConfigController.get(request, response);
            responseMock.verify();
        });

        it('should render edit page with cookie data when no existing config and cookie matches list type', async () => {
            const cookieFormData = { listType: listTypeWithoutConfig, caseNumberFieldName: 'modifiedNumber', caseNameFieldName: 'modifiedName' };
            const response = createResponse();
            const request = mockRequest(i18n);
            request.user = { userId: '1' };
            request['query'] = { listType: listTypeWithoutConfig };
            request['cookies'] = { listSearchConfigCookie: JSON.stringify(cookieFormData) };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('system-admin/edit-list-type-search-config', {
                ...cloneDeep(i18n['edit-list-type-search-config']),
                listType: listTypeWithoutConfig,
                listTypeName: 'Civil Daily Cause List',
                formData: cookieFormData,
                emptyConfigError: false,
            });

            await editListTypeSearchConfigController.get(request, response);
            responseMock.verify();
        });

        it('should render edit page with existing config from database and ignore cookie when existing config exists', async () => {
            const cookieFormData = { listType: listTypeWithConfig, caseNumberFieldName: 'modifiedNumber', caseNameFieldName: 'modifiedName' };
            const response = createResponse();
            const request = mockRequest(i18n);
            request.user = { userId: '1' };
            request['query'] = { listType: listTypeWithConfig };
            request['cookies'] = { listSearchConfigCookie: JSON.stringify(cookieFormData) };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('system-admin/edit-list-type-search-config', {
                ...cloneDeep(i18n['edit-list-type-search-config']),
                listType: listTypeWithConfig,
                listTypeName: 'SJP Public List',
                formData: existingFormData,
                emptyConfigError: false,
            });

            await editListTypeSearchConfigController.get(request, response);
            responseMock.verify();
        });

        it('should render the error page when no listType is provided', async () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request['query'] = {};
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            await editListTypeSearchConfigController.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should re-render edit page with emptyConfigError when createConfig is true and field names are empty', () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request['query'] = { listType: listTypeWithoutConfig };
            request['body'] = { createConfig: 'true', caseNumberFieldName: '', caseNameFieldName: '' };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('system-admin/edit-list-type-search-config', {
                ...cloneDeep(i18n['edit-list-type-search-config']),
                listType: listTypeWithoutConfig,
                listTypeName: 'Civil Daily Cause List',
                formData: request['body'],
                emptyConfigError: true,
            });

            editListTypeSearchConfigController.post(request, response);
            responseMock.verify();
        });

        it('should set cookie and redirect to summary page when valid form data is submitted', () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request['query'] = { listType: listTypeWithConfig };
            request['body'] = { caseNumberFieldName: 'caseNumber', caseNameFieldName: 'caseName' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('/edit-list-type-search-config-summary');

            editListTypeSearchConfigController.post(request, response);
            responseMock.verify();
        });

        it('should render the error page when no listType is provided', () => {
            const response = createResponse();
            const request = mockRequest(i18n);
            request['query'] = {};
            request['body'] = {};
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            editListTypeSearchConfigController.post(request, response);
            responseMock.verify();
        });
    });
});
