// @flow

import { Strategy } from 'passport-custom';
import { Base64 } from 'js-base64';
import log4js from 'log4js';

const customStrategy = new Strategy((req, done: Function) => {
  const logger = log4js.getLogger('[passport:kong]');

  logger.info('Attempt to authenticate the user.');
  const headers = req.headers;

  const encodedUser = headers['x-authenticated-userid'];
  if (encodedUser) {
    logger.info('Token exists');
    const user = JSON.parse(Base64.decode(encodedUser));
    logger.debug('User authenticated: ', typeof user);
    return done(null, user);
  }

  logger.info('Token does not exist.');

  return done(new Error('You should be authenticated.'));
});

export default customStrategy;
