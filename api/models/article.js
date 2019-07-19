const Sequelize = require('sequelize');
const db = require('./db.js');

const Article = db.define('article', {
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  title: { type: Sequelize.TEXT },
  slug: { type: Sequelize.TEXT },
  body: { type: Sequelize.TEXT },
  description: { type: Sequelize.TEXT },
  tagList: { type: Sequelize.ARRAY(Sequelize.TEXT) },
  authorId: { type: Sequelize.UUID, allowNull: false },
});

module.exports = { Article };
