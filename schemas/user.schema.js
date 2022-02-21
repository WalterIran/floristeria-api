const Joi = require('joi');

//Joi object validation types
const id = Joi.number().integer();
const personId = Joi.string().length(13);
const birthDate = Joi.date().less('now');
const userName = Joi.string().max(45);
const userLastname = Joi.string().max(45);
const phoneNumber = Joi.string().length(8).pattern(/^[0-9]+$/);
const address = Joi.string().max(500);
const email = Joi.string().email().max(255);
const password = Joi.string().max(255);
const repeatPassword = Joi.string().valid(Joi.ref('password'));
const refreshToken = Joi.string().max(500);
const userRole = Joi.string().valid('customer','employee', 'admin');
const userStatus = Joi.string().valid('ACT', 'INA');
const createdAt = Joi.date();
const updatedAt = Joi.date();

//Schemas
//Schema to validate that client sends id that is required
const userRequiredId = Joi.object({
    id: id.required()
});

//Schema to validate that client sends fields listed that are required
const registerCustomerSchema = Joi.object({
    userName: userName.required(),
    userLastname: userLastname.required(),
    email: email.required(),
    password: password.required(),
    repeatPassword: repeatPassword.required()
});

//Schema to validate that client sends fields listed that are not required
const updateCustomerInfoSchema = Joi.object({
    personId,
    userName,
    userLastname,
    birthDate,
    phoneNumber,
    address
});

module.exports = { userRequiredId, registerCustomerSchema, updateCustomerInfoSchema };
