// @flow

import log4js from 'log4js';
import { $Response, $Request, NextFunction } from 'express';
import HttpError from '../errors/HttpError';
import HttpStatus from 'http-status';

const logger = log4js.getLogger();

const errorFallBack = function errorFallBack(
  err: HttpError,
  req: $Request,
  res: $Response,
  next: NextFunction
) {
  logger.error(err);

  const response : { statusCode: number, message: string, context: any } = {
    statusCode: err.statusCode || err.status || HttpStatus.INTERNAL_SERVER_ERROR,
    message: err.message || HttpStatus[err.statusCode],
    context: undefined,
  };

  if (err.context !== undefined) {
    response.context = err.context;
  } else {
    delete response.context;
  }

  res.status(response.statusCode).send(response);
};

export default errorFallBack;
