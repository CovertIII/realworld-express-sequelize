const { User } = require('./user.js');
const { Passport } = require('./passport.js');
const { Follow } = require('./follow.js');
const { Article } = require('./article.js');
const { Comment } = require('./comment.js');
const { Favorite } = require('./favorite.js');
const { FavoriteCount } = require('./favoriteCount.js');

const init = () => {
  User.hasOne(Passport, { foreignKey: 'userId' });
  User.belongsToMany(User, { as: 'followers', through: Follow, foreignKey: 'userId' });
  User.belongsToMany(User, { as: 'follows', through: Follow, foreignKey: 'followerId' });

  Article.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
  Article.hasOne(FavoriteCount, { foreignKey: 'articleId', as: 'favoriteCount' });

  Article.belongsToMany(User, { as: 'users', through: Favorite, foreignKey: 'articleId' });
  User.belongsToMany(Article, { as: 'favorites', through: Favorite, foreignKey: 'userId' });
  Favorite.belongsTo(Article, { foreignKey: 'articleId' });
  Favorite.belongsTo(User, { foreignKey: 'userId' });

  Comment.belongsTo(Article, { foreignKey: 'articleId'});
  Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
};

module.exports = { init };
