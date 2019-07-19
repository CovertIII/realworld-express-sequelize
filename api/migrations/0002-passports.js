module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('passports', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userId: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'id' },
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      type: { type: Sequelize.STRING, allowNull: false } ,
      value: { type: Sequelize.STRING, allowNull: false },
      expires: { type: Sequelize.DATE },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('passports');
  }
};
