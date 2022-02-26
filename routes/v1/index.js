const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use('/users', require('./users/users.route'));
router.use('/auth', require('./auth/auth.route'));
router.use('/payment', require('./payment/payment.route'));
router.use('/orders',
    passport.authenticate('jwt', {session: false}),
    require('./orders/orders.route')
);
router.use('/search', require('./search/search.route'));
router.use('/products', require('./products/products.route'));

module.exports = router;