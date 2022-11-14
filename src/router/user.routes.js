const express = require("express");
const router = express.Router();

const {
  register,
  getUser,
  login,
  getUserDetail,
  updateUser,
} = require("../controller/user.controller");
const avatarUpload = require("../middleware/multer.middleware");

router
  // auth
  .post("/register", register)
  .post("/login", login)

  // crud
  .get("/", getUser)
  .get("/:id", getUserDetail)
  .put("/:id", avatarUpload.single("avatar"), updateUser);
//   .delete("/", userController);

module.exports = router;
