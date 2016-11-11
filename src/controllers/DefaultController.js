// @flow

import { $Response, $Request, NextFunction } from 'express';
import HttpError from '../errors/HttpError';
import git from 'git-rev';

class DefaultController {
  /**
   * Default endpoint of the application.
   * @param req
   * @param res
   */
  static defaultEndpoint(req: $Request, res: $Response): Promise {
    const env = process.env.NODE_ENV;

    return git.tag((version: string): Function => (
      git.long((str: string): Function => (
        res.send({
          uptime: process.uptime(),
          sha1: str,
          version,
          env,
        })
      ))
    ));
  }

  /**
   * Create sample error.
   * @param req
   * @param res
   * @param next
   */
  static createError(req: $Request, res: $Response, next: NextFunction): NextFunction {
    const err = new HttpError('Sample error');
    err.status = 500;

    return next(err);
  }
}

export default DefaultController;
