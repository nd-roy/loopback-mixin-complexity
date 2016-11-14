import log4js from 'log4js';
const logger = log4js.getLogger();
import HttpStatus from 'http-status';
import type { $Response, $Request } from 'express';

// production error handler
// no stacktraces leaked to user
export default function (err: Error, req: $Request, res: $Response) {
  logger.error(err);

  const response: { statusCode: number, message: string, context: any } = {
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
}
