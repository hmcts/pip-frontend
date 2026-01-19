import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import ManageThirdPartySubscriberOathConfigSuccessController from '../../../../main/controllers/system-admin/ManageThirdPartySubscriberOathConfigSuccessController';

const i18n = {
    'manage-third-party-subscriber-oath-config-success': {
        title: 'Manage third party oath config success',
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

const manageThirdPartySubscriberOathConfigSuccessController =
    new ManageThirdPartySubscriberOathConfigSuccessController();

describe('Manage third party oath config success controller', () => {
    it('should render the manage third party oath config success page', async () => {
        const responseMock = sinon.mock(response);
        const expectedOptions = {
            ...i18n['manage-third-party-subscriber-oath-config-success'],
        };

        responseMock
            .expects('render')
            .once()
            .withArgs('system-admin/manage-third-party-subscriber-oath-config-success', expectedOptions);

        await manageThirdPartySubscriberOathConfigSuccessController.get(request, response);
        responseMock.verify();
    });
});
