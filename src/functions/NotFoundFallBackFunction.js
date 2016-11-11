// @flow

import { $Response, $Request, NextFunction } from 'express';
import HttpError from '../errors/HttpError';
import HttpStatus from 'http-status';

const fallback404 = function fallback404(req: $Request, res: $Response, next: NextFunction) {
  const error404 = new HttpError();

  error404.setStatusCode(HttpStatus.NOT_FOUND);
  error404.message = `Route ${req.originalUrl} not found.`;

  next(error404);
};

export default fallback404;
