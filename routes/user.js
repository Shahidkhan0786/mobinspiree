const express = require("express");
const router = express.Router();
const { customRole, isLoggedin } = require("../middlewares/user");
const {
  signup,
  signin,
  verifyEmail,
  adminList,
} = require("../controllers/userController.js");

router.route("/signup").post(signup);
router.route("/verify").get(verifyEmail);
router.route("/signin").post(signin);

////////////// ADMIN ROUTES ?/////////////////////////////

router.route("/admin/list").get(isLoggedin, customRole("admin"), adminList);
module.exports = router;
