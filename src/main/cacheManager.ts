/* eslint-disable @typescript-eslint/no-require-imports */
import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';
import { createClient } from "redis";

function getRedisPassword(): string {
    if (config.has('secrets.pip-ss-kv.REDIS_PASSWORD')) {
        return config.get('secrets.pip-ss-kv.REDIS_PASSWORD');
    } else if (process.env.REDIS_LOCAL || process.env.REDIS_MOCK) {
        return '';
    } else {
        throw new Error('A password must be set for non local / mock environments');
    }
}

export function setRedisCredentials(): any {
    return {
        host: process.env.REDIS_HOST ? process.env.REDIS_HOST : config.get('secrets.pip-ss-kv.REDIS_HOST'),
        port: process.env.REDIS_PORT ? process.env.REDIS_PORT : config.get('secrets.pip-ss-kv.REDIS_PORT'),
        password: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : getRedisPassword(),
    };
}

const logger = Logger.getLogger('app');

export let redisClient;
if (process.env.REDIS_MOCK) {
    const redis = require('redis-mock');
    redisClient = redis.createClient();
} else {
    const redisCredentials = setRedisCredentials();
    let connectionString = '';
    if (process.env.REDIS_LOCAL) {
        // for running local dev environment (i.e. 'start:dev' profile)
        connectionString = `redis://:${redisCredentials.password}@${redisCredentials.host}:${redisCredentials.port}`;
    } else {
        // double s is required when using TLS connection (i.e. 'start' profile)
        connectionString = `rediss://:${redisCredentials.password}@${redisCredentials.host}:${redisCredentials.port}`;
    }

    logger.info('Connecting to Redis');
    redisClient = createClient({
        url: connectionString,
        pingInterval: 300000,
        socket: {
            connectTimeout: 10000,
        }
    })

    redisClient.connect()
        .catch(function(error) {
            logger.error('Error connecting to Redis client: ' + error);
        });
}

redisClient.on('connect', () => {
    /* istanbul ignore next */
    if (!process.env.REDIS_SUPPRESS) {
        logger.info('Connected to Redis');
    }
});

redisClient.on('error', error => {
    /* istanbul ignore next */
    if (!process.env.REDIS_SUPPRESS) {
        logger.error('Failed to connect to Redis', error.message);
        logger.info('Attempting to reconnect to Redis');
    }
});

redisClient.on('ready', () => {
    /* istanbul ignore next */
    if (!process.env.REDIS_SUPPRESS) {
        logger.info('Redis ready');
    }
});

redisClient.on('close', () => {
    /* istanbul ignore next */
    if (!process.env.REDIS_SUPPRESS) {
        logger.info('Connection closed');
    }
});
