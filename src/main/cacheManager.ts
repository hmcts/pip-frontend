import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';

export function setRedisCredentials(): any {
  return {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : config.get('secrets.pip-ss-kv.REDIS_HOST'),
    port: process.env.REDIS_PORT ? process.env.REDIS_PORT : config.get('secrets.pip-ss-kv.REDIS_PORT'),
    password: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : config.get('secrets.pip-ss-kv.REDIS_PASSWORD'),
  };
}

const redisCredentials = setRedisCredentials();

const logger = Logger.getLogger('app');
const ioRedis = require('ioredis');
// double s is required when using TLS connection
const connectionString = `rediss://:${redisCredentials.password}@${redisCredentials.host}:${redisCredentials.port}`;
const redisClient = new ioRedis(connectionString, {connectTimeout: 10000});

logger.info('redis env var', redisCredentials.host);
logger.info('redis env port', redisCredentials.port);

redisClient.on('connect', () => {
  logger.info('Connected to Redis', redisClient.status);
});

redisClient.on('ready', () => {
  logger.info('ready to connect', redisClient.status);
});

redisClient.on('error', error => {
  redisClient.quit();
  logger.error('Failed to connect to Redis', error.message);
  logger.error('Failed to connect to Redis status', redisClient.status);
});

redisClient.on('close', () => {
  logger.info('connection closed', redisClient.status);
});

redisClient.on('reconnecting', () => {
  logger.info('trying to reconnect', redisClient.status);
});

redisClient.on('end', () => {
  logger.info('end', redisClient.status);
});

redisClient.on('wait', () => {
  logger.info('waiting', redisClient.status);
});

redisClient.on('status', () => {
  logger.info('status', redisClient.status);
});

redisClient.on('ready', () => {
  logger.info('redis ready');
});

redisClient.on('close', () => {
  logger.info('connection closed');
});

module.exports = {
  redisClient,
  setRedisCredentials,
};
