import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import SsoRejectedLoginController from '../../../main/controllers/SsoRejectedLoginController';
import { ssoNotAuthorised } from '../../../main/helpers/consts';

const ssoRejectedLoginController = new SsoRejectedLoginController();

describe('SSO rejected login controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    it('should render sso-rejected-login page if message is NOT_AUTHORISED', async () => {
        const request = mockRequest({ 'sso-rejected-login': {} });
        request['session'] = { messages: [ssoNotAuthorised] };
        const responseMock = sinon.mock(response);

        const i18n = {
            'sso-rejected-login': {},
        };

        const expectedData = {
            ...i18n['sso-rejected-login'],
        };

        responseMock.expects('render').once().withArgs('sso-rejected-login', expectedData);

        await ssoRejectedLoginController.get(request, response);
        await responseMock.verify();
    });

    describe('should render error page', () => {
        const i18n = {
            error: {},
        };

        const expectedData = {
            ...i18n['error'],
        };

        it('if messages not defined', async () => {
            const request = mockRequest({ error: {} });

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('not-found', undefined);

            await ssoRejectedLoginController.get(request, response);
            await responseMock.verify();
        });

        it('if messages is not an array', async () => {
            const request = mockRequest({ error: {} });
            request['session'] = { messages: 'Not an array' };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('error', expectedData);

            await ssoRejectedLoginController.get(request, response);
            await responseMock.verify();
        });

        it('if messages is an empty array', async () => {
            const request = mockRequest({ error: {} });
            request['session'] = { messages: [] };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('error', expectedData);

            await ssoRejectedLoginController.get(request, response);
            await responseMock.verify();
        });

        it('if messages is not NOT_AUTHORISED', async () => {
            const request = mockRequest({ error: {} });
            request['session'] = { messages: ['UNKNOWN_ERROR'] };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('error', expectedData);

            await ssoRejectedLoginController.get(request, response);
            await responseMock.verify();
        });
    });
});
