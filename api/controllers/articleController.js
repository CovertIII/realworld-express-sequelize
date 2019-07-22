const { wrap } = require('../middleware/error-middleware.js');
const { requireUserMiddleware } = require('../middleware/authenticate-middleware.js');
const {
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
} = require('../services/articleService.js');
const { path } = require('ramda');

const init = async router => {
  router.post('/articles', requireUserMiddleware, wrap((req, res) => {
    const { article } = req.body;
    const userId = req.user.id;
    return createArticle({article, userId}).then( result => {
      return res.json(result);
    });
  }));

  router.get('/articles', wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return getArticlesList({
      currentUserId: userId,
      username: req.query.author,
      tag: req.query.tag,
      favorited: req.query.favorited,
    }).then( result => {
      return res.json(result);
    });
  }));

  router.get('/articles/feed', wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return getFeed({
      currentUserId: userId
    }).then( result => {
      return res.json(result);
    });
  }));

  router.get('/articles/:slug', wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return getArticle({
      currentUserId: userId,
      slug: req.params.slug
    }).then( result => {
      return res.json(result);
    });
  }));

  router.put('/articles/:slug', requireUserMiddleware, wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return updateArticle({
      article: req.body.article,
      slug: req.params.slug,
      currentUserId: userId
    }).then( result => {
      return res.json(result);
    });
  }));

  router.delete('/articles/:slug', requireUserMiddleware, wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return deleteArticle({
      slug: req.params.slug,
      currentUserId: userId
    }).then( result => {
      return res.json(result);
    });
  }));

  router.get('/tags', wrap((req, res) => {
    return getAllTags().then( result => {
      return res.json(result);
    });
  }));

  router.post('/articles/:slug/comments', requireUserMiddleware, wrap((req, res) => {
    const { comment } = req.body;
    const userId = path(['user', 'id'], req);
    return createComment({
      comment,
      slug: req.params.slug,
      currentUserId: userId
    }).then( result => {
      return res.json(result);
    });
  }));

  router.get('/articles/:slug/comments', wrap((req, res) => {
    return getComments({
      slug: req.params.slug
    }).then( result => {
      return res.json(result);
    });
  }));

  router.delete('/articles/:slug/comments/:commentId', requireUserMiddleware, wrap((req, res) => {
    return deleteComment(req.params).then( result => {
      return res.json(result);
    });
  }));

  router.post('/articles/:slug/favorite', requireUserMiddleware, wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return favoriteArticle({
      currentUserId: userId,
      slug: req.params.slug
    }).then( result => {
      return res.json(result);
    });
  }));

  router.delete('/articles/:slug/favorite', requireUserMiddleware, wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return unfavoriteArticle({
      currentUserId: userId,
      slug: req.params.slug
    }).then( result => {
      return res.json(result);
    });
  }));
};

module.exports = { articleController: { init } };
