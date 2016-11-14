import log4js from 'log4js';
const logger = log4js.getLogger();
import { $Response, $Request, NextFunction } from 'express';

// catch 404 and forward to error handler
export default function (req: $Request, res: $Response, next: NextFunction) {
  const err = new Error('Not Found');
  err.status = 404;
  logger.error(err.message);
  next(err);
}
