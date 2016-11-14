// @flow

import Customer from './CustomerModel';

/**
 * @param sequelize
 * @param DataTypes
 */
export default function (sequelize: any, DataTypes: any) {
  const Card = sequelize.define('Card', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    stripeId: { type: DataTypes.STRING, unique: true, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    addressLine1: { type: DataTypes.STRING, allowNull: false },
    addressLine2: { type: DataTypes.STRING },
    addressState: { type: DataTypes.STRING },
    addressZip: { type: DataTypes.STRING, allowNull: false },
    brand: { type: DataTypes.STRING, allowNull: false },
    cardHash: { type: DataTypes.STRING, allowNull: false },
    cvc: { type: DataTypes.VIRTUAL },
    number: { type: DataTypes.VIRTUAL },
    expMonth: { type: DataTypes.VIRTUAL },
    expYear: { type: DataTypes.VIRTUAL },
  }, {
    tableName: 'card',
    timestamps: true,
    underscored: true,
  });

  // Card.belongsTo(Customer);

  return Card;
}
