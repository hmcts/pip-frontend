import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import FileUploadConfirmationController from '../../../main/controllers/FileUploadConfirmationController';

const fileUploadConfirmationController = new FileUploadConfirmationController();

describe('File Upload Confirmation Controller', () => {
    it('should render confirmation page', async () => {
        const i18n = { 'file-upload-confirm': {} };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('file-upload-confirm', { ...i18n['file-upload-confirm'] });

        await fileUploadConfirmationController.get(request, response);
        responseMock.verify();
    });
});
