const Joi = require('joi');

//Joi object validation types
const email = Joi.string().email().max(255);
const password = Joi.string().max(255);

//Joi recovery Pin validation types
const recoveryPin = Joi.string().length(6).pattern(/^[0-9]+$/);
const repeatPassword = Joi.string().valid(Joi.ref('password'));

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

//Schema to validate change password
const changePasswordSchema = Joi.object({
    email: email.required(),
    recoveryPin: recoveryPin.required(),
    password: password.required(),
    repeatPassword: repeatPassword.required()
});

module.exports = { authLoginSchema, sendEmailSchema, changePasswordSchema };