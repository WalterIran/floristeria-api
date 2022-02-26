const Joi = require('joi');

const billId = Joi.number().integer();
const productId = Joi.number().integer();
const deliveryDate = Joi.date();
const taxAmount = Joi.number();