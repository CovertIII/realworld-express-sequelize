const Sequelize = require('sequelize');
const db = require('./db.js');

//This is a view
const FavoriteCount = db.define('favorite_count', {
  articleId: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  count: { type: Sequelize.INTEGER }
}, { timestamps: false });

module.exports = { FavoriteCount };
