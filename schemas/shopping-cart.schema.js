const Joi = require('joi');

const id = Joi.number().integer();
const price = Joi.number().integer();
const quantity = Joi.number().integer();

const productRequiredId = Joi.object({
    id: id.required()
});

const updateCartDetails = Joi.object({
    price: price.required(),
    quantity: quantity.required(),
});

const productCartId = Joi.object({
    cartid: id.required(),
    productid: id.required()
});
module.exports = {productRequiredId,updateCartDetails,productCartId};