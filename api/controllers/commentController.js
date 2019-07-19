const { restify } = require('../services/restify.js');
const { Location } = require('../models/location.js');

const init = async router => {
  restify({
    router,
    model: Location,
    parseGetOptions: ({req, defaultOptions}) => {
      if(req.user){
        return defaultOptions;
      }
      return {
        ...defaultOptions,
        attributes: {
          exclude: ['contactName', 'contactFaxNumber', 'contactPhoneNumber', 'contactEmail']
        }
      };
    }
  });
};

module.exports = { locationController: { init } };
