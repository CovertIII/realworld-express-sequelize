const { userController } = require('./userController.js');
const { articleController } = require('./articleController.js');

const init = async router => {
  userController.init(router);
  articleController.init(router);
};

module.exports = { initControllers: init };
