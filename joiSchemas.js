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
