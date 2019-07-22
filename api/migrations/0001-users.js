module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      username: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
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
