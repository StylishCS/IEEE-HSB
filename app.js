var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var teamRouter = require("./routes/team");
var sloganRouter = require("./routes/slogan");
var videosRouter = require("./routes/videos");
var partnersRouter = require("./routes/partners");

require("dotenv").config();

//database setup
mongoose
  .connect(process.env.MONGODB_URL, {
    family: 4,
  })
  .then(() => console.log("Connected to MongoDB.."))
  .catch((err) => console.error("MongoDB Connection Failed.."));

var app = express();

app.use(
  cors({
    origin: ["https://ieeehsb.software"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/team", teamRouter);
app.use("/slogan", sloganRouter);
app.use("/videos", videosRouter);
app.use("/partners", partnersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
