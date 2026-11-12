import { mockRequest } from '../../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import SystemAdminDashboardController from '../../../../main/controllers/system-admin/SystemAdminDashboardController';
import { UserCommunicationService } from '../../../../main/service/UserCommunicationService';

const systemAdminDashboardController = new SystemAdminDashboardController();

const mockUserCommunications = {
    allUsersType: [{ message: 'test message' }],
};
sinon.stub(UserCommunicationService.prototype, 'getUserCommunications').resolves(mockUserCommunications);

describe('System Admin Dashboard controller', () => {
    it('should render system admin dashboard page', async () => {
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
            userCommunications: mockUserCommunications,
        };

        responseMock.expects('render').once().withArgs('system-admin/system-admin-dashboard', expectedData);
        await systemAdminDashboardController.get(request, response);
        responseMock.verify();
    });
});
