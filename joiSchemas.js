const Joi = require("joi");

module.exports.dispenserJoi = Joi.object({
  dispenser: Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string(),
    price: Joi.number(),
    description: Joi.string().required(),
  }),
});

module.exports.reviewJoi = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }),
});
