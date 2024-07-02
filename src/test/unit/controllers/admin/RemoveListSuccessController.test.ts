import RemoveListSuccessController from '../../../../main/controllers/admin/RemoveListSuccessController';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';

const i18n = {
    admin: {
        'remove-list-success': {},
    },
};
const removeListSuccessController = new RemoveListSuccessController();

describe('Remove List Success Controller', () => {
    it('should render success page', () => {
        const response = {
            render: () => {
                return '';
            },
            cookie: (cookieName, cookieValue) => {
                return cookieName + cookieValue;
            },
            clearCookie: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);

        responseMock
            .expects('render')
            .once()
            .withArgs('admin/remove-list-success', { ...i18n['admin']['remove-list-success'] });
        removeListSuccessController.get(request, response);
        responseMock.verify();
    });
});
