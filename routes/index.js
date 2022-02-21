const express = require('express');
const router = express.Router();

/* GET home page. */
router.use('/v1', require('./v1'));

module.exports = router;
