// @flow

import { $Response, $Request, NextFunction } from 'express';
import db from '../sequelize/Sequelize';
import CustomerRepository from '../sequelize/repositories/CustomerRepository';
import CardRepository from '../sequelize/repositories/CardRepository';
import Stripe from '../stripe/Stripe';
import CommonController from './CommonController';

class CustomerController extends CommonController {
  /**
   * Create of find the current customer
   * @param req
   * @param res
   */
  static create(req: $Request, res: $Response, next: NextFunction): Function {
    const user = req.user;

    return CustomerRepository
      .findOneBy({
        qareId: user.id,
      })
      .then((customer) => {
        if (!customer) {
          return db.Customer.build({
            qareId: user.id,
            email: user.email,
            source: req.body.source,
          }).save();
        }

        return customer;
      })
      .then((customer) => {
        req.qare.model = customer;
        return next();
      })
      .catch((error: Error) => next(error));
  }

  static setStripeId(req: $Request, res: $Response, next: NextFunction): Function {
    const customer = req.qare.model;

    if (!customer.stripeId) {
      return Stripe()
        .createCustomer(customer)
        .then((result) => {
          customer.stripeId = result.id;

          return customer.save();
        })
        .then(() => (next()))
        .catch((error: Error) => next(error));
    }
    return next();
  }

  static billingInfo(req: $Request, res: $Response, next: NextFunction): Function {
    const body = req.body;
    const customer = req.qare.model;

    return CardRepository
      .findOneBy({
        customer_id: customer.id,
      })
      .then((card) => {
        if (card) {
          throw new Error('A card is already set for the customer');
        }
        card = db.Card.build();
        card.city = body.city;
        card.country = body.country;
        card.addressLine1 = body.addressLine1;
        card.addressLine2 = body.addressLine2;
        card.addressState = body.addressState;
        card.addressZip = body.addressZip;
        card.brand = body.brand;
        card.cvc = body.cvc;
        card.number = body.number;
        card.expMonth = body.expMonth;
        card.expYear = body.expYear;
        card.customer_id = customer.id;

        return card.save();
      })
      .then((card) => (
        Stripe()
          .createCard(customer, card)
          .then((result) => {
            card.stripeId = result.id;

            return card.save();
          })
      ))
      .then((card) => res.json(card))
      .catch((error: Error) => next(error));
  }
}

export default CustomerController;
