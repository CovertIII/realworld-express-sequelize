const R = require('ramda');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../models/db.js');
const marked = require('marked');
const { Article } = require('../models/article.js');
const { Comment } = require('../models/comment.js');
const { User } = require('../models/user.js');
const { Follow } = require('../models/follow.js');
const { Favorite } = require('../models/favorite.js');
const { FavoriteCount } = require('../models/favoriteCount.js');
const slugify = require('slug');

const createArticle = ({
  userId,
  article = {}
} = {}) => {
  const slug = (slugify(article.title).slice(0, 30) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)).toLowerCase();
  return Article.create({...article, slug, authorId: userId}).then(result => {
    return getArticle({articleId: result.id});
  });
};

const getDefaultOptions = currentUserId => {
  const include = [
    { model: User, as: 'author' },
    { model: FavoriteCount, as: 'favoriteCount', required: false },
    currentUserId && {
      model: User,
      as: 'users',
      where: { id: currentUserId },
      required: false
    }
  ].filter( i => i);
  return { include };
};

const transformArticle = R.pipe(
  article => {
    if(article && article.toJSON){
      return article;
    }
    const error = new Error('The article does not exist.');
    error.status = 404;
    throw error;
  },
  article => article.toJSON(),
  article => R.assoc('favorited', R.pathOr(0, ['users','length'], article) > 0, article),
  article => R.assoc('favoritesCount', Number(R.pathOr(0, ['favoriteCount','count'], article)), article),
  //TODO: XSS Vulernability here - filter the input
  article => R.assoc('htmlBody', marked(article.body || ''), article),
  R.omit(['users', 'favoriteCount'])
);

const getArticle = ({
  currentUserId,
  articleId,
  slug
}) => {
  const where = articleId ? { id: articleId } : { slug };
  const defaultOptions = getDefaultOptions(currentUserId);
  return Article.findOne({
    ...defaultOptions,
    where
  }).then(R.pipe(
    transformArticle,
    article => ({article})
  ));
};

const getFeed = ({
  currentUserId
}) => {
  const defaultOptions = getDefaultOptions(currentUserId);
  const include = defaultOptions.include.concat([{
    model: Follow,
    as: 'followers',
    where: { followerId: currentUserId }
  }]);

  return Article.findAndCountAll({
    include,
    order: [[
      'createdAt',
      'DESC'
    ]]
  }).then(({count, rows}) => {
    return {
      articles: rows.map(transformArticle),
      articlesCount: count
    };
  });
};

const getArticlesList = ({
  currentUserId,
  username,
  favorited,
  tag,
  orderBy,
  orderDirection
} = {}) => {
  const defaultOptions = getDefaultOptions(currentUserId);
  if(favorited){
    return Favorite.findAndCountAll({
      include: [
        {
          model: Article,
          include: defaultOptions.include
        },
        {
          model: User,
          where: { username: favorited }
        }
      ]
    }).then(({count, rows}) => {
      return {
        articlesCount: count,
        articles: rows.map(R.pipe(
          R.prop('article'),
          transformArticle
        ))
      };
    });
  }

  const order = orderBy ? [[
    orderBy,
    orderDirection
  ]] : undefined;

  const where = Object.assign({},
    username ? { '$author.username$': username } : {},
    tag ? {tagList: { [Op.contains]: [tag]}} : {}
  );

  const options = {
    ...defaultOptions,
    where,
    order
  };

  return Article.findAndCountAll(options).then(({count, rows}) => {
    return {
      articles: rows.map(transformArticle),
      articlesCount: count
    };
  });
};

const updateArticle = ({slug, body, currentUserId}) => {
  return getArticle({slug, currentUserId}).then(({article}) => {
    if(article.authorId !== currentUserId){
      const error = new Error('You do not have permission to edit this article');
      error.status = 403;
      throw error;
    }
    return Article.update(R.omit(['id', 'authorId', 'slug'], body), { where: { slug: String(slug) }} );
  }).then( () => {
    return getArticle({slug, currentUserId});
  });
};

const deleteArticle = ({slug, currentUserId}) => {
  return getArticle({slug, currentUserId}).then(({article}) => {
    if(article.authorId !== currentUserId){
      const error = new Error('You do not have permission to delete this article');
      error.status = 403;
      throw error;
    }
    return Article.destroy({ where: { slug: String(slug) }}).then( () => {
      return { article};
    });
  });
};

const getAllTags = () => {
  const query = 'SELECT DISTINCT unnest("article"."tagList") "tags" FROM "articles" AS "article"';
  return db.query(query, { type: db.QueryTypes.SELECT}).then(result => {
    return R.pipe(
      R.map(R.prop('tags')),
      tags => ({ tags })
    )(result);
  });
};

const createComment = ({
  currentUserId,
  slug,
  comment
}) => {
  return getArticle({slug}).then(({article}) => {
    return Comment.create({
      ...comment,
      authorId: currentUserId,
      articleId: article.id
    }).then( comment => {
      return Comment.findOne({
        where: {id: comment.id},
        include: [{
          model: User,
          as: 'author'
        }]
      });
    }).then( comment => ({
      comment
    }));
  });
};

const getComments = ({slug}) => {
  return getArticle({slug}).then(({article}) => {
    return Comment.findAll({
      where:{ articleId: article.id },
      include: [{
        model: User,
        as: 'author'
      }],
      order: [[
        'createdAt',
        'DESC'
      ]]
    }).then( comments => ({
      comments
    }));
  });
};

const deleteComment = ({commentId, currentUserId}) => {
  return Comment.findOne({where: {id: commentId}}).then( comment => {
    if(comment.authorId !== currentUserId){
      const error = new Error('You do not have permission to delete this comment.');
      error.status = 403;
      throw error;
    }
    return Comment.destroy({
      where:{id: commentId},
    });
  });
};

const favoriteArticle = ({
  slug,
  currentUserId
}) => {
  return getArticle({slug, currentUserId}).then(({article}) => {
    if(article.favorited){
      return { article };
    }
    return Favorite.create({
      userId: currentUserId,
      articleId: article.id
    }).then(() => {
      return getArticle({slug, currentUserId});
    });
  });
};

const unfavoriteArticle = ({
  slug,
  currentUserId
}) => {
  return getArticle({slug, currentUserId}).then(({article}) => {
    if(!article.favorited){
      return { article };
    }
    return Favorite.destroy({
      where: {
        userId: currentUserId,
        articleId: article.id
      }
    }).then(() => {
      return getArticle({slug, currentUserId});
    });
  });
};


module.exports = {
  createArticle,
  getArticlesList,
  getFeed,
  getArticle,
  updateArticle,
  deleteArticle,
  getAllTags,
  createComment,
  getComments,
  deleteComment,
  favoriteArticle,
  unfavoriteArticle
};

