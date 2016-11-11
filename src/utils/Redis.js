// @flow

import config from '../utils/ConfigUtils';
import redis from 'redis';
import log4js from 'log4js';

const logger = log4js.getLogger();
const properties = config.getConfig();


class Redis {
  static getToken = () : any => {
    const tokenBase = redis.createClient(properties.redis.post, properties.redis.host);

    tokenBase.on('connect', () => {
      logger.info('Connection to redis `token` established');
    });

    return tokenBase;
  }
}

export default Redis;
