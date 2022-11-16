const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const chatRoutes = require("./chat.routes");

router
.use("/user", userRoutes)
.use("/chat", chatRoutes);

module.exports = router;
