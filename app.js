const express = require("express");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");
const CustomError = require("./errors/custom-error");
const userroute = require("./routes/User");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const globalErrorHandler = require("./errors/globalErrorHandler");
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/users", userroute);
app.all("*", async (req, res, next) => {
  //   throw new NotFoundError();
  const err = new CustomError("Not Found", 404);
  next(err);
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
