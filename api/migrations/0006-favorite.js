module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('favorites', {
      userId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      articleId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: 'articles', key: 'id' },
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('favorites');
  }
};
