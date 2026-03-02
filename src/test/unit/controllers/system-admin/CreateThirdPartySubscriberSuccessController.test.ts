import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import CreateThirdPartySubscriberSuccessController from '../../../../main/controllers/system-admin/CreateThirdPartySubscriberSuccessController';

const formData = {
    thirdPartySubscriberName: 'name',
};
const i18n = {
    'create-third-party-subscriber-success': {
        title: 'Create third-party subscriber success',
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
request['cookies'] = { formCookie: JSON.stringify(formData) };

const createThirdPartySubscriberSuccessController = new CreateThirdPartySubscriberSuccessController();

describe('Create third-party subscriber success controller', () => {
    it('should render the create third-party subscriber success page', async () => {
        const responseMock = sinon.mock(response);
        const expectedOptions = {
            ...i18n['create-third-party-subscriber-success'],
            formData: formData,
        };

        responseMock
            .expects('render')
            .once()
            .withArgs('system-admin/create-third-party-subscriber-success', expectedOptions);

        await createThirdPartySubscriberSuccessController.get(request, response);
        responseMock.verify();
    });
});
