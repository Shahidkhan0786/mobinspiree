const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("node:crypto");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    validator: [validator.isAlpha, "Name must be alphabets only"],
    minlength: [3, "Name must be atleast 3 characters long"],
    maxlength: [20, "Name must be less than 20 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, "Email is invalid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    minlength: [8, "Password must be atleast 8 characters long"],
    maxlength: [20, "Password must be less than 20 characters long"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    trim: true,
    enum: ["user", "admin"],
    default: "user",
  },
  //we can set based on timestamp also
  emailVerifiedAt: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bycrypt.hash(this.password, 8);
});

UserSchema.methods.isValidatepassword = async function (password) {
  return await bycrypt.compare(password, this.password);
};

UserSchema.methods.getjwtToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: 172800000,
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
