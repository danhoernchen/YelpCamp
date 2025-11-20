const { string } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: string,
  rating: Number,
});

module.exports = mongoose.model("Review", reviewSchema);
