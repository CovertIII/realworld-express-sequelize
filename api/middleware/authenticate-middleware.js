const jwt = Promise.promisifyAll(require('jsonwebtoken'));
const { User } = require('../models/user.js');

const getTokenFromAuthHeader = (header = '') => {
  return header.split(' ')[1];
};

const authenticateMiddleware = async (req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.headers['x-access-token'] ||
    getTokenFromAuthHeader(req.headers.Authorization) ||
    getTokenFromAuthHeader(req.headers.authorization) ||
    req.query.token;


  if(!token){
    return next();
  }

  try{
    const payload = await jwt.verifyAsync(token, process.env.JWT_SECRET);
    console.log('jwt token verified, getting user');
    const { user } = payload;
    const sqlUser = await User.findOne({
      where: {id: user.id},
    });
    req.user = sqlUser.toJSON();
    req.user.token = token;
    return next();
  } catch (e)  {
    const error = new Error('Invalid token');
    error.status = 401;
    return next(error);
  }
};

module.exports = {
  authenticateMiddleware
};
