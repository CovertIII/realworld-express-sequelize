module.exports = {
  up: (queryInterface) => {
    const query = `CREATE VIEW "favorite_counts" AS SELECT "articleId", COUNT(*) count
    FROM favorites
    GROUP BY "articleId"`;
    return queryInterface.sequelize.query(query);
  },
  down: () => {
  }
};
