//import { Logger } from '@hmcts/nodejs-logging';
import * as fs from 'fs';
import path from 'path';
// import config from 'config';
//
// const redisPortalCredential = {
//   host: config.get('secrets.pip-ss-kv.REDIS_HOST'),
//   port: config.get('secrets.pip-ss-kv.REDIS_PORT'),
//   password: config.get('secrets.pip-ss-kv.REDIS_PASSWORD'),
// };

const certFile = fs.readFileSync(path.resolve(__dirname, 'resources/localhost-ssl/localhost.crt'), 'utf-8');
const keyFile = fs.readFileSync(path.resolve(__dirname, 'resources/localhost-ssl/localhost.key'), 'utf-8');
const redisPortalTest = {
  host: 'pip-stg.redis.cache.windows.net',
  port: '6380',
  password: 'Q0NiIKFnZ31KgULsqHaxspTVXJ9wq8X7GAzCaFqTK2U=',
  tls: {
    // Refer to `tls.connect()` section in
    // https://nodejs.org/api/tls.html
    // for all supported options
    cert: certFile,
    key: keyFile,
  },
};
//const logger = Logger.getLogger('app');
const connectionTest = redisPortalTest;

// const connection = process.env.NODE_ENV === 'production' ?
//   redisPortalCredential
//   : {};
//const bluebird = require('bluebird');
const ioRedis = require('redis');

// Convert Redis client API to use promises, to make it usable with async/await syntax
// bluebird.promisifyAll(ioRedis.RedisClient.prototype);
// bluebird.promisifyAll(ioRedis.Multi.prototype);

//const redisClient = ioRedis.createClient(connectionTest);
const redisClient = ioRedis.createClient(connectionTest.port, connectionTest.host,
  {'auth_pass': connectionTest.password, tls: {servername: connectionTest.host}});
//const redisClient = new ioRedis('rediss://Q0NiIKFnZ31KgULsqHaxspTVXJ9wq8X7GAzCaFqTK2U=@pip-stg.redis.cache.windows.net:6380');

// redisClient.on('connect', () => {
//   logger.info('Connected to Redis');
// });
//
// redisClient.on('error', error => {
//   redisClient.quit();
//   logger.error('Failed to connect to Redis', error.message);
// });

module.exports = {
  redisClient,
};

