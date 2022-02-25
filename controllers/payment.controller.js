const boom = require('@hapi/boom');
const { bill_order_status } = require('@prisma/client');
const prisma = require('../config/db');
const billModel = prisma.bill;
const billDetailModel = prisma.bill_detail;
const stripe = require('stripe')(process.env.SECRET_STRIPE_KEY);

//Function to register bill on database
const registerBill = async (req, res, next) => {
    try {
        const { user_id , delivery_date, tax_amount, destination_person_name, destination_person_phone,
            destination_address, destination_address_details, city, dedication_msg } = req.body;

        const bill = await billModel.create({
            data:{
                user_id,
                delivery_date: new Date(delivery_date),
                tax_amount,
                destination_person_name,
                destination_person_phone,
                destination_address,
                destination_address_details,
                city,
                dedication_msg,
                order_status: bill_order_status.processing,
                created_at: new Date(),
                updated_at: new Date()
            }
        })
        if(!bill){
            throw boom.notFound()
        }
        else{
            res.send("Factura guardado");
        }
    } catch (error) {
        next(error);
    }
}

//Function to insert a product on bill_detail
const AddBilldetail = async (req, res, next) => {
    try{
        const { bill_id, product_id, quantity, price } = req.body;

        const billDetail = await billDetailModel.create({
            data:{
                bill_id,
                product_id,
                quantity,
                price
            }
        });
        if(!billDetail){
            throw boom.notFound();
        }
        else{
            res.send("El producto fue añadido con exito")
        }
    }
    catch(error){
        next(error);
    }
}

//do payment with Stripe
const doPayment = async (req, res, next) => {
    try{
      const customer = await stripe.customers.create({
        email: 'YOUR_EMAILtest@test.com',
        source: req.body.tokenId
      })
      const result = await stripe.charges.create({
          amount: req.body.amount, // Unit: cents
          currency: 'usd',
          customer: customer.id,
          source: customer.default_source.id,
          description: 'Test payment',
        })
        res.status(200).json(result);
    }
    catch(error){
      console.error(error);
      next(error);
    }
  }

module.exports = {registerBill, AddBilldetail, doPayment};