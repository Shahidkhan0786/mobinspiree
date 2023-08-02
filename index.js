const mongoose = require("mongoose");

const fs = require("fs");

const dbconnection = require("./config/database");

// Handle uncaught Exceptions occur in our app
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception occured! Shutting down...");
  const content = `uncaught Exception occured! Shutting down... ${err.name} error message: ${err.message}`;
  fs.writeFileSync(
    "./Log/uncaughterror-log.txt",
    content,
    { flag: "a" },
    (err) => {
      console.log(err.message);
    }
  );
  process.exit(1);
});

const app = require("./app");
const port = process.env.PORT;

dbconnection();

const server = app.listen(port, () => {
  // console.log("ccc", process.env);
  console.clear();
  console.log(`Server is running on port ${port}`);
});

// Handle UnhandleRejection Occurs in our app

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
