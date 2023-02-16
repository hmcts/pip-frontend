import sinon from 'sinon';
import CftLoginController from '../../../main/controllers/CftLoginController';
import { Response } from 'express';
import { PipRequest } from '../../../main/models/request/PipRequest';

const cftLoginController = new CftLoginController();

describe('Cft Login Controller', () => {
    const response = {
        redirect: () => {
            return '';
        },
    } as unknown as Response;
    const request = {} as PipRequest;

    it('should attempt to redirect to the CFT IDAM', async () => {
        const responseMock = sinon.mock(response);

        const redirectUri = encodeURIComponent('https://localhost:8080/cft-login/return');

        responseMock
            .expects('redirect')
            .once()
            .withArgs(
                'https://idam-web-public.aat.platform.hmcts.net?client_id=app-pip-frontend&response_type=code&redirect_uri=' +
                    redirectUri
            );

        await cftLoginController.get(request, response);
        return responseMock.verify();
    });
});
