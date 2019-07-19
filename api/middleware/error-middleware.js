const R = require('ramda');
const url = require('url');

const wrap = fn => (...args) => fn(...args).catch(args[2]);


//Need the next here
const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;

  res.status(status);
  res.json(R.merge({
    status,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  }, R.pick([
    'message',
    'code',
    'data',
    'name',
    'type'
  ], err)
  ));
};

module.exports = {
  wrap,
  errorMiddleware
};
