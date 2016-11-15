// @flow

import stripe from 'stripe';
import type Customer from '../sequelize/models/CustomerModel';
import type Card from '../sequelize/models/CardModel';
import config from '../utils/ConfigUtils';

class Stripe {
  constructor(key: string) {
    this.client = stripe(key);
  }

  createCustomer(customer: Customer) {
    return this.client.customers
      .create({
        description: `Customer for ${customer.email}`,
        source: customer.source,
        email: customer.email,
      })
      .then((result: any): any => result)
      .catch((err: Error) => {
        throw err;
      });
  }

  createSubscription(customer: Customer, plan: string) {
    return this.client.subscriptions
      .create({
        customer: customer.stripeId,
        plan,
      })
      .then((subscription: any): any => subscription)
      .catch((err: Error) => {
        throw err;
      });
  }

  /**
   * Create or update a card for a given user.
   * @param customer
   * @param card
   * @returns {Promise.<T>|Promise}
   */
  createCard(customer: Customer, card: Card) {
    const data = {
      card: {
        exp_month: card.expMonth,
        exp_year: card.expYear,
        number: card.number,
        cvc: card.cvc,
        address_city: card.city,
        address_country: card.country,
        address_line1: card.addressLine1,
        address_line2: card.addressLine2,
        address_state: card.addressState,
        address_zip: card.addressZip,
      },
    };
    let promise;

    if (card.stripeId) {
      promise = this.client
        .customers
        .updateCard(
          customer.id,
          card.stripeId,
          data,
        );
    } else {
      promise = this.client
        .tokens
        .create(data);
    }
    return promise
      .then((res: any): any => res)
      .catch((err: Error) => {
        throw err;
      });
  }
}

export default function () {
  return new Stripe(config.stripe.key);
}
