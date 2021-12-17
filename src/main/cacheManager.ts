import { Logger } from '@hmcts/nodejs-logging';
// import config from 'config';

// const redisCredentials = {
//   host: config.get('secrets.pip-ss-kv.REDIS_HOST'),
//   port: config.get('secrets.pip-ss-kv.REDIS_PORT'),
//   password: config.get('secrets.pip-ss-kv.REDIS_PASSWORD'),
// };

const logger = Logger.getLogger('app');
const ioRedis = require('ioredis');
// double s is required when using TLS connection
// const connectionString = `rediss://:${redisCredentials.password}@${redisCredentials.host}:${redisCredentials.port}`;
const connectionString = `rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
const redisClient = new ioRedis(connectionString);

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
