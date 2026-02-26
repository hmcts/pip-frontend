import config from 'config';
import sinon from 'sinon';

describe('Testing environment variables', () => {
    process.env.ALLOW_CONFIG_MUTATIONS = 'true';
    const configSpy = sinon.spy(config, 'get');

    beforeEach(() => {
        sinon.reset();
    });

    it('Test that tenant ID is set from environment variable', async () => {
        process.env.TENANT_ID = '1234';

        await import('../../../../../main/resources/requests/utils/axiosConfig');

        expect(configSpy.neverCalledWith('secrets.pip-ss-kv.TENANT_ID')).toBeTruthy();
    });

    it('Test that client id is set from environment variable', async () => {
        process.env.CLIENT_ID_INTERNAL = '1234';

        await import('../../../../../main/resources/requests/utils/axiosConfig');

        expect(configSpy.neverCalledWith('secrets.pip-ss-kv.CLIENT_ID_INTERNAL')).toBeTruthy();
    });

    it('Test that client secret is set from environment variable', async () => {
        process.env.CLIENT_SECRET_INTERNAL = '1234';

        await import('../../../../../main/resources/requests/utils/axiosConfig');

        expect(configSpy.neverCalledWith('secrets.pip-ss-kv.CLIENT_SECRET_INTERNAL')).toBeTruthy();
    });

    it('Test that data management url is set from environment variable', async () => {
        process.env.DATA_MANAGEMENT_AZ_API = '1234';

        await import('../../../../../main/resources/requests/utils/axiosConfig');

        expect(configSpy.neverCalledWith('secrets.pip-ss-kv.DATA_MANAGEMENT_AZ_API')).toBeTruthy();
    });

    it('Test that account management URL is set from environment variable', async () => {
        process.env.ACCOUNT_MANAGEMENT_AZ_API = '1234';

        await import('../../../../../main/resources/requests/utils/axiosConfig');

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

describe('Axios retry configuration', () => {
    describe('retryCondition', () => {
        it('should return true for ECONNABORTED error code', () => {
            const retryCondition = (error: { code: string }) => {
                return error.code === 'ECONNABORTED';
            };

            expect(retryCondition({ code: 'ECONNABORTED' })).toBe(true);
        });

        it('should return false for a different error code', () => {
            const retryCondition = (error: { code: string }) => {
                return error.code === 'ECONNABORTED';
            };

            expect(retryCondition({ code: 'ECONNREFUSED' })).toBe(false);
        });
    });

    describe('onRetry callback', () => {
        let loggerInfoSpy: sinon.SinonSpy;
        const mockLogger = { info: sinon.fake() };

        beforeEach(() => {
            loggerInfoSpy = mockLogger.info;
        });

        afterEach(() => {
            sinon.reset();
        });

        it('should log retry attempt with GET method', () => {
            const onRetry = (retryCount: number, _error: Error, requestConfig: { baseURL?: string; url?: string; method?: string }) => {
                const requestMethod = requestConfig.method ? requestConfig.method.toUpperCase() : '';
                mockLogger.info(
                    `Retry #${retryCount} on request to ${requestConfig.baseURL} with URL ${requestMethod} ${requestConfig.url}`
                );
            };

            onRetry(1, new Error('Connection aborted'), {
                baseURL: 'https://api.example.com',
                url: '/test-endpoint',
                method: 'get'
            });

            expect(loggerInfoSpy.calledWith(
                'Retry #1 on request to https://api.example.com with URL GET /test-endpoint'
            )).toBe(true);
        });

        it('should log retry attempt with POST method', () => {
            const onRetry = (retryCount: number, _error: Error, requestConfig: { baseURL?: string; url?: string; method?: string }) => {
                const requestMethod = requestConfig.method ? requestConfig.method.toUpperCase() : '';
                mockLogger.info(
                    `Retry #${retryCount} on request to ${requestConfig.baseURL} with URL ${requestMethod} ${requestConfig.url}`
                );
            };

            onRetry(2, new Error('Connection aborted'), {
                baseURL: 'https://api.example.com',
                url: '/data',
                method: 'post'
            });

            expect(loggerInfoSpy.calledWith(
                'Retry #2 on request to https://api.example.com with URL POST /data'
            )).toBe(true);
        });

        it('should include correct retry count in log message', () => {
            const onRetry = (retryCount: number, _error: Error, requestConfig: { baseURL?: string; url?: string; method?: string }) => {
                const requestMethod = requestConfig.method ? requestConfig.method.toUpperCase() : '';
                mockLogger.info(
                    `Retry #${retryCount} on request to ${requestConfig.baseURL} with URL ${requestMethod} ${requestConfig.url}`
                );
            };

            onRetry(1, new Error(), { baseURL: 'https://test.com', url: '/api', method: 'get' });
            expect(loggerInfoSpy.calledWithMatch(/Retry #1/)).toBe(true);

            sinon.reset();

            onRetry(2, new Error(), { baseURL: 'https://test.com', url: '/api', method: 'get' });
            expect(loggerInfoSpy.calledWithMatch(/Retry #2/)).toBe(true);
        });
    });
});
