const R = require('ramda');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const jwt = Promise.promisifyAll(require('jsonwebtoken'));
const { Passport } = require('../models/passport.js');
const { User } = require('../models/user.js');
const { Follow } = require('../models/follow.js');

const signToken = user => {
  return jwt.sign({ user: user.toJSON() }, process.env.JWT_SECRET);
};

const createUser = async ({
  email,
  password,
  username,
  bio,
  image
} = {}) => {
  if(!password){
    throw new Error('Password required');
  }

  email = email.toLowerCase().trim();

  const user = await User.create({
    email,
    username,
    bio,
    image
  });

  const hash = await bcrypt.hashAsync(password, 12);

  await Passport.create({
    userId: user.id,
    value: hash,
    type: 'password'
  });


  const token = await signToken(user);
  const jsonUser = user.toJSON();
  jsonUser.token = token;

  return { user: jsonUser };
};


const loginUser = async ({email, password}) => {
  const user = await User.findOne({
    where: { email },
  });

  const genericErrorMessage = 'The email and password provided do not match';
  const genericErrorCode = 'INCORRECT_EMAIL_PASSWORD_COMBINATION';
  if(!user){
    const error = new Error(genericErrorMessage);
    error.code = genericErrorCode;
    error.status = 401;
    throw error;
  }

  const passport = await Passport.findOne({ where: {
    userId: user.id,
    type: 'password'
  }});

  if(!passport){
    const error = new Error(genericErrorMessage);
    error.code = genericErrorCode;
    error.status = 401;
    throw error;
  }

  const isValidPassword = await bcrypt.compareAsync(password, passport.value);

  if(!isValidPassword){
    const error = new Error(genericErrorMessage);
    error.code = genericErrorCode;
    error.status = 401;
    throw error;
  }

  const token = await signToken(user);

  const userj = user.toJSON();
  userj.token = token;

  return { user: userj };
};

const updateUser = ({id, body, token}) => {
  return Promise.resolve().then(async () => {
    if(!body.password){
      return;
    }
    //Update password if there is one in the body
    const hash = await bcrypt.hashAsync(body.password, 12);
    return Passport.update(
      { value: hash },
      { where: { userId: id, type: 'password' } }
    );
  }).then(() => {
    return User.update(body, { where: { id: String(id) }} );
  }).then( () => {
    return User.findOne({
      where: { id: String(id) }
    });
  }).then( user => {
    const jsonUser = user.toJSON();
    jsonUser.token = token;
    return { user: jsonUser};
  });
};

const getByUsername = ({username, currentUserId}) => {
  return User.findOne({
    where: { username: String(username) },
    include: [{
      model: User,
      as: 'followers',
      where: { id: currentUserId },
      required: false
    }]
  }).then( user => R.pipe(
    user => user.toJSON(),
    profile => R.assoc('following', profile.followers.length > 0, profile),
    R.omit(['followers']),
    profile => ({ profile })
  )(user));
};

const followUsername = ({username, currentUserId}) => {
  return getByUsername({username, currentUserId}).then( ({profile}) => {
    if(profile.following){
      return { profile };
    }
    return Follow.create({
      followerId: currentUserId,
      userId: profile.id
    }).then(() => {
      return getByUsername({username, currentUserId});
    });
  });
};

const unfollowUsername = ({username, currentUserId}) => {
  console.log({username, currentUserId});
  return getByUsername({username, currentUserId}).then( ({profile}) => {
    if(!profile.following){
      return { profile };
    }
    return Follow.destroy({
      where: {
        followerId: currentUserId,
        userId: profile.id}
    }).then(() => {
      return getByUsername({username, currentUserId});
    });
  });
};



module.exports = {
  createUser,
  loginUser,
  updateUser,
  getByUsername,
  followUsername,
  unfollowUsername
};


