const Sequelize = require('sequelize');
const db = require('./db.js');

const Comment = db.define('comment', {
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  body: { type: Sequelize.TEXT },
  authorId: { type: Sequelize.UUID, allowNull: false },
  articleId: { type: Sequelize.UUID, allowNull: false },
});

module.exports = { Comment };
