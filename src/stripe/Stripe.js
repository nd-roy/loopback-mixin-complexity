// @flow

import stripe from 'stripe';
import type Customer from '../sequelize/models/CustomerModel';
import type Card from '../sequelize/models/CardModel';
import config from '../utils/ConfigUtils';

class Stripe {
  constructor(key: string) {
    this.client = stripe(key);
  }

  createCustomer(email: string, source: string) {
    this.client.customers
      .create({
        description: `Customer for ${email}`,
        source: 'source', // obtained with Stripe.js
        email,
      })
      .then((customer: any): any => customer)
      .catch((err: Error) => {
        throw err;
      });
  }

  createSubscription(customer: Customer, plan: string) {
    this.client.subscriptions
      .create({
        customer: customer.stripeId,
        plan,
      })
      .then((subscription: any): any => subscription)
      .catch((err: Error) => {
        throw err;
      });
  }

  createCard(customer: Customer, card: Card) {
    this.client.subscriptions
      .create({
        customer: customer.stripeId,
        address_city: card.city,
        address_country: card.country,
        address_line1: card.addressLine1,
        address_line2: card.addressLine2,
        address_state: card.addressState,
        address_zip: card.addressZip,
        country: card.country,
        brand: card.brand,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        number: card.number,
        object: 'card',
      })
      .then((res: any): any => res)
      .catch((err: Error) => {
        throw err;
      });
  }
}

export default function () {
  return new Stripe(config.stripeId);
}
