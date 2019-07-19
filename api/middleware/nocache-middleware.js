const noCacheMiddleware = (req, res, next) => {
  res.set('Cache-control','no-cache');
  res.set('Cache-control','no-store');
  res.set('Pragma','no-cache');
  res.set('Expires','0');
  next();
};

module.exports = {
  noCacheMiddleware
};
