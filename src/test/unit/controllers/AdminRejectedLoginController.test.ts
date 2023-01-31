import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import AdminRejectedLoginController from '../../../main/controllers/AdminRejectedLoginController';

const adminRejectedLoginController = new AdminRejectedLoginController();

describe('Admin rejected login controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest({ 'admin-rejected-login': {} });

    it('should render admin-rejected-login', async () => {
        const responseMock = sinon.mock(response);

        const i18n = {
            'admin-rejected-login': {},
        };

        const expectedData = {
            ...i18n['admin-rejected-login'],
            frontendUrl: process.env.FRONTEND_URL,
        };

        responseMock.expects('render').once().withArgs('admin-rejected-login', expectedData);

        await adminRejectedLoginController.get(request, response);
        await responseMock.verify();
    });
});
