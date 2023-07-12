const mongoose = require("mongoose");
const app = require("./app");
const fs = require("fs");

const port = process.env.PORT || 8001;
const dbconnection = require("./config/database");

dbconnection();

const server = app.listen(port, () => {
  // console.log("ccc", process.env);
  console.log(`Server is running on port ${port}`);
});

// Handle UnhandleRejection

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection occured! Shutting down...");
  const content = `Unhandled rejection occured! Shutting down... ${err.name} error message: ${err.message}`;
  fs.writeFileSync("./Log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });
  server.close(() => {
    process.exit(1);
  });
});
