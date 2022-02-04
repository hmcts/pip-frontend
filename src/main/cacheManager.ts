import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';

const redisCredentials = {
  /* istanbul ignore next */
  host: (process.env.REDIS_HOST) ? process.env.REDIS_HOST : config.get('secrets.pip-ss-kv.REDIS_HOST'),
  /* istanbul ignore next */
  port: (process.env.REDIS_PORT) ? process.env.REDIS_PORT :config.get('secrets.pip-ss-kv.REDIS_PORT'),
  /* istanbul ignore next */
  password: (process.env.REDIS_PASSWORD) ? process.env.REDIS_PASSWORD :config.get('secrets.pip-ss-kv.REDIS_PASSWORD'),
};

const logger = Logger.getLogger('app');
const ioRedis = require('ioredis');
// double s is required when using TLS connection
const connectionString = `rediss://:${redisCredentials.password}@${redisCredentials.host}:${redisCredentials.port}`;
const redisClient = new ioRedis(connectionString);

logger.info('redis env var', redisCredentials.host);
logger.info('redis env port', redisCredentials.port);

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
