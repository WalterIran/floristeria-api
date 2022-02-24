const Joi = require('joi');

//Types
const id = Joi.number().positive();
const productName = Joi.string().max(100);
const status = Joi.string().valid('ACT','INA');
const price = Joi.number().positive().precision(2);
const updatedAt = Joi.date();

//Schemas
const productIdSchema = Joi.object({
    id: id.required()
});

const createProductSchema = Joi.object({
    productName: productName.required(),
});

const updateProductSchema = Joi.object({
    productName
});

module.exports = {productIdSchema};
