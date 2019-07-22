const { path } = require('ramda');
const { wrap } = require('../middleware/error-middleware.js');
const { requireUserMiddleware } = require('../middleware/authenticate-middleware.js');
const {
  createUser,
  loginUser,
  updateUser,
  getByUsername,
  followUsername,
  unfollowUsername
} = require('../services/userService.js');

const init = async router => {
  router.post('/users', wrap((req, res) => {
    const { user } = req.body;
    return createUser(user).then( user => {
      return res.json(user);
    });
  }));


  router.post('/users/login', wrap((req, res) => {
    const { user: { email, password } } = req.body;
    return loginUser({email, password}).then( result => {
      res.json(result);
    });
  }));

  router.get('/user', requireUserMiddleware, (req, res) => {
    res.json({user: req.user});
  });

  router.put('/user', requireUserMiddleware, wrap((req, res) => {
    const token = req.user.token;
    const id = req.user.id;
    return updateUser({
      id,
      token,
      body: req.body.user
    }).then( result => {
      return res.json(result);
    });
  }));

  router.get('/profiles/:username', wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return getByUsername({
      currentUserId: userId,
      username: req.params.username
    }).then( result =>
      res.json(result)
    );
  }));

  router.post('/profiles/:username/follow', requireUserMiddleware, wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return followUsername({
      currentUserId: userId,
      username: req.params.username
    }).then( result =>
      res.json(result)
    );
  }));

  router.delete('/profiles/:username/follow', requireUserMiddleware, wrap((req, res) => {
    const userId = path(['user', 'id'], req);
    return unfollowUsername({
      currentUserId: userId,
      username: req.params.username
    }).then( result =>
      res.json(result)
    );
  }));
};

module.exports = { userController: { init } };
