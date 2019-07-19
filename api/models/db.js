const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const operatorsAliases = {
  $ne: Op.ne,
  $in: Op.in,
  $contains: Op.contains
};

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' ? false : console.log ,
  operatorsAliases,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = db;
