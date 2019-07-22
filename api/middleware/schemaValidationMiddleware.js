const Ajv = require('ajv');
const R = require('ramda');

const schemaValidationMiddleware = schema => (req, res, next) => {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);
  if(!valid){
    const errors = ajv.errors.map(R.prop('message')).join(', ');
    const error = new Error(errors);
    error.data = ajv.errors;
    error.status = 400;
    return next(error);
  }
  next();
};


module.exports = {
  schemaValidationMiddleware
};
