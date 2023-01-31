import RemoveListSuccessController from '../../../main/controllers/RemoveListSuccessController';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';

const i18n = { 'remove-list-success': {} };
const removeListSuccessController = new RemoveListSuccessController();

describe('Remove List Success Controller', () => {
    it('should render success page', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);

        responseMock
            .expects('render')
            .once()
            .withArgs('remove-list-success', { ...i18n['remove-list-success'] });
        removeListSuccessController.get(request, response);
        responseMock.verify();
    });
});
