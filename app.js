const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');

require('./config/passport.config');
const indexRouter = require('./routes/');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);

//Stripe
const stripe = require('stripe')(sk_test_51KVrGzHmBgFV5HJBCpbla1Pqkixq7VcJX9JhTdLm9arSKj8FIk7nLZ13VTJYmghIZuGomQS5ZG0GhYptK9kIzzjy006CzgglKC);

app.post('/api/doPayment/', (req, res) => {
  return stripe.charges
    .create({
      amount: req.body.amount, // Unit: cents
      currency: 'usd',
      source: req.body.tokenId,
      description: 'Test payment',
    })
    .then(result => res.status(200).json(result));
});

//Error handling middlewares
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

module.exports = app;
