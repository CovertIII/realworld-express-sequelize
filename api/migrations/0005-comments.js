module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comments', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      body: { type: Sequelize.TEXT },
      authorId: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'id' },
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      articleId: {
        type: Sequelize.UUID,
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
    return queryInterface.dropTable('comments');
  }
};
