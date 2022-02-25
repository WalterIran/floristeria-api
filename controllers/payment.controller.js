const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const prisma = require('../config/db');
const billModel = prisma.bill;

//Function to register bill on database
const registerBill = async (req, res, next) => {
    try {
        const { userId , deliveryDate, taxAmount, destinationPersonName, destinationPersonPhone,
        destinationAddress, destinationAddressDetails, city, dedicationMsg } = req.body;

        await billModel.create({
            user_id: userId,
            delivery_date: deliveryDate,
            tax_amount: taxAmount,
            destination_person_name: destinationPersonName,
            destination_person_phone: destinationPersonPhone,
            destination_address: destinationAddress,
            destination_address_details: destinationAddressDetails,
            city: city,
            dedication_msg: dedicationMsg,
            order_status: 'received',
            created_at: new Date(),
            updated_at: new Date(),
        })
        .then((data) => {
            console.log(data);
            res.send("Compra procesada con exito");
        })
        .catch((error) => {
            console.log(error);
            res.send("Error al procesar la compra");
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {registerBill};