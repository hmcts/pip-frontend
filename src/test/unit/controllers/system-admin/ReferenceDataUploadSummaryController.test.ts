import { cloneDeep } from 'lodash';
import { mockRequest } from '../../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import { ManualUploadService } from '../../../../main/service/ManualUploadService';
import { FileHandlingService } from '../../../../main/service/FileHandlingService';
import ReferenceDataUploadSummaryController from '../../../../main/controllers/system-admin/ReferenceDataUploadSummaryController';

const mockData = { fileName: 'fileName', foo: 'blah', file: '' };
const mockData2 = { fileName: 'fileName2', foo: 'blah', file: '' };

const referenceDataUploadSummaryController = new ReferenceDataUploadSummaryController();
const uploadStub = sinon.stub(ManualUploadService.prototype, 'uploadLocationDataPublication');

const readFileStub = sinon.stub(FileHandlingService.prototype, 'readFileFromRedis');
readFileStub.resolves('');

const removeFileStub = sinon.stub(FileHandlingService.prototype, 'removeFileFromRedis').resolves('');
removeFileStub.resolves('');

uploadStub.withArgs({ ...mockData, file: '', userId: '1' }).resolves(false);

describe('Reference manual manual upload summary controller', () => {
    const i18n = {
        'reference-data-upload-summary': {},
    };
    const request = mockRequest(i18n);
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    request['cookies'] = { formCookie: JSON.stringify(mockData) };

    describe('GET view', () => {
        it('should render reference data upload summary page', async () => {
            request.user = { id: '1' };
            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['reference-data-upload-summary']),
                fileUploadData: mockData,
                displayError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('system-admin/reference-data-upload-summary', options);

            await referenceDataUploadSummaryController.get(request, response);
            responseMock.verify();
        });

        it('should render reference data upload summary page with error query param', async () => {
            request.query = { error: 'true' };
            request.user = { id: '1' };
            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['reference-data-upload-summary']),
                fileUploadData: mockData,
                displayError: true,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('system-admin/reference-data-upload-summary', options);

            await referenceDataUploadSummaryController.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST view', () => {
        it('should render reference data upload summary page with error', async () => {
            request.user = { emails: ['1'], oid: '1234' };
            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['reference-data-upload-summary']),
                fileUploadData: mockData,
                displayError: true,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('system-admin/reference-data-upload-summary', options);

            await referenceDataUploadSummaryController.post(request, response);
            responseMock.verify();
        });

        it('should render reference data upload summary page with query params', async () => {
            request.query = { check: 'true' };
            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['reference-data-upload-summary']),
                fileUploadData: mockData,
                displayError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('system-admin/reference-data-upload-summary', options);

            await referenceDataUploadSummaryController.post(request, response);
            responseMock.verify();
        });

        it('should redirect to success page', async () => {
            const req = mockRequest(i18n);
            const res = {
                render: () => {
                    return '';
                },
                redirect: () => '',
                clearCookie: () => {
                    return '';
                },
            } as unknown as Response;
            req['cookies'] = { formCookie: JSON.stringify(mockData) };
            uploadStub.withArgs({ ...mockData, file: '' }).resolves(true);

            const responseMock = sinon.mock(res);
            responseMock.expects('redirect').once().withArgs('reference-data-upload-confirmation');

            await referenceDataUploadSummaryController.post(req, res);
            responseMock.verify();
        });

        it('should render reference data upload summary page with error message', async () => {
            const request = mockRequest(i18n);
            const response = {
                render: () => {
                    return '';
                },
                redirect: () => '',
                clearCookie: () => {
                    return '';
                },
            } as unknown as Response;

            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['reference-data-upload-summary']),
                fileUploadData: mockData2,
                errorMessage: 'Failed to upload locations.',
                displayError: true,
            };

            request['cookies'] = { formCookie: JSON.stringify(mockData2) };
            uploadStub.withArgs({ ...mockData2, file: '' }).resolves('Failed to upload locations.');

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('system-admin/reference-data-upload-summary', options);

            await referenceDataUploadSummaryController.post(request, response);
            responseMock.verify();
        });
    });
});
