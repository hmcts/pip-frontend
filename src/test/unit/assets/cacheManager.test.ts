import * as redisConfig from '../../../main/cacheManager';

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
    afterEach(() => {
        jest.resetModules();
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
    let setInterval;
    beforeEach(() => {
        jest.resetModules();
        jest.useFakeTimers();
        setInterval = jest.spyOn(global, 'setInterval');
    });

    it('should call setInterval', async () => {
        await require('../../../main/cacheManager');
        expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 300000);
    });
});
