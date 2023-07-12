const User = require("../models/User");
const { cookietoken } = require("../helper/helper");
const { sendmail } = require("../helper/mailhelper");
var jwt = require("jsonwebtoken");
const CustomError = require("../errors/custom-error");
const asyncErrorHandler = require("../errors/asyncErrorHandler");

//signup user
exports.signup = asyncErrorHandler(async (req, res, next) => {
  let result;
  const { name, email, password } = req.body;

  // or use any third party package like JOI
  if (!name || !email || !password) {
    return next(new CustomError(`name , email , password are required`, 400));
  }

  const user = await User.findOne({ email });
  if (user) {
    return next(new CustomError(`user already exists`, 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  const verificationToken = jwt.sign(
    { userId: newUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  const verificationLink = `http://localhost:8000/api/v1/users/verify?token=${verificationToken}`;
  try {
    // Generate email verification token
    await sendmail({
      subject: "Email Verification",
      text: `Please click the following link to verify your email: ${verificationLink}`,
      html: `<p>Please click the following link to verify your email: <a href="${verificationLink}">Click ME </a></p>`,
    }); //send mail
    res.status(200).json({
      success: true,
      data: { message: "Verifiy you email. Token sent to your email" },
    });
  } catch (err) {
    await User.deleteOne({ _id: newUser._id });
    console.log(err);
    return next(new CustomError(`Email could not be sent ${err.message}`, 500));
  }
});

// Verify email
exports.verifyEmail = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.query;

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Update user's emailVerified status
  await User.findByIdAndUpdate(decoded.userId, { emailVerifiedAt: true });

  res.status(200).json({
    success: true,
    message: "Email Verified Successfully please Login",
  }); // Redirect to login page or any other page you want
});

// sign in user
exports.signin = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  // or use any third party package like JOI
  if (!email || !password) {
    return next(new CustomError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(
      new CustomError("Please provide correct email and password", 404)
    );
  }

  // Check if the user is verified
  if (!user.emailVerifiedAt) {
    // return res.status(400).json({ message: "Email not verified" });
    return next(new CustomError("Email not verified", 400));
  }

  const isMatch = await user.isValidatepassword(password);
  if (!isMatch) {
    return next(
      new CustomError("Please provide correct email and password", 400)
    );
  }
  cookietoken(user, res);
});

//////////////////////  ADMIN ROUTES /////////////////////////////

exports.adminList = async (req, res) => {
  const { filter, search } = req.query;
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 3; // Number of records per page
  let query = {};

  // Apply filters
  if (filter === "verified") {
    query.emailVerifiedAt = true;
  } else if (filter === "unverified") {
    query.emailVerifiedAt = false;
  }

  // Apply search
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  // exclude loggedinuser
  query._id = { $ne: req.user._id };

  // Count total number of users matching the query
  const totalUsers = await User.countDocuments(query);

  // Calculate total number of pages
  const totalPages = Math.ceil(totalUsers / limit);

  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  console.log(query);

  // Fetch users based on filters and search
  const users = await User.find(query).skip(skip).limit(limit);

  // Prepare data for DataTables
  const dataTableResponse = {
    current_page: page, // Increment this value for subsequent requests
    recordsTotal: totalUsers, // Total number of records without filtering
    recordsFiltered: users.length, // Number of records after filtering
    totalPages: totalPages, // Total number of pages
    data: users, // User records
  };

  res.status(200).json({
    success: true,
    data: dataTableResponse,
  });
};
