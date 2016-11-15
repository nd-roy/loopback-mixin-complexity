// @flow

import passport from 'passport';
import HttpStatus from 'http-status';
import HttpError from '../errors/HttpError';
import type { $Response, $Request, NextFunction } from 'express';
import _ from 'lodash';

import UserHelper from '../sequelize/repositories/CustomerRepository';
import UserSchema from '../sequelize/models/CustomerModel';

class CommonController {
  /**
   * Check if the user is authenticated. Before accessing to a controller.
   */
  static isAuthenticated: mixed = passport.authenticate('kong', {
    session: false,
    failWithError: true,
  });

  /**
   * Check if the user has the role `patient`
   * @param req
   * @param res
   * @param next
   * @returns {Function}
   */
  static isPatient(req: $Request, res: $Response, next: NextFunction): Function {
    return CommonController.hasRole(req, next, 'patient');
  }

  /**
   * Check if the user has the role doctor.
   * @param req
   * @param res
   * @param next
   * @returns {Function}
   */
  static isDoctor(req: $Request, res: $Response, next: NextFunction): Function {
    return CommonController.hasRole(req, next, 'doctor');
  }

  /**
   * Check if the user has the role admin.
   * @param req
   * @param res
   * @param next
   * @returns {Function}
   */
  static isAdmin(req: $Request, res: $Response, next: NextFunction): Function {
    return CommonController.hasRole(req, next, 'admin');
  }

  /**
   * Determine if a user has a specific role.
   *
   * @param req
   * @param next
   * @param role The expected role.
   * @returns {*}
   */
  static hasRole(req: $Request, next: NextFunction, role: string): Function {
    if (req.user && req.user.role === role) {
      return next();
    }
    const error = new HttpError();
    error.statusCode = HttpStatus.FORBIDDEN;
    error.message = `Current user does not have access to role ${role}`;

    return next(error);
  }

  /**
   * Check if the patient id is correct.
   * @param req
   * @param res
   * @param next
   * @returns {Promise|Promise.<T>|*}
   */
  static checkPatient(req: $Request, res: $Response, next: NextFunction): Function {
    const patientId: string = req.body.patientId;

    return UserHelper
      .findById(patientId)
      .then(function findById(user: UserSchema): Function {
        if (!user) {
          const error = new HttpError();
          error.statusCode = HttpStatus.BAD_REQUEST;
          error.message = 'Unknown User';

          return next(error);
        }

        req.qare.model.setPatient(user);

        return next();
      }).catch(function catchError(err: Error): Function {
        return next(err);
      });
  }

  /**
   * Check if the doctor id is correct.
   * @param req
   * @param res
   * @param next
   * @returns {Promise|Promise.<T>|*}
   */
  static checkDoctor(req: $Request, res: $Response, next: NextFunction): Function {
    const doctorId: string = req.body.doctorId;

    return UserHelper
      .findById(doctorId)
      .then(function findById(user: UserSchema): Function {
        if (!user) {
          const error = new HttpError();
          error.statusCode = HttpStatus.BAD_REQUEST;
          error.message = 'Unknown Doctor';

          return next(error);
        }

        req.qare.model.setDoctor(user);

        return next();
      }).catch(function catchError(err: Error): Function {
        return next(err);
      });
  }

  /**
   * Common method to save an object in mongodb.
   *
   * @param req
   * @param res
   * @param next
   */
  static save(req: $Request, res: $Response, next: NextFunction): Function {
    if (!req.qare.model) {
      const error = new HttpError;
      error.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error.message = 'The saved object is undefined.';
      return next(error);
    }

    return req
      .qare
      .model
      .save()
      .then(() => next())
      .catch((err: Error): Function => {
        const error = new HttpError;

        error.message = err.message;
        if (err.name === 'ValidationError') {
          error.statusCode = HttpStatus.NOT_ACCEPTABLE;
        } else {
          error.statusCode = HttpStatus.CONFLICT;
        }

        if (err.errors) {
          error.context = _.map(err.errors, function parseErrors(row: {}): {} {
            return {
              field: (row.properties ? row.properties.path : (row.path || 'Undefined')),
              description: (row.message || null),
            };
          });
        }

        return next(error);
      });
  }

  /**
   * Render a mongoose object.
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  static render(req: $Request, res: $Response, next: NextFunction): Function {
    if (!req.qare.model) {
      const error = new HttpError;
      error.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error.message = 'The saved object is undefined.';
      return next(error);
    }

    return res.json(req.qare.model);
  }
}

export default CommonController;
