require("dotenv").config();

const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const morgan = require("morgan");
const path = require("path");
const moment = require("moment");
moment.locale("id");

const main = require("./src/router/index.routes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(xss());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/v1", main);

app.use("/ava", express.static(path.join(__dirname, "/upload")));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

server.listen(PORT, () => {
  console.log(`my life running on port ${PORT}`);
});
