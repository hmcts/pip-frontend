import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import AdminDashboardController from '../../../main/controllers/AdminDashboardController';
import sinon from 'sinon';
import { MediaApplicationService } from '../../../main/service/mediaApplicationService';

sinon.stub(MediaApplicationService.prototype, 'getDateOrderedMediaApplications').resolves([]);
const adminDashboardController = new AdminDashboardController();
describe('Admin Dashboard controller', () => {
    const i18n = { 'admin-dashboard': {} };
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
        };
        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('admin-dashboard', expectedData);

        await adminDashboardController.get(request, response);
        responseMock.verify();
    });
});
