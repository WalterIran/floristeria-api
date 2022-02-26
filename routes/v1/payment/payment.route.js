const router = require('express').Router();
const passport = require('passport');

//Controllers
const paymentController = require('../../../controllers/payment.controller');

//Validation
const validatorHandler = require('../../../middlewares/validator.handler');

//Schema
const {registerBillDetailSchema, registerBillSchema} = require('../../../schemas/payment.schema');

router.post('/doPayment/',
    //passport.authenticate('jwt', {session: false}),
    paymentController.doPayment
);
router.post('/registerbill/', 
    //passport.authenticate('jwt', {session: false}),
    validatorHandler(registerBillSchema, 'body'),
    paymentController.registerBill
);

module.exports = router;