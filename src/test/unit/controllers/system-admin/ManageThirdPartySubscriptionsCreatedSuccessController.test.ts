import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import ManageThirdPartySubscriptionsCreatedSuccessController from '../../../../main/controllers/system-admin/ManageThirdPartySubscriptionsCreatedSuccessController';

const i18n = {
    'manage-third-party-subscriptions-created-success': {
        title: 'Third-party subscriptions created',
    },
};

const request = mockRequest(i18n);
const response = {
    render: () => {
        return '';
    },
    clearCookie: () => {
        return '';
    },
} as unknown as Response;

const manageThirdPartySubscriptionsCreatedSuccessController =
    new ManageThirdPartySubscriptionsCreatedSuccessController();

describe('Manage third-party subscriptions created success controller', () => {
    it('should render the manage third-party subscriptions created success page', async () => {
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs(
                'system-admin/manage-third-party-subscriptions-created-success',
                i18n['manage-third-party-subscriptions-created-success']
            );

        await manageThirdPartySubscriptionsCreatedSuccessController.get(request, response);
        responseMock.verify();
    });
});
