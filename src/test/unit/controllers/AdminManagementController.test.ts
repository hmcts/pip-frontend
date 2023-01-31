import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import AdminManagementController from '../../../main/controllers/AdminManagementController';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';

const adminManagementController = new AdminManagementController();
const stub = sinon.stub(AccountManagementRequests.prototype, 'getAdminUserByEmailAndProvenance');
const i18n = { 'admin-management': {} };

describe('Admin Management Controller', () => {
    const response = {
        render: function () {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.user = { userId: '1' };

    it('should render the admin management page', async () => {
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('admin-management', { ...i18n['admin-management'] });
        await adminManagementController.get(request, response);
        responseMock.verify();
    });

    it('should render admin management page if there are no results', async () => {
        stub.withArgs('12345678').resolves(null);
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'search-input': '12345678' };
        const responseMock = sinon.mock(response);
        const expectedResults = {
            ...i18n['admin-management'],
            noResultsError: true,
        };

        responseMock.expects('render').once().withArgs('admin-management', expectedResults);
        await adminManagementController.post(request, response);
        responseMock.verify();
    });

    it('should render admin management page if no input is provided', () => {
        stub.withArgs('').resolves(null);
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'search-input': '' };
        const responseMock = sinon.mock(response);
        const expectedResults = {
            ...i18n['admin-management'],
            noResultsError: true,
        };

        responseMock.expects('render').once().withArgs('admin-management', expectedResults);
        return adminManagementController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should redirect to admin management page if input is correct and found', async () => {
        const response = {
            redirect: () => {
                return '';
            },
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'search-input': '123456789' };
        const responseMock = sinon.mock(response);
        stub.withArgs('123456789').resolves({
            userId: '123456789',
        });

        responseMock.expects('redirect').once().withArgs('manage-user?id=123456789');
        await adminManagementController.post(request, response);
        responseMock.verify();
    });
});
