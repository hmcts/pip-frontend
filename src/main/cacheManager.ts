import { Logger } from '@hmcts/nodejs-logging';
const { promisify } = require('util');

const logger = Logger.getLogger('app');

const ioRedis = require('ioredis');
const redisClient = new ioRedis();

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.on('error', error => {
  logger.error('Failed to connect to Redis', error.message);
});

const cacheGet = promisify(redisClient.get).bind(redisClient);
const cacheSet = promisify(redisClient.set).bind(redisClient);

module.exports = {
  redisClient,
  cacheGet,
  cacheSet,
};

