const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const path = require("path");
const AsyncWrapper = require("./utils/AsyncWrapper");
const BagDispenser = require("./models/bagdispenser");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { dispenserJoi } = require("./joiSchemas.js");

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

const dispenserValidation = (req, res, next) => {
  const { error } = dispenserJoi.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join("\n");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

app.get(
  "/",
  AsyncWrapper(async (req, res) => {
    const dispensers = await BagDispenser.find({});
    res.render("dispensers/index", { dispensers });
  })
);

app.get(
  "/dispensers",
  AsyncWrapper(async (req, res) => {
    const dispensers = await BagDispenser.find({});
    res.render("dispensers/index", { dispensers });
  })
);

app.post(
  "/dispensers/new",
  dispenserValidation,
  AsyncWrapper(async (req, res, next) => {
    const dispenser = new BagDispenser(req.body.dispenser);
    await dispenser.save();
    res.redirect(`/dispensers/${dispenser._id}`);
  })
);

app.get("/dispensers/new", (req, res) => {
  res.render("dispensers/new");
});

app.get(
  "/dispensers/:id",
  AsyncWrapper(async (req, res) => {
    const dispenser = await BagDispenser.findById(req.params.id);
    res.render("dispensers/dispenser", { dispenser });
  })
);

app.get(
  "/dispensers/:id/edit",
  AsyncWrapper(async (req, res) => {
    const dispenser = await BagDispenser.findById(req.params.id);
    res.render("dispensers/edit", { dispenser });
  })
);

app.put(
  "/dispensers/:id",
  dispenserValidation,
  AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const dispenser = await BagDispenser.findByIdAndUpdate(id, {
      ...req.body.dispenser,
    });
    res.redirect(`/dispensers/${id}`);
  })
);

app.delete(
  "/dispensers/:id",
  AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    await BagDispenser.findByIdAndDelete(id);
    res.redirect("/dispensers");
  })
);

app.post(
  "/dispensers/:id/reviews",
  AsyncWrapper(async (req, res) => {
    res.send("Hello, Review!");
  })
);

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
