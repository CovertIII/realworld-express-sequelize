const Sequelize = require('sequelize');
const db = require('./db.js');

const Favorite = db.define('favorite', {
  userId: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  articleId: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }
});

module.exports = { Favorite };
