// @flow

import stripe from 'stripe';
import type Customer from '../sequelize/models/CustomerModel';
import type Card from '../sequelize/models/CardModel';

class Stripe {
  constructor(key) {
    this.client = stripe(key);
  }

  createCustomer(email: string, source: string) {
    return new Promise((resolve: any, reject: any) => {
      this.client.customers.create({
        description: `Customer for ${email}`,
        source: "source", // obtained with Stripe.js
        email,
      }, function (err, customer) {
        if (err) {
          return reject(err);
        }

        return resolve(customer);
      });
    });
  }

  createSubscription(customer: Customer, plan: string) {
    return new Promise((resolve: any, reject: any) => {
      this.client.subscriptions.create({
          customer: customer.stripeId,
          plan
        }, function (err, subscription) {
          if (err) {
            return reject(err);
          }

          return resolve(subscription);
        }
      );
    });
  }

  createCard(customer: Customer, card: Card) {
    return new Promise((resolve: any, reject: any) => {
      this.client.subscriptions.create({
          customer: customer.stripeId,
          address_city: card.city,
          address_country: card.country,
          address_line1: card.addressLine1,
          address_line2: card.addressLine2,
          address_state: card.addressState,
          address_zip: card.addressZip,
          brand: card.brand,
          country: card.country,
          number: card.brand,
          exp_month: card.expMonth,
          exp_year: card.expYear,
          number: card.number,
          object: 'card',
        }, function (err, response) {
          if (err) {
            return reject(err);
          }

          card.stripeId = response.id;

          return resolve(card);
        }
      );
    });
  }
}

export default Stripe;