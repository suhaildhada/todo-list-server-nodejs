function asyncMiddleware(fn) {
  return (req, res, next) => {
    const callNext = (...args) => {
      if (!res.headersSent) {
        next(...args);
      }
    };
    Promise.resolve(fn(req, res)).then(callNext).catch(callNext);
  };
}

module.exports = {
  asyncMiddleware,
};
