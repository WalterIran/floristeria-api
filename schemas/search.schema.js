const Joi = require('joi');

//Joi types
const search = Joi.string().max(255);

//Schemas
const searchSchema = Joi.object({
    search: search.required(),
});

module.exports = { searchSchema };