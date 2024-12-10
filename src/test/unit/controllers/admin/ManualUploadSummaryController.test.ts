import { cloneDeep } from 'lodash';
import { mockRequest } from '../../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import ManualUploadSummaryController from '../../../../main/controllers/admin/ManualUploadSummaryController';
import { ManualUploadService } from '../../../../main/service/ManualUploadService';
import { FileHandlingService } from '../../../../main/service/FileHandlingService';

const mockData = {
    fileName: 'fileName',
    foo: 'blah',
    listType: 'SJP_PUBLIC_LIST',
    listTypeName: 'SJP Public List (Full list)',
    language: 'English',
    languageName: 'English',
    classification: 'PUBLIC',
};
const manualUploadSummaryController = new ManualUploadSummaryController();
const uploadStub = sinon.stub(ManualUploadService.prototype, 'uploadPublication');
sinon.stub(ManualUploadService.prototype, 'formatPublicationDates').returns(mockData);

const readFileStub = sinon.stub(FileHandlingService.prototype, 'readFileFromRedis');
readFileStub.resolves('');

const removeFileStub = sinon.stub(FileHandlingService.prototype, 'removeFileFromRedis').resolves('');
removeFileStub.resolves('');

uploadStub.withArgs({ ...mockData, file: '', userId: '1' }, true).resolves(null);

sinon.stub(ManualUploadService.prototype, 'isSensitivityMismatch').withArgs('SJP_PUBLIC_LIST', 'PUBLIC').returns(true);

describe('Manual upload summary controller', () => {
    const i18n = {
        'manual-upload-summary': {},
    };

    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    describe('GET view', () => {
        const request = mockRequest(i18n);
        request['cookies'] = { formCookie: JSON.stringify(mockData) };
        it('should render manual upload summary page', async () => {
            request.user = { id: '1' };
            const nonStrategicUpload = false;
            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manual-upload-summary']),
                fileUploadData: mockData,
                displayError: false,
                displaySensitivityMismatch: true,
                nonStrategicUpload,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('admin/manual-upload-summary', options);

            await manualUploadSummaryController.get(request, response);
            responseMock.verify();
        });

        it('should render manual upload summary page with error query param', async () => {
            request.query = { error: 'true' };
            request.user = { id: '1' };
            const nonStrategicUpload = false;
            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manual-upload-summary']),
                fileUploadData: mockData,
                displayError: true,
                displaySensitivityMismatch: true,
                nonStrategicUpload,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('admin/manual-upload-summary', options);

            await manualUploadSummaryController.get(request, response);
            responseMock.verify();
        });
    });

    describe('GET view for non-strategic publication', () => {
        const request = mockRequest(i18n);
        request['cookies'] = { formCookie: JSON.stringify(mockData) };

        it('should render manual upload summary page for non-strategic publication', async () => {
            request.user = { id: '1' };
            request.query = { 'non-strategic': 'true' };
            const nonStrategicUpload = true;
            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manual-upload-summary']),
                fileUploadData: mockData,
                displayError: false,
                displaySensitivityMismatch: true,
                nonStrategicUpload,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('admin/manual-upload-summary', options);

            await manualUploadSummaryController.get(request, response);
            responseMock.verify();
        });

        it('should render manual upload summary page with error query param for non-strategic publication', async () => {
            request.query = { error: 'true', 'non-strategic': 'true' };
            request.user = { id: '1' };
            const nonStrategicUpload = true;
            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manual-upload-summary']),
                fileUploadData: mockData,
                displayError: true,
                displaySensitivityMismatch: true,
                nonStrategicUpload,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('admin/manual-upload-summary', options);

            await manualUploadSummaryController.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST view', () => {
        const request = mockRequest(i18n);
        request['cookies'] = { formCookie: JSON.stringify(mockData) };
        it('should render manual upload summary page with error', async () => {
            request.user = { email: '1', userId: '1234' };
            const nonStrategicUpload = false;
            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manual-upload-summary']),
                fileUploadData: mockData,
                displayError: true,
                displaySensitivityMismatch: true,
                nonStrategicUpload,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('admin/manual-upload-summary', options);

            await manualUploadSummaryController.post(request, response);
            responseMock.verify();
            sinon.assert.calledWith(readFileStub, '1234', 'fileName');
            sinon.assert.calledWith(removeFileStub, '1234', 'fileName');
        });

        it('should render manual upload summary page with query params', async () => {
            request.query = { check: 'true' };
            const nonStrategicUpload = false;
            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manual-upload-summary']),
                fileUploadData: mockData,
                displayError: false,
                displaySensitivityMismatch: true,
                nonStrategicUpload,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('admin/manual-upload-summary', options);

            await manualUploadSummaryController.post(request, response);
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
            req.user = { email: '2' };
            req['cookies'] = { formCookie: JSON.stringify(mockData) };
            const responseMock = sinon.mock(res);

            uploadStub.withArgs({ ...mockData, file: '', userEmail: '2' }, true).resolves('1234');

            responseMock.expects('redirect').once().withArgs('manual-upload-confirmation');

            await manualUploadSummaryController.post(req, res);
            responseMock.verify();
            sinon.assert.calledWith(readFileStub, '1234', 'fileName');
            sinon.assert.calledWith(removeFileStub, '1234', 'fileName');
        });
    });

    describe('POST view for non-strategic publication', () => {
        const request = mockRequest(i18n);
        request['cookies'] = { formCookie: JSON.stringify(mockData) };
        it('should render manual upload summary page with error', async () => {
            request.query = { 'non-strategic': 'true' };
            request.user = { email: '1', userId: '1234' };
            const nonStrategicUpload = true;
            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manual-upload-summary']),
                fileUploadData: mockData,
                displayError: true,
                displaySensitivityMismatch: true,
                nonStrategicUpload,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('admin/manual-upload-summary', options);

            await manualUploadSummaryController.post(request, response);
            responseMock.verify();
            sinon.assert.calledWith(readFileStub, '1234', 'fileName');
            sinon.assert.calledWith(removeFileStub, '1234', 'fileName');
        });

        it('should render manual upload summary page with query params', async () => {
            request.query = { check: 'true', 'non-strategic': 'true' };
            const nonStrategicUpload = true;
            const options = {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manual-upload-summary']),
                fileUploadData: mockData,
                displayError: false,
                displaySensitivityMismatch: true,
                nonStrategicUpload,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('admin/manual-upload-summary', options);

            await manualUploadSummaryController.post(request, response);
            responseMock.verify();
        });

        it('should redirect to success page', async () => {
            const req = mockRequest(i18n);
            request.query = { 'non-strategic': 'true' };
            const res = {
                render: () => {
                    return '';
                },
                redirect: () => '',
                clearCookie: () => {
                    return '';
                },
            } as unknown as Response;
            req.user = { email: '2' };
            req['cookies'] = { formCookie: JSON.stringify(mockData) };
            const responseMock = sinon.mock(res);

            uploadStub.withArgs({ ...mockData, file: '', userEmail: '2' }, true).resolves('1234');

            responseMock.expects('redirect').once().withArgs('manual-upload-confirmation');

            await manualUploadSummaryController.post(req, res);
            responseMock.verify();
            sinon.assert.calledWith(readFileStub, '1234', 'fileName');
            sinon.assert.calledWith(removeFileStub, '1234', 'fileName');
        });
    });
});
