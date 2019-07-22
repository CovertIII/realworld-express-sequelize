const { wrap } = require('../middleware/error-middleware.js');
const { schemaValidationMiddleware } = require('../middleware/schemaValidationMiddleware.js');
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
const { articleSchema } = require('../schemas/articleSchema.js');
const { commentSchema } = require('../schemas/commentSchema.js');
const { path } = require('ramda');

const init = async router => {
  router.post(
    '/articles',
    requireUserMiddleware,
    schemaValidationMiddleware(articleSchema),
    wrap((req, res) => {
      const { article } = req.body;
      const userId = req.user.id;
      return createArticle({article, userId}).then( result => {
        return res.json(result);
      });
    })
  );

  router.get('/articles', wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return getArticlesList({
      currentUserId: userId,
      username: req.query.author,
      tag: req.query.tag,
      favorited: req.query.favorited,
      offset: req.query.offset,
      limit: req.query.limit,
      orderBy: 'createdAt',
      orderDirection: 'DESC'
    }).then( result => {
      return res.json(result);
    });
  }));

  router.get('/articles/feed', requireUserMiddleware, wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return getFeed({
      currentUserId: userId,
      offset: req.query.offset,
      limit: req.query.limit
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

  router.put(
    '/articles/:slug',
    requireUserMiddleware,
    schemaValidationMiddleware(articleSchema),
    wrap((req, res) => {
      const userId = path(['user', 'id'], req);
      return updateArticle({
        body: req.body.article,
        slug: req.params.slug,
        currentUserId: userId
      }).then( result => {
        return res.json(result);
      });
    })
  );

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

  router.post(
    '/articles/:slug/comments',
    requireUserMiddleware,
    schemaValidationMiddleware(commentSchema),
    wrap((req, res) => {
      const { comment } = req.body;
      const userId = path(['user', 'id'], req);
      return createComment({
        comment,
        slug: req.params.slug,
        currentUserId: userId
      }).then( result => {
        return res.json(result);
      });
    })
  );

  router.get('/articles/:slug/comments', wrap((req, res) => {
    return getComments({
      slug: req.params.slug
    }).then( result => {
      return res.json(result);
    });
  }));

  router.delete('/articles/:slug/comments/:commentId', requireUserMiddleware, wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return deleteComment({
      commentId: req.params.commentId,
      currentUserId: userId
    }).then( result => {
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
