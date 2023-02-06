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

    it('Test that subscription management URL is set from environment variable', async () => {
        process.env.SUBSCRIPTION_MANAGEMENT_AZ_API = '1234';

        await import('../../../../../main/resources/requests/utils/axiosConfig');

        expect(configSpy.neverCalledWith('secrets.pip-ss-kv.SUBSCRIPTION_MANAGEMENT_AZ_API')).toBeTruthy();
    });

    it('Test that account management URL is set from environment variable', async () => {
        process.env.ACCOUNT_MANAGEMENT_AZ_API = '1234';

        await import('../../../../../main/resources/requests/utils/axiosConfig');

        expect(configSpy.neverCalledWith('secrets.pip-ss-kv.ACCOUNT_MANAGEMENT_AZ_API')).toBeTruthy();
    });

    it('Test that channel management URL is set from environment variable', async () => {
        process.env.CHANNEL_MANAGEMENT_AZ_API = '1234';

        await import('../../../../../main/resources/requests/utils/axiosConfig');

        expect(configSpy.neverCalledWith('secrets.pip-ss-kv.CHANNEL_MANAGEMENT_AZ_API')).toBeTruthy();
    });

    afterAll(() => {
        delete process.env.ALLOW_CONFIG_MUTATIONS;
        delete process.env.TENANT_ID;
        delete process.env.CLIENT_ID_INTERNAL;
        delete process.env.CLIENT_SECRET_INTERNAL;
        delete process.env.DATA_MANAGEMENT_AZ_API;
        delete process.env.SUBSCRIPTION_MANAGEMENT_AZ_API;
        delete process.env.ACCOUNT_MANAGEMENT_AZ_API;
        delete process.env.CHANNEL_MANAGEMENT_AZ_API;
    });
});
