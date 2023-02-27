import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';

export function setRedisCredentials(): any {
    return {
        host: process.env.REDIS_HOST ? process.env.REDIS_HOST : config.get('secrets.pip-ss-kv.REDIS_HOST'),
        port: process.env.REDIS_PORT ? process.env.REDIS_PORT : config.get('secrets.pip-ss-kv.REDIS_PORT'),
        password: process.env.REDIS_PASSWORD
            ? process.env.REDIS_PASSWORD
            : config.get('secrets.pip-ss-kv.REDIS_PASSWORD'),
    };
}

const redisCredentials = setRedisCredentials();

const logger = Logger.getLogger('app');
const ioRedis = require('ioredis');

let connectionString = '';
if (process.env.REDIS_LOCAL) {
    // for running local dev environment (i.e. 'start:dev' profile)
    connectionString = `redis://:${redisCredentials.password}@${redisCredentials.host}:${redisCredentials.port}`;
} else {
    // double s is required when using TLS connection (i.e. 'start' profile)
    connectionString = `rediss://:${redisCredentials.password}@${redisCredentials.host}:${redisCredentials.port}`;
}
const redisClient = new ioRedis(connectionString, { connectTimeout: 10000 });

if (!process.env.REDIS_SUPPRESS) {
    logger.info('redis env var', redisCredentials.host);
    logger.info('redis env port', redisCredentials.port);
}
redisClient.on('connect', () => {
    if (!process.env.REDIS_SUPPRESS) {
        logger.info('Connected to Redis');
    }
});

redisClient.on('error', error => {
    if (!process.env.REDIS_SUPPRESS) {
        logger.error('Failed to connect to Redis', error.message);
        logger.info('Attempting to reconnect to Redis');
    }
});

redisClient.on('ready', () => {
    if (!process.env.REDIS_SUPPRESS) {
        logger.info('redis ready');
    }
});

redisClient.on('close', () => {
    if (!process.env.REDIS_SUPPRESS) {
        logger.info('connection closed');
    }
});

module.exports = {
    redisClient,
    setRedisCredentials,
};
