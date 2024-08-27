import { rateLimit } from 'express-rate-limit';
import { slowDown } from 'express-slow-down';
import { RedisStore } from 'rate-limit-redis';
import { PipRequest } from '../models/request/PipRequest';

const { redisClient } = require('../cacheManager');
const tooManyRequestMessage = 'Too many requests from this IP address, please try again later.';

export const standardRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    message: tooManyRequestMessage,
    store: process.env.REDIS_MOCK
        ? null
        : new RedisStore({
              prefix: 'RateLimit',
              sendCommand: async (...args: string[]) => redisClient.call(...args),
          }),
    keyGenerator: ipKeyGenerator,
});

export const strictRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    message: tooManyRequestMessage,
    store: process.env.REDIS_MOCK
        ? null
        : new RedisStore({
              prefix: 'RateLimit2',
              sendCommand: async (...args: string[]) => redisClient.call(...args),
          }),
    keyGenerator: ipKeyGenerator,
});

export const rateLimiterWithUserId = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    message: tooManyRequestMessage,
    store: process.env.REDIS_MOCK
        ? null
        : new RedisStore({
              prefix: 'RateLimit3',
              sendCommand: async (...args: string[]) => redisClient.call(...args),
          }),
    keyGenerator: function (req: PipRequest) {
        return req.user['userId'];
    },
});

export const slowDownLimiter = slowDown({
    windowMs: 60 * 1000,
    delayAfter: 5,
    delayMs: hits => hits * 200, // Add 200 ms of delay to every request after the 5th one.
    store: process.env.REDIS_MOCK
        ? null
        : new RedisStore({
              prefix: 'RateLimit4',
              sendCommand: async (...args: string[]) => redisClient.call(...args),
          }),
    keyGenerator: ipKeyGenerator,
});

function ipKeyGenerator(req: PipRequest) {
    const ip = req.headers['x-forwarded-for'];
    let key;
    if (!ip) {
        key = req.socket.remoteAddress;
    } else if (Array.isArray(ip)) {
        key = ip[0];
    } else {
        key = ip.split(',')[0].trim();
    }

    console.log('***IP address is: ' + key);
    return key;
}
