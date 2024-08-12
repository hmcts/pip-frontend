import * as querystring from 'querystring';

describe('Crime IDAM Authentication', () => {
    let sinon;
    let postStub;
    let getSub;
    let crimeIdamAuthenticationInstance;

    beforeEach(() => {
        sinon = require('sinon');
        const axiosConfig = require('../../../main/resources/requests/utils/axiosConfig');
        postStub = sinon.stub(axiosConfig.crimeIdamTokenApi, 'post');
        getSub = sinon.stub(axiosConfig.crimeIdamTokenApi, 'get');
    });

    afterEach(() => {
        jest.resetModules();
    });

    it('should call the callback when successful', async () => {
        const crimeIdamAuthentication = require('../../../main/authentication/crimeIdamAuthentication');

        crimeIdamAuthenticationInstance = crimeIdamAuthentication.crimeIdamAuthentication;

        const mockFunction = jest.fn();
        const request = { query: { code: '1234' } };
        postStub.resolves({ data: { access_token: 'test' } });
        getSub.resolves({ data: { email: 'test@test.com' } });

        const params = {
            client_id: 'client-id',
            client_secret: 'client-secret',
            grant_type: 'authorization_code',
            redirect_uri: 'https://localhost:8080/crime-login/return',
            code: '1234',
        };

        await crimeIdamAuthenticationInstance(request, mockFunction);
        await crimeIdamAuthentication.getCrimeIdamUserInfo('test');

        const crimeIdamTokenCall = postStub.getCall(0).args;
        expect(crimeIdamTokenCall[0]).toEqual('/idp/oauth2/access_token');
        expect(crimeIdamTokenCall[1]).toEqual(querystring.stringify(params));
        expect(crimeIdamTokenCall[2]).toEqual({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        expect(mockFunction.mock.calls.length).toBe(1);
        expect(mockFunction.mock.calls[0][0]).toBe(null);
        expect(mockFunction.mock.calls[0][1]).toEqual({
            email: 'test@test.com',
            flow: 'Crime',
        });
    });

    it('should return Crime Idam user information when successful', async () => {
        const crimeIdamAuthentication = require('../../../main/authentication/crimeIdamAuthentication');

        getSub.resolves({ data: { email: 'test@test.com' } });

        await crimeIdamAuthentication.getCrimeIdamUserInfo('test');

        const crimeUserInfo = getSub.getCall(0).args;
        expect(crimeUserInfo[0]).toEqual('/idp/oauth2/userinfo');
        expect(crimeUserInfo[1]).toEqual({
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer test',
            },
        });

        expect(getSub.calledOnce).toBeTruthy();
    });
});
