import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { ManualUploadService } from '../../../main/service/manualUploadService';
import ManualUploadController from '../../../main/controllers/ManualUploadController';
import { FileHandlingService } from '../../../main/service/fileHandlingService';

const manualUploadController = new ManualUploadController();

const mockSensitivityMappings = {
    SJP_PUBLIC_LIST: '',
    SJP_PRESS_LIST: 'CLASSIFIED',
};

describe('Manual Upload Controller', () => {
    const i18n = {
        'manual-upload': {},
        error: {},
    };
    const request = mockRequest(i18n);
    const testFile = new File([''], 'test', { type: 'text/html' });
    sinon.stub(ManualUploadService.prototype, 'buildFormData').resolves({});
    sinon.stub(ManualUploadService.prototype, 'getSensitivityMappings').returns(mockSensitivityMappings);

    describe('GET', () => {
        request['cookies'] = { formCookie: JSON.stringify({}) };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        it('should render the manual-upload page', async () => {
            const responseMock = sinon.mock(response);
            const expectedData = {
                ...i18n['manual-upload'],
                listItems: {},
                formData: {},
                listTypeClassifications: mockSensitivityMappings,
            };

            responseMock.expects('render').once().withArgs('manual-upload', expectedData);

            await manualUploadController.get(request, response);
            responseMock.verify();
        });
    });
    describe('POST', () => {
        const fileValidationStub = sinon.stub(FileHandlingService.prototype, 'validateFileUpload');
        const sanitiseFileNameStub = sinon.stub(FileHandlingService.prototype, 'sanitiseFileName');
        const formValidationStub = sinon.stub(ManualUploadService.prototype, 'validateFormFields');

        sinon.stub(ManualUploadService.prototype, 'appendlocationId').resolves({ courtName: 'name', id: '1' });
        fileValidationStub.returns('error');
        formValidationStub.resolves('error');
        fileValidationStub.withArgs(testFile).returns();
        formValidationStub.withArgs({ data: 'valid' }).resolves();
        sanitiseFileNameStub.returns('filename');

        it('should render error page if uncaught multer error occurs', async () => {
            const req = mockRequest(i18n);
            req.query = { showerror: 'true' };
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);

            responseMock
                .expects('render')
                .once()
                .withArgs('error', { ...i18n.error });

            await manualUploadController.post(req, response);
            responseMock.verify();
        });

        it('should render same page if errors are present', async () => {
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);
            const expectedData = {
                ...i18n['manual-upload'],
                listItems: {},
                errors: { fileErrors: 'error', formErrors: 'error' },
                formData: request.body,
                listTypeClassifications: mockSensitivityMappings,
            };

            responseMock.expects('render').once().withArgs('manual-upload', expectedData);

            await manualUploadController.post(request, response);
            responseMock.verify();
        });

        it('should redirect page if no errors present', async () => {
            const fileUploadStub = sinon.stub(FileHandlingService.prototype, 'storeFileIntoRedis');
            fileUploadStub.withArgs('1234', 'test').returns();

            const response = {
                redirect: () => {
                    return '';
                },
                cookie: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);
            request.body = { data: 'valid' };
            request.file = testFile;
            request.user = { userId: '1234' };

            responseMock.expects('redirect').once().withArgs('/manual-upload-summary?check=true');

            await manualUploadController.post(request, response);
            responseMock.verify();
            sinon.assert.called(fileUploadStub);
        });
    });
});
