import { mockRequest } from '../../mocks/mockRequest';
import { Response } from 'express';
import AdminDashboardController from '../../../../main/controllers/admin/AdminDashboardController';
import sinon from 'sinon';
import { MediaAccountApplicationService } from '../../../../main/service/MediaAccountApplicationService';

sinon.stub(MediaAccountApplicationService.prototype, 'getDateOrderedMediaApplications').resolves([]);
const adminDashboardController = new AdminDashboardController();
describe('Admin Dashboard controller', () => {
    const i18n = {
        'admin-dashboard': {},
    };
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);

    it('should render admin dashboard page', async () => {
        request['user'] = { email: 'a@b.com' };
        const expectedData = {
            ...i18n['admin-dashboard'],
            mediaApplicationsCount: 0,
            user: request['user'],
            activeAdminDashboard: true,
        };
        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('admin/admin-dashboard', expectedData);

        await adminDashboardController.get(request, response);
        responseMock.verify();
    });
});
