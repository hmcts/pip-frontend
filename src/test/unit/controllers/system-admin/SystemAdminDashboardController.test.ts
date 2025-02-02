import { mockRequest } from '../../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import SystemAdminDashboardController from '../../../../main/controllers/system-admin/SystemAdminDashboardController';

const systemAdminDashboardController = new SystemAdminDashboardController();

describe('System Admin Dashboard controller', () => {
    it('should render system admin dashboard page', () => {
        const i18n = {
            'system-admin-dashboard': {},
        };

        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request['user'] = { role: 'SYSTEM_ADMIN' };
        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['system-admin-dashboard'],
            user: request['user'],
            activeSystemAdminDashboard: true,
        };

        responseMock.expects('render').once().withArgs('system-admin/system-admin-dashboard', expectedData);
        systemAdminDashboardController.get(request, response);
        responseMock.verify();
    });
});
