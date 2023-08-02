const mongoose = require("mongoose");

const validator = require("validator");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    validator: [validator.isAlpha, "Name must be alphabets only"],
    minlength: [3, "Name must be atleast 3 characters long"],
    maxlength: [250, "Name must be less than 20 characters long"],
  },
  content: {
    type: String,
    required: [true, "content is required"],
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  //we can set based on timestamp also

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
