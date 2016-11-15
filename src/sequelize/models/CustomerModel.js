// @flow

/**
 * @param sequelize
 * @param DataTypes
 */
export default function (sequelize: any, DataTypes: any) {
  const Customer = sequelize.define('Customer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    stripeId: { type: DataTypes.STRING, unique: true },
    source: { type: DataTypes.STRING, unique: true },
    qareId: { type: DataTypes.STRING, unique: true },
    email: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  }, {
    tableName: 'customer',
    timestamps: true,
    underscored: true,
    associate: (models) => {
      Customer.hasOne(models.Card);
    },
  });

  return Customer;
}
