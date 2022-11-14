const express = require("express");
const router = express.Router();

const { register, getUser, login } = require("../controller/user.controller");

router
  // auth
  .post("/register", register)
  .post("/login", login)

  // crud
  .get("/", getUser);
//   .put("/", userController)
//   .delete("/", userController);

module.exports = router;
