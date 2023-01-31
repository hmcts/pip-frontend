import * as querystring from 'querystring';

describe('CFT IDAM Authentication', () => {
    let sinon;
    let postStub;
    let cftIdamAuthenticationInstance;

    beforeEach(() => {
        sinon = require('sinon');
        const axiosConfig = require('../../../main/resources/requests/utils/axiosConfig');
        postStub = sinon.stub(axiosConfig.cftIdamTokenApi, 'post');
    });

    afterEach(() => {
        jest.resetModules();
    });

    it('should call the callback when successful', async () => {
        jest.mock('jwt-decode', () => () => ({ roles: ['IDAM_ADMIN_USER'] }));
        const cftIdamAuthentication = require('../../../main/authentication/cftIdamAuthentication');
        cftIdamAuthenticationInstance = cftIdamAuthentication.cftIdamAuthentication;

        const mockFunction = jest.fn();
        const request = { query: { code: '1234' } };
        postStub.resolves({ data: {} });

        const params = {
            client_id: 'app-pip-frontend',
            client_secret: 'client-secret',
            grant_type: 'authorization_code',
            redirect_uri: 'https://localhost:8080/cft-login/return',
            code: '1234',
        };

        await cftIdamAuthenticationInstance(request, mockFunction);

        const cftIdamTokenCall = postStub.getCall(0).args;
        expect(cftIdamTokenCall[0]).toEqual('/o/token');
        expect(cftIdamTokenCall[1]).toEqual(querystring.stringify(params));
        expect(cftIdamTokenCall[2]).toEqual({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        expect(mockFunction.mock.calls.length).toBe(1);
        expect(mockFunction.mock.calls[0][0]).toBe(null);
        expect(mockFunction.mock.calls[0][1]).toEqual({
            roles: ['IDAM_ADMIN_USER'],
            flow: 'CFT',
        });
    });

    it('Should call the callback with null when throwing an error', async () => {
        jest.mock('jwt-decode', () => () => ({ roles: 'INTERNAL_ADMIN' }));
        const cftIdamAuthentication = require('../../../main/authentication/cftIdamAuthentication');
        cftIdamAuthenticationInstance = cftIdamAuthentication.cftIdamAuthentication;

        const mockFunction = jest.fn();
        const request = { query: { code: '1234' } };
        postStub.throws(new Error('CFT IDAM Callback Error'));

        await cftIdamAuthenticationInstance(request, mockFunction);

        expect(mockFunction.mock.calls.length).toBe(1);
        expect(mockFunction.mock.calls[0][0]).toBe(null);
        expect(mockFunction.mock.calls[0][1]).toBe(null);
    });

    it('Should call the callback with null when role does not match expected citizen role', async () => {
        jest.mock('jwt-decode', () => () => ({ roles: ['citizen'] }));
        const cftIdamAuthentication = require('../../../main/authentication/cftIdamAuthentication');
        cftIdamAuthenticationInstance = cftIdamAuthentication.cftIdamAuthentication;
        postStub.resolves({ data: {} });

        const mockFunction = jest.fn();
        const request = { query: { code: '1234' } };

        await cftIdamAuthenticationInstance(request, mockFunction);

        expect(mockFunction.mock.calls.length).toBe(1);
        expect(mockFunction.mock.calls[0][0]).toBe(null);
        expect(mockFunction.mock.calls[0][1]).toBe(null);
    });

    it('Should call the callback with null when role does not match expected letter-holder role', async () => {
        jest.mock('jwt-decode', () => () => ({ roles: ['letter-holder'] }));
        const cftIdamAuthentication = require('../../../main/authentication/cftIdamAuthentication');
        cftIdamAuthenticationInstance = cftIdamAuthentication.cftIdamAuthentication;
        postStub.resolves({ data: {} });

        const mockFunction = jest.fn();
        const request = { query: { code: '1234' } };

        await cftIdamAuthenticationInstance(request, mockFunction);

        expect(mockFunction.mock.calls.length).toBe(1);
        expect(mockFunction.mock.calls[0][0]).toBe(null);
        expect(mockFunction.mock.calls[0][1]).toBe(null);
    });
});
