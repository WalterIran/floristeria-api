const Joi = require('joi');

//Types
const id = Joi.number().positive();
const productName = Joi.string().max(100);
const productDescriptionTitle = Joi.string().max(255);
const productDescription = Joi.string().max(800);
const price = Joi.number().positive().precision(2);
const status = Joi.string().valid('ACT','INA');
const discount = Joi.number().positive().precision(2);
const discountExpirationDate = Joi.date();
const createdAt = Joi.date();
const updatedAt = Joi.date();
const totalRating = Joi.number().positive().precision(2);

//Schemas
const productIdSchema = Joi.object({
    id: id.required()
});

const createProductSchema = Joi.object({
    productName: productName.required(),
    productDescription: productDescription.required(),
    productDescriptionTitle: productDescriptionTitle.required(),
    price,
    status,
    discount,
    discountExpirationDate,
    totalRating,
    createdAt,
    updatedAt
});

const productDeleteSchema = Joi.object({
    id: id.required()
});

const updateProductSchema = Joi.object({
    productName,
    productDescriptionTitle,
    productDescription,
    price,
    discount,
    totalRating
});

module.exports = {productIdSchema, productDeleteSchema, createProductSchema, updateProductSchema};
