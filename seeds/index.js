const { default: mongoose } = require("mongoose");
const BagDispenser = require("../models/bagdispenser");
const cities = require("./cities");
var bacon = require("baconipsum");

mongoose.connect(
  "mongodb+srv://YelpCamp:sxZOafRDZghUq8va@dbhoernchen.tch1hhh.mongodb.net/?retryWrites=true&w=majority&appName=dbhoernchen"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongoose connection error"));
db.once("open", () => {
  console.log("MongoDB connected");
});

const seedDB = async () => {
  await BagDispenser.deleteMany();

  for (let i = 0; i < 50; i++) {
    const randomNum = Math.floor(Math.random() * 2058) + 1;
    const newDispenser = BagDispenser({
      name: `${cities[randomNum].name}`,
      location: `${cities[randomNum].district}`,
      image: `https://picsum.photos/400?random=${Math.random()}`,
      description: bacon(50),
    });
    await newDispenser.save();
  }
};

seedDB();
