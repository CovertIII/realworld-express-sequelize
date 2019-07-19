const Promise = require('bluebird');
global.Promise = Promise;

require('dotenv').config();

const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

const { errorMiddleware } = require('./middleware/error-middleware.js');
const { authenticateMiddleware } = require('./middleware/authenticate-middleware.js');
const { noCacheMiddleware } = require('./middleware/nocache-middleware.js');

const { initControllers } = require('./controllers/index.js');
const { init } = require('./models/associations.js');

const port = process.env.PORT;

const main = async () => {
  //Do the db associations
  init();

  app.use(cors());
  app.use(bodyParser.json());

  const publicPath = path.join(__dirname, 'public');
  console.log('public path:', publicPath);
  app.use(express.static(publicPath));


  // Router stuff here
  // Tell IE not to cache get responses so I can take away cache busting
  // in cljs
  router.use(noCacheMiddleware);

  router.use(authenticateMiddleware);
  initControllers(router);
  router.use(errorMiddleware);
  router.use((req, res) => {
    res.send(404, {message: 'Resource not found'});
  });

  app.use('/api', router);

  app.use((req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

  app.listen(port, () => {
    console.log('Express server listening on port ' + port);
  });
};

main();
