const { INTERNAL_SERVER_ERROR } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
  if (err.response) {
    const { status, statusText, data } = err.response;
    console.log('status', status);
    console.log('data', data);
    console.log('statusText', statusText);

    res.status(status).send(data);
  }

  if (err) {
    res.status(INTERNAL_SERVER_ERROR).send('Something gone wrong');
    console.log(err, req.originalUrl, req.method);
  }

  next();
};

module.exports = errorHandler;
