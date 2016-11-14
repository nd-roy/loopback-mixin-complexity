// @flow

import config from '../utils/ConfigUtils';
import redis from 'redis';
import log4js from 'log4js';

const logger = log4js.getLogger();

class Redis {
  static getToken = (): any => {
    const tokenBase = redis.createClient(config.redis.post, config.redis.host);

    tokenBase.on('connect', () => {
      logger.info('Connection to redis `token` established');
    });

    return tokenBase;
  }
}

export default Redis;
