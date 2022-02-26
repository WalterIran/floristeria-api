const boom = require('@hapi/boom');
const { bill_order_status } = require('@prisma/client');
const prisma = require('../config/db');
const billModel = prisma.bill;
const billDetailModel = prisma.bill_detail;
const stripe = require('stripe')(process.env.SECRET_STRIPE_KEY);

//Function to register bill on database
const registerBill = async (req, res, next) => {
    try {
        const { userId , deliveryDate, taxAmount, destinationPersonName, destinationPersonPhone,
            destinationAddress, destinationAddressDetails, city, dedicationMsg } = req.body;

        const bill = await billModel.create({
            data:{
                userId,
                deliveryDate: new Date(deliveryDate),
                taxAmount,
                destinationPersonName,
                destinationPersonPhone,
                destinationAddress,
                destinationAddressDetails,
                city,
                dedicationMsg,
                orderStatus: bill_order_status.processing,
                createdAt: new Date(),
                updatedAt: new Date()
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

        const billDetail = await billDetailModel.upsert({
            where:{
                billId_productId:{
                    billId, productId
                }
            },
            update:{
                quantity:{increment:quantity}
            },
            create:{
                bill:{
                    connect:{billId:billId}
                },
                product:{
                    connect:{productId:productId}
                },
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