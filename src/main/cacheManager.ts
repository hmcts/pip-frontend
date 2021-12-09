import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';

const redisPortalCredential = {
	host: config.get('secrets.pip-ss-kv.REDIS_HOST'),
	port: config.get('secrets.pip-ss-kv.REDIS_PORT'),
	password: config.get('secrets.pip-ss-kv.REDIS_PASSWORD'),
};

const logger = Logger.getLogger('app');
const connectionTest = redisPortalCredential;

// const connection = process.env.NODE_ENV === 'production' ?
//   redisPortalCredential
//   : {};

const ioRedis = require('ioredis');
const redisClient = ioRedis.createClient(connectionTest);

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