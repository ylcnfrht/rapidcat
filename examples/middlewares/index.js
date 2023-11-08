const prevMiddleware = (req, res, next) => {
  console.log('This is a custom prevMiddleware');
  next();
};

const nextMiddleware = (req, res, next) => {
  console.log('This is a custom nextMiddleware');
  next();
};

module.exports = { prevMiddleware, nextMiddleware };