import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import ManageThirdPartySubscriberOauthConfigSuccessController from '../../../../main/controllers/system-admin/ManageThirdPartySubscriberOauthConfigSuccessController';

const i18n = {
    'manage-third-party-subscriber-oauth-config-success': {
        title: 'Manage third party oauth config success',
    },
};

const response = {
    render: () => {
        return '';
    },
    cookie: (cookieName, cookieValue) => {
        return cookieName + cookieValue;
    },
    clearCookie: () => {
        return '';
    },
} as unknown as Response;

const request = mockRequest(i18n);

const manageThirdPartySubscriberOauthConfigSuccessController =
    new ManageThirdPartySubscriberOauthConfigSuccessController();

describe('Manage third party oauth config success controller', () => {
    it('should render the manage third party oauth config success page', async () => {
        const responseMock = sinon.mock(response);
        const expectedOptions = {
            ...i18n['manage-third-party-subscriber-oauth-config-success'],
        };

        responseMock
            .expects('render')
            .once()
            .withArgs('system-admin/manage-third-party-subscriber-oauth-config-success', expectedOptions);

        await manageThirdPartySubscriberOauthConfigSuccessController.get(request, response);
        responseMock.verify();
    });
});
