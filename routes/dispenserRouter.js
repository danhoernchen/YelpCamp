const express = require("express");
const AsyncWrapper = require("../utils/AsyncWrapper");
const BagDispenser = require("../models/bagdispenser");
const ExpressError = require("../utils/ExpressError");
const { dispenserJoi } = require("../joiSchemas");

const router = express.Router();

const dispenserValidation = (req, res, next) => {
  const { error } = dispenserJoi.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join("\n");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  AsyncWrapper(async (req, res) => {
    const dispensers = await BagDispenser.find({});
    res.render("dispensers/index", { dispensers });
  })
);

router.post(
  "/new",
  dispenserValidation,
  AsyncWrapper(async (req, res, next) => {
    const dispenser = new BagDispenser(req.body.dispenser);
    await dispenser.save();
    req.flash("success", "Created a new dispenser!");
    res.redirect(`/dispensers/${dispenser._id}`);
  })
);

router.get("/new", (req, res) => {
  res.render("dispensers/new");
});

router.get(
  "/:id",
  AsyncWrapper(async (req, res) => {
    const dispenser = await BagDispenser.findById(req.params.id).populate(
      "reviews"
    );
    res.render("dispensers/dispenser", { dispenser });
  })
);

router.get(
  "/:id/edit",
  AsyncWrapper(async (req, res) => {
    const dispenser = await BagDispenser.findById(req.params.id);
    res.render("dispensers/edit", { dispenser });
  })
);

router.put(
  "/:id",
  dispenserValidation,
  AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const dispenser = await BagDispenser.findByIdAndUpdate(id, {
      ...req.body.dispenser,
    });
    res.redirect(`/dispensers/${id}`);
  })
);

router.delete(
  "/:id",
  AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    await BagDispenser.findByIdAndDelete(id);
    res.redirect("/dispensers");
  })
);

module.exports = router;
