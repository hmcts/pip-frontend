const expectedValues = {
    host: '127.0.0.1',
    port: '6379',
    password: '',
};

const expectedEnvValues = {
    host: '192.168.0.1',
    port: '6380',
    password: 'password',
};

describe('cache manager', () => {
    let redisConfig;

    beforeAll(async () => {
        redisConfig = await import('../../../main/cacheManager');
    });

    afterEach(() => {
        jest.resetModules();

        process.env.REDIS_HOST = '';
        process.env.REDIS_PORT = '';
        process.env.REDIS_PASSWORD = '';
    });

    it('should pick default variables is env are not set', () => {
        const redisCredentials = redisConfig.setRedisCredentials();
        expect(redisCredentials.host).toEqual(expectedValues.host);
        expect(redisCredentials.port).toEqual(expectedValues.port);
        expect(redisCredentials.password).toEqual(expectedValues.password);
    });

    it('should pick env variables', () => {
        process.env.REDIS_HOST = '192.168.0.1';
        process.env.REDIS_PORT = '6380';
        process.env.REDIS_PASSWORD = 'password';
        const envCredentials = redisConfig.setRedisCredentials();
        expect(envCredentials.host).toEqual(expectedEnvValues.host);
        expect(envCredentials.port).toEqual(expectedEnvValues.port);
        expect(envCredentials.password).toEqual(expectedEnvValues.password);
    });
});

describe('Cache Manager creation', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env.REDIS_PASSWORD = '';
    });

    it('should create a redis client without mock in non local when a non empty password is set', async () => {
        process.env.REDIS_LOCAL = '';
        process.env.REDIS_MOCK = '';
        process.env.REDIS_PASSWORD = 'TEST_PASSWORD';

        const connectMock = jest.fn(() => ({
            catch: jest.fn(),
        }));

        jest.mock('redis', () => ({
            createClient: jest.fn(() => ({
                connect: connectMock,
                on: jest.fn(),
            })),
        }));

        const redis = await import('redis');

        await import('../../../main/cacheManager');
        expect(redis.createClient).toHaveBeenCalledTimes(1);
        expect(redis.createClient).toHaveBeenCalledWith({
            url: 'rediss://:TEST_PASSWORD@127.0.0.1:6379',
            pingInterval: 300000,
            socket: {
                connectTimeout: 10000,
            }
        });
        expect(connectMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if password has not been set in a non-local or mock environment', async () => {
        process.env.REDIS_LOCAL = '';
        process.env.REDIS_MOCK = '';

        const importCache = async () => {
            await import('../../../main/cacheManager');
        };
        await expect(importCache()).rejects.toThrow('A password must be set for non local / mock environments');
    });

    it('should create a redis client without mock in local', async () => {
        process.env.REDIS_LOCAL = 'true';
        process.env.REDIS_MOCK = '';

        const connectMock = jest.fn(() => ({
            catch: jest.fn(),
        }));

        jest.mock('redis', () => ({
            createClient: jest.fn(() => ({
                connect: connectMock,
                on: jest.fn(),
            })),
        }));

        const redis = await import('redis');

        await import('../../../main/cacheManager');
        expect(redis.createClient).toHaveBeenCalledTimes(1);
        expect(redis.createClient).toHaveBeenCalledWith({
            url: 'redis://:@127.0.0.1:6379',
            pingInterval: 300000,
            socket: {
                connectTimeout: 10000,
            }
        });
        expect(connectMock).toHaveBeenCalledTimes(1);
    });

    it('should create a redis client with mock', async () => {
        process.env.REDIS_LOCAL = '';
        process.env.REDIS_MOCK = 'true';

        const cacheManager = await import('../../../main/cacheManager');

        expect(cacheManager.redisClient).toHaveProperty('_redisMock');
    });
});
