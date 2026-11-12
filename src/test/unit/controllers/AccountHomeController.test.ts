import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import AccountHomeController from '../../../main/controllers/AccountHomeController';
import sinon from 'sinon';
import { UserCommunicationService } from '../../../main/service/UserCommunicationService';

const accountHomeController = new AccountHomeController();
const user = { userId: 'test ID' };
const mockUserCommunications = {
    allUsersType: [{ message: 'test message' }],
};
sinon.stub(UserCommunicationService.prototype, 'groupCommunicationMessages').resolves(mockUserCommunications);

describe('Account home controller', () => {
    it('should render account home page', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest({ 'account-home': {} });
        const responseMock = sinon.mock(response);

        const i18n = {
            'account-home': {},
        };

        request.user = user;
        request.query = { verified: 'false' };

        const expectedData = {
            ...i18n['account-home'],
            showVerifiedBanner: 'false',
            activeVerifiedDashboard: true,
            user: user,
            userCommunications: mockUserCommunications,
        };

        responseMock.expects('render').once().withArgs('account-home', expectedData);
        await accountHomeController.get(request, response);
        responseMock.verify();
    });
});
