const mongoose = require("mongoose");
const util = require("util");
const exec = mongoose.Query.prototype.exec;
// const clientset = util.promisify(global.redisClient.set);

mongoose.Query.prototype.cache = function () {
  this.UseCache = true;
  return this;
};
mongoose.Query.prototype.exec = async function () {
  if (!this.UseCache) {
    return exec.apply(this, arguments);
  }
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
    // console.log(cachedData);
    console.log("cached data");
    const doc = JSON.parse(cachedData);

    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }
  // otherwise issue the query and return the result and also store in redis

  // console.log(key);
  const result = await exec.apply(this, arguments);
  //   console.log(result);
  //   return exec.apply(this, arguments);
  await redisClient.set(key, JSON.stringify(result));
  return result;
};
