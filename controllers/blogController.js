const Blog = require("../models/Blog");
const CustomError = require("../errors/custom-error");
const asyncErrorHandler = require("../errors/asyncErrorHandler");
const util = require("util");
const { clearHash } = require("../helper/cache");
exports.list = asyncErrorHandler(async (req, res, next) => {
  // const cacheddat = await redisClient.get(`blog:${req.user._id}`);
  // // console.log("count", Blog.countDocuments().exec());
  // if (cacheddat) {
  //   return res.status(200).json({
  //     message: "ok cached response",
  //     success: true,
  //     data: JSON.parse(cacheddat),
  //   });
  // }
  const data = await Blog.find({ user: req.user._id }).cache({
    key: req.user._id,
  });
  return res.status(200).json({
    success: true,
    data,
  });
});

exports.save = asyncErrorHandler(async (req, res, next) => {
  const { title, content } = req.body;

  if (!title && !content) {
    return next(new CustomError("Please provide title or content", 400));
  }
  const blog = new Blog({ title, content, user: req.user._id });
  await blog.save();
  // clearHash(req.user._id);
  // await redisClient.set(`blog:${req.user._id}`, JSON.stringify(blog));
  // await redisClient.set("inblog", "xyz");
  // const redisKey = `blogs:${req.user._id}`;
  // const existingBlogs = await redisClient.get(redisKey);
  // if (existingBlogs) {
  //   // Append the new blog to the existing list of blogs for the user
  //   const blogId = blog._id.toString();
  //   const blogData = JSON.stringify(blog);
  //   await redisClient.hSet(redisKey, blogId, blogData);
  // } else {
  //   // If there are no existing blogs for the user, create a new hash and add the blog to it
  //   const blogId = blog._id.toString();
  //   const blogData = JSON.stringify(blog);
  //   const newData = { [blogId]: blogData };
  //   await redisClient.hSet(redisKey, newData);
  // }

  res.status(200).json({
    success: true,
    data: blog,
  });
});
