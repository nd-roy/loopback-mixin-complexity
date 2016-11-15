// @flow

import db from '../Sequelize';

export default class CardRepository {
  /**
   * @param conditions
   * @returns {Promise}
   */
  static findOneBy(conditions: {}): Function {
    return db.Card.findOne({
      where: conditions,
    })
      .then((cardFromDb: db.Card) => {
        if (!cardFromDb) {
          return false;
        }

        return cardFromDb;
      });
  }
}
