// @flow

/**
 * @param sequelize
 * @param DataTypes
 */
export default function (sequelize, DataTypes) {
  const Customer = sequelize.define('Customer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    stripeId: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
  }, {
    tableName: 'customer',
    timestamps: true,
    underscored: true,
  });

  return Customer;
}