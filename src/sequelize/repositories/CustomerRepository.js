// @flow

import db from '../Sequelize';

export default class CustomerRepository {
  /**
   * @param email
   * @returns {Promise}
   */
  static exists(email: string): Function {
    return db
      .Customer
      .findOne({
        where: {
          email,
        }
      })
      .then((customerFromDb: db.Customer) => {
        if (!customerFromDb) {
          return false;
        }

        return true;
      });
  }

  /**
   * @param conditions
   * @returns {Promise}
   */
  static findOneBy(conditions: {}): Function {
    return db.Customer.findOne({
      where: conditions,
      include: [db.Transaction, db.Subscription, db.Card],
    })
      .then((customerFromDb: db.Customer) => {
        if (!customerFromDb) {
          return false;
        }

        return customerFromDb;
      });
  }
}