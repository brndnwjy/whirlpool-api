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

const chatModel = require("./src/model/chat.model");

const main = require("./src/router/index.routes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(xss());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/v1", main);
// app.use("/ava", express.static(path.join(__dirname, "/upload")));

app.all("*", (req, res, next) => {
  next(new createError.NotFound());
});

app.use((err, req, res, next) => {
  const msg = err.message || "Internal Server Error";
  const code = err.status || 500;

  res.status(code).json({
    message: msg,
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://whirlpool-chat.netlify.app/",
      "https://whirlpool-app.vercel.app/",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  jwt.verify(token, process.env.SECRET_KEY_JWT, (err, decoded) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        next(createError(400, "token is invalid"));
      } else if (err.name === "TokenExpiredError") {
        next(createError(400, "token is expired"));
      } else {
        next(createError(400, "error occured"));
      }
    }
    socket.userId = decoded.id;
    socket.join(decoded.id);
    next();
  });
});

io.on("connection", (socket) => {
  console.log(`device connected : ${socket.id} - ${socket.userId}`);

  // socket.on("message", (data) => {
  //   socket.emit("messageBE", { message: data, date: new Date() });
  // });

  socket.on("private-msg", (data, callback) => {
    // console.log(data);
    const newMessage = {
      receiver: data.receiver,
      message: data.msg,
      sender: socket.userId,
      date: moment(new Date()).format("LT"),
      // date: `${new Date().getHours()}:${new Date().getMinutes()}` ,
    };

    console.log(newMessage);

    callback(newMessage);

    chatModel.newChat(newMessage).then(() => {
      socket.broadcast
        .to(data.receiver)
        .emit("private-msg-BE", { ...newMessage, date: new Date() });
    });

    // io.to(data.receiver).emit("private-msg-BE", {
    //   sender: data.sender,
    //   message: data.msg,
    //   date: new Date().getHours() + ":" + new Date().getMinutes()
    // })
  });

  socket.on("disconnect", () => {
    console.log(`device disconnected : ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`my life running on port ${PORT}`);
});
