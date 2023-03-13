import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import { UserManagementService } from '../../../main/service/userManagementService';
import UserManagementController from '../../../main/controllers/UserManagementController';

const userManagementController = new UserManagementController();

const i18n = {
    'user-management': {},
};

sinon.stub(UserManagementService.prototype, 'getFormattedData').returns({
    userData: 'test',
    paginationData: 'test2',
    emailFieldData: 'test3',
    userIdFieldData: 'test4',
    userProvenanceIdFieldData: 'test5',
    provenancesFieldData: 'test6',
    rolesFieldData: 'test7',
    categories: 'test8',
});

sinon.stub(UserManagementService.prototype, 'getTableHeaders').returns('testHeader');
sinon.stub(UserManagementService.prototype, 'generateFilterKeyValues').returns('ThisIsAFilter=Filter');

describe('User management controller', () => {
    const response = {
        render: () => {
            return '';
        },
        redirect: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/user-management';

    it('should render the user management page', async () => {
        request.query = { clear: undefined };
        request.url = '/user-management';

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['user-management'],
            header: 'testHeader',
            userData: 'test',
            paginationData: 'test2',
            emailFieldData: 'test3',
            userIdFieldData: 'test4',
            userProvenanceIdFieldData: 'test5',
            provenancesFieldData: 'test6',
            rolesFieldData: 'test7',
            categories: 'test8',
        };

        responseMock.expects('render').once().withArgs('user-management', expectedData);

        await userManagementController.get(request, response);
        return responseMock.verify();
    });

    it('should redirect to the user management page on clear', async () => {
        const mockFilter = 'ThisIsAFilter=Filter';

        sinon.stub(UserManagementService.prototype, 'handleFilterClearing').returns('success');

        request.query = { clear: 'all' };
        request.url = '/user-management';

        const responseMock = sinon.mock(response);
        responseMock
            .expects('redirect')
            .once()
            .withArgs('user-management?' + mockFilter);

        await userManagementController.get(request, response);
        return responseMock.verify();
    });

    it('should redirect to the user management page on post', async () => {
        const mockFilter = 'ThisIsAFilter=Filter';

        request.url = '/user-management';
        request.body = 'FilterValues';

        const responseMock = sinon.mock(response);
        responseMock
            .expects('redirect')
            .once()
            .withArgs('user-management?' + mockFilter);

        await userManagementController.post(request, response);
        return responseMock.verify();
    });
});
