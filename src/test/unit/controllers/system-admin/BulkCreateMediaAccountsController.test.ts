import BulkCreateMediaAccountsController from '../../../../main/controllers/system-admin/BulkCreateMediaAccountsController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import { FileHandlingService } from '../../../../main/service/FileHandlingService';
import { CreateAccountService } from '../../../../main/service/CreateAccountService';

const bulkCreateMediaAccountsController = new BulkCreateMediaAccountsController();
const i18n = {
    'bulk-create-media-accounts': {},
};

const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
    cookie: () => {
        return '';
    },
} as unknown as Response;

const fileName = 'fileName';
const file = 'file';
const error = 'error';
const request = mockRequest(i18n);

sinon.stub(FileHandlingService.prototype, 'sanitiseFileName').returns(fileName);
sinon.stub(FileHandlingService.prototype, 'storeFileIntoRedis').resolves({});
sinon.stub(FileHandlingService.prototype, 'readFile').returns(file);

const validateFileUploadStub = sinon.stub(FileHandlingService.prototype, 'validateFileUpload');
const validateFileContentStub = sinon.stub(CreateAccountService.prototype, 'validateCsvFileContent');

describe('Bulk Create Media Accounts Controller', () => {
    describe('GET request', () => {
        it('should render the bulk create media accounts page', () => {
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['bulk-create-media-accounts'],
                displayError: false,
            };
            responseMock.expects('render').once().withArgs('system-admin/bulk-create-media-accounts', expectedData);

            bulkCreateMediaAccountsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('POST request', () => {
        it('should redirect to bulk create media accounts confirmation page if no validation error', () => {
            const responseMock = sinon.mock(response);

            validateFileUploadStub.returns(null);
            validateFileContentStub.returns(null);

            responseMock.expects('redirect').once().withArgs('bulk-create-media-accounts-confirmation');

            bulkCreateMediaAccountsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the bulk create media accounts page with file upload error', () => {
            const responseMock = sinon.mock(response);

            validateFileUploadStub.returns(error);
            validateFileContentStub.returns(null);

            const expectedData = {
                ...i18n['bulk-create-media-accounts'],
                displayError: true,
                error,
            };
            responseMock.expects('render').once().withArgs('system-admin/bulk-create-media-accounts', expectedData);

            bulkCreateMediaAccountsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the bulk create media accounts page with CSV file content error', () => {
            const responseMock = sinon.mock(response);

            validateFileUploadStub.returns(null);
            validateFileContentStub.returns(error);

            const expectedData = {
                ...i18n['bulk-create-media-accounts'],
                displayError: true,
                error,
            };
            responseMock.expects('render').once().withArgs('system-admin/bulk-create-media-accounts', expectedData);

            bulkCreateMediaAccountsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
