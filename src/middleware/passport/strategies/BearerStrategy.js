// @flow

import { Strategy } from 'passport-http-bearer';

import UserRepository from '../../../sequelize/repositories/CustomerRepository';
import Redis from '../../utils/Redis';
import HttpError from '../../errors/HttpError';
import HttpStatus from 'http-status';
import UserSchema from '../../../sequelize/models/CustomerModel';

const tokenLife = 60 * 60 * 24 * 2;

const bearerStrategy = new Strategy(
  function bearerStrategy(accessToken : string, done : Function) {
    const TokenBase = Redis.getToken();
    TokenBase
      .get(accessToken, function fetchAccessToken(err : Error, record : string) : Function {
        if (err) {
          return done(err);
        }

        const error = new HttpError();
        if (!record) {
          error.setStatusCode(HttpStatus.FORBIDDEN);
          error.message = 'Token not found';

          return done(error);
        }

        const token = JSON.parse(record);
        if (Math.round((Date.now() - token.created) / 1000) > tokenLife) {
          TokenBase.del(accessToken);

          error.setStatusCode(HttpStatus.BAD_REQUEST);
          error.message = 'Token expired';

          return done(error);
        }

        return UserRepository
          .findById(token.userId)
          .then(function findById(user : UserSchema) : Function {
            if (!user) {
              error.setStatusCode(HttpStatus.FORBIDDEN);
              error.message = 'Unknown User';

              return done(error);
            }

            // Success
            return done(null, user, { scope: user.roles ? user.roles.join(', ') : 'user' });
          })
          .catch(function catchError(findByIdError : Error) : Function {
            return done(findByIdError);
          });
      });
  });


export default bearerStrategy;
