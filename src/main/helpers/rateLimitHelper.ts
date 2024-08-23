import { rateLimit } from 'express-rate-limit';
import { slowDown } from 'express-slow-down';
import { RedisStore } from 'rate-limit-redis';
import { PipRequest } from '../models/request/PipRequest';

const { redisClient } = require('../cacheManager');

export const standardRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    message: 'Too many requests from this IP address, please try again later.',
    store: process.env.REDIS_MOCK
        ? null
        : new RedisStore({
              prefix: 'RateLimit',
              sendCommand: async (...args: string[]) => redisClient.call(...args),
          }),
});

export const strictRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    message: 'Too many requests from this IP address, please try again later.',
    store: process.env.REDIS_MOCK
        ? null
        : new RedisStore({
              prefix: 'RateLimit2',
              sendCommand: async (...args: string[]) => redisClient.call(...args),
          }),
});

export const rateLimiterWithUserId = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    message: 'Too many requests from this IP address, please try again later.',
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
});
