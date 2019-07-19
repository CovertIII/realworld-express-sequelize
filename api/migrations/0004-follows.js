module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('follows', {
      userId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      followerId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('follows');
  }
};
