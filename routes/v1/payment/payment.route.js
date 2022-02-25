const router = require('express').Router();

//Controllers
const paymentController = require('../../../controllers/payment.controller');

//Stripe
const stripe = require('stripe')(process.env.SECRET_STRIPE_KEY);

router.post('/doPayment/', async (req, res, next) => {
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
});

router.post('/registerbill/', paymentController.registerBill);

module.exports = router;