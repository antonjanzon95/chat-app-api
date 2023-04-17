var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const socketIo = require("socket.io");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const { log } = require("console");

var app = express();
const server = require("http").Server(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });

  socket.on("message", (message) => {
    io.emit("message", message);
  });
});

module.exports = { app: app, server: server };
