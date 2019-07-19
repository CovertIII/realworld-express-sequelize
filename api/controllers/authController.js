const { wrap } = require('../middleware/error-middleware.js');
const {
  createResetToken,
  verifyEmailByToken,
  loginUser,
  queueEmailVerification,
  resetPassword
} = require('../services/authService.js');

const init = async router => {

};

module.exports = { loginController: { init } };
