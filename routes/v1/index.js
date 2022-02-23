const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use('/users', require('./users/users.route'));
router.use('/auth', require('./auth/auth.route'));
router.use('/orders',
    passport.authenticate('jwt', {session: false}),
    require('./orders/orders.route')
);

module.exports = router;