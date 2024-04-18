import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import AccountHomeController from '../../../main/controllers/AccountHomeController';
import sinon from 'sinon';

const accountHomeController = new AccountHomeController();

describe('Account home controller', () => {
    it('should render account home page', () => {
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

        request.query = { verified: 'false' };

        const expectedData = {
            ...i18n['account-home'],
            showVerifiedBanner: 'false',
        };

        responseMock.expects('render').once().withArgs('account-home', expectedData);
        accountHomeController.get(request, response);
        responseMock.verify();
    });
});
