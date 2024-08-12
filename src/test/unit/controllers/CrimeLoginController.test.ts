import sinon from 'sinon';
import { Response } from 'express';
import { PipRequest } from '../../../main/models/request/PipRequest';
import CrimeLoginController from '../../../main/controllers/CrimeLoginController';
import process from 'process';

const crimeLoginController = new CrimeLoginController();

describe('Crime Login Controller', () => {
    const response = {
        redirect: () => {
            return '';
        },
    } as unknown as Response;

    const request = {} as PipRequest;

    const redirectUri = encodeURIComponent('https://localhost:8080/crime-login/return');

    process.env.CRIME_IDAM_CLIENT_ID = 'client-id';

    it('should attempt to redirect to the Crime IDAM', async () => {
        const responseMock = sinon.mock(response);

        responseMock
            .expects('redirect')
            .once()
            .withArgs(
                'https://login.sit.cjscp.org.uk/idp/oauth2/authorize?response_type=code&client_id=client-id&redirect_uri=' +
                    redirectUri +
                    '&scope=openid+profile+email'
            );

        await crimeLoginController.get(request, response);
        return responseMock.verify();
    });
});
