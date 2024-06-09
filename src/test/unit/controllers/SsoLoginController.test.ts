import sinon from 'sinon';
import { Response } from 'express';
import { PipRequest } from '../../../main/models/request/PipRequest';
import SsoLoginController from "../../../main/controllers/SsoLoginController";

const ssoLoginController = new SsoLoginController();

describe('SSO Login Controller', () => {
    const response = {
        redirect: () => {
            return '';
        },
    } as unknown as Response;

    const request = {} as PipRequest;

    const redirectUri = encodeURIComponent('https://localhost:8080/sso');

    it('should attempt to redirect to the SSO', async () => {
        process.env.SSO_TENANT_ID = '1234';
        process.env.SSO_CLIENT_ID = '5678';

        request['lng'] = 'en';

        const responseMock = sinon.mock(response);

        responseMock
            .expects('redirect')
            .once()
            .withArgs(
                `https://login.microsoftonline.com/${process.env.SSO_TENANT_ID}/oauth2/v2.0/authorize?client_id=${process.env.SSO_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=openid+profile`
            );

        await ssoLoginController.get(request, response);
        return responseMock.verify();
    });

    afterAll(() => {
        delete process.env.SSO_TENANT_ID;
        delete process.env.SSO_CLIENT_ID;
    });
});
