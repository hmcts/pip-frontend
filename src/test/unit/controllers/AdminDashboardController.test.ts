import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import AdminDashboardController from '../../../main/controllers/AdminDashboardController';
import sinon from 'sinon';

const adminDashboardController = new AdminDashboardController();

describe('Admin Dashboard controller', () => {
  it('should render admin dashboard page', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest({'admin-dashboard': {}});
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('admin-dashboard', request.i18n.getDataByLanguage(request.lng)['admin-dashboard']);
    adminDashboardController.get(request, response);
    responseMock.verify();
  });
});
