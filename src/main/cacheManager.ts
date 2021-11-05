import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('app');

const ioRedis = require('ioredis');
const redisClient = new ioRedis();

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.on('error', error => {
  redisClient.quit();
  logger.error('Failed to connect to Redis', error.message);
});

module.exports = {
  redisClient,
};

