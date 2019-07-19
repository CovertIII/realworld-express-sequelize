module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
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
      image: { type: Sequelize.TEXT },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('users');
  }
};
