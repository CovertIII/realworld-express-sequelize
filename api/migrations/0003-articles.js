module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('articles', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      title: { type: Sequelize.TEXT },
      slug: { type: Sequelize.TEXT, unique: true },
      body: { type: Sequelize.TEXT },
      description: { type: Sequelize.TEXT },
      tagList: { type: Sequelize.ARRAY(Sequelize.TEXT) },
      authorId: {
        type: Sequelize.UUID,
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
    return queryInterface.dropTable('articles');
  }
};
