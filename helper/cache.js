const mongoose = require("mongoose");

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {
  console.log("i am about to run a query", this.getQuery());
  //   console.log(this.mongooseCollection.name);
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collation: this.mongooseCollection.name,
    })
  );

  console.log(key);
  return exec.apply(this, arguments);
};
