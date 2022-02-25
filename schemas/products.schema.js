const Joi = require('joi');

const id = Joi.number().integer();
const price = Joi.number().integer();
const name = Joi.string().max(250);

const productRequiredId = Joi.object({
    id: id.required(),
    name: name.required()
});

//schema to validate product price
const changePrice = Joi.object({
    productid: id.required(),
    priceid: price.required()
});

module.exports = {productRequiredId,changePrice};