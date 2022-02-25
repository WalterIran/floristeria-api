const express = require('express');
const router = express.Router();

router.use('/users', require('./users/users.route'));
router.use('/auth', require('./auth/auth.route'));
router.use('/products', require('./products/products.route'));
router.use('/shopping-cart', require('./shopping-cart/shopping-cart.route'));
module.exports = router;