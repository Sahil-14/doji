
module.exports = (sequelize, Sequelize) => {
  const BseTrendlyneMapping = sequelize.define("bse_trendlyne_mapping", {
    bse_security_code: {
      primaryKey: true,
      type: Sequelize.STRING,
      allowNull: false
    },
    trendlyne_stock_id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false
    }

  });
  return BseTrendlyneMapping;
};
