const Sequelize = require('sequelize');
const db = require('./db.js');

const Follow = db.define('follow', {
  userId: { type: Sequelize.UUID, primaryKey: true},
  followerId: { type: Sequelize.UUID, primaryKey: true}
});

module.exports = { Follow };
