const express = require('express');
const router = express.Router();

router.use('/users', require('./users/users.route'));
router.use('/auth', require('./auth/auth.route'));

module.exports = router;