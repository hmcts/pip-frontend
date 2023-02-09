import BulkCreateMediaAccountsConfirmationController from '../../../main/controllers/BulkCreateMediaAccountsConfirmationController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { FileHandlingService } from '../../../main/service/fileHandlingService';
import { CreateAccountService } from '../../../main/service/createAccountService';
import { UserManagementService } from '../../../main/service/userManagementService';

const bulkCreateMediaAccountsConfirmationController = new BulkCreateMediaAccountsConfirmationController();
const bulkCreateAccountsConfirmationUrl = 'bulk-create-media-accounts-confirmation';
const bulkCreateAccountsConfirmedUrl = 'bulk-create-media-accounts-confirmed';
const bulkCreateAccountsUrl = 'bulk-create-media-accounts';

const i18n = { bulkCreateAccountsConfirmationUrl: {} };

const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
} as unknown as Response;

const fileName = 'fileName';
const mockAccounts = [
    ['test1@test.com', 'firstName1', 'surname1'],
    ['test2@test.com', 'firstName2', 'surname2'],
];
const mockAccountsWithHeader = [['email', 'firstName', 'surname'], ...mockAccounts];

const file = 'file';
sinon.stub(FileHandlingService.prototype, 'readFileFromRedis').resolves(file);
sinon.stub(FileHandlingService.prototype, 'readCsvToArray').returns(mockAccountsWithHeader);
sinon.stub(UserManagementService.prototype, 'auditAction').returns(true);

const createAccountsStub = sinon.stub(CreateAccountService.prototype, 'bulkCreateMediaAccounts');
createAccountsStub.withArgs(file, fileName, '1').resolves(true);
createAccountsStub.withArgs(file, fileName, '2').resolves(false);

describe('Bulk Create Media Accounts Confirmation Controller', () => {
    describe('GET request', () => {
        const request = mockRequest(i18n);
        const mockData = { fileName: fileName, uploadFileName: fileName, file: '' };
        request.cookies = { formCookie: JSON.stringify(mockData) };

        it('should render bulk create media accounts confirmation page', () => {
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n[bulkCreateAccountsConfirmationUrl],
                accountsToCreate: mockAccounts,
            };
            responseMock.expects('render').once().withArgs(bulkCreateAccountsConfirmationUrl, expectedData);

            bulkCreateMediaAccountsConfirmationController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if filename not defined', () => {
            request.cookies = { formCookie: JSON.stringify({}) };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            bulkCreateMediaAccountsConfirmationController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('POST request', () => {
        const request = mockRequest(i18n);
        const mockData = { fileName: fileName, uploadFileName: fileName, file: '' };
        request.cookies = { formCookie: JSON.stringify(mockData) };

        it('should render bulk create media accounts confirmation page with error if no option selected', () => {
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n[bulkCreateAccountsConfirmationUrl],
                accountsToCreate: mockAccounts,
                displayNoOptionError: true,
            };
            responseMock.expects('render').once().withArgs(bulkCreateAccountsConfirmationUrl, expectedData);

            bulkCreateMediaAccountsConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should redirect to bulk create media accounts confirmed page if 'Yes' is selected and success when creating accounts", () => {
            const responseMock = sinon.mock(response);

            request.body = { confirmed: 'Yes' };
            request.user = { userId: '1' };
            responseMock.expects('redirect').once().withArgs(bulkCreateAccountsConfirmedUrl);

            bulkCreateMediaAccountsConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should render bulk create media accounts confirmation page with error if 'Yes' is selected but error when creating accounts", () => {
            const responseMock = sinon.mock(response);

            request.body = { confirmed: 'Yes' };
            request.user = { userId: '2' };

            const expectedData = {
                ...i18n[bulkCreateAccountsConfirmationUrl],
                accountsToCreate: mockAccounts,
                displayAccountCreationError: true,
            };
            responseMock.expects('render').once().withArgs(bulkCreateAccountsConfirmationUrl, expectedData);

            bulkCreateMediaAccountsConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should redirect to bulk create media accounts page with if 'No' is selected", () => {
            const responseMock = sinon.mock(response);

            request.body = { confirmed: 'No' };
            responseMock.expects('redirect').once().withArgs(bulkCreateAccountsUrl);

            bulkCreateMediaAccountsConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if filename not defined', () => {
            request.cookies = { formCookie: JSON.stringify({}) };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            bulkCreateMediaAccountsConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
