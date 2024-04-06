
module.exports = (sequelize, Sequelize) => {
  const NseSme = sequelize.define("nse_sme", {
    symbol: {
      primaryKey: true,
      type: Sequelize.STRING,
      allowNull: false
    },
    compony_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    series: {
      type: Sequelize.STRING,
      allowNull: false
    },
    date_of_listing: {
      type: Sequelize.STRING,
      allowNull: false
    },
    paid_up_value: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    market_lot: {
      type: Sequelize.STRING,
      allowNull: true

    },
    isni_no: {
      type: Sequelize.STRING,
      allowNull: false
    },
    face_value: {
      type: Sequelize.STRING,
      allowNull: false
    }

  });

  return NseSme;
};
