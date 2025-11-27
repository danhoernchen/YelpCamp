const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const flash = require("connect-flash");

const ejsMate = require("ejs-mate");
const dispenserRouter = require("./routes/dispenserRouter.js");
const reviewRouter = require("./routes/reviewRouter.js");
const session = require("express-session");

mongoose.connect(
  "mongodb+srv://YelpCamp:sxZOafRDZghUq8va@dbhoernchen.tch1hhh.mongodb.net/?retryWrites=true&w=majority&appName=dbhoernchen"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongoose connection error"));
db.once("open", () => {
  console.log("MongoDB connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "makemesecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(flash());
//flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});

app.use("/dispensers", dispenserRouter);
app.use("/dispensers/:id/reviews", reviewRouter);
app.get("/", (req, res) => {
  res.redirect("/dispensers");
});

app.get("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Ruh Roh, something went awry.";
  res.status(statusCode).render("error", { err });
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
