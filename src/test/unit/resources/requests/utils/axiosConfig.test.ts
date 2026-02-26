import config from 'config';
import sinon from 'sinon';

describe('Testing environment variables', () => {
    process.env.ALLOW_CONFIG_MUTATIONS = 'true';
    const configSpy = sinon.spy(config, 'get');

    beforeEach(async () => {
        await import('../../../../../main/resources/requests/utils/axiosConfig');
        sinon.reset();
    });

    it('Test that tenant ID is set from environment variable', async () => {
        process.env.TENANT_ID = '1234';
        expect(configSpy.neverCalledWith('secrets.pip-ss-kv.TENANT_ID')).toBeTruthy();
    });

    it('Test that client id is set from environment variable', async () => {
        process.env.CLIENT_ID_INTERNAL = '1234';
        expect(configSpy.neverCalledWith('secrets.pip-ss-kv.CLIENT_ID_INTERNAL')).toBeTruthy();
    });

    it('Test that client secret is set from environment variable', async () => {
        process.env.CLIENT_SECRET_INTERNAL = '1234';
        expect(configSpy.neverCalledWith('secrets.pip-ss-kv.CLIENT_SECRET_INTERNAL')).toBeTruthy();
    });

    it('Test that data management url is set from environment variable', async () => {
        process.env.DATA_MANAGEMENT_AZ_API = '1234';
        expect(configSpy.neverCalledWith('secrets.pip-ss-kv.DATA_MANAGEMENT_AZ_API')).toBeTruthy();
    });

    it('Test that account management URL is set from environment variable', async () => {
        process.env.ACCOUNT_MANAGEMENT_AZ_API = '1234';
        expect(configSpy.neverCalledWith('secrets.pip-ss-kv.ACCOUNT_MANAGEMENT_AZ_API')).toBeTruthy();
    });

    afterAll(() => {
        delete process.env.ALLOW_CONFIG_MUTATIONS;
        delete process.env.TENANT_ID;
        delete process.env.CLIENT_ID_INTERNAL;
        delete process.env.CLIENT_SECRET_INTERNAL;
        delete process.env.DATA_MANAGEMENT_AZ_API;
        delete process.env.ACCOUNT_MANAGEMENT_AZ_API;
    });
});

let capturedRetryOptions: any = null;
const integrationMockLogger = { info: jest.fn() };

jest.mock('axios', () => {
    const mockCreate = jest.fn(() => ({
        interceptors: {
            request: { use: jest.fn() }
        }
    }));
    return {
        default: { create: mockCreate },
        create: mockCreate
    };
});

jest.mock('axios-retry', () => {
    const mockLinearDelay = jest.fn((ms: number) => () => ms);
    const mockFn: any = jest.fn((_: any, options: any) => {
        capturedRetryOptions = options;
    });
    mockFn.linearDelay = mockLinearDelay;
    mockFn.default = mockFn;
    return mockFn;
});

jest.mock('axios-oauth-client', () => {
    const mockClientCredentials = jest.fn();
    return {
        default: { clientCredentials: mockClientCredentials },
        clientCredentials: mockClientCredentials
    };
});

jest.mock('@hmcts/nodejs-logging', () => ({
    Logger: {
        getLogger: () => integrationMockLogger
    }
}));

jest.mock('../../../helpers/envUrls', () => ({
    CFT_IDAM_URL: 'https://cft-idam.mock',
    CRIME_IDAM_URL: 'https://crime-idam.mock',
    MICROSOFT_GRAPH_API_URL: 'https://graph.mock',
    MICROSOFT_LOGIN_URL: 'https://login.mock'
}));

describe('axiosConfig onRetry integration', () => {
    beforeEach(async () => {
        jest.resetModules();
        jest.clearAllMocks();
        capturedRetryOptions = null;
        process.env.INSECURE = 'true';
        await import('../../../../../main/resources/requests/utils/axiosConfig');
    });

    afterEach(() => {
        delete process.env.INSECURE;
    });

    it('should call logger.info with correct message when onRetry is triggered', () => {
        const mockRequestConfig = {
            baseURL: 'https://api.example.com',
            url: '/test-endpoint',
            method: 'get'
        };

        capturedRetryOptions.onRetry(1, new Error('Connection aborted'), mockRequestConfig);

        expect(integrationMockLogger.info).toHaveBeenCalledWith(
            'Retry #1 on request to https://api.example.com with URL GET /test-endpoint'
        );
    });

    it('should uppercase the HTTP method in the log message', () => {
        const mockRequestConfig = {
            baseURL: 'https://api.example.com',
            url: '/data',
            method: 'post'
        };

        capturedRetryOptions.onRetry(2, new Error('Connection aborted'), mockRequestConfig);

        expect(integrationMockLogger.info).toHaveBeenCalledWith(
            'Retry #2 on request to https://api.example.com with URL POST /data'
        );
    });
});
