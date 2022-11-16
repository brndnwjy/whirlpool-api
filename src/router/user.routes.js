const express = require("express");
const router = express.Router();

const {
  register,
  getUser,
  login,
  getUserDetail,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");
const jwtAuth = require("../middleware/auth.middleware");
const avatarUpload = require("../middleware/multer.middleware");

router
  // auth
  .post("/register", register)
  .post("/login", login)

  // crud
  .get("/", jwtAuth, getUser)
  .get("/:id", getUserDetail)
  .put("/:id", avatarUpload.single("avatar"), updateUser)
  .delete("/:id", deleteUser);

module.exports = router;
