import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { ManualUploadService } from '../../../main/service/ManualUploadService';
import { FileHandlingService } from '../../../main/service/FileHandlingService';
import ReferenceDataUploadController from '../../../main/controllers/ReferenceDataUploadController';

const referenceDataUploadController = new ReferenceDataUploadController();
describe('Reference Data Manual Upload Controller', () => {
    const i18n = {
        'reference-data-upload': {},
        error: {},
    };
    const request = mockRequest(i18n);
    const testFile = new File([''], 'test', { type: 'text/html' });
    sinon.stub(ManualUploadService.prototype, 'buildFormData').resolves({});
    describe('GET', () => {
        request['cookies'] = { formCookie: JSON.stringify({}) };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        it('should render the reference-data-upload page', async () => {
            const responseMock = sinon.mock(response);
            const expectedData = {
                ...i18n['reference-data-upload'],
            };

            responseMock.expects('render').once().withArgs('reference-data-upload', expectedData);

            await referenceDataUploadController.get(request, response);
            responseMock.verify();
        });
    });
    describe('POST', () => {
        const fileValidationStub = sinon.stub(FileHandlingService.prototype, 'validateFileUpload');
        const sanatliseFileNameStub = sinon.stub(FileHandlingService.prototype, 'sanitiseFileName');

        sinon.stub(ManualUploadService.prototype, 'appendlocationId').resolves({ courtName: 'name', id: '1' });
        fileValidationStub.returns('error');
        fileValidationStub.withArgs(testFile).returns();
        sanatliseFileNameStub.returns('filename');

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

            await referenceDataUploadController.post(req, response);
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
                ...i18n['reference-data-upload'],
                errors: { fileErrors: 'error' },
                formData: request.body,
            };

            responseMock.expects('render').once().withArgs('reference-data-upload', expectedData);

            await referenceDataUploadController.post(request, response);
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
            request.user = { oid: '1234' };

            responseMock.expects('redirect').once().withArgs('/reference-data-upload-summary?check=true');

            await referenceDataUploadController.post(request, response);
            responseMock.verify();
            sinon.assert.called(fileUploadStub);
        });
    });
});
