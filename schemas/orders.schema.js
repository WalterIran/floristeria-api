const Joi = require('joi');

const id = Joi.number().positive();
const limit = Joi.number().valid(5,10,15);
const page = Joi.number().positive();
const status = Joi.string();
const employeeId = Joi.number().positive();

const requiredIdSchema = Joi.object({
    id: id.required()
});

const limitOffsetSchema = Joi.object({
    limit,
    page
});

const requiredStatus = Joi.object({
    status: status.required(),
    employeeId: employeeId.required()
});

module.exports = { requiredIdSchema, limitOffsetSchema, requiredStatus };