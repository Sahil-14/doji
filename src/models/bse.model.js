
module.exports = (sequelize, Sequelize) => {
  const Bse = sequelize.define("bse", {
    security_code: {
      primaryKey: true,
      type: Sequelize.STRING,
      allowNull: false
    },
    issuer_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    security_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    security_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    group: {
      type: Sequelize.STRING,
    },
    face_value: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isin_no: {
      type: Sequelize.STRING,
      allowNull: false
    },
    industry: {
      type: Sequelize.STRING,
      allowNull: false
    },
    instrument: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sector_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    industry_new_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    igroup_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isubgroup_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Bse;
};
