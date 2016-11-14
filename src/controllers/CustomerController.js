// @flow

import { $Response, $Request, NextFunction } from 'express';
import db from '../sequelize/Sequelize';
import CustomerRepository from '../sequelize/repositories/CustomerRepository';
import Stripe from '../stripe/Stripe';

class CustomerController {
  /**
   * Create of find the current customer
   * @param req
   * @param res
   */
  static create(req: $Request, res: $Response, next: NextFunction): Function {
    const body = req.body;

    CustomerRepository
      .findOneBy({
        email: body.email,
      })
      .then((customer) => {
        if (!customer) {
          return db.Customer.build({
            email: body.email,
          }).save();
        }

        return customer;
      })
      .then((customer) => {
        req.qare.model = customer;
      });

    return next();
  }

  static setStripeId(req: $Request, res: $Response, next: NextFunction): Function {
    const customer = req.qare.model;

    if (!customer.stripeId) {
      return Stripe()
        .createCustomer(customer.email)
        .then((result) => {
          customer.stripeId = result.stripeId;

          return next();
        });
    }
    return next();
  }

  static billingInfo(req: $Request, res: $Response, next: NextFunction): Function {
    const body = req.body;

    return db
      .Card
      .build({
        customer: req.qare.model,
        email: body.email,
      })
      .save();

    return next();
  }
}

export default CustomerController;
