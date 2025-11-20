const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bagdispenserSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  location: String,
  image: String,
  reviews: {
    type: Schema.Types.ObjectId,
    ref: "Review",
  },
});

module.exports = mongoose.model("BagDispenser", bagdispenserSchema);
