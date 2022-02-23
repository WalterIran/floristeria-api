const Joi = require('joi');

const id = Joi.number().positive();
const limit = Joi.number().valid(5,10,15);
const page = Joi.number().positive();

const requiredIdSchema = Joi.object({
    id: id.required()
});

const limitOffsetSchema = Joi.object({
    limit,
    page
});

module.exports = { requiredIdSchema, limitOffsetSchema };