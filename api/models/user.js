const Sequelize = require('sequelize');
const db = require('./db.js');

const User = db.define('user', {
  id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  email: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      isEmail:true
    },
    unique: {
      args: true,
      msg: 'That email address has already been registered'
    }
  },
  username: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: {
      args: true,
      msg: 'That username has already been registered'
    }
  },
  bio: { type: Sequelize.TEXT },
  image: { type: Sequelize.TEXT }
});

module.exports = { User };
