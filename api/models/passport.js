const Sequelize = require('sequelize');
const db = require('./db.js');

const Passport = db.define('passport', {
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  userId: { type: Sequelize.UUID, allowNull: false },
  type: { type: Sequelize.STRING, allowNull: false }, //password, or reset token
  value: { type: Sequelize.STRING, allowNull: false },
  expires: { type: Sequelize.DATE }
});

module.exports = { Passport };
