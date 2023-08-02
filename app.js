const express = require("express");
const app = express();
var cors = require("cors");
const { createClient } = require("redis");
const mongoose = require("mongoose");
const client = createClient();

(async () => await client.connect())();
client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Redis Client connected"));
global.redisClient = client;

require("./helper/cache");
const CustomError = require("./errors/custom-error");
const userroute = require("./routes/User");
const blogroute = require("./routes/blog");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
require("dotenv").config();
const globalErrorHandler = require("./errors/globalErrorHandler");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/users", userroute);
app.use("/api/v1/blogs", blogroute);
app.all("*", async (req, res, next) => {
  //   throw new NotFoundError();
  const err = new CustomError("Not Found", 404);
  next(err);
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
