import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import ManualUploadConfirmationController from '../../../../main/controllers/admin/ManualUploadConfirmationController';
import {cloneDeep} from "lodash";

const manualUploadConfirmationController = new ManualUploadConfirmationController();

describe('Manual Upload Confirmation Controller', () => {
    it('should render confirmation page', async () => {
        const i18n = {
            'manual-upload-confirmation': {},
        };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        const nonStrategicUpload = false;
        const options = {
            ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manual-upload-confirmation']),
            nonStrategicUpload,
        };

        responseMock.expects('render').once().withArgs('admin/manual-upload-confirmation', options);

        await manualUploadConfirmationController.get(request, response);
        responseMock.verify();
    });
});
