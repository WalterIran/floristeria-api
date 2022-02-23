const router = require('express').Router();

//Stripe
const stripe = require('stripe')(process.env.SECRET_STRIPE_KEY);

router.post('/doPayment/', (req, res) => {
  return stripe.charges
    .create({
      amount: req.body.amount, // Unit: cents
      currency: 'usd',
      source: req.body.tokenId,
      description: 'Test payment',
    })
    .then(result => res.status(200).json(result));
});

module.exports = router;