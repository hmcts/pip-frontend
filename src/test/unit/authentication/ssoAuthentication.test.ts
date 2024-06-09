import querystring from 'querystring';
import { graphApi, ssoTokenApi } from '../../../main/resources/requests/utils/axiosConfig';
import sinon from 'sinon';
import process from 'process';

const systemAdminSecurityGroup = 'Group1';

sinon.stub(graphApi, 'post').resolves({ data: { value: [systemAdminSecurityGroup] } });

describe('SSO Authentication', () => {
    let sinon;
    let postStub;
    let ssoAuthenticationInstance;

    beforeEach(() => {
        sinon = require('sinon');
        postStub = sinon.stub(ssoTokenApi, 'post');
    });

    afterEach(() => {
        jest.resetModules();
    });

    it('should call the callback when successful', async () => {
        process.env.SSO_CLIENT_ID = '1234';
        process.env.SSO_CLIENT_SECRET = '5678';
        process.env.SSO_SG_SYSTEM_ADMIN = systemAdminSecurityGroup;

        jest.mock('jwt-decode', () => ({
            jwtDecode: () => ({ oid: '123' }),
        }));

        const ssoAuthentication = require('../../../main/authentication/ssoAuthentication');
        ssoAuthenticationInstance = ssoAuthentication.ssoAuthentication;

        const mockFunction = jest.fn();
        const request = { query: { code: '9999' } };
        postStub.resolves({ data: {} });

        const params = {
            client_id: '1234',
            client_secret: '5678',
            grant_type: 'authorization_code',
            redirect_uri: 'https://localhost:8080/sso',
            code: '9999',
        };

        await ssoAuthenticationInstance(request, mockFunction);

        const ssoIdamTokenCall = await postStub.getCall(0).args;
        expect(ssoIdamTokenCall[0]).toEqual('/oauth2/v2.0/token');
        expect(ssoIdamTokenCall[1]).toEqual(querystring.stringify(params));
        expect(ssoIdamTokenCall[2]).toEqual({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        expect(mockFunction.mock.calls.length).toBe(1);
        expect(mockFunction.mock.calls[0][0]).toBe(null);
        expect(mockFunction.mock.calls[0][1]).toEqual({
            oid: '123',
            flow: 'SSO',
            roles: 'SYSTEM_ADMIN',
        });
    });

    afterAll(() => {
        delete process.env.SSO_CLIENT_ID;
        delete process.env.SSO_CLIENT_SECRET;
        delete process.env.SSO_SG_SYSTEM_ADMIN;
    });
});
