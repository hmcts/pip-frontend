import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import ReferenceDataUploadConfirmationController from '../../../main/controllers/ReferenceDataUploadConfirmationController';

const referenceDataUploadConfirmationController = new ReferenceDataUploadConfirmationController();

describe('Reference data file upload Confirmation Controller', () => {
    it('should render confirmation page', async () => {
        const i18n = { 'reference-data-upload-confirmation': {} };
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
            .withArgs('reference-data-upload-confirmation', {
                ...i18n['reference-data-upload-confirmation'],
            });

        await referenceDataUploadConfirmationController.get(request, response);
        responseMock.verify();
    });
});
