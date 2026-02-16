import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import ManageThirdPartySubscriptionsUpdatedSuccessController from '../../../../main/controllers/system-admin/ManageThirdPartySubscriptionsUpdatedSuccessController';

const i18n = {
    'manage-third-party-subscriptions-updated-success': {
        title: 'Third-party subscriptions updated',
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

const manageThirdPartySubscriptionsUpdatedSuccessController =
    new ManageThirdPartySubscriptionsUpdatedSuccessController();

describe('Manage third-party subscriptions updated success controller', () => {
    it('should render the manage third-party subscriptions updated success page', async () => {
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs(
                'system-admin/manage-third-party-subscriptions-updated-success',
                i18n['manage-third-party-subscriptions-updated-success']
            );

        await manageThirdPartySubscriptionsUpdatedSuccessController.get(request, response);
        responseMock.verify();
    });
});
