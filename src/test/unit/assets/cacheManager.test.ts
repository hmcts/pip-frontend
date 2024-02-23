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

    beforeAll(() => {
        redisConfig = require('../../../main/cacheManager');
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

describe('Test interval', () => {
    const pingFunction = jest.fn();

    const mockRedis = {
        status: 'ready',
        ping: pingFunction,
    };

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        pingFunction.mockReset();
    });

    it('should call setInterval', async () => {
        const setInterval = jest.spyOn(global, 'setInterval');
        await require('../../../main/cacheManager');
        expect(setInterval).toHaveBeenCalledWith(expect.anything(), 300000);
    });

    it('should call ping when ready', async () => {
        const redisConfig = await require('../../../main/cacheManager');
        mockRedis.status = 'ready';
        redisConfig.intervalFunction(mockRedis);
        expect(pingFunction).toHaveBeenCalledTimes(1);
    });

    it('should not call ping when not ready', async () => {
        const redisConfig = await require('../../../main/cacheManager');
        mockRedis.status = 'connecting';
        redisConfig.intervalFunction(mockRedis);
        expect(pingFunction).toHaveBeenCalledTimes(0);
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

        const ioRedis = require('ioredis');
        jest.mock('ioredis');

        await require('../../../main/cacheManager');
        expect(ioRedis).toHaveBeenCalledTimes(1);
        expect(ioRedis).toHaveBeenCalledWith('rediss://:TEST_PASSWORD@127.0.0.1:6379', { connectTimeout: 10000 });
    });

    it('should throw an error if password has not been set in a non-local or mock environment', async () => {
        process.env.REDIS_LOCAL = '';
        process.env.REDIS_MOCK = '';

        const importCache = async () => { await require('../../../main/cacheManager'); }
        await expect(importCache()).rejects.toThrow('A password must be set for non local / mock environments');
    });

    it('should create a redis client without mock in local', async () => {
        process.env.REDIS_LOCAL = 'true';
        process.env.REDIS_MOCK = '';

        const ioRedis = require('ioredis');
        jest.mock('ioredis');

        await require('../../../main/cacheManager');
        expect(ioRedis).toHaveBeenCalledTimes(1);
        expect(ioRedis).toHaveBeenCalledWith('redis://:@127.0.0.1:6379', { connectTimeout: 10000 });
    });

    it('should create a redis client with mock', async () => {
        process.env.REDIS_LOCAL = '';
        process.env.REDIS_MOCK = 'true';

        const cacheManager = await require('../../../main/cacheManager');

        expect(cacheManager.redisClient).toHaveProperty('_redisMock');
    });
});
