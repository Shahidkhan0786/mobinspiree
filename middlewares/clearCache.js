const { clearHash } = require("../helper/cache");

module.exports = async (req, res, next) => {
  await next();
  clearHash(req.user._id);
};
