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
    const customer = req.qare.model;

    return db
      .Card
      .findOrCreate({
        where: {
          customer: req.qare.model,
        },
      })
      .spread((card, created) => {
        card.city = body.city;
        card.country = body.contry;
        card.addressLine1 = body.addressLine1;
        card.addressLine2 = body.addressLine2;
        card.addressState = body.addressState;
        card.addressZip = body.addressZip;
        card.brand = body.brand;
        card.cvc = body.cvc;
        card.number = body.number;
        card.expMonth = body.expMonth;
        card.expYear = body.expYear;

        return card.save();
      })
      .then((card) => (
        Stripe()
          .createCard(customer, card)
          .then((result) => {
            card.stripeId = result.stripeId;

            return card.save();
          })
      ))
      .then(() => next());
  }
}

export default CustomerController;
