const Joi = require('joi');

const billId = Joi.number().integer();
const userId = Joi.number().integer();
const productId = Joi.number().integer();
const deliveryDate = Joi.date();
const taxAmount = Joi.number();
const destinationPersonName = Joi.string();
const destinationPersonPhone = Joi.string().pattern(/^[0-9]+$/);
const destinationAddress = Joi.string().max(500);
const destinationAddressDetails = Joi.string().max(500);
const city = Joi.string().valid('TGU', 'SPS', 'DNL', 'LCE');
const dedicationMsg = Joi.string().max(1500);
const quantity = Joi.number();
const price = Joi.number();

const registerBillSchema = Joi.object({
    userId: userId.required(),
    deliveryDate: deliveryDate.required(),
    taxAmount: taxAmount.required(),
    destinationPersonName: destinationPersonName.required(),
    destinationPersonPhone: destinationPersonPhone.required(),
    destinationAddress: destinationAddress.required(),
    destinationAddressDetails: destinationAddressDetails.required(),
    dedicationMsg: dedicationMsg.required(),
    city: city.required(),
});

const registerBillDetailSchema = Joi.object({
    billId: billId.required(),
    productId: productId.required(),
    quantity: quantity.required(),
    price: price.required()
});

module.exports = {registerBillDetailSchema, registerBillSchema};