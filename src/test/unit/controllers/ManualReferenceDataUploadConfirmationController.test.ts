import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import ManualReferenceDataUploadConfirmationController from '../../../main/controllers/ManualReferenceDataUploadConfirmationController';

const manualReferenceDataUploadConfirmationController = new ManualReferenceDataUploadConfirmationController();

describe('Reference data file upload Confirmation Controller', () => {
    it('should render confirmation page', async () => {
        const i18n = { 'manual-reference-data-upload-confirmation': {} };
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
            .withArgs('manual-reference-data-upload-confirmation', {
                ...i18n['manual-reference-data-upload-confirmation'],
            });

        await manualReferenceDataUploadConfirmationController.get(request, response);
        responseMock.verify();
    });
});
