const express = require('express');
const router = express.Router();
const passport = require('passport');
const { route } = require('./tags/tags.route');

router.use('/users', require('./users/users.route'));
router.use('/auth', require('./auth/auth.route'));
router.use('/payment', require('./payment/payment.route'));
router.use('/orders',
    passport.authenticate('jwt', {session: false}),
    require('./orders/orders.route')
);
router.use('/search', require('./search/search.route'));
router.use('/tags', require('./tags/tags.route'));
router.use('/products', require('./products/products.route'));
router.use('/shopping-cart', require('./shopping-cart/shopping-cart.route'));
module.exports = router;