const asyncMiddleware = (cb) => async (req, res, next) => {
  return Promise.resolve(cb(req, res, next)).catch(next);
};

module.exports = asyncMiddleware;
