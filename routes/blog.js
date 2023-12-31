const express = require("express");
const router = express.Router();
const { customRole, isLoggedin } = require("../middlewares/user");
const { list, save } = require("../controllers/blogController");
const clearCache = require("../middlewares/clearCache");
router.route("/list").get(isLoggedin, list);
router.route("/save").post(isLoggedin, clearCache, save);
// router.route("/verify").get(verifyEmail);
// router.route("/signin").post(signin);

// ////////////// ADMIN ROUTES ?/////////////////////////////

// router.route("/admin/list").get(isLoggedin, customRole("admin"), adminList);
module.exports = router;
