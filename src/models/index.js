const dbConfig = require("../config/db.config.js");
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.bse = require("./bse.model")(sequelize, Sequelize);
db.bse.sync();

db.nse = require("./nse.model.js")(sequelize, Sequelize);
db.nse.sync()

db.nse_smo = require("./nse_sme.model.js")(sequelize, Sequelize);
db.nse_smo.sync()

db.bse_trendlyne_mapping = require("./bse_trendlyne_mapping.model.js")(sequelize, Sequelize);
db.bse_trendlyne_mapping.sync();

db.nse_trendlyne_mapping = require("./nse_trendlyne_mapping.model.js")(sequelize, Sequelize);
db.nse_trendlyne_mapping.sync();




module.exports = db;