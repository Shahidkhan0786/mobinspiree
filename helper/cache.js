const mongoose = require("mongoose");
const util = require("util");
const exec = mongoose.Query.prototype.exec;
const asyncSet = util.promisify(global.redisClient.set);
mongoose.Query.prototype.exec = async function () {
  console.log("i am about to run a query", this.getQuery());
  //   console.log(this.mongooseCollection.name);
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collation: this.mongooseCollection.name,
    })
  );

  //   see if we have value for key in redis
  const cachedData = await global.redisClient.get(key);

  // if we do return that
  if (cachedData) {
    console.log(cachedData);
  }
  // otherwise issue the query and return the result

  console.log(key);
  const result = await exec.apply(this, arguments);
  console.log(result);
  //   return exec.apply(this, arguments);
};
