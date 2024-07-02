import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import ManualUploadConfirmationController from '../../../../main/controllers/admin/ManualUploadConfirmationController';

const manualUploadConfirmationController = new ManualUploadConfirmationController();

describe('Manual Upload Confirmation Controller', () => {
    it('should render confirmation page', async () => {
        const i18n = {
            admin: {
                'manual-upload-confirmation': {},
            },
        };
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
            .withArgs('admin/manual-upload-confirmation', { ...i18n['admin']['manual-upload-confirmation'] });

        await manualUploadConfirmationController.get(request, response);
        responseMock.verify();
    });
});
