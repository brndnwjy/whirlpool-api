const express = require("express");
const { getChat } = require("../controller/chat.controller");
const jwtAuth = require("../middleware/auth.middleware");
const router = express.Router();

router
.get("/:id", jwtAuth, getChat)

module.exports = router;
