const Joi = require('joi');

//Joi object validation types
const email = Joi.string().email().max(255);
const password = Joi.string().max(255);

//Schemas
//Schema to validate that client sends email and password
const authLoginSchema = Joi.object({
    email: email.required(),
    password: password.required()
});

//Schema to validate client sends email for recovery pin
const sendEmailSchema = Joi.object({
    email: email.required()
});

module.exports = { authLoginSchema, sendEmailSchema };