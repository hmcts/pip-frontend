import * as redisConfig from '../../../main/cacheManager';
import sinon from 'sinon';
import ioredis from 'ioredis';
import { intervalFunction } from '../../../main/cacheManager';

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
    const pingStub = sinon.stub(ioredis.prototype, 'ping');

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        pingStub.reset();
    });

    it('should call setInterval', async () => {
        const setInterval = jest.spyOn(global, 'setInterval');
        await require('../../../main/cacheManager');
        expect(setInterval).toHaveBeenCalledWith(expect.anything(), 300000);
    });

    it('should call ping when ready', async () => {
        sinon.stub(ioredis.prototype, 'setStatus').returns('ready');

        await require('../../../main/cacheManager');
        intervalFunction();
        sinon.assert.notCalled(pingStub);
    });

    it('should not call ping when not ready', async () => {
        await require('../../../main/cacheManager');
        intervalFunction();
        sinon.assert.notCalled(pingStub);
    });
});
