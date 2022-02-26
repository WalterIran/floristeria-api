const boom = require('@hapi/boom');
const { bill_order_status } = require('@prisma/client');
const prisma = require('../config/db');
const billModel = prisma.bill;
const billDetailModel = prisma.bill_detail;
const cartModel = prisma.cart;
const cartDetailModel = prisma.cart_detail;
const stripe = require('stripe')(process.env.SECRET_STRIPE_KEY);

//Function to register bill on database
const registerBill = async (req, res, next) => {
    try {
        const { userId , deliveryDate, taxAmount, destinationPersonName, destinationPersonPhone,
            destinationAddress, destinationAddressDetails, city, dedicationMsg, cartId } = req.body;

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
                orderStatus: bill_order_status.received,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })
        if(!bill){
            throw boom.notFound()
        }
        else{
            //Delete actives cart
            const cart = await cartModel.updateMany({
                where:{
                    AND:[
                        {
                            status:'active',
                            user_id: userId
                        }
                    ]
                },
                data:{
                    status: 'canceled'
                }
            })

            //Add bill detail
            const cartDetail = await cartDetailModel.findMany({
                where:{
                    cart_id: cartId
                }
            })

            const data = cartDetail.map(detail => {
                delete detail.cart_id;
                detail.billId = bill.billId;
                return detail
            })

            const billDetail = await billDetailModel.createMany({
                data
            })

            res.send("Factura procesada con exito");
        }
    } catch (error) {
        next(error);
    }
}

//do payment with Stripe
const doPayment = async (req, res, next) => {
    try{
      const customer = await stripe.customers.create({
        email: req.body.emailUser,
        source: req.body.tokenId
      })
      const result = await stripe.charges.create({
          amount: req.body.amount, // Unit: cents
          currency: 'usd',
          customer: customer.id,
          source: customer.default_source.id,
          description: req.body.description,
        })
        res.status(200).json(result);
    }
    catch(error){
      console.error(error);
      next(error);
    }
  }

module.exports = {registerBill, doPayment};