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

    const redirectUri = encodeURIComponent('https://localhost:8080/cft-login/return');

    it('should attempt to redirect to the CFT IDAM in English', async () => {
        request['lng'] = 'en';

        const responseMock = sinon.mock(response);

        responseMock
            .expects('redirect')
            .once()
            .withArgs(
                'https://idam-web-public.aat.platform.hmcts.net?client_id=app-pip-frontend&response_type=code&redirect_uri=' +
                    redirectUri +
                    '&ui_locales=en'
            );

        await cftLoginController.get(request, response);
        return responseMock.verify();
    });

    it('should attempt to redirect to the CFT IDAM in Welsh', async () => {
        request['lng'] = 'cy';
        const responseMock = sinon.mock(response);

        responseMock
            .expects('redirect')
            .once()
            .withArgs(
                'https://idam-web-public.aat.platform.hmcts.net?client_id=app-pip-frontend&response_type=code&redirect_uri=' +
                    redirectUri +
                    '&ui_locales=cy'
            );

        await cftLoginController.get(request, response);
        return responseMock.verify();
    });
});
