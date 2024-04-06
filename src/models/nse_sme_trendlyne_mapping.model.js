
module.exports = (sequelize, Sequelize) => {
  const NseSmeTrendlyneMapping = sequelize.define("nse_sme_trendlyne_mapping", {
    nse_symbol: {
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
  return NseSmeTrendlyneMapping;
};
