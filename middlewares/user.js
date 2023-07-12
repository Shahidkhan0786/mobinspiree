const User = require("../models/User");
const jwt = require("jsonwebtoken");
const CustomError = require("../errors/custom-error");

exports.isLoggedin = async (req, res, next) => {
  //   const token = req.cookies.token || req.headers["Authorization"].replace("Bearer ", "");
  const token =
    req.cookies?.token ||
    req.headers?.["Authorization"]?.replace("Bearer ", "");
  if (!token) {
    return next(new CustomError("You are not logged in", 401));
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode._id);
    if (!user) return next();
    req.user = user;
    next();
  } catch (err) {
    return next(err);
  }
};

exports.customRole = (...roles) => {
  // const user = req.user;
  // if(user.role === 'admin'){
  //     next();
  // }else{
  //     return next(new CustomError('You are not authorized', 401));
  // }
  // or other way

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError("You are not authorized", 401));
    }
    next();
  };
};
