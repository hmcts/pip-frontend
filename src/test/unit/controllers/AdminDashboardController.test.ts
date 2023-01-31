import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import AdminDashboardController from '../../../main/controllers/AdminDashboardController';
import sinon from 'sinon';

const adminDashboardController = new AdminDashboardController();

describe('Admin Dashboard controller', () => {
    it('should render admin dashboard page', () => {
        const i18n = {
            'admin-dashboard': {},
        };

        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest({ 'admin-dashboard': {} });
        request['user'] = { email: 'a@b.com' };
        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['admin-dashboard'],
            user: request['user'],
        };

        responseMock.expects('render').once().withArgs('admin-dashboard', expectedData);
        adminDashboardController.get(request, response);
        responseMock.verify();
    });
});
