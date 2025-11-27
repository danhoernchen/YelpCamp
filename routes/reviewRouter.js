const { reviewJoi } = require("../joiSchemas");
const BagDispenser = require("../models/bagdispenser");
const Review = require("../models/Review");
const AsyncWrapper = require("../utils/AsyncWrapper");
const ExpressError = require("../utils/ExpressError");
const express = require("express");
const router = express.Router({ mergeParams: true });

const reviewValidataion = (req, res, next) => {
  const { error } = reviewJoi.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join("\n");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  reviewValidataion,
  AsyncWrapper(async (req, res) => {
    const dispenser = await BagDispenser.findById(req.params.id);
    const review = new Review(req.body.review);
    dispenser.reviews.push(review);
    await review.save();
    await dispenser.save();
    console.log(dispenser);
    res.redirect(`/dispensers/${req.params.id}`);
  })
);

router.delete(
  "/:review_id",
  AsyncWrapper(async (req, res) => {
    const { id, review_id } = req.params;
    await BagDispenser.updateOne({ _id: id }, { $pull: { review: review_id } });
    await Review.findByIdAndDelete(review_id);

    res.redirect(`/dispensers/${id}`);
  })
);

module.exports = router;
